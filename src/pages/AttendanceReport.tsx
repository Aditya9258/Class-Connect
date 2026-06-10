import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Download, ChevronLeft, ChevronRight, Info, Calendar, ArrowUpRight } from 'lucide-react';

interface AttendanceLog {
  date: string;
  day: string;
  status: 'Present' | 'Absent' | 'Late (10 min)';
  remarks: string;
  subject: string;
}

const recentLogs: AttendanceLog[] = [
  { date: '20 May 2026', day: 'Mon', status: 'Present', remarks: '-', subject: 'All Subjects' },
  { date: '17 May 2026', day: 'Fri', status: 'Present', remarks: '-', subject: 'All Subjects' },
  { date: '16 May 2026', day: 'Thu', status: 'Present', remarks: '-', subject: 'All Subjects' },
  { date: '15 May 2026', day: 'Wed', status: 'Late (10 min)', remarks: 'Reached late due to traffic', subject: 'All Subjects' },
  { date: '14 May 2026', day: 'Tue', status: 'Present', remarks: '-', subject: 'All Subjects' },
  { date: '13 May 2026', day: 'Mon', status: 'Present', remarks: '-', subject: 'All Subjects' },
];

const subjectAttendance = [
  { subject: 'Mathematics', percentage: 93, color: 'bg-emerald-500' },
  { subject: 'Science', percentage: 91, color: 'bg-emerald-500' },
  { subject: 'English', percentage: 94, color: 'bg-emerald-500' },
  { subject: 'Social Science', percentage: 90, color: 'bg-emerald-500' },
  { subject: 'Hindi', percentage: 92, color: 'bg-emerald-500' },
  { subject: 'Computer Science', percentage: 95, color: 'bg-emerald-500' },
];

export default function AttendanceReport() {
  const headerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'daily' | 'month' | 'term'>('overview');
  const [showExportToast, setShowExportToast] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        delay: 0.1,
      });
    });
    return () => ctx.revert();
  }, []);

  const handleExport = () => {
    setShowExportToast(true);
    setTimeout(() => setShowExportToast(false), 3000);
  };

  // Static May 2026 calendar days simulation
  const calendarDays = [
    { day: 29, status: 'empty' }, { day: 30, status: 'empty' },
    { day: 1, status: 'present' }, { day: 2, status: 'present' }, { day: 3, status: 'present' }, { day: 4, status: 'weekend' },
    { day: 6, status: 'present' }, { day: 7, status: 'absent' }, { day: 8, status: 'present' }, { day: 9, status: 'present' }, { day: 10, status: 'present' }, { day: 11, status: 'weekend' },
    { day: 13, status: 'present' }, { day: 14, status: 'present' }, { day: 15, status: 'present' }, { day: 16, status: 'present' }, { day: 17, status: 'present' }, { day: 18, status: 'weekend' },
    { day: 20, status: 'present' }, { day: 21, status: 'late' }, { day: 22, status: 'present' }, { day: 23, status: 'absent' }, { day: 24, status: 'present' }, { day: 25, status: 'weekend' },
    { day: 27, status: 'present' }, { day: 28, status: 'present' }, { day: 29, status: 'present' }, { day: 30, status: 'present' }, { day: 31, status: 'present' }, { day: 1, status: 'empty' }
  ];

  const getDayDotColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-emerald-500';
      case 'absent': return 'bg-red-500';
      case 'late': return 'bg-amber-500';
      case 'holiday': return 'bg-purple-500';
      case 'weekend': return 'bg-gray-200';
      default: return 'bg-transparent';
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[var(--cream)] px-4 md:px-12 lg:px-16">
      
      {/* Header */}
      <div ref={headerRef} className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 animate-in">
        <div>
          <h1 className="text-5xl font-normal text-[#1B1F3B] tracking-wide" style={{ fontFamily: "'Playball', cursive" }}>
            Attendance Report
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1 font-medium">
            Track your attendance and stay consistent.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select className="bg-white border border-[#E5D3B3]/40 px-3 py-2.5 rounded-xl text-xs font-bold text-[#1B1F3B] focus:outline-none">
            <option>Term 1 (2026-27)</option>
            <option>Term 2 (2026-27)</option>
          </select>
          <select className="bg-white border border-[#E5D3B3]/40 px-3 py-2.5 rounded-xl text-xs font-bold text-[#1B1F3B] focus:outline-none">
            <option>All Subjects</option>
            <option>Mathematics</option>
            <option>Science</option>
          </select>
          <button 
            onClick={handleExport}
            className="bg-[#1B1F3B] hover:bg-[#D4AF37] text-white py-2.5 px-5 rounded-xl text-xs font-bold shadow transition-colors flex items-center gap-1.5"
          >
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* Navigation Tabs */}
        <div className="border-b border-black/5 pb-1 flex gap-6 text-sm font-bold text-gray-400">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'daily', label: 'Daily Log' },
            { id: 'month', label: 'Month-wise' },
            { id: 'term', label: 'Term-wise' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 relative transition-colors ${
                activeTab === tab.id ? 'text-[#1B1F3B]' : 'hover:text-black'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1B1F3B]" />
              )}
            </button>
          ))}
        </div>

        {/* KPI Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
          {/* Overall Attendance half-donut */}
          <div className="bg-white border border-black/5 rounded-[24px] p-5 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="relative w-20 h-10 overflow-hidden">
              <svg className="w-20 h-20 absolute top-0 left-0">
                <circle cx="40" cy="40" r="32" fill="none" stroke="#E2E8F0" strokeWidth="8" />
                <circle 
                  cx="40" cy="40" r="32" fill="none" stroke="#10B981" strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 32}
                  strokeDashoffset={2 * Math.PI * 32 - (92 / 100) * (Math.PI * 32)}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute bottom-0 inset-x-0 text-center font-black text-[#1B1F3B] text-lg">92%</div>
            </div>
            <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mt-2">Overall Attendance</p>
            <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-black px-2 py-0.5 rounded-full mt-2">
              ★ Excellent
            </span>
          </div>

          {[
            { label: 'Total Days', val: '78', sub: 'School Working Days' },
            { label: 'Days Present', val: '72', sub: 'Days' },
            { label: 'Days Absent', val: '6', sub: 'Days', color: 'text-red-500' },
            { label: 'Days Late', val: '2', sub: 'Days', color: 'text-amber-500' },
          ].map((kpi, idx) => (
            <div key={idx} className="bg-white border border-black/5 rounded-[24px] p-5 shadow-sm flex flex-col justify-center">
              <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">{kpi.label}</p>
              <h3 className={`text-3xl font-black mt-2 font-sans ${kpi.color || 'text-[#1B1F3B]'}`}>{kpi.val}</h3>
              <p className="text-[10px] text-gray-400 font-bold mt-1">{kpi.sub}</p>
            </div>
          ))}
        </div>

        {/* Second Row: Calendar & Subject-wise */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Attendance Calendar (Left 2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-[32px] border border-black/5 p-6 md:p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold text-[#1B1F3B] flex items-center gap-2">
                <Calendar size={18} className="text-[#D4AF37]" /> Attendance Calendar
              </h3>
              
              <div className="flex items-center gap-3 text-xs font-bold text-[#1B1F3B]">
                <button className="p-1 hover:bg-gray-100 rounded-lg"><ChevronLeft size={16} /></button>
                <span>May 2026</span>
                <button className="p-1 hover:bg-gray-100 rounded-lg"><ChevronRight size={16} /></button>
                <button className="text-[10px] bg-gray-50 border px-2.5 py-1 rounded-lg">Today</button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-6 gap-x-2 gap-y-4 text-center text-xs font-bold text-gray-500 mb-6">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} className="text-[10px] text-gray-400 uppercase tracking-widest pb-2">{d}</div>
              ))}
              {calendarDays.map((day, idx) => (
                <div key={idx} className="relative flex flex-col items-center justify-center p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                  <span className={day.status === 'empty' ? 'text-gray-300 font-normal' : 'text-[#1B1F3B]'}>
                    {day.day}
                  </span>
                  {day.status !== 'empty' && (
                    <span className={`w-2 h-2 rounded-full absolute bottom-1 ${getDayDotColor(day.status)}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="border-t border-black/5 pt-4 flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider justify-center">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Present</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Absent</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Late</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gray-200" /> Weekend</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Holiday</div>
            </div>
          </div>

          {/* Subject-wise Attendance (Right 1 col) */}
          <div className="lg:col-span-1 bg-white rounded-[32px] border border-black/5 p-6 md:p-8 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6 border-b border-black/5 pb-3">
              <h3 className="text-base font-bold text-[#1B1F3B]">Subject-wise Attendance</h3>
              <button className="text-xs font-bold text-[#D4AF37] hover:underline flex items-center gap-1">
                View Details <ArrowUpRight size={14} />
              </button>
            </div>

            <div className="space-y-4">
              {subjectAttendance.map((sub, idx) => (
                <div key={idx} className="group">
                  <div className="flex justify-between items-center mb-1.5 text-xs font-bold">
                    <span className="text-gray-500 group-hover:text-black transition-colors">{sub.subject}</span>
                    <span className="text-[#1B1F3B]">{sub.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${sub.color} rounded-full transition-all duration-700`}
                      style={{ width: `${sub.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Third Row: Logs & Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Logs Table (Left 2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-[32px] border border-black/5 p-6 md:p-8 shadow-sm">
            <h3 className="text-base font-bold text-[#1B1F3B] mb-6 border-b border-black/5 pb-4">
              Recent Attendance Log
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-black/5 text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">
                    <th className="pb-3 pr-2">Date</th>
                    <th className="pb-3 text-center pr-2">Day</th>
                    <th className="pb-3 text-center">Status</th>
                    <th className="pb-3">Remarks</th>
                    <th className="pb-3 text-right">Subject</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 font-medium">
                  {recentLogs.map((log, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50">
                      <td className="py-3 font-bold text-[#1B1F3B] whitespace-nowrap">{log.date}</td>
                      <td className="py-3 text-center text-gray-400 font-semibold">{log.day}</td>
                      <td className="py-3 text-center">
                        <span className={`inline-block text-[9px] font-extrabold px-2 py-0.5 rounded border ${
                          log.status === 'Present' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                          log.status.includes('Late') ? 'bg-amber-50 border-amber-100 text-amber-600' : 'bg-red-50 border-red-100 text-red-600'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3 text-gray-500 text-xs italic">{log.remarks}</td>
                      <td className="py-3 text-right text-gray-600 font-bold">{log.subject}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button className="w-full text-center py-3 text-xs font-bold text-gray-400 hover:text-[#D4AF37] mt-4 transition-colors">
              View Full Attendance Log ↗
            </button>
          </div>

          {/* Line Chart / Did You Know (Right 1 col) */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Chart Card */}
            <div className="bg-white rounded-[32px] border border-black/5 p-6 md:p-8 shadow-sm">
              <h3 className="text-xs font-extrabold text-[#1B1F3B]/60 uppercase tracking-widest mb-4">Attendance Summary</h3>
              
              {/* SVG Line Chart */}
              <div className="relative h-36 w-full mt-4">
                <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                  {/* Grid lines */}
                  <line x1="0" y1="20" x2="300" y2="20" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
                  <line x1="0" y1="50" x2="300" y2="50" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
                  <line x1="0" y1="80" x2="300" y2="80" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
                  
                  {/* Line path (Mar: 75, Apr: 85, May: 92, Jun: 80, Jul: 90) */}
                  <path 
                    d="M 10 75 L 80 50 L 150 25 L 220 60 L 290 30" 
                    fill="none" 
                    stroke="#10B981" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                  />
                  {/* Points */}
                  <circle cx="10" cy="75" r="4" fill="white" stroke="#10B981" strokeWidth="2.5" />
                  <circle cx="80" cy="50" r="4" fill="white" stroke="#10B981" strokeWidth="2.5" />
                  <circle cx="150" cy="25" r="4" fill="white" stroke="#10B981" strokeWidth="2.5" />
                  <circle cx="220" cy="60" r="4" fill="white" stroke="#10B981" strokeWidth="2.5" />
                  <circle cx="290" cy="30" r="4" fill="white" stroke="#10B981" strokeWidth="2.5" />
                </svg>

                {/* X Axis Labels */}
                <div className="flex justify-between text-[8px] font-bold text-gray-400 mt-2 px-1 uppercase tracking-wider">
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                </div>
              </div>
            </div>

            {/* Tip Card */}
            <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/30 border border-blue-100 rounded-3xl p-5 md:p-6 flex items-start gap-3 relative overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Info size={16} />
              </div>
              <div>
                <h5 className="font-bold text-xs text-[#1B1F3B] mb-1">Did you know?</h5>
                <p className="text-[10px] text-gray-500 leading-normal font-semibold">
                  Students with 90%+ attendance are more likely to perform better academically. Keep up the high streak!
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Floating Toast Notification */}
      {showExportToast && (
        <div className="fixed bottom-6 right-6 bg-[#1B1F3B] text-white py-3.5 px-6 rounded-2xl border border-[#D4AF37]/30 shadow-2xl z-[400] flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <p className="text-sm font-semibold font-sans">Compiling attendance logs... Your CSV is downloading.</p>
        </div>
      )}

    </div>
  );
}
