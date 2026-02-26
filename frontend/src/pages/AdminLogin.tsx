import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { Loader2, Lock, Mail, Zap, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useVerifyAdminCredentials } from '../hooks/useQueries';

interface LoginForm {
  email: string;
  password: string;
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAdminAuth();
  const verifyMutation = useVerifyAdminCredentials();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setLoginError('');
    try {
      const isValid = await verifyMutation.mutateAsync(data);
      if (isValid) {
        login();
        navigate({ to: '/admin/dashboard' });
      } else {
        setLoginError('Invalid email or password. Please try again.');
      }
    } catch {
      setLoginError('Authentication failed. Please check your connection and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-expo-darkest flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(15,157,88,0.08),transparent_70%)]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-expo-green-start/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-expo-green-end/5 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-expo-green-start to-expo-green-end shadow-xl shadow-expo-green-start/30 mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Admin Portal</h1>
          <p className="text-white/40 text-sm mt-1">National Level Project Expo 2026</p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl p-8 border border-white/10">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Lock className="w-4 h-4 text-expo-green-end" />
            Secure Login
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-white/70 text-sm">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@egspillay.ac.in"
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-expo-green-start/60"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
                  })}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-white/70 text-sm">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-expo-green-start/60"
                  {...register('password', { required: 'Password is required' })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
            </div>

            {loginError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {loginError}
              </div>
            )}

            <Button
              type="submit"
              disabled={verifyMutation.isPending}
              className="w-full py-5 font-bold bg-gradient-to-r from-expo-green-start to-expo-green-end text-white border-0 hover:shadow-lg hover:shadow-expo-green-start/40 hover:scale-[1.02] transition-all duration-300"
            >
              {verifyMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Login to Dashboard'
              )}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/5 text-center">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate({ to: '/' });
              }}
              className="text-white/30 hover:text-expo-green-end text-sm transition-colors"
            >
              ← Back to Event Website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
