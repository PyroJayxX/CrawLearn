import { useState } from 'react';
import { LearningState, ModuleConfig } from '../../types';

interface NavProps {
  modules: ModuleConfig[];
  currentState: LearningState;
  onModuleNavigate: (moduleId: string) => void;
  onSectionNavigate: (sectionId: string) => void;
}

export default function ModuleNavigator({ modules, currentState, onModuleNavigate, onSectionNavigate }: NavProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { currentModuleId, currentSectionId, unlockedSections, quizScores, completedModules } = currentState;

  const currentModule = modules.find(m => m.id === currentModuleId);
  const sectionsForModule = currentModule?.sections ?? [];
  const unlockedForModule = unlockedSections[currentModuleId] ?? new Set();

  return (
    <div className="flex items-center justify-between px-6 py-4">
      {/* Left: Logo + Branding + Module Dropdown */}
      <div className="flex items-center gap-4">
        <img src="/logo_2.png" alt="CrawLearn" className="h-12 w-auto flex-none" />
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(prev => !prev)}
            className="flex items-center gap-2 px-4 py-2.5 bg-accent/20 text-highlight rounded-lg font-medium hover:bg-accent/40 transition-all duration-200"
          >
            {completedModules.has(currentModuleId) ? '✓ ' : ''}{currentModule?.title ?? 'Select Module'}
            <svg className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-2 min-w-max bg-background border border-accent/30 rounded-xl shadow-xl z-[100] overflow-hidden">
              {modules.map((mod, index) => {
                const prevMod = modules[index - 1];
                const isUnlocked = index === 0 || completedModules.has(prevMod?.id);
                const isActive = mod.id === currentModuleId;
                const isCompleted = completedModules.has(mod.id);

                return (
                  <button
                    key={mod.id}
                    onClick={() => {
                      if (isUnlocked) {
                        onModuleNavigate(mod.id);
                        setDropdownOpen(false);
                      }
                    }}
                    className={`
                      w-full text-center flex items-center justify-center gap-2 px-6 py-3 text-sm transition-colors duration-150
                      ${isActive ? 'bg-accent/30 text-highlight font-semibold'
                        : isUnlocked ? 'text-white hover:bg-accent/20'
                        : 'text-gray-500 cursor-not-allowed'}
                    `}
                  >
                    {!isUnlocked ? (
                      <svg className="w-3.5 h-3.5 flex-none text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    ) : isCompleted ? (
                      <span className="text-highlight text-xs">✓</span>
                    ) : (
                      <span className="w-3.5" />
                    )}
                    {mod.title}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right: Section tabs */}
      <div className="flex items-center gap-2">
        {sectionsForModule.map((section) => {
          const isUnlocked = unlockedForModule.has(section.id);
          const isActive = section.id === currentSectionId;
          const sectionScore = quizScores[currentModuleId]?.[section.id] ?? 0;
          const isCompleted = section.passingScore !== undefined && sectionScore >= section.passingScore;

          return (
            <button
              key={section.id}
              disabled={!isUnlocked}
              onClick={() => onSectionNavigate(section.id)}
              className={`
                flex items-center gap-1.5 px-5 py-2.5 rounded-lg font-medium transition-all duration-200
                ${isActive
                  ? 'bg-highlight text-background shadow-[0_0_15px_var(--color-highlight)]'
                  : isUnlocked
                  ? 'bg-accent/20 text-highlight hover:bg-accent/40'
                  : 'bg-gray-800/60 text-gray-500 cursor-not-allowed'}
              `}
            >
              {!isUnlocked && (
                <svg className="w-3.5 h-3.5 flex-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )}
              {section.title}
              {isCompleted && isUnlocked && !isActive && ' ✓'}
            </button>
          );
        })}
      </div>
    </div>
  );
}