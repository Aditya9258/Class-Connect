import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Download, Printer, RefreshCw, ChevronLeft, ChevronRight, Clock, User } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../AuthContext';

interface TimetableCell {
  subject: string;
  prof: string;
  color: string; // Tailwind colors like bg-blue-50/70 border-blue-200 text-blue-700
}

interface TimetableRow {
  time: string;
  mon?: TimetableCell;
  tue?: TimetableCell;
  wed?: TimetableCell;
  thu?: TimetableCell;
  fri?: TimetableCell;
  sat?: TimetableCell;
  isBreak?: boolean;
  breakLabel?: string;
}

export default function ClassCourse() {
  const { user, isLoading } = useAuth();
  const headerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'weekly' | 'daily'>('weekly');
  const [copiedLink, setCopiedLink] = useState(false);
  const [timetableRows, setTimetableRows] = useState<TimetableRow[]>([]);
  const [todaySchedule, setTodaySchedule] = useState<any[]>([]);
  const setIsLoaded = useState(false)[1];

  useEffect(() => {
    // Wait for auth to finish loading before fetching data
    if (isLoading) return;

    const loadTimetable = async () => {
      try {
        const [{ data: studentRes }, { data: dashRes }] = await Promise.all([
          api.get('/student/me').catch(() => ({ data: { data: null } })),
          api.get('/student/dashboard').catch(() => ({ data: { data: { timetables: [], educators: [] } } }))
        ]);

        const dbProfile = studentRes?.data || studentRes || {};
        const courseStr = dbProfile.course || dbProfile.class || 'Class 10-A';
        
        const getStudentClass = (cStr: string) => {
          if (!cStr) return '';
          const match = cStr.match(/Class\s*(\d+)/i);
          if (match) return match[1];
          const parts = cStr.split('-');
          if (parts.length > 0) return parts[0].trim().replace(/Class/i, '').trim();
          return '';
        };
        
        const getStudentSection = (cStr: string) => {
          if (!cStr) return '';
          const parts = cStr.split('-');
          if (parts.length > 1) return parts[1].trim();
          return '';
        };

        const sClass = getStudentClass(courseStr);
        const sSection = getStudentSection(courseStr);

        const dashData = dashRes?.data || dashRes || {};
        const allTimetables = dashData.timetables || [];
        const educators = dashData.educators || [];

        // Filter for this class and section (or global lunch breaks)
        const myTimetables = allTimetables.filter((t: any) => 
          (t.className === sClass && (t.section === sSection || !t.section)) || t.isGlobalLunchBreak
        );

        const periods: { [key: string]: TimetableRow } = {};
        
        const colors = [
          'bg-blue-50/60 border-blue-100 text-blue-600',
          'bg-cyan-50/60 border-cyan-100 text-cyan-600',
          'bg-emerald-50/60 border-emerald-100 text-emerald-600',
          'bg-amber-50/60 border-amber-100 text-amber-600',
          'bg-orange-50/60 border-orange-100 text-orange-600',
          'bg-purple-50/60 border-purple-100 text-purple-600',
          'bg-yellow-50/60 border-yellow-100 text-yellow-600'
        ];

        myTimetables.forEach((t: any) => {
          // Admin saves times as e.g. "08:15" and "09:05"
          const timeKey = `${t.startTime || '00:00'} - ${t.endTime || '00:00'}`;
          if (!periods[timeKey]) {
            periods[timeKey] = {
              time: timeKey,
              isBreak: t.isGlobalLunchBreak,
              breakLabel: t.isGlobalLunchBreak ? 'Break' : undefined
            };
          }

          if (!t.isGlobalLunchBreak && t.subject) {
            const educator = educators.find((ed: any) => ed.id.toString() === t.educatorId?.toString());
            const profName = educator ? educator.name : 'Various';
            const colorIdx = t.subject.length % colors.length;
            
            const cell: TimetableCell = {
              subject: t.subject,
              prof: profName,
              color: colors[colorIdx]
            };

            const dayMap: { [key: string]: keyof TimetableRow } = {
              'Monday': 'mon',
              'Tuesday': 'tue',
              'Wednesday': 'wed',
              'Thursday': 'thu',
              'Friday': 'fri',
              'Saturday': 'sat'
            };
            
            const dayKey = dayMap[t.day];
            if (dayKey) {
              (periods[timeKey] as any)[dayKey] = cell;
            }
          }
        });

        // Sort periods by startTime
        const sortedRows = Object.values(periods).sort((a, b) => {
          const aStart = a.time.split(' - ')[0];
          const bStart = b.time.split(' - ')[0];
          return aStart.localeCompare(bStart);
        });

        setTimetableRows(sortedRows);

        // Compute Today's Schedule
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const todayName = daysOfWeek[new Date().getDay()];
        
        const todayClasses = myTimetables
          .filter((t: any) => t.day === todayName && !t.isGlobalLunchBreak && t.subject)
          .sort((a: any, b: any) => (a.startTime || '').localeCompare(b.startTime || ''))
          .map((t: any) => {
            const colorIdx = t.subject.length % colors.length;
            const borderColors = [
              'border-blue-500 text-blue-600',
              'border-cyan-500 text-cyan-600',
              'border-emerald-500 text-emerald-600',
              'border-amber-500 text-amber-600',
              'border-orange-500 text-orange-600',
              'border-purple-500 text-purple-600',
              'border-yellow-500 text-yellow-600'
            ];
            return {
              time: `${t.startTime} - ${t.endTime}`,
              subject: t.subject,
              color: borderColors[colorIdx]
            };
          });

        setTodaySchedule(todayClasses);
        setIsLoaded(true);

      } catch (error) {
        console.error("Failed to load timetable", error);
      }
    };

    loadTimetable();
  }, [isLoading, user]); // Re-run when auth resolves or user changes

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

  const handlePrint = () => {
    window.print();
  };

  const handleSync = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[var(--cream)] px-4 md:px-12 lg:px-16 print:bg-white print:pt-0 print:pb-0">
      
      {/* Header (Hidden during print) */}
      <div ref={headerRef} className="max-w-[1400px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 print:hidden">
        <div>
          <h1 className="text-5xl font-normal text-[#1B1F3B] tracking-wide" style={{ fontFamily: "'Playball', cursive" }}>
            Class Timetable
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1 font-medium">
            Stay on track with your class schedule.
          </p>
        </div>
        
        {/* Navigation Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Weekly / Daily Selector */}
          <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
            <button
              onClick={() => setViewMode('weekly')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                viewMode === 'weekly' ? 'bg-[#1B1F3B] text-[#D4AF37] shadow-sm' : 'text-gray-500 hover:text-black'
              }`}
            >
              Weekly View
            </button>
            <button
              onClick={() => setViewMode('daily')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                viewMode === 'daily' ? 'bg-[#1B1F3B] text-[#D4AF37] shadow-sm' : 'text-gray-500 hover:text-black'
              }`}
            >
              Daily View
            </button>
          </div>

          <div className="bg-white border border-[#E5D3B3]/40 px-3 py-2 rounded-xl text-xs font-bold text-[#1B1F3B]">
            Term 1 (2026-27)
          </div>

          <button className="bg-white border border-black/10 hover:border-[#D4AF37] hover:text-[#D4AF37] px-4 py-2 rounded-xl text-xs font-bold text-[#1B1F3B] transition-colors">
            Today
          </button>

          <div className="flex items-center bg-white border border-black/10 rounded-xl overflow-hidden shadow-sm">
            <button className="p-2.5 hover:bg-gray-50 text-gray-500 transition-colors">
              <ChevronLeft size={14} />
            </button>
            <div className="w-px h-6 bg-black/5" />
            <button className="p-2.5 hover:bg-gray-50 text-gray-500 transition-colors">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Timetable (Left 3 cols) */}
        <div className="lg:col-span-3 space-y-6 print:w-full">
          <div className="bg-white rounded-[32px] border border-black/5 p-6 md:p-8 shadow-sm">
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs md:text-sm min-w-[700px]">
                <thead>
                  <tr className="border-b border-black/5 text-[10px] text-gray-400 font-extrabold uppercase tracking-widest text-center">
                    <th className="py-4 text-left font-bold w-32">Time</th>
                    <th>Mon</th>
                    <th>Tue</th>
                    <th>Wed</th>
                    <th>Thu</th>
                    <th>Fri</th>
                    <th>Sat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 font-medium">
                  {timetableRows.map((row, rIdx) => {
                    if (row.isBreak) {
                      return (
                        <tr key={rIdx} className="bg-gray-50/50">
                          <td className="py-3 font-bold text-gray-400 font-sans">{row.time}</td>
                          <td colSpan={6} className="py-3 text-center text-xs font-black text-gray-400 tracking-wider">
                            {row.breakLabel}
                          </td>
                        </tr>
                      );
                    }

                    return (
                      <tr key={rIdx} className="hover:bg-gray-50/30">
                        <td className="py-5 font-bold text-gray-400 font-mono">{row.time}</td>
                        {[row.mon, row.tue, row.wed, row.thu, row.fri, row.sat].map((cell, cIdx) => (
                          <td key={cIdx} className="p-1.5 align-middle">
                            {cell ? (
                              <div className={`border rounded-xl p-3 text-center transition-all duration-300 hover:scale-102 hover:shadow-sm cursor-pointer ${cell.color}`}>
                                <p className="font-extrabold leading-tight text-xs md:text-sm">{cell.subject}</p>
                                <p className="text-[10px] opacity-75 mt-1 font-semibold flex items-center justify-center gap-1">
                                  <User size={10} /> {cell.prof}
                                </p>
                              </div>
                            ) : (
                              <div className="text-center text-black/10 py-4">—</div>
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>

          <div className="bg-white/40 border border-black/5 p-4 rounded-2xl text-[10px] text-gray-400 font-semibold flex items-center gap-2 print:hidden">
            <Clock size={14} className="text-[#D4AF37]" />
            <span>Note: Timetable is effective from 15 May 2026. For any changes, please check announcements.</span>
          </div>
        </div>

        {/* Side Panel (Right 1 col) */}
        <div className="lg:col-span-1 space-y-6 print:hidden">
          
          {/* Today's Schedule Card */}
          <div className="bg-white rounded-[32px] border border-black/5 p-6 md:p-8 shadow-sm">
            <h3 className="text-sm font-extrabold text-[#1B1F3B]/60 uppercase tracking-widest mb-1">Today's Schedule</h3>
            <p className="text-xs text-[#1B1F3B] font-bold">
              {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            
            {/* Timeline */}
            <div className="mt-6 space-y-5 relative border-l-2 border-[#1B1F3B]/5 pl-4 ml-2">
              {todaySchedule.map((item, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline dot */}
                  <div className="absolute -left-[23px] top-1.5 w-2.5 h-2.5 rounded-full bg-white border-2 border-[#1B1F3B] group-hover:bg-[#D4AF37] transition-all" />
                  
                  <div>
                    <span className="text-[9px] font-bold font-mono text-gray-400 block">{item.time}</span>
                    <h4 className={`text-sm font-bold mt-0.5 ${item.color.split(' ')[1]}`}>{item.subject}</h4>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full bg-[#1B1F3B] hover:bg-[#D4AF37] text-white py-3 rounded-xl text-xs font-bold transition-colors mt-8">
              View Full Day
            </button>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white rounded-[32px] border border-black/5 p-6 md:p-8 shadow-sm">
            <h3 className="text-xs font-extrabold text-[#1B1F3B]/60 uppercase tracking-widest mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <button 
                onClick={handlePrint}
                className="w-full bg-gray-50 hover:bg-gray-100 border border-black/5 text-[#1B1F3B] font-bold rounded-xl py-3 text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Download size={14} /> Download Timetable
              </button>
              <button 
                onClick={handleSync}
                className="w-full bg-gray-50 hover:bg-gray-100 border border-black/5 text-[#1B1F3B] font-bold rounded-xl py-3 text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <RefreshCw size={14} className={copiedLink ? 'animate-spin' : ''} /> 
                {copiedLink ? 'Syncing...' : 'Sync to Calendar'}
              </button>
              <button 
                onClick={handlePrint}
                className="w-full bg-gray-50 hover:bg-gray-100 border border-black/5 text-[#1B1F3B] font-bold rounded-xl py-3 text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Printer size={14} /> Print Timetable
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
