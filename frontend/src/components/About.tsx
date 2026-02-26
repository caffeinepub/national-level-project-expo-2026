import { useEffect, useRef, useState } from 'react';
import { useGetAboutContent } from '../hooks/useQueries';

const defaultCards = [
  {
    icon: '🚀',
    title: 'Innovation Hub',
    description: 'A platform for students to showcase groundbreaking projects and ideas that push the boundaries of technology.',
  },
  {
    icon: '🤝',
    title: 'Networking',
    description: 'Connect with industry experts, faculty, and fellow innovators to build lasting professional relationships.',
  },
  {
    icon: '🏆',
    title: 'Recognition',
    description: 'Get your work recognized by industry leaders and win exciting prizes for the most innovative projects.',
  },
];

export default function About() {
  const { data: aboutContent } = useGetAboutContent();
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleCards((prev) => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.2 }
    );
    cardRefs.current.forEach((ref) => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, [aboutContent]);

  const description = aboutContent?.sectionDescription ||
    'Innovative Link Expo is a premier technical exhibition where students present their innovative projects, research, and ideas to industry experts and academic leaders.';

  const cards = aboutContent?.featureCards?.length
    ? aboutContent.featureCards
    : defaultCards;

  return (
    <section id="about" className="relative py-20 px-4 bg-card/30 overflow-hidden">
      {/* Drifting Orbs */}
      <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-primary/8 blur-3xl drift-orb-2 pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-56 h-56 rounded-full bg-accent/8 blur-3xl drift-orb-3 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">About the Expo</h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">{description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, i) => (
            <div
              key={i}
              data-index={i}
              ref={(el) => { cardRefs.current[i] = el; }}
              className={`group relative bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-500 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 ${
                visibleCards.has(i) ? 'bounce-in' : 'opacity-0'
              }`}
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="text-4xl mb-4">{card.icon}</div>
              <h3 className="text-xl font-bold text-foreground mb-3">{card.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{card.description}</p>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
