import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const clients = [
  'egglife',
  'AltSource',
  'Quicken',
  'Betterment',
  'Insider Inc.',
  'JUST SALAD',
  'MARKETPLACE',
  'CIRCLE',
];

export default function Clients() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.clients-header', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="clients"
      className="relative py-16 md:py-24 overflow-hidden"
      style={{ backgroundColor: '#E8E0D4' }}
    >
      <div className="text-center mb-12 px-6">
        <span className="label-style">[ CLIENTS WE PROUDLY SERVE ]</span>
      </div>

      {/* Marquee */}
      <div className="relative">
        <div className="flex marquee-track">
          {/* First set */}
          {[...clients, ...clients].map((client, index) => (
            <div
              key={index}
              className="flex-shrink-0 px-8 md:px-12 py-6"
            >
              <div className="bg-white/80 px-8 py-4 min-w-[160px] flex items-center justify-center">
                <span className="text-lg md:text-xl font-bold text-[var(--dark)] whitespace-nowrap">
                  {client}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
