import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowUpRight } from 'lucide-react';

const projects = [
  {
    title: 'Student Dashboard',
    category: 'Overview',
    year: '2025',
    image: '/images/student_dashboard.png',
  },
  {
    title: 'Grade Analytics',
    category: 'Academics',
    year: '2025',
    image: '/images/grade_analytics.png',
  },
  {
    title: 'Dynamic Timetables',
    category: 'Scheduling',
    year: '2025',
    image: '/images/dynamic_timetables.png',
  },
  {
    title: 'Fee Management',
    category: 'Payments',
    year: '2025',
    image: '/images/fee_management.png',
  },
];

export default function Portfolio() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
      gsap.from(headingRef.current?.querySelectorAll('.word') || [], {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 80%',
        },
      });

      // Horizontal scroll for portfolio track
      const track = trackRef.current;
      const section = sectionRef.current;
      if (track && section) {
        const scrollWidth = track.scrollWidth - window.innerWidth;

        gsap.to(track, {
          x: -scrollWidth,
          ease: 'none',
          scrollTrigger: {
            trigger: track,
            start: 'center center',
            end: () => `+=${scrollWidth}`,
            scrub: 1,
            pin: section,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className="relative"
      style={{ backgroundColor: 'var(--cream)' }}
    >
      {/* Header */}
      <div className="py-20 md:py-32 px-6 md:px-12 lg:px-16">
        <div className="max-w-[1400px] mx-auto">
          <span className="label-style mb-4 block">[ CORE PLATFORM FEATURES ]</span>
          <div ref={headingRef}>
            <h2 className="display-lg">
              <span className="word inline-block">EXPLORE</span>{' '}
              <span className="word inline-block">POWERFUL</span>
              <br className="hidden md:block" />
              <span className="word inline-block">TOOLS</span>{' '}
              <span className="word inline-block">FOR</span>{' '}
              <span className="word inline-block">MODERN</span>
              <br className="hidden md:block" />
              <span className="word inline-block">EDUCATION</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div ref={trackRef} className="flex gap-6 pl-6 md:pl-12 lg:pl-16 pb-20">
        {projects.map((project, index) => (
          <div
            key={index}
            className="portfolio-card flex-shrink-0 w-[80vw] md:w-[45vw] lg:w-[35vw] group cursor-pointer"
          >
            <div className="relative overflow-hidden aspect-[4/3] mb-4 image-hover-zoom">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <span className="px-4 py-2 bg-black/80 text-white text-xs font-semibold rounded-full">
                  {project.category}
                </span>
              </div>
              {/* Hover Overlay */}
              <div className="portfolio-overlay">
                <span className="portfolio-view-text">View Project</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-xl md:text-2xl font-semibold">{project.title}</h3>
              <span className="text-sm text-[var(--crimson)] font-medium">
                [ {project.year} ]
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="px-6 md:px-12 lg:px-16 pb-20">
        <div className="max-w-[1400px] mx-auto flex justify-end">
          <a href="#" className="btn-outline group">
            <span className="w-8 h-8 bg-[var(--dark)] flex items-center justify-center group-hover:bg-[var(--crimson)] transition-colors">
              <ArrowUpRight size={16} className="text-white" />
            </span>
            <span>Explore all features</span>
          </a>
        </div>
      </div>
    </section>
  );
}
