import { useState, useEffect, useRef } from 'react';
import { useGetHeroContent, useGetRegistrationCount } from '../hooks/useQueries';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function parseEventDate(dateStr: string): Date | null {
  const formats = [
    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,
    /(\w+)\s+(\d{1,2}),?\s+(\d{4})/,
    /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/,
  ];
  for (const fmt of formats) {
    const match = dateStr.match(fmt);
    if (match) {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) return d;
    }
  }
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d;
  return null;
}

function useCountUp(target: number, duration: number = 1500): number {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (target === 0) {
      setCount(0);
      return;
    }
    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return count;
}

function TypewriterText({ text, delay = 500 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState('');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setIsDone(false);
    let i = 0;
    const startTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
          setTimeout(() => setIsDone(true), 1500);
        }
      }, 45);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(startTimeout);
  }, [text, delay]);

  return (
    <span>
      {displayed}
      {!isDone && <span className="typewriter-cursor" aria-hidden="true" />}
    </span>
  );
}

export default function Hero() {
  const { data: heroContent } = useGetHeroContent();
  const { data: registrationCountRaw } = useGetRegistrationCount();

  const defaults = {
    eventTitle: 'INNOVATIVE LINK EXPO 2K26',
    tagline: 'Where Innovation Meets Opportunity',
    eventDate: 'March 15, 2026',
    collegeName: 'Sri Eshwar College of Engineering',
  };

  const content = heroContent ?? defaults;
  const registrationCount = registrationCountRaw ? Number(registrationCountRaw) : 0;
  const animatedCount = useCountUp(registrationCount, 1500);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [scrollY, setScrollY] = useState(0);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const eventDate = parseEventDate(content.eventDate);
    if (!eventDate) return;

    const tick = () => {
      const now = new Date().getTime();
      const distance = eventDate.getTime() - now;
      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [content.eventDate]);

  // Parallax scroll effect (desktop only)
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth >= 768) {
        setScrollY(window.scrollY);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (bgRef.current) {
      bgRef.current.style.transform = `translateY(${scrollY * 0.4}px)`;
    }
  }, [scrollY]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Parallax background layer */}
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform"
        style={{ zIndex: 0 }}
      >
        <img
          src="/assets/generated/hero-bg.dim_1920x1080.png"
          alt=""
          className="w-full h-full object-cover opacity-20"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
      </div>

      {/* Glow orbs */}
      <div
        className="glow-orb glow-orb-1"
        style={{
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, oklch(0.65 0.18 150 / 0.35) 0%, transparent 70%)',
          top: '5%',
          left: '-10%',
        }}
      />
      <div
        className="glow-orb glow-orb-2"
        style={{
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, oklch(0.55 0.22 145 / 0.3) 0%, transparent 70%)',
          top: '30%',
          right: '-8%',
        }}
      />
      <div
        className="glow-orb glow-orb-3"
        style={{
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, oklch(0.70 0.16 155 / 0.25) 0%, transparent 70%)',
          bottom: '10%',
          left: '30%',
        }}
      />

      {/* Foreground content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto py-24">
        {/* College name */}
        <p className="text-primary/80 text-sm md:text-base font-medium tracking-widest uppercase mb-4 fade-up" style={{ animationDelay: '0.1s' }}>
          {content.collegeName}
        </p>

        {/* Event title */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight fade-up gradient-text-animated" style={{ animationDelay: '0.2s' }}>
          {content.eventTitle}
        </h1>

        {/* Tagline with typewriter */}
        <p className="text-lg md:text-2xl text-foreground/80 mb-8 font-light fade-up" style={{ animationDelay: '0.3s' }}>
          <TypewriterText text={content.tagline} delay={800} />
        </p>

        {/* Countdown timer */}
        <div className="flex justify-center gap-4 md:gap-8 mb-10 fade-up" style={{ animationDelay: '0.4s' }}>
          {[
            { label: 'Days', value: timeLeft.days },
            { label: 'Hours', value: timeLeft.hours },
            { label: 'Minutes', value: timeLeft.minutes },
            { label: 'Seconds', value: timeLeft.seconds },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex flex-col items-center bg-card/60 backdrop-blur-sm border border-primary/20 rounded-xl px-4 py-3 md:px-6 md:py-4 min-w-[70px] md:min-w-[90px]"
            >
              <span className="text-2xl md:text-4xl font-black text-primary font-mono tabular-nums">
                {String(value).padStart(2, '0')}
              </span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{label}</span>
            </div>
          ))}
        </div>

        {/* Registration count */}
        <div className="mb-10 fade-up" style={{ animationDelay: '0.5s' }}>
          <p className="text-muted-foreground text-sm">
            <span className="text-primary font-bold text-xl tabular-nums">{animatedCount}</span>
            {' '}teams already registered
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center fade-up" style={{ animationDelay: '0.6s' }}>
          {/* Primary CTA with pulse ring */}
          <div className="pulse-ring-btn rounded-full">
            <a
              href="#registration"
              className="relative z-10 inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-8 py-3 rounded-full hover:bg-primary/90 transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/30"
            >
              Register Now
            </a>
          </div>

          <a
            href="#about"
            className="inline-flex items-center gap-2 border border-primary/40 text-primary font-semibold px-8 py-3 rounded-full hover:bg-primary/10 transition-all duration-300"
          >
            Learn More
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-60">
        <span className="text-xs text-muted-foreground tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-primary to-transparent animate-pulse" />
      </div>
    </section>
  );
}
