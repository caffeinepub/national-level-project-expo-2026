import { MapPin, Phone, Mail, Globe } from 'lucide-react';
import { SiFacebook, SiInstagram, SiLinkedin, SiYoutube } from 'react-icons/si';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const socialLinks = [
  { icon: SiFacebook, href: 'https://facebook.com', label: 'Facebook', color: 'hover:text-blue-400' },
  { icon: SiInstagram, href: 'https://instagram.com', label: 'Instagram', color: 'hover:text-pink-400' },
  { icon: SiLinkedin, href: 'https://linkedin.com', label: 'LinkedIn', color: 'hover:text-blue-500' },
  { icon: SiYoutube, href: 'https://youtube.com', label: 'YouTube', color: 'hover:text-red-400' },
];

export default function Contact() {
  const { ref: headingRef, isVisible: headingVisible } = useScrollAnimation({ threshold: 0.3 });
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section id="contact" className="py-24 bg-expo-dark relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-expo-green-start/30 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(15,157,88,0.05),transparent_60%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          ref={headingRef as React.RefObject<HTMLDivElement>}
          className={`text-center mb-16 transition-all duration-700 ${
            headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold text-expo-green-end border border-expo-green-start/40 bg-expo-green-start/10 mb-4 uppercase tracking-widest">
            Get in Touch
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
            Contact{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-expo-green-start to-expo-green-end">
              Us
            </span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-sm sm:text-base">
            Have questions? Reach out to us and we'll get back to you as soon as possible.
          </p>
        </div>

        <div
          ref={contentRef as React.RefObject<HTMLDivElement>}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 transition-all duration-700 ${
            contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6 border border-white/10">
              <h3 className="text-white font-bold text-lg mb-5">College Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-expo-green-start/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-expo-green-end" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">E.G.S. Pillay Engineering College</p>
                    <p className="text-white/50 text-sm leading-relaxed">
                      Redhills, Nagapattinam – 611 002<br />
                      Tamil Nadu, India
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-expo-green-start/20 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-expo-green-end" />
                  </div>
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider mb-0.5">Phone</p>
                    <a href="tel:+914365220000" className="text-white text-sm hover:text-expo-green-end transition-colors">
                      +91 4365 220000
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-expo-green-start/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-expo-green-end" />
                  </div>
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider mb-0.5">Email</p>
                    <a href="mailto:expo2026@egspillay.ac.in" className="text-white text-sm hover:text-expo-green-end transition-colors">
                      expo2026@egspillay.ac.in
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-expo-green-start/20 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-4 h-4 text-expo-green-end" />
                  </div>
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider mb-0.5">Website</p>
                    <a href="https://www.egspillay.ac.in" target="_blank" rel="noopener noreferrer" className="text-white text-sm hover:text-expo-green-end transition-colors">
                      www.egspillay.ac.in
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="glass-card rounded-2xl p-6 border border-white/10">
              <h3 className="text-white font-bold text-lg mb-4">Follow Us</h3>
              <div className="flex gap-4">
                {socialLinks.map(({ icon: Icon, href, label, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 ${color} hover:border-expo-green-start/40 hover:bg-expo-green-start/10 transition-all duration-300 hover:scale-110`}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
            <div className="relative w-full h-full min-h-[350px] bg-expo-darker">
              {/* Static map placeholder */}
              <iframe
                title="E.G.S. Pillay Engineering College Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.0!2d79.8!3d10.77!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ2JzEyLjAiTiA3OcKwNDgnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                className="absolute inset-0 w-full h-full grayscale opacity-70"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(120deg) saturate(0.5)' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute inset-0 pointer-events-none border border-expo-green-start/20 rounded-2xl" />
              <div className="absolute bottom-4 left-4 glass-card px-3 py-2 rounded-lg border border-expo-green-start/30 pointer-events-none">
                <p className="text-white text-xs font-semibold">E.G.S. Pillay Engineering College</p>
                <p className="text-white/50 text-xs">Nagapattinam, Tamil Nadu</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
