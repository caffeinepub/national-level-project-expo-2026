import { Phone, Mail } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useGetCoordinatorsContent } from '../hooks/useQueries';

const DEFAULT_FACULTY = [
  { name: 'Dr. R. Senthilkumar', role: 'Head of Department, ECE', phone: '+91 98765 43210', email: 'hod.ece@egspillay.ac.in' },
  { name: 'Prof. S. Meenakshi', role: 'Associate Professor, ECE', phone: '+91 98765 43211', email: 'meenakshi.ece@egspillay.ac.in' },
  { name: 'Dr. K. Vijayakumar', role: 'Assistant Professor, ECE', phone: '+91 98765 43212', email: 'vijay.ece@egspillay.ac.in' },
];

const DEFAULT_STUDENTS = [
  { name: 'AKASH A', role: 'Student Coordinator', phone: '8667099605', email: 'athiakash1977@gmail.com' },
  { name: 'KEERTHIVASAN R', role: 'Student Coordinator', phone: '9597245927', email: 'skeerthivasan410@gmail.com' },
  { name: 'AKASH P', role: 'Student Coordinator', phone: '', email: 'akashpece' },
];

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

interface CoordinatorCardProps {
  name: string;
  role: string;
  phone: string;
  email: string;
  delay: number;
}

function CoordinatorCard({ name, role, phone, email, delay }: CoordinatorCardProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const initials = getInitials(name);

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`glass-card rounded-2xl p-6 border border-white/10 hover:border-expo-green-start/50 hover:shadow-xl hover:shadow-expo-green-start/20 transition-all duration-500 hover:-translate-y-2 group ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms`, transition: 'all 0.6s ease' }}
    >
      <div className="flex flex-col items-center text-center">
        <Avatar className="w-20 h-20 mb-4 ring-2 ring-expo-green-start/30 group-hover:ring-expo-green-start/60 transition-all duration-300">
          <AvatarFallback className="bg-gradient-to-br from-expo-green-start to-expo-green-end text-white text-xl font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <h4 className="text-white font-bold text-base mb-1">{name}</h4>
        <p className="text-expo-green-end text-xs font-medium mb-4 uppercase tracking-wide">{role}</p>
        <div className="w-full space-y-2">
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-2 text-white/50 hover:text-expo-green-end transition-colors text-sm group/link"
            >
              <Phone className="w-3.5 h-3.5 flex-shrink-0 group-hover/link:text-expo-green-end" />
              <span className="truncate">{phone}</span>
            </a>
          )}
          <a
            href={email.includes('@') ? `mailto:${email}` : undefined}
            className="flex items-center gap-2 text-white/50 hover:text-expo-green-end transition-colors text-sm group/link"
          >
            <Mail className="w-3.5 h-3.5 flex-shrink-0 group-hover/link:text-expo-green-end" />
            <span className="truncate text-xs">{email}</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Coordinators() {
  const { ref: headingRef, isVisible: headingVisible } = useScrollAnimation({ threshold: 0.3 });
  const { data: coordinatorsContent } = useGetCoordinatorsContent();

  const facultyCoordinators =
    coordinatorsContent?.facultyCoordinators && coordinatorsContent.facultyCoordinators.length > 0
      ? coordinatorsContent.facultyCoordinators
      : DEFAULT_FACULTY;

  const studentCoordinators =
    coordinatorsContent?.studentCoordinators && coordinatorsContent.studentCoordinators.length > 0
      ? coordinatorsContent.studentCoordinators
      : DEFAULT_STUDENTS;

  return (
    <section id="coordinators" className="py-24 bg-expo-dark relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-expo-green-start/30 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(34,197,94,0.05),transparent_60%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          ref={headingRef as React.RefObject<HTMLDivElement>}
          className={`text-center mb-16 transition-all duration-700 ${
            headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold text-expo-green-end border border-expo-green-start/40 bg-expo-green-start/10 mb-4 uppercase tracking-widest">
            Meet the Team
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
            Our{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-expo-green-start to-expo-green-end">
              Coordinators
            </span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-sm sm:text-base">
            Reach out to our dedicated team for any queries regarding the event.
          </p>
        </div>

        {/* Faculty Coordinators */}
        <div className="mb-12">
          <h3 className="text-lg font-bold text-white/70 uppercase tracking-widest mb-6 flex items-center gap-3">
            <span className="w-8 h-px bg-expo-green-start" />
            Faculty Coordinators
            <span className="flex-1 h-px bg-white/10" />
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {facultyCoordinators.map((coord, i) => (
              <CoordinatorCard key={coord.name + i} {...coord} delay={i * 100} />
            ))}
          </div>
        </div>

        {/* Student Coordinators */}
        <div>
          <h3 className="text-lg font-bold text-white/70 uppercase tracking-widest mb-6 flex items-center gap-3">
            <span className="w-8 h-px bg-expo-green-start" />
            Student Coordinators
            <span className="flex-1 h-px bg-white/10" />
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {studentCoordinators.map((coord, i) => (
              <CoordinatorCard key={coord.name + i} {...coord} delay={i * 100} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
