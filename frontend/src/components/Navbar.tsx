import { useState, useEffect } from 'react';
import { Menu, X, Zap } from 'lucide-react';
import { Link, useRouterState } from '@tanstack/react-router';

const pageNavLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Event Details', to: '/event-details' },
  { label: 'Check Registration', to: '/check-registration' },
];

const homeAnchorLinks = [
  { label: 'Coordinators', href: '#coordinators' },
  { label: 'Register', href: '#registration' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const isHomePage = currentPath === '/';

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(scrollTop > 80);
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAnchorClick = (href: string) => {
    setMenuOpen(false);
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-1">
        <div
          className="h-full bg-gradient-to-r from-expo-green-start to-expo-green-end transition-all duration-100"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <nav
        className={`fixed top-1 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-expo-dark/90 backdrop-blur-xl shadow-lg shadow-black/30 border-b border-white/5'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              onClick={handleLinkClick}
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-expo-green-start to-expo-green-end flex items-center justify-center shadow-lg shadow-expo-green-start/30">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-sm leading-tight hidden sm:block">
                <span className="text-expo-green-end">Project</span> Expo 2026
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {/* Page navigation links */}
              {pageNavLinks.map((link) => {
                const isActive = currentPath === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={handleLinkClick}
                    className={`px-3 py-2 text-sm transition-colors duration-200 rounded-lg hover:bg-white/5 font-medium ${
                      isActive
                        ? 'text-expo-green-end bg-expo-green-start/10'
                        : 'text-white/80 hover:text-expo-green-end'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* Anchor links — only on home page */}
              {isHomePage &&
                homeAnchorLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => handleAnchorClick(link.href)}
                    className="px-3 py-2 text-sm text-white/80 hover:text-expo-green-end transition-colors duration-200 rounded-lg hover:bg-white/5 font-medium"
                  >
                    {link.label}
                  </button>
                ))}

              {/* Register CTA */}
              {isHomePage ? (
                <button
                  onClick={() => handleAnchorClick('#registration')}
                  className="ml-3 px-4 py-2 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-expo-green-start to-expo-green-end hover:shadow-lg hover:shadow-expo-green-start/40 transition-all duration-300 hover:scale-105"
                >
                  Register Now
                </button>
              ) : (
                <Link
                  to="/"
                  onClick={handleLinkClick}
                  className="ml-3 px-4 py-2 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-expo-green-start to-expo-green-end hover:shadow-lg hover:shadow-expo-green-start/40 transition-all duration-300 hover:scale-105"
                >
                  Register Now
                </Link>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            menuOpen ? 'max-h-[40rem] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-expo-dark/95 backdrop-blur-xl border-t border-white/10 px-4 py-3 space-y-1">
            {/* Page nav links */}
            {pageNavLinks.map((link) => {
              const isActive = currentPath === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={handleLinkClick}
                  className={`block w-full text-left px-4 py-3 rounded-lg transition-colors font-medium ${
                    isActive
                      ? 'text-expo-green-end bg-expo-green-start/10'
                      : 'text-white/80 hover:text-expo-green-end hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Anchor links — only on home page */}
            {isHomePage &&
              homeAnchorLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleAnchorClick(link.href)}
                  className="block w-full text-left px-4 py-3 text-white/80 hover:text-expo-green-end hover:bg-white/5 rounded-lg transition-colors font-medium"
                >
                  {link.label}
                </button>
              ))}

            {/* Register CTA */}
            {isHomePage ? (
              <button
                onClick={() => handleAnchorClick('#registration')}
                className="block w-full text-center mt-2 px-4 py-3 font-semibold text-white rounded-lg bg-gradient-to-r from-expo-green-start to-expo-green-end"
              >
                Register Now
              </button>
            ) : (
              <Link
                to="/"
                onClick={handleLinkClick}
                className="block w-full text-center mt-2 px-4 py-3 font-semibold text-white rounded-lg bg-gradient-to-r from-expo-green-start to-expo-green-end"
              >
                Register Now
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
