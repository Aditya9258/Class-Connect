import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Globe, Twitter, Linkedin, Link2, Mail, Share2,
  Star, ChevronRight, ChevronDown,
  TrendingUp, BookOpen, Clock, Award, Bell,
  DollarSign, Calendar, BarChart3, Grid3X3, Megaphone, X
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import api from '../services/api';

gsap.registerPlugin(ScrollTrigger);

const getStudentClass = (courseStr: string) => {
  if (!courseStr) return '';
  const match = courseStr.match(/Class\s*(\d+)/i);
  if (match) return match[1];
  const parts = courseStr.split('-');
  if (parts.length > 0) return parts[0].trim().replace(/Class/i, '').trim();
  return '';
};

/* ─── Data ─── */
const defaultStudentProfile = {
  name: 'John Doe',
  rollNo: '2024CS101',
  studentId: 'STU-12345678',
  avatar: '/images/team-1.jpg',
  course: 'B.Tech CS',
  semester: 4,
  cgpa: 8.7,
  attendance: 92,
  topSubjects: ['Interaction Design', 'Figma', 'User Research'],
};

const mainExamSubjects = [
  { name: 'Mathematics', marks: 88, total: 100, grade: 'A' },
  { name: 'Science', marks: 82, total: 100, grade: 'A+' },
  { name: 'English Literature', marks: 90, total: 100, grade: 'A+' },
  { name: 'Social Science', marks: 85, total: 100, grade: 'A' },
  { name: 'Computer Applications', marks: 91, total: 100, grade: 'A' },
];

const classTestScores = [72, 78, 85, 68, 90, 82, 88, 75, 92, 86, 80, 95];

const performanceMetrics = [
  { label: 'Class Engagement', value: 4.7 },
  { label: 'Communication', value: 4.2 },
  { label: 'Technical Knowledge', value: 4.8 },
  { label: 'Initiative & Involvement', value: 4.5 },
  { label: 'Behavior & Conduct', value: 4.9 },
];

const timetableData = [
  { time: '09:00 AM', mon: 'MATH', tue: 'SCI', wed: 'ENG', thu: 'SOC', fri: 'COMP' },
  { time: '10:00 AM', mon: 'SCI', tue: 'COMP', wed: 'MATH', thu: '--', fri: 'ENG' },
  { time: '11:30 AM', mon: 'MATH', tue: 'ENG', wed: 'SCI', thu: '--', fri: '--' },
  { time: '01:00 PM', mon: '--', tue: '--', wed: '--', thu: '--', fri: '--' },
  { time: '02:00 PM', mon: 'LAB', tue: 'LAB', wed: 'LAB', thu: 'LAB', fri: 'LAB' },
];

const heatMapData = [
  { subject: 'Mathematics', units: [95, 88, 76, 92, 89] },
  { subject: 'Science', units: [82, 90, 78, 85, 91] },
  { subject: 'English Literature', units: [91, 85, 93, 88, 79] },
  { subject: 'Social Science', units: [78, 72, 85, 90, 88] },
  { subject: 'Computer Applications', units: [88, 91, 82, 79, 95] },
];

const announcements = [
  { title: 'Mid-Term Exam Schedule', date: 'Nov 30, 2026', desc: 'Exams will be held from 15th Nov to 19th Nov. Please check the notice board.' },
  { title: 'Science Fair Project Submission', date: 'Nov 16, 2026', desc: 'Submit your science fair project models by 16/11/2026.' },
  { title: 'Annual Sports Day Selection', date: 'Nov 12, 2026', desc: 'Selections for the Annual Sports Day will take place on the main ground.' },
];

const feeInstallments = [
  { label: '1st Installment', due: 'Jun 01, 2026', amount: 1800, status: 'Paid' as const },
  { label: '2nd Installment', due: 'Sep 15, 2026', amount: 1500, status: 'Edit' as const },
  { label: '3rd Installment', due: 'Dec 15, 2026', amount: 1500, status: 'Pending' as const },
];

/* ─── Animated Counter ─── */
function AnimatedNumber({ value, suffix = '', decimals = 0, duration = 1.5 }: { value: number; suffix?: string; decimals?: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!ref.current || hasAnimated.current) return;
    const el = ref.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const obj = { val: 0 };
          gsap.to(obj, {
            val: value,
            duration,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = obj.val.toFixed(decimals) + suffix;
            },
          });
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, suffix, decimals, duration]);

  return <span ref={ref}>0{suffix}</span>;
}

/* ─── Mini Bar Chart (SVG) for class tests ─── */
/*
function MiniBarChart({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const barWidth = 20;
  const gap = 8;
  const height = 120;
  const svgWidth = data.length * (barWidth + gap);

  return (
    <svg width="100%" viewBox={`0 0 ${svgWidth} ${height + 20}`} className="mt-4">
      {data.map((val, i) => {
        const barH = (val / max) * height;
        return (
          <g key={i}>
            <rect
              x={i * (barWidth + gap)}
              y={height - barH}
              width={barWidth}
              height={barH}
              rx={4}
              className="fill-[var(--crimson)] opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
            />
            <text
              x={i * (barWidth + gap) + barWidth / 2}
              y={height + 14}
              textAnchor="middle"
              className="fill-[var(--text-muted)] text-[9px]"
            >
              T{i + 1}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
*/

/* ─── Score Trend Line (SVG) ─── */
function ScoreTrendLine({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data) - 10;
  const height = 100;
  const width = 300;
  const stepX = width / (data.length - 1);

  const points = data.map((val, i) => {
    const x = i * stepX;
    const y = height - ((val - min) / (max - min)) * height;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg width="100%" viewBox={`-10 -10 ${width + 20} ${height + 30}`} className="mt-4">
      <defs>
        <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--crimson)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--crimson)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill="url(#trendGrad)" />
      <polyline points={points} fill="none" stroke="var(--crimson)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((val, i) => {
        const x = i * stepX;
        const y = height - ((val - min) / (max - min)) * height;
        return (
          <circle key={i} cx={x} cy={y} r="4" className="fill-white stroke-[var(--crimson)] stroke-2 cursor-pointer hover:r-6 transition-all" />
        );
      })}
    </svg>
  );
}

/* ─── Donut Chart (SVG) for attendance ─── */
function DonutChart({ percentage }: { percentage: number }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width="160" height="160" viewBox="0 0 160 160">
      <circle cx="80" cy="80" r={radius} fill="none" stroke="#E2E8F0" strokeWidth="12" />
      <circle
        cx="80" cy="80" r={radius} fill="none"
        stroke="var(--crimson)" strokeWidth="12"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 80 80)"
        className="transition-all duration-1000"
      />
      <text x="80" y="74" textAnchor="middle" className="fill-[var(--text-primary)] text-2xl font-bold" dominantBaseline="middle">
        {percentage}%
      </text>
      <text x="80" y="96" textAnchor="middle" className="fill-[var(--text-muted)] text-[10px]">
        Attendance
      </text>
    </svg>
  );
}

/* ─── Radar Chart (SVG) ─── */
function RadarChart({ metrics }: { metrics: { label: string; value: number }[] }) {
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = 70;
  const levels = 5;
  const count = metrics.length;

  const angleStep = (2 * Math.PI) / count;

  const getPoint = (index: number, radius: number) => {
    const angle = index * angleStep - Math.PI / 2;
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  };

  const gridLevels = Array.from({ length: levels }, (_, i) => ((i + 1) / levels) * maxR);

  const dataPoints = metrics.map((m, i) => {
    const r = (m.value / 5) * maxR;
    return getPoint(i, r);
  });

  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z';

  return (
    <svg width="100%" viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {/* Grid */}
      {gridLevels.map((r, li) => {
        const pts = Array.from({ length: count }, (_, i) => getPoint(i, r));
        const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z';
        return <path key={li} d={path} fill="none" stroke="#E2E8F0" strokeWidth="1" />;
      })}
      {/* Axes */}
      {metrics.map((_, i) => {
        const p = getPoint(i, maxR);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#E2E8F0" strokeWidth="1" />;
      })}
      {/* Data area */}
      <path d={dataPath} fill="var(--crimson)" fillOpacity="0.15" stroke="var(--crimson)" strokeWidth="2" />
      {/* Data points */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="var(--crimson)" stroke="white" strokeWidth="2" />
      ))}
      {/* Labels */}
      {metrics.map((m, i) => {
        const p = getPoint(i, maxR + 22);
        return (
          <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" className="fill-[var(--text-muted)] text-[8px]">
            {m.label}
          </text>
        );
      })}
    </svg>
  );
}

/* ─── Heat Map Cell ─── */
function HeatCell({ value }: { value: number }) {
  let bg = 'bg-red-100 text-red-700';
  if (value >= 90) bg = 'bg-emerald-100 text-emerald-700';
  else if (value >= 80) bg = 'bg-blue-100 text-blue-700';
  else if (value >= 70) bg = 'bg-amber-100 text-amber-700';

  return (
    <div className={`w-full aspect-square rounded-lg flex items-center justify-center text-xs font-bold ${bg} transition-transform duration-300 hover:scale-110 cursor-pointer`}>
      {value}
    </div>
  );
}

/* ─── Card Wrapper ─── */
function Card({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    const el = cardRef.current;
    const ctx = gsap.context(() => {
      gsap.from(el, {
        y: 40,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      });
    });
    return () => {
      // Kill any ScrollTrigger attached to this element first
      ScrollTrigger.getAll()
        .filter((t) => t.trigger === el)
        .forEach((t) => t.kill());
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={cardRef}
      id={id}
      className={`bg-white rounded-2xl border border-black/5 p-6 shadow-sm hover:shadow-lg hover:border-[var(--crimson)]/20 transition-all duration-500 ${className}`}
    >
      {children}
    </div>
  );
}

/* ─── Section Title ─── */
function SectionTitle({ icon: Icon, title, link }: { icon: React.ElementType; title: string; link?: string }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2">
        <Icon size={18} className="text-[var(--crimson)]" />
        <h3 className="text-sm font-bold text-[var(--text-primary)]">{title}</h3>
      </div>
      {link && (
        <a href="#" className="text-xs text-[var(--crimson)] font-semibold hover:underline flex items-center gap-1 group">
          {link}
          <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </a>
      )}
    </div>
  );
}

/* ═══════════ MAIN PAGE ═══════════ */
export default function Student() {
  const [selectedTerm, setSelectedTerm] = useState('Semester 4');
  const [termDropdownOpen, setTermDropdownOpen] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Announcements State
  const [globalAnnouncements, setGlobalAnnouncements] = useState<any[]>([]);
  const [showAnnouncementPopup, setShowAnnouncementPopup] = useState(false);
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);

  const [profile, setProfile] = useState(defaultStudentProfile);
  const [searchFilter, setSearchFilter] = useState('');
  const [feesData, setFeesData] = useState({ totalFees: 0, paidFees: 0 });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<'full' | 'monthly'>('full');

  useEffect(() => {
    const handleSearch = (e: Event) => {
      setSearchFilter((e as CustomEvent).detail || '');
    };
    window.addEventListener('universal-search', handleSearch);
    return () => window.removeEventListener('universal-search', handleSearch);
  }, []);

  useEffect(() => {
    const handleOpenPopup = () => {
      const storedAnnouncements = localStorage.getItem('global_announcements');
      if (storedAnnouncements) {
        const allAnnouncements = JSON.parse(storedAnnouncements);
        const visibleToStudents = allAnnouncements.filter((ann: any) => ann.visibility === 'All' || ann.visibility === 'Students');
        if (visibleToStudents.length > 0) {
          setGlobalAnnouncements(visibleToStudents);
          setCurrentAnnouncementIndex(0);
          setShowAnnouncementPopup(true);
        }
      } else {
        const demoAnn = [
          { id: 1, title: 'Mid-Term Exam Schedule', content: 'Exams will be held from 15th Nov to 19th Nov. Please check the notice board for the timetable.', visibility: 'Students' },
          { id: 2, title: 'Science Fair Project Submission', content: 'Submit your science fair project models by 16/11/2026.', visibility: 'Students' },
          { id: 3, title: 'Annual Sports Day Selection', content: 'Selections for the Annual Sports Day will take place on the main ground at 11:00 AM.', visibility: 'Students' }
        ];
        setGlobalAnnouncements(demoAnn);
        setCurrentAnnouncementIndex(0);
        setShowAnnouncementPopup(true);
      }
    };

    window.addEventListener('open-notices-popup', handleOpenPopup);
    return () => {
      window.removeEventListener('open-notices-popup', handleOpenPopup);
    };
  }, []);

  const { user, isLoading } = useAuth();

  useEffect(() => {
    const fetchStudentData = async () => {
      // Wait for auth to finish loading before fetching
      if (isLoading) return;
      try {
        const [{ data: studentData }, { data: dashData }] = await Promise.all([
          api.get('/student/me').catch(() => ({ data: { data: null } })),
          api.get('/student/dashboard').catch(() => ({ data: { data: { announcements: [] } } }))
        ]);

        const dbProfile = studentData.data;
        if (dbProfile) {
          const formatStudentId = (rawId: string) => {
            if (!rawId) return defaultStudentProfile.studentId;
            if (rawId.startsWith('STU-')) return rawId;
            const digits = rawId.replace(/[^0-9]/g, '');
            if (digits.length >= 8) return `STU-${digits.substring(0, 8)}`;
            return `STU-${(rawId.toUpperCase() + '12345678').replace(/[^0-9A-Z]/g, '').substring(0, 8)}`;
          };
          setProfile({
            name: user?.name || defaultStudentProfile.name,
            rollNo: dbProfile.regNo || defaultStudentProfile.rollNo,
            studentId: formatStudentId(dbProfile.registrationNo || dbProfile._id),
            avatar: defaultStudentProfile.avatar,
            course: dbProfile.course || dbProfile.class || defaultStudentProfile.course,
            semester: dbProfile.semester || defaultStudentProfile.semester,
            cgpa: dbProfile.cgpa || defaultStudentProfile.cgpa,
            attendance: dbProfile.attendance || defaultStudentProfile.attendance,
            topSubjects: dbProfile.topSubjects || defaultStudentProfile.topSubjects,
          });

          const classFees = dashData.data.classFees || {};
          const studentFees = dashData.data.studentFees || {};
          const sClass = getStudentClass(dbProfile.course || dbProfile.class);
          const totalFeeForClass = Number(classFees[sClass] || 0);
          const studentPaid = Number((studentFees[dbProfile._id] || {}).paidAmount || 0);
          setFeesData({ totalFees: totalFeeForClass, paidFees: studentPaid });
        }

        // Load announcements visible to Students — only show once per session
        const announcementShownThisSession = sessionStorage.getItem('announcement_shown_student');
        if (!announcementShownThisSession) {
          const allAnnouncements = dashData.data.announcements || [];
          const visibleToStudents = allAnnouncements.filter((ann: any) => ann.visibility === 'All' || ann.visibility === 'Students');

          const dismissedIds = JSON.parse(localStorage.getItem('dismissed_announcements_student') || '[]');
          const newAnnouncements = visibleToStudents.filter((ann: any) => !dismissedIds.includes(ann.id));

          if (newAnnouncements.length > 0) {
            sessionStorage.setItem('announcement_shown_student', '1');
            setGlobalAnnouncements(newAnnouncements);
            setShowAnnouncementPopup(true);
          }
        }
      } catch (err) {
        console.error('Failed to fetch student data', err);
      }
    };

    fetchStudentData();
  }, [user, isLoading]); // Re-run when auth resolves or user changes

  /* Intro animations */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(profileRef.current, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.3,
      });
      gsap.from(headerRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        delay: 0.6,
      });
    });
    return () => ctx.revert();
  }, []);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const handleMessage = () => {
    window.location.href = `mailto:johndoe@university.edu?subject=Message from Student Portal`;
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const dueFees = Math.max(0, feesData.totalFees - feesData.paidFees);
    const amountToPay = paymentMode === 'full' ? dueFees : paymentAmount;
    if (amountToPay <= 0) return;

    const res = await loadRazorpayScript();
    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY || 'YOUR_TEST_KEY_HERE', // Takes key from .env file
      amount: amountToPay * 100, // Amount in paise
      currency: 'INR',
      name: 'Aditya School',
      description: 'Fee Payment',
      handler: async function (_response: any) {
        try {
          await api.post('/student/pay-fee', { amount: amountToPay });
          alert('Payment Successful!');
          setShowPaymentModal(false);
          window.location.reload();
        } catch (err) {
          console.error(err);
          alert('Payment was successful but we failed to update our servers. Please contact admin.');
        }
      },
      prefill: {
        name: profile.name,
        email: user?.email || '',
      },
      theme: {
        color: '#D4AF37'
      }
    };

    const rzp1 = new (window as any).Razorpay(options);
    rzp1.on('payment.failed', function (response: any) {
      alert(`Payment Failed: ${response.error.description}`);
    });
    rzp1.open();
  };

  const overallAverage = (mainExamSubjects.reduce((a, s) => a + s.marks, 0) / mainExamSubjects.length).toFixed(1);
  const classTestAvg = (classTestScores.reduce((a, b) => a + b, 0) / classTestScores.length).toFixed(1);
  const avgPerformance = (performanceMetrics.reduce((a, m) => a + m.value, 0) / performanceMetrics.length).toFixed(1);

  const dueFees = Math.max(0, feesData.totalFees - feesData.paidFees);

  return (
    <div className="min-h-screen pt-24 pb-0 bg-[var(--cream)]">

      {/* Announcements Popup */}
      {showAnnouncementPopup && globalAnnouncements.length > 0 && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[150] p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-300 relative border-l-4 border-[var(--crimson)]">
            <button
              onClick={() => {
                const dismissedIds = JSON.parse(localStorage.getItem('dismissed_announcements_student') || '[]');
                dismissedIds.push(globalAnnouncements[currentAnnouncementIndex].id);
                localStorage.setItem('dismissed_announcements_student', JSON.stringify(dismissedIds));
                window.dispatchEvent(new Event('notice-count-changed'));

                if (currentAnnouncementIndex < globalAnnouncements.length - 1) {
                  setCurrentAnnouncementIndex(prev => prev + 1);
                } else {
                  setShowAnnouncementPopup(false);
                }
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
            >
              <X size={24} />
            </button>
            <div className="flex items-center gap-3 mb-4 text-[var(--crimson)]">
              <Megaphone size={28} />
              <h3 className="text-xl font-bold text-black">New Announcement!</h3>
            </div>
            <h4 className="text-lg font-bold text-black mb-2">{globalAnnouncements[currentAnnouncementIndex].title}</h4>
            <p className="text-gray-600 mb-6">{globalAnnouncements[currentAnnouncementIndex].content}</p>

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 font-semibold">{currentAnnouncementIndex + 1} of {globalAnnouncements.length}</span>
              <button
                onClick={() => {
                  const dismissedIds = JSON.parse(localStorage.getItem('dismissed_announcements_student') || '[]');
                  dismissedIds.push(globalAnnouncements[currentAnnouncementIndex].id);
                  localStorage.setItem('dismissed_announcements_student', JSON.stringify(dismissedIds));
                  window.dispatchEvent(new Event('notice-count-changed'));

                  if (currentAnnouncementIndex < globalAnnouncements.length - 1) {
                    setCurrentAnnouncementIndex(prev => prev + 1);
                  } else {
                    setShowAnnouncementPopup(false);
                  }
                }}
                className="px-6 py-2 bg-[var(--crimson)] text-white rounded-xl font-bold hover:brightness-110 transition-colors"
              >
                {currentAnnouncementIndex < globalAnnouncements.length - 1 ? 'Next' : 'Got it!'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Student Profile Card ─── */}
      <div ref={profileRef} className="max-w-[1400px] mx-auto px-4 md:px-12 lg:px-16 mb-10">
        <div className="bg-white rounded-2xl border border-black/5 p-6 md:p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
            {/* Avatar + Status */}
            <div className="flex flex-col items-center lg:items-start gap-2 shrink-0">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden border-[3px] border-emerald-400 shadow-lg group-hover:border-[var(--crimson)] transition-colors duration-500">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-bold px-3 py-0.5 rounded-full whitespace-nowrap flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  Active Student
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">{profile.name}</h1>
                    <span className="w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center" title="Verified">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <div className="bg-gray-50 border border-gray-200 px-4 py-1.5 rounded-lg text-xs font-semibold text-[var(--text-secondary)] w-fit">
                    Roll No: {profile.rollNo}
                  </div>
                  <div className="bg-gray-50 border border-gray-200 px-4 py-1.5 rounded-lg text-xs font-semibold text-[var(--text-secondary)] w-fit">
                    Student ID: {profile.studentId}
                  </div>
                </div>
              </div>

              {/* Social + Actions */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                {[Globe, Twitter, Linkedin, Link2].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 rounded-full border border-black/10 flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--crimson)] hover:text-white hover:border-[var(--crimson)] hover:scale-110 transition-all duration-300"
                  >
                    <Icon size={14} />
                  </a>
                ))}
                <div className="w-px h-6 bg-black/10 mx-1" />
                <button
                  onClick={handleMessage}
                  className="inline-flex items-center gap-2 bg-[var(--dark)] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[var(--crimson)] hover:scale-105 transition-all duration-300 active:scale-95"
                >
                  <Mail size={14} /> Message
                </button>
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 bg-[var(--dark)] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[var(--crimson)] hover:scale-105 transition-all duration-300 active:scale-95"
                >
                  <Share2 size={14} /> {copiedShare ? 'Copied!' : 'Share'}
                </button>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-5">
                {[
                  { label: 'Course', value: profile.course },
                  { label: 'Semester', value: String(profile.semester) },
                  { label: 'CGPA', value: String(profile.cgpa), color: 'text-[var(--crimson)]' },
                  { label: 'Attendance', value: `${profile.attendance}%`, color: 'text-[var(--crimson)]' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-xs text-[var(--text-muted)] mb-1">{stat.label}</p>
                    <p className={`text-lg font-bold ${stat.color || 'text-[var(--text-primary)]'}`}>{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Top Subjects */}
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-2">Top Subjects</p>
                <div className="flex flex-wrap gap-2">
                  {profile.topSubjects.map((sub) => (
                    <span
                      key={sub}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-black/10 text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--crimson)] hover:text-white hover:border-[var(--crimson)] transition-all duration-300 cursor-default"
                    >
                      <Star size={11} className="text-amber-400" />
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Report Tracking Header ─── */}
      <div ref={headerRef} className="max-w-[1400px] mx-auto px-4 md:px-12 lg:px-16 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">Student Report Tracking System</h2>
            <p className="text-sm text-[var(--text-muted)] mt-1">Comprehensive overview of your academic performance and statistics.</p>
          </div>
          <div className="relative">
            <button
              onClick={() => setTermDropdownOpen(!termDropdownOpen)}
              className="flex items-center gap-2 bg-white border border-black/10 px-4 py-2.5 rounded-xl text-sm font-semibold text-[var(--text-primary)] hover:border-[var(--crimson)] transition-colors"
            >
              Select Term: <span className="text-[var(--crimson)]">{selectedTerm}</span>
              <ChevronDown size={16} className={`transition-transform duration-300 ${termDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {termDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-black/10 rounded-xl shadow-xl z-20 py-1 w-48 animate-in">
                {['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4'].map((t) => (
                  <button
                    key={t}
                    onClick={() => { setSelectedTerm(t); setTermDropdownOpen(false); }}
                    className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-[var(--crimson)]/5 hover:text-[var(--crimson)] transition-colors ${t === selectedTerm ? 'text-[var(--crimson)] font-semibold bg-[var(--crimson)]/5' : 'text-[var(--text-secondary)]'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Dashboard Grid ─── */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-12 lg:px-16 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ─── Grades Tracking - Main Exams ─── */}
          <Card id="grades-main">
            <SectionTitle icon={BookOpen} title="Grades Tracking - Main Exams" link="View Detailed Report" />
            <div className="flex items-baseline gap-4 mb-5">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1">Overall Average</p>
                <p className="text-4xl font-extrabold text-[var(--text-primary)]"><AnimatedNumber value={Number(overallAverage)} decimals={1} suffix="%" /></p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1">Grade</p>
                <p className="text-4xl font-extrabold text-emerald-500">A</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[10px] uppercase tracking-wider text-[var(--text-muted)] border-b border-black/5">
                    <th className="pb-3 font-semibold">Subject</th>
                    <th className="pb-3 font-semibold text-center">Marks Obtained</th>
                    <th className="pb-3 font-semibold text-center">Total Marks</th>
                    <th className="pb-3 font-semibold text-center">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {mainExamSubjects
                    .filter(sub => sub.name.toLowerCase().includes(searchFilter.toLowerCase()))
                    .map((sub, i) => (
                      <tr
                        key={sub.name}
                        className="border-b border-black/5 hover:bg-[var(--crimson)]/5 transition-colors duration-300 group cursor-default"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        <td className="py-3 font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{sub.name}</td>
                        <td className="py-3 text-center font-semibold">{sub.marks}</td>
                        <td className="py-3 text-center text-[var(--text-muted)]">{sub.total}</td>
                        <td className="py-3 text-center">
                          <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-600">{sub.grade}</span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* ─── Grades Tracking - Class Tests ─── */}
          <Card id="grades-tests">
            <SectionTitle icon={TrendingUp} title="Grades Tracking - Class Tests" link="View All Test Results" />
            <div className="flex items-baseline gap-6 mb-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1">Average Score</p>
                <p className="text-4xl font-extrabold text-[var(--text-primary)]"><AnimatedNumber value={Number(classTestAvg)} decimals={1} suffix="%" /></p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1">Tests Passed</p>
                <p className="text-4xl font-extrabold text-[var(--text-primary)]"><AnimatedNumber value={12} /></p>
              </div>
            </div>
            <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1">Score Trend</p>
            <ScoreTrendLine data={classTestScores} />
          </Card>

          {/* ─── Performance Tracking ─── */}
          <Card id="performance">
            <SectionTitle icon={BarChart3} title="Performance Tracking" link="View Teacher's Comments" />
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-48 h-48 shrink-0 relative">
                <RadarChart metrics={performanceMetrics} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-extrabold text-[var(--text-primary)]">{avgPerformance}</p>
                    <p className="text-[9px] text-[var(--text-muted)]">/ 5.0</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 w-full space-y-3">
                {performanceMetrics
                  .filter(m => m.label.toLowerCase().includes(searchFilter.toLowerCase()))
                  .map((m) => (
                    <div key={m.label} className="group">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{m.label}</span>
                        <span className="text-xs font-bold text-[var(--text-primary)]">{m.value}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--crimson)] rounded-full transition-all duration-700 group-hover:brightness-110"
                          style={{ width: `${(m.value / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </Card>

          {/* ─── Attendance Report ─── */}
          <Card id="attendance">
            <SectionTitle icon={Clock} title="Attendance Report" link="View Attendance Calendar" />
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <DonutChart percentage={profile.attendance} />
              <div className="flex-1 space-y-4 w-full">
                {[
                  { label: 'Present', value: 166, color: 'bg-emerald-500', pct: '92%' },
                  { label: 'Absent', value: 8, color: 'bg-red-500', pct: '4%' },
                  { label: 'Excused', value: 6, color: 'bg-amber-500', pct: '3%' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between group hover:bg-gray-50 rounded-lg px-3 py-2 -mx-3 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                      <span className="text-sm text-[var(--text-secondary)]">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-[var(--text-primary)]">{item.value}</span>
                      <span className="text-xs font-semibold text-[var(--text-muted)]">{item.pct}</span>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between border-t border-black/5 pt-3">
                  <span className="text-sm font-semibold text-[var(--text-primary)]">Total Days</span>
                  <span className="text-sm font-bold text-[var(--text-primary)]">180</span>
                </div>
              </div>
            </div>
          </Card>

          {/* ─── Timetable ─── */}
          <Card id="timetable">
            <SectionTitle icon={Calendar} title="Timetable" link="View Full Timetable" />
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-xs min-w-[400px]">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                    <th className="py-2 px-2 text-left font-semibold">Time</th>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d) => (
                      <th key={d} className="py-2 px-2 text-center font-semibold">{d}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timetableData.map((row, ri) => (
                    <tr key={ri} className="border-t border-black/5">
                      <td className="py-3 px-2 font-semibold text-[var(--text-secondary)] whitespace-nowrap">{row.time}</td>
                      {[row.mon, row.tue, row.wed, row.thu, row.fri].map((cell, ci) => {
                        const isMatch = searchFilter && cell.toLowerCase().includes(searchFilter.toLowerCase());
                        return (
                          <td key={ci} className="py-3 px-2 text-center">
                            {cell !== '--' ? (
                              <span className={`inline-block px-2.5 py-1 rounded-md font-bold text-[11px] hover:bg-[var(--crimson)] hover:text-white transition-all duration-300 cursor-pointer ${isMatch ? 'bg-[#D4AF37] text-[#1B1F3B] scale-110 shadow-md ring-2 ring-[#D4AF37]' : 'bg-[var(--crimson)]/10 text-[var(--crimson)]'}`}>
                                {cell}
                              </span>
                            ) : (
                              <span className="text-black/20">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* ─── Competitive Analysis ─── */}
          <Card id="competitive">
            <SectionTitle icon={Award} title="Competitive Analysis" link="View Detailed Analytics" />
            <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-4">Student Percentile Rank</p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Class Avg', rank: '84', suffix: 'th', color: 'from-blue-500/10 to-blue-500/5 border-blue-200', textColor: 'text-blue-600' },
                { label: 'Year Fellowship', rank: '67', suffix: 'th', color: 'from-amber-500/10 to-amber-500/5 border-amber-200', textColor: 'text-amber-600' },
                { label: 'Live Stream', rank: '95', suffix: 'th', color: 'from-emerald-500/10 to-emerald-500/5 border-emerald-200', textColor: 'text-emerald-600' },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`rounded-xl border bg-gradient-to-b ${item.color} p-5 text-center hover:scale-105 transition-transform duration-300 cursor-default`}
                >
                  <p className={`text-4xl font-extrabold ${item.textColor}`}>
                    <AnimatedNumber value={Number(item.rank)} />
                    <span className="text-lg">{item.suffix}</span>
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-2 font-medium">{item.label}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* ─── Performance Heat Maps ─── */}
          <Card id="heatmaps">
            <SectionTitle icon={Grid3X3} title="Performance Heat Maps" link="View Full Heat Maps" />
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                    <th className="pb-3 text-left font-semibold pr-4">Subject</th>
                    {['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5'].map((u) => (
                      <th key={u} className="pb-3 text-center font-semibold px-1">{u}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {heatMapData.map((row) => (
                    <tr key={row.subject}>
                      <td className="py-1.5 pr-4 font-medium text-[var(--text-secondary)] whitespace-nowrap">{row.subject}</td>
                      {row.units.map((val, i) => (
                        <td key={i} className="py-1.5 px-1">
                          <HeatCell value={val} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center gap-4 mt-4 text-[10px] text-[var(--text-muted)]">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-100" /> Low (&lt;70)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-100" /> Medium (70-79)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-100" /> Good (80-89)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-100" /> Excellent (90+)</span>
            </div>
          </Card>

          {/* ─── Announcement Tracker ─── */}
          <Card id="announcements">
            <SectionTitle icon={Bell} title="Announcement Tracker" link="View All Announcements" />
            <div className="space-y-0">
              {announcements.map((ann, i) => (
                <div
                  key={i}
                  className="group py-4 border-b border-black/5 last:border-0 hover:bg-[var(--crimson)]/5 rounded-lg px-3 -mx-3 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--crimson)] transition-colors mb-1">{ann.title}</h4>
                      <p className="text-xs text-[var(--text-muted)] line-clamp-1">{ann.desc}</p>
                    </div>
                    <span className="text-[10px] text-[var(--text-muted)] whitespace-nowrap font-medium">{ann.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* ─── Fees Tracker ─── */}
          <Card className="lg:col-span-2" id="fees">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-4">
              <SectionTitle icon={DollarSign} title="Fees Tracker" link="View Payment History" />
              {dueFees > 0 && (
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="bg-[var(--crimson)] hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 -mt-4 sm:mt-0"
                >
                  <DollarSign size={16} /> Pay Fees
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-6 mb-6">
              {[
                { label: 'TOTAL', amount: feesData.totalFees, color: 'text-[var(--text-primary)]' },
                { label: 'PAID', amount: feesData.paidFees, color: 'text-emerald-600' },
                { label: 'DUE', amount: dueFees, color: 'text-red-500' },
              ].map((f) => (
                <div key={f.label}>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1">{f.label}</p>
                  <p className={`text-2xl font-extrabold ${f.color}`}>
                    $<AnimatedNumber value={f.amount} suffix="" />
                  </p>
                </div>
              ))}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody>
                  {feeInstallments.map((inst, i) => (
                    <tr key={i} className="border-b border-black/5 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 font-semibold text-[var(--text-primary)]">{inst.label}</td>
                      <td className="py-4 text-xs text-[var(--text-muted)]">Due: {inst.due}</td>
                      <td className="py-4 text-right font-bold text-[var(--text-primary)]">${inst.amount.toLocaleString()}</td>
                      <td className="py-4 text-right">
                        <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-bold ${inst.status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-600'
                          : inst.status === 'Pending'
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-blue-50 text-blue-600'
                          }`}>
                          {inst.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <a href="#" className="text-xs text-[var(--crimson)] font-semibold hover:underline flex items-center gap-1">
                View Payment History <ChevronRight size={14} />
              </a>
              <button onClick={() => setShowPaymentModal(true)} className="inline-flex items-center gap-2 bg-[var(--crimson)] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:brightness-110 hover:scale-105 transition-all duration-300 active:scale-95 shadow-lg shadow-[var(--crimson)]/20">
                Make Payment
              </button>
            </div>
          </Card>

        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[150] p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-300 relative">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
            >
              <X size={24} />
            </button>
            <h3 className="text-2xl font-bold text-[#1B1F3B] mb-6">Fee Payment</h3>

            <div className="mb-6 space-y-4">
              <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="paymentMode"
                  checked={paymentMode === 'full'}
                  onChange={() => setPaymentMode('full')}
                  className="w-4 h-4 text-[var(--crimson)]"
                />
                <div className="flex-1 flex justify-between items-center">
                  <span className="font-bold text-[#1B1F3B]">Pay Full Amount</span>
                  <span className="font-bold text-emerald-600">₹{dueFees}</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="paymentMode"
                  checked={paymentMode === 'monthly'}
                  onChange={() => setPaymentMode('monthly')}
                  className="w-4 h-4 text-[var(--crimson)]"
                />
                <div className="flex-1 flex flex-col gap-2">
                  <span className="font-bold text-[#1B1F3B]">Pay Custom Amount</span>
                  {paymentMode === 'monthly' && (
                    <input
                      type="number"
                      placeholder="Enter Amount"
                      className="w-full border-b-2 border-gray-300 outline-none focus:border-[var(--crimson)] py-1 font-bold text-lg"
                      value={paymentAmount || ''}
                      onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    />
                  )}
                </div>
              </label>
            </div>

            <button
              onClick={handlePayment}
              className="w-full py-3 bg-[var(--crimson)] text-white rounded-xl font-bold hover:brightness-110 transition-colors shadow-lg shadow-red-500/20 text-lg"
            >
              Proceed to Pay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
