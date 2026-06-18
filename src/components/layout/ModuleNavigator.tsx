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

      {/* ── Left: Logo ── */}
      <div className="flex-none">
        <img src="/logo_2.png" alt="CrawLearn" className="h-9 w-auto" />
      </div>

      {/* ── Center: Burger icon + bare module title dropdown ── */}
      <div className="absolute left-1/2 -translate-x-1/2" ref={moduleMenuRef}>
        <button
          onClick={() => setModuleMenuOpen(prev => !prev)}
          className="flex items-center gap-2.5 hover:opacity-70 transition-opacity group"
        >
          {/* Module title — plain text, no container */}
          <span className="text-white text-sm font-semibold tracking-wide">
            {currentModule?.title ?? '—'}
          </span>
          <svg
            className={`w-3 h-3 text-white/40 transition-transform duration-200 ${moduleMenuOpen ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {moduleMenuOpen && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden py-1 max-h-80 overflow-y-auto custom-scrollbar">
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

      {/* ── Right: Nav links + User avatar ── */}
      <div className="flex items-center gap-1 flex-none">
        {['Lesson', 'Resources', 'Community'].map(tab => (
          <button
            key={tab}
            className={`px-3 py-1.5 text-sm font-medium transition-colors
              ${tab === 'Lesson'
                ? 'text-highlight border-b-2 border-highlight'
                : 'text-white/50 hover:text-white/80'}`}
          >
            {tab}
            {tab === 'Community' && (
              <span className="ml-1 w-1.5 h-1.5 rounded-full bg-highlight inline-block align-middle" />
            )}
          </button>
        ))}

        <div className="w-px h-5 bg-white/10 mx-2" />

        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(prev => !prev)}
            className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold hover:opacity-80 transition-opacity overflow-hidden relative"
          >
            <img src="/avatar.png" alt="EB" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <span className="absolute text-white text-xs font-bold">EB</span>
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