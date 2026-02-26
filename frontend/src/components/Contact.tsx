import { useRef, useEffect, useState } from 'react';
import { useGetContactContent } from '../hooks/useQueries';
import { MapPin, Phone, Mail, Globe, Zap } from 'lucide-react';
import { SiWhatsapp, SiInstagram } from 'react-icons/si';

const WHATSAPP_URL = 'https://chat.whatsapp.com/H6H4HMb31XzKw0ziktZSkg';
const INSTAGRAM_URL = 'https://www.instagram.com/innovativelink_expo_2k26?igsh=MTBvbTMzMXJzbWdtMg==';

const defaultContent = {
  addressLine1: 'Department of IoT Engineering',
  addressLine2: 'College Campus, City - 600001',
  phone: '+91 98765 43210',
  email: 'iotexpo2026@college.edu',
  website: 'www.iotexpo2026.college.edu',
};

function AnimatedCard({
  children,
  index,
  className = '',
  style,
}: {
  children: React.ReactNode;
  index: number;
  className?: string;
  style?: React.CSSProperties;
}) {
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
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.6s ease, transform 0.6s ease`,
        transitionDelay: `${index * 120}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default function Contact() {
  const { data: contactContent } = useGetContactContent();
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

  const content = contactContent || defaultContent;

  const contactItems = [
    { icon: <MapPin className="w-5 h-5" />, label: 'Address', value: `${content.addressLine1}, ${content.addressLine2}` },
    { icon: <Phone className="w-5 h-5" />, label: 'Phone', value: content.phone, href: `tel:${content.phone}` },
    { icon: <Mail className="w-5 h-5" />, label: 'Email', value: content.email, href: `mailto:${content.email}` },
    { icon: <Globe className="w-5 h-5" />, label: 'Website', value: content.website, href: `https://${content.website}` },
  ];

  return (
    <section
      id="contact"
      className="relative py-20 md:py-28 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #050f0a 0%, #071a10 50%, #050f0a 100%)' }}
    >
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="drift-orb-2 absolute top-[20%] right-[5%] w-72 h-72 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #0f9d58, transparent 70%)', filter: 'blur(50px)' }}
        />
        <div
          className="drift-orb-1 absolute bottom-[15%] left-[8%] w-56 h-56 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #22c55e, transparent 70%)', filter: 'blur(40px)' }}
        />
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
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
            style={{
              background: 'rgba(15,157,88,0.1)',
              border: '1px solid rgba(15,157,88,0.3)',
              color: '#22c55e',
            }}
          >
            <Zap className="w-3 h-3" />
            Get in Touch
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-5">
            <span className="gradient-text">Contact Us</span>
          </h2>
          <p className="text-white/60 max-w-xl mx-auto text-base md:text-lg">
            Have questions? We're here to help. Reach out to us through any of the channels below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-4">
            {contactItems.map((item, i) => (
              <AnimatedCard key={i} index={i} className="glass-card glass-card-hover rounded-2xl p-5">
                <div className="flex items-center gap-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, rgba(15,157,88,0.2), rgba(34,197,94,0.1))',
                      border: '1px solid rgba(15,157,88,0.3)',
                      color: '#22c55e',
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: '#22c55e' }}>
                      {item.label}
                    </p>
                    {item.href ? (
                      <a href={item.href} className="text-white/80 hover:text-white text-sm transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-white/80 text-sm">{item.value}</p>
                    )}
                  </div>
                </div>
              </AnimatedCard>
            ))}

            {/* Social CTA */}
            <AnimatedCard
              index={4}
              className="glass-card rounded-2xl p-6"
              style={{ border: '1px solid rgba(15,157,88,0.2)' }}
            >
              <h3 className="text-white font-bold text-base mb-4">Connect With Us</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-full font-semibold text-sm text-white transition-all hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #128C7E, #25D366)',
                    boxShadow: '0 0 20px rgba(37,211,102,0.3)',
                  }}
                >
                  <SiWhatsapp className="w-4 h-4" />
                  WhatsApp Community
                </a>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-full font-semibold text-sm text-white transition-all hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #833AB4, #FD1D1D, #F77737)',
                    boxShadow: '0 0 20px rgba(253,29,29,0.3)',
                  }}
                >
                  <SiInstagram className="w-4 h-4" />
                  Follow on Instagram
                </a>
              </div>
            </AnimatedCard>
          </div>

          {/* Map + Social Icons */}
          <div className="space-y-5">
            <AnimatedCard
              index={0}
              className="glass-card rounded-2xl overflow-hidden"
              style={{ border: '1px solid rgba(15,157,88,0.2)' }}
            >
              <div className="h-64 md:h-80 lg:h-96">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.0!2d80.2!3d13.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDAwJzAwLjAiTiA4MMKwMTInMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Event Location"
                  className="grayscale opacity-80"
                />
              </div>
            </AnimatedCard>

            {/* Follow Us */}
            <AnimatedCard
              index={1}
              className="glass-card rounded-2xl p-6"
              style={{ border: '1px solid rgba(15,157,88,0.2)' }}
            >
              <h3 className="text-white font-bold text-base mb-4">Follow Us</h3>
              <div className="flex gap-3">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white transition-all hover:scale-110"
                  style={{
                    background: 'rgba(37,211,102,0.15)',
                    border: '1px solid rgba(37,211,102,0.3)',
                    boxShadow: '0 0 15px rgba(37,211,102,0.2)',
                  }}
                >
                  <SiWhatsapp className="w-5 h-5" style={{ color: '#25D366' }} />
                </a>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white transition-all hover:scale-110"
                  style={{
                    background: 'rgba(253,29,29,0.15)',
                    border: '1px solid rgba(253,29,29,0.3)',
                    boxShadow: '0 0 15px rgba(253,29,29,0.2)',
                  }}
                >
                  <SiInstagram className="w-5 h-5" style={{ color: '#FD1D1D' }} />
                </a>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </div>
    </section>
  );
}
