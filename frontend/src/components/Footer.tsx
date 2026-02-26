import { Link } from '@tanstack/react-router';
import { Zap, Heart, ArrowUp } from 'lucide-react';
import { SiWhatsapp, SiInstagram } from 'react-icons/si';

const WHATSAPP_URL = 'https://chat.whatsapp.com/H6H4HMb31XzKw0ziktZSkg';
const INSTAGRAM_URL = 'https://www.instagram.com/innovativelink_expo_2k26?igsh=MTBvbTMzMXJzbWdtMg==';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Event Details', path: '/event-details' },
  { label: 'Registration', path: '/registration' },
  { label: 'Gallery', path: '/gallery' },
];

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'iot-expo-2026');

  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #050f0a 0%, #020a06 100%)' }}
    >
      {/* Top border gradient */}
      <div className="h-px w-full" style={{ background: 'linear-gradient(to right, transparent, #0f9d58, #22c55e, transparent)' }} />

      {/* Background orb */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #0f9d58, transparent 70%)', filter: 'blur(60px)' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #0f9d58, #22c55e)' }}>
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-base">IoT Expo 2026</p>
                <p className="text-xs" style={{ color: '#22c55e' }}>National Level Project Expo</p>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Showcasing the future of IoT innovation. Connect, create, and conquer at the premier project expo.
            </p>
            <div className="flex gap-3 mt-5">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                style={{ background: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.3)' }}>
                <SiWhatsapp className="w-4 h-4" style={{ color: '#25D366' }} />
              </a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                style={{ background: 'rgba(253,29,29,0.15)', border: '1px solid rgba(253,29,29,0.3)' }}>
                <SiInstagram className="w-4 h-4" style={{ color: '#FD1D1D' }} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-5"
              style={{ color: '#22c55e' }}>
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/50 hover:text-white text-sm transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full transition-all group-hover:w-3"
                      style={{ background: '#22c55e' }} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-5"
              style={{ color: '#22c55e' }}>
              Contact
            </h4>
            <ul className="space-y-2.5 text-sm text-white/50">
              <li>Department of IoT Engineering</li>
              <li>College Campus, City - 600001</li>
              <li>
                <a href="mailto:iotexpo2026@college.edu"
                  className="hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  iotexpo2026@college.edu
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <p className="text-white/40 text-xs text-center sm:text-left">
            © {year} IoT Expo 2026. All rights reserved.
          </p>
          <p className="text-white/40 text-xs flex items-center gap-1">
            Built with <Heart className="w-3 h-3 fill-current" style={{ color: '#22c55e' }} /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              style={{ color: '#22c55e' }}
            >
              caffeine.ai
            </a>
          </p>
          <button
            onClick={scrollToTop}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-110"
            style={{
              background: 'rgba(15,157,88,0.15)',
              border: '1px solid rgba(15,157,88,0.3)',
              color: '#22c55e',
            }}
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
