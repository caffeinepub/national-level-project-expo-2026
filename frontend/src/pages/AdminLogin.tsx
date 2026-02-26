import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { Lock, Mail, Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';

const ADMIN_EMAIL = 'athiakash1977@gmail.com';

export default function AdminLogin() {
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (email.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      setError('Access denied. Only the designated admin email is authorized.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(email.trim(), password);
      if (success) {
        navigate({ to: '/admin/dashboard' });
      } else {
        setError('Invalid credentials. Please check your password and try again.');
      }
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'oklch(0.55 0.18 145)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-8 blur-3xl pointer-events-none"
        style={{ background: 'oklch(0.45 0.15 160)' }} />

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ background: 'oklch(0.25 0.08 145)', border: '1px solid oklch(0.45 0.18 145)' }}>
            <Shield className="w-8 h-8" style={{ color: 'oklch(0.75 0.2 145)' }} />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Portal</h1>
          <p className="text-muted-foreground text-sm">InnovativeLink Expo 2K26 — Restricted Access</p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl p-8 shadow-2xl"
          style={{
            background: 'oklch(0.14 0.04 145)',
            border: '1px solid oklch(0.3 0.08 145)',
          }}>

          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl mb-6"
              style={{ background: 'oklch(0.2 0.08 25)', border: '1px solid oklch(0.4 0.15 25)' }}>
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'oklch(0.7 0.2 25)' }} />
              <p className="text-sm" style={{ color: 'oklch(0.8 0.15 25)' }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: 'oklch(0.6 0.12 145)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all outline-none"
                  style={{
                    background: 'oklch(0.18 0.05 145)',
                    border: '1px solid oklch(0.35 0.1 145)',
                    color: 'oklch(0.9 0.05 145)',
                  }}
                  placeholder="admin@example.com"
                  autoComplete="email"
                />
              </div>
              <p className="text-xs mt-1.5" style={{ color: 'oklch(0.55 0.1 145)' }}>
                Authorized admin: {ADMIN_EMAIL}
              </p>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: 'oklch(0.6 0.12 145)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 rounded-xl text-sm transition-all outline-none"
                  style={{
                    background: 'oklch(0.18 0.05 145)',
                    border: '1px solid oklch(0.35 0.1 145)',
                    color: 'oklch(0.9 0.05 145)',
                  }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-colors"
                  style={{ color: 'oklch(0.6 0.12 145)' }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs mt-1.5" style={{ color: 'oklch(0.5 0.08 145)' }}>
                Default password: <span className="font-mono" style={{ color: 'oklch(0.65 0.15 145)' }}>Admin@2026</span>
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 mt-2"
              style={{
                background: isLoading ? 'oklch(0.35 0.1 145)' : 'oklch(0.5 0.18 145)',
                color: 'oklch(0.95 0.02 145)',
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Access Admin Dashboard
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs mt-6" style={{ color: 'oklch(0.45 0.06 145)' }}>
          This portal is restricted to authorized administrators only.
        </p>
      </div>
    </div>
  );
}
