import { useRef, useEffect, useState } from 'react';
import { useGetEventDetailsContent } from '../hooks/useQueries';
import { Calendar, MapPin, DollarSign, Users, Tag, Clock, Zap } from 'lucide-react';

const defaultContent = {
  eventDate: 'April 15, 2026',
  venue: 'Main Auditorium, IoT Engineering Block',
  registrationFee: '₹500 per team',
  eligibilityCriteria: 'Open to all UG/PG students',
  projectCategories: ['Smart Home', 'Healthcare IoT', 'Industrial IoT', 'Agriculture Tech', 'Smart City'],
  timelineMilestones: [
    { milestoneLabel: 'Registration Opens', date: 'March 1, 2026' },
    { milestoneLabel: 'Abstract Submission', date: 'March 20, 2026' },
    { milestoneLabel: 'Selection Results', date: 'April 1, 2026' },
    { milestoneLabel: 'Project Expo Day', date: 'April 15, 2026' },
  ],
};

function AnimatedCard({ children, index, className = '' }: { children: React.ReactNode; index: number; className?: string }) {
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
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
        transition: `opacity 0.6s ease, transform 0.6s ease`,
        transitionDelay: `${index * 100}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function EventDetails() {
  const { data: eventContent } = useGetEventDetailsContent();
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const el = headerRef.current;
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

  const content = eventContent || defaultContent;

  const infoCards = [
    { icon: <Calendar className="w-6 h-6" />, label: 'Event Date', value: content.eventDate },
    { icon: <MapPin className="w-6 h-6" />, label: 'Venue', value: content.venue },
    { icon: <DollarSign className="w-6 h-6" />, label: 'Registration Fee', value: content.registrationFee },
    { icon: <Users className="w-6 h-6" />, label: 'Eligibility', value: content.eligibilityCriteria },
  ];

  return (
    <section
      id="event-details"
      className="relative py-20 md:py-28 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #071a10 0%, #0a2015 50%, #071a10 100%)' }}
    >
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="drift-orb-2 absolute top-[20%] left-[5%] w-80 h-80 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #0f9d58, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="drift-orb-3 absolute bottom-[15%] right-[8%] w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #22c55e, transparent 70%)', filter: 'blur(45px)' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={headerRef}
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
            Event Details
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-5">
            <span className="gradient-text">Everything You Need to Know</span>
          </h2>
          <p className="text-white/60 max-w-xl mx-auto text-base md:text-lg">
            All the essential information about the National Level Project Expo 2026.
          </p>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {infoCards.map((card, index) => (
            <AnimatedCard key={index} index={index} className="glass-card glass-card-hover rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(15,157,88,0.2), rgba(34,197,94,0.1))',
                  border: '1px solid rgba(15,157,88,0.3)',
                  color: '#22c55e',
                }}>
                {card.icon}
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#22c55e' }}>
                {card.label}
              </p>
              <p className="text-white font-semibold text-sm md:text-base">{card.value}</p>
            </AnimatedCard>
          ))}
        </div>

        {/* Two Column: Categories + Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Project Categories */}
          <AnimatedCard index={0} className="glass-card rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{
                  background: 'rgba(15,157,88,0.15)',
                  border: '1px solid rgba(15,157,88,0.3)',
                  color: '#22c55e',
                }}>
                <Tag className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">Project Categories</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {content.projectCategories.map((cat, i) => (
                <span
                  key={i}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 cursor-default"
                  style={{
                    background: 'rgba(15,157,88,0.12)',
                    border: '1px solid rgba(15,157,88,0.3)',
                    color: '#22c55e',
                  }}
                >
                  {cat}
                </span>
              ))}
            </div>
          </AnimatedCard>

          {/* Timeline */}
          <AnimatedCard index={1} className="glass-card rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{
                  background: 'rgba(15,157,88,0.15)',
                  border: '1px solid rgba(15,157,88,0.3)',
                  color: '#22c55e',
                }}>
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">Timeline</h3>
            </div>
            <div className="space-y-4">
              {content.timelineMilestones.map((milestone, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #0f9d58, #22c55e)' }} />
                    {i < content.timelineMilestones.length - 1 && (
                      <div className="w-px flex-1 mt-1 min-h-[2rem]"
                        style={{ background: 'rgba(15,157,88,0.3)' }} />
                    )}
                  </div>
                  <div className="pb-2">
                    <p className="text-white font-semibold text-sm">{milestone.milestoneLabel}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#22c55e' }}>{milestone.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedCard>
        </div>
      </div>
    </section>
  );
}
