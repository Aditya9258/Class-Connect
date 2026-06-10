import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Award, Download, AlertCircle, HelpCircle, CheckCircle2, XCircle, FileSpreadsheet } from 'lucide-react';

interface SemesterResult {
  semester: number;
  sgpa: number;
  status: string;
  courses: {
    code: string;
    name: string;
    credits: number;
    grade: string;
    gradePoints: number;
    status: 'Pass' | 'Fail' | 'Ongoing';
  }[];
}

const resultsData: SemesterResult[] = [
  {
    semester: 1,
    sgpa: 91.2,
    status: 'Passed',
    courses: [
      { code: 'MAT-101', name: 'Mathematics', credits: 100, grade: 'A', gradePoints: 92, status: 'Pass' },
      { code: 'SCI-102', name: 'Science', credits: 100, grade: 'A+', gradePoints: 98, status: 'Pass' },
      { code: 'ENG-103', name: 'English', credits: 100, grade: 'A', gradePoints: 90, status: 'Pass' },
      { code: 'SST-104', name: 'Social Science', credits: 100, grade: 'B+', gradePoints: 85, status: 'Pass' },
      { code: 'HIN-105', name: 'Hindi', credits: 100, grade: 'A+', gradePoints: 95, status: 'Pass' },
    ]
  },
  {
    semester: 2,
    sgpa: 81.6,
    status: 'Passed with compartment',
    courses: [
      { code: 'MAT-101', name: 'Mathematics', credits: 100, grade: 'F', gradePoints: 32, status: 'Fail' },
      { code: 'SCI-102', name: 'Science', credits: 100, grade: 'A', gradePoints: 91, status: 'Pass' },
      { code: 'ENG-103', name: 'English', credits: 100, grade: 'B+', gradePoints: 88, status: 'Pass' },
      { code: 'SST-104', name: 'Social Science', credits: 100, grade: 'A+', gradePoints: 96, status: 'Pass' },
      { code: 'HIN-105', name: 'Hindi', credits: 100, grade: 'A', gradePoints: 89, status: 'Pass' },
    ]
  },
  {
    semester: 3,
    sgpa: 95.0,
    status: 'Passed',
    courses: [
      { code: 'MAT-101', name: 'Mathematics', credits: 100, grade: 'A', gradePoints: 94, status: 'Pass' },
      { code: 'SCI-102', name: 'Science', credits: 100, grade: 'A+', gradePoints: 97, status: 'Pass' },
      { code: 'ENG-103', name: 'English', credits: 100, grade: 'A', gradePoints: 91, status: 'Pass' },
      { code: 'SST-104', name: 'Social Science', credits: 100, grade: 'A+', gradePoints: 95, status: 'Pass' },
      { code: 'HIN-105', name: 'Hindi', credits: 100, grade: 'A+', gradePoints: 98, status: 'Pass' },
    ]
  },
  {
    semester: 4,
    sgpa: 93.2,
    status: 'Tentative / Mid Term',
    courses: [
      { code: 'MAT-101', name: 'Mathematics', credits: 100, grade: 'A', gradePoints: 93, status: 'Ongoing' },
      { code: 'SCI-102', name: 'Science', credits: 100, grade: 'A+', gradePoints: 96, status: 'Ongoing' },
      { code: 'ENG-103', name: 'English', credits: 100, grade: 'A+', gradePoints: 95, status: 'Ongoing' },
      { code: 'SST-104', name: 'Social Science', credits: 100, grade: 'A', gradePoints: 92, status: 'Ongoing' },
      { code: 'HIN-105', name: 'Hindi', credits: 100, grade: 'A', gradePoints: 90, status: 'Ongoing' },
    ]
  }
];

export default function GradeCardResult() {
  const headerRef = useRef<HTMLDivElement>(null);
  const [activeSem, setActiveSem] = useState(3);
  const [showRecheckToast, setShowRecheckToast] = useState(false);

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

  const getGradeBadge = (grade: string) => {
    if (grade === 'F') {
      return 'bg-red-50 text-red-600 border border-red-100';
    }
    if (grade === 'A+' || grade === 'O') {
      return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
    }
    return 'bg-blue-50 text-blue-600 border border-blue-100';
  };

  const getStatusBadge = (status: 'Pass' | 'Fail' | 'Ongoing') => {
    switch (status) {
      case 'Pass':
        return <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1"><CheckCircle2 size={10} /> PASSED</span>;
      case 'Fail':
        return <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded flex items-center gap-1"><XCircle size={10} /> COMPARTMENT</span>;
      case 'Ongoing':
        return <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded flex items-center gap-1"><HelpCircle size={10} /> IN PROGRESS</span>;
    }
  };

  const currentResult = resultsData.find(r => r.semester === activeSem) || resultsData[2];

  const handleDownloadReport = () => {
    setShowRecheckToast(true);
    setTimeout(() => {
      setShowRecheckToast(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[var(--cream)]">
      {/* Header */}
      <div ref={headerRef} className="max-w-[1400px] mx-auto px-4 md:px-12 lg:px-16 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[var(--dark)] rounded-2xl flex items-center justify-center shrink-0">
              <Award size={32} className="text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "'Playfair Display', serif" }}>
                Academic Report & Grade Card
              </h2>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Access official report cards, academic summaries, and term-wise results.
              </p>
            </div>
          </div>

          <button 
            onClick={handleDownloadReport}
            className="inline-flex items-center gap-2 bg-[#1B1F3B] hover:bg-[#D4AF37] text-white py-3.5 px-6 rounded-xl text-sm font-bold shadow transition-colors w-fit shrink-0"
          >
            <Download size={16} /> Export Grade Card
          </button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-12 lg:px-16 space-y-8">
        
        {/* Performance Highlighting Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: 'Cumulative Percentage', value: '90.25%', sub: 'Class Rank: 14th', color: 'text-[#1B1F3B]' },
            { label: 'Total Subjects', value: '20 / 20', sub: 'All subjects cleared', color: 'text-[#1B1F3B]' },
            { label: 'Compartment Exams', value: '1 Paper', sub: 'Subject: MAT-101 Math', color: 'text-red-600' },
            { label: 'Evaluated Terms', value: '3 Terms', sub: 'Term 4 results pending', color: 'text-[#1B1F3B]' },
          ].map((card, i) => (
            <div key={i} className="bg-white rounded-2xl border border-black/5 p-6 shadow-sm">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{card.label}</p>
              <p className={`text-2xl font-black mt-2 ${card.color}`}>{card.value}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Semester Selection Tabs */}
        <div className="bg-white rounded-2xl border border-black/5 p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-black/5 pb-4 mb-6 gap-4">
            <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
              <FileSpreadsheet size={20} className="text-[#D4AF37]" /> Term Breakdown
            </h3>
            
            <div className="flex bg-gray-100 rounded-xl p-1 gap-1 w-fit">
              {resultsData.map((res) => (
                <button
                  key={res.semester}
                  onClick={() => setActiveSem(res.semester)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                    activeSem === res.semester
                      ? 'bg-[#1B1F3B] text-[#D4AF37] shadow-sm'
                      : 'text-gray-500 hover:text-[#1B1F3B]'
                  }`}
                >
                  Term {res.semester}
                </button>
              ))}
            </div>
          </div>

          {/* Grades Table */}
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-50 p-4 rounded-xl border border-black/5">
              <div className="flex items-center gap-4 text-sm">
                <div>
                  <span className="text-gray-400 text-xs uppercase font-bold">Term Percentage</span>
                  <p className="text-lg font-extrabold text-[#1B1F3B]">{currentResult.sgpa.toFixed(2)}%</p>
                </div>
                <div className="w-px h-8 bg-black/10" />
                <div>
                  <span className="text-gray-400 text-xs uppercase font-bold">Term Status</span>
                  <p className="text-sm font-bold text-gray-600">{currentResult.status}</p>
                </div>
              </div>
              
              {activeSem === 2 && (
                <div className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-2 rounded-lg border border-red-150 text-xs font-bold">
                  <AlertCircle size={14} strokeWidth={2.5} />
                  <span>MAT-101 Mathematics exam failed. Please register for Compartment exam.</span>
                </div>
              )}
            </div>

            <div className="overflow-x-auto border border-black/5 rounded-2xl">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="bg-[#1B1F3B]/5 text-[#1B1F3B] text-[10px] uppercase tracking-wider font-bold">
                    <th className="py-3.5 px-5">Code</th>
                    <th className="py-3.5 px-5">Subject Title</th>
                    <th className="py-3.5 px-5 text-center">Max Marks</th>
                    <th className="py-3.5 px-5 text-center">Grade</th>
                    <th className="py-3.5 px-5 text-center">Marks</th>
                    <th className="py-3.5 px-5 text-center">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {currentResult.courses.map((course) => (
                    <tr key={course.code} className="hover:bg-gray-50/50 bg-white">
                      <td className="py-4 px-5 font-mono font-bold text-gray-400">{course.code}</td>
                      <td className="py-4 px-5 font-bold text-[#1B1F3B]">{course.name}</td>
                      <td className="py-4 px-5 text-center font-semibold text-gray-600">{course.credits}</td>
                      <td className="py-4 px-5 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getGradeBadge(course.grade)}`}>
                          {course.grade}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-center font-bold text-gray-600">{course.gradePoints}</td>
                      <td className="py-4 px-5 text-center flex justify-center">
                        {getStatusBadge(course.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* Floating Toast Notification */}
      {showRecheckToast && (
        <div className="fixed bottom-6 right-6 bg-[#1B1F3B] text-white py-3.5 px-6 rounded-2xl border border-[#D4AF37]/30 shadow-2xl z-[400] flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <p className="text-sm font-semibold">Generating report... Your PDF is downloading.</p>
        </div>
      )}

    </div>
  );
}
