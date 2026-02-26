import { useState, useEffect } from 'react';
import { ArrowUp, Zap, Heart } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Event Details', href: '#event-details' },
  { label: 'Coordinators', href: '#coordinators' },
  { label: 'Register', href: '#registration' },
  { label: 'Contact', href: '#contact' },
];

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleNavClick = (href: string) => {
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const appId = encodeURIComponent(window.location.hostname || 'project-expo-2026');

  return (
    <>
      <footer className="bg-expo-darkest border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,rgba(15,157,88,0.05),transparent_60%)]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            {/* Branding */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-expo-green-start to-expo-green-end flex items-center justify-center shadow-lg shadow-expo-green-start/30">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-tight">Project Expo 2026</p>
                  <p className="text-expo-green-end text-xs">National Level</p>
                </div>
              </div>
              <p className="text-white/40 text-sm leading-relaxed">
                Organized by the Department of Electronics & Communication Engineering,{' '}
                <span className="text-white/60">E.G.S. Pillay Engineering College</span>, Nagapattinam.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <button
                      onClick={() => handleNavClick(link.href)}
                      className="text-white/40 hover:text-expo-green-end transition-colors text-sm"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Event Info */}
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-4">
                Event Info
              </h4>
              <div className="space-y-2 text-sm text-white/40">
                <p>📅 April 15, 2026</p>
                <p>📍 Nagapattinam, Tamil Nadu</p>
                <p>🎓 Open to All Engineering Students</p>
                <p>💰 Free Registration</p>
                <p>🏆 ₹50,000+ Prize Pool</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

          {/* Bottom Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/30">
            <p>
              © {new Date().getFullYear()} E.G.S. Pillay Engineering College, ECE Department. All Rights Reserved.
            </p>
            <p className="flex items-center gap-1">
              Built with{' '}
              <Heart className="w-3 h-3 text-expo-green-end fill-expo-green-end mx-0.5" />{' '}
              using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-expo-green-end hover:text-expo-green-start transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-gradient-to-br from-expo-green-start to-expo-green-end text-white shadow-lg shadow-expo-green-start/40 flex items-center justify-center hover:scale-110 transition-all duration-300 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </>
  );
}
