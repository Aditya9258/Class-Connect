import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { FileText, Printer, AlertCircle, Award } from 'lucide-react';

interface ExamSchedule {
  code: string;
  subject: string;
  date: string;
  time: string;
  hall: string;
  status: 'Ready' | 'Verified';
}

const examSchedule: ExamSchedule[] = [
  { code: 'MAT-101', subject: 'Mathematics', date: 'Nov 15, 2026', time: '09:30 AM - 12:30 PM', hall: 'Examination Hall A', status: 'Ready' },
  { code: 'SCI-102', subject: 'Science', date: 'Nov 17, 2026', time: '09:30 AM - 12:30 PM', hall: 'Examination Hall A', status: 'Ready' },
  { code: 'ENG-103', subject: 'English', date: 'Nov 19, 2026', time: '09:30 AM - 12:30 PM', hall: 'Examination Hall B', status: 'Ready' },
  { code: 'SST-104', subject: 'Social Science', date: 'Nov 21, 2026', time: '09:30 AM - 12:30 PM', hall: 'Examination Hall A', status: 'Ready' },
  { code: 'HIN-105', subject: 'Hindi', date: 'Nov 24, 2026', time: '09:30 AM - 12:30 PM', hall: 'Examination Hall B', status: 'Ready' },
];

export default function HallAdmitCard() {
  const headerRef = useRef<HTMLDivElement>(null);
  const cardPrintRef = useRef<HTMLDivElement>(null);
  const [studentDetails, setStudentDetails] = useState({
    name: 'John Doe',
    rollNo: '2024CS101',
    regNo: 'STU-12345678',
    course: 'Class 10',
    semester: 'Section A',
    cycle: 'Term-End Exams, Nov 2026',
    photo: '/images/team-1.jpg'
  });

  useEffect(() => {
    // Attempt to read logged in student information from localStorage
    const studentId = localStorage.getItem('logged_in_student_id');
    const storedStudentsRaw = localStorage.getItem('global_students');
    if (studentId && storedStudentsRaw) {
      try {
        const allStudents = JSON.parse(storedStudentsRaw);
        const student = allStudents.find((s: any) => s.id === studentId);
        if (student) {
          setStudentDetails(prev => ({
            ...prev,
            name: student.name,
            rollNo: student.regNo || '2024CS101',
            regNo: student.id,
            course: student.course || student.class || 'Class 10',
            semester: student.semester ? `Section ${student.semester}` : 'Section A'
          }));
        }
      } catch (err) {
        console.error("Error loading student details in Admit Card", err);
      }
    }

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

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[var(--cream)] print:bg-white print:pt-0 print:pb-0">
      {/* Header (Hidden during print) */}
      <div ref={headerRef} className="max-w-[1400px] mx-auto px-4 md:px-12 lg:px-16 mb-8 print:hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[var(--dark)] rounded-2xl flex items-center justify-center shrink-0">
              <FileText size={32} className="text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "'Playfair Display', serif" }}>
                Admit Card Portal
              </h2>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Download or print your authenticated digital hall ticket for upcoming examinations.
              </p>
            </div>
          </div>
          
          <button 
            onClick={handlePrint}
            className="inline-flex items-center gap-2 bg-[#1B1F3B] hover:bg-[#D4AF37] text-white py-3.5 px-6 rounded-xl text-sm font-bold shadow-md transition-colors w-fit shrink-0"
          >
            <Printer size={18} /> Print Admit Card
          </button>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-4 print:px-0">
        
        {/* Printable Admit Card Frame */}
        <div 
          ref={cardPrintRef}
          className="bg-white rounded-3xl border border-black/5 p-6 md:p-12 shadow-sm relative overflow-hidden print:border-0 print:shadow-none print:p-0"
        >
          {/* Decorative watermark / header line */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-[#D4AF37]" />

          {/* Card Head */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-[#1B1F3B]/10 pb-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1B1F3B] rounded-xl flex items-center justify-center shrink-0">
                <Award size={22} className="text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="font-extrabold text-[#1B1F3B] text-lg leading-tight uppercase tracking-wider">
                  Vidyalaya Public School
                </h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Office of the Controller of Examinations</p>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <span className="bg-[#1B1F3B]/5 text-[#1B1F3B] px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
                Official Hall Ticket
              </span>
            </div>
          </div>

          {/* Student Profile Info */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-8 bg-gray-50/50 p-6 rounded-2xl border border-black/5">
            {/* Student Photo */}
            <div className="w-32 h-40 rounded-xl overflow-hidden border border-black/15 bg-gray-100 flex items-center justify-center shrink-0 mx-auto md:mx-0">
              <img 
                src={studentDetails.photo} 
                alt="Student Passport"
                className="w-full h-full object-cover" 
                onError={(e) => {
                  // Fallback if image fails
                  e.currentTarget.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80";
                }}
              />
            </div>

            {/* Profile Grid */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Candidate Name</p>
                <p className="font-bold text-[#1B1F3B] mt-0.5">{studentDetails.name}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Roll Number</p>
                <p className="font-bold text-[#1B1F3B] mt-0.5 font-mono">{studentDetails.rollNo}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Registration Number</p>
                <p className="font-bold text-[#1B1F3B] mt-0.5 font-mono">{studentDetails.regNo}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Class / Section</p>
                <p className="font-bold text-[#1B1F3B] mt-0.5">{studentDetails.course} ({studentDetails.semester})</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Examination Cycle</p>
                <p className="font-bold text-[#1B1F3B] mt-0.5">{studentDetails.cycle}</p>
              </div>
            </div>
          </div>

          {/* Exam Schedule */}
          <div className="mb-8">
            <h4 className="font-bold text-sm text-[#1B1F3B] mb-3 uppercase tracking-wider">Approved Exam Schedule</h4>
            <div className="overflow-x-auto border border-black/5 rounded-2xl">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="bg-[#1B1F3B] text-[#D4AF37] text-[10px] uppercase tracking-wider font-bold">
                    <th className="py-3.5 px-4 rounded-tl-2xl">Code</th>
                    <th className="py-3.5 px-4">Subject Name</th>
                    <th className="py-3.5 px-4 text-center">Date</th>
                    <th className="py-3.5 px-4 text-center">Time</th>
                    <th className="py-3.5 px-4 text-center rounded-tr-2xl">Venue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {examSchedule.map((row) => (
                    <tr key={row.code} className="hover:bg-gray-50/50">
                      <td className="py-3.5 px-4 font-mono font-bold text-gray-500">{row.code}</td>
                      <td className="py-3.5 px-4 font-bold text-[#1B1F3B]">{row.subject}</td>
                      <td className="py-3.5 px-4 text-center font-semibold text-gray-600">{row.date}</td>
                      <td className="py-3.5 px-4 text-center text-gray-500">{row.time}</td>
                      <td className="py-3.5 px-4 text-center font-semibold text-gray-700">{row.hall}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Signature and Seal Area */}
          <div className="flex flex-row justify-between items-end border-t border-black/5 pt-8 mb-8">
            <div className="text-left">
              <div className="w-20 h-20 border border-black/10 rounded-full flex items-center justify-center bg-gray-50 text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center leading-tight">
                School Seal
              </div>
            </div>
            <div className="text-right flex flex-col items-end">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/f/f8/Signature_of_John_Hancock.svg" 
                alt="Signature of Controller" 
                className="h-10 w-auto object-contain opacity-70 mb-1" 
              />
              <p className="border-t border-black/10 pt-1 text-[10px] uppercase tracking-wider text-[#1B1F3B] font-extrabold">
                Controller of Examinations
              </p>
            </div>
          </div>

          {/* Instructions Block */}
          <div className="bg-amber-50/50 border border-amber-200/50 rounded-2xl p-5 md:p-6 print:bg-white print:border print:border-black/15">
            <div className="flex items-center gap-2 text-amber-700 mb-3 print:text-black">
              <AlertCircle size={16} />
              <h5 className="font-bold text-xs uppercase tracking-wider">Candidate Instructions</h5>
            </div>
            <ul className="list-disc pl-5 text-[10px] md:text-xs text-gray-600 space-y-2 leading-relaxed print:text-black">
              <li>Candidates must report to the examination center at least 30 minutes before the commencement of the exam.</li>
              <li>Candidates will not be allowed to enter the exam room 15 minutes after the starting time.</li>
              <li>It is mandatory to bring this printed Admit Card and valid School Photo ID card.</li>
              <li>No electronic devices, smartwatches, calculators (unless specified), or study material are permitted inside the examination hall.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
