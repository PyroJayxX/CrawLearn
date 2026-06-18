import { LearningState, SectionId } from '../../types';

interface NavProps {
  sections: readonly any[];
  currentState: LearningState;
  onNavigate: (id: SectionId) => void;
}

export default function ModuleNavigator({ sections, currentState, onNavigate }: NavProps) {
  return (
    <nav className="flex flex-wrap gap-2 md:gap-4 justify-center items-center">
      {sections.map((section) => {
        const isUnlocked = currentState.unlockedSections.has(section.id);
        const isActive = currentState.currentSection === section.id;
        const isCompleted = (currentState.quizScores[section.id as SectionId] || 0) >= (section.passingScore || 0);

        return (
          <button
            key={section.id}
            disabled={!isUnlocked}
            onClick={() => onNavigate(section.id)}
            className={`
              px-4 py-2 flex items-center gap-2 rounded-lg font-medium transition-all duration-200
              ${isActive ? 'bg-highlight text-background shadow-[0_0_15px_var(--color-highlight)]' : 
                isUnlocked ? 'bg-accent/20 text-highlight hover:bg-accent/40' : 
                'bg-gray-800 text-gray-500 cursor-not-allowed'}
            `}
          >
            {!isUnlocked && (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            )}
            {section.title}
            {isCompleted && isUnlocked && !isActive && ' ✓'}
          </button>
        );
      })}
    </nav>
  );
}