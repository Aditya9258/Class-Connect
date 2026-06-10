import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { BarChart3, TrendingUp, MessageSquare, Compass, AlertCircle } from 'lucide-react';

interface PerformanceMetric {
  label: string;
  value: number;
  max: number;
  change: string;
}

const metricsData: PerformanceMetric[] = [
  { label: 'Class Engagement', value: 4.7, max: 5.0, change: '+0.2 from last term' },
  { label: 'Communication Skills', value: 4.2, max: 5.0, change: 'Stable' },
  { label: 'Technical Knowledge', value: 4.8, max: 5.0, change: '+0.4 from last term' },
  { label: 'Initiative & Involvement', value: 4.5, max: 5.0, change: '-0.1 from last term' },
  { label: 'Behavior & Conduct', value: 4.9, max: 5.0, change: 'Excellent' },
];

const teacherComments = [
  { prof: 'Grace Hopper', subject: 'Data Structures', comment: 'Exceptional problem-solving capabilities. Consistently leads group discussions.' },
  { prof: 'Linus Torvalds', subject: 'Operating Systems', comment: 'Great execution of lab assignments. Needs minor focus on theoretical details.' },
  { prof: 'Edgar Codd', subject: 'Database Systems', comment: 'Active participation in SQL design sessions. Project deliverables are highly organized.' },
];

export default function PerformanceAnalysis() {
  const headerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[var(--cream)] px-4 md:px-12 lg:px-16">
      {/* Header */}
      <div ref={headerRef} className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 animate-in">
        <div>
          <h1 className="text-5xl font-normal text-[#1B1F3B] tracking-wide" style={{ fontFamily: "'Playball', cursive" }}>
            Performance Analysis
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1 font-medium">
            Review detailed qualitative metrics, professional indices, and mentors' feedback.
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Qualitative Metrics */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[32px] border border-black/5 p-6 md:p-8 shadow-sm">
            <h3 className="text-base font-bold text-[#1B1F3B] mb-6 border-b border-black/5 pb-4 flex items-center gap-2">
              <BarChart3 size={18} className="text-[#D4AF37]" /> Core Performance Indices
            </h3>

            <div className="space-y-6">
              {metricsData.map((metric, idx) => (
                <div key={idx} className="group">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="font-bold text-[#1B1F3B] text-sm md:text-base">{metric.label}</h4>
                      <span className="text-[10px] text-gray-400 font-semibold">{metric.change}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-black text-[#1B1F3B]">{metric.value.toFixed(1)}</span>
                      <span className="text-xs text-gray-400"> / {metric.max.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#1B1F3B] to-[#D4AF37] rounded-full transition-all duration-700"
                      style={{ width: `${(metric.value / metric.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mentors Feedback */}
          <div className="bg-white rounded-[32px] border border-black/5 p-6 md:p-8 shadow-sm">
            <h3 className="text-base font-bold text-[#1B1F3B] mb-6 border-b border-black/5 pb-4 flex items-center gap-2">
              <MessageSquare size={18} className="text-[#D4AF37]" /> Mentors' Remarks
            </h3>

            <div className="space-y-4">
              {teacherComments.map((tc, idx) => (
                <div key={idx} className="border border-black/5 p-5 rounded-2xl bg-white hover:bg-gray-50/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-[#1B1F3B] text-sm">Prof. {tc.prof}</h4>
                      <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">{tc.subject}</p>
                    </div>
                    <span className="bg-[#1B1F3B]/5 text-[#1B1F3B] px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wide">Verified Mentor</span>
                  </div>
                  <p className="text-xs text-gray-500 italic leading-relaxed mt-3">
                    "{tc.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Summaries & CGPA */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Growth Summary Card */}
          <div className="bg-[#1B1F3B] rounded-[32px] p-6 md:p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37] opacity-10 rounded-full blur-3xl" />
            
            <h3 className="text-base font-bold mb-6 flex items-center gap-2">
              <TrendingUp size={18} className="text-[#D4AF37]" /> Growth Analytics
            </h3>

            <div className="space-y-5">
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <span className="text-xs text-gray-300">Class percentile</span>
                <span className="text-lg font-black text-[#D4AF37]">89th Percentile</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <span className="text-xs text-gray-300">Mentorship Status</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">On Track</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-300">Average Performance</span>
                <span className="text-lg font-black">4.64 / 5.0</span>
              </div>
            </div>
          </div>

          {/* Recommendations Card */}
          <div className="bg-white rounded-[32px] border border-black/5 p-6 md:p-8 shadow-sm">
            <h3 className="text-xs font-extrabold text-[#1B1F3B]/60 uppercase tracking-widest mb-4">Core Recommendations</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-2xl border">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                  <Compass size={16} />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-[#1B1F3B]">Advance Seminars</h5>
                  <p className="text-[10px] text-gray-400 leading-normal mt-0.5 font-semibold">
                    Enroll in technical presentation courses to increase communication score to 4.5+.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-2xl border">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                  <AlertCircle size={16} />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-[#1B1F3B]">Practical Lab Projects</h5>
                  <p className="text-[10px] text-gray-400 leading-normal mt-0.5 font-semibold">
                    Continue leading software engineering workshops to preserve the engagement rating.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
