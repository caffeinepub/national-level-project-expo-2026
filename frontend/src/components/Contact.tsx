import { MapPin, Phone, Mail, Globe, MessageCircle, Instagram } from 'lucide-react';
import { SiFacebook, SiInstagram, SiLinkedin, SiYoutube } from 'react-icons/si';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useGetContactContent } from '../hooks/useQueries';

const socialLinks = [
  { icon: SiFacebook, href: 'https://facebook.com', label: 'Facebook', color: 'hover:text-blue-400' },
  { icon: SiInstagram, href: 'https://www.instagram.com/innovativelink_expo_2k26?igsh=MTBvbTMzMXJzbWdtMg==', label: 'Instagram', color: 'hover:text-pink-400' },
  { icon: SiLinkedin, href: 'https://linkedin.com', label: 'LinkedIn', color: 'hover:text-blue-500' },
  { icon: SiYoutube, href: 'https://youtube.com', label: 'YouTube', color: 'hover:text-red-400' },
];

const DEFAULT_CONTACT = {
  addressLine1: 'E.G.S. Pillay Engineering College',
  addressLine2: 'Redhills, Nagapattinam – 611 002\nTamil Nadu, India',
  phone: '+91 4365 220000',
  email: 'expo2026@egspillay.ac.in',
  website: 'www.egspillay.ac.in',
};

const WHATSAPP_URL = 'https://chat.whatsapp.com/H6H4HMb31XzKw0ziktZSkg';
const INSTAGRAM_URL = 'https://www.instagram.com/innovativelink_expo_2k26?igsh=MTBvbTMzMXJzbWdtMg==';

export default function Contact() {
  const { ref: headingRef, isVisible: headingVisible } = useScrollAnimation({ threshold: 0.3 });
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: connectRef, isVisible: connectVisible } = useScrollAnimation({ threshold: 0.2 });
  const { data: contactContent } = useGetContactContent();

  const addressLine1 = contactContent?.addressLine1 || DEFAULT_CONTACT.addressLine1;
  const addressLine2 = contactContent?.addressLine2 || DEFAULT_CONTACT.addressLine2;
  const phone = contactContent?.phone || DEFAULT_CONTACT.phone;
  const email = contactContent?.email || DEFAULT_CONTACT.email;
  const website = contactContent?.website || DEFAULT_CONTACT.website;

  const websiteHref = website.startsWith('http') ? website : `https://${website}`;
  const phoneHref = `tel:${phone.replace(/\s/g, '')}`;

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
                    <p className="text-white font-semibold text-sm">{addressLine1}</p>
                    <p className="text-white/50 text-sm leading-relaxed whitespace-pre-line">
                      {addressLine2}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-expo-green-start/20 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-expo-green-end" />
                  </div>
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider mb-0.5">Phone</p>
                    <a href={phoneHref} className="text-white text-sm hover:text-expo-green-end transition-colors">
                      {phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-expo-green-start/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-expo-green-end" />
                  </div>
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider mb-0.5">Email</p>
                    <a href={`mailto:${email}`} className="text-white text-sm hover:text-expo-green-end transition-colors">
                      {email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-expo-green-start/20 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-4 h-4 text-expo-green-end" />
                  </div>
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider mb-0.5">Website</p>
                    <a href={websiteHref} target="_blank" rel="noopener noreferrer" className="text-white text-sm hover:text-expo-green-end transition-colors">
                      {website}
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
                    className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 ${color} hover:border-white/20 hover:bg-white/10 transition-all duration-300`}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Map Embed */}
          <div className="glass-card rounded-2xl overflow-hidden border border-white/10 min-h-[300px]">
            <iframe
              title="College Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.5!2d79.8!3d10.77!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ2JzEyLjAiTiA3OcKwNDgnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '300px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-500"
            />
          </div>
        </div>

        {/* Connect With Us */}
        <div
          ref={connectRef as React.RefObject<HTMLDivElement>}
          className={`mt-8 transition-all duration-700 delay-200 ${
            connectVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="glass-card rounded-2xl p-6 sm:p-8 border border-expo-green-start/20 bg-gradient-to-br from-expo-green-start/5 to-expo-green-end/5">
            <div className="text-center mb-6">
              <h3 className="text-white font-bold text-xl mb-2">Connect With Us</h3>
              <p className="text-white/50 text-sm">
                Reach out directly via WhatsApp or follow us on Instagram for the latest updates.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {/* WhatsApp Button */}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#0f9d58] to-[#22c55e] text-white font-semibold text-sm shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/40 hover:scale-[1.03] transition-all duration-300 w-full sm:w-auto justify-center"
              >
                <MessageCircle className="w-5 h-5 flex-shrink-0" />
                Chat on WhatsApp
              </a>

              {/* Instagram Button */}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white font-semibold text-sm shadow-lg shadow-pink-500/20 hover:shadow-xl hover:shadow-pink-500/40 hover:scale-[1.03] transition-all duration-300 w-full sm:w-auto justify-center"
              >
                <Instagram className="w-5 h-5 flex-shrink-0" />
                Follow on Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
