import { Link } from '@tanstack/react-router';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: '#050f0a' }}
    >
      {/* Glow orbs */}
      <div
        className="fixed pointer-events-none"
        style={{
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(15,157,88,0.12) 0%, transparent 70%)',
          top: '20%',
          left: '10%',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)',
          bottom: '20%',
          right: '10%',
          filter: 'blur(40px)',
        }}
      />

      <div className="relative z-10 text-center max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{
              background: 'rgba(15,157,88,0.15)',
              border: '1px solid rgba(15,157,88,0.3)',
              boxShadow: '0 0 30px rgba(15,157,88,0.2)',
            }}
          >
            <AlertTriangle className="w-10 h-10" style={{ color: '#22c55e' }} />
          </div>
        </div>

        {/* 404 */}
        <h1
          className="text-8xl font-black mb-2 leading-none"
          style={{
            background: 'linear-gradient(135deg, #0f9d58, #22c55e)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          404
        </h1>

        <h2 className="text-2xl font-bold text-white mb-3">Page Not Found</h2>

        <p className="text-white/60 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        {/* Back to Home */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold transition-all duration-300 hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #0f9d58, #22c55e)',
            boxShadow: '0 0 25px rgba(15,157,88,0.4)',
          }}
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
