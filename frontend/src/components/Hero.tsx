import { useState, useEffect } from 'react';
import { ChevronDown, Users, Trophy } from 'lucide-react';
import { useGetRegistrationCount, useGetHeroContent } from '../hooks/useQueries';

const DEFAULT_EVENT_TITLE = 'National Level Project Expo 2026';
const DEFAULT_TAGLINE = 'Innovate · Collaborate · Inspire';
const DEFAULT_EVENT_DATE = 'April 15, 2026';
const DEFAULT_COLLEGE_NAME = 'E.G.S. Pillay Engineering College';

function getEventDate(dateStr: string): Date {
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) return parsed;
  return new Date('2026-04-15T09:00:00');
}

function getTimeLeft(eventDate: Date) {
  const now = new Date();
  const diff = eventDate.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="glass-card w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-xl border border-expo-green-start/30 shadow-lg shadow-expo-green-start/10">
        <span className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="mt-2 text-xs text-white/60 uppercase tracking-widest font-medium">{label}</span>
    </div>
  );
}

export default function Hero() {
  const { data: heroContent } = useGetHeroContent();
  const { data: countData } = useGetRegistrationCount();
  const registrationCount = countData ? Number(countData) : 0;

  const eventTitle = heroContent?.eventTitle || DEFAULT_EVENT_TITLE;
  const tagline = heroContent?.tagline || DEFAULT_TAGLINE;
  const eventDateStr = heroContent?.eventDate || DEFAULT_EVENT_DATE;
  const collegeName = heroContent?.collegeName || DEFAULT_COLLEGE_NAME;

  const eventDate = getEventDate(eventDateStr);
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(eventDate));

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft(eventDate)), 1000);
    return () => clearInterval(timer);
  }, [eventDate.getTime()]);

  const handleRegisterClick = () => {
    const el = document.getElementById('registration');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollDown = () => {
    const el = document.getElementById('about');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/generated/hero-bg.dim_1920x1080.png')" }}
      />

      {/* Dark Green Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-expo-dark/80 via-expo-dark/70 to-expo-dark/90" />

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-expo-green-start/20 animate-float"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 8}s`,
            }}
          />
        ))}
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-expo-green-start/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-expo-green-end/10 rounded-full blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto pt-20">
        {/* College Branding */}
        <div className="animate-slide-up opacity-0 [animation-fill-mode:forwards] [animation-delay:0.1s]">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-expo-green-end border border-expo-green-start/40 bg-expo-green-start/10 backdrop-blur-sm mb-4 tracking-wide uppercase">
            {collegeName} • ECE Department
          </span>
        </div>

        {/* Event Title */}
        <div className="animate-slide-up opacity-0 [animation-fill-mode:forwards] [animation-delay:0.25s]">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-4">
            {eventTitle.includes('2026') ? (
              <>
                {eventTitle.replace('Project Expo 2026', '')}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-expo-green-start to-expo-green-end">
                  Project Expo 2026
                </span>
              </>
            ) : (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-expo-green-start to-expo-green-end">
                {eventTitle}
              </span>
            )}
          </h1>
        </div>

        {/* Tagline */}
        <div className="animate-slide-up opacity-0 [animation-fill-mode:forwards] [animation-delay:0.4s]">
          <p className="text-lg sm:text-xl text-white/70 mb-3 font-medium">
            {tagline}
          </p>
          <p className="text-sm sm:text-base text-white/50 mb-8 max-w-2xl mx-auto">
            Showcase your groundbreaking projects to industry experts, win exciting prizes, and connect with brilliant minds from across the nation.
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="animate-slide-up opacity-0 [animation-fill-mode:forwards] [animation-delay:0.55s]">
          <p className="text-xs text-white/50 uppercase tracking-widest mb-4 font-medium">Event Countdown</p>
          <div className="flex items-start justify-center gap-3 sm:gap-5 mb-8">
            <CountdownUnit value={timeLeft.days} label="Days" />
            <span className="text-3xl text-expo-green-end font-bold mt-3">:</span>
            <CountdownUnit value={timeLeft.hours} label="Hours" />
            <span className="text-3xl text-expo-green-end font-bold mt-3">:</span>
            <CountdownUnit value={timeLeft.minutes} label="Mins" />
            <span className="text-3xl text-expo-green-end font-bold mt-3">:</span>
            <CountdownUnit value={timeLeft.seconds} label="Secs" />
          </div>
        </div>

        {/* Registration Counter */}
        <div className="animate-slide-up opacity-0 [animation-fill-mode:forwards] [animation-delay:0.65s]">
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-full border border-white/10">
              <Users className="w-4 h-4 text-expo-green-end" />
              <span className="text-white font-semibold text-sm">
                <span className="text-expo-green-end font-bold">{registrationCount}</span> Teams Registered
              </span>
            </div>
            <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-full border border-white/10">
              <Trophy className="w-4 h-4 text-expo-green-end" />
              <span className="text-white font-semibold text-sm">
                <span className="text-expo-green-end font-bold">₹50,000+</span> Prize Pool
              </span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="animate-slide-up opacity-0 [animation-fill-mode:forwards] [animation-delay:0.75s]">
          <button
            onClick={handleRegisterClick}
            className="relative inline-flex items-center gap-2 px-8 py-4 text-lg font-bold text-white rounded-full bg-gradient-to-r from-expo-green-start to-expo-green-end shadow-xl shadow-expo-green-start/40 hover:shadow-expo-green-start/60 hover:scale-105 transition-all duration-300 animate-glow-pulse"
          >
            Register Now — It's Free!
          </button>
          <p className="mt-3 text-xs text-white/40">{eventDateStr} • Nagapattinam, Tamil Nadu</p>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <button
        onClick={handleScrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 hover:text-expo-green-end transition-colors animate-bounce"
        aria-label="Scroll down"
      >
        <ChevronDown className="w-6 h-6" />
      </button>
    </section>
  );
}
