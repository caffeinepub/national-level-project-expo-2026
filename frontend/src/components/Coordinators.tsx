import { useGetCoordinatorsContent } from '../hooks/useQueries';
import { Phone, Mail } from 'lucide-react';

interface Coordinator {
  name: string;
  role: string;
  phone: string;
  email: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const defaultContent = {
  facultyCoordinators: [
    { name: 'Dr. Faculty Coordinator', role: 'Faculty Coordinator', phone: '+91 98765 43210', email: 'faculty@sece.ac.in' },
  ],
  studentCoordinators: [
    { name: 'Student Coordinator One', role: 'Student Coordinator', phone: '+91 98765 43211', email: 'student1@sece.ac.in' },
    { name: 'Student Coordinator Two', role: 'Student Coordinator', phone: '+91 98765 43212', email: 'student2@sece.ac.in' },
  ],
};

function CoordinatorCard({ coordinator, index }: { coordinator: Coordinator; index: number }) {
  const initials = getInitials(coordinator.name);

  return (
    <div
      className="coordinator-card-shimmer group relative bg-card/60 backdrop-blur-sm border border-primary/20 rounded-2xl p-6 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/15 hover:-translate-y-2 transition-all duration-300"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Avatar */}
      <div className="flex items-center gap-4 mb-5">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border-2 border-primary/30 flex items-center justify-center flex-shrink-0 group-hover:border-primary/60 transition-colors duration-300">
          <span className="text-primary font-bold text-lg">{initials}</span>
        </div>
        <div>
          <h3 className="text-foreground font-bold text-base leading-tight">{coordinator.name}</h3>
          <p className="text-primary text-xs font-medium mt-0.5">{coordinator.role}</p>
        </div>
      </div>

      {/* Contact info */}
      <div className="space-y-2 relative z-10">
        <a
          href={`tel:${coordinator.phone}`}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
        >
          <Phone className="w-4 h-4 flex-shrink-0" />
          <span>{coordinator.phone}</span>
        </a>
        <a
          href={`mailto:${coordinator.email}`}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
        >
          <Mail className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{coordinator.email}</span>
        </a>
      </div>
    </div>
  );
}

export default function Coordinators() {
  const { data: coordinatorsContent } = useGetCoordinatorsContent();
  const content = coordinatorsContent ?? defaultContent;

  return (
    <section id="coordinators" className="relative py-24 bg-background overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">Meet the Team</p>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
            <span className="gradient-text-animated">Coordinators</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Get in touch with our coordinators for any queries or assistance.
          </p>
        </div>

        {/* Faculty Coordinators */}
        {content.facultyCoordinators.length > 0 && (
          <div className="mb-12">
            <h3 className="text-lg font-bold text-foreground/70 uppercase tracking-widest text-center mb-8 flex items-center justify-center gap-3">
              <span className="h-px flex-1 bg-border max-w-[100px]" />
              Faculty Coordinators
              <span className="h-px flex-1 bg-border max-w-[100px]" />
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
              {content.facultyCoordinators.map((coord, i) => (
                <CoordinatorCard key={i} coordinator={coord} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* Student Coordinators */}
        {content.studentCoordinators.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-foreground/70 uppercase tracking-widest text-center mb-8 flex items-center justify-center gap-3">
              <span className="h-px flex-1 bg-border max-w-[100px]" />
              Student Coordinators
              <span className="h-px flex-1 bg-border max-w-[100px]" />
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.studentCoordinators.map((coord, i) => (
                <CoordinatorCard key={i} coordinator={coord} index={i + content.facultyCoordinators.length} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
