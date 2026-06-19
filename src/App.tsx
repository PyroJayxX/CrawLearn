import { useState, useMemo } from 'react';
import { LearningState, ModuleConfig } from './types';
import ModuleNavigator from './components/layout/ModuleNavigator';
import CourseSidebar from './components/layout/CourseSidebar';
import QuizSection from './components/assessment/QuizSection';
import ModuleResults from './components/assessment/ModuleResults';
import FAQPanel from './components/shared/FAQPanel';
import LessonContainer from './components/layout/LessonContainer';
import { ch1Questions, ch2Questions, ch3Questions, finalQuestions } from './data/Module1Questions';

const COURSE_CONFIG: ModuleConfig[] = [
  {
    id: 'module1',
    title: 'Module 1',
    sections: [
      { id: 'ch1',      title: 'Chapter 1',       hasVideo: true,  passingScore: 3,  questions: ch1Questions },
      { id: 'ch1-quiz', title: 'Quiz 1',           hasVideo: false, passingScore: 3,  questions: ch1Questions },
      { id: 'ch2',      title: 'Chapter 2',        hasVideo: true,  passingScore: 3,  questions: ch2Questions },
      { id: 'ch2-quiz', title: 'Quiz 2',           hasVideo: false, passingScore: 3,  questions: ch2Questions },
      { id: 'ch3',      title: 'Chapter 3',        hasVideo: true,  passingScore: 3,  questions: ch3Questions },
      { id: 'ch3-quiz', title: 'Quiz 3',           hasVideo: false, passingScore: 3,  questions: ch3Questions },
      { id: 'final',    title: 'Final Assessment', hasVideo: false, passingScore: 12, questions: finalQuestions, questionCount: 15 },
    ],
  },
  ...Array.from({ length: 9 }, (_, i) => ({
    id: `module${i + 2}`,
    title: `Module ${i + 2}`,
    sections: [
      { id: 'ch1',   title: 'Chapter 1',       hasVideo: true,  passingScore: 3, questions: [] },
      { id: 'final', title: 'Final Assessment', hasVideo: false, passingScore: 5, questions: [] },
      { id: 'faq',   title: 'FAQs',             hasVideo: false },
    ],
  })),
];

const LS_KEY = 'crawlearn_scores';

function loadScores(): Record<string, Record<string, number>> {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) ?? '{}');
  } catch {
    return {};
  }
}

function saveScores(scores: Record<string, Record<string, number>>) {
  localStorage.setItem(LS_KEY, JSON.stringify(scores));
}

const buildInitialState = (): LearningState => {
  const unlockedSections: Record<string, Set<string>> = {};
  COURSE_CONFIG.forEach(mod => {
    unlockedSections[mod.id] = new Set(mod.sections.map(s => s.id));
  });
  // Hydrate quiz scores from localStorage
  const saved = loadScores();
  const quizScores: Record<string, Record<string, number>> = {};
  Object.entries(saved).forEach(([modId, sections]) => {
    quizScores[modId] = sections;
  });
  return {
    currentModuleId: 'module1',
    currentSectionId: 'ch1',
    subState: 'video',
    unlockedSections,
    quizScores,
    completedModules: new Set(COURSE_CONFIG.map(m => m.id)),
  };
};

export default function App() {
  const [state, setState] = useState<LearningState>(buildInitialState);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // Show results screen after final is submitted
  const [showResults, setShowResults] = useState(false);

  const currentModule = useMemo(() =>
    COURSE_CONFIG.find(m => m.id === state.currentModuleId),
  [state.currentModuleId]);

  const currentSection = useMemo(() =>
    currentModule?.sections.find(s => s.id === state.currentSectionId),
  [currentModule, state.currentSectionId]);

  const nextSection = useMemo(() => {
    const sections = (currentModule?.sections ?? []).filter(s => s.id !== 'faq');
    const idx = sections.findIndex(s => s.id === state.currentSectionId);
    return idx >= 0 && idx < sections.length - 1 ? sections[idx + 1] : null;
  }, [currentModule, state.currentSectionId]);

  const nextSectionTitle = useMemo(() => {
    if (!nextSection) return undefined;
    if (nextSection.id === 'final') return 'Final Assessment';
    return nextSection.title;
  }, [nextSection]);

  const handleModuleNavigate = (moduleId: string) => {
    const mod = COURSE_CONFIG.find(m => m.id === moduleId);
    if (!mod) return;
    setShowResults(false);
    setState(prev => ({
      ...prev,
      currentModuleId: moduleId,
      currentSectionId: mod.sections[0].id,
      subState: 'video',
    }));
  };

  const handleSectionNavigate = (sectionId: string) => {
    setShowResults(false);
    setState(prev => ({ ...prev, currentSectionId: sectionId, subState: 'video' }));
  };

  const handleQuizComplete = (score: number) => {
    const { currentModuleId, currentSectionId, quizScores } = state;
    const moduleScores = { ...(quizScores[currentModuleId] ?? {}), [currentSectionId]: score };
    const updatedScores = { ...quizScores, [currentModuleId]: moduleScores };

    // Persist to localStorage
    const allSaved = loadScores();
    allSaved[currentModuleId] = moduleScores;
    saveScores(allSaved);

    setState(prev => ({ ...prev, quizScores: updatedScores }));

    if (currentSectionId === 'final') {
      // Show results screen instead of advancing
      setShowResults(true);
    } else if (nextSection) {
      setState(prev => ({
        ...prev,
        quizScores: updatedScores,
        currentSectionId: nextSection.id,
        subState: 'video',
      }));
    }
  };

  // Gather per-section scores for the results screen
  const moduleScores = state.quizScores[state.currentModuleId] ?? {};

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <header className="flex-none h-18 bg-background border-b border-white/5 relative z-50">
        <ModuleNavigator
          modules={COURSE_CONFIG}
          currentState={state}
          onModuleNavigate={handleModuleNavigate}
        />
      </header>

      <div className="flex flex-1 overflow-hidden">
        <CourseSidebar
          modules={COURSE_CONFIG}
          currentState={state}
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
          onSectionNavigate={handleSectionNavigate}
        />

        <main className="flex-1 overflow-y-auto bg-[#f6f8fa] custom-scrollbar">
          <div className="mx-auto py-6 px-6 md:py-8 md:px-20">
            {showResults ? (
              <ModuleResults
                moduleTitle="Module 1"
                scores={{
                  'Quiz 1':           { score: moduleScores['ch1-quiz'] ?? 0, total: ch1Questions.length },
                  'Quiz 2':           { score: moduleScores['ch2-quiz'] ?? 0, total: ch2Questions.length },
                  'Quiz 3':           { score: moduleScores['ch3-quiz'] ?? 0, total: ch3Questions.length },
                  'Final Assessment': { score: moduleScores['final']    ?? 0, total: finalQuestions.length },
                }}
                onReviewModule={() => {
                  setShowResults(false);
                  setState(prev => ({ ...prev, currentSectionId: 'ch1', subState: 'video' }));
                }}
              />
            ) : currentSection?.id === 'faq' ? (
              <FAQPanel />
            ) : (
              <>
                {state.subState === 'video' && currentSection?.hasVideo ? (
                  <LessonContainer
                    lessonId={state.currentSectionId}
                    onComplete={() => {
                      const quizSectionId = `${state.currentSectionId}-quiz`;
                      const hasQuizSection = currentModule?.sections.some(s => s.id === quizSectionId);
                      if (hasQuizSection) {
                        setState(prev => ({ ...prev, currentSectionId: quizSectionId, subState: 'quiz' }));
                      } else {
                        setState(prev => ({ ...prev, subState: 'quiz' }));
                      }
                    }}
                  />
                ) : (
                  <div className="max-w-3xl mx-auto">
                    <QuizSection
                      sectionId={state.currentSectionId}
                      questions={currentSection?.questions ?? []}
                      nextSectionTitle={nextSectionTitle}
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