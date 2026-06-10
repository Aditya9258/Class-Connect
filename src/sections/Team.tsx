import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowUpRight, Facebook, Linkedin, Instagram } from 'lucide-react';

const team = [
  {
    name: 'Dr. Robert Mitchell',
    role: 'Principal / Institute Head',
    image: '/images/team-1.jpg',
  },
  {
    name: 'Dr. Sarah Jenkins',
    role: 'Vice Principal',
    image: '/images/team-2.jpg',
  },
  {
    name: 'Prof. David Chen',
    role: 'Head of Academics',
    image: '/images/team-3.jpg',
  },
  {
    name: 'Emily Carter',
    role: 'Dean of Students',
    image: '/images/team-4.jpg',
  },
];

export default function Team() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.team-header', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });

      gsap.from('.team-card', {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.team-grid',
          start: 'top 85%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="team"
      className="relative py-20 md:py-32 px-6 md:px-12 lg:px-16"
      style={{ backgroundColor: 'var(--cream)' }}
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="team-header grid lg:grid-cols-2 gap-8 mb-16">
          <div>
            <span className="label-style mb-4 block">[ INSTITUTE LEADERSHIP ]</span>
            <h2 className="display-lg">
              DEDICATED TO
              <br />
              ACADEMIC
              <br />
              EXCELLENCE
            </h2>
          </div>
          <div className="flex flex-col justify-end items-start lg:items-end gap-6">
            <p className="text-[var(--text-secondary)] max-w-md text-left lg:text-right">
              Meet the visionary leaders guiding our institution. Our dedicated 
              administrators and academic heads work tirelessly to ensure a 
              nurturing environment for every student.
            </p>
            <a href="#" className="btn-outline group">
              <span className="w-8 h-8 bg-[var(--dark)] flex items-center justify-center group-hover:bg-[var(--crimson)] transition-colors">
                <ArrowUpRight size={16} className="text-white" />
              </span>
              <span>View all leadership</span>
            </a>
          </div>
        </div>

        {/* Team Grid */}
        <div className="team-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <div key={index} className="team-card group">
              <div className="image-hover-zoom mb-4">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full aspect-[3/4] object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-4">{member.role}</p>
              <div className="flex gap-3 pb-4 border-b border-black/10">
                <a
                  href="#"
                  className="w-8 h-8 rounded-full border border-black/20 flex items-center justify-center hover:bg-[var(--dark)] hover:text-white hover:border-[var(--dark)] transition-all duration-300"
                >
                  <Facebook size={14} />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full border border-black/20 flex items-center justify-center hover:bg-[var(--dark)] hover:text-white hover:border-[var(--dark)] transition-all duration-300"
                >
                  <Linkedin size={14} />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full border border-black/20 flex items-center justify-center hover:bg-[var(--dark)] hover:text-white hover:border-[var(--dark)] transition-all duration-300"
                >
                  <Instagram size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
