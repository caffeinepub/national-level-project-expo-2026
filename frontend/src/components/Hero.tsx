import { useState, useEffect, useRef } from 'react';
import { useGetHeroContent, useGetRegistrationCount } from '../hooks/useQueries';
import { ChevronDown, Zap, Users, Calendar, MapPin } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function TypewriterText({ texts }: { texts: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[currentIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? 50 : 80);
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentIndex, texts]);

  return (
    <span>
      {displayText}
      <span className="animate-[blink-cursor_1s_step-end_infinite] border-r-2 ml-0.5"
        style={{ borderColor: '#22c55e' }}>&nbsp;</span>
    </span>
  );
}

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-center gap-3 sm:gap-4 justify-center">
      {units.map((unit, i) => (
        <div key={unit.label} className="flex items-center gap-3 sm:gap-4">
          <div className="flex flex-col items-center">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center text-2xl sm:text-3xl font-bold text-white"
              style={{
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(15, 157, 88, 0.4)',
                boxShadow: '0 0 20px rgba(15, 157, 88, 0.2)',
              }}
            >
              {String(unit.value).padStart(2, '0')}
            </div>
            <span className="text-xs mt-1.5 font-medium uppercase tracking-widest"
              style={{ color: '#22c55e' }}>
              {unit.label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span className="text-2xl font-bold mb-5" style={{ color: '#22c55e' }}>:</span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function Hero() {
  const { data: heroContent } = useGetHeroContent();
  const { data: registrationCount } = useGetRegistrationCount();
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const defaultContent = {
    eventTitle: 'National Level Project Expo 2026',
    tagline: 'Innovate. Build. Transform.',
    eventDate: '2026-04-15',
    collegeName: 'Department of IoT Engineering',
  };

  const content = heroContent || defaultContent;

  const taglines = [
    content.tagline,
    'Where Ideas Meet Innovation',
    'Build the Future Today',
    'Connect. Create. Conquer.',
  ];

  const scrollToNext = () => {
    const nextSection = document.getElementById('about');
    if (nextSection) nextSection.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToRegister = () => {
    const el = document.getElementById('registration');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#050f0a' }}
    >
      {/* Animated Background Image with Parallax */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/assets/generated/hero-bg.dim_1920x1080.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: `translateY(${scrollY * 0.3}px)`,
          willChange: 'transform',
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 z-[1]"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.75) 100%)' }} />

      {/* Green gradient overlay */}
      <div className="absolute inset-0 z-[2]"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(15,157,88,0.15) 0%, transparent 70%)' }} />

      {/* Floating Orbs */}
      <div className="absolute inset-0 z-[3] pointer-events-none overflow-hidden">
        <div className="drift-orb-1 absolute top-[15%] left-[10%] w-64 h-64 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #0f9d58, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="drift-orb-2 absolute top-[60%] right-[8%] w-80 h-80 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #22c55e, transparent 70%)', filter: 'blur(50px)' }} />
        <div className="drift-orb-3 absolute bottom-[20%] left-[30%] w-48 h-48 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #0f9d58, transparent 70%)', filter: 'blur(35px)' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full pt-24 pb-16">
        {/* Badge */}
        <div className="animate-fade-up inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
          style={{
            background: 'rgba(15, 157, 88, 0.15)',
            border: '1px solid rgba(15, 157, 88, 0.4)',
            color: '#22c55e',
            animationDelay: '0ms',
          }}>
          <Zap className="w-4 h-4" />
          <span>{content.collegeName}</span>
        </div>

        {/* Title */}
        <h1
          className="animate-fade-up text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 leading-tight tracking-tight"
          style={{ animationDelay: '100ms' }}
        >
          <span className="gradient-text">{content.eventTitle}</span>
        </h1>

        {/* Typewriter Tagline */}
        <p
          className="animate-fade-up text-lg sm:text-xl md:text-2xl font-medium mb-8 min-h-[2rem]"
          style={{ color: 'rgba(255,255,255,0.8)', animationDelay: '200ms' }}
        >
          <TypewriterText texts={taglines} />
        </p>

        {/* Countdown Timer */}
        <div className="animate-fade-up mb-10" style={{ animationDelay: '300ms' }}>
          <p className="text-sm font-medium uppercase tracking-widest mb-4"
            style={{ color: 'rgba(255,255,255,0.5)' }}>
            Event Countdown
          </p>
          <CountdownTimer targetDate={content.eventDate} />
        </div>

        {/* Stats Row */}
        <div className="animate-fade-up flex flex-wrap items-center justify-center gap-6 mb-10"
          style={{ animationDelay: '350ms' }}>
          <div className="flex items-center gap-2 text-white/70">
            <Users className="w-4 h-4" style={{ color: '#22c55e' }} />
            <span className="text-sm font-medium">
              <span className="text-white font-bold text-lg">{Number(registrationCount || 0)}</span>+ Registered
            </span>
          </div>
          <div className="w-px h-5 bg-white/20" />
          <div className="flex items-center gap-2 text-white/70">
            <Calendar className="w-4 h-4" style={{ color: '#22c55e' }} />
            <span className="text-sm font-medium">{content.eventDate}</span>
          </div>
          <div className="w-px h-5 bg-white/20" />
          <div className="flex items-center gap-2 text-white/70">
            <MapPin className="w-4 h-4" style={{ color: '#22c55e' }} />
            <span className="text-sm font-medium">On Campus</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="animate-fade-up flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{ animationDelay: '400ms' }}>
          <button
            onClick={scrollToRegister}
            className="animate-pulse-ring px-8 py-4 rounded-full text-white font-bold text-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            style={{
              background: 'linear-gradient(135deg, #0f9d58, #22c55e)',
              boxShadow: '0 0 40px rgba(15, 157, 88, 0.6)',
            }}
          >
            🚀 Register Now
          </button>
          <button
            onClick={scrollToNext}
            className="px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            style={{
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
            }}
          >
            Explore More
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToNext}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/40 hover:text-white/70 transition-colors animate-float"
        aria-label="Scroll down"
      >
        <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
        <ChevronDown className="w-5 h-5" />
      </button>
    </section>
  );
}
