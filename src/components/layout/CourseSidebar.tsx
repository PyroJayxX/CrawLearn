import { LearningState, ModuleConfig, SectionConfig } from '../../types';

interface CourseSidebarProps {
  modules: ModuleConfig[];
  currentState: LearningState;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  onSectionNavigate: (sectionId: string) => void;
  sectionDurations?: Record<string, string>;
  // Mobile drawer state — controlled by App
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

function computeUnlocked(sections: SectionConfig[], quizScores: Record<string, number>): Set<string> {
  const unlocked = new Set<string>();
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (i === 0) { unlocked.add(section.id); continue; }
    const prev = sections[i - 1];
    if (section.id === 'final' || section.id.endsWith('_final')) {
      const score = quizScores[prev.id] ?? -1;
      if (prev.passingScore !== undefined && score >= prev.passingScore) unlocked.add(section.id);
    } else if (!section.hasVideo) {
      if (unlocked.has(prev.id)) unlocked.add(section.id);
    } else {
      const score = quizScores[prev.id] ?? -1;
      if (prev.passingScore !== undefined && score >= prev.passingScore) unlocked.add(section.id);
    }
  }
  return unlocked;
}

export default function CourseSidebar({
  modules,
  currentState,
  collapsed,
  onCollapsedChange,
  onSectionNavigate,
  sectionDurations = {},
  mobileOpen = false,
  onMobileClose,
}: CourseSidebarProps) {
  const { currentModuleId, currentSectionId, quizScores } = currentState;
  const currentModule     = modules.find(m => m.id === currentModuleId);
  const sectionsForModule = (currentModule?.sections ?? []).filter(s => s.id !== 'faq');
  const moduleQuizScores  = quizScores[currentModuleId] ?? {};
  const chapterSections   = sectionsForModule.filter(s => s.hasVideo);
  const unlockedForModule = computeUnlocked(sectionsForModule, moduleQuizScores);

  const handleNavigate = (sectionId: string) => {
    onSectionNavigate(sectionId);
    onMobileClose?.(); // close drawer on mobile after selecting
  };

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className={`flex items-center border-b border-gray-200 ${collapsed ? 'justify-center py-4 px-2' : 'justify-between px-5 py-4'}`}>
        {!collapsed && (
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Course Syllabus</p>
        )}
        {/* On desktop: collapse toggle. On mobile drawer: close button */}
        <button
          onClick={() => { onMobileClose ? onMobileClose() : onCollapsedChange(!collapsed); }}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors flex-none"
          title={collapsed ? 'Expand' : 'Collapse'}
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

      {/* Section list */}
      <div className="flex-1 overflow-y-auto custom-scrollbar py-2">
        {sectionsForModule.map((section) => {
          const isUnlocked    = unlockedForModule.has(section.id);
          const isActive      = section.id === currentSectionId;
          const sectionScore  = moduleQuizScores[section.id] ?? 0;
          const isCompleted   = section.passingScore !== undefined && sectionScore >= section.passingScore;
          const isFinal       = section.id === 'final' || section.id.endsWith('_final');
          const chapterNum    = chapterSections.indexOf(section) + 1;
          const duration      = sectionDurations[section.id];
          const questionCount = section.questionCount ?? section.questions?.length ?? 0;

          // Collapsed icon view
          if (collapsed) {
            return (
              <button
                key={section.id}
                disabled={!isUnlocked}
                onClick={() => isUnlocked && handleNavigate(section.id)}
                title={section.title}
                className={`w-full flex items-center justify-center py-3 transition-colors relative
                  ${isActive ? 'text-accent' : isUnlocked ? 'text-gray-700 hover:text-accent' : 'text-gray-400 cursor-not-allowed'}`}
              >
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-accent rounded-r-full" />}
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center
                  ${isActive ? 'bg-accent/10 text-accent' : isUnlocked ? 'bg-gray-200 text-gray-700' : 'bg-gray-100 text-gray-400'}`}>
                  {!isUnlocked ? (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  ) : isCompleted ? (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : isFinal ? (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  ) : (
                    <span className="text-[10px] font-bold">{chapterNum}</span>
                  )}
                </span>
              </button>
            );
          }

          // Expanded row view
          return (
            <div key={section.id} className="px-3 py-0.5">
              <button
                disabled={!isUnlocked}
                onClick={() => isUnlocked && handleNavigate(section.id)}
                className={`w-full flex items-center gap-3 text-left px-3 py-3 rounded-xl transition-all
                  ${isActive ? 'bg-background' : isUnlocked ? 'hover:bg-gray-50' : 'opacity-60 cursor-not-allowed'}`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-none flex-shrink-0 transition-colors
                  ${isActive ? 'bg-highlight/20' : isCompleted ? 'bg-accent/15' : isUnlocked ? 'bg-gray-200' : 'bg-gray-100'}`}>
                  {isActive && section.hasVideo ? (
                    <svg className="w-3 h-3 text-highlight ml-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z" /></svg>
                  ) : isActive && isFinal ? (
                    <svg className="w-3 h-3 text-highlight" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  ) : isActive ? (
                    <svg className="w-3 h-3 text-highlight" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  ) : isCompleted ? (
                    <svg className="w-3 h-3 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : !isUnlocked ? (
                    <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  ) : isFinal ? (
                    <svg className="w-3 h-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  ) : !section.hasVideo ? (
                    <svg className="w-3 h-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  ) : (
                    <span className="text-[10px] font-bold text-gray-700">{chapterNum}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold leading-snug truncate ${isActive ? 'text-white' : 'text-gray-900'}`}>
                    {section.title}
                  </p>
                  {isFinal ? (
                    <p className={`text-[11px] mt-0.5 ${isActive ? 'text-highlight/70' : 'text-gray-500'}`}>
                      {questionCount > 0 ? `${questionCount} questions` : 'Final assessment'}
                    </p>
                  ) : !section.hasVideo ? (
                    <p className={`text-[11px] mt-0.5 ${isActive ? 'text-highlight/70' : 'text-gray-500'}`}>
                      {questionCount > 0 ? `${questionCount} questions` : 'Quiz'}
                    </p>
                  ) : duration ? (
                    <p className={`text-[11px] mt-0.5 ${isActive ? 'text-highlight/70' : 'text-gray-500'}`}>
                      {isActive ? `${duration} • Playing` : duration}
                    </p>
                  ) : null}
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </>
  );

  return (
    <>
      {/* ── Desktop sidebar (lg+): flex child, collapsible rail ── */}
      <aside className={`
        hidden lg:flex flex-none flex-col h-full z-40
        bg-white border-r border-gray-200 transition-all duration-300 ease-in-out
        ${collapsed ? 'w-16' : 'w-[250px]'}
      `}>
        <SidebarContent />
      </aside>

      {/* ── Mobile drawer (< lg): slide-in overlay ── */}
      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={onMobileClose}
        />
      )}
      {/* Drawer panel */}
      <aside className={`
        lg:hidden fixed top-0 left-0 h-full z-50 flex flex-col
        bg-white border-r border-gray-200
        w-[280px] transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Mobile drawer header with close */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Course Syllabus</p>
          <button
            onClick={onMobileClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar py-2">
          {/* Reuse the section list logic inline for drawer — always expanded */}
          {sectionsForModule.map((section) => {
            const isUnlocked    = unlockedForModule.has(section.id);
            const isActive      = section.id === currentSectionId;
            const sectionScore  = moduleQuizScores[section.id] ?? 0;
            const isCompleted   = section.passingScore !== undefined && sectionScore >= section.passingScore;
            const isFinal       = section.id === 'final' || section.id.endsWith('_final');
            const chapterNum    = chapterSections.indexOf(section) + 1;
            const duration      = sectionDurations[section.id];
            const questionCount = section.questionCount ?? section.questions?.length ?? 0;

            return (
              <div key={section.id} className="px-3 py-0.5">
                <button
                  disabled={!isUnlocked}
                  onClick={() => isUnlocked && handleNavigate(section.id)}
                  className={`w-full flex items-center gap-3 text-left px-3 py-3 rounded-xl transition-all
                    ${isActive ? 'bg-background' : isUnlocked ? 'hover:bg-gray-50' : 'opacity-60 cursor-not-allowed'}`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-none flex-shrink-0
                    ${isActive ? 'bg-highlight/20' : isCompleted ? 'bg-accent/15' : isUnlocked ? 'bg-gray-200' : 'bg-gray-100'}`}>
                    {isCompleted ? (
                      <svg className="w-3 h-3 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : !isUnlocked ? (
                      <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    ) : isActive && section.hasVideo ? (
                      <svg className="w-3 h-3 text-highlight ml-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z" /></svg>
                    ) : isFinal ? (
                      <svg className="w-3 h-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    ) : !section.hasVideo ? (
                      <svg className="w-3 h-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    ) : (
                      <span className="text-[10px] font-bold text-gray-700">{chapterNum}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold leading-snug truncate ${isActive ? 'text-white' : 'text-gray-900'}`}>
                      {section.title}
                    </p>
                    {isFinal ? (
                      <p className={`text-[11px] mt-0.5 ${isActive ? 'text-highlight/70' : 'text-gray-500'}`}>
                        {questionCount > 0 ? `${questionCount} questions` : 'Final assessment'}
                      </p>
                    ) : !section.hasVideo ? (
                      <p className={`text-[11px] mt-0.5 ${isActive ? 'text-highlight/70' : 'text-gray-500'}`}>
                        {questionCount > 0 ? `${questionCount} questions` : 'Quiz'}
                      </p>
                    ) : duration ? (
                      <p className={`text-[11px] mt-0.5 ${isActive ? 'text-highlight/70' : 'text-gray-500'}`}>
                        {isActive ? `${duration} • Playing` : duration}
                      </p>
                    ) : null}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
}