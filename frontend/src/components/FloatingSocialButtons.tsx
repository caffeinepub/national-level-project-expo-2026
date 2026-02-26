import { useState } from 'react';
import { SiWhatsapp, SiInstagram } from 'react-icons/si';

const WHATSAPP_URL = 'https://chat.whatsapp.com/H6H4HMb31XzKw0ziktZSkg';
const INSTAGRAM_URL = 'https://www.instagram.com/innovativelink_expo_2k26?igsh=MTBvbTMzMXJzbWdtMg==';

interface SocialButtonProps {
  href: string;
  label: string;
  icon: React.ElementType;
  bgClass: string;
  shadowClass: string;
}

function SocialButton({ href, label, icon: Icon, bgClass, shadowClass }: SocialButtonProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative flex items-center justify-end">
      {/* Tooltip */}
      <span
        className={`absolute right-14 whitespace-nowrap text-xs font-semibold text-white bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-lg pointer-events-none transition-all duration-200 ${
          hovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
        }`}
      >
        {label}
      </span>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-300 ${bgClass} ${
          hovered ? `scale-110 ${shadowClass}` : 'scale-100 shadow-lg shadow-black/30'
        }`}
      >
        <Icon className="w-5 h-5" />
      </a>
    </div>
  );
}

export default function FloatingSocialButtons() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <SocialButton
        href={INSTAGRAM_URL}
        label="Follow on Instagram"
        icon={SiInstagram}
        bgClass="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400"
        shadowClass="shadow-xl shadow-pink-500/50"
      />
      <SocialButton
        href={WHATSAPP_URL}
        label="Chat on WhatsApp"
        icon={SiWhatsapp}
        bgClass="bg-gradient-to-br from-[#0f9d58] to-[#22c55e]"
        shadowClass="shadow-xl shadow-green-500/50"
      />
    </div>
  );
}
