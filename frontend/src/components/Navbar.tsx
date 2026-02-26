import { useState, useEffect } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { Menu, X, Zap } from 'lucide-react';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Event Details', path: '/event-details' },
  { label: 'Registration', path: '/registration' },
  { label: 'Gallery', path: '/gallery' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/40 backdrop-blur-xl border-b border-white/10 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #0f9d58, #22c55e)' }}>
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-white font-bold text-sm md:text-base tracking-wide">
                IoT Expo
              </span>
              <span className="text-xs font-medium" style={{ color: '#22c55e' }}>
                2026
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-white/10'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                style={isActive(link.path) ? { color: '#22c55e' } : {}}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/registration"
              className="ml-3 px-5 py-2 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #0f9d58, #22c55e)',
                boxShadow: '0 0 20px rgba(15, 157, 88, 0.4)',
              }}
            >
              Register Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)' }}
      >
        <div className="px-4 py-4 space-y-1 border-t border-white/10">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive(link.path)
                  ? 'bg-white/10'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              style={isActive(link.path) ? { color: '#22c55e' } : {}}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2">
            <Link
              to="/registration"
              onClick={() => setIsMenuOpen(false)}
              className="block w-full px-5 py-3 rounded-full text-sm font-semibold text-white text-center transition-all"
              style={{ background: 'linear-gradient(135deg, #0f9d58, #22c55e)' }}
            >
              Register Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
