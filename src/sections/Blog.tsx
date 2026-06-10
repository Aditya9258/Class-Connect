import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowUpRight } from 'lucide-react';

const posts = [
  {
    title: 'Annual Science Fair 2025: Celebrating Student Innovations',
    author: 'Principal Mitchell',
    date: '15 Oct 2025',
    image: '/images/news_1.png',
    avatar: '/images/team-1.jpg',
  },
  {
    title: 'New Guidelines for the Upcoming Semester Examinations',
    author: 'Dr. Sarah Jenkins',
    date: '02 Nov 2025',
    image: '/images/news_2.png',
    avatar: '/images/team-2.jpg',
  },
  {
    title: 'How Digital Platforms are Enhancing Parent-Teacher Communication',
    author: 'Prof. David Chen',
    date: '10 Nov 2025',
    image: '/images/news_3.png',
    avatar: '/images/team-3.jpg',
  },
];

export default function Blog() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.blog-header', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });

      gsap.from('.blog-card', {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.blog-grid',
          start: 'top 85%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="blog"
      className="relative py-20 md:py-32 px-6 md:px-12 lg:px-16"
      style={{ backgroundColor: 'var(--cream)' }}
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="blog-header grid lg:grid-cols-2 gap-8 mb-16">
          <div>
            <span className="label-style mb-4 block">[ CAMPUS NEWS ]</span>
            <h2 className="display-lg">
              LATEST NEWS AND
              <br />
              ANNOUNCEMENTS
            </h2>
            <a href="#" className="btn-outline group mt-8 inline-flex">
              <span className="w-8 h-8 bg-[var(--dark)] flex items-center justify-center group-hover:bg-[var(--crimson)] transition-colors">
                <ArrowUpRight size={16} className="text-white" />
              </span>
              <span>More news</span>
            </a>
          </div>
          <div className="flex items-end">
            <p className="text-[var(--text-secondary)] max-w-md">
              Stay up to date with the latest campus events, academic updates, and 
              educational insights from our institution. We share practical tips and ideas.
            </p>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="blog-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <article key={index} className="blog-card group cursor-pointer">
              <div className="image-hover-zoom mb-6">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full aspect-[16/10] object-cover"
                />
              </div>

              {/* Meta */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img
                    src={post.avatar}
                    alt={post.author}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm">
                  By <span className="font-medium">{post.author}</span>
                </span>
                <span className="text-sm text-[var(--text-muted)]">|</span>
                <span className="text-sm text-[var(--text-muted)]">{post.date}</span>
              </div>

              {/* Title */}
              <h3 className="text-xl md:text-2xl font-semibold mb-6 group-hover:text-[var(--crimson)] transition-colors duration-300">
                {post.title}
              </h3>

              {/* Read More */}
              <a
                href="#"
                className="inline-block px-6 py-3 border border-[var(--dark)] text-sm font-semibold hover:bg-[var(--dark)] hover:text-white transition-all duration-300"
              >
                Read more
              </a>

              <div className="mt-6 border-b border-black/10" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
