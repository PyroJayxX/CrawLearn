import { useState, useMemo } from 'react';
import { LearningState, ModuleConfig } from './types';
import ModuleNavigator from './components/layout/ModuleNavigator';
import QuizSection from './components/assessment/QuizSection';
import FAQPanel from './components/shared/FAQPanel';
import LessonContainer from './components/layout/LessonContainer';

const COURSE_CONFIG: ModuleConfig[] = [
  {
    id: 'module1',
    title: 'Module 1',
    sections: [
      { id: 'ch1', title: 'Chapter 1', hasVideo: true, passingScore: 3, questions: [] },
      { id: 'ch2', title: 'Chapter 2', hasVideo: true, passingScore: 3, questions: [] },
      { id: 'ch3', title: 'Chapter 3', hasVideo: true, passingScore: 3, questions: [] },
      { id: 'final', title: 'Final Assessment', hasVideo: false, passingScore: 12, questions: [] },
      { id: 'faq', title: 'FAQs', hasVideo: false },
    ],
  },
  // Modules 2–10 — locked until module1 is completed
  ...Array.from({ length: 9 }, (_, i) => ({
    id: `module${i + 2}`,
    title: `Module ${i + 2}`,
    sections: [
      { id: 'ch1', title: 'Chapter 1', hasVideo: true, passingScore: 3, questions: [] },
      { id: 'final', title: 'Final Assessment', hasVideo: false, passingScore: 5, questions: [] },
      { id: 'faq', title: 'FAQs', hasVideo: false },
    ],
  })),
];

const buildInitialState = (): LearningState => {
  const unlockedSections: Record<string, Set<string>> = {};
  COURSE_CONFIG.forEach(mod => {
    unlockedSections[mod.id] = new Set([mod.sections[0].id, 'faq']);
  });

  return {
    currentModuleId: 'module1',
    currentSectionId: 'ch1',
    subState: 'video',
    unlockedSections,
    quizScores: {},
    completedModules: new Set(),
  };
};

export default function App() {
  const [state, setState] = useState<LearningState>(buildInitialState);

  const currentModule = useMemo(() =>
    COURSE_CONFIG.find(m => m.id === state.currentModuleId),
  [state.currentModuleId]);

  const currentSection = useMemo(() =>
    currentModule?.sections.find(s => s.id === state.currentSectionId),
  [currentModule, state.currentSectionId]);

  const unlockedForModule = state.unlockedSections[state.currentModuleId] ?? new Set();

  const handleModuleNavigate = (moduleId: string) => {
    const mod = COURSE_CONFIG.find(m => m.id === moduleId);
    if (!mod) return;

    // Module 1 always accessible; others need previous module completed
    const moduleIndex = COURSE_CONFIG.findIndex(m => m.id === moduleId);
    const prevModule = COURSE_CONFIG[moduleIndex - 1];
    const isUnlocked = moduleIndex === 0 || state.completedModules.has(prevModule?.id);

    if (!isUnlocked) {
      alert(`Complete ${prevModule.title} to unlock this module.`);
      return;
    }

    setState(prev => ({
      ...prev,
      currentModuleId: moduleId,
      currentSectionId: mod.sections[0].id,
      subState: 'video',
    }));
  };

  const handleSectionNavigate = (sectionId: string) => {
    if (unlockedForModule.has(sectionId)) {
      setState(prev => ({ ...prev, currentSectionId: sectionId, subState: 'video' }));
    }
  };

  const handleQuizComplete = (score: number) => {
    const { currentModuleId, currentSectionId, quizScores } = state;
    const section = currentModule?.sections.find(s => s.id === currentSectionId);
    if (!section) return;

    const moduleScores = { ...(quizScores[currentModuleId] ?? {}), [currentSectionId]: score };
    const newUnlocked = new Set(state.unlockedSections[currentModuleId]);
    const newCompletedModules = new Set(state.completedModules);

    const passed = section.passingScore !== undefined && score >= section.passingScore;

    if (passed) {
      const sections = currentModule!.sections;
      const currentIndex = sections.findIndex(s => s.id === currentSectionId);
      const next = sections[currentIndex + 1];
      if (next) newUnlocked.add(next.id);

      // If final assessment passed, mark module complete
      if (currentSectionId === 'final') {
        newCompletedModules.add(currentModuleId);
      }
    }

    setState(prev => ({
      ...prev,
      quizScores: { ...prev.quizScores, [currentModuleId]: moduleScores },
      unlockedSections: { ...prev.unlockedSections, [currentModuleId]: newUnlocked },
      completedModules: newCompletedModules,
    }));
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-white overflow-hidden relative">
    <header className="flex-none border-b border-accent/30 relative z-50 isolate">
        <ModuleNavigator
          modules={COURSE_CONFIG}
          currentState={state}
          onModuleNavigate={handleModuleNavigate}
          onSectionNavigate={handleSectionNavigate}
        />
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center relative z-10 custom-scrollbar">
        <div className="w-full max-w-[95rem] px-4">
          {currentSection?.id === 'faq' ? (
            <FAQPanel />
          ) : (
            <>
              {state.subState === 'video' && currentSection?.hasVideo ? (
                <LessonContainer
                  lessonId={state.currentSectionId}
                  onComplete={() => setState(prev => ({ ...prev, subState: 'quiz' }))}
                />
              ) : (
                <div className="max-w-3xl mx-auto">
                  <QuizSection
                    sectionId={state.currentSectionId}
                    questions={currentSection?.questions ?? []}
                    onComplete={handleQuizComplete}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}