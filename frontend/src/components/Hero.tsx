import { useEffect, useRef, useState } from 'react';
import { useGetHeroContent, useGetRegistrationCount } from '../hooks/useQueries';
import { useNavigate } from '@tanstack/react-router';

function TypewriterText({ texts }: { texts: string[] }) {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!texts.length) return;
    const current = texts[textIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < current.length) {
          setDisplayText(current.slice(0, charIndex + 1));
          setCharIndex((c) => c + 1);
        } else {
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        if (charIndex > 0) {
          setDisplayText(current.slice(0, charIndex - 1));
          setCharIndex((c) => c - 1);
        } else {
          setIsDeleting(false);
          setTextIndex((i) => (i + 1) % texts.length);
        }
      }
    }, isDeleting ? 50 : 80);
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, texts]);

  return (
    <span className="text-primary">
      {displayText}
      <span className="blink-cursor">|</span>
    </span>
  );
}

function CountUp({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    const duration = 1500;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);
  return <>{count}</>;
}

export default function Hero() {
  const { data: heroContent } = useGetHeroContent();
  const { data: registrationCount } = useGetRegistrationCount();
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollY = window.scrollY;
        heroRef.current.style.transform = `translateY(${scrollY * 0.4}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const eventTitle = heroContent?.eventTitle || 'Innovative Link Expo';
  const taglines = heroContent?.tagline
    ? [heroContent.tagline]
    : ['Where Innovation Meets Excellence', 'Showcase Your Ideas', 'Connect & Collaborate'];
  const eventDate = heroContent?.eventDate || 'March 2026';
  const collegeName = heroContent?.collegeName || 'Your College';
  const count = registrationCount !== undefined ? Number(registrationCount) : 0;

  const handleRegisterClick = () => {
    document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Parallax Background */}
      <div
        ref={heroRef}
        className="absolute inset-0 -top-20 -bottom-20"
        style={{
          backgroundImage: 'url(/assets/generated/hero-bg.dim_1920x1080.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/70" />

      {/* Drifting Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl drift-orb-1 pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-primary/8 blur-3xl drift-orb-2 pointer-events-none" />
      <div className="absolute top-1/2 right-1/3 w-48 h-48 rounded-full bg-accent/10 blur-3xl drift-orb-3 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div
          className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '0ms' }}
        >
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">{collegeName}</p>
        </div>

        <div
          className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '150ms' }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-foreground mb-4 leading-tight">
            {eventTitle}
          </h1>
        </div>

        <div
          className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '300ms' }}
        >
          <p className="text-xl md:text-2xl text-muted-foreground mb-2 h-8">
            <TypewriterText texts={taglines} />
          </p>
        </div>

        <div
          className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '450ms' }}
        >
          <p className="text-muted-foreground mb-8 text-lg">{eventDate}</p>
        </div>

        <div
          className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '600ms' }}
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
            <button
              onClick={handleRegisterClick}
              className="pulse-ring relative px-8 py-4 bg-primary text-primary-foreground font-bold text-lg rounded-full hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
            >
              Register Now
            </button>
            <button
              onClick={() => navigate({ to: '/gallery' })}
              className="px-8 py-4 border-2 border-primary/50 text-primary font-semibold text-lg rounded-full hover:bg-primary/10 transition-colors"
            >
              View Gallery
            </button>
          </div>
        </div>

        <div
          className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '750ms' }}
        >
          <div className="inline-flex items-center gap-3 bg-card/60 backdrop-blur-sm border border-border rounded-full px-6 py-3">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-foreground font-semibold">
              <CountUp target={count} />+ Registrations
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
