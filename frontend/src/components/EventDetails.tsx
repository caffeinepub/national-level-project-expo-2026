import { Calendar, MapPin, IndianRupee, Users, Tag, Clock } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useGetEventDetailsContent } from '../hooks/useQueries';

const DEFAULT_EVENT_DATE = 'April 15, 2026';
const DEFAULT_VENUE = 'E.G.S. Pillay Engineering College';
const DEFAULT_FEE = 'Rs. 150';
const DEFAULT_ELIGIBILITY = 'All Engineering Students';

const DEFAULT_CATEGORIES = [
  { name: 'IoT & Embedded Systems', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { name: 'AI / Machine Learning', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  { name: 'Robotics & Automation', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
  { name: 'Software Development', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
  { name: 'Electronics & VLSI', color: 'bg-pink-500/20 text-pink-300 border-pink-500/30' },
  { name: 'Others / Interdisciplinary', color: 'bg-expo-green-start/20 text-expo-green-end border-expo-green-start/30' },
];

const CATEGORY_COLORS = [
  'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'bg-orange-500/20 text-orange-300 border-orange-500/30',
  'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'bg-pink-500/20 text-pink-300 border-pink-500/30',
  'bg-expo-green-start/20 text-expo-green-end border-expo-green-start/30',
];

const DEFAULT_TIMELINE = [
  { date: 'March 1, 2026', title: 'Registration Opens', desc: 'Online registration portal goes live. Submit your team details and project abstract.', side: 'left' as const },
  { date: 'March 31, 2026', title: 'Registration Deadline', desc: 'Last date to register and submit your project abstract for review.', side: 'right' as const },
  { date: 'April 5, 2026', title: 'Abstract Review', desc: 'Submitted abstracts will be reviewed by faculty coordinators. Selected teams will be notified.', side: 'left' as const },
  { date: 'April 10, 2026', title: 'Confirmation & Briefing', desc: 'Selected teams receive confirmation and event guidelines. Prepare your project demo.', side: 'right' as const },
  { date: 'April 15, 2026', title: 'Expo Day 🎉', desc: 'Present your project to judges, industry experts, and fellow innovators. Winners announced!', side: 'left' as const },
];

interface TimelineItemData {
  date: string;
  title: string;
  desc: string;
  side: 'left' | 'right';
}

function TimelineItem({ item, index }: { item: TimelineItemData; index: number }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 });
  const isLeft = item.side === 'left';

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`relative flex items-center gap-4 md:gap-0 transition-all duration-700 ${
        isVisible
          ? 'opacity-100 translate-x-0'
          : isLeft
          ? 'opacity-0 -translate-x-12'
          : 'opacity-0 translate-x-12'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Left content (desktop) */}
      <div className={`hidden md:block w-5/12 ${isLeft ? 'text-right pr-8' : ''}`}>
        {isLeft && (
          <div className="glass-card rounded-xl p-4 border border-white/10 hover:border-expo-green-start/40 transition-colors">
            <span className="text-xs text-expo-green-end font-semibold uppercase tracking-wider">{item.date}</span>
            <h4 className="text-white font-bold mt-1 mb-2">{item.title}</h4>
            <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
          </div>
        )}
      </div>

      {/* Center dot */}
      <div className="hidden md:flex w-2/12 justify-center">
        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-expo-green-start to-expo-green-end shadow-lg shadow-expo-green-start/50 ring-4 ring-expo-dark z-10" />
      </div>

      {/* Right content (desktop) */}
      <div className={`hidden md:block w-5/12 ${!isLeft ? 'pl-8' : ''}`}>
        {!isLeft && (
          <div className="glass-card rounded-xl p-4 border border-white/10 hover:border-expo-green-start/40 transition-colors">
            <span className="text-xs text-expo-green-end font-semibold uppercase tracking-wider">{item.date}</span>
            <h4 className="text-white font-bold mt-1 mb-2">{item.title}</h4>
            <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
          </div>
        )}
      </div>

      {/* Mobile layout */}
      <div className="md:hidden flex items-start gap-4 w-full">
        <div className="flex flex-col items-center">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-expo-green-start to-expo-green-end shadow-lg shadow-expo-green-start/50 mt-1.5 flex-shrink-0" />
          <div className="w-px flex-1 bg-expo-green-start/20 mt-1" />
        </div>
        <div className="glass-card rounded-xl p-4 border border-white/10 flex-1 mb-4">
          <span className="text-xs text-expo-green-end font-semibold uppercase tracking-wider">{item.date}</span>
          <h4 className="text-white font-bold mt-1 mb-2">{item.title}</h4>
          <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
        </div>
      </div>
    </div>
  );
}

export default function EventDetails() {
  const { ref: headingRef, isVisible: headingVisible } = useScrollAnimation({ threshold: 0.3 });
  const { data: eventDetailsContent } = useGetEventDetailsContent();

  const eventDate = eventDetailsContent?.eventDate || DEFAULT_EVENT_DATE;
  const venue = eventDetailsContent?.venue || DEFAULT_VENUE;
  const registrationFee = eventDetailsContent?.registrationFee || DEFAULT_FEE;
  const eligibilityCriteria = eventDetailsContent?.eligibilityCriteria || DEFAULT_ELIGIBILITY;

  const eventInfo = [
    { icon: Calendar, label: 'Event Date', value: eventDate, sub: 'Wednesday' },
    { icon: MapPin, label: 'Venue', value: venue, sub: 'Nagapattinam, Tamil Nadu' },
    { icon: IndianRupee, label: 'Registration Fee', value: registrationFee, sub: 'Per head' },
    { icon: Users, label: 'Eligibility', value: eligibilityCriteria, sub: 'UG & PG (Any College)' },
  ];

  const categories =
    eventDetailsContent?.projectCategories && eventDetailsContent.projectCategories.length > 0
      ? eventDetailsContent.projectCategories.map((name, i) => ({
          name,
          color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
        }))
      : DEFAULT_CATEGORIES;

  const timeline: TimelineItemData[] =
    eventDetailsContent?.timelineMilestones && eventDetailsContent.timelineMilestones.length > 0
      ? eventDetailsContent.timelineMilestones.map((m, i) => ({
          date: m.date,
          title: m.milestoneLabel,
          desc: '',
          side: i % 2 === 0 ? 'left' : 'right',
        }))
      : DEFAULT_TIMELINE;

  return (
    <section id="event-details" className="py-24 bg-expo-darker relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-expo-green-start/30 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(15,157,88,0.05),transparent_60%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          ref={headingRef as React.RefObject<HTMLDivElement>}
          className={`text-center mb-16 transition-all duration-700 ${
            headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold text-expo-green-end border border-expo-green-start/40 bg-expo-green-start/10 mb-4 uppercase tracking-widest">
            Event Details
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
            Everything You Need to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-expo-green-start to-expo-green-end">
              Know
            </span>
          </h2>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {eventInfo.map(({ icon: Icon, label, value, sub }) => (
            <div
              key={label}
              className="glass-card rounded-2xl p-5 border border-white/10 hover:border-expo-green-start/40 hover:shadow-lg hover:shadow-expo-green-start/10 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-lg bg-expo-green-start/20 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-expo-green-end" />
              </div>
              <p className="text-white/50 text-xs uppercase tracking-wider mb-1">{label}</p>
              <p className="text-white font-bold text-base">{value}</p>
              <p className="text-white/40 text-xs mt-1">{sub}</p>
            </div>
          ))}
        </div>

        {/* Categories */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Tag className="w-5 h-5 text-expo-green-end" />
            <h3 className="text-xl font-bold text-white">Project Categories</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat, i) => (
              <span
                key={cat.name + i}
                className={`px-4 py-2 rounded-full text-sm font-semibold border ${cat.color} backdrop-blur-sm`}
              >
                {cat.name}
              </span>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div>
          <div className="flex items-center gap-3 mb-10">
            <Clock className="w-5 h-5 text-expo-green-end" />
            <h3 className="text-xl font-bold text-white">Event Timeline</h3>
          </div>

          {/* Desktop: vertical line */}
          <div className="hidden md:block relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-expo-green-start/50 via-expo-green-start/20 to-transparent -translate-x-1/2" />
            <div className="space-y-8">
              {timeline.map((item, i) => (
                <TimelineItem key={item.title + i} item={item} index={i} />
              ))}
            </div>
          </div>

          {/* Mobile */}
          <div className="md:hidden space-y-0">
            {timeline.map((item, i) => (
              <TimelineItem key={item.title + i} item={item} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
