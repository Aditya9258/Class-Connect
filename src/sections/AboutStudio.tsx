import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { ArrowUpRight, Users, FileText, Calendar, CreditCard } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface AboutStudioHandles {
  section: HTMLElement | null;
  headingLines: NodeListOf<Element> | Element[] | null;
  stats: HTMLDivElement | null;
  image: HTMLDivElement | null;
}

const AboutStudio = forwardRef<AboutStudioHandles, {}>((_, ref) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const counter1Ref = useRef<HTMLSpanElement>(null);
  const counter2Ref = useRef<HTMLSpanElement>(null);
  const counter3Ref = useRef<HTMLSpanElement>(null);
  const counter4Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const createCounter = (ref: React.RefObject<HTMLSpanElement | null>, target: number) => {
        if (ref.current) {
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: 2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: ref.current,
              start: 'top 85%',
              once: true,
            },
            onUpdate: () => {
              if (ref.current)
                ref.current.textContent = Math.round(obj.val).toString();
            },
          });
        }
      };

      createCounter(counter1Ref, 95);
      createCounter(counter2Ref, 12);
      createCounter(counter3Ref, 8);
      createCounter(counter4Ref, 6);
    });

    return () => ctx.revert();
  }, []);

  useImperativeHandle(ref, () => ({
    get section() {
      return sectionRef.current;
    },
    get headingLines() {
      // Return the inner .line-content elements for animation
      return headingRef.current?.querySelectorAll('.line-content') || null;
    },
    get stats() {
      return statsRef.current;
    },
    get image() {
      return imageRef.current;
    }
  }));

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-12 md:py-20 px-6 md:px-12 lg:px-16 about-section"
      style={{ backgroundColor: 'var(--cream)', zIndex: 20 }} // Higher z-index for parallax overlap
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Label */}
        <div className="mb-6">
          <span className="label-style">[ STUDENT REPORT TRACKING SYSTEM ]</span>
        </div>

        {/* Large Heading - Refactored for Editorial Line Reveal */}
        <div ref={headingRef} className="mb-10">
          <h2 className="display-lg">
            <span className="block overflow-hidden pb-2">
              <span className="line-content text-reveal-mask block transform translate-y-full will-change-transform">
                SMART STUDENT PORTAL FOR
              </span>
            </span>
            <span className="block overflow-hidden pb-2">
              <span className="line-content text-reveal-mask block transform translate-y-full will-change-transform">
                TRACKING PERFORMANCE,REPORTS,
              </span>
            </span>
            <span className="block overflow-hidden pb-2">
              <span className="line-content text-reveal-mask block transform translate-y-full will-change-transform">
                TIMETABLES,FEES &
              </span>
            </span>
            <span className="block overflow-hidden pb-2">
              <span className="line-content text-reveal-mask block transform translate-y-full will-change-transform">
                ANNOUCEMENTS.
              </span>
            </span>
          </h2>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left: Image */}
          <div className="lg:col-span-4">
            <div ref={imageRef} className="about-image overflow-hidden will-change-transform rounded-xl">
              <img
                src="/images/About-section-img.jpg"
                alt="Creative Portrait"
                className="w-full h-auto object-cover transform scale-110" // Scale up slightly to allow parallax
              />
            </div>
          </div>

          {/* Right: Description + Stats */}
          <div className="lg:col-span-8">
            <div className="max-w-xl mb-8">
              <p className="text-base md:text-lg text-[var(--text-secondary)] mb-6">
                Our student portal helps learners stay updated with academic performance, report cards, class timetables, fee details, announcements, and other important information — all in one place.
              </p>
              <a href="#services" className="btn-outline group inline-flex">
                <span className="w-8 h-8 bg-[var(--dark)] flex items-center justify-center group-hover:bg-[var(--crimson)] transition-colors">
                  <ArrowUpRight size={16} className="text-white" />
                </span>
                <span>Know more us</span>
              </a>
            </div>

            {/* Client Avatars */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-[var(--cream)] overflow-hidden"
                  >
                    <img
                      src={`/images/team-${i}.jpg`}
                      alt={`Client ${i}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div>
                <span className="text-[var(--crimson)] font-bold text-lg">5000+</span>
                <span className="text-[var(--text-secondary)] text-sm ml-2">
                  Students, parents & educators use the portal daily.
                </span>
              </div>
            </div>

            {/* Stats Grid */}
            <div
              ref={statsRef}
              className="grid grid-cols-2 xl:grid-cols-4 gap-4"
            >
              <div className="stat-item bg-[var(--badge-bg)] p-5 rounded-lg opacity-0 translate-y-8 will-change-transform flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <Users size={28} className="text-[var(--dark)] shrink-0" />
                  <div className="text-4xl font-bold text-[var(--dark)] tracking-tight">
                    <span ref={counter1Ref}>0</span><span className="text-2xl">%</span>
                  </div>
                </div>
                <p className="text-sm font-semibold text-[var(--text-secondary)]">
                  Attendance Tracked
                </p>
              </div>

              <div className="stat-item bg-[var(--badge-bg)] p-5 rounded-lg opacity-0 translate-y-8 will-change-transform flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <FileText size={28} className="text-[var(--dark)] shrink-0" />
                  <div className="text-4xl font-bold text-[var(--dark)] tracking-tight">
                    <span ref={counter2Ref}>0</span><span className="text-2xl">K+</span>
                  </div>
                </div>
                <p className="text-sm font-semibold text-[var(--text-secondary)]">
                  Report Cards Generated
                </p>
              </div>

              <div className="stat-item bg-[var(--badge-bg)] p-5 rounded-lg opacity-0 translate-y-8 will-change-transform flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar size={28} className="text-[var(--dark)] shrink-0" />
                  <div className="text-4xl font-bold text-[var(--dark)] tracking-tight">
                    <span ref={counter3Ref}>0</span><span className="text-2xl">K+</span>
                  </div>
                </div>
                <p className="text-sm font-semibold text-[var(--text-secondary)]">
                  Timetable Views
                </p>
              </div>

              <div className="stat-item bg-[var(--badge-bg)] p-5 rounded-lg opacity-0 translate-y-8 will-change-transform flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <CreditCard size={28} className="text-[var(--dark)] shrink-0" />
                  <div className="text-4xl font-bold text-[var(--dark)] tracking-tight">
                    <span ref={counter4Ref}>0</span><span className="text-2xl">K+</span>
                  </div>
                </div>
                <p className="text-sm font-semibold text-[var(--text-secondary)]">
                  Fee Updates
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default AboutStudio;
