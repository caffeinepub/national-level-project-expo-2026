import { useEffect, useRef } from 'react';
import { Lightbulb, Users, Trophy, Rocket, Star, Zap } from 'lucide-react';
import { useGetAboutContent } from '../hooks/useQueries';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Lightbulb,
  Users,
  Trophy,
  Rocket,
  Star,
  Zap,
};

const defaultContent = {
  sectionDescription:
    'Innovative Link Expo 2K26 is a premier technical symposium that brings together the brightest minds from engineering colleges across the region. Showcase your projects, compete with the best, and connect with industry leaders.',
  featureCards: [
    {
      title: 'Innovation Hub',
      description: 'Present your groundbreaking projects to industry experts and fellow innovators in a dynamic showcase environment.',
      icon: 'Lightbulb',
    },
    {
      title: 'Networking',
      description: 'Connect with students, faculty, and industry professionals from top institutions across the region.',
      icon: 'Users',
    },
    {
      title: 'Competitions',
      description: 'Participate in exciting technical competitions with attractive prizes and recognition for outstanding work.',
      icon: 'Trophy',
    },
  ],
};

export default function About() {
  const { data: aboutContent } = useGetAboutContent();
  const content = aboutContent ?? defaultContent;

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal-card').forEach((el, i) => {
              (el as HTMLElement).style.animationDelay = `${i * 0.15}s`;
              el.classList.add('bounce-in');
            });
          }
        });
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative py-24 bg-background overflow-hidden">
      {/* Glow orbs */}
      <div
        className="glow-orb glow-orb-2"
        style={{
          width: '450px',
          height: '450px',
          background: 'radial-gradient(circle, oklch(0.65 0.18 150 / 0.2) 0%, transparent 70%)',
          top: '-10%',
          right: '-5%',
        }}
      />
      <div
        className="glow-orb glow-orb-3"
        style={{
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, oklch(0.55 0.22 145 / 0.18) 0%, transparent 70%)',
          bottom: '0%',
          left: '-5%',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">About the Event</p>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-6">
            What is <span className="gradient-text-animated">Innovative Link Expo?</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
            {content.sectionDescription}
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {content.featureCards.map((card, index) => {
            const IconComponent = iconMap[card.icon] ?? Lightbulb;
            return (
              <div
                key={index}
                className="reveal-card opacity-0 group relative bg-card/60 backdrop-blur-sm border border-primary/20 rounded-2xl p-8 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                  <IconComponent className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{card.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{card.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
