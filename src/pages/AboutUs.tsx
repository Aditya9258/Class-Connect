import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Lightbulb, Users, Globe, Heart,
  GraduationCap, BookOpen, UserCheck,
  Play, Quote, ChevronLeft, ChevronRight,
  Sparkles, Briefcase, Star
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);


export default function AboutUs() {
  const heroRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const approachRef = useRef<HTMLDivElement>(null);
  const testimonialRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero
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
          duration: 1.2,
          ease: 'power3.out',
          delay: 0.2,
        });
      }

      // Shared section header animation
      const animateHeader = (section: Element | null) => {
        if (!section) return;
        gsap.from(section.querySelectorAll('.section-header'), {
          y: 30,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
          },
        });
      };

      animateHeader(storyRef.current);
      animateHeader(valuesRef.current);
      animateHeader(approachRef.current);
      animateHeader(testimonialRef.current);

      // 2. Story
      if (storyRef.current) {
        gsap.from(storyRef.current.querySelectorAll('.story-text'), {
          y: 30,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.15,
          scrollTrigger: { trigger: storyRef.current, start: 'top 80%' },
        });
        gsap.from(storyRef.current.querySelector('.story-image'), {
          x: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: storyRef.current, start: 'top 80%' },
        });
      }

      // 3. Values
      if (valuesRef.current) {
        gsap.from(valuesRef.current.querySelectorAll('.value-card'), {
          y: 40,
          opacity: 0,
          duration: 0.6,
          ease: 'back.out(1.2)',
          stagger: 0.1,
          scrollTrigger: { trigger: valuesRef.current, start: 'top 85%' },
        });
      }

      // 4. Stats
      if (statsRef.current) {
        gsap.from(statsRef.current.querySelectorAll('.stat-item'), {
          y: 30,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: { trigger: statsRef.current, start: 'top 85%' },
        });
      }

      // 5. Approach
      if (approachRef.current) {
        gsap.from(approachRef.current.querySelectorAll('.approach-item'), {
          x: -30,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.15,
          scrollTrigger: { trigger: approachRef.current, start: 'top 80%' },
        });
        gsap.from(approachRef.current.querySelector('.approach-image'), {
          scale: 0.95,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: approachRef.current, start: 'top 80%' },
        });
      }


      // 7. Testimonial
      if (testimonialRef.current) {
        gsap.from(testimonialRef.current.querySelector('.testi-card'), {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: testimonialRef.current, start: 'top 85%' },
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen pt-28 pb-20 bg-white overflow-hidden">
      
      {/* 1. Hero Section */}
      <div ref={heroRef} className="max-w-[1400px] mx-auto px-4 md:px-12 lg:px-16 mb-32 relative">
        {/* Dotted Grid Background */}
        <div className="absolute top-20 left-4 w-32 h-32 opacity-20 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, #000 1.5px, transparent 1.5px)',
          backgroundSize: '12px 12px'
        }} />

        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 w-full max-w-xl z-10">
            <span className="hero-anim text-[#D4AF37] text-[10px] font-bold tracking-[0.2em] uppercase mb-6 block">
              [ ABOUT CLASS CONNECT ]
            </span>
            <h1 
              className="hero-anim text-5xl md:text-6xl lg:text-7xl font-bold text-[#1B1F3B] leading-[1.05] tracking-tight mb-8"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Connecting Schools. <br />
              Empowering <span className="text-[#D4AF37]">Futures.</span>
            </h1>
            <p className="hero-anim text-gray-500 text-base md:text-lg leading-relaxed max-w-md">
              We are dedicated to bridging the communication gap in education, providing seamless tracking and reporting for schools, parents, and students.
            </p>
          </div>
          
          {/* Creative Masked Image */}
          <div className="hero-image flex-1 w-full relative h-[400px] md:h-[600px] flex justify-end">
            <div className="w-[90%] h-full bg-gray-100 rounded-tl-full rounded-bl-full overflow-hidden shadow-2xl">
              <img 
                src="/images/about_hero.png" 
                alt="Student Portal Dashboard" 
                className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-1000" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Our Story Section */}
      <div ref={storyRef} className="max-w-[1400px] mx-auto px-4 md:px-12 lg:px-16 mb-32">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
          <div className="flex-1 w-full max-w-lg">
            <div className="section-header mb-8">
              <span className="text-[#D4AF37] text-[11px] font-bold tracking-[0.2em] uppercase mb-4 block">
                OUR STORY
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#1B1F3B] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Our Story
              </h2>
              <div className="w-16 h-0.5 bg-[#D4AF37] relative mb-6">
                <Sparkles size={14} className="absolute -right-5 -top-1.5 text-[#D4AF37]" strokeWidth={1.5} />
              </div>
              <p className="text-[#1B1F3B] text-lg font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                Simplifying school administration.
              </p>
            </div>
            
            <p className="story-text text-gray-500 text-[15px] leading-relaxed mb-6">
              Founded with a vision to eliminate the friction in school management, Class Connect brings all academic tracking into one unified platform.
            </p>
            <p className="story-text text-gray-500 text-[15px] leading-relaxed">
              We believe that real-time transparency between teachers and parents is the key to unlocking student success.
            </p>

            {/* Metrics Grid from Mockup */}
            <div className="grid grid-cols-3 gap-2 pt-8 border-t border-[#E5D3B3]/40 mt-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-[#FAF9F6] border border-[#E5D3B3]/80 flex items-center justify-center mb-3 shadow-sm">
                  <GraduationCap size={18} className="text-[#D4AF37]" strokeWidth={1.5} />
                </div>
                <p className="text-lg md:text-xl font-bold text-[#1B1F3B]">12+</p>
                <p className="text-[9px] uppercase tracking-wider text-[#1B1F3B]/60 font-semibold mt-1">Years of Innovation</p>
              </div>
              
              <div className="flex flex-col items-center text-center border-l border-r border-[#E5D3B3]/40 px-1">
                <div className="w-10 h-10 rounded-full bg-[#FAF9F6] border border-[#E5D3B3]/80 flex items-center justify-center mb-3 shadow-sm">
                  <Globe size={18} className="text-[#D4AF37]" strokeWidth={1.5} />
                </div>
                <p className="text-lg md:text-xl font-bold text-[#1B1F3B]">500+</p>
                <p className="text-[9px] uppercase tracking-wider text-[#1B1F3B]/60 font-semibold mt-1">Schools Connected</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-[#FAF9F6] border border-[#E5D3B3]/80 flex items-center justify-center mb-3 shadow-sm">
                  <Users size={18} className="text-[#D4AF37]" strokeWidth={1.5} />
                </div>
                <p className="text-lg md:text-xl font-bold text-[#1B1F3B]">50K+</p>
                <p className="text-[9px] uppercase tracking-wider text-[#1B1F3B]/60 font-semibold mt-1">Active Users</p>
              </div>
            </div>
          </div>
          
          <div className="story-image flex-1 w-full relative h-[400px]">
            <div className="w-full h-full rounded-[32px] overflow-hidden shadow-xl border border-[#E5D3B3]/30">
              <img src="/images/about_story.png" alt="Library" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <button className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#D4AF37] hover:scale-110 transition-transform duration-300 shadow-xl pl-1">
                  <Play size={24} fill="currentColor" />
                </button>
              </div>
            </div>
            
            {/* Floating Gold Badge */}
            <div className="absolute -bottom-6 -right-6 md:right-8 bg-[#D4AF37] text-white p-6 rounded-3xl shadow-xl shadow-[#D4AF37]/20 text-left w-44 animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mb-3">
                <Star size={16} className="text-[#D4AF37] fill-[#D4AF37]" strokeWidth={2} />
              </div>
              <p className="text-3xl font-bold mb-1">12+</p>
              <p className="text-[10px] uppercase tracking-widest font-bold opacity-90 leading-tight">Years of<br/>Excellence</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Our Values Section */}
      <div ref={valuesRef} className="max-w-[1400px] mx-auto px-4 md:px-12 lg:px-16 mb-32">
        <div className="section-header mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1B1F3B] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Our Values</h2>
          <div className="w-24 h-0.5 bg-[#D4AF37] relative">
            <Sparkles size={16} className="absolute -right-5 -top-2 text-[#D4AF37]" strokeWidth={1.5} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {[
            { icon: Lightbulb, title: 'Transparency', desc: 'We provide clear, real-time visibility into academic progress and attendance.' },
            { icon: Users, title: 'Security', desc: 'We protect sensitive student records and financial data with enterprise-grade protocols.' },
            { icon: Globe, title: 'Innovation', desc: 'We continuously evolve our platform to meet modern educational needs.' },
            { icon: Heart, title: 'Collaboration', desc: 'We foster stronger, more proactive relationships between educators and parents.' },
          ].map((val, i) => (
            <div key={i} className="value-card">
              <div className="bg-[#FDFBF7]/40 border border-[#E5D3B3]/40 rounded-[24px] p-8 shadow-sm hover:shadow-[0_12px_32px_rgba(212,175,55,0.08)] hover:border-[#D4AF37]/30 hover:-translate-y-2 transition-all duration-500 group h-full">
                <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                  <val.icon size={32} className="text-[#D4AF37]" strokeWidth={1.5} />
                </div>
                <h3 className="font-bold text-[#1B1F3B] text-xl mb-4">{val.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{val.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Stats Section */}
      <div ref={statsRef} className="max-w-[1400px] mx-auto px-4 md:px-12 lg:px-16 mb-32">
        <div className="relative rounded-[32px] overflow-hidden bg-[#1B1F3B] py-20 px-8 text-center shadow-2xl">
          <img src="/images/hero-img.jpg" alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay" />
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Class Connect by the Numbers</h2>
            <div className="w-10 h-0.5 bg-[#D4AF37] rounded-full mx-auto mb-16" />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
              {[
                { icon: UserCheck, num: '500+', label: 'Schools Onboarded' },
                { icon: GraduationCap, num: '100K+', label: 'Student Profiles' },
                { icon: BookOpen, num: '1M+', label: 'Reports Generated' },
                { icon: Globe, num: '50K+', label: 'Daily Logins' },
              ].map((stat, i) => (
                <div key={i} className="stat-item">
                  <stat.icon size={28} className="text-white/60 mx-auto mb-4" strokeWidth={1.5} />
                  <p className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.num}</p>
                  <p className="text-[11px] uppercase tracking-widest text-white/50 font-bold">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Our Approach Section */}
      <div ref={approachRef} className="max-w-[1400px] mx-auto px-4 md:px-12 lg:px-16 mb-32">
        <div className="flex flex-col-reverse md:flex-row items-center gap-12 lg:gap-24">
          <div className="flex-1 w-full max-w-lg">
            <div className="section-header mb-10">
              <h2 className="text-4xl md:text-5xl font-bold text-[#1B1F3B] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Our Approach</h2>
              <div className="w-32 h-0.5 bg-[#D4AF37] relative">
                <Sparkles size={16} className="absolute -right-5 -top-2 text-[#D4AF37]" strokeWidth={1.5} />
              </div>
            </div>

            <div className="space-y-5">
              {[
                { icon: BookOpen, title: 'Unified Dashboard', desc: 'Centralizing performance, attendance, timetables, and fee tracking in one place.' },
                { icon: Briefcase, title: 'Real-Time Alerts', desc: 'Instant notifications for parents and students regarding critical academic updates.' },
                { icon: Users, title: 'Seamless Integration', desc: 'Designed to integrate effortlessly with existing school infrastructure and workflows.' },
              ].map((item, i) => (
                <div key={i} className="approach-item">
                  <div className="bg-white rounded-[20px] p-6 md:p-8 shadow-[0_4px_24px_rgb(0,0,0,0.04)] border border-[#E5D3B3]/50 flex items-start sm:items-center gap-6 hover:shadow-[0_8px_32px_rgb(0,0,0,0.08)] transition-all duration-300 group hover:-translate-y-1">
                    <div className="w-[72px] h-[72px] rounded-full border border-[#E5D3B3]/80 flex items-center justify-center shrink-0 bg-[#FDFBF7] group-hover:bg-white group-hover:scale-105 transition-all duration-300 shadow-sm">
                      <item.icon size={30} className="text-[#D4AF37]" strokeWidth={1.2} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[#1B1F3B] text-[20px] mb-2 group-hover:text-[#D4AF37] transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>{item.title}</h3>
                      <p className="text-gray-500 text-[14px] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="approach-image flex-1 w-full relative h-[450px]">
            <div className="w-full h-full rounded-[32px] overflow-hidden shadow-xl">
              <img src="/images/about_approach.png" alt="Students collaborating" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
            </div>
          </div>
        </div>
      </div>


      {/* 7. Testimonials */}
      <div ref={testimonialRef} className="max-w-[1400px] mx-auto px-4 md:px-12 lg:px-16 mb-24">
        <div className="section-header mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1B1F3B] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>What People Say</h2>
          <div className="w-32 h-0.5 bg-[#D4AF37] relative">
            <Sparkles size={16} className="absolute -right-5 -top-2 text-[#D4AF37]" strokeWidth={1.5} />
          </div>
        </div>

        <div className="relative flex items-center justify-center px-4 md:px-8">
          <button className="absolute left-0 md:left-4 w-12 h-12 rounded-full border border-[#E5D3B3] flex items-center justify-center text-[#1B1F3B] hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all bg-[#FDFBF7] z-10 shadow-sm hover:shadow-md hidden sm:flex hover:-translate-x-1">
            <ChevronLeft size={24} strokeWidth={1.5} />
          </button>
          
          <div className="testi-card w-full max-w-4xl bg-[#FDFBF7] rounded-[32px] p-8 md:p-16 text-center shadow-[0_12px_40px_rgba(212,175,55,0.08)] border border-[#E5D3B3]/60 relative">
            <div className="mx-auto w-12 h-12 flex items-center justify-center mb-8">
              <Quote size={48} className="text-[#D4AF37] fill-[#D4AF37] opacity-80" />
            </div>
            <p className="text-xl md:text-2xl text-[#1B1F3B] leading-relaxed font-medium mb-12 max-w-3xl mx-auto">
              "Class Connect completely changed how we manage our school. The real-time attendance and automated report cards save our teachers countless hours, and parents love the transparency."
            </p>
            <div className="flex flex-col items-center justify-center gap-2">
              <p className="font-bold text-[#1B1F3B] text-[18px]">Dr. Robert Mitchell</p>
              <div className="flex items-center gap-2 my-1">
                <div className="w-8 h-px bg-[#D4AF37]/50" />
                <Sparkles size={12} className="text-[#D4AF37]" strokeWidth={2} />
                <div className="w-8 h-px bg-[#D4AF37]/50" />
              </div>
              <p className="text-gray-500 text-[12px] uppercase tracking-wider font-semibold">Principal</p>
            </div>
          </div>

          <button className="absolute right-0 md:right-4 w-12 h-12 rounded-full border border-[#E5D3B3] flex items-center justify-center text-[#1B1F3B] hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all bg-[#FDFBF7] z-10 shadow-sm hover:shadow-md hidden sm:flex hover:translate-x-1">
            <ChevronRight size={24} strokeWidth={1.5} />
          </button>
        </div>
        
        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-2.5 mt-10">
          <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] cursor-pointer" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#E5D3B3] hover:bg-[#D4AF37]/70 cursor-pointer transition-colors" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#E5D3B3] hover:bg-[#D4AF37]/70 cursor-pointer transition-colors" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#E5D3B3] hover:bg-[#D4AF37]/70 cursor-pointer transition-colors" />
        </div>
      </div>

    </div>
  );
}
