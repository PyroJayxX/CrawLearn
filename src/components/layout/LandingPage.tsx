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
          className="absolute -top-1/4 -left-1/4 w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] rounded-full opacity-20 blur-3xl animate-aurora-1"
          style={{ background: 'radial-gradient(circle, #a9feed 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-1/3 -right-1/4 w-[70vw] h-[70vw] md:w-[50vw] md:h-[50vw] rounded-full opacity-15 blur-3xl animate-aurora-2"
          style={{ background: 'radial-gradient(circle, #3c99aa 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-1/4 left-1/3 w-[65vw] h-[65vw] md:w-[45vw] md:h-[45vw] rounded-full opacity-10 blur-3xl animate-aurora-3"
          style={{ background: 'radial-gradient(circle, #a9feed 0%, transparent 70%)' }}
        />

        {/* Fine grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '32px 32px',
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

        @media (prefers-reduced-motion: reduce) {
          .animate-aurora-1, .animate-aurora-2, .animate-aurora-3 { animation: none; }
        }
      `}</style>

      {/* ── Nav ── */}
      <nav className="relative flex items-center justify-between px-5 sm:px-8 md:px-16 py-4 sm:py-6 flex-none">
        <img src="/logo_2.png" alt="CrawLearn" className="h-6 sm:h-8 w-auto" />
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onLogin}
            className="px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white/70 hover:text-white transition-colors"
          >
            Log in
          </button>
          <button
            onClick={onSignup}
            className="px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold bg-[#a9feed] text-[#0B1120] rounded-lg sm:rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative flex-1 flex flex-col items-center justify-center px-5 sm:px-6 text-center py-16 sm:py-24 md:py-32">

        {/* Eyebrow */}
        <p className="text-[8px] sm:text-[10px] font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase text-[#a9feed]/60 mb-6 sm:mb-8 leading-relaxed px-2">
          Crawlers Insurance Agency, Inc · Crawlers Consultancy Inc.
        </p>

        {/* Certificate-style headline */}
        <div className="flex flex-col items-center gap-3 sm:gap-4 mb-8 sm:mb-10 w-full">
          <h1
            className="text-4xl sm:text-6xl md:text-8xl font-black tracking-widest uppercase text-white leading-none"
            style={{ letterSpacing: '0.1em' }}
          >
            CRAWLEARN
          </h1>
          <div className="flex items-center gap-3 sm:gap-4 w-full max-w-lg">
            <div className="flex-1 h-px bg-white/10" />
            <p className="text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-white/30 whitespace-nowrap">
              We crawl so you can fly.
            </p>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          <p className="text-base sm:text-lg md:text-xl text-white/50 max-w-xl leading-relaxed font-light px-2">
            Master insurance principles, legal frameworks, and industry practice
            structured for Crawlers professionals.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14 sm:mb-20 w-full max-w-xs sm:max-w-none mx-auto">
          <button
            onClick={onSignup}
            className="px-8 py-3.5 sm:py-4 bg-[#a9feed] text-[#0B1120] font-bold text-sm rounded-xl hover:opacity-90 transition-opacity w-full sm:w-auto text-center"
          >
            Start Learning →
          </button>
          <button
            onClick={onLogin}
            className="px-8 py-3.5 sm:py-4 border border-white/15 text-white/70 font-semibold text-sm rounded-xl hover:border-white/30 hover:text-white transition-all w-full sm:w-auto text-center"
          >
            I already have an account
          </button>
        </div>

        {/* Feature pills */}
        <div className="grid grid-cols-2 sm:flex sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 sm:flex-wrap justify-center w-full max-w-md sm:max-w-none mx-auto">
          {[
            { icon: '📋', label: '10 Structured Modules' },
            { icon: '🎓', label: 'Quizzes & Assessments' },
            { icon: '📊', label: 'Progress Tracking' },
            { icon: '🤖', label: 'AI-Powered Tutor' },
          ].map(({ icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white/50 text-xs sm:text-sm font-medium justify-center sm:justify-start text-center sm:text-left"
            >
              <span className="text-base leading-none shrink-0">{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative px-5 sm:px-8 md:px-16 py-5 sm:py-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between flex-wrap gap-1.5 sm:gap-2 text-center sm:text-left">
        <p className="text-[11px] sm:text-xs text-white/20">
          © {new Date().getFullYear()} Crawlers Insurance Agency, Inc. All rights reserved.
        </p>
        <p className="text-[11px] sm:text-xs text-white/20">
          Powered by CrawLearn
        </p>
      </footer>

    </div>
  );
}