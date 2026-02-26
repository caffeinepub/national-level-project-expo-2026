import { useState } from 'react';
import { useSubmitRegistration } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Loader2, CheckCircle, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

const categories = [
  'AI & Machine Learning',
  'IoT & Embedded Systems',
  'Web & Mobile Apps',
  'Robotics',
  'Green Technology',
  'Data Science',
  'Cybersecurity',
  'Other',
];

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

const initialForm: FormData = {
  fullName: '',
  email: '',
  phoneNumber: '',
  collegeName: '',
  department: '',
  projectTitle: '',
  category: '',
  abstract: '',
};

export default function Registration() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [showSuccess, setShowSuccess] = useState(false);
  const [registrationId, setRegistrationId] = useState<string>('');
  const [showIframe, setShowIframe] = useState(false);
  const { mutate: submitRegistration, isPending } = useSubmitRegistration();

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category) return;
    submitRegistration(form, {
      onSuccess: (id) => {
        setRegistrationId(id.toString());
        setShowSuccess(true);
        setForm(initialForm);
      },
    });
  };

  return (
    <section id="register" className="py-20 px-4 bg-background">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Register Now</h2>
          <p className="text-muted-foreground text-lg">Secure your spot at Innovative Link Expo 2026</p>
        </div>

        {/* Google Form CTA */}
        <div className="bg-card border border-primary/30 rounded-2xl p-6 mb-6 text-center">
          <h3 className="text-lg font-bold text-foreground mb-2">Quick Registration via Google Form</h3>
          <p className="text-muted-foreground text-sm mb-4">Fill out our Google Form for a faster registration experience</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://forms.gle/CXHMtehDUjb8D11DA"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Open Google Form
            </a>
            <button
              onClick={() => setShowIframe(!showIframe)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-primary/50 text-primary font-semibold rounded-full hover:bg-primary/10 transition-colors"
            >
              {showIframe ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {showIframe ? 'Hide Form' : 'Embed Form'}
            </button>
          </div>
          {showIframe && (
            <div className="mt-4 rounded-xl overflow-hidden border border-border">
              <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLSfCXHMtehDUjb8D11DA/viewform?embedded=true"
                width="100%"
                height="600"
                frameBorder="0"
                marginHeight={0}
                marginWidth={0}
                title="Registration Form"
              >
                Loading…
              </iframe>
            </div>
          )}
        </div>

        {/* UPI Payment Block */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6 text-center">
          <h3 className="text-lg font-bold text-foreground mb-2">Payment via UPI</h3>
          <p className="text-muted-foreground text-sm mb-4">Scan the QR code or use the UPI ID below to complete your payment</p>
          <div className="flex flex-col items-center gap-3">
            <img
              src="/assets/generated/upi-qr-code.dim_300x300.png"
              alt="UPI QR Code"
              className="w-48 h-48 rounded-xl border border-border"
            />
            <div className="bg-muted rounded-lg px-4 py-2 border border-border">
              <p className="text-xs text-muted-foreground mb-1">UPI ID</p>
              <p className="text-foreground font-mono font-semibold">athiakash1977@oksbi</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-muted-foreground text-sm">or register via form below</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Backend Registration Form */}
        <div className="bg-card border border-border rounded-2xl p-8">
          <h3 className="text-xl font-bold text-foreground mb-6">Registration Form</h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label className="text-foreground">Full Name *</Label>
                <Input
                  value={form.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  placeholder="Enter your full name"
                  className="bg-background border-border text-foreground"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-foreground">Email *</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="your@email.com"
                  className="bg-background border-border text-foreground"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-foreground">Phone Number *</Label>
                <Input
                  value={form.phoneNumber}
                  onChange={(e) => handleChange('phoneNumber', e.target.value)}
                  placeholder="+91 98765 43210"
                  className="bg-background border-border text-foreground"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-foreground">College Name *</Label>
                <Input
                  value={form.collegeName}
                  onChange={(e) => handleChange('collegeName', e.target.value)}
                  placeholder="Your college name"
                  className="bg-background border-border text-foreground"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-foreground">Department *</Label>
                <Input
                  value={form.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="bg-background border-border text-foreground"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-foreground">Project Title *</Label>
                <Input
                  value={form.projectTitle}
                  onChange={(e) => handleChange('projectTitle', e.target.value)}
                  placeholder="Your project title"
                  className="bg-background border-border text-foreground"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-foreground">Category *</Label>
              <Select value={form.category} onValueChange={(val) => handleChange('category', val)}>
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-foreground hover:bg-muted">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-foreground">Project Abstract *</Label>
              <Textarea
                value={form.abstract}
                onChange={(e) => handleChange('abstract', e.target.value)}
                placeholder="Briefly describe your project (100-300 words)"
                className="bg-background border-border text-foreground min-h-[120px]"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isPending || !form.category}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 text-base rounded-xl"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Registration'
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="bg-card border-border text-foreground">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-primary" />
            </div>
            <DialogTitle className="text-center text-2xl font-bold text-foreground">
              Registration Successful!
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              Your registration has been submitted successfully.
            </DialogDescription>
          </DialogHeader>
          <div className="text-center space-y-3 py-2">
            <p className="text-muted-foreground text-sm">Your Registration ID:</p>
            <p className="text-primary font-mono font-bold text-xl">#{registrationId}</p>
            <p className="text-muted-foreground text-sm">
              Please save this ID for future reference. You can check your registration status using your email.
            </p>
          </div>
          <Button
            onClick={() => setShowSuccess(false)}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Done
          </Button>
        </DialogContent>
      </Dialog>
    </section>
  );
}
