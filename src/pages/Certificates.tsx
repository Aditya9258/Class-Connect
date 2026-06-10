import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Award, FileText, Download, Upload, Clock, CheckCircle } from 'lucide-react';

/* ─── Card Wrapper ─── */
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current!, {
        y: 40,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardRef.current!,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`bg-white rounded-2xl border border-black/5 p-6 md:p-8 shadow-sm hover:shadow-lg hover:border-[var(--crimson)]/20 transition-all duration-500 ${className}`}
    >
      {children}
    </div>
  );
}

export default function Certificates() {
  const headerRef = useRef<HTMLDivElement>(null);
  const [requestType, setRequestType] = useState('Achievement Duplicate Certificate');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

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

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setReason('');
    }, 4000);
  };

  const availableCertificates = [
    { title: 'First Prize - Science Exhibition', date: 'Dec 15, 2024', status: 'Verified', type: 'Academic' },
    { title: 'Gold Medal - Inter-School Sports', date: 'May 20, 2025', status: 'Verified', type: 'Extracurricular' },
    { title: 'Best Student Award 2025', date: 'Dec 18, 2025', status: 'Verified', type: 'Academic' },
    { title: 'State Level Math Olympiad', date: 'Mar 10, 2025', status: 'Verified', type: 'Academic' },
    { title: 'Robotics Workshop Certificate', date: 'Aug 05, 2025', status: 'Verified', type: 'Workshop' },
  ];

  const pendingCertificates = [
    { title: 'National Essay Writing Competition', expected: 'Available post evaluation', status: 'Pending' },
    { title: 'Achievement Duplicate Certificate', expected: 'Under Review', status: 'Processing' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[var(--cream)]">
      {/* Header */}
      <div ref={headerRef} className="max-w-[1400px] mx-auto px-4 md:px-12 lg:px-16 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[var(--dark)] rounded-2xl flex items-center justify-center shrink-0">
            <Award size={32} className="text-[#D4AF37]" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">Achievements & Certificates</h2>
            <p className="text-sm text-[var(--text-muted)] mt-1">View, download, and request your official school certificates and achievement records.</p>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Certificates List */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">Available Certificates</h3>
              <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-xs font-bold">{availableCertificates.length} Items</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableCertificates.map((cert, i) => (
                <div key={i} className="group border border-black/5 rounded-xl p-5 hover:border-[var(--crimson)]/30 hover:bg-white transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--crimson)]/10 flex items-center justify-center shrink-0">
                      <FileText size={20} className="text-[var(--crimson)]" />
                    </div>
                    <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded md text-[10px] font-bold tracking-wider uppercase">
                      {cert.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-[var(--text-primary)] text-sm mb-1">{cert.title}</h4>
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-xs text-[var(--text-muted)]">{cert.date}</p>
                    <button className="text-[var(--crimson)] hover:text-[var(--dark)] transition-colors p-1.5 bg-[var(--crimson)]/5 hover:bg-[var(--crimson)]/10 rounded-lg flex items-center gap-1 text-xs font-semibold">
                      <Download size={14} /> Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
              <Clock size={20} className="text-amber-500" /> Pending & Upcoming
            </h3>
            <div className="space-y-4">
              {pendingCertificates.map((cert, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-black/5 rounded-xl bg-gray-50/50">
                  <div className="flex items-center gap-3 mb-2 sm:mb-0">
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <div>
                      <h4 className="font-bold text-[var(--text-primary)] text-sm">{cert.title}</h4>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">{cert.expected}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-lg w-fit">
                    {cert.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Request Form */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
              <Upload size={20} className="text-[var(--crimson)]" /> Request Certificate
            </h3>
            <p className="text-xs text-[var(--text-muted)] mb-6">Submit a formal request for a new certificate or official letter.</p>

            {submitted ? (
              <div className="py-10 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 text-emerald-500">
                  <CheckCircle size={32} />
                </div>
                <h4 className="font-bold text-lg text-[var(--text-primary)] mb-2">Request Submitted!</h4>
                <p className="text-sm text-[var(--text-muted)]">Your request is being processed. It usually takes 2-3 business days.</p>
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit} className="space-y-5 animate-in fade-in duration-300">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
                    Document Type
                  </label>
                  <select 
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value)}
                    className="w-full border border-black/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--crimson)] focus:ring-1 focus:ring-[var(--crimson)] transition-all bg-white"
                  >
                    <option>Achievement Duplicate Certificate</option>
                    <option>Bonafide Certificate</option>
                    <option>Character Certificate</option>
                    <option>Transfer Certificate (TC)</option>
                    <option>Sports Achievement Record</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
                    Reason / Justification
                  </label>
                  <textarea 
                    rows={4}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Briefly explain why you need this document..."
                    className="w-full border border-black/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--crimson)] focus:ring-1 focus:ring-[var(--crimson)] transition-all bg-white resize-none"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[var(--crimson)] text-white font-bold rounded-xl py-3.5 hover:bg-[var(--dark)] hover:shadow-lg transition-all duration-300"
                >
                  Submit Request
                </button>
              </form>
            )}
          </Card>
        </div>

      </div>
    </div>
  );
}
