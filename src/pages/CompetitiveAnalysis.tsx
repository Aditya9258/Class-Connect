import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Compass, AlertCircle, Sparkles, Filter } from 'lucide-react';

interface SubjectComparison {
  name: string;
  yourScore: number;
  classAvg: number;
  schoolAvg: number;
  topScore: number;
  color: string;
}

const subjectComparisons: SubjectComparison[] = [
  { name: 'Mathematics', yourScore: 85, classAvg: 68, schoolAvg: 71, topScore: 98, color: 'bg-indigo-500' },
  { name: 'Science', yourScore: 72, classAvg: 66, schoolAvg: 69, topScore: 95, color: 'bg-teal-500' },
  { name: 'English', yourScore: 78, classAvg: 70, schoolAvg: 72, topScore: 96, color: 'bg-amber-500' },
  { name: 'Social Studies', yourScore: 65, classAvg: 62, schoolAvg: 65, topScore: 91, color: 'bg-rose-500' },
  { name: 'Hindi', yourScore: 80, classAvg: 74, schoolAvg: 76, topScore: 93, color: 'bg-purple-500' },
];

export default function CompetitiveAnalysis() {
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
            Competitive Analysis
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1 font-medium">
            Track how you perform compared to your class and grade level.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select className="bg-white border border-[#E5D3B3]/40 px-3 py-2.5 rounded-xl text-xs font-bold text-[#1B1F3B] focus:outline-none">
            <option>Term 1 (2026-27)</option>
            <option>Term 2 (2026-27)</option>
          </select>
          <select className="bg-white border border-[#E5D3B3]/40 px-3 py-2.5 rounded-xl text-xs font-bold text-[#1B1F3B] focus:outline-none">
            <option>All Subjects</option>
            <option>Mathematics</option>
            <option>Science</option>
          </select>
          <button className="bg-white border border-black/10 hover:border-[#D4AF37] p-2.5 rounded-xl text-[#1B1F3B] transition-colors">
            <Filter size={16} />
          </button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Performance Index */}
          <div className="bg-white border border-black/5 rounded-[32px] p-6 md:p-8 shadow-sm flex flex-col sm:flex-row gap-6 justify-between items-center">
            <div className="space-y-3 flex-1 text-center sm:text-left">
              <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest block">Overall Performance Index</span>
              <h2 className="text-4xl font-black text-[#1B1F3B]">78<span className="text-lg text-gray-400 font-normal"> / 100</span></h2>
              <p className="text-xs text-gray-400 font-semibold leading-normal">Well done! You're performing better than last term.</p>
              <button className="text-xs font-bold text-[#1B1F3B] hover:text-[#D4AF37] border border-black/10 hover:border-[#D4AF37] py-1.5 px-4 rounded-xl mt-3 transition-colors">
                View Progress ↗
              </button>
            </div>
            
            <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="52" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="8" />
                <circle 
                  cx="64" cy="64" r="52" fill="none" stroke="#6366F1" strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 52}
                  strokeDashoffset={2 * Math.PI * 52 - 0.78 * (2 * Math.PI * 52)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-[#1B1F3B]">
                <span className="text-xs font-bold text-gray-400 block">Top</span>
                <span className="text-xl font-black">22%</span>
                <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wide">In School</span>
              </div>
            </div>
          </div>

          {/* Card 2: Class Rank */}
          <div className="bg-white border border-black/5 rounded-[32px] p-6 md:p-8 shadow-sm flex gap-6 items-center justify-between">
            <div className="space-y-2">
              <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest block">Class Rank</span>
              <h2 className="text-4xl font-black text-amber-500">8<span className="text-lg text-gray-400 font-normal"> / 32</span></h2>
              <p className="text-xs text-gray-400 font-semibold leading-normal">You are in the top performers. Keep it up!</p>
            </div>

            {/* Podium Graphic (SVG) */}
            <div className="w-24 h-24 shrink-0 flex items-end justify-center gap-1.5 pb-2">
              <div className="w-6 h-10 bg-amber-400/20 rounded-t-lg border border-amber-300/30 flex items-center justify-center text-[10px] font-bold text-amber-600">3</div>
              <div className="w-6 h-16 bg-amber-500/30 rounded-t-lg border border-amber-400/40 relative flex items-center justify-center text-xs font-black text-amber-700">
                <span className="absolute -top-5 text-amber-500 text-xs font-bold">★</span>1
              </div>
              <div className="w-6 h-12 bg-amber-400/20 rounded-t-lg border border-amber-300/30 flex items-center justify-center text-[10px] font-bold text-amber-600">2</div>
            </div>
          </div>

          {/* Card 3: Percentile */}
          <div className="bg-white border border-black/5 rounded-[32px] p-6 md:p-8 shadow-sm flex gap-6 items-center justify-between">
            <div className="space-y-2">
              <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest block">Percentile</span>
              <h2 className="text-4xl font-black text-emerald-500">72<span className="text-lg font-normal">nd</span></h2>
              <p className="text-xs text-gray-400 font-semibold leading-normal">You scored higher than 72% of students in Grade 10.</p>
            </div>

            {/* Bar growth chart (SVG) */}
            <div className="w-20 h-16 shrink-0 flex items-end justify-center gap-1">
              {[25, 45, 60, 80].map((h, idx) => (
                <div 
                  key={idx} 
                  className={`w-3.5 rounded-t bg-emerald-500 transition-all ${idx === 3 ? 'opacity-100 animate-pulse' : 'opacity-40'}`} 
                  style={{ height: `${h}%` }} 
                />
              ))}
            </div>
          </div>

        </div>

        {/* Comparison & Trend Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Subject-wise Comparison Table */}
          <div className="bg-white rounded-[32px] border border-black/5 p-6 md:p-8 shadow-sm">
            <h3 className="text-base font-bold text-[#1B1F3B] mb-6">Subject-wise Comparison</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-black/5 text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">
                    <th className="pb-3 pr-2">Subject</th>
                    <th className="pb-3 w-40">Your Score</th>
                    <th className="pb-3 text-center">Class Avg</th>
                    <th className="pb-3 text-center">School Avg</th>
                    <th className="pb-3 text-center">Top Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 font-semibold">
                  {subjectComparisons.map((sub, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50">
                      <td className="py-4 text-[#1B1F3B] font-bold">{sub.name}</td>
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="w-8 shrink-0 text-right text-xs font-black text-[#1B1F3B]">{sub.yourScore}%</span>
                          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full ${sub.color} rounded-full`} style={{ width: `${sub.yourScore}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-center text-gray-500 font-mono">{sub.classAvg}%</td>
                      <td className="py-4 text-center text-gray-500 font-mono">{sub.schoolAvg}%</td>
                      <td className="py-4 text-center text-emerald-600 font-mono font-bold">{sub.topScore}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Performance Trend Chart */}
          <div className="bg-white rounded-[32px] border border-black/5 p-6 md:p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold text-[#1B1F3B]">Performance Trend</h3>
              
              <div className="flex items-center gap-4 text-[9px] font-extrabold uppercase tracking-wider text-gray-400">
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-indigo-500 inline-block" /> You</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-teal-500 border-dashed border-t inline-block" /> Class Avg</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-amber-500 border-dashed border-t inline-block" /> School Avg</div>
              </div>
            </div>

            {/* Performance line chart comparison */}
            <div className="relative h-56 w-full mt-4">
              <svg className="w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none">
                {/* Grid guidelines */}
                <line x1="0" y1="20" x2="400" y2="20" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
                <line x1="0" y1="60" x2="400" y2="60" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
                <line x1="0" y1="100" x2="400" y2="100" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
                
                {/* You Line (Indigo) - solid */}
                <path d="M 20 70 L 110 50 L 200 40 L 290 55 L 380 25" fill="none" stroke="#6366F1" strokeWidth="3" />
                <circle cx="20" cy="70" r="3.5" fill="white" stroke="#6366F1" strokeWidth="2" />
                <circle cx="110" cy="50" r="3.5" fill="white" stroke="#6366F1" strokeWidth="2" />
                <circle cx="200" cy="40" r="3.5" fill="white" stroke="#6366F1" strokeWidth="2" />
                <circle cx="290" cy="55" r="3.5" fill="white" stroke="#6366F1" strokeWidth="2" />
                <circle cx="380" cy="25" r="3.5" fill="white" stroke="#6366F1" strokeWidth="2" />

                {/* Class Avg Line (Teal) - dashed */}
                <path d="M 20 90 L 110 80 L 200 75 L 290 85 L 380 70" fill="none" stroke="#14B8A6" strokeWidth="2" strokeDasharray="4 4" />
                
                {/* School Avg Line (Amber) - dashed */}
                <path d="M 20 95 L 110 90 L 200 85 L 290 92 L 380 80" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4 4" />
              </svg>

              {/* X Axis Labels */}
              <div className="flex justify-between text-[9px] font-extrabold text-gray-400 mt-2 uppercase tracking-wider">
                <span>Unit Test 1</span>
                <span>Unit Test 2</span>
                <span>Mid Term</span>
                <span>Unit Test 3</span>
                <span>Final Exam</span>
              </div>
            </div>
          </div>

        </div>

        {/* Strengths, Weaknesses & Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Strengths & Focus Areas */}
          <div className="bg-white rounded-[32px] border border-black/5 p-6 md:p-8 shadow-sm">
            <h3 className="text-base font-bold text-[#1B1F3B] mb-6">Strengths & Focus Areas</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              {/* Strengths */}
              <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-5 space-y-3">
                <h4 className="font-extrabold text-emerald-700 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                  <Sparkles size={14} /> Your Strengths
                </h4>
                <div className="space-y-2 font-bold text-gray-600">
                  {['Mathematics', 'English', 'Hindi'].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-emerald-100/40 shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Focus Areas */}
              <div className="bg-amber-50/40 border border-amber-100 rounded-2xl p-5 space-y-3">
                <h4 className="font-extrabold text-amber-700 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                  <AlertCircle size={14} /> Focus Areas
                </h4>
                <div className="space-y-2 font-bold text-gray-600">
                  {['Social Studies', 'Science'].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-amber-100/40 shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Insights & Suggestions */}
          <div className="bg-white rounded-[32px] border border-black/5 p-6 md:p-8 shadow-sm flex flex-col justify-between">
            <h3 className="text-base font-bold text-[#1B1F3B] mb-4">Insights & Suggestions</h3>
            
            <div className="bg-indigo-50/40 border border-indigo-100/70 rounded-2xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <Compass size={20} />
              </div>
              <div className="space-y-2">
                <h4 className="font-extrabold text-sm text-[#1B1F3B]">Great job in Mathematics! 🏆</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed font-semibold">
                  Your consistent performance is helping you maintain a high rank. Try spending more time on <strong className="text-indigo-600 font-bold">Social Studies</strong> to improve your score. Solve previous year papers and revise key concepts.
                </p>
              </div>
            </div>

            <button className="w-full bg-[#1B1F3B] hover:bg-[#D4AF37] text-white py-3 rounded-xl text-xs font-bold transition-all mt-6 shadow-sm">
              View Study Recommendations ↗
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
