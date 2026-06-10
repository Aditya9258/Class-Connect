import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Menu, X, LogOut, Search, ChevronDown, BookOpen, CreditCard, UserCheck, Bell, BarChart3 } from 'lucide-react';

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dashboardUrl, setDashboardUrl] = useState('/login?type=student');
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isStudentView = location.pathname.startsWith('/student');

  const [searchQuery, setSearchQuery] = useState('');
  const [noticeCount, setNoticeCount] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [studentServicesOpen, setStudentServicesOpen] = useState(true);
  const [examinationOpen, setExaminationOpen] = useState(false);
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

  const calculateNoticeCount = () => {
    const storedAnnouncements = localStorage.getItem('global_announcements');
    let visibleToStudents: any[] = [];
    if (storedAnnouncements) {
      try {
        const allAnnouncements = JSON.parse(storedAnnouncements);
        visibleToStudents = allAnnouncements.filter((ann: any) => ann.visibility === 'All' || ann.visibility === 'Students');
      } catch (err) {
        console.error("Error parsing announcements", err);
      }
    } else {
      visibleToStudents = [
        { id: 1, title: 'Mid-Term Exam Schedule', content: 'Exams will be held from 15th Nov to 19th Nov. Please check the notice board for the timetable.', visibility: 'Students' },
        { id: 2, title: 'Science Fair Project Submission', content: 'Submit your science fair project models by 16/11/2026.', visibility: 'Students' },
        { id: 3, title: 'Annual Sports Day Selection', content: 'Selections for the Annual Sports Day will take place on the main ground at 11:00 AM.', visibility: 'Students' }
      ];
    }
    const dismissedIds = JSON.parse(localStorage.getItem('dismissed_announcements_student') || '[]');
    const newAnnouncements = visibleToStudents.filter((ann: any) => !dismissedIds.includes(ann.id));
    setNoticeCount(newAnnouncements.length);
  };

  useEffect(() => {
    if (isStudentView) {
      calculateNoticeCount();
    }
    const handleNoticeChange = () => {
      calculateNoticeCount();
    };
    window.addEventListener('notice-count-changed', handleNoticeChange);
    return () => {
      window.removeEventListener('notice-count-changed', handleNoticeChange);
    };
  }, [isStudentView]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    window.dispatchEvent(new CustomEvent('universal-search', { detail: val }));
  };

  const handleNoticeClick = () => {
    localStorage.removeItem('dismissed_announcements_student');
    window.dispatchEvent(new CustomEvent('open-notices-popup'));
    calculateNoticeCount();
  };




  useEffect(() => {
    // Always close drawer & mobile menu on route change
    setIsDrawerOpen(false);
    setMenuOpen(false);

    // Check if user is logged in
    const studentToken = localStorage.getItem('student_token');
    const educatorToken = localStorage.getItem('educator_token');
    
    if (studentToken) {
      setIsLoggedIn(true);
      setDashboardUrl('/student');
    } else if (educatorToken) {
      setIsLoggedIn(true);
      setDashboardUrl('/educator-dashboard');
    } else {
      setIsLoggedIn(false);
      setDashboardUrl('/login?type=student');
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('student_token');
    localStorage.removeItem('logged_in_student_id');
    localStorage.removeItem('educator_token');
    localStorage.removeItem('logged_in_educator_id');
    localStorage.removeItem('admin_token');
    setIsLoggedIn(false);
    navigate('/login?type=student');
  };

  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        if (window.scrollY > 100) {
          navRef.current.classList.add('bg-[#FAF9F6]/95', 'backdrop-blur-md', 'shadow-sm');
        } else {
          navRef.current.classList.remove('bg-[#FAF9F6]/95', 'backdrop-blur-md', 'shadow-sm');
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'About us', to: '/about' },
    { label: isLoggedIn ? 'Dashboard' : 'Login', to: dashboardUrl },
    { label: 'Educator', to: '/educator' },
    { label: 'Contact us', to: '/contact' },
  ];

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-[300] transition-all duration-300 py-5 px-6 md:px-12 lg:px-16"
      >
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center group -ml-4 md:-ml-8 lg:-ml-12">
            <img src="/images/LOGO-IMG.png" alt="Logo" className="h-12 w-auto object-contain scale-[6.5] origin-left" />
          </Link>

          {/* Desktop Navigation */}
          {!isStudentView && (
            <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-1 bg-[#FAF9F6]/90 backdrop-blur-md shadow-md border border-[#E5D3B3]/60 rounded-full px-2 py-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className={
                    (link.label === 'Login' || link.label === 'Dashboard')
                      ? "bg-[#1B1F3B] text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-[#D4AF37] hover:shadow-lg transition-all duration-300 ml-2"
                      : "px-5 py-2 text-sm font-bold text-[#1B1F3B] hover:text-[#D4AF37] hover:bg-black/5 rounded-full transition-all duration-300"
                  }
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Student Dashboard Search and Notices (Desktop) */}
          {isStudentView && (
            <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-4">
              {/* Search Bar */}
              <div className="relative flex items-center">
                <Search size={16} className="absolute left-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 rounded-full border border-[#E5D3B3]/60 bg-white/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--crimson)]/30 focus:border-[var(--crimson)] text-sm transition-all duration-300 shadow-sm"
                />
              </div>

              {/* Public Notice(s) / Results Button */}
              <button
                onClick={handleNoticeClick}
                className="relative bg-white border border-[#E5D3B3]/60 hover:border-[var(--crimson)] hover:text-[var(--crimson)] text-[var(--text-primary)] px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-sm flex items-center gap-2 active:scale-95 animate-in"
              >
                <span>Public Notice(s) / Results</span>
                {noticeCount > 0 && (
                  <span className="bg-[var(--crimson)] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-5 h-5 flex items-center justify-center animate-pulse">
                    {noticeCount}
                  </span>
                )}
              </button>
            </div>
          )}

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {isStudentView ? (
              <button
                onClick={() => setShowSignOutModal(true)}
                className="animated-signout-btn"
              >
                <div className="sign">
                  <svg viewBox="0 0 512 512">
                    <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                  </svg>
                </div>
                <div className="text">Logout</div>
              </button>
            ) : (
              <Link
                to="/contact"
                className="hidden md:inline-flex items-center gap-2 bg-[var(--crimson)] text-white px-5 py-2.5 text-sm font-semibold hover:bg-[var(--dark)] transition-colors duration-300"
              >
                Get in touch
              </Link>
            )}
            {!isStudentView && (
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center"
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}
            {!isStudentView && (
              <button className="hidden lg:flex w-10 h-10 bg-[var(--dark)] text-white items-center justify-center hover:bg-[var(--crimson)] transition-colors duration-300">
                <div className="grid grid-cols-2 gap-[3px]">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
              </button>
            )}
            {isStudentView && (
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="w-10 h-10 bg-[#D4AF37] hover:bg-[#1B1F3B] text-white flex items-center justify-center transition-all duration-300 active:scale-95 rounded-md shadow-sm animate-in"
              >
                <div className="grid grid-cols-2 gap-[3px]">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {!isStudentView && menuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-[#FAF9F6] border-t border-black/10 py-8 px-6">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="text-lg font-medium text-[var(--text-primary)] hover:text-[var(--crimson)] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Slide-out Drawer Panel */}
      <div
        className={`fixed inset-y-0 right-0 w-80 bg-[#FAF9F6] border-l border-[#E5D3B3]/40 shadow-2xl z-[300] transition-transform duration-300 ease-in-out transform flex flex-col ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#E5D3B3]/40 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1B1F3B] flex items-center justify-center">
              <UserCheck size={18} className="text-[#D4AF37]" />
            </div>
            <h3 className="font-bold text-lg text-[#1B1F3B]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Student Services
            </h3>
          </div>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="w-8 h-8 rounded-full border border-black/5 flex items-center justify-center hover:bg-black/5 text-[#1B1F3B] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* Mobile Search & Notices (only visible on mobile/tablet) */}
          <div className="lg:hidden space-y-3 pb-4 border-b border-[#E5D3B3]/40">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Quick Access</h4>
            {/* Search */}
            <div className="relative flex items-center">
              <Search size={16} className="absolute left-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E5D3B3]/60 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--crimson)]/30 focus:border-[var(--crimson)] text-sm transition-all"
              />
            </div>
            
            {/* Notices */}
            <button
              onClick={() => {
                setIsDrawerOpen(false);
                handleNoticeClick();
              }}
              className="w-full bg-white border border-[#E5D3B3]/60 hover:border-[var(--crimson)] text-[#1B1F3B] py-2.5 px-4 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between"
            >
              <span className="flex items-center gap-2"><Bell size={16} className="text-[var(--crimson)]" /> Public Notices / Results</span>
              {noticeCount > 0 && (
                <span className="bg-[var(--crimson)] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {noticeCount}
                </span>
              )}
            </button>
          </div>

          {/* Collapsible Section 1: Academics & Services */}
          <div className="space-y-1">
            <button
              onClick={() => setStudentServicesOpen(!studentServicesOpen)}
              className="w-full flex items-center justify-between py-2 text-[#1B1F3B] font-bold text-sm hover:text-[#D4AF37] transition-colors"
            >
              <span className="flex items-center gap-2">
                <BookOpen size={16} className="text-[#D4AF37]" />
                Academics & Services
              </span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${studentServicesOpen ? 'rotate-180' : ''}`}
              />
            </button>
            <div
              className={`space-y-1 pl-6 overflow-hidden transition-all duration-300 ${
                studentServicesOpen ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0'
              }`}
            >
              {[
                { label: 'Overview', icon: '🏠', action: () => { navigate('/student'); setIsDrawerOpen(false); } },
                { label: 'My Classes & Subjects', icon: '📚', action: () => { navigate('/student/class-course'); setIsDrawerOpen(false); } },
                { label: 'Fee Details & Payments', icon: '💳', action: () => { navigate('/student/fees'); setIsDrawerOpen(false); } },
                { label: 'Certificates & Documents', icon: '📄', action: () => { navigate('/student/certificates'); setIsDrawerOpen(false); } },
                { label: 'Help Desk / Support', icon: '🎧', action: () => { navigate('/student/complaints'); setIsDrawerOpen(false); } },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="drawer-menu-item w-full text-left px-3 py-2.5 rounded-xl text-[#1B1F3B] hover:bg-[#1B1F3B] hover:text-white group transition-all duration-200 flex items-center gap-3"
                >
                  <span className="text-base leading-none">{item.icon}</span>
                  <span className="text-sm font-semibold">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Collapsible Section 2: Exams & Results */}
          <div className="space-y-1 pt-2 border-t border-[#E5D3B3]/20">
            <button
              onClick={() => setExaminationOpen(!examinationOpen)}
              className="w-full flex items-center justify-between py-2 text-[#1B1F3B] font-bold text-sm hover:text-[#D4AF37] transition-colors"
            >
              <span className="flex items-center gap-2">
                <BookOpen size={16} className="text-[#D4AF37]" />
                Exams & Results
              </span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${examinationOpen ? 'rotate-180' : ''}`}
              />
            </button>
            <div
              className={`space-y-1 pl-6 overflow-hidden transition-all duration-300 ${
                examinationOpen ? 'max-h-[350px] opacity-100 mt-1' : 'max-h-0 opacity-0'
              }`}
            >
              {[
                { label: 'Exam Registration', icon: '📝', action: () => { navigate('/student/examination/registration'); setIsDrawerOpen(false); } },
                { label: 'Exam Fee Details', icon: '💰', action: () => { navigate('/student/examination/exam-fee'); setIsDrawerOpen(false); } },
                { label: 'Admit Cards', icon: '🎫', action: () => { navigate('/student/examination/admit-card'); setIsDrawerOpen(false); } },
                { label: 'Results & Report Cards', icon: '📊', action: () => { navigate('/student/examination/grade-card'); setIsDrawerOpen(false); } },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="drawer-menu-item w-full text-left px-3 py-2.5 rounded-xl text-[#1B1F3B] hover:bg-[#1B1F3B] hover:text-white group transition-all duration-200 flex items-center gap-3"
                >
                  <span className="text-base leading-none">{item.icon}</span>
                  <span className="text-sm font-semibold">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Collapsible Section 4: Analysis */}
          <div className="space-y-1 pt-2 border-t border-[#E5D3B3]/20">
            <button
              onClick={() => setAnalysisOpen(!analysisOpen)}
              className="w-full flex items-center justify-between py-2 text-[#1B1F3B] font-bold text-sm hover:text-[#D4AF37] transition-colors"
            >
              <span className="flex items-center gap-2">
                <BarChart3 size={16} className="text-[#D4AF37]" />
                Analysis
              </span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${analysisOpen ? 'rotate-180' : ''}`}
              />
            </button>
            <div
              className={`space-y-1 pl-6 overflow-hidden transition-all duration-300 ${
                analysisOpen ? 'max-h-[350px] opacity-100 mt-1' : 'max-h-0 opacity-0'
              }`}
            >
              {[
                { label: 'Grades & Detailed Report', icon: '📈', action: () => { navigate('/student/examination/grade-card'); setIsDrawerOpen(false); } },
                { label: 'Performance Analysis', icon: '🎯', action: () => { navigate('/student/analysis/performance'); setIsDrawerOpen(false); } },
                { label: 'Attendance Report', icon: '📅', action: () => { navigate('/student/analysis/attendance'); setIsDrawerOpen(false); } },
                { label: 'Competitive Analysis', icon: '🏆', action: () => { navigate('/student/analysis/competitive'); setIsDrawerOpen(false); } },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="drawer-menu-item w-full text-left px-3 py-2.5 rounded-xl text-[#1B1F3B] hover:bg-[#1B1F3B] hover:text-white group transition-all duration-200 flex items-center gap-3"
                >
                  <span className="text-base leading-none">{item.icon}</span>
                  <span className="text-sm font-semibold">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Collapsible Section 3: Payment */}
          <div className="space-y-1 pt-2 border-t border-[#E5D3B3]/20">
            <button
              onClick={() => setPaymentOpen(!paymentOpen)}
              className="w-full flex items-center justify-between py-2 text-[#1B1F3B] font-bold text-sm hover:text-[#D4AF37] transition-colors"
            >
              <span className="flex items-center gap-2">
                <CreditCard size={16} className="text-[#D4AF37]" />
                Payment
              </span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${paymentOpen ? 'rotate-180' : ''}`}
              />
            </button>
            <div
              className={`space-y-1 pl-6 overflow-hidden transition-all duration-300 ${
                paymentOpen ? 'max-h-[100px] opacity-100 mt-1' : 'max-h-0 opacity-0'
              }`}
            >
              {[
                { label: 'My Payment', icon: '💸', action: () => { navigate('/student/fees'); setIsDrawerOpen(false); } },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="drawer-menu-item w-full text-left px-3 py-2.5 rounded-xl text-[#1B1F3B] hover:bg-[#1B1F3B] hover:text-white group transition-all duration-200 flex items-center gap-3"
                >
                  <span className="text-base leading-none">{item.icon}</span>
                  <span className="text-sm font-semibold">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Backdrop overlay */}
      {isDrawerOpen && (
        <div
          onClick={() => setIsDrawerOpen(false)}
          className="fixed inset-0 bg-[#1B1F3B]/45 backdrop-blur-sm z-[290] animate-in fade-in duration-300"
        />
      )}



      {/* Sign Out Confirmation Modal */}
      {showSignOutModal && (
        <div className="fixed inset-0 bg-[#1B1F3B]/45 backdrop-blur-sm flex items-center justify-center z-[400] p-4 animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-[32px] shadow-2xl w-full max-w-sm border border-[#E5D3B3]/40 text-center animate-in zoom-in-95 duration-300 relative">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6 text-red-500">
              <LogOut size={28} />
            </div>
            <h3 className="text-2xl font-bold text-[#1B1F3B] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Sign Out Confirmation</h3>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">Are you sure you want to sign out from the Student Portal?</p>
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
    </>
  );
}
