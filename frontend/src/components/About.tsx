import { Lightbulb, Globe, Award } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useGetAboutContent } from '../hooks/useQueries';

const DEFAULT_DESCRIPTION = `The <strong>National Level Project Expo 2026</strong> is a prestigious technical event organized by the Department of Electronics and Communication Engineering at <strong>E.G.S. Pillay Engineering College, Nagapattinam</strong>. This expo provides a dynamic platform for engineering students to present their innovative projects, gain exposure to real-world challenges, and compete for recognition at the national level.`;

const DEFAULT_FEATURES = [
  {
    icon: Lightbulb,
    iconName: 'Lightbulb',
    title: 'Innovation Hub',
    description:
      'A platform to showcase cutting-edge projects across IoT, AI/ML, Robotics, and more. Push the boundaries of technology and present your ideas to industry experts.',
    color: 'from-yellow-500/20 to-orange-500/20',
    iconColor: 'text-yellow-400',
  },
  {
    icon: Globe,
    iconName: 'Globe',
    title: 'Inter-College Participation',
    description:
      'Open to all engineering colleges across Tamil Nadu and beyond. Connect with brilliant minds, exchange ideas, and build lasting professional networks.',
    color: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-blue-400',
  },
  {
    icon: Award,
    iconName: 'Award',
    title: 'Certificates & Prizes',
    description:
      'Win exciting cash prizes, trophies, and certificates of merit. All participants receive participation certificates recognized by E.G.S. Pillay Engineering College.',
    color: 'from-expo-green-start/20 to-expo-green-end/20',
    iconColor: 'text-expo-green-end',
  },
];

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Lightbulb,
  Globe,
  Award,
};

function getIconComponent(iconName: string) {
  return ICON_MAP[iconName] || Lightbulb;
}

const CARD_STYLES = [
  { color: 'from-yellow-500/20 to-orange-500/20', iconColor: 'text-yellow-400' },
  { color: 'from-blue-500/20 to-cyan-500/20', iconColor: 'text-blue-400' },
  { color: 'from-expo-green-start/20 to-expo-green-end/20', iconColor: 'text-expo-green-end' },
];

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
  iconColor: string;
  delay: number;
}

function FeatureCard({ icon: Icon, title, description, color, iconColor, delay }: FeatureCardProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`glass-card rounded-2xl p-6 border border-white/10 hover:border-expo-green-start/50 hover:shadow-xl hover:shadow-expo-green-start/20 transition-all duration-500 hover:-translate-y-2 group ${
        isVisible ? 'animate-slide-up-visible' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div
        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon className={`w-7 h-7 ${iconColor}`} />
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-white/60 leading-relaxed text-sm">{description}</p>
    </div>
  );
}

export default function About() {
  const { ref: headingRef, isVisible: headingVisible } = useScrollAnimation({ threshold: 0.3 });
  const { data: aboutContent } = useGetAboutContent();

  const sectionDescription = aboutContent?.sectionDescription || DEFAULT_DESCRIPTION;

  const featureCards = aboutContent?.featureCards && aboutContent.featureCards.length > 0
    ? aboutContent.featureCards.map((card, i) => ({
        icon: getIconComponent(card.icon),
        title: card.title,
        description: card.description,
        color: CARD_STYLES[i % CARD_STYLES.length].color,
        iconColor: CARD_STYLES[i % CARD_STYLES.length].iconColor,
      }))
    : DEFAULT_FEATURES;

  return (
    <section id="about" className="py-24 bg-expo-dark relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-expo-green-start/30 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(15,157,88,0.05),transparent_60%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={headingRef as React.RefObject<HTMLDivElement>}
          className={`text-center mb-16 transition-all duration-700 ${
            headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold text-expo-green-end border border-expo-green-start/40 bg-expo-green-start/10 mb-4 uppercase tracking-widest">
            About the Expo
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6">
            Where Ideas Meet{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-expo-green-start to-expo-green-end">
              Innovation
            </span>
          </h2>
          <p
            className="text-white/60 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed"
            dangerouslySetInnerHTML={{ __html: sectionDescription }}
          />
          <p className="text-white/50 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed mt-4">
            Established in 1984, E.G.S. Pillay Engineering College is one of Tamil Nadu's premier
            engineering institutions, committed to fostering technical excellence, research, and innovation
            among its students.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featureCards.map((feature, i) => (
            <FeatureCard key={feature.title + i} {...feature} delay={i * 150} />
          ))}
        </div>
      </div>
    </section>
  );
}
