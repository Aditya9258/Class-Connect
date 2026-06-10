import { useState, useEffect } from 'react';
import {
  Users,
  Settings,
  BookOpen,
  LogOut,
  Bell,
  Search,
  MoreVertical,
  CheckCircle2,
  LayoutDashboard,
  ArrowLeft,
  Save,
  Trash2,
  Plus,
  Megaphone,
  X,
  Calendar,
  ClipboardCheck,
  TrendingUp,
  Activity,
  FileCheck,
  CalendarClock,
  School,
  Clock,
  UserX
} from 'lucide-react';

import { useAuth } from '../AuthContext';
import api, { API_BASE_URL } from '../services/api';

export default function EducatorDashboard() {
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('educatorDashboardTab') || 'dashboard');
  const [isLoaded, setIsLoaded] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem('educatorDashboardTab', activeTab);
  }, [activeTab]);

  const { user, logout } = useAuth();
  const [currentEducator, setCurrentEducator] = useState<any>(null);

  // States for modals and notifications
  const [showAddModal, setShowAddModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isSubmittingLeave, setIsSubmittingLeave] = useState(false);
  const [showLeaveSuccess, setShowLeaveSuccess] = useState(false);

  // Announcements State
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [showAnnouncementPopup, setShowAnnouncementPopup] = useState(false);
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);

  const [isEducatorDrawerOpen, setIsEducatorDrawerOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // New Backend States
  const [assignments, setAssignments] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [permanentClasses, setPermanentClasses] = useState<any[]>([]);
  const [temporaryClasses] = useState<any[]>([]);

  // Form States
  const [leaveForm, setLeaveForm] = useState({ startDate: '', endDate: '', reason: '', isSickLeave: false, file: null as File | null });
  const [assignmentForm, setAssignmentForm] = useState({ title: '', description: '', class: '', section: '', subject: '', dueDate: '', file: null as File | null });

  const fetchBackendData = async () => {
    try {
      const [{ data: assignData }, { data: leaveData }, { data: dashData }] = await Promise.all([
        api.get('/educator/assignments').catch(() => ({ data: { data: { assignments: [] } } })),
        api.get('/educator/leaves').catch(() => ({ data: { data: { leaves: [] } } })),
        api.get('/admin/dashboard').catch(() => ({ data: { data: { classes: [], announcements: [], students: [], educators: [] } } }))
      ]);

      setAssignments(assignData.data?.assignments || []);
      setLeaves(leaveData.data?.leaves || []);

      const allStudents = dashData.data.students || [];
      const allEducators = dashData.data.educators || [];
      const eduMatch = allEducators.find((e: any) => e.user?._id === user?._id || e.email === user?.email);
      setCurrentEducator(eduMatch);

      // Extract assignments mapping to courses for filtering
      const allowedCourses = eduMatch?.assignments?.map((a: any) => `Class ${a.class}-${a.section}`) || [];
      const myStudents = allStudents.filter((s: any) => allowedCourses.includes(s.course));
      setStudents(myStudents);

      setPermanentClasses(eduMatch?.assignments || []);

      // Load announcements
      const allAnnouncements = dashData.data.announcements || [];
      const visibleToEducators = allAnnouncements.filter((ann: any) => ann.visibility === 'All' || ann.visibility === 'Educators');

      const dismissedIds = JSON.parse(localStorage.getItem('dismissed_announcements_educator') || '[]');
      const newAnnouncements = visibleToEducators.filter((ann: any) => !dismissedIds.includes(ann.id));

      if (newAnnouncements.length > 0) {
        setAnnouncements(newAnnouncements);
        setShowAnnouncementPopup(true);
      }

      setIsLoaded(true);
    } catch (error) {
      console.error('Failed to fetch backend data', error);
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    fetchBackendData();
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  const handleSaveStudent = (updatedStudent: any) => {
    setStudents(students.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleCreateStudent = (newStudent: any) => {
    // Note: Students are no longer directly assigned an educator ID.
    // They are grouped by their course (Class/Section).

    // Update local state
    setStudents([...students, newStudent]);

    // Update global state
    const storedStudents = localStorage.getItem('global_students');
    if (storedStudents) {
      const allStudents = JSON.parse(storedStudents);
      localStorage.setItem('global_students', JSON.stringify([...allStudents, newStudent]));
    }

    setShowAddModal(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  return (
    <div className="min-h-screen bg-[var(--cream)] font-sans relative pb-20">

      {/* Sign Out Modal */}
      {showSignOutModal && (
        <div className="fixed inset-0 bg-[#1B1F3B]/40 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-300 relative">
            <button
              onClick={() => setShowSignOutModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-[#1B1F3B] transition-colors"
            >
              <X size={24} />
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                <LogOut size={32} />
              </div>
              <h3 className="text-2xl font-bold text-[#1B1F3B] mb-2">Sign Out</h3>
              <p className="text-gray-500 mb-8">Are you sure you want to log out of your educator account? You will need to log in again to access your dashboard.</p>

              <div className="flex gap-4 w-full">
                <button
                  onClick={() => setShowSignOutModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                >
                  Yes, Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && currentEducator && (
        <div className="fixed inset-0 bg-[#1B1F3B]/40 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 relative border border-black/5">
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/10 flex items-center justify-center text-white hover:bg-black/20 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="relative h-32 bg-gradient-to-r from-[#1B1F3B] to-[#2a305a]">
              {/* Optional: Add a subtle pattern overlay here */}
            </div>

            <div className="px-8 pb-8 pt-0 relative">
              <div className="absolute -top-16 left-8 w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
                <img src={currentEducator.photo || "/images/team-1.jpg"} alt={currentEducator.name} className="w-full h-full object-cover" />
              </div>

              <div className="mt-20">
                <h2 className="text-2xl font-bold text-[#1B1F3B] font-serif">{currentEducator.name}</h2>
                <p className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider mt-1">{currentEducator.title}</p>

                <div className="w-12 h-0.5 bg-[#4A85D4] my-4 rounded-full opacity-80"></div>

                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {currentEducator.bio || "An experienced educator dedicated to guiding students toward academic excellence and personal growth."}
                </p>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-1">
                    <BookOpen size={14} /> Assigned Classes
                  </h4>
                  {currentEducator.assignments && currentEducator.assignments.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {currentEducator.assignments.map((assign: any, i: number) => (
                        <span key={i} className="px-3 py-1 bg-white border border-gray-200 text-xs font-bold text-[#1B1F3B] rounded-full shadow-sm">
                          {assign.class}-{assign.section} ({assign.subject})
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No classes assigned yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 right-6 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-[150] animate-in slide-in-from-top-5">
          <CheckCircle2 size={20} />
          <span className="font-semibold">Action completed successfully!</span>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <RegistrationWizard
          onClose={() => setShowAddModal(false)}
          onComplete={handleCreateStudent}
        />
      )}

      {/* Leave Submission Loader Modal */}
      {isSubmittingLeave && (
        <div className="fixed inset-0 bg-[#1B1F3B]/40 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center animate-in zoom-in-95 duration-300">
            <svg className="animate-spin h-12 w-12 text-[#D4AF37] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <h3 className="text-lg font-bold text-[#1B1F3B]">Uploading your Request to Administration</h3>
            <p className="text-sm text-gray-500 mt-2">Please wait...</p>
          </div>
        </div>
      )}

      {/* Leave Success Modal */}
      {showLeaveSuccess && (
        <div className="fixed inset-0 bg-[#1B1F3B]/40 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-2xl font-bold text-[#1B1F3B] mb-2">Request Successful</h3>
            <p className="text-gray-600 mb-6 text-sm">Your request is submitted successfully. You can check the status of your requests on this tab for further updates.</p>
            <button
              onClick={() => setShowLeaveSuccess(false)}
              className="w-full bg-[#1B1F3B] text-white py-3 rounded-xl hover:bg-[#D4AF37] hover:text-[#1B1F3B] transition-colors font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Announcements Popup */}
      {showAnnouncementPopup && announcements.length > 0 && (
        <div className="fixed inset-0 bg-[#1B1F3B]/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-300 relative border-l-4 border-[#D4AF37]">
            <button
              onClick={() => {
                const dismissedIds = JSON.parse(localStorage.getItem('dismissed_announcements_educator') || '[]');
                dismissedIds.push(announcements[currentAnnouncementIndex].id);
                localStorage.setItem('dismissed_announcements_educator', JSON.stringify(dismissedIds));

                if (currentAnnouncementIndex < announcements.length - 1) {
                  setCurrentAnnouncementIndex(prev => prev + 1);
                } else {
                  setShowAnnouncementPopup(false);
                }
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-[#1B1F3B] transition-colors"
            >
              <X size={24} />
            </button>
            <div className="flex items-center gap-3 mb-4 text-[#D4AF37]">
              <Megaphone size={28} />
              <h3 className="text-xl font-bold text-[#1B1F3B]">New Announcement!</h3>
            </div>
            <h4 className="text-lg font-bold text-[#1B1F3B] mb-2">{announcements[currentAnnouncementIndex].title}</h4>
            <p className="text-gray-600 mb-6">{announcements[currentAnnouncementIndex].content}</p>

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 font-semibold">{currentAnnouncementIndex + 1} of {announcements.length}</span>
              <button
                onClick={() => {
                  const dismissedIds = JSON.parse(localStorage.getItem('dismissed_announcements_educator') || '[]');
                  dismissedIds.push(announcements[currentAnnouncementIndex].id);
                  localStorage.setItem('dismissed_announcements_educator', JSON.stringify(dismissedIds));

                  if (currentAnnouncementIndex < announcements.length - 1) {
                    setCurrentAnnouncementIndex(prev => prev + 1);
                  } else {
                    setShowAnnouncementPopup(false);
                  }
                }}
                className="px-6 py-2 bg-[#1B1F3B] text-white rounded-xl font-bold hover:bg-[#D4AF37] hover:text-[#1B1F3B] transition-colors"
              >
                {currentAnnouncementIndex < announcements.length - 1 ? 'Next' : 'Got it!'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Navbar mimicking AdminDashboard Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-5 px-6 md:px-12 lg:px-16 bg-[#FAF9F6]/95 backdrop-blur-md shadow-sm">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          {/* Left Side: Menu Button + Logo */}
          <div className="flex items-center gap-6">
            <label className="flex flex-col gap-2 w-8 cursor-pointer shrink-0">
              <input
                className="peer hidden"
                type="checkbox"
                checked={isEducatorDrawerOpen}
                onChange={(e) => setIsEducatorDrawerOpen(e.target.checked)}
              />
              <div
                className="rounded-2xl h-[3px] w-1/2 bg-[#1B1F3B] duration-500 peer-checked:rotate-[225deg] origin-right peer-checked:-translate-x-[12px] peer-checked:-translate-y-[1px]"
              ></div>
              <div
                className="rounded-2xl h-[3px] w-full bg-[#1B1F3B] duration-500 peer-checked:-rotate-45"
              ></div>
              <div
                className="rounded-2xl h-[3px] w-1/2 bg-[#1B1F3B] duration-500 place-self-end peer-checked:rotate-[225deg] origin-left peer-checked:translate-x-[12px] peer-checked:translate-y-[1px]"
              ></div>
            </label>
            <div className="flex items-center group ml-2 sm:ml-4 lg:ml-8 mt-1 overflow-visible">
              <img src="/images/LOGO-IMG.png" alt="Logo" className="h-12 w-auto object-contain scale-[6.5] origin-left" />
            </div>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-4">
            <div className="relative flex items-center">
              <Search size={16} className="absolute left-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search educator dashboard..."
                className="pl-10 pr-4 py-2 w-64 rounded-full border border-[#E5D3B3]/60 bg-white/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--crimson)]/30 focus:border-[var(--crimson)] text-sm transition-all duration-300 shadow-sm"
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSignOutModal(true)}
              className="animated-signout-btn hidden sm:flex"
            >
              <div className="sign">
                <svg viewBox="0 0 512 512">
                  <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                </svg>
              </div>
              <div className="text">Logout</div>
            </button>

            <div
              onClick={() => setShowProfileModal(true)}
              className="w-10 h-10 rounded-full border-2 border-[#D4AF37] overflow-hidden ml-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:scale-105 active:scale-95"
            >
              <img src={currentEducator?.photo || "/images/team-1.jpg"} alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </nav>

      {/* Slide-out Educator Drawer Panel */}
      <div
        className={`fixed inset-y-0 left-0 w-80 bg-[#FAF9F6] border-r border-[#E5D3B3]/40 shadow-2xl z-[300] transition-transform duration-300 ease-in-out transform flex flex-col ${isEducatorDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#E5D3B3]/40 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37] flex items-center justify-center">
              <span className="font-bold text-[#1B1F3B] text-xl">E</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">EduPanel</h2>
              <p className="text-xs text-[var(--text-muted)] font-bold tracking-wider uppercase">Educator Portal</p>
            </div>
          </div>
          <button
            onClick={() => setIsEducatorDrawerOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-2">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard Overview' },
            { id: 'students', icon: Users, label: 'Manage Students' },
            { id: 'attendance', icon: Calendar, label: 'Attendance' },
            { id: 'assignments', icon: ClipboardCheck, label: 'Assignments' },
            { id: 'permanent_classes', icon: School, label: 'Permanent Assigned Class' },
            { id: 'temporary_classes', icon: Clock, label: 'Temporary Assigned Class' },
            { id: 'leaves', icon: UserX, label: 'Request for Leave' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSelectedStudentId(null); setIsEducatorDrawerOpen(false); }}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === item.id
                  ? 'bg-[#D4AF37]/10 text-[#D4AF37] font-bold border border-[#D4AF37]/20'
                  : 'text-gray-600 hover:bg-white'
                }`}
            >
              <item.icon size={18} /><span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Overlay for Drawer */}
      {isEducatorDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[250] transition-opacity duration-300"
          onClick={() => setIsEducatorDrawerOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className={`pt-32 transition-opacity duration-1000 delay-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Dynamic Header */}
        <div className="max-w-[1400px] mx-auto px-4 md:px-12 lg:px-16 mb-8 mt-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-center gap-4">
              {selectedStudentId && (
                <button
                  onClick={() => setSelectedStudentId(null)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-[#E5D3B3]/40 text-[#1B1F3B] hover:bg-[#D4AF37] hover:border-transparent transition-all"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] capitalize animate-in fade-in slide-in-from-left-4 duration-700">
                  {selectedStudentId 
                    ? `Manage: ${selectedStudent?.name}` 
                    : activeTab === 'dashboard' 
                      ? `Welcome Back . ${user?.name || 'Educator'}`
                      : activeTab.replace('-', ' ')}
                </h2>
                <p className="text-sm text-[var(--text-muted)] mt-1">
                  {selectedStudentId ? 'View and update student records, grades, and metrics.' :
                    activeTab === 'students' ? 'Manage your assigned students across all classes.' :
                      activeTab === 'dashboard' ? 'Overview of your educator statistics.' :
                        activeTab === 'courses' ? 'View and manage your assigned courses.' :
                          activeTab === 'attendance' ? 'Track daily attendance for your classes.' :
                            'Manage platform settings and features.'}
                </p>
              </div>
            </div>


          </div>
        </div>

        {/* Content Wrap */}
        <div className="max-w-[1400px] mx-auto px-4 md:px-12 lg:px-16 pb-20 w-full">

          {/* Students Directory List View */}
          {activeTab === 'students' && !selectedStudentId && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-[#1B1F3B]">Student Directory</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#F5F6FA]">
                    <tr>
                      <th className="px-8 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-8 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Course</th>
                      <th className="px-8 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">CGPA</th>
                      <th className="px-8 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-8 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {students.map((student) => (
                      <tr
                        key={student.id}
                        className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                        onClick={() => setSelectedStudentId(student.id)}
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#1B1F3B]/5 flex items-center justify-center text-[#1B1F3B] font-bold">
                              {student.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-[#1B1F3B] group-hover:text-[#D4AF37] transition-colors">{student.name}</p>
                              <p className="text-sm text-gray-500">{student.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-gray-600 font-medium">{student.course}</td>
                        <td className="px-8 py-5">
                          <span className="font-bold text-[#1B1F3B]">{student.cgpa}</span>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${student.status === 'Active' ? 'bg-green-100 text-green-700' :
                              student.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                            }`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button className="text-gray-400 hover:text-[#1B1F3B] transition-colors p-2">
                            <MoreVertical size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Student Detail Management View */}
          {activeTab === 'students' && selectedStudentId && selectedStudent && (
            <StudentManager
              student={selectedStudent}
              onSave={handleSaveStudent}
              currentEducator={currentEducator}
            />
          )}

          {/* Other Tabs (Placeholders) */}
          {/* Dashboard Overview */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-[24px] border border-black/5 p-6 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Users size={64} />
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                    <Users size={24} />
                  </div>
                  <p className="text-sm text-gray-500 font-medium mb-1">My Students</p>
                  <h3 className="text-3xl font-bold text-[#1B1F3B]">{students.length}</h3>
                  <p className="text-xs text-green-600 font-bold mt-2 flex items-center gap-1">
                    <TrendingUp size={12} /> Assigned to you
                  </p>
                </div>

                <div className="bg-white rounded-[24px] border border-black/5 p-6 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <School size={64} />
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#D4AF37] flex items-center justify-center mb-4">
                    <School size={24} />
                  </div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Active Classes</p>
                  <h3 className="text-3xl font-bold text-[#1B1F3B]">{currentEducator?.assignments?.length || 0}</h3>
                  <p className="text-xs text-gray-400 font-bold mt-2 flex items-center gap-1">
                    Managing across grades
                  </p>
                </div>

                <div className="bg-white rounded-[24px] border border-black/5 p-6 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <ClipboardCheck size={64} />
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                    <ClipboardCheck size={24} />
                  </div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Avg. Attendance</p>
                  <h3 className="text-3xl font-bold text-[#1B1F3B]">92%</h3>
                  <p className="text-xs text-green-600 font-bold mt-2 flex items-center gap-1">
                    <TrendingUp size={12} /> +2% this week
                  </p>
                </div>

                <div className="bg-white rounded-[24px] border border-black/5 p-6 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Megaphone size={64} />
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
                    <Megaphone size={24} />
                  </div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Active Announcements</p>
                  <h3 className="text-3xl font-bold text-[#1B1F3B]">{announcements.length}</h3>
                  <p className="text-xs text-blue-500 font-bold mt-2 flex items-center gap-1">
                    <Activity size={12} /> Recent alerts
                  </p>
                </div>
              </div>

              {/* Visuals Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Institutional Attendance */}
                <div className="bg-white rounded-[24px] border border-black/5 p-8 shadow-sm flex flex-col items-center justify-center">
                  <h3 className="text-lg font-bold text-[#1B1F3B] w-full text-left mb-8 flex items-center gap-2">
                    <ClipboardCheck className="text-[#D4AF37]" size={20} /> Class Attendance Status
                  </h3>
                  <div className="relative w-48 h-48">
                    <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" className="stroke-gray-100" strokeWidth="12" fill="none" />
                      <circle cx="50" cy="50" r="40" className="stroke-[#D4AF37]" strokeWidth="12" fill="none" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * 92) / 100} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 2s ease-in-out' }} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold text-[#1B1F3B]">92%</span>
                      <span className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">Present</span>
                    </div>
                  </div>
                  <div className="flex gap-8 mt-8 w-full justify-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#D4AF37]"></div>
                      <span className="text-sm text-gray-600 font-bold">Present (92%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-100"></div>
                      <span className="text-sm text-gray-600 font-bold">Absent (8%)</span>
                    </div>
                  </div>
                </div>

                {/* Assignment Status Overview */}
                <div className="bg-white rounded-[24px] border border-black/5 p-8 shadow-sm flex flex-col justify-center">
                  <h3 className="text-lg font-bold text-[#1B1F3B] mb-8 flex items-center gap-2">
                    <FileCheck className="text-green-600" size={20} /> Assignment Grading Status
                  </h3>

                  <div className="space-y-8">
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase">Target (This Week)</p>
                          <p className="text-2xl font-bold text-[#1B1F3B]">150 Submissions</p>
                        </div>
                        <p className="text-sm font-bold text-green-600">83% Graded</p>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                        <div className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full" style={{ width: '83%' }}></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border border-green-100 bg-green-50/50">
                        <p className="text-xs text-green-600 font-bold mb-1">Graded</p>
                        <p className="text-lg font-bold text-[#1B1F3B]">125</p>
                      </div>
                      <div className="p-4 rounded-xl border border-red-100 bg-red-50/50">
                        <p className="text-xs text-red-600 font-bold mb-1">Pending</p>
                        <p className="text-lg font-bold text-[#1B1F3B]">25</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Announcements */}
                <div className="bg-white rounded-[24px] border border-black/5 p-8 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-[#1B1F3B] flex items-center gap-2">
                      <Bell className="text-blue-500" size={20} /> Recent Announcements
                    </h3>
                    <button className="text-sm font-bold text-[#D4AF37] hover:underline">View All</button>
                  </div>
                  <div className="space-y-4">
                    {announcements.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">No announcements yet.</p>
                    ) : (
                      announcements.slice(0, 3).map((a, i) => (
                        <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors">
                          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 text-blue-500">
                            <Megaphone size={16} />
                          </div>
                          <div>
                            <h4 className="font-bold text-[#1B1F3B] text-sm">{a.title}</h4>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{a.content}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Upcoming Classes */}
                <div className="bg-white rounded-[24px] border border-black/5 p-8 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-[#1B1F3B] flex items-center gap-2">
                      <CalendarClock className="text-purple-500" size={20} /> Upcoming Classes
                    </h3>
                    <button onClick={() => setActiveTab('attendance')} className="text-sm font-bold text-[#D4AF37] hover:underline">View Schedule</button>
                  </div>
                  <div className="space-y-4">
                    {(!currentEducator?.assignments || currentEducator.assignments.length === 0) ? (
                      <p className="text-sm text-gray-500 italic">No classes assigned today.</p>
                    ) : (
                      currentEducator.assignments.slice(0, 3).map((assign: any, i: number) => {
                        // Mocking times for visual demo purposes
                        const times = ["09:00 AM - 10:00 AM", "11:30 AM - 12:30 PM", "02:00 PM - 03:00 PM"];
                        return (
                          <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors items-center">
                            <div className="w-12 h-12 rounded-xl bg-purple-50 flex flex-col items-center justify-center shrink-0 text-purple-600">
                              <span className="text-[10px] font-bold uppercase">Class</span>
                              <span className="text-sm font-black">{assign.class}{assign.section}</span>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-[#1B1F3B] text-sm">{assign.subject}</h4>
                              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                <Clock size={12} /> {times[i % 3]}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] font-bold px-2 py-1 bg-green-100 text-green-700 rounded-full uppercase">Scheduled</span>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Assignments Tab */}
          {activeTab === 'assignments' && (
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-2xl font-bold text-[#1B1F3B] mb-2">Manage Assignments</h3>
                <p className="text-gray-500 mb-8">Create and assign tasks to your classes.</p>

                <form className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-200" onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    let fileUrl = null;
                    if (assignmentForm.file) {
                      fileUrl = `https://ik.imagekit.io/dummy/${assignmentForm.file.name}`;
                    }
                    const res = await fetch(`${API_BASE_URL}/educator/assignments`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ ...assignmentForm, attachmentUrl: fileUrl, educatorId: '6662700f1234567890123456' })
                    });
                    if (res.ok) {
                      setAssignmentForm({ title: '', description: '', class: '', section: '', subject: '', dueDate: '', file: null });
                      fetchBackendData();
                      setShowToast(true);
                      setTimeout(() => setShowToast(false), 3000);
                    }
                  } catch (err) { console.error(err); }
                }}>
                  <input required placeholder="Assignment Title" value={assignmentForm.title} onChange={e => setAssignmentForm({ ...assignmentForm, title: e.target.value })} className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D4AF37]" />
                  <input required placeholder="Class (e.g. 10)" value={assignmentForm.class} onChange={e => setAssignmentForm({ ...assignmentForm, class: e.target.value })} className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D4AF37]" />
                  <input required placeholder="Section (e.g. A)" value={assignmentForm.section} onChange={e => setAssignmentForm({ ...assignmentForm, section: e.target.value })} className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D4AF37]" />
                  <input required placeholder="Subject" value={assignmentForm.subject} onChange={e => setAssignmentForm({ ...assignmentForm, subject: e.target.value })} className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D4AF37]" />
                  <input required type="date" value={assignmentForm.dueDate} onChange={e => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })} className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D4AF37] text-gray-500" />

                  <div className="flex flex-col justify-center">
                    <input type="file" onChange={e => setAssignmentForm({ ...assignmentForm, file: e.target.files ? e.target.files[0] : null })} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer" />
                  </div>

                  <div className="md:col-span-2 lg:col-span-3">
                    <textarea rows={2} placeholder="Assignment Notes / Instructions (Optional)" value={assignmentForm.description} onChange={e => setAssignmentForm({ ...assignmentForm, description: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D4AF37] resize-none"></textarea>
                  </div>

                  <div className="md:col-span-2 lg:col-span-3">
                    <button type="submit" className="w-full bg-[#1B1F3B] text-white px-6 py-3 rounded-xl hover:bg-[#D4AF37] hover:text-[#1B1F3B] transition-colors font-bold shadow-md">Assign Task</button>
                  </div>
                </form>

                <div className="space-y-4">
                  <h4 className="font-bold text-lg text-[#1B1F3B] border-b pb-2">Previous Assignments</h4>
                  {assignments.length === 0 ? <p className="text-gray-500 italic">No assignments created yet.</p> : assignments.map((a: any, i) => (
                    <div key={i} className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm flex flex-col md:flex-row justify-between md:items-start gap-4 hover:border-[#E5D3B3] transition-colors">
                      <div className="flex gap-4 w-full">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center shrink-0 mt-1">
                          <ClipboardCheck size={24} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start w-full">
                            <div>
                              <h5 className="font-bold text-[#1B1F3B] text-lg">{a.title}</h5>
                              <p className="text-sm text-gray-500 font-medium mb-2">Class {a.class}-{a.section} • {a.subject}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] uppercase tracking-wider font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-full">Due: {new Date(a.dueDate).toLocaleDateString()}</span>
                            </div>
                          </div>

                          {a.description && (
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-2">
                              <p className="text-sm text-gray-700 whitespace-pre-wrap">{a.description}</p>
                            </div>
                          )}

                          {a.attachmentUrl && <a href={a.attachmentUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-indigo-600 hover:underline inline-flex items-center gap-1 mt-1">📎 View Attachment</a>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Permanent Assigned Class Tab */}
          {activeTab === 'permanent_classes' && (
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-2xl font-bold text-[#1B1F3B] mb-2">Permanent Assigned Classes</h3>
                <p className="text-gray-500 mb-8">View your assigned classes and student details.</p>
                {permanentClasses.map((c, i) => (
                  <div key={i} className="p-6 border border-[#E5D3B3] rounded-2xl bg-[#FAF9F6] mb-4 shadow-sm group hover:shadow-md transition-all">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#D4AF37]/20 text-[#D4AF37] rounded-xl flex items-center justify-center">
                          <School size={24} />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-[#1B1F3B]">Class {c.class} - {c.section}</h4>
                          <p className="text-gray-500 font-medium">{c.subject} Teacher</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-black text-[#D4AF37]">45</p>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Students</p>
                      </div>
                    </div>
                    <button onClick={() => { setActiveTab('students'); }} className="w-full bg-white border border-gray-200 py-3 rounded-xl text-sm font-bold text-[#1B1F3B] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors flex items-center justify-center gap-2">
                      <Users size={16} /> View All Students
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Temporary Assigned Class Tab */}
          {activeTab === 'temporary_classes' && (
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-2xl font-bold text-[#1B1F3B] mb-2">Temporary Assignments / Substitution</h3>
                <p className="text-gray-500 mb-8">Classes assigned to you during other teachers' leave.</p>
                {temporaryClasses.map((c: any, i: number) => (
                  <div key={i} className="p-6 border border-blue-100 rounded-2xl bg-blue-50 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-xl shadow-inner"><Clock size={24} /></div>
                      <div>
                        <h4 className="font-bold text-[#1B1F3B] text-lg">Class {c.class} - {c.section} ({c.subject})</h4>
                        <p className="text-sm text-gray-600 font-medium mt-1"><Calendar size={14} className="inline mr-1" /> {new Date(c.date).toLocaleDateString()} • {c.period}</p>
                      </div>
                    </div>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-200">Upcoming</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Request for Leave Tab */}
          {activeTab === 'leaves' && (
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-2xl font-bold text-[#1B1F3B] mb-2">Request Leave</h3>
                <p className="text-gray-500 mb-8">Submit a leave application to the administration.</p>

                <form className="max-w-2xl bg-gray-50 p-8 rounded-2xl shadow-sm border border-gray-200" onSubmit={async (e) => {
                  e.preventDefault();
                  setIsSubmittingLeave(true);
                  try {
                    let fileUrl = null;
                    if (leaveForm.isSickLeave && leaveForm.file) {
                      const authResponse = await api.get('/imagekit/auth');
                      const { token, expire, signature } = authResponse.data;
                      const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY || 'public_3TjyerjXg85mniyssEGbyfH0odU=';

                      const uploadData = new FormData();
                      uploadData.append('file', leaveForm.file);
                      uploadData.append('publicKey', publicKey);
                      uploadData.append('signature', signature);
                      uploadData.append('expire', expire);
                      uploadData.append('token', token);
                      uploadData.append('fileName', leaveForm.file.name);
                      uploadData.append('folder', '/leaves');

                      const uploadRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
                        method: 'POST',
                        body: uploadData
                      });
                      const uploadJson = await uploadRes.json();
                      if (uploadJson.url) {
                        fileUrl = uploadJson.url;
                      }
                    }

                    const tokenStr = localStorage.getItem('educator_token');
                    const res = await fetch(`${API_BASE_URL}/educator/leaves`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${tokenStr}`
                      },
                      body: JSON.stringify({
                        startDate: leaveForm.startDate,
                        endDate: leaveForm.endDate,
                        reason: leaveForm.reason,
                        isSickLeave: leaveForm.isSickLeave,
                        medicalRecordUrl: fileUrl,
                        educatorId: localStorage.getItem('logged_in_educator_id') || ''
                      })
                    });
                    const data = await res.json();
                    if (data.status === 'success') {
                      setLeaves([...leaves, data.data.leaveRequest]);
                      setLeaveForm({ startDate: '', endDate: '', reason: '', isSickLeave: false, file: null });
                      setShowLeaveSuccess(true);
                    } else {
                      alert('Failed to submit leave request: ' + data.message);
                    }
                  } catch (err) {
                    console.error('Error submitting leave:', err);
                    alert('Server error occurred while submitting leave request.');
                  } finally {
                    setIsSubmittingLeave(false);
                  }
                }}>
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Start Date</label>
                      <input required type="date" value={leaveForm.startDate} onChange={e => setLeaveForm({ ...leaveForm, startDate: e.target.value })} className="w-full mt-2 px-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-[#D4AF37]" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">End Date</label>
                      <input required type="date" value={leaveForm.endDate} onChange={e => setLeaveForm({ ...leaveForm, endDate: e.target.value })} className="w-full mt-2 px-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-[#D4AF37]" />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="text-xs font-bold text-gray-500 uppercase">Reason for Leave</label>
                    <textarea required rows={4} value={leaveForm.reason} onChange={e => setLeaveForm({ ...leaveForm, reason: e.target.value })} className="w-full mt-2 px-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-[#D4AF37]" placeholder="Please provide details..."></textarea>
                  </div>

                  <div className="mb-8 bg-white p-5 rounded-2xl border border-red-100 flex flex-col gap-4 shadow-sm">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={leaveForm.isSickLeave} onChange={e => setLeaveForm({ ...leaveForm, isSickLeave: e.target.checked })} className="w-5 h-5 accent-red-500 rounded cursor-pointer" />
                      <span className="font-bold text-[#1B1F3B]">This is a Sick Leave</span>
                    </label>
                    {leaveForm.isSickLeave && (
                      <div className="pl-8 mt-2 animate-in slide-in-from-top-2 duration-300">
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-3">Medical Record / Prescription</label>
                        <input type="file" accept="image/*,.pdf" onChange={e => setLeaveForm({ ...leaveForm, file: e.target.files ? e.target.files[0] : null })} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer transition-colors" />
                      </div>
                    )}
                  </div>

                  <button type="submit" className="w-full bg-[#1B1F3B] text-white py-4 rounded-xl hover:bg-[#D4AF37] hover:text-[#1B1F3B] transition-colors font-bold shadow-lg shadow-[#1B1F3B]/20 text-lg">Submit Leave Request</button>
                </form>

                <div className="mt-12 space-y-4">
                  <h4 className="font-bold text-lg text-[#1B1F3B] border-b pb-2">Leave History</h4>
                  {leaves.length === 0 ? <p className="text-gray-500 italic">No leaves requested.</p> : leaves.map((l: any, i) => (
                    <div key={i} className="p-5 border border-gray-100 rounded-xl bg-white shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4 hover:border-gray-200 transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${l.isSickLeave ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-600'}`}>
                          {l.isSickLeave ? <Activity size={24} /> : <UserX size={24} />}
                        </div>
                        <div>
                          <h5 className="font-bold text-[#1B1F3B] text-lg">{l.isSickLeave ? 'Sick Leave' : 'General Leave'}</h5>
                          <p className="text-sm text-gray-500 font-medium">{new Date(l.startDate).toLocaleDateString()} to {new Date(l.endDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-left md:text-right">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${l.status === 'Approved' ? 'bg-green-100 text-green-700' : l.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{l.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// Sub-component for managing a single student's complex data
function StudentManager({ student, onSave, currentEducator }: { student: any, onSave: (s: any) => void, currentEducator: any }) {
  const [formData, setFormData] = useState(student);
  const [activeExamTab, setActiveExamTab] = useState('UNIT TEST-1');

  const examTypes = ['UNIT TEST-1', 'UNIT TEST-2', 'HALF YEARLY EXAM', 'FINAL YEAR EXAMS'];

  // Helper to update exam marks
  const updateExam = (index: number, field: string, value: string | number) => {
    const updatedExams = { ...formData.exams };
    if (!updatedExams[activeExamTab]) updatedExams[activeExamTab] = [];

    updatedExams[activeExamTab][index] = { ...updatedExams[activeExamTab][index], [field]: value };
    setFormData({ ...formData, exams: updatedExams });
  };

  const updateMetric = (index: number, value: number) => {
    const updatedMetrics = [...formData.performanceMetrics];
    updatedMetrics[index] = { ...updatedMetrics[index], value: Number(value) };
    setFormData({ ...formData, performanceMetrics: updatedMetrics });
  };

  const updateFee = (index: number, status: string) => {
    const updatedFees = [...formData.feeInstallments];
    updatedFees[index] = { ...updatedFees[index], status };
    setFormData({ ...formData, feeInstallments: updatedFees });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">

      {/* Top Action Bar */}
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-gray-100 sticky top-0 z-20">
        <div>
          <p className="text-sm text-gray-500">Currently Editing</p>
          <p className="font-bold text-[#1B1F3B]">{formData.name} <span className="text-gray-400 font-normal ml-2">| Roll No: 2024CS10{formData.id}</span></p>
        </div>
        <button
          onClick={() => onSave(formData)}
          className="bg-[#1B1F3B] text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-[#D4AF37] hover:text-[#1B1F3B] transition-colors shadow-lg shadow-[#1B1F3B]/10"
        >
          <Save size={18} /> Save All Changes
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* Left Column: Profile & Metrics */}
        <div className="xl:col-span-1 space-y-8">

          {/* Profile Editor */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-[#1B1F3B] mb-5 flex items-center gap-2">
              <Users size={18} className="text-[#D4AF37]" /> Core Profile
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">CGPA</label>
                <input
                  type="number" step="0.1" max="10"
                  value={formData.cgpa}
                  onChange={(e) => setFormData({ ...formData, cgpa: parseFloat(e.target.value) })}
                  className="w-full mt-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] font-bold text-[#1B1F3B]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Attendance (%)</label>
                <input
                  type="number" max="100"
                  value={formData.attendance}
                  onChange={(e) => setFormData({ ...formData, attendance: parseInt(e.target.value) })}
                  className="w-full mt-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] font-bold text-[#1B1F3B]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full mt-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] font-bold text-[#1B1F3B]"
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Performance Metrics Editor */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-[#1B1F3B] mb-5 flex items-center gap-2">
              <Settings size={18} className="text-[#D4AF37]" /> Performance Metrics (0-5)
            </h3>
            <div className="space-y-5">
              {formData.performanceMetrics.map((metric: any, index: number) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                    <span className="text-sm font-bold text-[#1B1F3B]">{metric.value}</span>
                  </div>
                  <input
                    type="range" min="0" max="5" step="0.1"
                    value={metric.value}
                    onChange={(e) => updateMetric(index, parseFloat(e.target.value))}
                    className="w-full accent-[#D4AF37]"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Grades, Announcements, Fees */}
        <div className="xl:col-span-2 space-y-8">

          {/* Main Exams Editor */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-5">
              <h3 className="text-lg font-bold text-[#1B1F3B] flex items-center gap-2">
                <BookOpen size={18} className="text-[#D4AF37]" /> Exam Grades
              </h3>
              <select
                value={activeExamTab}
                onChange={(e) => setActiveExamTab(e.target.value)}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] font-semibold text-[#1B1F3B] text-sm"
              >
                {examTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {formData.exams && formData.exams[activeExamTab] && formData.exams[activeExamTab].length > 0 ? (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-xs text-gray-500 uppercase bg-gray-50 rounded-lg">
                        <th className="p-3 rounded-l-lg">Subject</th>
                        <th className="p-3">Marks</th>
                        <th className="p-3">Total</th>
                        <th className="p-3 rounded-r-lg">Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.exams[activeExamTab].map((exam: any, index: number) => {
                        const subjPct = exam.total > 0 ? ((exam.marks / exam.total) * 100).toFixed(1) : 0;

                        const allowedSubjects = currentEducator?.assignments
                          ?.filter((a: any) => `Class ${a.class}-${a.section}` === student?.course)
                          .map((a: any) => a.subject) || [];
                        const isLocked = !allowedSubjects.includes(exam.name);

                        return (
                          <tr key={index} className="border-b border-gray-50 last:border-0">
                            <td className="p-3 font-semibold text-[#1B1F3B]">
                              {exam.name}
                              {isLocked && <span className="ml-2 text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold uppercase">Locked</span>}
                            </td>
                            <td className="p-3">
                              <input
                                type="number" value={exam.marks}
                                disabled={isLocked}
                                onChange={(e) => updateExam(index, 'marks', parseInt(e.target.value))}
                                className={`w-20 px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D4AF37] ${isLocked ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50' : 'bg-gray-50'}`}
                              />
                            </td>
                            <td className="p-3 text-gray-500">{exam.total}</td>
                            <td className="p-3 font-bold text-[#1B1F3B]">
                              {subjPct}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Overall Exam Percentage Calculator */}
                <div className="bg-[#1B1F3B] text-white p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Overall {activeExamTab} Score</p>
                    <p className="text-2xl font-bold text-[#D4AF37]">
                      {(() => {
                        const totalMarks = formData.exams[activeExamTab].reduce((acc: number, curr: any) => acc + (Number(curr.marks) || 0), 0);
                        const totalMax = formData.exams[activeExamTab].reduce((acc: number, curr: any) => acc + (Number(curr.total) || 0), 0);
                        return totalMax > 0 ? ((totalMarks / totalMax) * 100).toFixed(2) + '%' : '0.00%';
                      })()}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full border-4 border-[#D4AF37]/30 flex items-center justify-center border-t-[#D4AF37] rotate-45">
                    <CheckCircle2 size={24} className="text-[#D4AF37] -rotate-45" />
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No subjects configured for {activeExamTab}.</p>
            )}
          </div>

          {/* Fees Tracker Editor */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-[#1B1F3B] mb-5 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-[#D4AF37]" /> Fees Tracker Management
            </h3>
            {formData.feeInstallments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {formData.feeInstallments.map((fee: any, index: number) => (
                  <div key={index} className="border border-gray-100 p-4 rounded-xl hover:border-[#D4AF37]/30 transition-colors">
                    <p className="font-semibold text-[#1B1F3B]">{fee.label}</p>
                    <p className="text-sm text-gray-500 mb-3">${fee.amount} • Due: {fee.due}</p>
                    <select
                      value={fee.status}
                      onChange={(e) => updateFee(index, e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] font-semibold text-sm ${fee.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          fee.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-gray-50 text-gray-700 border-gray-200'
                        }`}
                    >
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                      <option value="Edit">Edit Mode (Open)</option>
                    </select>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No fee installments recorded.</p>
            )}
          </div>

          {/* Announcements Manager */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-[#1B1F3B] flex items-center gap-2">
                <Bell size={18} className="text-[#D4AF37]" /> Targeted Announcements
              </h3>
              <button className="text-[#D4AF37] hover:text-[#1B1F3B] transition-colors flex items-center gap-1 text-sm font-semibold">
                <Plus size={16} /> Add New
              </button>
            </div>
            {formData.announcements.length > 0 ? (
              <div className="space-y-4">
                {formData.announcements.map((ann: any, index: number) => (
                  <div key={index} className="flex gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text" value={ann.title}
                        onChange={(e) => {
                          const newAnn = [...formData.announcements];
                          newAnn[index].title = e.target.value;
                          setFormData({ ...formData, announcements: newAnn });
                        }}
                        className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg font-bold text-[#1B1F3B]"
                      />
                      <textarea
                        value={ann.desc}
                        onChange={(e) => {
                          const newAnn = [...formData.announcements];
                          newAnn[index].desc = e.target.value;
                          setFormData({ ...formData, announcements: newAnn });
                        }}
                        className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 min-h-[60px]"
                      />
                    </div>
                    <button className="text-gray-400 hover:text-red-500 transition-colors p-2 h-fit">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No targeted announcements for this student.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

// Multi-Step Registration Wizard Sub-Component
function RegistrationWizard({ onClose, onComplete }: { onClose: () => void, onComplete: (student: any) => void }) {
  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [formData, setFormData] = useState({
    // Step 1: Personal
    name: '', email: '', studentClass: '', section: '', dob: '', aadhaarNumber: '',
    birthCert: null as File | null, aadhaarCard: null as File | null, passportFile: null as File | null, photoFile: null as File | null,

    // Step 2: Academic
    transferCert: null as File | null, previousRecords: null as File | null, characterCert: null as File | null,

    // Step 3: Contact & Family
    address: '', emergencyName: '', emergencyPhone: '',
    fatherName: '', fatherOccupation: '', fatherIncome: '',
    motherName: '', motherOccupation: '', parentPhone: '',
    residenceProof: null as File | null,

    // Step 4: Special
    casteCert: null as File | null, incomeCert: null as File | null
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 5));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      nextStep();
      return;
    }

    if (step === 4) {
      const stuId = 'STU-' + Math.floor(10000000 + Math.random() * 90000000);
      setIsUploading(true);
      setLoadingText('Uploading Documents');

      try {
        const authResponse = await api.get('/imagekit/auth');
        const { token, expire, signature } = authResponse.data;
        const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY || 'public_3TjyerjXg85mniyssEGbyfH0odU=';

        const fileFields = ['birthCert', 'aadhaarCard', 'passportFile', 'photoFile', 'transferCert', 'previousRecords', 'characterCert', 'residenceProof', 'casteCert', 'incomeCert'];
        const documentUrls: Record<string, string> = {};

        for (const field of fileFields) {
          const file = formData[field as keyof typeof formData] as File | null;
          if (file) {
            const uploadData = new FormData();
            uploadData.append('file', file);
            uploadData.append('publicKey', publicKey);
            uploadData.append('signature', signature);
            uploadData.append('expire', expire);
            uploadData.append('token', token);
            uploadData.append('fileName', file.name);
            uploadData.append('folder', `/students/${stuId}`);

            const uploadRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
              method: 'POST',
              body: uploadData
            });
            const uploadJson = await uploadRes.json();
            if (uploadJson.url) {
              documentUrls[field] = uploadJson.url;
            }
          }
        }

        setLoadingText('Saving your Details');

        const newStudent = {
          id: stuId,
          name: formData.name || 'New Student',
          email: formData.email,
          course: formData.studentClass && formData.section ? `Class ${formData.studentClass}-${formData.section}` : (formData.studentClass || 'Unassigned'),
          semester: 1,
          status: 'Pending', // New registrations start as pending
          progress: 0,
          cgpa: 0,
          attendance: 0,
          documentUrls,
          exams: {
            'UNIT TEST-1': [
              { name: 'Mathematics', marks: 0, total: 50 },
              { name: 'Science', marks: 0, total: 50 },
              { name: 'English', marks: 0, total: 50 },
              { name: 'History', marks: 0, total: 50 },
            ],
            'UNIT TEST-2': [
              { name: 'Mathematics', marks: 0, total: 50 },
              { name: 'Science', marks: 0, total: 50 },
              { name: 'English', marks: 0, total: 50 },
              { name: 'History', marks: 0, total: 50 },
            ],
            'HALF YEARLY EXAM': [
              { name: 'Mathematics', marks: 0, total: 100 },
              { name: 'Science', marks: 0, total: 100 },
              { name: 'English', marks: 0, total: 100 },
              { name: 'History', marks: 0, total: 100 },
            ],
            'FINAL YEAR EXAMS': [
              { name: 'Mathematics', marks: 0, total: 100 },
              { name: 'Science', marks: 0, total: 100 },
              { name: 'English', marks: 0, total: 100 },
              { name: 'History', marks: 0, total: 100 },
            ]
          },
          performanceMetrics: [
            { label: 'Class Engagement', value: 0 },
            { label: 'Communication', value: 0 },
            { label: 'Technical Knowledge', value: 0 },
            { label: 'Initiative & Involvement', value: 0 },
            { label: 'Behavior & Conduct', value: 0 },
          ],
          announcements: [],
          feeInstallments: []
        };

        await new Promise(resolve => setTimeout(resolve, 1500));

        onComplete(newStudent);
        setIsUploading(false);
        setStep(5);
      } catch (error) {
        console.error("Upload failed", error);
        alert("An error occurred during registration. Please try again.");
        setIsUploading(false);
      }
    }
  };

  const FileUploadMock = ({ label, field }: { label: string, field: string }) => {
    const file = formData[field as keyof typeof formData] as File | null;
    return (
      <div className={`relative border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center transition-colors cursor-pointer ${file ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}>
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setFormData({ ...formData, [field]: e.target.files[0] });
            }
          }}
        />
        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${file ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'}`}>
          {file ? <CheckCircle2 size={20} /> : <Plus size={20} />}
        </div>
        <p className="text-sm font-semibold text-gray-600 text-center">{label}</p>
        <p className="text-xs text-gray-400 mt-1 truncate w-full text-center">{file ? file.name : 'Click to Browse'}</p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-[#1B1F3B]/40 backdrop-blur-sm flex items-center justify-center z-[100] animate-in fade-in duration-300 p-4 md:p-10">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl h-full max-h-[800px] flex flex-col animate-in zoom-in-95 duration-300 overflow-hidden">

        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-2xl font-bold text-[#1B1F3B]">{step === 5 ? 'Registration Success' : 'Student Registration'}</h3>
            <p className="text-gray-500 text-sm mt-1">Step {step} of 5</p>
          </div>
          <button type="button" onClick={onClose} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-red-500 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Loading Overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-3xl">
            <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-6"></div>
            <h3 className="text-2xl font-bold text-[#1B1F3B] animate-pulse">{loadingText}</h3>
            <p className="text-gray-500 mt-2">Please wait while we process your request...</p>
          </div>
        )}

        {/* Progress Bar */}
        <div className="flex h-2 w-full bg-gray-100 shrink-0">
          <div className="h-full bg-[#D4AF37] transition-all duration-500" style={{ width: `${(step / 4) * 100}%` }}></div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8">

          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <h4 className="text-lg font-bold text-[#1B1F3B] border-b pb-2">1. Proof of Identity & Age</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Full Name *</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none" placeholder="e.g. Emma Watson" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Email Address *</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none" placeholder="e.g. emma@school.edu" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Class *</label>
                    <input required type="text" value={formData.studentClass} onChange={e => setFormData({ ...formData, studentClass: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none" placeholder="e.g. 10" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Section *</label>
                    <input required type="text" value={formData.section} onChange={e => setFormData({ ...formData, section: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none" placeholder="e.g. A" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Date of Birth</label>
                  <input type="date" value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none text-gray-600" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Aadhaar Card Number</label>
                  <input type="text" value={formData.aadhaarNumber} onChange={e => setFormData({ ...formData, aadhaarNumber: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none" placeholder="e.g. 1234-5678-9012" />
                </div>
              </div>

              <h4 className="text-sm font-bold text-gray-700 mt-8 mb-4">Required Documents</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FileUploadMock label="Birth Certificate" field="birthCert" />
                <FileUploadMock label="Aadhaar Card Copy" field="aadhaarCard" />
                <FileUploadMock label="Passport (Optional)" field="passportFile" />
                <FileUploadMock label="Recent Photographs" field="photoFile" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <h4 className="text-lg font-bold text-[#1B1F3B] border-b pb-2">2. Academic History</h4>
              <p className="text-sm text-gray-500 mb-6">For students seeking admission to Grade 1 or higher, upload their previous educational background documents below.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FileUploadMock label="Transfer Certificate (TC)" field="transferCert" />
                <FileUploadMock label="Previous Academic Records" field="previousRecords" />
                <FileUploadMock label="Character Certificate" field="characterCert" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <h4 className="text-lg font-bold text-[#1B1F3B] border-b pb-2">3. Family & Contact Details</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Father's Name</label>
                  <input type="text" value={formData.fatherName} onChange={e => setFormData({ ...formData, fatherName: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Father's Occupation</label>
                  <input type="text" value={formData.fatherOccupation} onChange={e => setFormData({ ...formData, fatherOccupation: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Mother's Name</label>
                  <input type="text" value={formData.motherName} onChange={e => setFormData({ ...formData, motherName: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Mother's Occupation</label>
                  <input type="text" value={formData.motherOccupation} onChange={e => setFormData({ ...formData, motherOccupation: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Father's Annual Income (As per Income Certificate)</label>
                  <input type="text" value={formData.fatherIncome} onChange={e => setFormData({ ...formData, fatherIncome: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none" placeholder="e.g. 5,00,000" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Parent Mobile Number *</label>
                  <input required type="tel" value={formData.parentPhone} onChange={e => setFormData({ ...formData, parentPhone: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none" placeholder="+91 ..." />
                </div>
              </div>

              <div className="space-y-4 mt-6">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Full Residential Address</label>
                  <textarea value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none min-h-[100px]" placeholder="Enter complete address..." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Emergency Contact Name</label>
                    <input type="text" value={formData.emergencyName} onChange={e => setFormData({ ...formData, emergencyName: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none" placeholder="Name of guardian/relative" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Emergency Contact Phone</label>
                    <input type="text" value={formData.emergencyPhone} onChange={e => setFormData({ ...formData, emergencyPhone: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none" placeholder="+91 ..." />
                  </div>
                </div>

                <h4 className="text-sm font-bold text-gray-700 mt-8 mb-4">Verification Proofs</h4>
                <div className="w-full md:w-1/3">
                  <FileUploadMock label="Proof of Residence" field="residenceProof" />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <h4 className="text-lg font-bold text-[#1B1F3B] border-b pb-2">4. Special Category Documents</h4>
              <p className="text-sm text-gray-500 mb-6">Depending on the family's situation or admission quota, these documents may be required. Leave empty if not applicable.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileUploadMock label="Caste / Category Certificate" field="casteCert" />
                <FileUploadMock label="Income Certificate" field="incomeCert" />
              </div>

              <div className="mt-10 p-4 bg-yellow-50 rounded-xl border border-yellow-200 flex gap-3 text-yellow-800">
                <CheckCircle2 size={24} className="shrink-0" />
                <div>
                  <p className="font-bold">Ready to Register</p>
                  <p className="text-sm mt-1">Please ensure all required original documents are physically verified by the administration desk before completing this digital registration.</p>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 size={48} className="text-green-500" />
              </div>
              <h3 className="text-3xl font-bold text-[#1B1F3B] mb-2">Registration Successful!</h3>
              <p className="text-gray-500 mb-8 max-w-md">
                The student details and documents have been successfully verified and saved.
              </p>
            </div>
          )}

        </form>

        {/* Footer Actions */}
        {step < 5 && (
          <div className="p-6 border-t border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 1}
              className="px-6 py-2.5 text-[#1B1F3B] font-semibold hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>

            <button
              type="submit"
              onClick={handleSubmit}
              className={`px-8 py-2.5 font-bold rounded-xl transition-all shadow-lg ${step === 4
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
                  : 'bg-[#1B1F3B] hover:bg-[#D4AF37] hover:text-[#1B1F3B] text-white shadow-[#1B1F3B]/20'
                }`}
            >
              {step === 4 ? 'Complete Registration' : 'Next Step'}
            </button>
          </div>
        )}
        {step === 5 && (
          <div className="p-6 border-t border-gray-100 flex justify-center items-center bg-gray-50 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-2.5 bg-[#1B1F3B] hover:bg-[#D4AF37] text-white font-bold rounded-xl transition-all shadow-lg"
            >
              Close Window
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
