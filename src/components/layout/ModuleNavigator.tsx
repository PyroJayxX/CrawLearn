import { useState, useRef, useEffect } from 'react';
import { LearningState, ModuleConfig } from '../../types';

interface NavProps {
  modules:          ModuleConfig[];
  currentState:     LearningState;
  onModuleNavigate: (moduleId: string) => void;
  onSignOut:        () => void;
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
  onSignOut,
  userName,
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
      <div className="flex items-center gap-3 md:gap-5 flex-none">

        {/* Mobile hamburger — only visible on small screens, triggers drawer */}
        <button
          onClick={onSidebarToggle}
          className="lg:hidden p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <img src="/logo_2.png" alt="CrawLearn" className="h-8 md:h-9 w-auto" />

        <div className="hidden sm:block w-px h-5 bg-white/10" />

        {/* Module selector */}
        <div className="relative hidden sm:block" ref={moduleMenuRef}>
          <button
            onClick={() => setModuleMenuOpen(prev => !prev)}
            className="flex items-center gap-2.5 hover:opacity-75 transition-opacity"
          >
            <div className="flex flex-col gap-[4px] flex-none">
              <span className="block w-4 h-[2px] bg-white/50 rounded-full" />
              <span className="block w-3 h-[2px] bg-white/50 rounded-full" />
              <span className="block w-4 h-[2px] bg-white/50 rounded-full" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">Course</span>
              <span className="text-white text-sm font-semibold mt-0.5">{currentModule?.title ?? '—'}</span>
            </div>
            <svg
              className={`w-3 h-3 text-white/30 transition-transform duration-200 ml-0.5 ${moduleMenuOpen ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {moduleMenuOpen && (
            <div className="absolute top-full left-0 mt-3 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden py-1 max-h-80 overflow-y-auto custom-scrollbar">
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
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors
                      ${isActive ? 'bg-accent/10 text-accent font-semibold' : isUnlocked ? 'text-gray-700 hover:bg-gray-50' : 'text-gray-400 cursor-not-allowed'}`}
                  >
                    <span className="w-4 flex-none text-center">
                      {!isUnlocked ? (
                        <svg className="w-3.5 h-3.5 inline text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      ) : isCompleted ? <span className="text-accent text-xs">✓</span> : null}
                    </span>
                    {mod.title}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Progress bar — hidden on mobile */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="w-px h-5 bg-white/10" />
          <div className="flex flex-col gap-1.5 w-48 xl:w-72">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">Progress</span>
              <span className="text-[10px] font-bold text-white">{progressPct}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPct}%`, background: '#a9feed' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: user ── */}
      <div className="flex items-center flex-none" ref={userMenuRef}>
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(prev => !prev)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            {/* Name hidden on mobile */}
            <span className="hidden md:block text-white/80 text-sm font-medium">{displayName}</span>
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold overflow-hidden relative flex-none">
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
            <div className="absolute top-full right-0 mt-2 w-32 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden py-1">
              <button
                onClick={() => { setUserMenuOpen(false); onSignOut(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
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