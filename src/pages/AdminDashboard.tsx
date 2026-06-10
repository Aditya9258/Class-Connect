import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Shield, Users, LogOut, Search, UserCheck, Plus, BookOpen, UserPlus, Trash2, Megaphone, School, Eye, EyeOff, Edit, Save, X, Calendar, ClipboardCheck, Wallet, IndianRupee, CheckCircle2, CheckCircle, AlertCircle, Bell, User, Key, LayoutDashboard, Activity, TrendingUp, Download, Printer, FileText, Check } from 'lucide-react';
import { useAuth } from '../AuthContext';
import api from '../services/api';
import OTPInput from '../components/OTPInput';

const initialClasses = [
  { id: 1, className: "1", sections: ["A", "B"] },
  { id: 2, className: "2", sections: ["A", "B"] },
  { id: 3, className: "3", sections: ["A", "B"] },
  { id: 4, className: "4", sections: ["A"] },
  { id: 5, className: "5", sections: ["A"] },
  { id: 6, className: "6", sections: ["A"] },
  { id: 7, className: "7", sections: ["A"] },
  { id: 8, className: "8", sections: ["A", "B"] },
  { id: 9, className: "9", sections: ["A", "B"] },
  { id: 10, className: "10", sections: ["A", "B", "C"] },
  { id: 11, className: "11", sections: ["A"] },
  { id: 12, className: "12", sections: ["A"] }
];

const getStudentClass = (courseStr: string) => {
  if (!courseStr) return '';
  const match = courseStr.match(/Class\s*(\d+)/i);
  if (match) return match[1];
  const parts = courseStr.split('-');
  if (parts.length > 0) return parts[0].trim().replace(/Class/i, '').trim();
  return '';
};

const getStudentSection = (courseStr: string) => {
  if (!courseStr) return '';
  const parts = courseStr.split('-');
  if (parts.length > 1) return parts[1].trim();
  return '';
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<any[]>([]);
  const [educators, setEducators] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [newSectionInputs, setNewSectionInputs] = useState<Record<number, string>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('adminDashboardTab') || 'overview');

  const formatStudentId = (rawId: string) => {
    if (!rawId) return 'STU-12345678';
    if (rawId.startsWith('STU-')) return rawId;
    const digits = rawId.replace(/[^0-9]/g, '');
    if (digits.length >= 8) return `STU-${digits.substring(0, 8)}`;
    return `STU-${(rawId.toUpperCase() + '12345678').replace(/[^0-9A-Z]/g, '').substring(0, 8)}`;
  };

  useEffect(() => {
    localStorage.setItem('adminDashboardTab', activeTab);
  }, [activeTab]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [timetables, setTimetables] = useState<any[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [rejectLeaveId, setRejectLeaveId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Authentication State
  const [otpQrCode, setOtpQrCode] = useState('');
  const [qrScanned, setQrScanned] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpStatus, setOtpStatus] = useState('');
  const [isOtpEnabled, setIsOtpEnabled] = useState(false);

  // Filtering State
  const [studentFilterSession, setStudentFilterSession] = useState('');
  const [studentFilterClass, setStudentFilterClass] = useState('');
  const [studentFilterSection, setStudentFilterSection] = useState('');

  const [classTimetableFilterClass, setClassTimetableFilterClass] = useState('');
  const [classTimetableFilterSection, setClassTimetableFilterSection] = useState('');

  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [facultyAttendance, setFacultyAttendance] = useState<Record<string, Record<string, string>>>({});

  const [showExportModal, setShowExportModal] = useState(false);
  const [exportDate, setExportDate] = useState(new Date().toISOString().split('T')[0]);

  const [facultySalaries, setFacultySalaries] = useState<Record<string, { baseSalary: string, status: string }>>({});
  const [classFees, setClassFees] = useState<Record<string, string>>({});
  const [studentFees, setStudentFees] = useState<Record<string, { paidAmount: string, status: string }>>({});

  const [feeFilterSession, setFeeFilterSession] = useState('');
  const [feeFilterClass, setFeeFilterClass] = useState('');
  const [feeFilterSection, setFeeFilterSection] = useState('');

  const [showAddAnnouncementModal, setShowAddAnnouncementModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    visibility: 'All'
  });

  const [showAddTimetableModal, setShowAddTimetableModal] = useState(false);
  const [newTimetable, setNewTimetable] = useState({
    educatorId: '',
    day: 'Monday',
    period: '1',
    startTime: '',
    endTime: '',
    className: '',
    section: '',
    subject: ''
  });

  const [showLunchBreakModal, setShowLunchBreakModal] = useState(false);
  const [newLunchBreak, setNewLunchBreak] = useState({ afterPeriod: '4', startTime: '', endTime: '' });

  // Profile Viewing/Editing State
  const [viewingEducator, setViewingEducator] = useState<any>(null);
  const [isEditingEducator, setIsEditingEducator] = useState(false);

  const [showAddEducatorModal, setShowAddEducatorModal] = useState(false);
  const [showEducatorPassword, setShowEducatorPassword] = useState(false);
  const [newEducatorData, setNewEducatorData] = useState({
    name: '',
    team: '',
    dob: '',
    aadhaar: '',
    mobile: '',
    email: '',
    address: '',
    qualification: '',
    qualificationDoc: null,
    salary: '',
    initialClass: '',
    initialSection: '',
    initialSubject: '',
    password: '',
    confirmPassword: ''
  });

  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  // const [newStudentData, setNewStudentData] = useState({
  //   name: '',
  //   email: '',
  //   regNo: '',
  //   session: '2023-2024',
  //   class: '',
  //   section: '',
  //   password: '',
  //   confirmPassword: ''
  // });

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assigningEducatorId] = useState<number | null>(null);
  const [assignClass, setAssignClass] = useState('');
  const [assignSection, setAssignSection] = useState('');
  const [assignSubject, setAssignSubject] = useState('');
  const [isAdminDrawerOpen, setIsAdminDrawerOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);


  const handleGenerateOTP = async () => {
    try {
      const resp = await api.post('/auth/otp/generate');
      if (resp.data.qrCodeUrl) {
        setOtpQrCode(resp.data.qrCodeUrl);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerifyOTP = async (token?: string) => {
    const otpToVerify = token || otpInput;
    try {
      const resp = await api.post('/auth/otp/verify', { token: otpToVerify });
      if (resp.data.verified) {
        setOtpStatus('OTP successfully verified and enabled!');
        setIsOtpEnabled(true);
      } else {
        setOtpStatus('Invalid OTP code. Please try again.');
      }
    } catch (err) {
      setOtpStatus('Error verifying OTP.');
    }
  };

  const handleDisableOTP = async () => {
    try {
      const resp = await api.post('/auth/otp/disable');
      if (resp.status === 200) {
        setIsOtpEnabled(false);
        setOtpQrCode('');
        setOtpInput('');
        setQrScanned(false);
        setOtpStatus('OTP disabled successfully.');
      }
    } catch (err) {
      console.error('Error disabling OTP', err);
    }
  };

  const { logout } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [{ data }, { data: otpData }] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/auth/otp/status').catch(() => ({ data: { otpEnabled: false } }))
        ]);

        setIsOtpEnabled(otpData.otpEnabled);

        setStudents((data.data.students || []).map((s: any) => ({
          ...s,
          id: s._id,
          name: s.user?.name || 'Unknown',
          email: s.user?.email || ''
        })));
        setEducators((data.data.educators || []).map((e: any) => ({
          ...e,
          id: e._id,
          name: e.user?.name || 'Unknown',
          email: e.user?.email || '',
          team: e.subjectSpecialization || '',
          mobile: e.mobileNumber || '',
          aadhaar: e.aadhaarNumber || '',
          dob: e.dateOfBirth ? new Date(e.dateOfBirth).toISOString().split('T')[0] : '',
          address: e.residentialAddress || '',
          qualification: e.highestQualification || ''
        })));
        setClasses(data.data.classes?.length ? data.data.classes : initialClasses);
        setAnnouncements(data.data.announcements || []);
        setTimetables(data.data.timetables || []);
        setFacultyAttendance(data.data.facultyAttendance || {});
        setFacultySalaries(data.data.facultySalaries || {});
        setClassFees(data.data.classFees || {});
        setStudentFees(data.data.studentFees || {});
        setLeaveRequests(data.data.leaveRequests || []);

        setIsLoaded(true);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
        // Fallback or navigate on 401 handled by interceptor
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    logout();
  };

  const handleMarkFacultyAttendance = (educatorId: string, status: string) => {
    const updatedAttendance = {
      ...facultyAttendance,
      [attendanceDate]: {
        ...(facultyAttendance[attendanceDate] || {}),
        [educatorId]: status
      }
    };
    setFacultyAttendance(updatedAttendance);
    api.patch('/admin/config', { facultyAttendance: updatedAttendance }).catch(console.error);
  };

  const handleUpdateFacultySalary = (educatorId: string, baseSalary: string, status: string) => {
    const updated = { ...facultySalaries, [educatorId]: { baseSalary, status } };
    setFacultySalaries(updated);
    api.patch('/admin/config', { facultySalaries: updated }).catch(console.error);
  };

  const handleUpdateClassFee = (className: string, feeAmount: string) => {
    const updated = { ...classFees, [className]: feeAmount };
    setClassFees(updated);
    api.patch('/admin/config', { classFees: updated }).catch(console.error);
  };

  /*
  const handleUpdateStudentFee = (studentId: string, paidAmount: string, status: string) => {
    const updated = { ...studentFees, [studentId]: { paidAmount, status } };
    setStudentFees(updated);
    api.patch('/admin/config', { studentFees: updated }).catch(console.error);
  };
  */

  const handleDeleteEducator = async (educatorId: string) => {
    if (window.confirm('Are you sure you want to delete this educator? This action cannot be undone.')) {
      try {
        await api.delete(`/admin/educators/${educatorId}`);
        setEducators(educators.filter(e => e.id !== educatorId));
      } catch (err) {
        console.error('Error deleting educator:', err);
        alert('Failed to delete educator. Please try again.');
      }
    }
  };

  const [isSubmittingEducator, setIsSubmittingEducator] = useState(false);

  const handleCreateEducator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newEducatorData.password !== newEducatorData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setIsSubmittingEducator(true);
    try {
      await api.post('/auth/register', {
        name: newEducatorData.name,
        email: newEducatorData.email,
        password: newEducatorData.password,
        role: 'educator',
        adminCreate: true,
        subjectSpecialization: newEducatorData.team,
        dateOfBirth: newEducatorData.dob,
        aadhaarNumber: newEducatorData.aadhaar,
        mobileNumber: newEducatorData.mobile,
        residentialAddress: newEducatorData.address,
        highestQualification: newEducatorData.qualification,
        salary: newEducatorData.salary ? Number(newEducatorData.salary) : 0,
        assignments: newEducatorData.initialClass && newEducatorData.initialSection && newEducatorData.initialSubject ? [{
          class: newEducatorData.initialClass,
          section: newEducatorData.initialSection,
          subject: newEducatorData.initialSubject
        }] : []
      });

      // Refetch dashboard data
      const { data } = await api.get('/admin/dashboard');
      setEducators((data.data.educators || []).map((e: any) => ({
        ...e,
        id: e._id,
        name: e.user?.name || 'Unknown',
        email: e.user?.email || '',
        team: e.subjectSpecialization || '',
        mobile: e.mobileNumber || '',
        aadhaar: e.aadhaarNumber || '',
        dob: e.dateOfBirth ? new Date(e.dateOfBirth).toISOString().split('T')[0] : '',
        address: e.residentialAddress || '',
        qualification: e.highestQualification || ''
      })));

      setShowAddEducatorModal(false);
      setNewEducatorData({
        name: '', team: '', dob: '', aadhaar: '', mobile: '', email: '', address: '', qualification: '', qualificationDoc: null, salary: '', initialClass: '', initialSection: '', initialSubject: '', password: '', confirmPassword: ''
      });
      setShowEducatorPassword(false);
    } catch (err) {
      console.error(err);
      alert('Error creating educator');
    } finally {
      setIsSubmittingEducator(false);
    }
  };

  const handleCreateStudent = async (newStudent: any) => {
    try {
      await api.post('/auth/register', {
        name: newStudent.name,
        email: newStudent.email,
        password: newStudent.password,
        role: 'student',
        adminCreate: true,
        course: newStudent.course,
        session: newStudent.session,
        status: newStudent.status,
        registrationNo: newStudent.id
      });

      // Refetch data
      const { data } = await api.get('/admin/dashboard');
      setStudents((data.data.students || []).map((s: any) => ({
        ...s,
        id: s._id,
        name: s.user?.name || 'Unknown',
        email: s.user?.email || ''
      })));

      // Don't close modal here, let StudentRegistrationForm handle it so Step 5 shows
    } catch (err) {
      console.error(err);
      alert('Error creating student');
      throw err; // throw so the form knows it failed
    }
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningEducatorId) return;

    const newAssignment = {
      class: assignClass,
      section: assignSection,
      subject: assignSubject
    };

    const updated = educators.map(ed => {
      if (ed.id === assigningEducatorId) {
        return { ...ed, assignments: [...(ed.assignments || []), newAssignment] };
      }
      return ed;
    });

    setEducators(updated);
    localStorage.setItem('global_educators', JSON.stringify(updated));
    setShowAssignModal(false);
    setAssignClass('');
    setAssignSection('');
    setAssignSubject('');
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    const announcement = {
      id: Date.now(),
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      visibility: newAnnouncement.visibility,
      date: new Date().toISOString()
    };
    const updated = [announcement, ...announcements];
    setAnnouncements(updated);
    localStorage.setItem('global_announcements', JSON.stringify(updated));
    setShowAddAnnouncementModal(false);
    setNewAnnouncement({ title: '', content: '', visibility: 'All' });
  };

  const handleCreateTimetable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTimetable.className || !newTimetable.section) return;
    if (!newTimetable.educatorId || !newTimetable.subject) return;
    if (!newTimetable.startTime || !newTimetable.endTime) return;

    const entry = {
      id: Date.now(),
      ...newTimetable
    };
    const updated = [entry, ...timetables];
    setTimetables(updated);
    localStorage.setItem('global_timetables', JSON.stringify(updated));
    setShowAddTimetableModal(false);
    setNewTimetable({ educatorId: '', day: 'Monday', period: '1', startTime: '', endTime: '', className: '', section: '', subject: '' });
  };

  const handleAddLunchBreak = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classTimetableFilterClass || !classTimetableFilterSection) return;
    if (!newLunchBreak.startTime || !newLunchBreak.endTime) return;

    const updated = timetables.filter(t => !(t.className === classTimetableFilterClass && t.section === classTimetableFilterSection && t.isGlobalLunchBreak));

    updated.push({
      id: Date.now(),
      className: classTimetableFilterClass,
      section: classTimetableFilterSection,
      isGlobalLunchBreak: true,
      afterPeriod: parseInt(newLunchBreak.afterPeriod),
      startTime: newLunchBreak.startTime,
      endTime: newLunchBreak.endTime
    });

    setTimetables(updated);
    localStorage.setItem('global_timetables', JSON.stringify(updated));
    setShowLunchBreakModal(false);
  };

  const handleDeleteTimetable = (id: number) => {
    const updated = timetables.filter(t => t.id !== id);
    setTimetables(updated);
    localStorage.setItem('global_timetables', JSON.stringify(updated));
  };

  const [toastMessage, setToastMessage] = useState<{title: string, type: 'success' | 'error'} | null>(null);
  const [isSavingTimetable, setIsSavingTimetable] = useState(false);
  const handleSaveTimetableToDatabase = async () => {
    setIsSavingTimetable(true);
    try {
      await api.patch('/admin/config', { timetables, classes });
      setToastMessage({ title: 'Timetable saved successfully!', type: 'success' });
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      console.error(err);
      setToastMessage({ title: 'Failed to save timetable.', type: 'error' });
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setIsSavingTimetable(false);
    }
  };

  const handleAddClass = () => {
    const className = prompt("Enter new Class Name (e.g., '13' or 'Pre-K'):");
    if (className && className.trim()) {
      const newClass = {
        id: Date.now(),
        className: className.trim(),
        sections: ["A"] // default section
      };
      const updated = [...classes, newClass];
      setClasses(updated);
      localStorage.setItem('global_classes', JSON.stringify(updated));
    }
  };

  const handleAddSection = (classId: number) => {
    const sectionName = newSectionInputs[classId]?.trim();
    if (!sectionName) return;

    const updated = classes.map(c => {
      if (c.id === classId) {
        if (!c.sections.includes(sectionName)) {
          return { ...c, sections: [...c.sections, sectionName] };
        }
      }
      return c;
    });

    setClasses(updated);
    localStorage.setItem('global_classes', JSON.stringify(updated));
    setNewSectionInputs({ ...newSectionInputs, [classId]: '' });
  };

  // const removeAssignment = (educatorId: number, index: number) => {
  //   const updated = educators.map(ed => {
  //     if (ed.id === educatorId) {
  //       const newAssignments = [...ed.assignments];
  //       newAssignments.splice(index, 1);
  //       return { ...ed, assignments: newAssignments };
  //     }
  //     return ed;
  //   });
  //   setEducators(updated);
  //   localStorage.setItem('global_educators', JSON.stringify(updated));
  // };

  const filteredStudents = students.filter(student => {
    let matches = true;
    if (studentFilterSession && student.session !== studentFilterSession) matches = false;

    const match = student.course?.match(/Class (.*?)-(.*)/);
    const sClass = match ? match[1] : '';
    const sSection = match ? match[2] : '';

    if (studentFilterClass && sClass !== studentFilterClass) matches = false;
    if (studentFilterSection && sSection !== studentFilterSection) matches = false;

    return matches;
  });

  const [isUpdatingEducator, setIsUpdatingEducator] = useState(false);

  const handleUpdateEducator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewingEducator) return;

    setIsUpdatingEducator(true);
    try {
      await api.patch(`/admin/educators/${viewingEducator.id}`, {
        name: viewingEducator.name,
        email: viewingEducator.email,
        team: viewingEducator.team,
        mobile: viewingEducator.mobile,
        aadhaar: viewingEducator.aadhaar,
        dob: viewingEducator.dob,
        address: viewingEducator.address,
        qualification: viewingEducator.qualification
      });

      const updated = educators.map(ed => ed.id === viewingEducator.id ? viewingEducator : ed);
      setEducators(updated);
      localStorage.setItem('global_educators', JSON.stringify(updated));
      setIsEditingEducator(false);
    } catch (error) {
      console.error('Error updating educator:', error);
      alert('Failed to update educator profile. Please try again.');
    } finally {
      setIsUpdatingEducator(false);
    }
  };

  const handleLeaveAction = async (id: string, status: 'Approved' | 'Rejected', reason?: string) => {
    try {
      const payload = { status, rejectionReason: reason || null };
      await api.patch(`/admin/leaves/${id}/status`, payload);

      setLeaveRequests(prev => prev.map(l =>
        l._id === id ? { ...l, status, rejectionReason: reason || null } : l
      ));

      setRejectLeaveId(null);
      setRejectionReason('');
    } catch (err) {
      console.error('Error updating leave status', err);
      alert('Failed to update leave status');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      {rejectLeaveId && (
        <div className="fixed inset-0 bg-[#1B1F3B]/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-bold text-[#1B1F3B] mb-2">Decline Leave Request</h3>
            <p className="text-sm text-gray-500 mb-6">Please provide a reason for declining this request.</p>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Reason</label>
                <textarea
                  value={rejectionReason}
                  onChange={e => setRejectionReason(e.target.value)}
                  className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none min-h-[100px]"
                  placeholder="e.g. Too many teachers on leave"
                  required
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button onClick={() => { setRejectLeaveId(null); setRejectionReason(''); }} className="flex-1 px-4 py-2.5 text-gray-500 font-semibold hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                <button onClick={() => { if (!rejectionReason.trim()) return alert('Please enter a reason'); handleLeaveAction(rejectLeaveId, 'Rejected', rejectionReason); }} className="flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors">Decline</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <RegistrationWizardAdmin onClose={() => setShowAddStudentModal(false)} onComplete={handleCreateStudent} />
      )}

      {/* Add Timetable Modal */}
      {showAddTimetableModal && (
        <div className="fixed inset-0 bg-[#1B1F3B]/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-bold text-[#1B1F3B] mb-6">Assign Staff Timetable</h3>
            <form onSubmit={handleCreateTimetable} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Educator</label>
                <select
                  required
                  value={newTimetable.educatorId}
                  onChange={e => {
                    const educator = educators.find(ed => ed.id.toString() === e.target.value);
                    setNewTimetable({
                      ...newTimetable,
                      educatorId: e.target.value,
                      subject: educator ? educator.team : ''
                    });
                  }}
                  className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none"
                >
                  <option value="">-- Select Educator --</option>
                  {educators.map(ed => (
                    <option key={ed.id} value={ed.id}>{ed.name} ({ed.team || 'No Subject'})</option>
                  ))}
                </select>
              </div>

              {activeTab === 'classTimetable' && (
                <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-indigo-500 font-bold uppercase mb-1">Assigning For</p>
                    <p className="font-bold text-[#1B1F3B]">Class {newTimetable.className}-{newTimetable.section} • {newTimetable.day}, Period {newTimetable.period}</p>
                  </div>
                </div>
              )}

              {activeTab !== 'classTimetable' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase">Day</label>
                      <select value={newTimetable.day} onChange={e => setNewTimetable({ ...newTimetable, day: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase">Period</label>
                      <select value={newTimetable.period} onChange={e => setNewTimetable({ ...newTimetable, period: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(p => (
                          <option key={p} value={p.toString()}>Period {p}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase">Class</label>
                      <select required value={newTimetable.className} onChange={e => setNewTimetable({ ...newTimetable, className: e.target.value, section: '' })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none">
                        <option value="">-- Class --</option>
                        {classes.map(c => (
                          <option key={c.id} value={c.className}>{c.className}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase">Section</label>
                      <select required value={newTimetable.section} onChange={e => setNewTimetable({ ...newTimetable, section: e.target.value })} disabled={!newTimetable.className} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none disabled:opacity-50">
                        <option value="">-- Section --</option>
                        {classes.find(c => c.className === newTimetable.className)?.sections.map((s: string) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Start Time</label>
                  <input type="time" required value={newTimetable.startTime} onChange={e => setNewTimetable({ ...newTimetable, startTime: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">End Time</label>
                  <input type="time" required value={newTimetable.endTime} onChange={e => setNewTimetable({ ...newTimetable, endTime: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Subject</label>
                <input required type="text" value={newTimetable.subject} onChange={e => setNewTimetable({ ...newTimetable, subject: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none" placeholder="e.g. Mathematics" />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowAddTimetableModal(false)} className="flex-1 px-4 py-2.5 text-gray-500 font-semibold hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-[#1B1F3B] text-white font-semibold rounded-xl hover:bg-[#D4AF37] hover:text-[#1B1F3B] transition-colors">Assign</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Lunch Break Modal */}
      {showLunchBreakModal && (
        <div className="fixed inset-0 bg-[#1B1F3B]/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-bold text-[#1B1F3B] mb-2">Add Lunch Break</h3>
            <p className="text-sm text-gray-500 mb-6">Class {classTimetableFilterClass}-{classTimetableFilterSection}</p>
            <form onSubmit={handleAddLunchBreak} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Insert After Period</label>
                <select required value={newLunchBreak.afterPeriod} onChange={e => setNewLunchBreak({ ...newLunchBreak, afterPeriod: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(p => (
                    <option key={p} value={p.toString()}>Period {p}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Start Time</label>
                  <input type="time" required value={newLunchBreak.startTime} onChange={e => setNewLunchBreak({ ...newLunchBreak, startTime: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">End Time</label>
                  <input type="time" required value={newLunchBreak.endTime} onChange={e => setNewLunchBreak({ ...newLunchBreak, endTime: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none" />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowLunchBreakModal(false)} className="flex-1 px-4 py-2.5 text-gray-500 font-semibold hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors">Add Break</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Announcement Modal */}
      {showAddAnnouncementModal && (
        <div className="fixed inset-0 bg-[#1B1F3B]/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-bold text-[#1B1F3B] mb-6">Create Announcement</h3>
            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Title</label>
                <input required type="text" value={newAnnouncement.title} onChange={e => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none" placeholder="e.g. Tomorrow is a Holiday" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Message</label>
                <textarea required rows={4} value={newAnnouncement.content} onChange={e => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none resize-none" placeholder="Message content..." />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Visibility</label>
                <select value={newAnnouncement.visibility} onChange={e => setNewAnnouncement({ ...newAnnouncement, visibility: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none">
                  <option value="All">All (Students & Educators)</option>
                  <option value="Students">Students Only</option>
                  <option value="Educators">Educators Only</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowAddAnnouncementModal(false)} className="flex-1 px-4 py-2.5 text-gray-500 font-semibold hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-[#1B1F3B] text-white font-semibold rounded-xl hover:bg-[#D4AF37] hover:text-[#1B1F3B] transition-colors">Broadcast</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Educator Modal */}
      {showAddEducatorModal && (
        <div className="fixed inset-0 bg-[#1B1F3B]/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 overflow-y-auto">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-4xl animate-in zoom-in-95 duration-300 my-8">
            <h3 className="text-2xl font-bold text-[#1B1F3B] mb-6">Register New Educator</h3>
            <form onSubmit={handleCreateEducator} className="space-y-6">

              {/* Personal Details Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Full Name</label>
                  <input required type="text" value={newEducatorData.name} onChange={e => setNewEducatorData({ ...newEducatorData, name: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none" placeholder="e.g. John Smith" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Subject Specialization</label>
                  <input required type="text" value={newEducatorData.team} onChange={e => setNewEducatorData({ ...newEducatorData, team: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none" placeholder="e.g. Mathematics" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Date of Birth</label>
                  <input required type="date" value={newEducatorData.dob} onChange={e => setNewEducatorData({ ...newEducatorData, dob: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none" />
                </div>
              </div>

              {/* Identification Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Aadhaar Number</label>
                  <input required type="text" value={newEducatorData.aadhaar} onChange={e => setNewEducatorData({ ...newEducatorData, aadhaar: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none" placeholder="XXXX-XXXX-XXXX" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Mobile Number</label>
                  <input required type="tel" value={newEducatorData.mobile} onChange={e => setNewEducatorData({ ...newEducatorData, mobile: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none" placeholder="+91" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Email Address</label>
                  <input required type="email" value={newEducatorData.email} onChange={e => setNewEducatorData({ ...newEducatorData, email: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none" placeholder="educator@school.edu" />
                </div>
              </div>

              {/* Address & Qualification */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Residential Address</label>
                  <textarea required rows={4} value={newEducatorData.address} onChange={e => setNewEducatorData({ ...newEducatorData, address: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none resize-none" placeholder="Full address..." />
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Highest Qualification</label>
                    <select required value={newEducatorData.qualification} onChange={e => setNewEducatorData({ ...newEducatorData, qualification: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none">
                      <option value="">Select Qualification</option>
                      <option value="B.Ed">B.Ed</option>
                      <option value="M.Ed">M.Ed</option>
                      <option value="PhD">PhD</option>
                      <option value="Masters">Masters</option>
                      <option value="Bachelors">Bachelors</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Upload Qualification Document</label>
                    <input type="file" className="w-full mt-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#D4AF37] file:text-[#1B1F3B] hover:file:bg-[#b5952f] transition-all" />
                  </div>
                </div>
              </div>

              {/* Salary Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Monthly Salary (₹)</label>
                  <input required type="number" min="0" value={newEducatorData.salary} onChange={e => setNewEducatorData({ ...newEducatorData, salary: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none" placeholder="e.g. 50000" />
                </div>
              </div>

              {/* Authentication Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Create Password</label>
                  <div className="relative">
                    <input required type={showEducatorPassword ? "text" : "password"} value={newEducatorData.password} onChange={e => setNewEducatorData({ ...newEducatorData, password: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none pr-10" placeholder="••••••••" />
                    <button type="button" onClick={() => setShowEducatorPassword(!showEducatorPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1B1F3B] transition-colors mt-0.5">
                      {showEducatorPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Confirm Password</label>
                  <div className="relative">
                    <input required type={showEducatorPassword ? "text" : "password"} value={newEducatorData.confirmPassword} onChange={e => setNewEducatorData({ ...newEducatorData, confirmPassword: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none pr-10" placeholder="••••••••" />
                    <button type="button" onClick={() => setShowEducatorPassword(!showEducatorPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1B1F3B] transition-colors mt-0.5">
                      {showEducatorPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setShowAddEducatorModal(false)} className="flex-1 px-6 py-3.5 text-gray-500 font-semibold hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                <button
                  type="submit"
                  disabled={isSubmittingEducator}
                  className="flex-1 px-6 py-3.5 bg-[#1B1F3B] text-white font-semibold rounded-xl hover:bg-[#D4AF37] hover:text-[#1B1F3B] transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmittingEducator ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Registering...
                    </>
                  ) : (
                    'Register Educator'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-[#1B1F3B]/40 backdrop-blur-sm flex items-center justify-center z-[100] animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-bold text-[#1B1F3B] mb-6">Assign Subject</h3>
            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Class (e.g. 10)</label>
                  <input required type="text" value={assignClass} onChange={e => setAssignClass(e.target.value)} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Section (e.g. A)</label>
                  <input required type="text" value={assignSection} onChange={e => setAssignSection(e.target.value)} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Subject</label>
                <select required value={assignSubject} onChange={e => setAssignSubject(e.target.value)} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none">
                  <option value="">-- Select Subject --</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowAssignModal(false)} className="flex-1 px-4 py-2.5 text-gray-500 font-semibold hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-[#1B1F3B] text-white font-semibold rounded-xl hover:bg-[#D4AF37] hover:text-[#1B1F3B] transition-colors">Save Assignment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View/Edit Educator Modal */}
      {viewingEducator && (
        <div className="fixed inset-0 bg-[#1B1F3B]/40 backdrop-blur-sm flex items-center justify-center z-[150] animate-in fade-in duration-300 overflow-y-auto p-4 py-10">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-2xl relative animate-in zoom-in-95 duration-300 my-auto">
            <button
              onClick={() => { setViewingEducator(null); setIsEditingEducator(false); }}
              className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors"
            >
              <X size={24} />
            </button>

            <div className="flex justify-between items-center mb-8 pr-10">
              <h3 className="text-2xl font-bold text-[#1B1F3B] flex items-center gap-3">
                {isEditingEducator ? <Edit size={24} className="text-[#D4AF37]" /> : <Eye size={24} className="text-[#D4AF37]" />}
                {isEditingEducator ? 'Edit Educator Profile' : 'Educator Profile'}
              </h3>
              {!isEditingEducator && (
                <button
                  onClick={() => setIsEditingEducator(true)}
                  className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-xl font-bold text-sm transition-colors flex items-center gap-2"
                >
                  <Edit size={16} /> Edit
                </button>
              )}
            </div>

            <form onSubmit={handleUpdateEducator} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Full Name</label>
                  {isEditingEducator ? (
                    <input required type="text" value={viewingEducator.name} onChange={e => setViewingEducator({ ...viewingEducator, name: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none" />
                  ) : (
                    <p className="mt-1 font-bold text-[#1B1F3B] text-lg">{viewingEducator.name}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Subject Specialization</label>
                  {isEditingEducator ? (
                    <input type="text" value={viewingEducator.team || ''} onChange={e => setViewingEducator({ ...viewingEducator, team: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none" />
                  ) : (
                    <p className="mt-1 font-bold text-[#1B1F3B] text-lg">{viewingEducator.team || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Mobile Number</label>
                  {isEditingEducator ? (
                    <input type="tel" value={viewingEducator.mobile || ''} onChange={e => setViewingEducator({ ...viewingEducator, mobile: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none" />
                  ) : (
                    <p className="mt-1 font-bold text-[#1B1F3B] text-lg">{viewingEducator.mobile || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Email Address</label>
                  {isEditingEducator ? (
                    <input type="email" value={viewingEducator.email || ''} onChange={e => setViewingEducator({ ...viewingEducator, email: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none" />
                  ) : (
                    <p className="mt-1 font-bold text-[#1B1F3B] text-lg">{viewingEducator.email || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Aadhaar Number</label>
                  {isEditingEducator ? (
                    <input type="text" value={viewingEducator.aadhaar || ''} onChange={e => setViewingEducator({ ...viewingEducator, aadhaar: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none" />
                  ) : (
                    <p className="mt-1 font-bold text-[#1B1F3B] text-lg">{viewingEducator.aadhaar || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Date of Birth</label>
                  {isEditingEducator ? (
                    <input type="date" value={viewingEducator.dob || ''} onChange={e => setViewingEducator({ ...viewingEducator, dob: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none" />
                  ) : (
                    <p className="mt-1 font-bold text-[#1B1F3B] text-lg">{viewingEducator.dob || 'N/A'}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Address</label>
                  {isEditingEducator ? (
                    <textarea value={viewingEducator.address || ''} onChange={e => setViewingEducator({ ...viewingEducator, address: e.target.value })} rows={3} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none resize-none" />
                  ) : (
                    <p className="mt-1 font-bold text-[#1B1F3B] text-lg">{viewingEducator.address || 'N/A'}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Highest Qualification</label>
                  {isEditingEducator ? (
                    <select value={viewingEducator.qualification || ''} onChange={e => setViewingEducator({ ...viewingEducator, qualification: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none">
                      <option value="">Select Qualification...</option>
                      <option value="B.Ed">B.Ed (Bachelor of Education)</option>
                      <option value="M.Ed">M.Ed (Master of Education)</option>
                      <option value="Ph.D">Ph.D in Education</option>
                      <option value="PGT">PGT (Post Graduate Teacher)</option>
                      <option value="TGT">TGT (Trained Graduate Teacher)</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <p className="mt-1 font-bold text-[#1B1F3B] text-lg">{viewingEducator.qualification || 'N/A'}</p>
                  )}
                </div>
              </div>

              {isEditingEducator && (
                <div className="pt-6 flex gap-4">
                  <button type="button" onClick={() => setIsEditingEducator(false)} className="flex-1 px-6 py-3.5 text-gray-500 font-semibold hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                  <button
                    type="submit"
                    disabled={isUpdatingEducator}
                    className="flex-1 px-6 py-3.5 bg-[#1B1F3B] text-white font-semibold rounded-xl hover:bg-[#D4AF37] hover:text-[#1B1F3B] transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isUpdatingEducator ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Top Navbar mimicking StudentDashboard Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-5 px-6 md:px-12 lg:px-16 bg-[#FAF9F6]/95 backdrop-blur-md shadow-sm">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          {/* Left Side: Menu Button + Logo */}
          <div className="flex items-center gap-6">
            <label className="w-10 h-10 bg-[#1B1F3B] hover:bg-[#D4AF37] flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all duration-300 active:scale-95 rounded-md shadow-sm shrink-0">
              <input
                className="peer hidden"
                type="checkbox"
                checked={isAdminDrawerOpen}
                onChange={(e) => setIsAdminDrawerOpen(e.target.checked)}
              />
              <div
                className="rounded-2xl h-[2px] w-5 bg-white duration-500 peer-checked:rotate-[225deg] origin-right peer-checked:-translate-x-[6px] peer-checked:-translate-y-[1px]"
                style={{ width: '12px', alignSelf: 'flex-start', marginLeft: '10px' }}
              ></div>
              <div
                className="rounded-2xl h-[2px] w-5 bg-white duration-500 peer-checked:-rotate-45"
              ></div>
              <div
                className="rounded-2xl h-[2px] w-5 bg-white duration-500 place-self-end peer-checked:rotate-[225deg] origin-left peer-checked:translate-x-[6px] peer-checked:translate-y-[1px]"
                style={{ width: '12px', alignSelf: 'flex-end', marginRight: '10px' }}
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
                placeholder="Search admin dashboard..."
                className="pl-10 pr-4 py-2 w-64 rounded-full border border-[#E5D3B3]/60 bg-white/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--crimson)]/30 focus:border-[var(--crimson)] text-sm transition-all duration-300 shadow-sm"
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <button
              className="w-10 h-10 rounded-full bg-white border border-[#E5D3B3]/60 flex items-center justify-center text-[#1B1F3B] hover:border-[#D4AF37] hover:text-[#D4AF37] hover:bg-[#1B1F3B] transition-all shadow-sm active:scale-95"
              title="Admin Profile"
            >
              <User size={18} />
            </button>
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
          </div>
        </div>
      </nav>

      {/* Slide-out Admin Drawer Panel */}
      <div
        className={`fixed inset-y-0 left-0 w-80 bg-[#FAF9F6] border-r border-[#E5D3B3]/40 shadow-2xl z-[300] transition-transform duration-300 ease-in-out transform flex flex-col ${isAdminDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#E5D3B3]/40 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1B1F3B] flex items-center justify-center">
              <Shield size={18} className="text-[#D4AF37]" />
            </div>
            <h3 className="font-bold text-lg text-[#1B1F3B]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Admin Panel
            </h3>
          </div>
          <button
            onClick={() => setIsAdminDrawerOpen(false)}
            className="w-8 h-8 rounded-full border border-black/5 flex items-center justify-center hover:bg-black/5 text-[#1B1F3B] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-2">
          <button onClick={() => { setActiveTab('overview'); setIsAdminDrawerOpen(false); }} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-[#D4AF37]/10 text-[#D4AF37] font-bold border border-[#D4AF37]/20' : 'text-gray-600 hover:bg-white'}`}>
            <LayoutDashboard size={18} /><span>Overview</span>
          </button>
          <button onClick={() => { setActiveTab('educators'); setIsAdminDrawerOpen(false); }} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === 'educators' ? 'bg-[#D4AF37]/10 text-[#D4AF37] font-bold border border-[#D4AF37]/20' : 'text-gray-600 hover:bg-white'}`}>
            <UserCheck size={18} /><span>Manage Educators</span>
          </button>
          <button onClick={() => { setActiveTab('students'); setIsAdminDrawerOpen(false); }} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === 'students' ? 'bg-[#D4AF37]/10 text-[#D4AF37] font-bold border border-[#D4AF37]/20' : 'text-gray-600 hover:bg-white'}`}>
            <Users size={18} /><span>Student Directory</span>
          </button>
          <button onClick={() => { setActiveTab('announcements'); setIsAdminDrawerOpen(false); }} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === 'announcements' ? 'bg-[#D4AF37]/10 text-[#D4AF37] font-bold border border-[#D4AF37]/20' : 'text-gray-600 hover:bg-white'}`}>
            <Megaphone size={18} /><span>Announcements</span>
          </button>
          <button onClick={() => { setActiveTab('classes'); setIsAdminDrawerOpen(false); }} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === 'classes' ? 'bg-[#D4AF37]/10 text-[#D4AF37] font-bold border border-[#D4AF37]/20' : 'text-gray-600 hover:bg-white'}`}>
            <School size={18} /><span>Manage Classes</span>
          </button>
          <button onClick={() => { setActiveTab('timetable'); setIsAdminDrawerOpen(false); }} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === 'timetable' ? 'bg-[#D4AF37]/10 text-[#D4AF37] font-bold border border-[#D4AF37]/20' : 'text-gray-600 hover:bg-white'}`}>
            <Calendar size={18} /><span>Staff Timetable</span>
          </button>
          <button onClick={() => { setActiveTab('classTimetable'); setIsAdminDrawerOpen(false); }} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === 'classTimetable' ? 'bg-[#D4AF37]/10 text-[#D4AF37] font-bold border border-[#D4AF37]/20' : 'text-gray-600 hover:bg-white'}`}>
            <BookOpen size={18} /><span>Class Timetable</span>
          </button>
          <button onClick={() => { setActiveTab('facultyAttendance'); setIsAdminDrawerOpen(false); }} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === 'facultyAttendance' ? 'bg-[#D4AF37]/10 text-[#D4AF37] font-bold border border-[#D4AF37]/20' : 'text-gray-600 hover:bg-white'}`}>
            <ClipboardCheck size={18} /><span>Faculty Attendance</span>
          </button>
          <button onClick={() => { setActiveTab('facultySalary'); setIsAdminDrawerOpen(false); }} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === 'facultySalary' ? 'bg-[#D4AF37]/10 text-[#D4AF37] font-bold border border-[#D4AF37]/20' : 'text-gray-600 hover:bg-white'}`}>
            <Wallet size={18} /><span>Faculty Salary</span>
          </button>
          <button onClick={() => { setActiveTab('studentFees'); setIsAdminDrawerOpen(false); }} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === 'studentFees' ? 'bg-[#D4AF37]/10 text-[#D4AF37] font-bold border border-[#D4AF37]/20' : 'text-gray-600 hover:bg-white'}`}>
            <IndianRupee size={18} /><span>Student Fees</span>
          </button>
          <button onClick={() => { setActiveTab('leaveRequests'); setIsAdminDrawerOpen(false); }} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === 'leaveRequests' ? 'bg-[#D4AF37]/10 text-[#D4AF37] font-bold border border-[#D4AF37]/20' : 'text-gray-600 hover:bg-white'}`}>
            <ClipboardCheck size={18} /><span>Leave Requests</span>
          </button>
          <button onClick={() => { setActiveTab('authentication'); setIsAdminDrawerOpen(false); }} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === 'authentication' ? 'bg-[#D4AF37]/10 text-[#D4AF37] font-bold border border-[#D4AF37]/20' : 'text-gray-600 hover:bg-white'}`}>
            <Shield size={18} /><span>Authentication</span>
          </button>
        </div>

        {/* Logout at bottom of drawer for mobile */}
        <div className="mt-auto p-6 sm:hidden border-t border-[#E5D3B3]/40">
          <button onClick={() => setShowSignOutModal(true)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors">
            <LogOut size={18} /><span>Logout</span>
          </button>
        </div>
      </div>

      {/* Backdrop overlay */}
      {isAdminDrawerOpen && (
        <div onClick={() => setIsAdminDrawerOpen(false)} className="fixed inset-0 bg-[#1B1F3B]/45 backdrop-blur-sm z-[290] animate-in fade-in duration-300" />
      )}
      {/* Main Content Area */}
      <main className={`flex-1 w-full flex flex-col transition-opacity duration-1000 delay-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>

        {/* Header Section */}
        <div className="pt-32 pb-8 max-w-[1400px] w-full mx-auto px-4 md:px-12 lg:px-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
                {activeTab === 'overview' ? 'Admin Overview' :
                  activeTab === 'educators' ? 'Educator Management' :
                    activeTab === 'announcements' ? 'School Announcements' :
                      activeTab === 'classes' ? 'Classes & Sections' :
                        activeTab === 'timetable' ? 'Staff Timetable' :
                          activeTab === 'classTimetable' ? 'Class Timetable' :
                            activeTab === 'facultyAttendance' ? 'Faculty Attendance' :
                              activeTab === 'facultySalary' ? 'Faculty Salary' :
                                activeTab === 'studentFees' ? 'Student Fees' :
                                  activeTab === 'leaveRequests' ? 'Leave Requests' :
                                    activeTab === 'authentication' ? 'Authentication Settings' : 'Student Directory'}
              </h2>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                {activeTab === 'overview' ? 'Comprehensive overview of your institution\'s performance and statistics.' :
                  activeTab === 'educators' ? 'Create educators and assign them to specific subjects.' :
                    activeTab === 'announcements' ? 'Broadcast important messages to students and educators.' :
                      activeTab === 'classes' ? 'Manage the school structure by defining classes and sections.' :
                        activeTab === 'timetable' ? 'Assign classes and subjects to teachers by period.' :
                          activeTab === 'classTimetable' ? 'Manage and view the complete timetable for each class.' :
                            activeTab === 'facultyAttendance' ? 'Mark and manage attendance for all faculty members.' :
                              activeTab === 'facultySalary' ? 'Manage salaries and payment status for faculty members.' :
                                activeTab === 'studentFees' ? 'Set class fees and manage student fee payments.' :
                                  activeTab === 'leaveRequests' ? 'Review and manage staff leave requests.' :
                                    activeTab === 'authentication' ? 'Manage secure access, biometrics, and 2FA.' : 'View all registered students in the system.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-9 pr-4 py-2 bg-white border border-black/10 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[var(--crimson)]/30 focus:border-[var(--crimson)] transition-all w-full sm:w-64"
                />
              </div>
              {activeTab === 'classes' && (
                <button
                  onClick={handleAddClass}
                  className="bg-[#1B1F3B] hover:bg-[#D4AF37] text-white hover:text-[#1B1F3B] px-5 py-2 rounded-full text-sm font-bold transition-colors shadow-sm flex items-center gap-2"
                >
                  <Plus size={16} /> Add Class
                </button>
              )}
              {activeTab === 'educators' && (
                <button
                  onClick={() => setShowAddEducatorModal(true)}
                  className="bg-[#1B1F3B] hover:bg-[#D4AF37] text-white hover:text-[#1B1F3B] px-5 py-2 rounded-full text-sm font-bold transition-colors shadow-sm flex items-center gap-2"
                >
                  <UserPlus size={16} /> Add Educator
                </button>
              )}
              {activeTab === 'announcements' && (
                <button
                  onClick={() => setShowAddAnnouncementModal(true)}
                  className="bg-[#1B1F3B] hover:bg-[#D4AF37] text-white hover:text-[#1B1F3B] px-5 py-2 rounded-full text-sm font-bold transition-colors shadow-sm flex items-center gap-2"
                >
                  <Megaphone size={16} /> New Broadcast
                </button>
              )}
              {activeTab === 'timetable' && (
                <button
                  onClick={() => setShowAddTimetableModal(true)}
                  className="bg-[#1B1F3B] hover:bg-[#D4AF37] text-white hover:text-[#1B1F3B] px-5 py-2 rounded-full text-sm font-bold transition-colors shadow-sm flex items-center gap-2"
                >
                  <Plus size={16} /> Assign Period
                </button>
              )}
              {(!['classes', 'educators', 'announcements', 'timetable', 'classTimetable', 'facultyAttendance', 'facultySalary', 'studentFees'].includes(activeTab) || activeTab === 'students') && (
                <button
                  onClick={() => setShowAddStudentModal(true)}
                  className="bg-[#1B1F3B] hover:bg-[#D4AF37] text-white hover:text-[#1B1F3B] px-5 py-2 rounded-full text-sm font-bold transition-colors shadow-sm flex items-center gap-2"
                >
                  <Plus size={16} /> Register Student
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Wrap */}
        <div className="max-w-[1400px] mx-auto px-4 md:px-12 lg:px-16 pb-20 w-full">

          {activeTab === 'overview' && (
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
                  <p className="text-sm text-gray-500 font-medium mb-1">Total Students</p>
                  <h3 className="text-3xl font-bold text-[#1B1F3B]">{students.length}</h3>
                  <p className="text-xs text-green-600 font-bold mt-2 flex items-center gap-1">
                    <TrendingUp size={12} /> +12% this month
                  </p>
                </div>

                <div className="bg-white rounded-[24px] border border-black/5 p-6 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <UserCheck size={64} />
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#D4AF37] flex items-center justify-center mb-4">
                    <UserCheck size={24} />
                  </div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Total Educators</p>
                  <h3 className="text-3xl font-bold text-[#1B1F3B]">{educators.length}</h3>
                  <p className="text-xs text-green-600 font-bold mt-2 flex items-center gap-1">
                    <TrendingUp size={12} /> +2 new joined
                  </p>
                </div>

                <div className="bg-white rounded-[24px] border border-black/5 p-6 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <School size={64} />
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                    <School size={24} />
                  </div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Active Classes</p>
                  <h3 className="text-3xl font-bold text-[#1B1F3B]">{classes.length}</h3>
                  <p className="text-xs text-gray-400 font-bold mt-2 flex items-center gap-1">
                    Across all grades
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
                    <Activity size={12} /> High engagement
                  </p>
                </div>
              </div>

              {/* Visuals Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Institutional Attendance */}
                <div className="bg-white rounded-[24px] border border-black/5 p-8 shadow-sm flex flex-col items-center justify-center">
                  <h3 className="text-lg font-bold text-[#1B1F3B] w-full text-left mb-8 flex items-center gap-2">
                    <ClipboardCheck className="text-[#D4AF37]" size={20} /> Overall Attendance
                  </h3>
                  <div className="relative w-48 h-48">
                    <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" className="stroke-gray-100" strokeWidth="12" fill="none" />
                      <circle cx="50" cy="50" r="40" className="stroke-[#D4AF37]" strokeWidth="12" fill="none" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * 94) / 100} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 2s ease-in-out' }} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold text-[#1B1F3B]">94%</span>
                      <span className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">Present</span>
                    </div>
                  </div>
                  <div className="flex gap-8 mt-8 w-full justify-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#D4AF37]"></div>
                      <span className="text-sm text-gray-600 font-bold">Present (94%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-100"></div>
                      <span className="text-sm text-gray-600 font-bold">Absent (6%)</span>
                    </div>
                  </div>
                </div>

                {/* Fees Collection Overview */}
                <div className="bg-white rounded-[24px] border border-black/5 p-8 shadow-sm flex flex-col justify-center">
                  <h3 className="text-lg font-bold text-[#1B1F3B] mb-8 flex items-center gap-2">
                    <IndianRupee className="text-green-600" size={20} /> Fees Collection Status
                  </h3>

                  <div className="space-y-8">
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase">Target (Q1)</p>
                          <p className="text-2xl font-bold text-[#1B1F3B]">₹12,50,000</p>
                        </div>
                        <p className="text-sm font-bold text-green-600">85% Collected</p>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                        <div className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border border-green-100 bg-green-50/50">
                        <p className="text-xs text-green-600 font-bold mb-1">Collected</p>
                        <p className="text-lg font-bold text-[#1B1F3B]">₹10,62,500</p>
                      </div>
                      <div className="p-4 rounded-xl border border-red-100 bg-red-50/50">
                        <p className="text-xs text-red-600 font-bold mb-1">Pending</p>
                        <p className="text-lg font-bold text-[#1B1F3B]">₹1,87,500</p>
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
                    <button onClick={() => setActiveTab('announcements')} className="text-sm font-bold text-[#D4AF37] hover:underline">View All</button>
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
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{a.message}</p>
                            <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase">{a.date}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Recent Registrations */}
                <div className="bg-white rounded-[24px] border border-black/5 p-8 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-[#1B1F3B] flex items-center gap-2">
                      <UserPlus className="text-purple-500" size={20} /> Recent Registrations
                    </h3>
                    <button onClick={() => setActiveTab('students')} className="text-sm font-bold text-[#D4AF37] hover:underline">View All</button>
                  </div>
                  <div className="space-y-4">
                    {students.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">No students registered yet.</p>
                    ) : (
                      [...students].reverse().slice(0, 3).map((s, i) => (
                        <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors items-center">
                          <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center shrink-0 text-purple-600 font-bold text-sm">
                            {s.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-[#1B1F3B] text-sm">{s.name}</h4>
                            <p className="text-xs text-gray-500 mt-1">Class {s.class} - {s.section}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-bold px-2 py-1 bg-green-100 text-green-700 rounded-full uppercase">Active</span>
                            <p className="text-[10px] text-gray-400 font-bold mt-1">ID: {s.regNo}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'educators' && (() => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const activeLeaves = leaveRequests.filter((leave: any) => {
              if (leave.status !== 'Approved') return false;
              const start = new Date(leave.startDate);
              start.setHours(0, 0, 0, 0);
              const end = new Date(leave.endDate);
              end.setHours(23, 59, 59, 999);
              return today >= start && today <= end;
            });

            return (
              <div className="flex flex-col xl:flex-row gap-6">
                <div className="flex-1 space-y-6">
                  {educators.map(educator => (
                    <div key={educator.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col md:flex-row gap-6">
                      {/* Educator Info */}
                      <div className="w-full flex flex-col justify-center">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-2xl shrink-0">
                            {educator.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-[#1B1F3B] text-xl leading-tight">{educator.name}</h4>
                            <p className="text-sm font-semibold text-[#D4AF37] mt-0.5">{educator.team || 'No Specialization'}</p>
                            <p className="text-xs text-gray-400 mt-1">ID: ED-{(parseInt(educator.id.slice(-8), 16) % 1000000).toString().padStart(6, '0')}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => { setViewingEducator(educator); setIsEditingEducator(false); }}
                              className="px-6 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-sm font-bold transition-colors flex justify-center items-center gap-2"
                            >
                              <Eye size={16} /> View
                            </button>
                            <button
                              onClick={() => { setViewingEducator(educator); setIsEditingEducator(true); }}
                              className="px-6 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-sm font-bold transition-colors flex justify-center items-center gap-2"
                            >
                              <Edit size={16} /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteEducator(educator.id)}
                              className="px-6 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-bold transition-colors flex justify-center items-center gap-2"
                            >
                              <Trash2 size={16} /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Aside: Educators on Leave */}
                <div className="w-full xl:w-80 shrink-0">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-28">
                    <h3 className="font-bold text-[#1B1F3B] mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                      On Leave Today
                    </h3>
                    {activeLeaves.length === 0 ? (
                      <p className="text-sm text-gray-500 italic bg-gray-50 p-4 rounded-xl border border-gray-100">No educators are currently on leave.</p>
                    ) : (
                      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {activeLeaves.map((leave: any) => (
                          <div key={leave._id} className="p-4 rounded-xl bg-orange-50/50 border border-orange-100/50 hover:bg-orange-50 transition-colors">
                            <p className="font-bold text-[#1B1F3B] text-sm">{leave.educatorId?.name || 'Unknown Educator'}</p>
                            <p className="text-xs text-orange-600 font-medium mt-1">
                              {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-[10px] font-bold px-2 py-0.5 bg-white text-gray-600 rounded-md border border-gray-100">
                                {leave.isSickLeave ? 'Sick Leave' : 'Casual Leave'}
                              </span>
                              <p className="text-xs text-gray-500 truncate" title={leave.reason}>{leave.reason}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {activeTab === 'students' && (
            <div className="space-y-6">

              {/* Filtering Bar */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex gap-4 items-end">
                <div className="flex-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Session</label>
                  <select value={studentFilterSession} onChange={e => setStudentFilterSession(e.target.value)} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none font-medium">
                    <option value="">All Sessions</option>
                    <option value="2023-2024">2023-2024</option>
                    <option value="2024-2025">2024-2025</option>
                    <option value="2025-2026">2025-2026</option>
                    <option value="2026-2027">2026-2027</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Class</label>
                  <select value={studentFilterClass} onChange={e => { setStudentFilterClass(e.target.value); setStudentFilterSection(''); }} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none font-medium">
                    <option value="">All Classes</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.className}>Class {c.className}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Section</label>
                  <select value={studentFilterSection} onChange={e => setStudentFilterSection(e.target.value)} disabled={!studentFilterClass} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none disabled:opacity-50 font-medium">
                    <option value="">All Sections</option>
                    {classes.find(c => c.className === studentFilterClass)?.sections.map((s: string) => (
                      <option key={s} value={s}>Section {s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-[#F5F6FA]">
                    <tr>
                      <th className="px-8 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student Profile</th>
                      <th className="px-8 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Session</th>
                      <th className="px-8 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Class / Grade</th>
                      <th className="px-8 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredStudents.length > 0 ? filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#1B1F3B]/5 flex items-center justify-center text-[#1B1F3B] font-bold">
                              {student.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-[#1B1F3B]">{student.name}</p>
                              <p className="text-sm text-gray-500">{student.email}</p>
                              <p className="text-xs text-gray-400 font-mono mt-0.5 tracking-wider">{formatStudentId(student.registrationNo || student.id)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-gray-500 text-sm">{student.session || 'N/A'}</span>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-gray-700 font-medium">{student.course}</span>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`px-3 py-1 text-xs font-bold rounded-full ${student.status === 'Active' ? 'bg-green-100 text-green-700' :
                            student.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                            {student.status}
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="px-8 py-10 text-center text-gray-500 font-medium">
                          No students found matching these filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'classes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {classes.map(cls => (
                <div key={cls.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-bl-full -z-0 opacity-50 group-hover:bg-[#D4AF37]/10 transition-colors" />

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#1B1F3B] text-[#D4AF37] flex items-center justify-center">
                        <School size={24} />
                      </div>
                      <h3 className="text-2xl font-bold text-[#1B1F3B]">Class {cls.className}</h3>
                    </div>

                    <div className="mb-6">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Sections</p>
                      <div className="flex flex-wrap gap-2">
                        {cls.sections.map((sec: string, idx: number) => (
                          <span key={idx} className="bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold px-3 py-1 rounded-lg text-sm shadow-sm">
                            {sec}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex gap-2">
                      <input
                        type="text"
                        placeholder="New Sec (e.g. D)"
                        value={newSectionInputs[cls.id] || ''}
                        onChange={e => setNewSectionInputs({ ...newSectionInputs, [cls.id]: e.target.value })}
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#D4AF37] outline-none uppercase font-semibold"
                        maxLength={5}
                      />
                      <button
                        onClick={() => handleAddSection(cls.id)}
                        className="bg-[#1B1F3B] text-white hover:bg-[#D4AF37] hover:text-[#1B1F3B] w-10 h-10 rounded-lg flex items-center justify-center transition-colors font-bold shadow-sm"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'announcements' && (
            <div className="space-y-4">
              {announcements.length === 0 ? (
                <div className="text-center text-gray-500 p-10 bg-white rounded-2xl border border-gray-100">No announcements yet.</div>
              ) : (
                announcements.map((ann, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-gray-100 p-6 flex gap-4 items-start shadow-sm hover:shadow-md transition-all">
                    <div className={`p-3 rounded-full ${ann.visibility === 'Students' ? 'bg-blue-100 text-blue-600' : ann.visibility === 'Educators' ? 'bg-purple-100 text-purple-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      <Megaphone size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-xl font-bold text-[#1B1F3B]">{ann.title}</h4>
                        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{new Date(ann.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-600 mb-4">{ann.content}</p>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${ann.visibility === 'Students' ? 'border-blue-200 text-blue-600' : ann.visibility === 'Educators' ? 'border-purple-200 text-purple-600' : 'border-emerald-200 text-emerald-600'}`}>
                        Visible to: {ann.visibility}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'timetable' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-[#F5F6FA]">
                  <tr>
                    <th className="px-8 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Educator</th>
                    <th className="px-8 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Day & Period</th>
                    <th className="px-8 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Class & Subject</th>
                    <th className="px-8 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {timetables.filter(t => !t.isGlobalLunchBreak).length > 0 ? timetables.filter(t => !t.isGlobalLunchBreak).map((entry) => {
                    const educator = entry.educatorId ? educators.find(ed => ed.id.toString() === entry.educatorId.toString()) : null;
                    return (
                      <tr key={entry.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold">
                              {entry.isLunchBreak ? '🥪' : educator?.name?.charAt(0) || '?'}
                            </div>
                            <div>
                              <p className="font-bold text-[#1B1F3B]">{entry.isLunchBreak ? 'Lunch Break' : educator?.name || 'Unknown'}</p>
                              <p className="text-sm text-gray-500">{entry.isLunchBreak ? 'Break Time' : educator?.team || 'N/A'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <p className="font-bold text-[#1B1F3B]">{entry.day}</p>
                          <p className="text-sm text-[#D4AF37] font-semibold">Period {entry.period}</p>
                          {(entry.startTime || entry.endTime) && (
                            <p className="text-xs text-gray-500 mt-0.5">{entry.startTime} - {entry.endTime}</p>
                          )}
                        </td>
                        <td className="px-8 py-5">
                          <p className="font-bold text-[#1B1F3B]">Class {entry.className} - {entry.section}</p>
                          <p className="text-sm text-gray-500">{entry.subject}</p>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button
                            onClick={() => handleDeleteTimetable(entry.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-block"
                            title="Remove"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan={4} className="px-8 py-10 text-center text-gray-500 font-medium">
                        No timetable assignments found. Click "Assign Period" to add one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'classTimetable' && (() => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const activeLeaves = leaveRequests.filter((leave: any) => {
              if (leave.status !== 'Approved') return false;
              const start = new Date(leave.startDate);
              start.setHours(0, 0, 0, 0);
              const end = new Date(leave.endDate);
              end.setHours(23, 59, 59, 999);
              return today >= start && today <= end;
            });

            const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const currentDayName = daysOfWeek[new Date().getDay()];

            // Find missing classes today due to leave
            const missingClassesToday = timetables.filter(t =>
              t.day === currentDayName &&
              !t.isGlobalLunchBreak &&
              activeLeaves.some((l: any) =>
                l.educatorId?._id?.toString() === t.educatorId?.toString() ||
                l.educatorId?.id?.toString() === t.educatorId?.toString() ||
                l.educatorId?.toString() === t.educatorId?.toString()
              )
            );

            return (
              <div className="space-y-6">
                {missingClassesToday.length > 0 && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-xl shadow-sm">
                    <h3 className="font-bold text-red-700 flex items-center gap-2 mb-3 text-lg">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
                      Important: Educator Absent Today
                    </h3>
                    <div className="space-y-3">
                      {missingClassesToday.map((t, idx) => {
                        const leave = activeLeaves.find((l: any) =>
                          l.educatorId?._id?.toString() === t.educatorId?.toString() ||
                          l.educatorId?.id?.toString() === t.educatorId?.toString() ||
                          l.educatorId?.toString() === t.educatorId?.toString()
                        );
                        const educatorName = leave?.educatorId?.name || 'Unknown Educator';
                        return (
                          <div key={idx} className="bg-white/60 rounded-lg p-3 border border-red-100 flex flex-col md:flex-row md:items-center gap-2">
                            <p className="text-sm text-red-800 flex-1">
                              The educator <span className="font-bold">{educatorName}</span> is on leave.
                              Please assign any other educator on their behalf.
                            </p>
                            <div className="text-sm font-bold bg-white px-3 py-1.5 rounded-md shadow-sm border border-red-100 text-red-600">
                              Empty slot: Class {t.className} Section {t.section} - Period {t.period} ({t.subject})
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Filtering Bar */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex gap-4 items-end flex-wrap">
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Class</label>
                    <select value={classTimetableFilterClass} onChange={e => { setClassTimetableFilterClass(e.target.value); setClassTimetableFilterSection(''); }} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none font-medium">
                      <option value="">Select Class</option>
                      {classes.map(c => (
                        <option key={c.id} value={c.className}>Class {c.className}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Section</label>
                    <select value={classTimetableFilterSection} onChange={e => setClassTimetableFilterSection(e.target.value)} disabled={!classTimetableFilterClass} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none disabled:opacity-50 font-medium">
                      <option value="">Select Section</option>
                      {classes.find(c => c.className === classTimetableFilterClass)?.sections.map((s: string) => (
                        <option key={s} value={s}>Section {s}</option>
                      ))}
                    </select>
                  </div>

                  {classTimetableFilterClass && classTimetableFilterSection && (
                    <div className="flex-1 min-w-[200px] animate-in fade-in duration-300">
                      <label className="text-xs font-semibold text-gray-500 uppercase">Class Teacher <span className="text-[10px] lowercase font-normal">(Auto-saves)</span></label>
                      <select 
                        value={classes.find(c => c.className === classTimetableFilterClass)?.classTeachers?.[classTimetableFilterSection] || ''}
                        onChange={async (e) => {
                          const val = e.target.value;
                          const updatedClasses = classes.map(c => {
                            if (c.className === classTimetableFilterClass) {
                              return {
                                ...c,
                                classTeachers: {
                                  ...(c.classTeachers || {}),
                                  [classTimetableFilterSection]: val
                                }
                              };
                            }
                            return c;
                          });
                          setClasses(updatedClasses);
                          localStorage.setItem('global_classes', JSON.stringify(updatedClasses));
                          try {
                            await api.patch('/admin/config', { classes: updatedClasses });
                            setToastMessage({ title: 'Class Teacher assigned!', type: 'success' });
                            setTimeout(() => setToastMessage(null), 3000);
                          } catch(err) {
                            console.error(err);
                          }
                        }}
                        className="w-full mt-1 px-4 py-2.5 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium transition-colors cursor-pointer"
                      >
                        <option value="">Unassigned</option>
                        {educators.map(ed => (
                          <option key={ed.id} value={ed.id.toString()}>{ed.name} ({ed.subject})</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3">
                    {classTimetableFilterClass && classTimetableFilterSection && (
                      <button
                        onClick={() => setShowLunchBreakModal(true)}
                        className="h-[46px] px-6 bg-orange-50 text-orange-600 font-bold rounded-xl border border-orange-200 hover:bg-orange-100 transition-colors flex items-center gap-2"
                      >
                        🥪 Insert Lunch Break
                      </button>
                    )}
                    <button
                      onClick={handleSaveTimetableToDatabase}
                      disabled={isSavingTimetable}
                      className="h-[46px] px-6 bg-[#1B1F3B] hover:bg-[#D4AF37] text-white hover:text-[#1B1F3B] font-bold rounded-xl transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSavingTimetable ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>

                {classTimetableFilterClass && classTimetableFilterSection ? (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                      <thead className="bg-[#F5F6FA]">
                        <tr>
                          <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 text-center w-24">Day</th>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(p => {
                            const classLunchBreak = timetables.find(t => t.className === classTimetableFilterClass && t.section === classTimetableFilterSection && t.isGlobalLunchBreak);
                            return (
                              <React.Fragment key={p}>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 text-center">Period {p}</th>
                                {classLunchBreak?.afterPeriod === p && (
                                  <th className="px-4 py-4 text-xs font-semibold text-orange-600 uppercase tracking-wider border-b border-orange-200 text-center bg-orange-50/50">
                                    Lunch Break<br /><span className="text-[10px] font-medium text-orange-500">{classLunchBreak.startTime} - {classLunchBreak.endTime}</span>
                                  </th>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                          <tr key={day} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-4 py-5 font-bold text-[#1B1F3B] border-r border-gray-100 text-center">{day.substring(0, 3)}</td>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(p => {
                              const classLunchBreak = timetables.find(t => t.className === classTimetableFilterClass && t.section === classTimetableFilterSection && t.isGlobalLunchBreak);
                              const entry = timetables.find(t => t.className === classTimetableFilterClass && t.section === classTimetableFilterSection && t.day === day && t.period === p.toString() && !t.isGlobalLunchBreak);
                              const educator = entry?.educatorId ? educators.find(ed => ed.id.toString() === entry.educatorId.toString()) : null;

                              return (
                                <React.Fragment key={p}>
                                  <td className="px-2 py-3 border-r border-gray-100 align-top">
                                    {entry ? (
                                      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex flex-col gap-1 relative group h-full">
                                        <p className="font-bold text-[#1B1F3B] text-sm leading-tight">{entry.subject}</p>
                                        <p className="text-xs text-indigo-700 font-semibold">{educator?.name || 'Unknown'}</p>
                                        {(entry.startTime || entry.endTime) && (
                                          <p className="text-[10px] text-gray-500 mt-auto pt-1 border-t border-indigo-200/50">
                                            {entry.startTime} - {entry.endTime}
                                          </p>
                                        )}
                                        <button
                                          onClick={() => handleDeleteTimetable(entry.id)}
                                          className="absolute top-2 right-2 p-1 bg-white text-gray-400 hover:text-red-500 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                          title="Remove Period"
                                        >
                                          <Trash2 size={12} />
                                        </button>
                                      </div>
                                    ) : (
                                      <div
                                        className="h-full min-h-[80px] rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-[#D4AF37] hover:text-[#D4AF37] cursor-pointer transition-colors"
                                        onClick={() => {
                                          setNewTimetable({ educatorId: '', day, period: p.toString(), startTime: '', endTime: '', className: classTimetableFilterClass, section: classTimetableFilterSection, subject: '' });
                                          setShowAddTimetableModal(true);
                                        }}
                                      >
                                        <Plus size={20} className="mb-1" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Assign</span>
                                      </div>
                                    )}
                                  </td>
                                  {classLunchBreak?.afterPeriod === p && (
                                    <td className="px-2 py-3 border-r border-gray-100 align-middle bg-orange-50/30 group relative">
                                      <div className="flex flex-col items-center justify-center text-orange-300">
                                        <span className="text-2xl opacity-60">🥪</span>
                                        <button
                                          onClick={() => handleDeleteTimetable(classLunchBreak.id)}
                                          className="absolute top-2 right-2 p-1 bg-white text-gray-400 hover:text-red-500 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                          title="Remove Lunch Break"
                                        >
                                          <Trash2 size={12} />
                                        </button>
                                      </div>
                                    </td>
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl p-10 text-center text-gray-500 shadow-sm border border-gray-100">
                    Please select a Class and Section to view the timetable.
                  </div>
                )}
              </div>
            );
          })()}

          {activeTab === 'facultyAttendance' && (
            <div className="space-y-6">
              {/* Controls */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#1B1F3B]">Mark Attendance</h3>
                  <p className="text-sm text-gray-500 mt-1">Select a date to view or mark faculty attendance.</p>
                </div>
                <div className="flex items-center gap-4">
                  <label className="text-sm font-semibold text-gray-600">Select Date:</label>
                  <input
                    type="date"
                    value={attendanceDate}
                    max={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none bg-gray-50 font-medium"
                  />
                  <button
                    onClick={() => setShowExportModal(true)}
                    className="animated-download-btn"
                    type="button"
                  >
                    <span className="animated-download-btn__text">Export CSV</span>
                    <span className="animated-download-btn__icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 35" id="bdd05811-e15d-428c-bb53-8661459f9307" data-name="Layer 2" className="svg"><path d="M17.5,22.131a1.249,1.249,0,0,1-1.25-1.25V2.187a1.25,1.25,0,0,1,2.5,0V20.881A1.25,1.25,0,0,1,17.5,22.131Z"></path><path d="M17.5,22.693a3.189,3.189,0,0,1-2.262-.936L8.487,15.006a1.249,1.249,0,0,1,1.767-1.767l6.751,6.751a.7.7,0,0,0,.99,0l6.751-6.751a1.25,1.25,0,0,1,1.768,1.767l-6.752,6.751A3.191,3.191,0,0,1,17.5,22.693Z"></path><path d="M31.436,34.063H3.564A3.318,3.318,0,0,1,.25,30.749V22.011a1.25,1.25,0,0,1,2.5,0v8.738a.815.815,0,0,0,.814.814H31.436a.815.815,0,0,0,.814-.814V22.011a1.25,1.25,0,1,1,2.5,0v8.738A3.318,3.318,0,0,1,31.436,34.063Z"></path></svg>
                    </span>
                  </button>
                </div>
              </div>

              {/* Teachers on Leave Section */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                <h3 className="text-md font-bold text-[#1B1F3B] mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                  Teachers on Leave Today
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-orange-100 bg-orange-50/50">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                      S
                    </div>
                    <div>
                      <p className="font-bold text-[#1B1F3B] text-sm">Sneha Sharma</p>
                      <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">English • Sick Leave</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-orange-100 bg-orange-50/50">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                      A
                    </div>
                    <div>
                      <p className="font-bold text-[#1B1F3B] text-sm">Amit Patel</p>
                      <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Physics • Personal Leave</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attendance Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#F5F6FA]">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Faculty Name</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Department / Subject</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {educators.map(educator => {
                      const currentStatus = facultyAttendance[attendanceDate]?.[educator.id] || 'Not Marked';

                      return (
                        <tr key={educator.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-bold shadow-sm">
                                {educator.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-[#1B1F3B]">{educator.name}</p>
                                <p className="text-xs text-gray-500">{educator.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {educator.team || 'Unassigned'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <label className="attendance-switch transform scale-90 sm:scale-100 origin-center">
                              <input
                                type="checkbox"
                                checked={currentStatus === 'Present'}
                                onChange={(e) => handleMarkFacultyAttendance(educator.id, e.target.checked ? 'Present' : 'Absent')}
                              />
                              <span className="slider"></span>
                            </label>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4 mt-2">
                <button
                  className="animated-save-btn"
                  onClick={(e) => {
                    const btn = e.currentTarget;
                    const span = btn.querySelector('span');
                    if (span) {
                      span.innerText = 'Saving...';
                      btn.classList.add('opacity-80', 'cursor-not-allowed', 'pointer-events-none');

                      setTimeout(() => {
                        span.innerText = 'Saved!';
                        btn.classList.remove('opacity-80', 'cursor-not-allowed', 'pointer-events-none');

                        setTimeout(() => {
                          span.innerText = 'Save';
                        }, 2000);
                      }, 800);
                    }
                  }}
                >
                  <div className="svg-wrapper-1">
                    <div className="svg-wrapper">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="22"
                        height="22"
                        className="icon"
                      >
                        <path d="M22,15.04C22,17.23 20.24,19 18.07,19H5.93C3.76,19 2,17.23 2,15.04C2,13.07 3.43,11.44 5.31,11.14C5.28,11 5.27,10.86 5.27,10.71C5.27,9.33 6.38,8.2 7.76,8.2C8.37,8.2 8.94,8.43 9.37,8.8C10.14,7.05 11.13,5.44 13.91,5.44C17.28,5.44 18.87,8.06 18.87,10.83C18.87,10.94 18.87,11.06 18.86,11.17C20.65,11.54 22,13.13 22,15.04Z"></path>
                      </svg>
                    </div>
                  </div>
                  <span>Save</span>
                </button>
              </div>
            </div>
          )}

          {/* Export Report Modal */}
          {showExportModal && (
            <div className="fixed inset-0 bg-[#1B1F3B]/45 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animate-in fade-in duration-300">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 w-full max-w-sm animate-in zoom-in-95 duration-300 relative">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#1B1F3B] flex items-center gap-2">
                    <Download className="text-[#D4AF37]" size={20} />
                    Export Report
                  </h3>
                  <button onClick={() => setShowExportModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Select Date for Export</label>
                    <input
                      type="date"
                      value={exportDate}
                      min={new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString().split('T')[0]}
                      max={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setExportDate(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none bg-gray-50 font-medium"
                    />
                    <p className="text-xs text-gray-400 mt-2">You can only download reports for the last 3 months.</p>
                  </div>

                  <button
                    onClick={() => {
                      const selected = new Date(exportDate);
                      const threeMonthsAgo = new Date();
                      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

                      if (selected < threeMonthsAgo) {
                        alert("You can only download reports for the last 3 months.");
                        return;
                      }

                      const headers = ["Faculty Name", "Department/Subject", "Status"];
                      const rows = educators.map(edu => {
                        const status = facultyAttendance[exportDate]?.[edu.id] || 'Not Marked';
                        return `${edu.name},${edu.team || 'Unassigned'},${status}`;
                      });

                      const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(headers.join(",") + "\n" + rows.join("\n"));
                      const link = document.createElement("a");
                      link.setAttribute("href", csvContent);
                      link.setAttribute("download", `faculty_attendance_${exportDate}.csv`);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);

                      setShowExportModal(false);
                    }}
                    className="animated-download-btn full-width mt-4"
                    type="button"
                  >
                    <span className="animated-download-btn__text">Download CSV</span>
                    <span className="animated-download-btn__icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 35" id="bdd05811-e15d-428c-bb53-8661459f9307" data-name="Layer 2" className="svg"><path d="M17.5,22.131a1.249,1.249,0,0,1-1.25-1.25V2.187a1.25,1.25,0,0,1,2.5,0V20.881A1.25,1.25,0,0,1,17.5,22.131Z"></path><path d="M17.5,22.693a3.189,3.189,0,0,1-2.262-.936L8.487,15.006a1.249,1.249,0,0,1,1.767-1.767l6.751,6.751a.7.7,0,0,0,.99,0l6.751-6.751a1.25,1.25,0,0,1,1.768,1.767l-6.752,6.751A3.191,3.191,0,0,1,17.5,22.693Z"></path><path d="M31.436,34.063H3.564A3.318,3.318,0,0,1,.25,30.749V22.011a1.25,1.25,0,0,1,2.5,0v8.738a.815.815,0,0,0,.814.814H31.436a.815.815,0,0,0,.814-.814V22.011a1.25,1.25,0,1,1,2.5,0v8.738A3.318,3.318,0,0,1,31.436,34.063Z"></path></svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'facultySalary' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#F5F6FA]">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Faculty Name</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Base Salary (₹)</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Payment Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {educators.map(educator => {
                      const data = facultySalaries[educator.id] || { status: 'Pending' };
                      const baseSalary = educator.salary || '50000';
                      const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
                      return (
                        <tr key={educator.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold text-[#1B1F3B]">{educator.name}</p>
                            <p className="text-xs text-gray-500">{educator.team || 'Unassigned'}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-[#1B1F3B] bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 w-fit">
                              ₹{Number(baseSalary).toLocaleString('en-IN')}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center gap-2">
                              {data.status === 'Pending' ? (
                                <div className="flex flex-col items-center gap-2">
                                  <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200 tracking-wide uppercase shadow-sm">
                                    Pending for {currentMonth}
                                  </span>
                                  <div
                                    className="animated-pay-btn"
                                    onClick={() => handleUpdateFacultySalary(educator.id, baseSalary, 'Paid')}
                                  >
                                    <div className="pay-left-side">
                                      <div className="pay-card">
                                        <div className="pay-card-line"></div>
                                        <div className="pay-buttons"></div>
                                      </div>
                                      <div className="pay-post">
                                        <div className="pay-post-line"></div>
                                        <div className="pay-screen">
                                          <div className="pay-dollar">₹</div>
                                        </div>
                                        <div className="pay-numbers"></div>
                                        <div className="pay-numbers-line2"></div>
                                      </div>
                                    </div>
                                    <div className="pay-right-side">
                                      <div className="pay-new">Pay Salary</div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center gap-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-200 tracking-wide uppercase shadow-sm flex items-center gap-1">
                                      <CheckCircle2 size={12} />
                                      Paid for {currentMonth}
                                    </span>
                                    <button
                                      onClick={() => handleUpdateFacultySalary(educator.id, baseSalary, 'Pending')}
                                      className="p-1 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                                      title="Mark as Pending"
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                  <button
                                    onClick={() => {
                                      const printWindow = window.open('', '', 'width=800,height=600');
                                      if (printWindow) {
                                        printWindow.document.write(`
                                          <html>
                                            <head>
                                              <title>Salary Slip - ${educator.name}</title>
                                              <style>
                                                body { font-family: 'Inter', system-ui, sans-serif; padding: 40px; color: #1B1F3B; max-width: 600px; margin: 0 auto; }
                                                .header { text-align: center; border-bottom: 2px solid #1B1F3B; padding-bottom: 20px; margin-bottom: 30px; }
                                                .title { font-size: 28px; font-weight: 800; margin: 0; letter-spacing: -0.5px; }
                                                .subtitle { color: #64748B; margin-top: 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
                                                .details { width: 100%; border-collapse: collapse; margin-top: 20px; }
                                                .details th, .details td { padding: 16px; border-bottom: 1px solid #E2E8F0; text-align: left; }
                                                .details th { color: #64748B; font-weight: 600; width: 40%; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
                                                .details td { font-weight: 500; font-size: 16px; }
                                                .total-row th, .total-row td { border-bottom: none; border-top: 2px solid #1B1F3B; padding-top: 20px; font-size: 18px; color: #1B1F3B; }
                                                .total-row td { font-weight: 800; font-size: 24px; color: #10B981; }
                                                .footer { margin-top: 60px; text-align: center; color: #94A3B8; font-size: 12px; border-top: 1px dashed #E2E8F0; padding-top: 20px; font-style: italic; }
                                                .print-btn { display: block; width: 100%; padding: 16px; background: #1B1F3B; color: white; border: none; border-radius: 12px; cursor: pointer; font-weight: bold; font-size: 16px; margin-top: 40px; transition: background 0.3s; }
                                                .print-btn:hover { background: #D4AF37; color: #1B1F3B; }
                                                @media print { .print-btn { display: none; } body { padding: 0; } }
                                              </style>
                                            </head>
                                            <body>
                                              <div class="header">
                                                <h1 class="title">Edunova Academy</h1>
                                                <p class="subtitle">Salary Slip &bull; ${currentMonth}</p>
                                              </div>
                                              <table class="details">
                                                <tr><th>Faculty Name</th><td>${educator.name}</td></tr>
                                                <tr><th>Department/Team</th><td>${educator.team || 'Unassigned'}</td></tr>
                                                <tr><th>Payment Status</th><td><span style="color: #10B981; font-weight: bold;">Paid</span></td></tr>
                                                <tr><th>Payment Date</th><td>${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</td></tr>
                                                <tr class="total-row"><th>Net Transfer</th><td>₹${Number(baseSalary).toLocaleString('en-IN')}</td></tr>
                                              </table>
                                              <button class="print-btn" onclick="window.print()">Print Salary Slip</button>
                                              <div class="footer">
                                                This is a computer-generated salary slip and requires no physical signature.<br>
                                                Generated on ${new Date().toLocaleString()}
                                              </div>
                                            </body>
                                          </html>
                                        `);
                                        printWindow.document.close();
                                      }
                                    }}
                                    className="flex items-center justify-center gap-2 px-6 py-2 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all shadow-sm w-full active:scale-95"
                                  >
                                    <Printer size={14} />
                                    Print Slip
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'studentFees' && (
            <div className="space-y-6">
              {/* Filtering Bar */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex gap-4 items-end">
                <div className="flex-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Session Year</label>
                  <select value={feeFilterSession} onChange={e => setFeeFilterSession(e.target.value)} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none font-medium">
                    <option value="">All Sessions</option>
                    <option value="2023-2024">2023-2024</option>
                    <option value="2024-2025">2024-2025</option>
                    <option value="2025-2026">2025-2026</option>
                    <option value="2026-2027">2026-2027</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Class</label>
                  <select value={feeFilterClass} onChange={e => { setFeeFilterClass(e.target.value); setFeeFilterSection(''); }} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none font-medium">
                    <option value="">All Classes</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.className}>Class {c.className}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Section</label>
                  <select value={feeFilterSection} onChange={e => setFeeFilterSection(e.target.value)} disabled={!feeFilterClass} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none disabled:opacity-50 font-medium">
                    <option value="">All Sections</option>
                    {classes.find(c => c.className === feeFilterClass)?.sections.map((s: string) => (
                      <option key={s} value={s}>Section {s}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end mb-1">
                  <button
                    onClick={() => {
                      const pendingStudents = students
                        .filter(s => !feeFilterSession || s.session === feeFilterSession)
                        .filter(s => {
                          const sClass = getStudentClass(s.course || s.class);
                          return !feeFilterClass || sClass === feeFilterClass;
                        })
                        .filter(s => {
                          const sSection = getStudentSection(s.course || s.section);
                          return !feeFilterSection || sSection === feeFilterSection;
                        })
                        .filter(s => {
                          const status = studentFees[s.id]?.status || 'Unpaid';
                          return status === 'Unpaid' || status === 'Partial';
                        });

                      if (pendingStudents.length === 0) {
                        alert('No students with pending fees found for the current filter.');
                      } else {
                        alert(`Reminder sent to ${pendingStudents.length} students with pending fees!`);
                      }
                    }}
                    className="px-4 py-2.5 bg-red-50 text-red-600 font-semibold border-2 border-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    <Bell size={18} />
                    Remind All Pending
                  </button>
                </div>
              </div>

              {/* Sophisticated Class Fee Setting & Summary (Only if Class is selected) */}
              {feeFilterClass ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-[#1B1F3B] to-[#2A2F55] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 text-white/10">
                      <School size={100} />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Set Fee For Class {feeFilterClass}</h3>
                    <div className="mt-4 relative z-10 flex items-center bg-white/10 rounded-xl border border-white/20 p-2">
                      <IndianRupee className="text-[#D4AF37] ml-2" size={20} />
                      <input
                        type="number"
                        value={classFees[feeFilterClass] || ''}
                        onChange={(e) => handleUpdateClassFee(feeFilterClass, e.target.value)}
                        placeholder="Enter Amount"
                        className="w-full bg-transparent border-none text-white text-2xl font-bold px-3 focus:ring-0 outline-none placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  {/* Summary Cards */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-center">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Expected</h3>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold text-[#1B1F3B]">
                        ₹{(() => {
                          const classStudents = students.filter(s => {
                            const sClass = getStudentClass(s.course || s.class);
                            const sSection = getStudentSection(s.course || s.section);
                            return sClass === feeFilterClass && (!feeFilterSection || sSection === feeFilterSection);
                          });
                          return classStudents.length * (Number(classFees[feeFilterClass]) || 0);
                        })().toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-center">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Collected</h3>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold text-green-600">
                        ₹{(() => {
                          const classStudents = students.filter(s => {
                            const sClass = getStudentClass(s.course || s.class);
                            const sSection = getStudentSection(s.course || s.section);
                            return sClass === feeFilterClass && (!feeFilterSection || sSection === feeFilterSection);
                          });
                          return classStudents.reduce((sum, s) => sum + (Number(studentFees[s.id]?.paidAmount) || 0), 0);
                        })().toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-[#1B1F3B]">Global Class Fees</h3>
                      <p className="text-sm text-gray-500">Define the standard fee for every class directly from here.</p>
                    </div>
                    <div className="bg-[#F2FCE2] text-[#1B4332] px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2 border border-[#86D873]/30">
                      <CheckCircle2 size={16} /> Auto-saves on change
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                     {classes.map(c => (
                        <div key={c.id} className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex flex-col hover:border-[#D4AF37] transition-colors">
                           <span className="text-xs font-bold text-gray-500 uppercase">Class {c.className}</span>
                           <div className="flex items-center mt-2 bg-white rounded-lg border border-gray-200 px-2 py-2 focus-within:border-[#D4AF37] focus-within:ring-1 focus-within:ring-[#D4AF37]">
                             <IndianRupee size={14} className="text-gray-400" />
                             <input 
                               type="number"
                               value={classFees[c.className] || ''}
                               onChange={(e) => handleUpdateClassFee(c.className, e.target.value)}
                               placeholder="0"
                               className="w-full bg-transparent outline-none text-sm font-bold text-[#1B1F3B] ml-1"
                             />
                           </div>
                        </div>
                     ))}
                  </div>
                </div>
              )}

              {/* Student Fee Management Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#F5F6FA]">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student Profile</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Class Info</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Fee</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount Paid</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Payment Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {students
                      .filter(s => !feeFilterSession || s.session === feeFilterSession)
                      .filter(s => {
                        const sClass = getStudentClass(s.course || s.class);
                        return !feeFilterClass || sClass === feeFilterClass;
                      })
                      .filter(s => {
                        const sSection = getStudentSection(s.course || s.section);
                        return !feeFilterSection || sSection === feeFilterSection;
                      })
                      .map(student => {
                        const data = studentFees[student.id] || { paidAmount: '', status: 'Unpaid' };
                        const sClass = getStudentClass(student.course || student.class);
                        const totalFee = classFees[sClass] || '0';

                        return (
                          <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-bold shadow-sm">
                                  {student.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-bold text-[#1B1F3B]">{student.name}</p>
                                    <p className="text-xs text-gray-500">Student ID: {formatStudentId(student.registrationNo || student.id)}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col gap-1">
                                <span className="inline-flex items-center w-fit px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                                  {student.course || student.class || 'N/A'}
                                </span>
                                <span className="text-xs text-gray-500 font-medium">{student.session}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-bold text-[#1B1F3B] text-lg">₹{totalFee}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col gap-2">
                                <div className="font-bold text-xl text-[#1B1F3B]">
                                  ₹{data.paidAmount || 0}
                                </div>
                              </div>
                              {(() => {
                                const feeNum = Number(totalFee) || 0;
                                const paidNum = Number(data.paidAmount) || 0;
                                if (feeNum > 0 && paidNum > 0) {
                                  const monthlyFee = feeNum / 12;
                                  const monthsPaid = Math.floor(paidNum / monthlyFee);
                                  const months = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'];
                                  if (monthsPaid === 0) return <p className="text-[10px] text-gray-500 mt-2 font-medium text-left">Paid &lt; 1 month</p>;
                                  const paidUntil = monthsPaid >= 12 ? 'March (Full)' : months[monthsPaid - 1];
                                  return <p className="text-[10.5px] text-green-700 mt-2 font-bold bg-green-50 rounded-lg px-2 py-1 border border-green-100 w-fit inline-block">Paid till {paidUntil}</p>;
                                }
                                return null;
                              })()}
                            </td>
                            <td className="px-6 py-4 flex items-center justify-center">
                              <div className={`px-4 py-1.5 rounded-full font-bold text-xs ${data.status === 'Fully Paid' ? 'border border-green-500 text-green-700 bg-green-50' :
                                data.status === 'Partial' ? 'border border-blue-500 text-blue-700 bg-blue-50' :
                                  'border border-red-500 text-red-700 bg-red-50'
                                }`}>
                                {data.status}
                              </div>
                              {(data.status === 'Unpaid' || data.status === 'Partial') && (
                                <button
                                  onClick={() => alert(`Fee reminder sent to ${student.name}!`)}
                                  className="ml-3 p-2 rounded-xl bg-orange-100 text-orange-600 hover:bg-orange-500 hover:text-white transition-colors"
                                  title="Send Fee Reminder"
                                >
                                  <Bell size={16} />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'leaveRequests' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-[#1B1F3B] mb-6">Staff Leave Requests</h3>

                {leaveRequests.length === 0 ? (
                  <p className="text-gray-500 italic">No leave requests found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                          <th className="pb-4 font-bold text-gray-600">Educator</th>
                          <th className="pb-4 font-bold text-gray-600">Duration</th>
                          <th className="pb-4 font-bold text-gray-600">Reason</th>
                          <th className="pb-4 font-bold text-gray-600">Type</th>
                          <th className="pb-4 font-bold text-gray-600">Status</th>
                          <th className="pb-4 font-bold text-gray-600">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {leaveRequests.map((leave: any) => (
                          <tr key={leave._id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-4">
                              <p className="font-semibold text-[#1B1F3B]">{leave.educatorId?.name || 'Unknown'}</p>
                            </td>
                            <td className="py-4 text-sm text-gray-600">
                              {new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()}
                            </td>
                            <td className="py-4 text-sm text-gray-600 max-w-xs truncate" title={leave.reason}>
                              {leave.reason}
                            </td>
                            <td className="py-4">
                              <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-gray-700">
                                  {leave.isSickLeave ? 'Sick Leave' : 'Casual Leave'}
                                </span>
                                {leave.medicalRecordUrl && (
                                  <a href={leave.medicalRecordUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1">
                                    <FileText size={12} /> View Document
                                  </a>
                                )}
                              </div>
                            </td>
                            <td className="py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${leave.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                leave.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                  'bg-yellow-100 text-yellow-700'
                                }`}>
                                {leave.status}
                              </span>
                              {leave.status === 'Rejected' && leave.rejectionReason && (
                                <p className="text-xs text-gray-500 mt-1 max-w-[150px] truncate" title={leave.rejectionReason}>
                                  {leave.rejectionReason}
                                </p>
                              )}
                            </td>
                            <td className="py-4">
                              {leave.status === 'Pending' && (
                                <div className="filter-switch">
                                  <input
                                    id={`approve-${leave._id}`}
                                    name={`options-${leave._id}`}
                                    type="radio"
                                    className="approve-btn"
                                    onChange={() => handleLeaveAction(leave._id, 'Approved')}
                                  />
                                  <label className="option" htmlFor={`approve-${leave._id}`} title="Approve">
                                    <Check size={16} />
                                  </label>
                                  <input
                                    id={`reject-${leave._id}`}
                                    name={`options-${leave._id}`}
                                    type="radio"
                                    className="reject-btn"
                                    onChange={() => setRejectLeaveId(leave._id)}
                                  />
                                  <label className="option" htmlFor={`reject-${leave._id}`} title="Decline">
                                    <X size={16} />
                                  </label>
                                  <span className="background"></span>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'authentication' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                    <Key size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1B1F3B]">Two-Factor Authentication (OTP)</h3>
                    <p className="text-sm text-gray-500">Secure your account with an Authenticator app (like Google Authenticator).</p>
                  </div>
                </div>

                <div className="bg-[#F5F6FA] p-6 rounded-xl border border-gray-200 flex flex-col items-start gap-4">
                  {isOtpEnabled ? (
                    <div className="w-full flex flex-col gap-4">
                      <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-100">
                        <CheckCircle2 size={20} />
                        <span className="font-bold">Google Authenticator is currently Enabled</span>
                      </div>
                      <button
                        onClick={handleDisableOTP}
                        className="bg-red-50 text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-red-100 transition-colors shadow-sm self-start border border-red-200"
                      >
                        Turn Off 2FA
                      </button>
                    </div>
                  ) : !otpQrCode ? (
                    <button
                      onClick={handleGenerateOTP}
                      className="bg-[#1B1F3B] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#D4AF37] hover:text-[#1B1F3B] transition-colors shadow-lg"
                    >
                      Generate OTP Secret
                    </button>
                  ) : !qrScanned ? (
                    <div className="w-full flex flex-col items-start gap-4">
                      <p className="text-sm font-bold text-[#1B1F3B] mb-2">1. Scan this QR code with your Authenticator App</p>
                      <div className="bg-white p-4 inline-block rounded-xl border border-gray-200 shadow-sm">
                        <img src={otpQrCode} alt="OTP QR Code" className="w-48 h-48" />
                      </div>
                      <button
                        onClick={() => setQrScanned(true)}
                        className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg"
                      >
                        I've Scanned It Successfully
                      </button>
                    </div>
                  ) : (
                    <div className="w-full">
                      <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-100 mb-6">
                        <CheckCircle2 size={20} />
                        <span className="font-bold">QR Code scanned successfully!</span>
                      </div>

                      <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <OTPInput
                          length={6}
                          onComplete={handleVerifyOTP}
                          title="Enter the 6-digit code from your app to verify"
                        />
                      </div>

                      {otpStatus && (
                        <p className={`mt-6 text-sm font-semibold text-center ${otpStatus.includes('Error') || otpStatus.includes('Invalid') ? 'text-red-600' : 'text-emerald-600'}`}>
                          {otpStatus}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Sign Out Confirmation Modal */}
      {showSignOutModal && (
        <div className="fixed inset-0 bg-[#1B1F3B]/45 backdrop-blur-sm flex items-center justify-center z-[400] p-4 animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-[32px] shadow-2xl w-full max-w-sm border border-[#E5D3B3]/40 text-center animate-in zoom-in-95 duration-300 relative">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6 text-red-500">
              <LogOut size={28} />
            </div>
            <h3 className="text-2xl font-bold text-[#1B1F3B] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Sign Out Confirmation</h3>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">Are you sure you want to sign out from the Admin Dashboard?</p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowSignOutModal(false)}
                className="flex-1 py-3.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSignOutModal(false);
                  handleLogout();
                }}
                className="flex-1 py-3.5 bg-[var(--crimson)] text-white font-bold rounded-xl hover:bg-[var(--dark)] transition-colors text-sm shadow-lg shadow-red-500/10"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] animate-fade-in-up transition-all duration-300">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border ${
            toastMessage.type === 'success' ? 'bg-[#F2FCE2] border-[#86D873] text-[#1B4332]' : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {toastMessage.type === 'success' ? <CheckCircle size={20} className="text-[#4CAF50]" /> : <AlertCircle size={20} className="text-red-500" />}
            <span className="font-semibold">{toastMessage.title}</span>
            <button onClick={() => setToastMessage(null)} className="ml-4 hover:opacity-70 transition-opacity">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

// Multi-Step Registration Wizard Sub-Component for Admin
function RegistrationWizardAdmin({ onClose, onComplete }: { onClose: () => void, onComplete: (student: any) => void }) {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [generatedData, setGeneratedData] = useState<{ stuId: string, regId: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [loadingText, setLoadingText] = useState('');

  const [formData, setFormData] = useState({
    // Step 1: Personal
    name: '', email: '', studentClass: '', section: '', session: '2026-2027', dob: '', aadhaarNumber: '',
    password: '', confirmPassword: '',
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

  const nextStep = () => {
    if (step === 1 && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setStep(s => Math.min(s + 1, 5));
  };
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      nextStep();
      return;
    }
    if (step === 4) {
      const stuId = 'STU-' + Math.floor(10000000 + Math.random() * 90000000);
      const regId = 'REG-' + Math.floor(10000000 + Math.random() * 90000000);
      setGeneratedData({ stuId, regId });

      setIsUploading(true);
      setLoadingText('Uploading Documents');

      try {
        // Fetch ImageKit auth parameters
        const authResponse = await api.get('/imagekit/auth');
        const { token, expire, signature } = authResponse.data;
        const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY || 'public_3TjyerjXg85mniyssEGbyfH0odU='; // Fallback if not in Vite env

        // Identify all file fields
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
          regNo: regId,
          name: formData.name || 'New Student',
          email: formData.email,
          password: formData.password,
          class: formData.studentClass,
          section: formData.section,
          session: formData.session,
          course: formData.studentClass && formData.section ? `Class ${formData.studentClass}-${formData.section}` : (formData.studentClass || 'Unassigned'),
          semester: 1,
          status: 'Active',
          progress: 0,
          cgpa: 0,
          attendance: 0,
          documentUrls, // Added ImageKit URLs here
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

        // Removed fake timeout to use real API time, or we can keep a small one if desired
        await onComplete(newStudent);
        setIsUploading(false);
        setStep(5);
      } catch (error) {
        console.error("Upload failed", error);
        alert("An error occurred during registration. Please try again.");
        setIsUploading(false);
      }
    }
  };

  const copyToClipboard = () => {
    const text = `Student ID: ${generatedData?.stuId}\nRegistration ID: ${generatedData?.regId}\nPassword: ${formData.password}`;
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
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
          <div className="h-full bg-[#D4AF37] transition-all duration-500" style={{ width: `${(step / 5) * 100}%` }}></div>
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
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Aadhaar Card Number</label>
                  <input type="text" value={formData.aadhaarNumber} onChange={e => setFormData({ ...formData, aadhaarNumber: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none" placeholder="e.g. 1234-5678-9012" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Session Year *</label>
                  <select required value={formData.session} onChange={e => setFormData({ ...formData, session: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none">
                    <option value="2023-2024">2023-2024</option>
                    <option value="2024-2025">2024-2025</option>
                    <option value="2025-2026">2025-2026</option>
                    <option value="2026-2027">2026-2027</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Password *</label>
                  <input required type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Confirm Password *</label>
                  <input required type="password" value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none" />
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
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 flex flex-col items-center justify-center text-center py-10">
              <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-bold text-[#1B1F3B]">Registration Successful</h3>
              <p className="text-gray-500 mb-8 max-w-md">The student has been successfully registered in the system. Please securely share the credentials below with the student.</p>

              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 w-full max-w-lg text-left space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Student ID</label>
                  <div className="text-xl font-mono font-bold text-[#1B1F3B] mt-1">{generatedData?.stuId}</div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Registration ID</label>
                  <div className="text-xl font-mono font-bold text-[#1B1F3B] mt-1">{generatedData?.regId}</div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Login Password</label>
                  <div className="flex items-center justify-between mt-1">
                    <div className="text-xl font-mono font-bold text-[#1B1F3B]">
                      {showPassword ? formData.password : '••••••••'}
                    </div>
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="p-2 text-gray-400 hover:text-[#1B1F3B] transition-colors">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              <button type="button" onClick={copyToClipboard} className="mt-4 px-6 py-3 bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1B1F3B] font-bold rounded-xl transition-colors flex items-center gap-2">
                <ClipboardCheck size={20} /> Copy Details
              </button>
            </div>
          )}

        </form>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
          {step < 5 ? (
            <>
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
                {step === 4 ? 'Confirm & Generate IDs' : 'Next Step'}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full px-8 py-3.5 bg-[#1B1F3B] hover:bg-[#D4AF37] hover:text-[#1B1F3B] text-white font-bold rounded-xl transition-all shadow-lg"
            >
              Finish & Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
