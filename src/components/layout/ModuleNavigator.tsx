import { useState, useRef, useEffect } from 'react';
import { LearningState, ModuleConfig } from '../../types';

interface NavProps {
  modules:          ModuleConfig[];
  currentState:     LearningState;
  onModuleNavigate: (moduleId: string) => void;
  onTutorMode?:     () => void;
  onSignOut:        () => void;
  onHome:          () => void;
  userName?:        string;
  onSidebarToggle?: () => void; // triggers mobile drawer
}

function getInitials(name?: string): string {
  if (!name) return '?';
  const parts = name.includes('@') ? [name.split('@')[0]] : name.trim().split(' ');
  return parts.slice(0, 2).map(p => p[0]?.toUpperCase() ?? '').join('');
}

function getDisplayName(name?: string): string {
  if (!name) return 'Account';
  if (name.length <= 20) return name.toUpperCase();
  return (name.includes('@') ? name.split('@')[0] : name).toUpperCase();
}

export default function ModuleNavigator({
  modules,
  currentState,
  onModuleNavigate,
  onTutorMode,
  onSignOut,
  userName,
  onHome,
  onSidebarToggle,
}: NavProps) {
  const { currentModuleId, completedModules, quizScores } = currentState;
  const currentModule = modules.find(m => m.id === currentModuleId);

  const [userMenuOpen,   setUserMenuOpen]   = useState(false);
  const [moduleMenuOpen, setModuleMenuOpen] = useState(false);
  const userMenuRef   = useRef<HTMLDivElement>(null);
  const moduleMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current   && !userMenuRef.current.contains(e.target as Node))   setUserMenuOpen(false);
      if (moduleMenuRef.current && !moduleMenuRef.current.contains(e.target as Node)) setModuleMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Progress
  const moduleScores = quizScores[currentModuleId] ?? {};
  const gradeableSections = (currentModule?.sections ?? []).filter(
    s => !s.hasVideo && s.id !== 'faq' && s.passingScore !== undefined
  );
  const passedCount = gradeableSections.filter(
    s => (moduleScores[s.id] ?? -1) >= (s.passingScore ?? Infinity)
  ).length;
  const progressPct = gradeableSections.length > 0
    ? Math.round((passedCount / gradeableSections.length) * 100)
    : 0;

  const initials    = getInitials(userName);
  const displayName = getDisplayName(userName);

  return (
    <div className="flex items-center justify-between px-4 md:px-6 h-full gap-3">

      {/* ── Left: mobile sidebar toggle + logo + module selector ── */}
      <div className="flex items-center gap-2 md:gap-4 flex-none">

        {/* Mobile hamburger — only visible on small screens, triggers drawer */}
        <button
          onClick={onSidebarToggle}
          className="lg:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.08] active:scale-95 transition-all duration-150"
          aria-label="Toggle sidebar"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <button onClick={onHome} className="flex-none hover:opacity-80 active:scale-95 transition-all duration-150">
          <img src="/logo_2.png" alt="CrawLearn" className="h-8 md:h-9 w-auto" />
        </button>

        <div className="hidden sm:block w-px h-6 bg-gradient-to-b from-transparent via-white/15 to-transparent" />

        {/* Module selector */}
        <div className="relative hidden sm:block" ref={moduleMenuRef}>
          <button
            onClick={() => setModuleMenuOpen(prev => !prev)}
            className={`flex items-center gap-2.5 px-2.5 py-1.5 -mx-2.5 rounded-lg transition-all duration-150 hover:bg-white/[0.06] ${moduleMenuOpen ? 'bg-white/[0.06]' : ''}`}
          >
            <div className="flex flex-col gap-[3px] flex-none">
              <span className="block w-4 h-[2px] bg-white/40 rounded-full" />
              <span className="block w-3 h-[2px] bg-white/40 rounded-full" />
              <span className="block w-4 h-[2px] bg-white/40 rounded-full" />
            </div>
            <div className="flex flex-col leading-none items-start">
              <span className="text-[10px] uppercase tracking-widest text-white/35 font-semibold">Course</span>
              <span className="text-white text-sm font-semibold mt-1">{currentModule?.title ?? '—'}</span>
            </div>
            <svg
              className={`w-3 h-3 text-white/30 transition-transform duration-200 ml-0.5 ${moduleMenuOpen ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {moduleMenuOpen && (
            <div className="absolute top-full left-0 mt-3 w-48 bg-white border border-gray-100 rounded-2xl shadow-[0_12px_32px_-8px_rgba(0,0,0,0.18)] z-50 overflow-hidden py-1.5 max-h-80 overflow-y-auto custom-scrollbar animate-nav-pop">
              {modules.map((mod, index) => {
                const prevMod    = modules[index - 1];
                const isUnlocked = index === 0 || completedModules.has(prevMod?.id);
                const isActive   = mod.id === currentModuleId;
                const isCompleted = completedModules.has(mod.id);
                return (
                  <button
                    key={mod.id}
                    disabled={!isUnlocked}
                    onClick={() => { if (!isUnlocked) return; onModuleNavigate(mod.id); setModuleMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors duration-150 rounded-lg mx-1 w-[calc(100%-8px)]
                      ${isActive ? 'bg-accent/10 text-accent font-semibold' : isUnlocked ? 'text-gray-700 hover:bg-gray-50' : 'text-gray-300 cursor-not-allowed'}`}
                  >
                    <span className="w-4 flex-none text-center">
                      {!isUnlocked ? (
                        <svg className="w-3.5 h-3.5 inline text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      ) : isCompleted ? (
                        <span className="inline-flex w-4 h-4 rounded-full bg-accent/15 text-accent text-[10px] items-center justify-center">✓</span>
                      ) : null}
                    </span>
                    <span className="truncate">{mod.title}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Progress bar — hidden on mobile */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex flex-col gap-1.5 w-48 xl:w-64">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-white/35 font-semibold">Progress</span>
              <span className="text-[11px] font-bold text-white tabular-nums">{progressPct}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/[0.08] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg, #a9feed, #6fe8d1)' }}
              />
            </div>
          </div>
        </div>

                {onTutorMode && (
          <>
            <div className="hidden sm:block w-px h-6 bg-gradient-to-b from-transparent via-white/15 to-transparent" />
            <button
              onClick={onTutorMode}
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-white/90 hover:text-white px-2.5 py-1.5 -mx-2.5 rounded-lg hover:bg-white/[0.06] transition-all duration-150"
            >
              <svg className="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Tutor Mode
            </button>
          </>
        )}

      </div>

      {/* ── Right: user ── */}
      <div className="flex items-center flex-none" ref={userMenuRef}>
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(prev => !prev)}
            className={`flex items-center gap-2.5 pl-2 pr-1.5 py-1.5 rounded-full transition-all duration-150 hover:bg-white/[0.06] ${userMenuOpen ? 'bg-white/[0.06]' : ''}`}
          >
            {/* Name hidden on mobile */}
            <span className="hidden md:block text-white/75 text-sm font-medium">{displayName}</span>
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold overflow-hidden relative flex-none ring-2 ring-white/10">
              <img src="/avatar.png" alt={initials} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <span className="absolute text-white text-xs font-bold">{initials}</span>
            </div>
            <svg
              className={`w-3 h-3 text-white/30 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {userMenuOpen && (
            <div className="absolute top-full right-0 mt-3 w-40 bg-white border border-gray-100 rounded-2xl shadow-[0_12px_32px_-8px_rgba(0,0,0,0.18)] z-50 overflow-hidden py-1.5 animate-nav-pop">
              <button
                onClick={() => { setUserMenuOpen(false); onSignOut(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors duration-150 text-left rounded-lg mx-1 w-[calc(100%-8px)]"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}