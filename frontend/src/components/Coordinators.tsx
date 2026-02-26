import { useRef, useEffect, useState } from 'react';
import { useGetCoordinatorsContent } from '../hooks/useQueries';
import { Phone, Mail, User, GraduationCap, Zap } from 'lucide-react';

interface Coordinator {
  name: string;
  role: string;
  phone: string;
  email: string;
}

const defaultContent = {
  facultyCoordinators: [
    { name: 'Dr. Faculty Name', role: 'Head of Department', phone: '+91 98765 43210', email: 'faculty@college.edu' },
    { name: 'Prof. Faculty Name', role: 'Associate Professor', phone: '+91 98765 43211', email: 'faculty2@college.edu' },
  ],
  studentCoordinators: [
    { name: 'Student Name 1', role: 'Event Lead', phone: '+91 98765 43212', email: 'student1@college.edu' },
    { name: 'Student Name 2', role: 'Technical Lead', phone: '+91 98765 43213', email: 'student2@college.edu' },
    { name: 'Student Name 3', role: 'Logistics Lead', phone: '+91 98765 43214', email: 'student3@college.edu' },
  ],
};

function CoordinatorCard({ coordinator, index, isFaculty }: { coordinator: Coordinator; index: number; isFaculty: boolean }) {
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
      className="coordinator-card-shimmer glass-card glass-card-hover rounded-2xl p-6"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
        transition: `opacity 0.6s ease, transform 0.6s ease`,
        transitionDelay: `${index * 100}ms`,
      }}
    >
      {/* Avatar */}
      <div className="flex items-center gap-4 mb-5">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #0f9d58, #22c55e)',
            boxShadow: '0 0 20px rgba(15,157,88,0.4)',
          }}
        >
          {isFaculty
            ? <GraduationCap className="w-7 h-7 text-white" />
            : <User className="w-7 h-7 text-white" />
          }
        </div>
        <div>
          <h4 className="text-white font-bold text-base">{coordinator.name}</h4>
          <p className="text-xs font-medium mt-0.5" style={{ color: '#22c55e' }}>{coordinator.role}</p>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-2.5">
        <a
          href={`tel:${coordinator.phone}`}
          className="flex items-center gap-3 text-white/60 hover:text-white transition-all duration-200 group"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-110"
            style={{ background: 'rgba(15,157,88,0.1)', border: '1px solid rgba(15,157,88,0.2)' }}>
            <Phone className="w-3.5 h-3.5" style={{ color: '#22c55e' }} />
          </div>
          <span className="text-sm">{coordinator.phone}</span>
        </a>
        <a
          href={`mailto:${coordinator.email}`}
          className="flex items-center gap-3 text-white/60 hover:text-white transition-all duration-200 group"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-110"
            style={{ background: 'rgba(15,157,88,0.1)', border: '1px solid rgba(15,157,88,0.2)' }}>
            <Mail className="w-3.5 h-3.5" style={{ color: '#22c55e' }} />
          </div>
          <span className="text-sm truncate">{coordinator.email}</span>
        </a>
      </div>
    </div>
  );
}

export default function Coordinators() {
  const { data: coordinatorsContent } = useGetCoordinatorsContent();
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

  const content = coordinatorsContent || defaultContent;

  return (
    <section
      id="coordinators"
      className="relative py-20 md:py-28 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #050f0a 0%, #071a10 50%, #050f0a 100%)' }}
    >
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="drift-orb-1 absolute top-[15%] right-[10%] w-72 h-72 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #0f9d58, transparent 70%)', filter: 'blur(50px)' }} />
        <div className="drift-orb-3 absolute bottom-[20%] left-[8%] w-56 h-56 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #22c55e, transparent 70%)', filter: 'blur(40px)' }} />
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
            Meet the Team
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-5">
            <span className="gradient-text">Our Coordinators</span>
          </h2>
          <p className="text-white/60 max-w-xl mx-auto text-base md:text-lg">
            Meet the dedicated team behind the National Level Project Expo 2026.
          </p>
        </div>

        {/* Faculty Coordinators */}
        {content.facultyCoordinators.length > 0 && (
          <div className="mb-12">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2"
              style={{ color: '#22c55e' }}>
              <GraduationCap className="w-5 h-5" />
              Faculty Coordinators
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {content.facultyCoordinators.map((coord, i) => (
                <CoordinatorCard key={i} coordinator={coord} index={i} isFaculty={true} />
              ))}
            </div>
          </div>
        )}

        {/* Student Coordinators */}
        {content.studentCoordinators.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2"
              style={{ color: '#22c55e' }}>
              <User className="w-5 h-5" />
              Student Coordinators
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {content.studentCoordinators.map((coord, i) => (
                <CoordinatorCard key={i} coordinator={coord} index={i} isFaculty={false} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
