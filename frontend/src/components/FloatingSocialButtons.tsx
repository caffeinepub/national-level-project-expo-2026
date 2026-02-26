import { SiWhatsapp, SiInstagram } from 'react-icons/si';

const WHATSAPP_URL = 'https://chat.whatsapp.com/H6H4HMb31XzKw0ziktZSkg';
const INSTAGRAM_URL = 'https://www.instagram.com/innovativelink_expo_2k26?igsh=MTBvbTMzMXJzbWdtMg==';

export default function FloatingSocialButtons() {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
        style={{
          background: 'linear-gradient(135deg, #128C7E, #25D366)',
          boxShadow: '0 0 20px rgba(37,211,102,0.4)',
        }}
        aria-label="Join WhatsApp Community"
      >
        <SiWhatsapp className="w-5 h-5" />
        <span className="absolute right-14 bg-black/80 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{ backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)' }}>
          WhatsApp Community
        </span>
      </a>
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
        style={{
          background: 'linear-gradient(135deg, #833AB4, #FD1D1D, #F77737)',
          boxShadow: '0 0 20px rgba(253,29,29,0.3)',
        }}
        aria-label="Follow on Instagram"
      >
        <SiInstagram className="w-5 h-5" />
        <span className="absolute right-14 bg-black/80 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{ backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)' }}>
          Follow on Instagram
        </span>
      </a>
    </div>
  );
}
