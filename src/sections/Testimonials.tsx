import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    quote:
      'From start to finish, Class Connect always delivered a seamless experience. Their more strategic approach to design and development helped us launch a website functional.',
    author: 'Bessie Cooper',
    role: 'Co-Founder',
    rating: 5,
    avatar: '/images/team-1.jpg',
  },
  {
    quote:
      'We partnered with Class Connect for a full brand overhaul, and the results exceeded our expectations. They helped us define a clear brand voice, modernized our entire digital presence.',
    author: 'James Wilson',
    role: 'CEO',
    rating: 4,
    avatar: '/images/team-2.jpg',
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.testimonial-content', {
        y: 40,
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

  // Auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () =>
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="relative py-20 md:py-32 px-6 md:px-12 lg:px-16"
      style={{ backgroundColor: '#E8E0D4' }}
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Label */}
        <div className="text-center mb-12">
          <span className="label-style">[ 5/5 RATING ON GOOGLE REVIEWS ]</span>
        </div>

        {/* Testimonial Card */}
        <div className="testimonial-content relative max-w-4xl mx-auto">
          {/* Stars */}
          <div className="flex items-center justify-center gap-1 mb-8">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={18}
                className={
                  i < testimonials[current].rating
                    ? 'fill-[var(--crimson)] text-[var(--crimson)]'
                    : 'fill-transparent text-[var(--text-muted)]'
                }
              />
            ))}
            <span className="ml-2 text-sm text-[var(--text-secondary)]">
              {testimonials[current].rating}/5
            </span>
          </div>

          {/* Quote */}
          <div className="relative text-center mb-8 min-h-[150px]">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className={`transition-opacity duration-500 ${i === current ? 'opacity-100' : 'opacity-0 absolute inset-0'
                  }`}
              >
                <p className="text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight">
                  <span className="text-[var(--crimson)]">&ldquo;</span>
                  {t.quote}
                  <span className="text-[var(--crimson)]">&rdquo;</span>
                </p>
              </div>
            ))}
          </div>

          {/* Author */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-4">
              <img
                src={testimonials[current].avatar}
                alt={testimonials[current].author}
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="text-lg font-semibold">{testimonials[current].author}</h4>
            <p className="text-sm text-[var(--text-secondary)]">
              {testimonials[current].role}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-12">
            <button
              onClick={prev}
              className="w-12 h-12 border border-black/20 flex items-center justify-center hover:bg-[var(--dark)] hover:text-white hover:border-[var(--dark)] transition-all duration-300"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              className="w-12 h-12 border border-black/20 flex items-center justify-center hover:bg-[var(--dark)] hover:text-white hover:border-[var(--dark)] transition-all duration-300"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
