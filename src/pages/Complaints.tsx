import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { AlertCircle, Plus, Send, CheckCircle2, Clock, AlertTriangle, FileText } from 'lucide-react';

interface Complaint {
  id: string;
  title: string;
  category: string;
  description: string;
  urgency: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'In Progress' | 'Resolved';
  date: string;
}

const defaultComplaints: Complaint[] = [
  {
    id: 'CMP-88192',
    title: 'Smartboard not working in Class 10-A',
    category: 'Infrastructure',
    description: 'The smartboard in Class 10-A has not been turning on since yesterday morning.',
    urgency: 'High',
    status: 'In Progress',
    date: 'Jun 05, 2026',
  },
  {
    id: 'CMP-88045',
    title: 'Request for new library card',
    category: 'Academic',
    description: 'I have lost my library card and need a new one to issue textbooks.',
    urgency: 'Low',
    status: 'Resolved',
    date: 'May 28, 2026',
  }
];

export default function Complaints() {
  const headerRef = useRef<HTMLDivElement>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Academic');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Load existing complaints from localStorage or default to defaultComplaints
    const stored = localStorage.getItem('school_complaints_timeline');
    if (stored) {
      try {
        setComplaints(JSON.parse(stored));
      } catch (err) {
        setComplaints(defaultComplaints);
      }
    } else {
      setComplaints(defaultComplaints);
      localStorage.setItem('school_complaints_timeline', JSON.stringify(defaultComplaints));
    }

    // GSAP Intro animation
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newComplaint: Complaint = {
      id: `CMP-${Math.floor(10000 + Math.random() * 90000)}`,
      title,
      category,
      description,
      urgency,
      status: 'Pending',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    };

    const updated = [newComplaint, ...complaints];
    setComplaints(updated);
    localStorage.setItem('school_complaints_timeline', JSON.stringify(updated));

    setSubmitted(true);
    setTitle('');
    setDescription('');
    setUrgency('Medium');
    setCategory('Academic');

    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  const getUrgencyStyle = (urg: 'Low' | 'Medium' | 'High') => {
    switch (urg) {
      case 'High': return 'bg-red-50 text-red-600 border border-red-150';
      case 'Medium': return 'bg-amber-50 text-amber-600 border border-amber-150';
      case 'Low': return 'bg-blue-50 text-blue-600 border border-blue-150';
    }
  };

  const getStatusIconAndStyle = (status: 'Pending' | 'In Progress' | 'Resolved') => {
    switch (status) {
      case 'Resolved':
        return {
          icon: <CheckCircle2 size={14} className="text-emerald-500" />,
          style: 'bg-emerald-50 text-emerald-600 border border-emerald-100'
        };
      case 'In Progress':
        return {
          icon: <Clock size={14} className="text-amber-500" />,
          style: 'bg-amber-50 text-amber-600 border border-amber-100'
        };
      case 'Pending':
        return {
          icon: <AlertTriangle size={14} className="text-gray-500" />,
          style: 'bg-gray-100 text-gray-600 border border-gray-200'
        };
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[var(--cream)]">
      {/* Header */}
      <div ref={headerRef} className="max-w-[1400px] mx-auto px-4 md:px-12 lg:px-16 mb-8 animate-in">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[var(--dark)] rounded-2xl flex items-center justify-center shrink-0">
            <AlertCircle size={32} className="text-[#D4AF37]" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Help Desk & Support
            </h2>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Submit your concerns directly to school administration and track progress in real-time.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: List of complaints */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-black/5 p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6 border-b border-black/5 pb-4">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">Grievance History</h3>
              <span className="bg-[#1B1F3B] text-[#D4AF37] px-3 py-1 rounded-lg text-xs font-bold">
                {complaints.length} Filed
              </span>
            </div>

            {complaints.length === 0 ? (
              <div className="text-center py-12">
                <FileText size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 text-sm">No grievances filed yet.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {complaints.map((comp) => {
                  const statusDetails = getStatusIconAndStyle(comp.status);
                  return (
                    <div 
                      key={comp.id} 
                      className="border border-black/5 rounded-2xl p-5 hover:shadow-md transition-all duration-300 bg-white"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-gray-400">{comp.id}</span>
                          <span className="text-xs text-[var(--text-muted)]">•</span>
                          <span className="text-xs font-bold text-[var(--crimson)] bg-[var(--crimson)]/5 px-2 py-0.5 rounded">
                            {comp.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${getUrgencyStyle(comp.urgency)}`}>
                            {comp.urgency} Urgency
                          </span>
                          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${statusDetails.style}`}>
                            {statusDetails.icon}
                            {comp.status}
                          </span>
                        </div>
                      </div>

                      <h4 className="font-bold text-[var(--text-primary)] text-base mb-2">{comp.title}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed mb-4">{comp.description}</p>
                      
                      <div className="flex items-center justify-between border-t border-black/5 pt-3 text-xs text-[var(--text-muted)]">
                        <span>Submitted on {comp.date}</span>
                        <span>Assignee: School Administration</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: File a new complaint */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-black/5 p-6 md:p-8 shadow-sm sticky top-24">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
              <Plus size={20} className="text-[#D4AF37]" /> File a Grievance
            </h3>
            <p className="text-xs text-[var(--text-muted)] mb-6">
              Fill in the form below. Standard response time is 24-48 business hours.
            </p>

            {submitted ? (
              <div className="py-12 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 mx-auto text-emerald-500">
                  <CheckCircle2 size={36} />
                </div>
                <h4 className="font-bold text-lg text-[var(--text-primary)] mb-2">Complaint Registered!</h4>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Your grievance has been successfully submitted and routed to the corresponding department. Track the status here.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
                    Complaint Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. School bus route delayed"
                    className="w-full border border-black/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
                    Grievance Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-black/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all bg-white"
                  >
                    <option>Academic</option>
                    <option>Infrastructure</option>
                    <option>Transport / Bus</option>
                    <option>Canteen / Mess</option>
                    <option>Financial / Fees</option>
                    <option>Other Concerns</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
                    Urgency Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Low', 'Medium', 'High'] as const).map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setUrgency(level)}
                        className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                          urgency === level 
                            ? 'bg-[#1B1F3B] text-[#D4AF37] border-[#1B1F3B] shadow-sm'
                            : 'bg-white text-gray-500 border-black/10 hover:border-black/20'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
                    Description & Details
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide detailed information about your grievance, including dates, locations, or names if applicable..."
                    className="w-full border border-black/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all bg-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#1B1F3B] hover:bg-[#D4AF37] text-white hover:text-white font-bold rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all duration-300 shadow-md"
                >
                  <Send size={16} /> Submit Grievance
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
