import { LearningState, ModuleConfig } from '../../types';

interface CourseSidebarProps {
  modules: ModuleConfig[];
  currentState: LearningState;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  onSectionNavigate: (sectionId: string) => void;
  // Map of sectionId -> real duration string from ReactPlayer e.g. "5:01"
  sectionDurations?: Record<string, string>;
}

export default function CourseSidebar({
  modules,
  currentState,
  collapsed,
  onCollapsedChange,
  onSectionNavigate,
  sectionDurations = {},
}: CourseSidebarProps) {
  const { currentModuleId, currentSectionId, unlockedSections, quizScores } = currentState;
  const currentModule = modules.find(m => m.id === currentModuleId);

  // Filter out faq — it's now inline. Keep video chapters + final assessment only.
  const sectionsForModule = (currentModule?.sections ?? []).filter(s => s.id !== 'faq');
  const unlockedForModule = unlockedSections[currentModuleId] ?? new Set();

  // Chapter sections are those with a video; final is the one without
  const chapterSections = sectionsForModule.filter(s => s.hasVideo);

  return (
    <aside
      className={`
        flex-none h-full z-40 flex flex-col
        bg-white border-r border-gray-200 transition-all duration-300 ease-in-out
        ${collapsed ? 'w-16' : 'w-[240px]'}
      `}
    >
      {/* ── Header ── */}
      <div className={`flex items-center border-b border-gray-200 ${collapsed ? 'justify-center py-4 px-2' : 'justify-between px-5 py-4'}`}>
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
          const isFinal = !section.hasVideo;
          // Chapter number — only count video sections
          const chapterNum = chapterSections.indexOf(section) + 1;
          // Duration: real from player if available, else nothing
          const duration = sectionDurations[section.id];
          // Question count: prefer explicit questionCount, then questions array length
          const questionCount = section.questionCount ?? section.questions?.length ?? 0;

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
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center
                  ${isActive ? 'bg-accent/10 text-accent' : isUnlocked ? 'bg-gray-100 text-gray-600' : 'bg-gray-50 text-gray-300'}`}>
                  {!isUnlocked ? (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  ) : isCompleted ? (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : isFinal ? (
                    // Trophy/star icon for final assessment
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

          // ── Expanded row view ──
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
                  : 'w-full px-4 py-3 opacity-40 cursor-not-allowed'}`}
            >
              {/* Icon */}
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-none flex-shrink-0 transition-colors
                ${isActive ? 'bg-highlight/20' : isCompleted ? 'bg-accent/15' : isUnlocked ? 'bg-gray-100' : 'bg-gray-50'}`}
              >
                {isActive ? (
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
                ) : isFinal ? (
                  // Star icon for final assessment
                  <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                ) : !section.hasVideo ? (
                  // Pencil icon for chapter quizzes
                  <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                ) : (
                  <span className="text-[10px] font-bold text-gray-500">{chapterNum}</span>
                )}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold leading-snug truncate
                  ${isActive ? 'text-white' : isUnlocked ? 'text-gray-800' : 'text-gray-400'}`}>
                  {section.title}
                </p>
                {/* Subtext: duration for video chapters, question count for quizzes */}
                {isFinal ? (
                  <p className={`text-[11px] mt-0.5 ${isActive ? 'text-highlight/70' : 'text-gray-400'}`}>
                    {questionCount > 0 ? `${questionCount} questions` : 'Final assessment'}
                  </p>
                ) : !section.hasVideo ? (
                  <p className={`text-[11px] mt-0.5 ${isActive ? 'text-highlight/70' : 'text-gray-400'}`}>
                    {questionCount > 0 ? `${questionCount} questions` : 'Quiz'}
                  </p>
                ) : duration ? (
                  <p className={`text-[11px] mt-0.5 ${isActive ? 'text-highlight/70' : 'text-gray-400'}`}>
                    {isActive ? `${duration} • Playing` : duration}
                  </p>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}