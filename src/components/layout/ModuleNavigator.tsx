import { useState, useRef, useEffect } from 'react';
import { LearningState, ModuleConfig } from '../../types';

interface NavProps {
  modules: ModuleConfig[];
  currentState: LearningState;
  onModuleNavigate: (moduleId: string) => void;
}

export default function ModuleNavigator({ modules, currentState, onModuleNavigate }: NavProps) {
  const { currentModuleId, completedModules } = currentState;
  const currentModule = modules.find(m => m.id === currentModuleId);

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [moduleMenuOpen, setModuleMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const moduleMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
      if (moduleMenuRef.current && !moduleMenuRef.current.contains(e.target as Node)) setModuleMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="flex items-center justify-between px-6 h-full">

      {/* ── Left: Logo + Module selector ── */}
      <div className="flex items-center gap-5 flex-none">
        <img src="/logo_2.png" alt="CrawLearn" className="h-9 w-auto" />

        {/* Divider */}
        <div className="w-px h-5 bg-white/10" />

        {/* Module selector */}
        <div className="relative" ref={moduleMenuRef}>
          <button
            onClick={() => setModuleMenuOpen(prev => !prev)}
            className="flex items-center gap-2.5 hover:opacity-75 transition-opacity"
          >
            {/* Burger icon */}
            <div className="flex flex-col gap-[4px] flex-none">
              <span className="block w-4 h-[2px] bg-white/50 rounded-full" />
              <span className="block w-3 h-[2px] bg-white/50 rounded-full" />
              <span className="block w-4 h-[2px] bg-white/50 rounded-full" />
            </div>

            {/* Label */}
            <div className="flex flex-col leading-none">
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">Course</span>
              <span className="text-white text-sm font-semibold mt-0.5">
                {currentModule?.title ?? '—'}
              </span>
            </div>

            <svg
              className={`w-3 h-3 text-white/30 transition-transform duration-200 ml-0.5 ${moduleMenuOpen ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {moduleMenuOpen && (
            <div className="absolute top-full left-0 mt-3 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden py-1 max-h-80 overflow-y-auto custom-scrollbar">
              {modules.map((mod, index) => {
                const prevMod = modules[index - 1];
                const isUnlocked = index === 0 || completedModules.has(prevMod?.id);
                const isActive = mod.id === currentModuleId;
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
                      ) : isCompleted ? (
                        <span className="text-accent text-xs">✓</span>
                      ) : null}
                    </span>
                    {mod.title}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Right: User name + avatar ── */}
      <div className="flex items-center flex-none" ref={userMenuRef}>
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(prev => !prev)}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <span className="text-white/80 text-sm font-medium">EDRILL BILAN</span>
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold overflow-hidden relative flex-none">
              <img src="/avatar.png" alt="EB" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <span className="absolute text-white text-xs font-bold">EB</span>
            </div>
            <svg
              className={`w-3 h-3 text-white/30 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {userMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden py-1">
              {[{ label: 'Profile', icon: '👤' }, { label: 'Settings', icon: '⚙️' }, { label: 'Logout', icon: '🚪' }].map(item => (
                <button
                  key={item.label}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <span>{item.icon}</span>{item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}