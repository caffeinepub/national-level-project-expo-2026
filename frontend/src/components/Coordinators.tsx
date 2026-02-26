import { useEffect, useRef, useState } from 'react';
import { useGetCoordinatorsContent } from '../hooks/useQueries';
import { Phone, Mail, User } from 'lucide-react';
import type { Coordinator } from '../backend';

const defaultFaculty: Coordinator[] = [
  { name: 'Dr. Faculty Name', role: 'Faculty Coordinator', phone: '+91 98765 43210', email: 'faculty@college.edu' },
];

const defaultStudents: Coordinator[] = [
  { name: 'Student Name 1', role: 'Student Coordinator', phone: '+91 98765 43211', email: 'student1@college.edu' },
  { name: 'Student Name 2', role: 'Student Coordinator', phone: '+91 98765 43212', email: 'student2@college.edu' },
];

function CoordinatorCard({ coord, index, visible }: { coord: Coordinator; index: number; visible: boolean }) {
  return (
    <div
      className={`coordinator-card-shimmer group relative bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-500 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 ${
        visible ? 'bounce-in' : 'opacity-0'
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
          <User className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h4 className="font-bold text-foreground">{coord.name}</h4>
          <p className="text-xs text-primary">{coord.role}</p>
        </div>
      </div>
      <div className="space-y-2">
        <a href={`tel:${coord.phone}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm">
          <Phone className="w-4 h-4" />
          <span>{coord.phone}</span>
        </a>
        <a href={`mailto:${coord.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm">
          <Mail className="w-4 h-4" />
          <span>{coord.email}</span>
        </a>
      </div>
    </div>
  );
}

export default function Coordinators() {
  const { data: coordContent } = useGetCoordinatorsContent();
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const faculty = coordContent?.facultyCoordinators?.length ? coordContent.facultyCoordinators : defaultFaculty;
  const students = coordContent?.studentCoordinators?.length ? coordContent.studentCoordinators : defaultStudents;
  const allCoords = [...faculty, ...students];

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
  }, [coordContent]);

  return (
    <section id="coordinators" className="py-20 px-4 bg-card/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Coordinators</h2>
          <p className="text-muted-foreground text-lg">Meet the team behind Innovative Link Expo</p>
        </div>

        {faculty.length > 0 && (
          <div className="mb-10">
            <h3 className="text-xl font-semibold text-primary mb-6 text-center">Faculty Coordinators</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {faculty.map((coord, i) => (
                <div
                  key={i}
                  data-index={i}
                  ref={(el) => { cardRefs.current[i] = el; }}
                >
                  <CoordinatorCard coord={coord} index={i} visible={visibleCards.has(i)} />
                </div>
              ))}
            </div>
          </div>
        )}

        {students.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-primary mb-6 text-center">Student Coordinators</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {students.map((coord, i) => {
                const globalIndex = faculty.length + i;
                return (
                  <div
                    key={i}
                    data-index={globalIndex}
                    ref={(el) => { cardRefs.current[globalIndex] = el; }}
                  >
                    <CoordinatorCard coord={coord} index={globalIndex} visible={visibleCards.has(globalIndex)} />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
