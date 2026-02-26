import { useRef, useEffect, useState } from 'react';
import { useGetAboutContent } from '../hooks/useQueries';
import { Cpu, Wifi, Layers, Zap, Globe, Shield } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  cpu: <Cpu className="w-7 h-7" />,
  wifi: <Wifi className="w-7 h-7" />,
  layers: <Layers className="w-7 h-7" />,
  zap: <Zap className="w-7 h-7" />,
  globe: <Globe className="w-7 h-7" />,
  shield: <Shield className="w-7 h-7" />,
};

const defaultFeatureCards = [
  {
    title: 'IoT Innovation',
    description: 'Showcase cutting-edge IoT projects that connect the physical and digital worlds.',
    icon: 'cpu',
  },
  {
    title: 'Smart Connectivity',
    description: 'Explore wireless protocols, sensor networks, and real-time data communication.',
    icon: 'wifi',
  },
  {
    title: 'Layered Architecture',
    description: 'Demonstrate multi-tier IoT systems from edge devices to cloud platforms.',
    icon: 'layers',
  },
];

function FeatureCard({ card, index }: { card: { title: string; description: string; icon: string }; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="coordinator-card-shimmer glass-card glass-card-hover rounded-2xl p-6 md:p-8 cursor-default"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
        transition: `opacity 0.6s ease, transform 0.6s ease`,
        transitionDelay: `${index * 120}ms`,
      }}
    >
      {/* Icon */}
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
        style={{
          background: 'linear-gradient(135deg, rgba(15,157,88,0.2), rgba(34,197,94,0.1))',
          border: '1px solid rgba(15,157,88,0.3)',
          color: '#22c55e',
        }}
      >
        {iconMap[card.icon] || <Zap className="w-7 h-7" />}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-white mb-3">{card.title}</h3>

      {/* Description */}
      <p className="text-white/60 leading-relaxed text-sm md:text-base">{card.description}</p>

      {/* Bottom accent */}
      <div className="mt-5 h-0.5 w-12 rounded-full"
        style={{ background: 'linear-gradient(to right, #0f9d58, #22c55e)' }} />
    </div>
  );
}

export default function About() {
  const { data: aboutContent } = useGetAboutContent();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const content = aboutContent || {
    sectionDescription: 'The National Level Project Expo 2026 is a premier platform for IoT enthusiasts, engineers, and innovators to showcase their groundbreaking projects and connect with industry leaders.',
    featureCards: defaultFeatureCards,
  };

  return (
    <section
      id="about"
      className="relative py-20 md:py-28 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #050f0a 0%, #071a10 50%, #050f0a 100%)' }}
    >
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="drift-orb-1 absolute top-[10%] right-[5%] w-72 h-72 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #0f9d58, transparent 70%)', filter: 'blur(50px)' }} />
        <div className="drift-orb-2 absolute bottom-[10%] left-[5%] w-56 h-56 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #22c55e, transparent 70%)', filter: 'blur(40px)' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={sectionRef}
          className="text-center mb-16"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
            style={{
              background: 'rgba(15,157,88,0.1)',
              border: '1px solid rgba(15,157,88,0.3)',
              color: '#22c55e',
            }}>
            <Zap className="w-3 h-3" />
            About the Event
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-5">
            <span className="gradient-text">Why Participate?</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            {content.sectionDescription}
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {content.featureCards.map((card, index) => (
            <FeatureCard key={index} card={card} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
