import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowUpRight } from 'lucide-react';

const services = [
  {
    number: '01',
    title: 'Seamless Connectivity',
    tags: ['Communication', 'Sync', 'Real-time'],
    description:
      'Bridge the gap between school and home. Our platform ensures uninterrupted, real-time communication between educators, parents, and students.',
  },
  {
    number: '02',
    title: 'Data Security & Privacy',
    tags: ['Encryption', 'Safety', 'Compliance'],
    description:
      'Built with enterprise-grade security protocols. We ensure all student data, academic records, and financial transactions are strictly protected.',
  },
  {
    number: '03',
    title: 'Cross-Platform Access',
    tags: ['Mobile', 'Web', 'Responsive'],
    description:
      'Access the portal from anywhere. Whether on a desktop browser, tablet, or smartphone, experience a fully optimized and seamless interface.',
  },
  {
    number: '04',
    title: 'Comprehensive Insights',
    tags: ['Data', 'Analytics', 'Trends'],
    description:
      'Gain a deeper understanding of student progress. Access detailed analytics, attendance trends, and comprehensive academic performance data.',
  },
  {
    number: '05',
    title: 'Custom Integration',
    tags: ['API', 'Scalability', 'Setup'],
    description:
      'Tailored to fit your institution. We seamlessly integrate with your existing infrastructure, library management systems, and payment gateways.',
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section entrance
      gsap.from('.services-header', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });

      gsap.from('.service-row', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.services-list',
          start: 'top 85%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative py-20 md:py-32 px-6 md:px-12 lg:px-16"
      style={{ backgroundColor: 'var(--cream)' }}
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="services-header text-center mb-16">
          <span className="label-style mb-4 block">[ WHY CHOOSE OUR PLATFORM ]</span>
          <h2 className="display-lg text-[var(--text-primary)] mb-8">
            BENEFITS THAT
            <br />
            DELIVER
          </h2>
        </div>

        {/* Top Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <a href="#" className="btn-outline border-black/20 text-[var(--text-primary)] hover:bg-[var(--dark)] hover:text-white group">
            <span className="w-8 h-8 bg-[var(--crimson)] flex items-center justify-center">
              <ArrowUpRight size={16} className="text-white" />
            </span>
            <span>Discover benefits</span>
          </a>
          <p className="text-[var(--text-secondary)] max-w-md text-sm md:text-base">
            Beyond just a dashboard, we deliver a robust, secure, and highly scalable ecosystem designed to transform how educational institutions operate.
          </p>
        </div>

        {/* Services List */}
        <div className="services-list">
          {services.map((service, index) => (
            <div
              key={index}
              className="service-row border-t border-black/10 py-6 md:py-8 cursor-pointer group"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div className="grid md:grid-cols-12 gap-4 items-start">
                {/* Number */}
                <div className="md:col-span-1">
                  <span
                    className={`text-sm font-semibold transition-colors duration-300 ${
                      activeIndex === index ? 'text-[var(--crimson)]' : 'text-black/20'
                    }`}
                  >
                    [ {service.number} ]
                  </span>
                </div>

                {/* Title */}
                <div className="md:col-span-5">
                  <h3
                    className={`text-2xl md:text-3xl lg:text-4xl font-semibold transition-colors duration-300 ${
                      activeIndex === index ? 'text-[var(--crimson)]' : 'text-[var(--text-primary)]/40'
                    }`}
                  >
                    {service.title}
                  </h3>
                </div>

                {/* Tags */}
                <div className="md:col-span-3">
                  <div className="flex flex-wrap gap-2">
                    {service.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-3 py-1 text-xs font-medium border rounded-full transition-colors duration-300 ${
                          activeIndex === index
                            ? 'border-[var(--crimson)] text-[var(--crimson)]'
                            : 'border-black/10 text-black/40'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description (visible on hover) */}
                <div className="md:col-span-3">
                  <div
                    className={`overflow-hidden transition-all duration-500 ${
                      activeIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="text-sm text-[var(--text-secondary)]">{service.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
