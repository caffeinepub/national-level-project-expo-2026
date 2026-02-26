import { useState, useRef, useEffect } from 'react';
import { useSubmitRegistration } from '../hooks/useQueries';
import { ExternalLink, ChevronDown, ChevronUp, QrCode, Zap, CheckCircle, X } from 'lucide-react';

const GOOGLE_FORM_URL = 'https://forms.gle/CXHMtehDUjb8D11DA';
const UPI_ID = 'athiakash1977@oksbi';

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  collegeName: string;
  department: string;
  projectTitle: string;
  category: string;
  abstract: string;
}

const categories = [
  'Smart Home', 'Healthcare IoT', 'Industrial IoT',
  'Agriculture Tech', 'Smart City', 'Wearable Tech', 'Other',
];

function SuccessModal({ onClose, registrationId }: { onClose: () => void; registrationId: bigint }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
      <div className="glass-card rounded-2xl p-8 max-w-md w-full text-center relative"
        style={{ border: '1px solid rgba(15,157,88,0.4)', boxShadow: '0 0 60px rgba(15,157,88,0.3)' }}>
        <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background: 'linear-gradient(135deg, #0f9d58, #22c55e)', boxShadow: '0 0 30px rgba(15,157,88,0.5)' }}>
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Registration Successful!</h3>
        <p className="text-white/60 mb-4">
          Your registration ID is{' '}
          <span className="font-bold" style={{ color: '#22c55e' }}>#{registrationId.toString()}</span>
        </p>
        <p className="text-white/50 text-sm mb-6">
          Please complete the payment to confirm your spot. Keep your registration ID safe.
        </p>
        <button
          onClick={onClose}
          className="w-full py-3 rounded-full font-semibold text-white transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #0f9d58, #22c55e)' }}
        >
          Done
        </button>
      </div>
    </div>
  );
}

export default function Registration() {
  const [showForm, setShowForm] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  const [successId, setSuccessId] = useState<bigint | null>(null);
  const [formData, setFormData] = useState<FormData>({
    fullName: '', email: '', phoneNumber: '', collegeName: '',
    department: '', projectTitle: '', category: '', abstract: '',
  });
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const submitMutation = useSubmitRegistration();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(el); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const id = await submitMutation.mutateAsync(formData);
      setSuccessId(id);
      setFormData({ fullName: '', email: '', phoneNumber: '', collegeName: '', department: '', projectTitle: '', category: '', abstract: '' });
      setShowForm(false);
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all focus:ring-2 placeholder-white/30";
  const inputStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
  };

  return (
    <section
      id="registration"
      className="relative py-20 md:py-28 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #071a10 0%, #0a2015 50%, #071a10 100%)' }}
    >
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="drift-orb-1 absolute top-[10%] right-[5%] w-72 h-72 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #0f9d58, transparent 70%)', filter: 'blur(50px)' }} />
        <div className="drift-orb-2 absolute bottom-[10%] left-[5%] w-56 h-56 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #22c55e, transparent 70%)', filter: 'blur(40px)' }} />
      </div>

      <div
        ref={sectionRef}
        className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}
      >
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
            style={{
              background: 'rgba(15,157,88,0.1)',
              border: '1px solid rgba(15,157,88,0.3)',
              color: '#22c55e',
            }}>
            <Zap className="w-3 h-3" />
            Join the Expo
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-5">
            <span className="gradient-text">Register Now</span>
          </h2>
          <p className="text-white/60 max-w-xl mx-auto text-base md:text-lg">
            Secure your spot at the National Level Project Expo 2026. Limited seats available!
          </p>
        </div>

        {/* Google Form CTA */}
        <div className="glass-card rounded-2xl p-6 md:p-8 mb-6"
          style={{ border: '1px solid rgba(15,157,88,0.2)' }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-white font-bold text-lg mb-1">Quick Registration</h3>
              <p className="text-white/50 text-sm">Use our Google Form for the fastest registration experience.</p>
            </div>
            <a
              href={GOOGLE_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white text-sm transition-all hover:scale-105 flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #0f9d58, #22c55e)',
                boxShadow: '0 0 20px rgba(15,157,88,0.4)',
              }}
            >
              <ExternalLink className="w-4 h-4" />
              Open Form
            </a>
          </div>
          <button
            onClick={() => setShowIframe(!showIframe)}
            className="flex items-center gap-2 text-sm transition-colors hover:text-white"
            style={{ color: '#22c55e' }}
          >
            {showIframe ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showIframe ? 'Hide embedded form' : 'Show embedded form'}
          </button>
          {showIframe && (
            <div className="mt-4 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(15,157,88,0.2)' }}>
              <iframe
                src={GOOGLE_FORM_URL}
                width="100%"
                height="600"
                frameBorder="0"
                marginHeight={0}
                marginWidth={0}
                title="Registration Form"
                className="block"
              >
                Loading…
              </iframe>
            </div>
          )}
        </div>

        {/* UPI Payment */}
        <div className="glass-card rounded-2xl p-6 md:p-8 mb-6"
          style={{ border: '1px solid rgba(15,157,88,0.2)' }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(15,157,88,0.15)', border: '1px solid rgba(15,157,88,0.3)', color: '#22c55e' }}>
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Payment Details</h3>
              <p className="text-white/50 text-sm">Pay via UPI to confirm your registration</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img
              src="/assets/generated/upi-qr-code.dim_300x300.png"
              alt="UPI QR Code"
              className="w-36 h-36 rounded-xl object-cover flex-shrink-0"
              style={{ border: '1px solid rgba(15,157,88,0.3)' }}
            />
            <div>
              <p className="text-white/60 text-sm mb-2">UPI ID:</p>
              <p className="text-white font-bold text-lg mb-3">{UPI_ID}</p>
              <p className="text-white/50 text-xs leading-relaxed">
                Scan the QR code or use the UPI ID above to complete your payment. 
                Send a screenshot of the payment confirmation to the coordinators.
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
          <span className="text-white/40 text-sm font-medium">OR</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
        </div>

        {/* Backend Form Toggle */}
        <div className="text-center">
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all hover:scale-105"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'white',
            }}
          >
            {showForm ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showForm ? 'Hide' : 'Use'} Direct Registration Form
          </button>
        </div>

        {/* Backend Registration Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 md:p-8 mt-6 space-y-4"
            style={{ border: '1px solid rgba(15,157,88,0.2)' }}>
            <h3 className="text-white font-bold text-xl mb-6">Direct Registration</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: '#22c55e' }}>Full Name *</label>
                <input name="fullName" value={formData.fullName} onChange={handleChange} required
                  placeholder="Your full name" className={inputClass} style={inputStyle} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: '#22c55e' }}>Email *</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange} required
                  placeholder="your@email.com" className={inputClass} style={inputStyle} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: '#22c55e' }}>Phone Number *</label>
                <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required
                  placeholder="+91 XXXXX XXXXX" className={inputClass} style={inputStyle} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: '#22c55e' }}>College Name *</label>
                <input name="collegeName" value={formData.collegeName} onChange={handleChange} required
                  placeholder="Your college" className={inputClass} style={inputStyle} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: '#22c55e' }}>Department *</label>
                <input name="department" value={formData.department} onChange={handleChange} required
                  placeholder="e.g. IoT Engineering" className={inputClass} style={inputStyle} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: '#22c55e' }}>Project Title *</label>
                <input name="projectTitle" value={formData.projectTitle} onChange={handleChange} required
                  placeholder="Your project title" className={inputClass} style={inputStyle} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: '#22c55e' }}>Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} required
                className={inputClass} style={inputStyle}>
                <option value="" disabled>Select a category</option>
                {categories.map(c => <option key={c} value={c} style={{ background: '#071a10' }}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: '#22c55e' }}>Abstract *</label>
              <textarea name="abstract" value={formData.abstract} onChange={handleChange} required rows={4}
                placeholder="Brief description of your project..." className={inputClass} style={inputStyle} />
            </div>
            <button
              type="submit"
              disabled={submitMutation.isPending}
              className="w-full py-4 rounded-full font-bold text-white text-base transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #0f9d58, #22c55e)',
                boxShadow: submitMutation.isPending ? 'none' : '0 0 30px rgba(15,157,88,0.5)',
              }}
            >
              {submitMutation.isPending ? 'Submitting...' : 'Submit Registration'}
            </button>
            {submitMutation.isError && (
              <p className="text-red-400 text-sm text-center">Registration failed. Please try again.</p>
            )}
          </form>
        )}
      </div>

      {successId !== null && (
        <SuccessModal onClose={() => setSuccessId(null)} registrationId={successId} />
      )}
    </section>
  );
}
