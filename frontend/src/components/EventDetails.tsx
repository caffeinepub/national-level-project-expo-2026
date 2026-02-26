import { useEffect, useRef } from 'react';
import { Calendar, MapPin, DollarSign, Users, Tag, Clock } from 'lucide-react';
import { useGetEventDetailsContent } from '../hooks/useQueries';

const defaultContent = {
  eventDate: 'March 15, 2026',
  venue: 'Sri Eshwar College of Engineering, Coimbatore',
  registrationFee: '₹500 per team',
  eligibilityCriteria: 'Open to all undergraduate and postgraduate engineering students',
  projectCategories: [
    'Artificial Intelligence & Machine Learning',
    'Internet of Things',
    'Web & Mobile Development',
    'Robotics & Automation',
    'Cybersecurity',
    'Blockchain Technology',
  ],
  timelineMilestones: [
    { milestoneLabel: 'Registration Opens', date: 'January 1, 2026' },
    { milestoneLabel: 'Abstract Submission', date: 'February 15, 2026' },
    { milestoneLabel: 'Selection Results', date: 'March 1, 2026' },
    { milestoneLabel: 'Event Day', date: 'March 15, 2026' },
  ],
};

export default function EventDetails() {
  const { data: eventDetailsContent } = useGetEventDetailsContent();
  const content = eventDetailsContent ?? defaultContent;

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal-item').forEach((el, i) => {
              (el as HTMLElement).style.animationDelay = `${i * 0.1}s`;
              el.classList.add('bounce-in');
            });
          }
        });
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="event-details" ref={sectionRef} className="relative py-24 bg-background overflow-hidden">
      {/* Glow orbs */}
      <div
        className="glow-orb glow-orb-1"
        style={{
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, oklch(0.65 0.18 150 / 0.18) 0%, transparent 70%)',
          top: '5%',
          left: '-8%',
        }}
      />
      <div
        className="glow-orb glow-orb-3"
        style={{
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, oklch(0.55 0.22 145 / 0.15) 0%, transparent 70%)',
          bottom: '5%',
          right: '-5%',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">Event Information</p>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
            <span className="gradient-text-animated">Event Details</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left column: key info */}
          <div className="space-y-6">
            {[
              { icon: Calendar, label: 'Event Date', value: content.eventDate },
              { icon: MapPin, label: 'Venue', value: content.venue },
              { icon: DollarSign, label: 'Registration Fee', value: content.registrationFee },
              { icon: Users, label: 'Eligibility', value: content.eligibilityCriteria },
            ].map(({ icon: Icon, label, value }, i) => (
              <div
                key={label}
                className="reveal-item opacity-0 flex items-start gap-4 bg-card/60 backdrop-blur-sm border border-primary/20 rounded-xl p-5 hover:border-primary/40 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
                  <p className="text-foreground font-medium">{value}</p>
                </div>
              </div>
            ))}

            {/* Project categories */}
            <div className="reveal-item opacity-0 bg-card/60 backdrop-blur-sm border border-primary/20 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Tag className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Project Categories</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {content.projectCategories.map((cat, i) => (
                  <span
                    key={i}
                    className="text-xs bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right column: timeline */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Timeline</h3>
            </div>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-primary/60 via-primary/30 to-transparent" />

              <div className="space-y-8">
                {content.timelineMilestones.map((milestone, i) => (
                  <div
                    key={i}
                    className="reveal-item opacity-0 relative flex items-start gap-6 pl-14"
                  >
                    {/* Dot */}
                    <div className="absolute left-3 top-1 w-5 h-5 rounded-full bg-primary border-2 border-background shadow-lg shadow-primary/40 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-background" />
                    </div>
                    <div className="bg-card/60 backdrop-blur-sm border border-primary/20 rounded-xl p-4 flex-1 hover:border-primary/40 transition-all duration-300">
                      <p className="text-primary font-semibold text-sm mb-1">{milestone.milestoneLabel}</p>
                      <p className="text-muted-foreground text-sm">{milestone.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
