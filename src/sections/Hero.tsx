import { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ArrowRight, ArrowDown } from 'lucide-react';
import RotatingText from '../components/RotatingText';

export interface HeroHandles {
  section: HTMLElement | null;
  playButton: HTMLDivElement | null;
}

const Hero = forwardRef<HeroHandles, {}>((_, ref) => {
  const sectionRef = useRef<HTMLElement>(null);
  const playButtonRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    get section() {
      return sectionRef.current;
    },
    get playButton() {
      return playButtonRef.current;
    }
  }));

  // Play button idle animation (non-scroll driven, just continuous breathing)
  useEffect(() => {
    if (!playButtonRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to('.rotating-badge', {
        rotation: 360,
        duration: 10,
        repeat: -1,
        ease: 'linear',
      });
      gsap.to(playButtonRef.current, {
        scale: 1.05,
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      });
    }, playButtonRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen pt-24 pb-16 px-6 md:px-12 lg:px-16 overflow-hidden hero-section"
      style={{ backgroundColor: 'var(--cream)' }}
    >
      <div className="max-w-[1400px] mx-auto h-full flex flex-col justify-center">
        {/* Top Info Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12 text-sm hero-top-bar">
          <div className="flex items-center gap-2">

            <span></span>
          </div>
        </div>

        {/* Main Hero Content */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center flex-1">
          {/* Left: 3D Cube Image */}
          <div className="relative order-2 lg:order-1 hero-image">
            <div className="relative w-full max-w-md mx-auto lg:mx-0">
              <img
                src="/images/hero1-img.png"
                alt="3D Creative Cube"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

          {/* Right: Heading */}
          <div className="order-1 lg:order-2 hero-heading-container">
            <h1 className="display-xl text-[var(--text-primary)] mb-8">
              <span className="hero-line block whitespace-nowrap"><span className="inline-block">→REAL-TIME</span></span>
              <span className="hero-line block whitespace-nowrap"><span className="inline-block">INSIGHTS FOR</span></span>
              <span className="hero-line block whitespace-nowrap"><span className="inline-block mr-4">YOUR</span><span className="inline-block"><RotatingText texts={['GROWTH', 'FUTURE', 'SUCCESS']} mainClassName="px-2 sm:px-2 md:px-3 text-white overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg bg-[var(--crimson)] text-white" /></span></span>
            </h1>
          </div>
        </div>

        {/* Bottom Area */}
        <div className="mt-12 lg:mt-20 grid lg:grid-cols-3 gap-8 items-end">
          {/* Left: Description & CTAs */}
          <div className="lg:col-span-2 hero-cta">
            <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-md mb-8 hero-cta-item">
              Class Connect provides a seamless, real-time platform for students to monitor their academic standing.
              From personalized performance metrics and detailed reports to class schedules and fee statements, every element of your academic life is in one place.
            </p>
            <div className="flex flex-wrap gap-4 hero-cta-item">
              <a href="#contact" className="btn-primary group">
                <span className="w-8 h-8 bg-[var(--crimson)] flex items-center justify-center">
                  <ArrowRight size={16} />
                </span>
                <span>Book a demo call</span>
              </a>
              <a href="#portfolio" className="btn-outline">
                <span>See our work</span>
              </a>
            </div>
          </div>

          {/* Right: Scroll Down & Badge */}
          <div className="flex flex-col items-center lg:items-end gap-6 relative z-10">
            {/* Rotating Badge - This will be the anchor for the expansion */}
            <div ref={playButtonRef} className="relative w-32 h-32 play-button cursor-pointer">
              <svg viewBox="0 0 120 120" className="w-full h-full rotating-badge">
                <defs>
                  <path
                    id="circlePath"
                    d="M 60,60 m -45,0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0"
                  />
                </defs>
                <circle cx="60" cy="60" r="55" fill="#0F172A" />
                <text
                  fill="#FFFFFF"
                  fontSize="10"
                  fontWeight="600"
                  letterSpacing="3"
                >
                  <textPath href="#circlePath">
                    • TRACK  • PROGRESS • 2025-26 •
                  </textPath>
                </text>
                <polygon
                  points="55,50 70,60 55,70"
                  fill="#FFFFFF"
                  transform="translate(2,0)"
                />
              </svg>
            </div>

            {/* Scroll Down */}
            <div className="flex flex-col items-center gap-2 hero-scroll-indicator">
              <div className="w-8 h-8 rounded-full border border-[var(--crimson)] flex items-center justify-center">
                <ArrowDown size={14} className="text-[var(--crimson)]" />
              </div>
              <span className="text-xs uppercase tracking-widest text-[var(--crimson)]">
                [ Scroll Down ]
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default Hero;
