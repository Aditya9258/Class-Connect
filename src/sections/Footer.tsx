import { useState } from 'react';
import { ArrowUpRight, Facebook, Linkedin, Instagram, Twitter, ArrowUp } from 'lucide-react';

const companyLinks = ['Home', 'Pages', 'Services', 'Blog', 'Contact', 'FAQ'];
const serviceLinks = [
  'Brand identity',
  'Development',
  'UI/UX design',
  'Creative',
  'Marketing',
  'Direction',
];

export default function Footer() {
  const [email, setEmail] = useState('');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[var(--cream)] text-[var(--text-primary)] pt-16 md:pt-24">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          {/* Logo & Newsletter */}
          <div className="lg:col-span-4">
            <a href="#hero" className="flex items-center mb-6">
              <img src="/images/LOGO-IMG.png" alt="Logo" className="h-10 w-auto object-contain scale-[4.5] origin-left" />
            </a>
            <p className="text-[var(--text-secondary)] text-sm mb-6 max-w-xs">
              Subscribe to our newsletter and get the latest design inspiration.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Email*"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent border-b border-black/20 py-3 text-sm text-[var(--text-primary)] placeholder:text-black/30 focus:outline-none focus:border-[var(--crimson)] transition-colors"
              />
              <button className="w-12 h-12 bg-[var(--crimson)] text-white flex items-center justify-center hover:bg-[var(--dark)] transition-all duration-300">
                <ArrowUpRight size={18} />
              </button>
            </div>
          </div>

          {/* Company Links */}
          <div className="lg:col-span-2 lg:col-start-5">
            <h4 className="label-style text-[var(--text-muted)] mb-6">[ COMPANY ]</h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--dark)] transition-colors duration-300"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div className="lg:col-span-2">
            <h4 className="label-style text-[var(--text-muted)] mb-6">[ SERVICES ]</h4>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--dark)] transition-colors duration-300"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-4">
            <div className="mb-8">
              <a
                href="tel:+12345678901"
                className="text-3xl md:text-4xl font-bold hover:text-[var(--crimson)] transition-colors duration-300 block mb-2"
              >
                +1 234 567 8901
              </a>
              <a
                href="mailto:hello.77@webz.co"
                className="text-2xl md:text-3xl font-bold hover:text-[var(--crimson)] transition-colors duration-300 block"
              >
                Hello. Class Connect
              </a>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 mb-8">
              {[Facebook, Linkedin, Instagram, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-[var(--crimson)] hover:border-[var(--crimson)] hover:text-white transition-all duration-300"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>


          </div>
        </div>

      </div>

      {/* Bottom Bar - Dark Theme */}
      <div className="mt-16 border-t border-black/5 bg-[var(--dark)] py-8 px-6 md:px-12 lg:px-16">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-6">
            <a
              href="#"
              className="text-xs text-white/50 hover:text-white transition-colors"
            >
              Policy & privacy
            </a>
            <a
              href="#"
              className="text-xs text-white/50 hover:text-white transition-colors"
            >
              Terms & condition
            </a>
          </div>

          <p className="text-xs text-white/50">
            ©2026 <span className="text-white">Class Connect</span>. all right reserved.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs text-white/50 hover:text-[var(--crimson)] transition-colors group"
          >
            Back to top
            <span className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[var(--crimson)] group-hover:border-[var(--crimson)] group-hover:text-white transition-all duration-300">
              <ArrowUp size={12} />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
