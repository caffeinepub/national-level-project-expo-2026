import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CheckCircle, Loader2, X } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useSubmitRegistration } from '../hooks/useQueries';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

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
  'IoT & Embedded Systems',
  'AI / Machine Learning',
  'Robotics & Automation',
  'Software Development',
  'Electronics & VLSI',
  'Others / Interdisciplinary',
];

export default function Registration() {
  const { ref: headingRef, isVisible: headingVisible } = useScrollAnimation({ threshold: 0.2 });
  const [showSuccess, setShowSuccess] = useState(false);
  const [registrationId, setRegistrationId] = useState<string>('');
  const submitMutation = useSubmitRegistration();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const id = await submitMutation.mutateAsync(data);
      setRegistrationId(id.toString());
      setShowSuccess(true);
      reset();
    } catch (err) {
      // error handled by mutation state
    }
  };

  return (
    <section id="registration" className="py-24 bg-expo-darker relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-expo-green-start/30 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(15,157,88,0.05),transparent_70%)]" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          ref={headingRef as React.RefObject<HTMLDivElement>}
          className={`text-center mb-12 transition-all duration-700 ${
            headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold text-expo-green-end border border-expo-green-start/40 bg-expo-green-start/10 mb-4 uppercase tracking-widest">
            Join the Expo
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
            Register{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-expo-green-start to-expo-green-end">
              Your Team
            </span>
          </h2>
          <p className="text-white/50 text-sm sm:text-base">
            Fill in the details below to secure your spot at the National Level Project Expo 2026.
          </p>
        </div>

        {/* Form */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Row 1: Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-white/80 text-sm font-medium">
                  Full Name <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-expo-green-start/60 focus:ring-expo-green-start/20"
                  {...register('fullName', { required: 'Full name is required' })}
                />
                {errors.fullName && (
                  <p className="text-red-400 text-xs">{errors.fullName.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-white/80 text-sm font-medium">
                  Email Address <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-expo-green-start/60 focus:ring-expo-green-start/20"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' },
                  })}
                />
                {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
              </div>
            </div>

            {/* Row 2: Phone + College */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="phoneNumber" className="text-white/80 text-sm font-medium">
                  Phone Number <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="10-digit mobile number"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-expo-green-start/60 focus:ring-expo-green-start/20"
                  {...register('phoneNumber', {
                    required: 'Phone number is required',
                    pattern: { value: /^[6-9]\d{9}$/, message: 'Enter a valid 10-digit phone number' },
                  })}
                />
                {errors.phoneNumber && (
                  <p className="text-red-400 text-xs">{errors.phoneNumber.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="collegeName" className="text-white/80 text-sm font-medium">
                  College Name <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="collegeName"
                  placeholder="Your college name"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-expo-green-start/60 focus:ring-expo-green-start/20"
                  {...register('collegeName', { required: 'College name is required' })}
                />
                {errors.collegeName && (
                  <p className="text-red-400 text-xs">{errors.collegeName.message}</p>
                )}
              </div>
            </div>

            {/* Row 3: Department + Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="department" className="text-white/80 text-sm font-medium">
                  Department <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="department"
                  placeholder="e.g., ECE, CSE, EEE"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-expo-green-start/60 focus:ring-expo-green-start/20"
                  {...register('department', { required: 'Department is required' })}
                />
                {errors.department && (
                  <p className="text-red-400 text-xs">{errors.department.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-white/80 text-sm font-medium">
                  Project Category <span className="text-red-400">*</span>
                </Label>
                <Select
                  onValueChange={(val) => setValue('category', val, { shouldValidate: true })}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-expo-green-start/60 focus:ring-expo-green-start/20">
                    <SelectValue placeholder="Select a category" className="text-white/30" />
                  </SelectTrigger>
                  <SelectContent className="bg-expo-darker border-white/10">
                    {categories.map((cat) => (
                      <SelectItem
                        key={cat}
                        value={cat}
                        className="text-white/80 hover:text-white focus:bg-expo-green-start/20 focus:text-white"
                      >
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input
                  type="hidden"
                  {...register('category', { required: 'Please select a category' })}
                />
                {errors.category && (
                  <p className="text-red-400 text-xs">{errors.category.message}</p>
                )}
              </div>
            </div>

            {/* Project Title */}
            <div className="space-y-1.5">
              <Label htmlFor="projectTitle" className="text-white/80 text-sm font-medium">
                Project Title <span className="text-red-400">*</span>
              </Label>
              <Input
                id="projectTitle"
                placeholder="Enter your project title"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-expo-green-start/60 focus:ring-expo-green-start/20"
                {...register('projectTitle', { required: 'Project title is required' })}
              />
              {errors.projectTitle && (
                <p className="text-red-400 text-xs">{errors.projectTitle.message}</p>
              )}
            </div>

            {/* Abstract */}
            <div className="space-y-1.5">
              <Label htmlFor="abstract" className="text-white/80 text-sm font-medium">
                Project Abstract <span className="text-red-400">*</span>
              </Label>
              <Textarea
                id="abstract"
                placeholder="Briefly describe your project (100-300 words)..."
                rows={5}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-expo-green-start/60 focus:ring-expo-green-start/20 resize-none"
                {...register('abstract', {
                  required: 'Abstract is required',
                  minLength: { value: 50, message: 'Abstract must be at least 50 characters' },
                })}
              />
              {errors.abstract && (
                <p className="text-red-400 text-xs">{errors.abstract.message}</p>
              )}
            </div>

            {/* Error message */}
            {submitMutation.isError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                Registration failed. Please try again.
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={submitMutation.isPending}
              className="w-full py-6 text-base font-bold bg-gradient-to-r from-expo-green-start to-expo-green-end hover:shadow-lg hover:shadow-expo-green-start/40 hover:scale-[1.02] transition-all duration-300 text-white border-0 rounded-xl"
            >
              {submitMutation.isPending ? (
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

      {/* Success Modal */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="bg-expo-darker border border-expo-green-start/30 text-white max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-expo-green-start/20 flex items-center justify-center animate-scale-in">
                <CheckCircle className="w-10 h-10 text-expo-green-end" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl font-bold text-white">
              Registration Successful! 🎉
            </DialogTitle>
            <DialogDescription className="text-center text-white/60 mt-2">
              Your registration has been submitted successfully. Registration ID:{' '}
              <span className="text-expo-green-end font-bold">#{registrationId}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 p-4 rounded-xl bg-expo-green-start/10 border border-expo-green-start/20 text-sm text-white/70 text-center">
            We'll contact you at your registered email with further details. See you at the Expo on{' '}
            <strong className="text-white">April 15, 2026</strong>!
          </div>
          <Button
            onClick={() => setShowSuccess(false)}
            className="w-full mt-4 bg-gradient-to-r from-expo-green-start to-expo-green-end text-white font-bold hover:shadow-lg hover:shadow-expo-green-start/30 transition-all"
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </section>
  );
}
