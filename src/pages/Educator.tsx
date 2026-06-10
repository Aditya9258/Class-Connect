import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/* ─── Educator Data ─── */
const educators = [
  {
    id: 1,
    name: 'Dr. Sarah Mitchell',
    title: 'Professor & HOD, Computer Science',
    photo: '/images/team-2.jpg',
    coverImage: '/images/portfolio-1.jpg',
    bio: 'A distinguished professor specializing in Artificial Intelligence and Machine Learning. Published over 50 research papers in top-tier journals and conferences worldwide.',
    label: 'EDUCATOR 01',
  },
  {
    id: 2,
    name: 'Prof. James Anderson',
    title: 'Associate Professor, Data Science',
    photo: '/images/team-1.jpg',
    coverImage: '/images/portfolio-2.jpg',
    bio: 'An expert in data science and statistical modeling with a focus on big data analytics and predictive systems. Author of 3 internationally recognized textbooks.',
    label: 'EDUCATOR 02',
  },
  {
    id: 3,
    name: 'Dr. Emily Chen',
    title: 'Assistant Professor, Cybersecurity',
    photo: '/images/team-3.jpg',
    coverImage: '/images/portfolio-3.jpg',
    bio: 'An expert in network security and cryptography with extensive experience in ethical hacking and vulnerability assessment. Consults for Fortune 500 companies.',
    label: 'EDUCATOR 03',
  },
  {
    id: 4,
    name: 'Prof. Robert Williams',
    title: 'Senior Professor, Software Engineering',
    photo: '/images/team-4.jpg',
    coverImage: '/images/portfolio-4.jpg',
    bio: 'A veteran educator and software architect with decades of experience in building scalable systems. Has mentored hundreds of students now working at leading tech companies.',
    label: 'EDUCATOR 04',
  },
  {
    id: 5,
    name: 'Dr. Priya Sharma',
    title: 'Associate Professor, Database Systems',
    photo: '/images/about-portrait.jpg',
    coverImage: '/images/process-1.jpg',
    bio: 'Specializes in distributed database systems and cloud-native architectures. Her research on query optimization has been cited over 2000 times in academic literature.',
    label: 'EDUCATOR 05',
  },
  {
    id: 6,
    name: 'Prof. David Park',
    title: 'Professor, Computer Networks',
    photo: '/images/hero-cube.jpg',
    coverImage: '/images/process-2.jpg',
    bio: 'An authority on computer networking and IoT systems. Involved in designing network protocols adopted by major telecom companies worldwide.',
    label: 'EDUCATOR 06',
  },
];

/* ─── Institution Icon (SVG) ─── */
function InstitutionIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.5l-10 5h20l-10-5zm-8.5 7v8h3v-8h-3zm5 0v8h3v-8h-3zm5 0v8h3v-8h-3zm5 0v8h3v-8h-3zM2 20v2h20v-2H2z" />
    </svg>
  );
}

/* ─── Collapsed Card ─── */
function EducatorCard({
  educator,
  index,
  onSelect,
}: {
  educator: (typeof educators)[0];
  index: number;
  onSelect: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current!, {
        y: 50,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        delay: index * 0.12,
        scrollTrigger: {
          trigger: cardRef.current!,
          start: 'top 92%',
          toggleActions: 'play none none none',
        },
      });
    });
    return () => ctx.revert();
  }, [index]);

  return (
    <div
      ref={cardRef}
      onClick={onSelect}
      className="group cursor-pointer p-2 bg-white rounded-[24px] shadow-sm hover:shadow-xl transition-shadow duration-500 border border-black/5"
    >
      <div className="rounded-[18px] overflow-hidden bg-[#FAFAFA] flex flex-col h-full">
        {/* Photo */}
        <div className="relative aspect-square md:aspect-[4/5] overflow-hidden bg-gray-100">
          <img
            src={educator.photo}
            alt={educator.name.replace('\n', ' ')}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </div>

        {/* Bottom Section */}
        <div className="relative bg-[#F8F9FA] pt-12 pb-8 px-4 text-center flex-1 flex flex-col justify-center">
          {/* Badge — overlapping the boundary */}
          <div className="absolute -top-7 left-1/2 -translate-x-1/2">
            <div className="w-14 h-14 rounded-full bg-[#F0F4F8] flex items-center justify-center border-[4px] border-white group-hover:scale-110 transition-transform duration-500 shadow-sm">
              <span className="text-[#1B1F3B]">
                <InstitutionIcon />
              </span>
            </div>
          </div>

          {/* Name */}
          <h3
            className="text-[22px] font-bold text-[#1B1F3B] leading-snug mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {educator.name.replace('\n', ' ')}
          </h3>

          {/* Blue Divider */}
          <div className="w-12 h-0.5 bg-[#4A85D4] mx-auto mb-4 rounded-full opacity-80"></div>

          {/* Title */}
          <p className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-bold">
            {educator.title}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Expanded Detail View ─── */
function EducatorDetail({
  educator,
  onClose,
}: {
  educator: (typeof educators)[0];
  onClose: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const ctx = gsap.context(() => {
      gsap.from(overlayRef.current, {
        opacity: 0,
        duration: 0.35,
        ease: 'power2.out',
      });
      gsap.from(panelRef.current, {
        opacity: 0,
        scale: 0.96,
        duration: 0.5,
        ease: 'power3.out',
        delay: 0.1,
      });

      // Left content stagger
      if (leftRef.current) {
        gsap.from(leftRef.current.children, {
          y: 30,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.1,
          delay: 0.35,
        });
      }

      // Right image
      if (rightRef.current) {
        gsap.from(rightRef.current, {
          x: 50,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          delay: 0.4,
        });
      }
    });

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      document.body.style.overflow = '';
      ctx.revert();
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const handleClose = () => {
    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(panelRef.current, {
      opacity: 0,
      scale: 0.96,
      duration: 0.3,
      ease: 'power2.in',
    });
    tl.to(
      overlayRef.current,
      {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
      },
      '-=0.15'
    );
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      onClick={(e) => {
        if (e.target === overlayRef.current) handleClose();
      }}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative w-full max-w-[1100px] bg-[#FDFCF8] rounded-3xl overflow-hidden z-10 shadow-2xl border border-black/5"
      >
        {/* Background Watermark on Left */}
        <div className="absolute top-0 bottom-0 left-0 w-1/2 overflow-hidden pointer-events-none opacity-[0.03]">
          <svg viewBox="0 0 100 100" className="w-full h-full text-black stroke-current" strokeWidth="0.5" fill="none">
            <path d="M -20,-20 L 120,120 M 120,-20 L -20,120" />
            <path d="M 50,-20 L 50,120 M -20,50 L 120,50" strokeDasharray="2,2" />
          </svg>
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-black/5 text-black/40 flex items-center justify-center hover:bg-black/10 hover:text-black transition-all duration-300 hover:scale-110 hover:rotate-90"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col md:flex-row min-h-[420px] md:min-h-[480px]">
          {/* Left Side — Text Content */}
          <div
            ref={leftRef}
            className="flex-1 flex flex-col justify-center p-8 md:p-12 lg:p-16 relative z-10"
          >
            {/* Label */}
            <span className="inline-flex items-center self-start px-4 py-1.5 rounded-full border border-[#D4A853]/40 text-[#D4A853] text-[10px] font-bold tracking-widest uppercase mb-6 bg-white/50 backdrop-blur-sm">
              {educator.label}
            </span>

            {/* Name */}
            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1B1F3B] leading-[1.05] tracking-tight mb-6 whitespace-pre-line"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {educator.name}
            </h2>

            {/* Title */}
            <p className="text-[10px] uppercase tracking-[0.15em] text-[#D4A853] font-bold">
              {educator.title}
            </p>

            {/* Elegant Divider */}
            <div className="flex items-center gap-3 my-6 max-w-[240px]">
              <div className="h-px bg-[#D4A853]/30 flex-1"></div>
              <div className="w-1.5 h-1.5 rotate-45 bg-[#D4A853]"></div>
              <div className="h-px bg-[#D4A853]/30 flex-1"></div>
            </div>

            {/* Bio */}
            <p className="text-sm md:text-[14px] text-gray-500 leading-relaxed max-w-md">
              {educator.bio}
            </p>
          </div>

          {/* Right Side — Image in Light Browser Frame */}
          <div
            ref={rightRef}
            className="flex-1 flex items-center justify-center p-6 md:p-8 lg:p-12"
          >
            <div className="w-full max-w-[460px] rounded-xl overflow-hidden shadow-2xl shadow-black/10 border border-black/10 bg-white">
              {/* Light Browser Chrome */}
              <div className="flex items-center px-4 py-3 bg-[#F9F9F9] border-b border-black/5 relative">
                <div className="flex gap-1.5 absolute left-4">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <div className="w-full text-center">
                  <span className="text-[10px] text-black/40 font-mono tracking-wide">
                    university.edu/faculty
                  </span>
                </div>
              </div>
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={educator.coverImage}
                  alt={educator.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════ MAIN PAGE ═══════════ */
export default function Educator() {
  const [selectedEducator, setSelectedEducator] = useState<
    (typeof educators)[0] | null
  >(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          y: 40,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.15,
          delay: 0.2,
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[var(--cream)]">
      {/* Header */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-12 lg:px-16 mb-16">
        <div ref={headerRef} className="text-center max-w-3xl mx-auto">
          <span className="text-[#1D4ED8] text-[11px] md:text-xs font-bold tracking-[0.2em] uppercase mb-5 block">
            [ OUR FACULTY ]
          </span>
          <h1 
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#1B1F3B] mb-6 tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Meet Our <span className="text-[#1D4ED8]">Educators</span>
          </h1>
          <p className="text-sm md:text-base text-slate-500 leading-relaxed max-w-xl mx-auto font-medium">
            Our world-class faculty combines deep academic expertise with<br className="hidden md:block" /> real-world industry experience.
          </p>
        </div>
      </div>

      {/* Educator Cards Grid */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-12 lg:px-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
          {educators.map((edu, i) => (
            <EducatorCard
              key={edu.id}
              educator={edu}
              index={i}
              onSelect={() => setSelectedEducator(edu)}
            />
          ))}
        </div>
      </div>

      {/* Expanded Detail Modal */}
      {selectedEducator && (
        <EducatorDetail
          educator={selectedEducator}
          onClose={() => setSelectedEducator(null)}
        />
      )}
    </div>
  );
}
