import { useEffect, useRef, useState } from 'react';
import { useGetEventDetailsContent } from '../hooks/useQueries';
import { Calendar, MapPin, DollarSign, Users, Tag, Clock } from 'lucide-react';

const defaultContent = {
  eventDate: 'March 15, 2026',
  venue: 'Main Auditorium & Exhibition Hall',
  registrationFee: '₹500 per team',
  eligibilityCriteria: 'Open to all undergraduate and postgraduate students',
  projectCategories: ['AI & Machine Learning', 'IoT & Embedded Systems', 'Web & Mobile Apps', 'Robotics', 'Green Technology'],
  timelineMilestones: [
    { milestoneLabel: 'Registration Opens', date: 'Jan 1, 2026' },
    { milestoneLabel: 'Abstract Submission', date: 'Feb 1, 2026' },
    { milestoneLabel: 'Selection Results', date: 'Feb 15, 2026' },
    { milestoneLabel: 'Expo Day', date: 'Mar 15, 2026' },
  ],
};

export default function EventDetails() {
  const { data: eventContent } = useGetEventDetailsContent();
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const content = eventContent || defaultContent;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleItems((prev) => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.15 }
    );
    itemRefs.current.forEach((ref) => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, [eventContent]);

  const infoCards = [
    { icon: Calendar, label: 'Event Date', value: content.eventDate },
    { icon: MapPin, label: 'Venue', value: content.venue },
    { icon: DollarSign, label: 'Registration Fee', value: content.registrationFee },
    { icon: Users, label: 'Eligibility', value: content.eligibilityCriteria },
  ];

  return (
    <section id="event-details" className="relative py-20 px-4 bg-background overflow-hidden">
      {/* Drifting Orbs */}
      <div className="absolute top-20 left-1/4 w-64 h-64 rounded-full bg-primary/8 blur-3xl drift-orb-1 pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-72 h-72 rounded-full bg-accent/8 blur-3xl drift-orb-2 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Event Details</h2>
          <p className="text-muted-foreground text-lg">Everything you need to know about the expo</p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {infoCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                data-index={i}
                ref={(el) => { itemRefs.current[i] = el; }}
                className={`bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-500 hover:shadow-lg hover:shadow-primary/10 ${
                  visibleItems.has(i) ? 'bounce-in' : 'opacity-0'
                }`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{card.label}</p>
                <p className="text-foreground font-semibold">{card.value}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Project Categories */}
          <div
            data-index={4}
            ref={(el) => { itemRefs.current[4] = el; }}
            className={`bg-card border border-border rounded-xl p-6 ${visibleItems.has(4) ? 'bounce-in' : 'opacity-0'}`}
            style={{ animationDelay: '400ms' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">Project Categories</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {content.projectCategories.map((cat, i) => (
                <span key={i} className="bg-primary/20 text-primary text-sm px-3 py-1 rounded-full border border-primary/30">
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div
            data-index={5}
            ref={(el) => { itemRefs.current[5] = el; }}
            className={`bg-card border border-border rounded-xl p-6 ${visibleItems.has(5) ? 'bounce-in' : 'opacity-0'}`}
            style={{ animationDelay: '500ms' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">Timeline</h3>
            </div>
            <div className="space-y-3">
              {content.timelineMilestones.map((milestone, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-foreground text-sm font-medium">{milestone.milestoneLabel}</span>
                    <span className="text-muted-foreground text-xs">{milestone.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
