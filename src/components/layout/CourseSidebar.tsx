import { LearningState, ModuleConfig } from '../../types';

interface CourseSidebarProps {
  modules: ModuleConfig[];
  currentState: LearningState;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  onSectionNavigate: (sectionId: string) => void;
}

// Approximate durations per section for display — update to real values as needed
const SECTION_DURATIONS: Record<string, string> = {
  ch1: '12:45',
  ch2: '18:20',
  ch3: '22:05',
  final: '15:30',
  faq: '',
};

export default function CourseSidebar({
  modules,
  currentState,
  collapsed,
  onCollapsedChange,
  onSectionNavigate,
}: CourseSidebarProps) {
  const { currentModuleId, currentSectionId, unlockedSections, quizScores } = currentState;
  const currentModule = modules.find(m => m.id === currentModuleId);
  const sectionsForModule = currentModule?.sections ?? [];
  const unlockedForModule = unlockedSections[currentModuleId] ?? new Set();

  return (
    <aside
      className={`
        flex-none h-full z-40 flex flex-col
        bg-white border-r border-gray-200 transition-all duration-300 ease-in-out
        ${collapsed ? 'w-16' : 'w-[240px]'}
      `}
    >
      {/* ── Header ── */}
      <div className={`flex items-center ${collapsed ? 'justify-center py-4 px-2 border-b border-gray-200' : 'justify-between px-5 py-4 border-b border-gray-200/60'}`}>
        {!collapsed && (
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Course Syllabus</p>
        )}
        <button
          onClick={() => onCollapsedChange(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors flex-none"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M6 5l7 7-7 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7M18 19l-7-7 7-7" />
            </svg>
          )}
        </button>
      </div>

      {/* ── Section list ── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar py-2">
        {sectionsForModule.map((section, idx) => {
          const isUnlocked = unlockedForModule.has(section.id);
          const isActive = section.id === currentSectionId;
          const sectionScore = quizScores[currentModuleId]?.[section.id] ?? 0;
          const isCompleted = section.passingScore !== undefined && sectionScore >= section.passingScore;
          const duration = SECTION_DURATIONS[section.id];

          // ── Collapsed icon view ──
          if (collapsed) {
            return (
              <button
                key={section.id}
                disabled={!isUnlocked}
                onClick={() => isUnlocked && onSectionNavigate(section.id)}
                title={section.title}
                className={`w-full flex items-center justify-center py-3 transition-colors relative
                  ${isActive ? 'text-accent' : isUnlocked ? 'text-gray-500 hover:text-accent' : 'text-gray-300 cursor-not-allowed'}`}
              >
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-accent rounded-r-full" />}
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold
                  ${isActive ? 'bg-accent/10 text-accent' : isUnlocked ? 'bg-gray-100 text-gray-600' : 'bg-gray-50 text-gray-300'}`}>
                  {!isUnlocked ? (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  ) : isCompleted ? '✓' : idx + 1}
                </span>
              </button>
            );
          }

          // ── Expanded row view — matches Image 1 style ──
          return (
            <button
              key={section.id}
              disabled={!isUnlocked}
              onClick={() => isUnlocked && onSectionNavigate(section.id)}
              className={`flex items-center gap-3 text-left transition-all
                ${isActive
                  ? 'w-[calc(100%-24px)] mx-3 px-3 py-3 bg-background rounded-xl my-0.5'
                  : isUnlocked
                  ? 'w-full px-4 py-3 hover:bg-gray-50'
                  : 'w-full px-4 py-3 opacity-50 cursor-not-allowed'}`}
            >
              {/* Left icon: play (active), checkmark (completed), lock (locked), number (unlocked idle) */}
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-none transition-colors
                ${isActive
                  ? 'bg-highlight/20'
                  : isCompleted
                  ? 'bg-accent/15'
                  : isUnlocked
                  ? 'bg-gray-100'
                  : 'bg-gray-50'}`}
              >
                {isActive ? (
                  /* Play triangle */
                  <svg className="w-3 h-3 text-highlight ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5 3l14 9-14 9V3z" />
                  </svg>
                ) : isCompleted ? (
                  <svg className="w-3 h-3 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : !isUnlocked ? (
                  <svg className="w-3 h-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ) : (
                  <span className="text-[10px] font-bold text-gray-500">{idx + 1}</span>
                )}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold leading-snug truncate
                  ${isActive ? 'text-white' : isUnlocked ? 'text-gray-800' : 'text-gray-400'}`}>
                  {section.title}
                </p>
                {duration && (
                  <p className={`text-[11px] mt-0.5
                    ${isActive ? 'text-highlight/70' : 'text-gray-400'}`}>
                    {isActive ? `${duration} • Playing` : duration}
                  </p>
                )}
              </div>
            </button>
          );
        })}

        {/* ── Quiz & Extras divider (mirrors Image 1) ── */}
        {!collapsed && (
          <div className="px-4 pt-5 pb-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quiz & Extras</p>
          </div>
        )}
        {!collapsed && (
          <div className="px-4 space-y-1">
            <button className="w-full flex items-center gap-2.5 py-2 text-sm text-gray-600 hover:text-accent transition-colors text-left">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Module 1 Assessment
            </button>
            <button className="w-full flex items-center gap-2.5 py-2 text-sm text-gray-600 hover:text-accent transition-colors text-left">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Cheat Sheets (PDF)
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}