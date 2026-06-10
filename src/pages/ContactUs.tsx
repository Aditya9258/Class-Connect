import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Mail, Phone, MapPin, MessageSquare,
  ArrowUpRight, Plus, Minus
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/* ─── Shared Theme Colors ─── */
const THEME = {
  gold: '#D4AF37',
  navy: '#1B1F3B',
  lightGray: '#F9FAFB',
};

/* ─── Data ─── */
const faqs = [
  {
    question: 'How can I enroll in a course?',
    answer: 'You can browse our courses and enroll directly through our platform. If you need help, our admissions team is here to assist you.',
  },
  {
    question: 'Do you offer certificates?',
    answer: 'Yes, all our verified tracks provide an official, verifiable digital certificate upon successful completion.',
  },
  {
    question: 'Can I speak with an advisor?',
    answer: 'Absolutely. You can schedule a 1-on-1 session with our academic advisors through the portal to discuss your career goals.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, PayPal, and wire transfers for corporate group enrollments.',
  },
];

/* ─── Accordion Component ─── */
function FAQAccordion({ data }: { data: typeof faqs }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    data.forEach((_, i) => {
      const el = contentRefs.current[i];
      if (!el) return;
      if (i === openIndex) {
        gsap.to(el, { height: 'auto', opacity: 1, duration: 0.5, ease: 'expo.out' });
      } else {
        gsap.to(el, { height: 0, opacity: 0, duration: 0.4, ease: 'expo.out' });
      }
    });
  }, [openIndex, data]);

  return (
    <div className="space-y-4">
      {data.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} className="border-b border-black/10 pb-4">
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between py-4 text-left group"
            >
              <h3 className="font-bold text-[#1B1F3B] text-lg group-hover:text-[#D4AF37] transition-colors duration-300">
                {faq.question}
              </h3>
              <div className="shrink-0 ml-4 text-gray-400 group-hover:text-[#D4AF37] transition-colors duration-300">
                {isOpen ? <Minus size={20} color={THEME.gold} /> : <Plus size={20} />}
              </div>
            </button>
            <div
              ref={(el) => { contentRefs.current[i] = el; }}
              className="overflow-hidden h-0 opacity-0"
            >
              <p className="pb-4 text-gray-500 text-sm leading-relaxed max-w-3xl pr-8">
                {faq.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════ MAIN PAGE ═══════════ */
export default function ContactUs() {
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Entrance
      if (heroRef.current) {
        gsap.from(heroRef.current.querySelectorAll('.hero-anim'), {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.15,
        });
        gsap.from(heroRef.current.querySelector('.hero-image'), {
          scale: 0.9,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          delay: 0.3,
        });
      }

      // Info Cards Scroll
      if (cardsRef.current) {
        gsap.from(cardsRef.current.children, {
          y: 50,
          opacity: 0,
          duration: 0.6,
          ease: 'back.out(1.2)',
          stagger: 0.1,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 85%',
          },
        });
      }

      // Form & Panel Scroll
      if (formRef.current) {
        gsap.from(formRef.current.children, {
          y: 40,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.2,
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 80%',
          },
        });
      }

      // Map Scroll
      if (mapRef.current) {
        gsap.from(mapRef.current, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: mapRef.current,
            start: 'top 85%',
          },
        });
        gsap.from(mapRef.current.querySelector('.map-card'), {
          x: -40,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          delay: 0.3,
          scrollTrigger: {
            trigger: mapRef.current,
            start: 'top 85%',
          },
        });
      }

      // FAQ Scroll
      if (faqRef.current) {
        gsap.from(faqRef.current.querySelectorAll('.faq-anim'), {
          y: 30,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: faqRef.current,
            start: 'top 85%',
          },
        });
      }

      // CTA Scroll
      if (ctaRef.current) {
        gsap.from(ctaRef.current.children, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 90%',
          },
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen pt-20 pb-0 bg-[#FDFCF8]">
      
      {/* 1. Hero Section */}
      <div ref={heroRef} className="max-w-[1400px] mx-auto px-4 md:px-12 lg:px-16 mb-24 overflow-hidden md:overflow-visible">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="flex-1 w-full max-w-xl z-10">
            <span className="hero-anim text-[#D4AF37] text-[11px] font-bold tracking-[0.2em] uppercase mb-6 block">
              [ CONTACT US ]
            </span>
            <h1 
              className="hero-anim text-5xl md:text-6xl lg:text-[72px] font-bold text-[#1B1F3B] leading-[1.05] tracking-tight mb-6"
            >
              We'd Love to <br className="hidden md:block" />
              Hear From <span className="text-[#D4AF37]">You</span>
            </h1>
            <p className="hero-anim text-gray-500 text-[15px] leading-relaxed max-w-md">
              Have a question, suggestion, or just want to say hello? <br className="hidden md:block" />
              We're here for you.
            </p>
          </div>
          
          {/* Hero Image */}
          <div className="hero-image flex-1 w-full relative h-[320px] md:h-[400px] flex items-end justify-center">
            {/* Background Circles */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 w-[350px] h-[350px] rounded-full bg-gray-200/50 -z-10" />
            <div className="absolute top-1/2 -translate-y-1/2 right-[-10%] w-[450px] h-[450px] rounded-full bg-gray-100 -z-10" />
            
            {/* Image (Using mix-blend to remove white background if present) */}
            <img 
              src="/images/process-1.jpg" 
              alt="Office Desk" 
              className="w-full h-full md:w-[120%] md:max-w-none object-cover object-center mix-blend-multiply z-10 opacity-95 rounded-2xl md:rounded-none" 
            />
          </div>
        </div>
      </div>

      {/* 2. Contact Info Cards */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-12 lg:px-16 mb-32">
        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Mail, title: 'Email Us', line1: 'hello.77@webz.co', line2: 'We reply within 24 hours' },
            { icon: Phone, title: 'Call Us', line1: '+1 234 567 8901', line2: 'Mon - Fri, 9:00 AM - 6:00 PM' },
            { icon: MapPin, title: 'Visit Us', line1: '123 Creative lee Street,', line2: 'Suite 820, California, NY 10001' },
            { icon: MessageSquare, title: 'Live Chat', line1: 'Chat with our team', line2: 'We\'re online' },
          ].map((card, i) => (
            <div key={i}>
              <div 
                className="bg-white rounded-[24px] p-8 text-center border border-black/5 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group h-full"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-6 group-hover:bg-[#D4AF37] transition-colors duration-500">
                  <card.icon size={22} className="text-[#D4AF37] group-hover:text-white transition-colors duration-500" strokeWidth={1.8} />
                </div>
                <h3 className="font-bold text-[#1B1F3B] text-lg mb-4">{card.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-[200px] mx-auto">
                  <span className="block font-medium text-[#1B1F3B]/80">{card.line1}</span>
                  <span className="block mt-1">{card.line2}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Form & Help Panel */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-12 lg:px-16 mb-32">
        <div ref={formRef} className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
          
          {/* Left: Form */}
          <div className="flex-1 w-full bg-white rounded-[32px] p-8 md:p-12 border border-black/5 shadow-sm">
            <h2 
              className="text-3xl md:text-4xl font-bold text-[#1B1F3B] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Send Us a Message
            </h2>
            <p className="text-gray-500 text-sm mb-10 max-w-sm">
              Fill out the form below and our team will get back to you as soon as possible.
            </p>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-[13px] font-bold text-[#1B1F3B] mb-2">Full Name*</label>
                <input 
                  type="text" 
                  placeholder="Your full name"
                  className="w-full bg-[#F9FAFB] border border-black/5 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all placeholder:text-gray-400" 
                />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-[#1B1F3B] mb-2">Email Address*</label>
                <input 
                  type="email" 
                  placeholder="Your email address"
                  className="w-full bg-[#F9FAFB] border border-black/5 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all placeholder:text-gray-400" 
                />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-[#1B1F3B] mb-2">Subject*</label>
                <input 
                  type="text" 
                  placeholder="How can we help you?"
                  className="w-full bg-[#F9FAFB] border border-black/5 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all placeholder:text-gray-400" 
                />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-[#1B1F3B] mb-2">Message*</label>
                <textarea 
                  rows={4}
                  placeholder="Write your message here..."
                  className="w-full bg-[#F9FAFB] border border-black/5 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all placeholder:text-gray-400 resize-none" 
                />
              </div>
              
              <button className="group flex items-center gap-3 bg-[#D4AF37] text-white px-8 py-4 rounded-xl text-sm font-bold hover:brightness-110 transition-all shadow-lg shadow-[#D4AF37]/25 active:scale-95 mt-4">
                Send Message 
                <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform" />
              </button>
            </form>
          </div>

          {/* Right: Help Panel */}
          <div className="w-full lg:w-[400px] shrink-0 bg-[#1B1F3B] rounded-[32px] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
            {/* Decor */}
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
            
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-4">Need Immediate Help?</h3>
              <p className="text-white/60 text-[13px] leading-relaxed mb-8">
                Our support team is available to assist you with any inquiries.
              </p>
              
              <button className="w-full flex items-center justify-between bg-white text-[#1B1F3B] px-6 py-4 rounded-xl text-sm font-bold hover:bg-[#D4AF37] hover:text-white transition-all duration-300 shadow-lg mb-12 group">
                Start Live Chat
                <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform" />
              </button>

              <h4 className="text-[13px] font-bold text-white/40 uppercase tracking-widest mb-6">
                Department Contacts
              </h4>
              
              <div className="space-y-6">
                {[
                  { name: 'Admissions', email: 'admissions@webz.co' },
                  { name: 'Partnerships', email: 'partners@webz.co' },
                  { name: 'Support', email: 'support@webz.co' },
                  { name: 'Media Inquiries', email: 'media@webz.co' },
                ].map((dep, i) => (
                  <div key={i} className="group cursor-pointer">
                    <p className="font-bold text-[15px] mb-1 group-hover:text-[#D4AF37] transition-colors">{dep.name}</p>
                    <p className="text-white/50 text-[13px] group-hover:text-white/80 transition-colors">{dep.email}</p>
                    {i !== 3 && <div className="h-px bg-white/10 mt-6" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Map Section */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-12 lg:px-16 mb-32">
        <div 
          ref={mapRef}
          className="relative w-full h-[400px] md:h-[500px] rounded-[32px] overflow-hidden bg-[#F3F4F6] border border-black/5 shadow-sm flex items-center justify-center"
        >
          {/* Simulated Map Background (SVG Pattern) */}
          <div className="absolute inset-0 opacity-40" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10l80 80M90 10L10 90 M50 0v100 M0 50h100 M25 0v100 M75 0v100 M0 25h100 M0 75h100' stroke='%23CBD5E1' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px'
          }}></div>
          
          <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-transparent to-transparent" />

          {/* Map Pin */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 animate-bounce">
            <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center shadow-xl shadow-[#D4AF37]/40 border-[3px] border-white">
              <MapPin size={18} color="white" />
            </div>
          </div>

          {/* Floating Address Card */}
          <div className="map-card absolute left-6 md:left-12 top-1/2 -translate-y-1/2 bg-white rounded-[24px] p-8 max-w-[300px] shadow-2xl shadow-black/10 z-20">
            <h3 className="font-bold text-[#1B1F3B] text-lg mb-4">Our Location</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 font-medium">
              123 Creative lee Street, <br />
              Suite 820, California, <br />
              NY 10001, USA
            </p>
            <button className="group flex items-center gap-2 border border-[#D4AF37]/30 text-[#D4AF37] px-6 py-3 rounded-xl text-[13px] font-bold hover:bg-[#D4AF37] hover:text-white transition-all w-full justify-center">
              Get Directions
              <ArrowUpRight size={14} className="group-hover:rotate-45 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. FAQ Section */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-12 lg:px-16 mb-32">
        <div ref={faqRef} className="max-w-3xl mx-auto">
          <h2 
            className="faq-anim text-3xl md:text-4xl font-bold text-[#1B1F3B] mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Frequently Asked Questions
          </h2>
          <div className="faq-anim w-12 h-0.5 bg-[#D4AF37] rounded-full mb-10" />

          <div className="faq-anim">
            <FAQAccordion data={faqs} />
          </div>
        </div>
      </div>

      {/* 6. Bottom CTA Section */}
      <div className="px-4 md:px-12 lg:px-16 mb-24">
        <div ref={ctaRef} className="max-w-[1400px] mx-auto relative rounded-[32px] overflow-hidden bg-[#1B1F3B] min-h-[360px] flex items-center shadow-2xl">
          {/* Background Image */}
          <img 
            src="/images/process-2.jpg" 
            alt="Building at dusk" 
            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1B1F3B] via-[#1B1F3B]/80 to-transparent" />
          
          <div className="relative z-10 p-10 md:p-16 max-w-2xl">
            <h2 
              className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Let's Build Something Great Together
            </h2>
            <p className="text-white/70 text-sm md:text-base leading-relaxed mb-10 max-w-lg">
              Whether you're a student, educator, or partner, we'd love to connect and explore how we can create impact together.
            </p>
            <button className="group flex items-center gap-3 bg-white text-[#1B1F3B] px-8 py-4 rounded-xl text-sm font-bold hover:bg-[#D4AF37] hover:text-white transition-all duration-300 shadow-xl">
              Get In Touch
              <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
