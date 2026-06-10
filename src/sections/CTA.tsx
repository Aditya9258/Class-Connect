import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CTA() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.cta-content', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full"
    >
      <div
        className="cta-content cta-fluid-bg relative overflow-hidden w-full py-12 md:py-16 px-6 md:px-12 lg:px-16"
      >
        <style>
          {`
            .cta-fluid-bg {
              background-color: var(--cream);
              overflow: hidden;
            }
            @keyframes aurora1 {
              0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
              33% { transform: translate(10vw, -10vh) scale(1.2) rotate(10deg); }
              66% { transform: translate(-5vw, 15vh) scale(0.8) rotate(-5deg); }
            }
            @keyframes aurora2 {
              0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
              33% { transform: translate(-15vw, 10vh) scale(0.9) rotate(-10deg); }
              66% { transform: translate(15vw, -5vh) scale(1.1) rotate(10deg); }
            }
            @keyframes aurora3 {
              0%, 100% { transform: translate(0, 0) scale(1); }
              50% { transform: translate(10vw, 10vh) scale(1.3); }
            }
            .aurora-blob {
              position: absolute;
              filter: blur(90px);
              border-radius: 50%;
              opacity: 0.8;
              will-change: transform;
            }
            .blob-1 {
              top: -20%; left: -10%; width: 60vw; height: 60vw;
              max-width: 800px; max-height: 800px;
              background: radial-gradient(circle, #D4AF37 0%, rgba(212, 175, 55, 0) 70%);
              animation: aurora1 20s ease-in-out infinite;
            }
            .blob-2 {
              bottom: -30%; right: -10%; width: 70vw; height: 70vw;
              max-width: 1000px; max-height: 1000px;
              background: radial-gradient(circle, #1B1F3B 0%, rgba(27, 31, 59, 0) 70%);
              animation: aurora2 25s ease-in-out infinite;
            }
            .blob-3 {
              top: 20%; right: 20%; width: 50vw; height: 50vw;
              max-width: 700px; max-height: 700px;
              background: radial-gradient(circle, #E5D3B3 0%, rgba(229, 211, 179, 0) 70%);
              animation: aurora3 18s ease-in-out infinite alternate;
            }
          `}
        </style>
        
        {/* Dynamic Fluid Background */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-40 mix-blend-multiply">
          <div className="aurora-blob blob-1"></div>
          <div className="aurora-blob blob-2"></div>
          <div className="aurora-blob blob-3"></div>
        </div>

        <div className="relative max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8 z-10">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-[var(--text-primary)] tracking-tight">
            Let's talk!
          </h2>

          <div className="flex items-center gap-4">
            <a
              href="#"
              className="inline-flex items-center gap-3 bg-[var(--dark)] text-white px-5 py-3 text-sm font-semibold hover:bg-[var(--crimson)] transition-all duration-300"
            >
              <div className="w-8 h-8 overflow-hidden rounded-full bg-gray-200">
                <img
                  src="/images/team-1.jpg"
                  alt="Contact"
                  className="w-full h-full object-cover"
                />
              </div>
              <span>Book a demo call</span>
            </a>
            <a
              href="#"
              className="inline-flex items-center px-5 py-3 border border-[var(--dark)] text-[var(--dark)] text-sm font-semibold hover:bg-[var(--dark)] hover:text-white transition-all duration-300"
            >
              Make It Happen
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
