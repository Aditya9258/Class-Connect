import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { BookOpen, CheckCircle2, AlertTriangle, ShieldCheck, ClipboardCheck } from 'lucide-react';

interface Subject {
  code: string;
  name: string;
  type: 'Core' | 'Elective' | 'Lab';
  credits: number;
}

const availableSubjects: Subject[] = [
  { code: 'MAT-101', name: 'Mathematics', type: 'Core', credits: 4 },
  { code: 'SCI-102', name: 'Science', type: 'Core', credits: 4 },
  { code: 'ENG-103', name: 'English', type: 'Core', credits: 3 },
  { code: 'SST-104', name: 'Social Science', type: 'Core', credits: 4 },
  { code: 'HIN-105', name: 'Hindi', type: 'Core', credits: 3 },
  { code: 'SCI-102L', name: 'Science Practical', type: 'Lab', credits: 2 },
  { code: 'IT-106E', name: 'Information Technology', type: 'Elective', credits: 3 },
  { code: 'ART-107E', name: 'Fine Arts', type: 'Elective', credits: 3 },
];

export default function Registration() {
  const headerRef = useRef<HTMLDivElement>(null);
  const [selectedCodes, setSelectedCodes] = useState<string[]>(['MAT-101', 'SCI-102', 'ENG-103', 'SST-104', 'HIN-105', 'SCI-102L']);
  const [submitted, setSubmitted] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  useEffect(() => {
    // Check if registration was already submitted in this session
    const isReg = localStorage.getItem('exam_registration_completed');
    if (isReg === 'true') {
      setSubmitted(true);
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

  const handleToggleSubject = (code: string, isCore: boolean) => {
    if (isCore) return; // Core subjects cannot be deselected
    if (selectedCodes.includes(code)) {
      setSelectedCodes(selectedCodes.filter(c => c !== code));
    } else {
      setSelectedCodes([...selectedCodes, code]);
    }
  };

  const totalCredits = availableSubjects
    .filter(sub => selectedCodes.includes(sub.code))
    .reduce((sum, sub) => sum + sub.credits, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAgreed) return;

    setSubmitted(true);
    localStorage.setItem('exam_registration_completed', 'true');
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[var(--cream)]">
      {/* Header */}
      <div ref={headerRef} className="max-w-[1400px] mx-auto px-4 md:px-12 lg:px-16 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[var(--dark)] rounded-2xl flex items-center justify-center shrink-0">
            <ClipboardCheck size={32} className="text-[#D4AF37]" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Term Examination Registration
            </h2>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Select your academic subjects, review constraints, and submit your registration request.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-12 lg:px-16">
        {submitted ? (
          <div className="bg-white rounded-3xl border border-black/5 p-8 md:p-16 text-center max-w-2xl mx-auto shadow-sm animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 mx-auto text-emerald-500">
              <CheckCircle2 size={44} />
            </div>
            <h3 className="text-3xl font-bold text-[#1B1F3B] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Registration Complete!
            </h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Your examination registration for Class 10 (Term End Exams, Nov 2026) has been registered successfully. 
              The digital admit card will be released once your attendance and fee clear status are verified.
            </p>
            <div className="border border-black/5 rounded-2xl p-6 bg-gray-50 max-w-md mx-auto text-left space-y-3 mb-8">
              <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                <span>Registration ID:</span>
                <span className="font-mono font-bold text-black">REG-2026-990817</span>
              </div>
              <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                <span>Total Registered Subjects:</span>
                <span className="font-bold text-black">{selectedCodes.length} Subjects</span>
              </div>
              <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                <span>Total Credits:</span>
                <span className="font-bold text-black">{totalCredits} Credits</span>
              </div>
              <div className="flex justify-between text-xs text-[var(--text-secondary)] border-t border-black/5 pt-3">
                <span>Status:</span>
                <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">Approved</span>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('exam_registration_completed');
                setSubmitted(false);
              }}
              className="text-xs font-semibold text-gray-400 hover:text-[var(--crimson)] transition-colors underline"
            >
              Reset registration status (for testing)
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Subject List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-black/5 p-6 md:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6 border-b border-black/5 pb-4">
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">Class 10 Subject Catalog</h3>
                  <span className="bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 animate-pulse">
                    <AlertTriangle size={12} /> Deadline: June 15, 2026
                  </span>
                </div>

                <div className="space-y-3">
                  {availableSubjects.map((sub) => {
                    const isCore = sub.type === 'Core' || sub.type === 'Lab';
                    const isSelected = selectedCodes.includes(sub.code);

                    return (
                      <div
                        key={sub.code}
                        onClick={() => handleToggleSubject(sub.code, isCore)}
                        className={`border rounded-2xl p-5 flex items-center justify-between gap-4 transition-all duration-300 cursor-pointer ${
                          isSelected
                            ? 'border-[#D4AF37]/40 bg-[#D4AF37]/5 shadow-sm'
                            : 'border-black/5 bg-white hover:border-black/10'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-[#1B1F3B] text-white' : 'bg-gray-100 text-gray-500'
                          }`}>
                            <BookOpen size={20} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs text-gray-400">{sub.code}</span>
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase ${
                                sub.type === 'Core' ? 'bg-red-50 text-red-600' :
                                sub.type === 'Lab' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                              }`}>
                                {sub.type}
                              </span>
                            </div>
                            <h4 className="font-bold text-[var(--text-primary)] text-sm md:text-base mt-1">{sub.name}</h4>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right shrink-0">
                            <span className="text-sm font-bold text-[var(--text-primary)]">{sub.credits}</span>
                            <span className="text-xs text-[var(--text-muted)]"> Credits</span>
                          </div>

                          <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${
                            isSelected 
                              ? 'bg-[#1B1F3B] border-[#1B1F3B] text-white' 
                              : 'bg-white border-black/15'
                          }`}>
                            {isSelected && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column Summary & Agreements */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-black/5 p-6 md:p-8 shadow-sm space-y-6 sticky top-24">
                <h3 className="text-lg font-bold text-[var(--text-primary)] border-b border-black/5 pb-3">
                  Summary
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-[var(--text-secondary)]">
                    <span>Selected Subjects:</span>
                    <span className="font-bold text-black">{selectedCodes.length} of {availableSubjects.length}</span>
                  </div>
                  <div className="flex justify-between text-[var(--text-secondary)]">
                    <span>Total Credits:</span>
                    <span className="font-bold text-black">{totalCredits} / 25 Max</span>
                  </div>
                  <div className="flex justify-between text-[var(--text-secondary)]">
                    <span>Exam Center:</span>
                    <span className="font-bold text-black">Main Campus - Hall A</span>
                  </div>
                </div>

                <div className="bg-gray-50 border border-black/5 rounded-2xl p-4 text-xs text-[var(--text-muted)] space-y-2">
                  <div className="flex gap-2">
                    <ShieldCheck size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <p>Registration rules: You must register for at least 15 credits. Electives are subject to capacity constraints.</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      required
                      checked={isAgreed}
                      onChange={(e) => setIsAgreed(e.target.checked)}
                      className="w-4.5 h-4.5 rounded border-gray-300 text-[#1B1F3B] focus:ring-[#1B1F3B] mt-0.5"
                    />
                    <span className="text-xs text-gray-500 leading-normal">
                      I declare that the subjects selected above are correct and that I possess necessary prerequisites.
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={!isAgreed || totalCredits < 15}
                    className={`w-full text-white font-bold rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all duration-300 shadow-md ${
                      isAgreed && totalCredits >= 15
                        ? 'bg-[#1B1F3B] hover:bg-[#D4AF37]'
                        : 'bg-gray-300 cursor-not-allowed text-gray-500 shadow-none'
                    }`}
                  >
                    Submit Registration
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
