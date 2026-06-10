import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const steps = [
  {
    number: '01.',
    title: 'Track Performance',
    description:
      'Log in to the portal and instantly view academic performance, report cards, timetables, fee status, announcements, and other school updates – all in one place.',
    image: '/images/Process-1-img.jpg',
    tags: ['Performance Reports', 'Timetable Access', 'Fee Tracking'],
  },
  {
    number: '02.',
    title: 'Review Reports',
    description:
      'Access detailed report cards, subject-wise marks, attendance summaries, and academic insights to understand student progress clearly and identify areas for improvement.',
    image: '/images/Process-2-img.jpg',
    tags: ['Detailed Report Cards', 'Subjects Insight', 'Attendance Summary'],
  },
  {
    number: '03.',
    title: 'Stay Updated',
    description:
      'Receive announcements, fee reminders, timetable changes, and important school updates in one place. The portal keeps students and parents informed so nothing important is missed.',
    image: '/images/Process-3-img.jpg',
    tags: ['Announcements', 'Fee Reminders', 'Timetable Updates'],
  },
];

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const textsRef = useRef<(HTMLDivElement | null)[]>([]);
  const numbersRef = useRef<(HTMLDivElement | null)[]>([]);
  const textWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Pin the section
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=2500', // Scroll duration
          pin: true,
          scrub: 1,
        },
      });

      // Calculate the vertical scroll distance based on element heights and gaps
      const gap = 128; // 8rem = 128px (gap-32)
      const yOffsets = [0];
      let currentOffset = 0;

      for (let i = 1; i < textsRef.current.length; i++) {
        if (textsRef.current[i - 1]) {
          currentOffset += textsRef.current[i - 1]!.offsetHeight + gap;
          yOffsets.push(currentOffset);
        } else {
          yOffsets.push(currentOffset); // Fallback
        }
      }

      // Initial setup
      gsap.set(imagesRef.current.slice(1), { opacity: 0 });
      gsap.set(numbersRef.current.slice(1), { opacity: 0, y: 30 });
      gsap.set(textsRef.current.slice(1), { opacity: 0.2 });

      // Transition 1: Step 1 -> Step 2
      tl.to(imagesRef.current[0], { opacity: 0, duration: 1 }, 0)
        .to(imagesRef.current[1], { opacity: 1, duration: 1 }, 0)

        .to(numbersRef.current[0], { opacity: 0, y: -30, duration: 0.5 }, 0)
        .to(numbersRef.current[1], { opacity: 1, y: 0, duration: 0.5 }, 0.5)

        .to(textsRef.current[0], { opacity: 0.2, duration: 1 }, 0)
        .to(textsRef.current[1], { opacity: 1, duration: 1 }, 0)
        .to(textWrapperRef.current, { y: -yOffsets[1], duration: 1, ease: "power1.inOut" }, 0);

      // Pause briefly between transitions (add a dummy tween or just offset the next one)
      tl.to({}, { duration: 0.5 }); // small hold

      // Transition 2: Step 2 -> Step 3
      tl.to(imagesRef.current[1], { opacity: 0, duration: 1 }, "+=0")
        .to(imagesRef.current[2], { opacity: 1, duration: 1 }, "<")

        .to(numbersRef.current[1], { opacity: 0, y: -30, duration: 0.5 }, "<")
        .to(numbersRef.current[2], { opacity: 1, y: 0, duration: 0.5 }, "<0.5")

        .to(textsRef.current[1], { opacity: 0.2, duration: 1 }, "<")
        .to(textsRef.current[2], { opacity: 1, duration: 1 }, "<")
        .to(textWrapperRef.current, { y: -yOffsets[2], duration: 1, ease: "power1.inOut" }, "<");

      // Small hold at the end
      tl.to({}, { duration: 0.5 });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative h-screen w-full overflow-hidden px-6 md:px-12 lg:px-16 flex items-center"
      style={{ backgroundColor: 'var(--cream)' }}
    >
      <div
        ref={containerRef}
        className="w-full max-w-[1400px] mx-auto grid lg:grid-cols-12 gap-8 lg:gap-16 h-full py-20"
      >

        {/* Left: Header and Numbers */}
        <div className="lg:col-span-3 flex flex-col justify-between h-[80vh] relative z-10">
          <div>
            <span className="label-style mb-4 block text-[var(--crimson)] tracking-[0.2em]">[ SIMPLE STEPS, BIG RESULTS ]</span>
            <h2 className="text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
              OUR STUDENT<br />TRACKING<br />PROCESS.
            </h2>
          </div>

          <div className="relative h-24 w-full overflow-hidden">
            {steps.map((step, index) => (
              <div
                key={index}
                ref={(el) => { numbersRef.current[index] = el; }}
                className="absolute bottom-0 left-0 text-7xl md:text-[100px] font-bold leading-none tracking-tighter"
              >
                {step.number}
              </div>
            ))}
          </div>
        </div>

        {/* Center: Image */}
        <div className="lg:col-span-4 h-[80vh] flex flex-col justify-center items-center relative z-10">
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center bg-white/50 backdrop-blur-sm border border-white/20">
            {steps.map((step, index) => (
              <div
                key={index}
                ref={(el) => { imagesRef.current[index] = el; }}
                className="absolute inset-0 w-full h-full p-2 md:p-4"
              >
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Text Content */}
        <div className="lg:col-span-5 h-[80vh] relative flex items-center">
          {/* Mask for smooth fade at top and bottom */}
          <div
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, var(--cream) 0%, transparent 20%, transparent 80%, var(--cream) 100%)'
            }}
          />
          <div className="w-full relative h-full overflow-hidden flex flex-col justify-start pt-[20vh]">
            <div ref={textWrapperRef} className="w-full flex flex-col gap-32 relative z-10">
              {steps.map((step, index) => (
                <div
                  key={index}
                  ref={(el) => { textsRef.current[index] = el; }}
                  className="w-full flex flex-col justify-center"
                >
                  <h3 className="text-3xl md:text-4xl font-semibold mb-6 text-black">
                    {step.title}
                  </h3>
                  <p className="text-[var(--text-secondary)] mb-8 text-lg leading-relaxed max-w-md">
                    {step.description}
                  </p>
                  <div>
                    <span className="label-style mb-4 block text-[var(--crimson)] font-bold tracking-widest text-sm">[ STEPS ]</span>
                    <div className="flex flex-wrap gap-2">
                      {step.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-5 py-2 bg-white text-black border border-black/5 text-sm font-medium rounded-full shadow-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
