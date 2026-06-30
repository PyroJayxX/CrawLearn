interface LandingPageProps {
  onLogin:  () => void;
  onSignup: () => void;
}

export default function LandingPage({ onLogin, onSignup }: LandingPageProps) {
  return (
    <div className="min-h-screen w-full bg-[#0B1120] flex flex-col overflow-x-hidden relative">

      {/* ── Animated background ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Aurora blobs */}
        <div
          className="absolute -top-1/4 -left-1/4 w-[60vw] h-[60vw] rounded-full opacity-20 blur-3xl animate-aurora-1"
          style={{ background: 'radial-gradient(circle, #a9feed 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-1/3 -right-1/4 w-[50vw] h-[50vw] rounded-full opacity-15 blur-3xl animate-aurora-2"
          style={{ background: 'radial-gradient(circle, #3c99aa 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-1/4 left-1/3 w-[45vw] h-[45vw] rounded-full opacity-10 blur-3xl animate-aurora-3"
          style={{ background: 'radial-gradient(circle, #a9feed 0%, transparent 70%)' }}
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

        {/* Vignette so content stays readable */}
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, transparent 30%, #0B1120 90%)' }}
        />
      </div>

      <style>{`
        @keyframes crawlearn-aurora-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%      { transform: translate(20%, 25%) scale(1.3); }
        }
        @keyframes crawlearn-aurora-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%      { transform: translate(-25%, 20%) scale(1.35); }
        }
        @keyframes crawlearn-aurora-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%      { transform: translate(18%, -22%) scale(1.2); }
        }
        .animate-aurora-1 { animation: crawlearn-aurora-1 10s ease-in-out infinite; will-change: transform; }
        .animate-aurora-2 { animation: crawlearn-aurora-2 13s ease-in-out infinite; will-change: transform; }
        .animate-aurora-3 { animation: crawlearn-aurora-3 16s ease-in-out infinite; will-change: transform; }
      `}</style>

      {/* ── Nav ── */}
      <nav className="relative flex items-center justify-between px-8 md:px-16 py-6 flex-none">
        <img src="/logo_2.png" alt="CrawLearn" className="h-8 w-auto" />
        <div className="flex items-center gap-3">
          <button
            onClick={onLogin}
            className="px-5 py-2.5 text-sm font-semibold text-white/70 hover:text-white transition-colors"
          >
            Log in
          </button>
          <button
            onClick={onSignup}
            className="px-5 py-2.5 text-sm font-bold bg-[#a9feed] text-[#0B1120] rounded-xl hover:opacity-90 transition-opacity"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative flex-1 flex flex-col items-center justify-center px-6 text-center py-24 md:py-32">

        {/* Eyebrow */}
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#a9feed]/60 mb-8">
          Crawlers Insurance Agency, Inc · Crawlers Consultancy Inc.
        </p>

        {/* Certificate-style headline */}
        <div className="flex flex-col items-center gap-4 mb-10">
          <h1
            className="text-6xl md:text-8xl font-black tracking-widest uppercase text-white leading-none"
            style={{ letterSpacing: '0.15em' }}
          >
            CRAWLEARN
          </h1>
          <div className="flex items-center gap-4 w-full max-w-lg">
            <div className="flex-1 h-px bg-white/10" />
            <p className="text-xs font-semibold tracking-widest uppercase text-white/30 whitespace-nowrap">
              We crawl so you can fly.
            </p>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          <p className="text-lg md:text-xl text-white/50 max-w-xl leading-relaxed font-light">
            Master insurance principles, legal frameworks, and industry practice
            structured for Crawlers professionals.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 mb-20">
          <button
            onClick={onSignup}
            className="px-8 py-4 bg-[#a9feed] text-[#0B1120] font-bold text-sm rounded-xl hover:opacity-90 transition-opacity"
          >
            Start Learning →
          </button>
          <button
            onClick={onLogin}
            className="px-8 py-4 border border-white/15 text-white/70 font-semibold text-sm rounded-xl hover:border-white/30 hover:text-white transition-all"
          >
            I already have an account
          </button>
        </div>

        {/* Feature pills */}
        <div className="flex flex-col sm:flex-row items-center gap-3 flex-wrap justify-center">
          {[
            { icon: '📋', label: '10 Structured Modules' },
            { icon: '🎓', label: 'Quizzes & Assessments' },
            { icon: '📊', label: 'Progress Tracking' },
            { icon: '🤖', label: 'AI-Powered Tutor' },
          ].map(({ icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white/50 text-sm font-medium"
            >
              <span className="text-base leading-none">{icon}</span>
              {label}
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative px-8 md:px-16 py-6 border-t border-white/5 flex items-center justify-between flex-wrap gap-2">
        <p className="text-xs text-white/20">
          © {new Date().getFullYear()} Crawlers Insurance Agency, Inc. All rights reserved.
        </p>
        <p className="text-xs text-white/20">
          Powered by CrawLearn
        </p>
      </footer>

    </div>
  );
}