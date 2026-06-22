import { useState, useMemo, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { LearningState, ModuleConfig } from './types';
import ModuleNavigator from './components/layout/ModuleNavigator';
import CourseSidebar from './components/layout/CourseSidebar';
import QuizSection from './components/assessment/QuizSection';
import ModuleResults from './components/assessment/ModuleResults';
import FAQPanel from './components/shared/FAQPanel';
import LessonContainer from './components/layout/LessonContainer';
import AuthScreen from './components/auth/AuthScreen';
import { ch1Questions, ch2Questions, ch3Questions, finalQuestions } from './data/Module1Questions';
import { supabase } from './lib/supabase';
import { loadUserProgress, saveQuizScore, saveVideoComplete } from './lib/db';

// ─── Course config ─────────────────────────────────────────────────────────────

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

// ─── Default state ─────────────────────────────────────────────────────────────

function buildDefaultState(): LearningState {
  const unlockedSections: Record<string, Set<string>> = {};
  COURSE_CONFIG.forEach(mod => {
    unlockedSections[mod.id] = new Set(mod.sections.map(s => s.id));
  });
  return {
    currentModuleId:  'module1',
    currentSectionId: 'ch1',
    subState:         'video',
    unlockedSections,
    quizScores:       {},
    completedModules: new Set(),
  };
}

// ─── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [session, setSession]                   = useState<Session | null>(null);
  const [sessionLoading, setSessionLoading]     = useState(true);
  const [progressLoading, setProgressLoading]   = useState(false);

  const [state, setState]                       = useState<LearningState>(buildDefaultState);
  const [sectionAttempts, setSectionAttempts]   = useState<Record<string, Record<string, number>>>({});
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showResults, setShowResults]           = useState(false);

  // ── 1. Restore session on mount ───────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setSessionLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── 2. Load progress on session ───────────────────────────────────────────
  useEffect(() => {
    if (!session) return;

    setProgressLoading(true);
    loadUserProgress(session.user.id)
      .then(({ quizScores, completedModules, attempts }) => {
        setState(prev => ({ ...prev, quizScores, completedModules }));
        setSectionAttempts(attempts);
      })
      .catch(err => console.error('Failed to load progress:', err))
      .finally(() => setProgressLoading(false));
  }, [session]);

  // ── Derived state ─────────────────────────────────────────────────────────

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

  const currentFinalAttempts = sectionAttempts[state.currentModuleId]?.['final'] ?? 0;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleModuleNavigate = (moduleId: string) => {
    const mod = COURSE_CONFIG.find(m => m.id === moduleId);
    if (!mod) return;
    setShowResults(false);
    setState(prev => ({
      ...prev,
      currentModuleId:  moduleId,
      currentSectionId: mod.sections[0].id,
      subState:         'video',
    }));
  };

  const handleSectionNavigate = (sectionId: string) => {
    setShowResults(false);
    setState(prev => ({ ...prev, currentSectionId: sectionId, subState: 'video' }));
  };

  const handleQuizComplete = async (score: number) => {
    const { currentModuleId, currentSectionId } = state;
    const passingScore     = currentSection?.passingScore ?? 0;
    const previousAttempts = sectionAttempts[currentModuleId]?.[currentSectionId] ?? 0;
    const existingScore    = state.quizScores[currentModuleId]?.[currentSectionId] ?? -1;

    // Only persist the better score — never overwrite a pass with a fail
    const scoreToPersist = Math.max(score, existingScore);

    const updatedQuizScores = {
      ...state.quizScores,
      [currentModuleId]: {
        ...(state.quizScores[currentModuleId] ?? {}),
        [currentSectionId]: scoreToPersist,
      },
    };

    const updatedAttempts = {
      ...sectionAttempts,
      [currentModuleId]: {
        ...(sectionAttempts[currentModuleId] ?? {}),
        [currentSectionId]: previousAttempts + 1,
      },
    };

    const newCompletedModules = new Set(state.completedModules);
    if (currentSectionId === 'final' && scoreToPersist >= passingScore) {
      newCompletedModules.add(currentModuleId);
    }

    setState(prev => ({
      ...prev,
      quizScores:       updatedQuizScores,
      completedModules: newCompletedModules,
    }));
    setSectionAttempts(updatedAttempts);

    // ── Persist to Supabase ──────────────────────────────────────────────────
    if (session) {
      try {
        await saveQuizScore({
          userId:           session.user.id,
          moduleId:         currentModuleId,
          sectionId:        currentSectionId,
          score:            scoreToPersist,
          passingScore,
          previousAttempts,
        });
      } catch (err) {
        console.error('Failed to save quiz score:', err);
      }
    }

    // ── Navigate ─────────────────────────────────────────────────────────────
    if (currentSectionId === 'final') {
      setState(prev => ({ ...prev, completedModules: newCompletedModules }));
      setShowResults(true);
    } else {
      const passed = scoreToPersist >= passingScore;
      if (passed && nextSection) {
        setState(prev => ({
          ...prev,
          quizScores:       updatedQuizScores,
          completedModules: newCompletedModules,
          currentSectionId: nextSection.id,
          subState:         'video',
        }));
      }
      // If failed: stay on current section
    }
  };

  const handleVideoComplete = async (lessonId: string) => {
    if (session) {
      await saveVideoComplete(session.user.id, state.currentModuleId, lessonId);
    }
    const quizSectionId  = `${lessonId}-quiz`;
    const hasQuizSection = currentModule?.sections.some(s => s.id === quizSectionId);
    if (hasQuizSection) {
      setState(prev => ({ ...prev, currentSectionId: quizSectionId, subState: 'quiz' }));
    } else {
      setState(prev => ({ ...prev, subState: 'quiz' }));
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setState(buildDefaultState());
    setSectionAttempts({});
    setShowResults(false);
  };

  // ── Auth / loading gates ───────────────────────────────────────────────────

  if (sessionLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f6f8fa]">
        <span className="text-sm text-gray-400">Loading…</span>
      </div>
    );
  }

  if (!session) {
    return <AuthScreen onSuccess={() => {}} />;
  }

  if (progressLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f6f8fa]">
        <span className="text-sm text-gray-400">Loading your progress…</span>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  const moduleScores = state.quizScores[state.currentModuleId] ?? {};

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <header className="flex-none h-18 bg-background border-b border-white/5 relative z-50">
        <ModuleNavigator
          modules={COURSE_CONFIG}
          currentState={state}
          onModuleNavigate={handleModuleNavigate}
          onSignOut={handleSignOut}
          userName={
            session.user.user_metadata?.full_name as string | undefined
            ?? session.user.email
          }
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
          <div className="mx-auto py-6 px-6 md:py-8 md:px-10">
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
                    onComplete={() => handleVideoComplete(state.currentSectionId)}
                  />
                ) : (
                  <div className="max-w-3xl mx-auto">
                    <QuizSection
                      sectionId={state.currentSectionId}
                      questions={currentSection?.questions ?? []}
                      nextSectionTitle={nextSectionTitle}
                      previousAttempts={
                        state.currentSectionId === 'final' ? currentFinalAttempts : 0
                      }
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