import { useState, useMemo } from 'react';
import { LearningState, ModuleConfig } from './types';
import ModuleNavigator from './components/layout/ModuleNavigator';
import CourseSidebar from './components/layout/CourseSidebar';
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
  // sidebarCollapsed lives here so main margin stays in sync
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const currentModule = useMemo(() =>
    COURSE_CONFIG.find(m => m.id === state.currentModuleId),
  [state.currentModuleId]);

  const currentSection = useMemo(() =>
    currentModule?.sections.find(s => s.id === state.currentSectionId),
  [currentModule, state.currentSectionId]);

  const handleModuleNavigate = (moduleId: string) => {
    const mod = COURSE_CONFIG.find(m => m.id === moduleId);
    if (!mod) return;
    const moduleIndex = COURSE_CONFIG.findIndex(m => m.id === moduleId);
    const prevModule = COURSE_CONFIG[moduleIndex - 1];
    const isUnlocked = moduleIndex === 0 || state.completedModules.has(prevModule?.id);
    if (!isUnlocked) return;
    setState(prev => ({
      ...prev,
      currentModuleId: moduleId,
      currentSectionId: mod.sections[0].id,
      subState: 'video',
    }));
  };

  const handleSectionNavigate = (sectionId: string) => {
    const unlocked = state.unlockedSections[state.currentModuleId] ?? new Set();
    if (unlocked.has(sectionId)) {
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
      if (currentSectionId === 'final') newCompletedModules.add(currentModuleId);
    }
    setState(prev => ({
      ...prev,
      quizScores: { ...prev.quizScores, [currentModuleId]: moduleScores },
      unlockedSections: { ...prev.unlockedSections, [currentModuleId]: newUnlocked },
      completedModules: newCompletedModules,
    }));
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {/* Navbar */}
      <header className="flex-none h-18 bg-background border-b border-white/5 relative z-50">
        <ModuleNavigator
          modules={COURSE_CONFIG}
          currentState={state}
          onModuleNavigate={handleModuleNavigate}
        />
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — notifies App when collapsed so main margin stays in sync */}
        <CourseSidebar
          modules={COURSE_CONFIG}
          currentState={state}
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
          onSectionNavigate={handleSectionNavigate}
        />

        {/* Main content — margin driven by lifted collapsed state */}
          <main className="flex-1 overflow-y-auto bg-[#f6f8fa] custom-scrollbar">
          <div className="mx-auto py-6 px-6 md:py-8 md:px-20">
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
    </div>
  );
}