import { useState } from 'react';
import { Search, Loader2, CheckCircle2, AlertCircle, User, Mail, Phone, Building2, BookOpen, Lightbulb, Tag, FileText, Hash } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingSocialButtons from '../components/FloatingSocialButtons';
import { useGetRegistrationByEmail } from '../hooks/useQueries';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

function DetailRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-expo-green-start/15 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-expo-green-end" />
      </div>
      <div className="min-w-0">
        <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-white text-sm font-medium break-words">{value}</p>
      </div>
    </div>
  );
}

export default function RegistrationLookupPage() {
  const [emailInput, setEmailInput] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [validationError, setValidationError] = useState('');

  const { ref: headingRef, isVisible: headingVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: formRef, isVisible: formVisible } = useScrollAnimation({ threshold: 0.1 });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const { data: registration, isLoading, isFetched } = useGetRegistrationByEmail(submittedEmail);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!emailInput.trim()) {
      setValidationError('Email address is required.');
      return;
    }
    if (!emailRegex.test(emailInput.trim())) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    setSubmittedEmail(emailInput.trim());
  };

  const hasSearched = submittedEmail.length > 0 && isFetched;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-expo-darker pt-16">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-expo-green-start/5 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-expo-green-end/5 blur-3xl" />
        </div>

        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Header */}
          <div
            ref={headingRef as React.RefObject<HTMLDivElement>}
            className={`text-center mb-12 transition-all duration-700 ${
              headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold text-expo-green-end border border-expo-green-start/40 bg-expo-green-start/10 mb-4 uppercase tracking-widest">
              Registration Portal
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
              Check Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-expo-green-start to-expo-green-end">
                Registration
              </span>
            </h1>
            <p className="text-white/50 text-sm sm:text-base max-w-md mx-auto">
              Enter your registered email address to view your team's registration details for Project Expo 2026.
            </p>
          </div>

          {/* Search Form */}
          <div
            ref={formRef as React.RefObject<HTMLDivElement>}
            className={`transition-all duration-700 delay-150 ${
              formVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 mb-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="lookup-email" className="text-white/80 text-sm font-medium">
                    Registered Email Address <span className="text-red-400">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                    <Input
                      id="lookup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={emailInput}
                      onChange={(e) => {
                        setEmailInput(e.target.value);
                        if (validationError) setValidationError('');
                      }}
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-expo-green-start/60 focus:ring-expo-green-start/20"
                    />
                  </div>
                  {validationError && (
                    <p className="text-red-400 text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {validationError}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-5 text-base font-bold bg-gradient-to-r from-expo-green-start to-expo-green-end hover:shadow-lg hover:shadow-expo-green-start/40 hover:scale-[1.02] transition-all duration-300 text-white border-0 rounded-xl"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Find Registration
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="glass-card rounded-2xl p-8 border border-white/10 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-expo-green-end animate-spin" />
                <p className="text-white/60 text-sm">Looking up your registration…</p>
              </div>
            )}

            {/* No Result */}
            {!isLoading && hasSearched && !registration && (
              <div className="glass-card rounded-2xl p-8 border border-red-500/20 flex flex-col items-center justify-center gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">No Registration Found</h3>
                  <p className="text-white/50 text-sm">
                    We couldn't find a registration for{' '}
                    <span className="text-white/80 font-medium">{submittedEmail}</span>.
                    <br />
                    Please check the email address and try again.
                  </p>
                </div>
              </div>
            )}

            {/* Result Card */}
            {!isLoading && hasSearched && registration && (
              <div className="glass-card rounded-2xl border border-expo-green-start/30 overflow-hidden shadow-lg shadow-expo-green-start/10">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-expo-green-start/20 to-expo-green-end/10 px-6 py-5 border-b border-expo-green-start/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-expo-green-start/20 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-expo-green-end" />
                    </div>
                    <div>
                      <h2 className="text-white font-bold text-lg leading-tight">Registration Found</h2>
                      <p className="text-expo-green-end text-xs font-semibold">
                        Registration ID: #{registration.id.toString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="px-6 py-4 space-y-0">
                  <DetailRow icon={User} label="Full Name" value={registration.fullName} />
                  <DetailRow icon={Mail} label="Email Address" value={registration.email} />
                  <DetailRow icon={Phone} label="Phone Number" value={registration.phoneNumber} />
                  <DetailRow icon={Building2} label="College Name" value={registration.collegeName} />
                  <DetailRow icon={BookOpen} label="Department" value={registration.department} />
                  <DetailRow icon={Lightbulb} label="Project Title" value={registration.projectTitle} />
                  <DetailRow icon={Tag} label="Category" value={registration.category} />
                  <DetailRow icon={FileText} label="Abstract" value={registration.abstract} />
                  <DetailRow
                    icon={Hash}
                    label="Submitted On"
                    value={new Date(Number(registration.timestamp) / 1_000_000).toLocaleString()}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <FloatingSocialButtons />
    </>
  );
}
