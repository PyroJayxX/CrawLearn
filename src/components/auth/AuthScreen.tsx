import { useState } from 'react';
import { supabase } from '../../lib/supabase';

interface AuthScreenProps {
  onSuccess: () => void;
  onBack?:   () => void;
  mode?:     'login' | 'signup';
}

export default function AuthScreen({ onSuccess, onBack, mode = 'login' }: AuthScreenProps) {
  const [isLogin, setIsLogin]     = useState(mode === 'login');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [message, setMessage]     = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else onSuccess();
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setMessage('Check your email for a confirmation link.');
    }

    setIsLoading(false);
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-8 bg-[#0B1120] p-4 overflow-hidden">

      {/* Static glow — no motion */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full opacity-10 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #a9feed 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-1/4 right-1/4 w-[30vw] h-[30vw] rounded-full opacity-[0.06] blur-[100px]"
          style={{ background: 'radial-gradient(circle, #3c99aa 0%, transparent 70%)' }}
        />

        {/* Fine grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, transparent 30%, #0B1120 90%)' }}
        />
      </div>

      {/* Back button */}
      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-6 left-8 flex items-center gap-2 text-xs font-semibold text-white/40 hover:text-white/70 transition-colors z-10"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      )}

      {/* Logo */}
      <img src="/logo_2.png" alt="CrawLearn" className="relative h-12 w-auto opacity-90" />

      {/* Card — subtle frosted glass */}
      <div
        className="relative w-full max-w-md rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 p-10"
        style={{ boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
      >

        {/* Header */}
        <div className="mb-7 text-center">
          <h1 className="text-2xl font-bold text-white">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="mt-1.5 text-xs text-white/40">
            {isLogin
              ? 'Sign in to continue your learning journey.'
              : 'Sign up to start your learning journey.'}
          </p>
        </div>

        {/* Error / info banners */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-xs text-red-300">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-4 rounded-lg bg-[#a9feed]/10 border border-[#a9feed]/30 px-4 py-3 text-xs text-[#a9feed]">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/40">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/20 transition-colors focus:border-[#a9feed]/50 focus:outline-none focus:ring-2 focus:ring-[#a9feed]/20"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/40">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/20 transition-colors focus:border-[#a9feed]/50 focus:outline-none focus:ring-2 focus:ring-[#a9feed]/20"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full rounded-lg bg-[#a9feed] px-4 py-3 text-sm font-bold text-[#0B1120] transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing…' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        {/* Toggle */}
        <div className="mt-5 text-center text-xs text-white/40">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => { setIsLogin(!isLogin); setError(null); setMessage(null); }}
            className="font-semibold text-[#a9feed] hover:text-[#a9feed]/70 transition-colors"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>

      <p className="relative text-xs uppercase tracking-widest text-white/20 font-semibold">
        CrawLearn · Insurance Education
      </p>
    </div>
  );
}