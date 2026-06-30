import { useState, useMemo, useEffect, useRef } from 'react';
import { Session } from '@supabase/supabase-js';
import { LearningState, ModuleConfig, Question } from './types';
import ModuleNavigator from './components/layout/ModuleNavigator';
import CourseSidebar from './components/layout/CourseSidebar';
import QuizSection from './components/assessment/QuizSection';
import ModuleResults from './components/assessment/ModuleResults';
import FAQPanel from './components/shared/FAQPanel';
import LessonContainer from './components/layout/LessonContainer';
import AuthScreen from './components/auth/AuthScreen';
import OnboardingModal from './components/auth/OnboardingModal';
import Dashboard from './components/layout/Dashboard';
import LandingPage from './components/layout/LandingPage';
import {
  mod1FinalQuestions,
  mod1Ch1Quiz,
  mod1Ch2Quiz,
  mod1Ch3Quiz,
} from './data/Module1Questions';
import {
  mod2Ch1Quiz,
  mod2Ch2Quiz,
  mod2Ch3Quiz,
  mod2FinalQuestions,
} from './data/Module2Questions';
import { supabase } from './lib/supabase';
import { loadUserProgress, loadUserProfile, saveDisplayName, saveQuizScore, saveVideoComplete } from './lib/db';
import InteractiveQuizSection from './components/assessment/InteractiveQuizSection';
import { InteractiveQuizQuestion } from './data/InteractiveQuizTypes';

const COURSE_CONFIG: ModuleConfig[] = [
  {
    id: 'module1',
    title: 'Module 1',
    sections: [
      { id: 'ch1',      title: 'Chapter 1',       hasVideo: true,  passingScore: 3,  questions: mod1Ch1Quiz },
      { id: 'ch1-quiz', title: 'Quiz 1',           hasVideo: false, passingScore: 3,  questions: mod1Ch1Quiz },
      { id: 'ch2',      title: 'Chapter 2',        hasVideo: true,  passingScore: 3,  questions: mod1Ch2Quiz },
      { id: 'ch2-quiz', title: 'Quiz 2',           hasVideo: false, passingScore: 3,  questions: mod1Ch2Quiz },
      { id: 'ch3',      title: 'Chapter 3',        hasVideo: true,  passingScore: 3,  questions: mod1Ch3Quiz },
      { id: 'ch3-quiz', title: 'Quiz 3',           hasVideo: false, passingScore: 3,  questions: mod1Ch3Quiz },
      { id: 'final',    title: 'Final Assessment', hasVideo: false, passingScore: 12, questions: mod1FinalQuestions, questionCount: 15 },
    ],
  },
  {
    id: 'module2',
    title: 'Module 2',
    sections: [
      { id: 'mod2_ch1',      title: 'Chapter 1',       hasVideo: true,  passingScore: 3,  questions: mod2Ch1Quiz },
      { id: 'mod2_ch1-quiz', title: 'Quiz 1',           hasVideo: false, passingScore: 3,  questions: mod2Ch1Quiz },
      { id: 'mod2_ch2',      title: 'Chapter 2',        hasVideo: true,  passingScore: 3,  questions: mod2Ch2Quiz },
      { id: 'mod2_ch2-quiz', title: 'Quiz 2',           hasVideo: false, passingScore: 3,  questions: mod2Ch2Quiz },
      { id: 'mod2_ch3',      title: 'Chapter 3',        hasVideo: true,  passingScore: 3,  questions: mod2Ch3Quiz },
      { id: 'mod2_ch3-quiz', title: 'Quiz 3',           hasVideo: false, passingScore: 3,  questions: mod2Ch3Quiz },
      { id: 'mod2_final',    title: 'Final Assessment', hasVideo: false, passingScore: 12, questions: mod2FinalQuestions, questionCount: 15 },
    ],
  },
  ...Array.from({ length: 8 }, (_, i) => {
    const n = i + 3;
    return {
      id: `module${n}`,
      title: `Module ${n}`,
      sections: [
        { id: `mod${n}_ch1`,   title: 'Chapter 1',        hasVideo: true,  passingScore: 3, questions: [] },
        { id: `mod${n}_final`, title: 'Final Assessment',  hasVideo: false, passingScore: 5, questions: [] },
      ],
    };
  }),
];

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

export default function App() {
  const [session,         setSession]         = useState<Session | null>(null);
  const [sessionLoading,  setSessionLoading]  = useState(true);
  const [minLoadDone,     setMinLoadDone]     = useState(false);
  const hasLoadedOnce                         = useRef(false);

  const [displayName,     setDisplayName]     = useState<string | null>(null);
  const [showOnboarding,  setShowOnboarding]  = useState(false);

  // Auth flow
  const [showAuth,        setShowAuth]        = useState(false);
  const [authMode,        setAuthMode]        = useState<'login' | 'signup'>('signup');

  const [state,            setState]            = useState<LearningState>(buildDefaultState);
  const [sectionAttempts,  setSectionAttempts]  = useState<Record<string, Record<string, number>>>({});
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showResults,      setShowResults]      = useState(false);
  const [showDashboard,    setShowDashboard]    = useState(true);

  // ── Minimum loading time ──────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setMinLoadDone(true), 800);
    return () => clearTimeout(t);
  }, []);

  // ── Session ───────────────────────────────────────────────────────────────
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

  // ── Load progress + profile ───────────────────────────────────────────────
  useEffect(() => {
    if (!session) return;
    if (hasLoadedOnce.current) return;
    hasLoadedOnce.current = true;

    Promise.all([
      loadUserProgress(session.user.id),
      loadUserProfile(session.user.id),
    ]).then(([progress, profile]) => {
      setState(prev => ({ ...prev, quizScores: progress.quizScores, completedModules: progress.completedModules }));
      setSectionAttempts(progress.attempts);

      if (!profile?.displayName) {
        setShowOnboarding(true);
      } else {
        setDisplayName(profile.displayName);
      }
    }).catch(err => console.error('Failed to load:', err));
  }, [session]);

  // ── Derived ───────────────────────────────────────────────────────────────

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
    if (nextSection.id.endsWith('final')) return 'Final Assessment';
    return nextSection.title;
  }, [nextSection]);

  const currentFinalAttempts =
    sectionAttempts[state.currentModuleId]?.[state.currentSectionId] ?? 0;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleOnboardingSubmit = async (name: string) => {
    setDisplayName(name);
    setShowOnboarding(false);
    if (session) {
      try {
        await saveDisplayName(session.user.id, name);
      } catch (err) {
        console.error('Failed to save display name:', err);
      }
    }
  };

  const handleModuleNavigate = (moduleId: string) => {
    const mod = COURSE_CONFIG.find(m => m.id === moduleId);
    if (!mod) return;
    setShowResults(false);
    setShowDashboard(false);
    setState(prev => ({
      ...prev,
      currentModuleId:  moduleId,
      currentSectionId: mod.sections[0].id,
      subState:         'video',
    }));
  };

  const handleSectionNavigate = (sectionId: string) => {
    setShowResults(false);
    setShowDashboard(false);
    setState(prev => ({ ...prev, currentSectionId: sectionId, subState: 'video' }));
  };

  const handleDashboardNavigate = (moduleId: string, sectionId: string) => {
    setShowDashboard(false);
    setShowResults(false);
    setState(prev => ({ ...prev, currentModuleId: moduleId, currentSectionId: sectionId, subState: 'video' }));
  };

  const handleQuizComplete = async (score: number) => {
    const { currentModuleId, currentSectionId } = state;
    const passingScore     = currentSection?.passingScore ?? 0;
    const previousAttempts = sectionAttempts[currentModuleId]?.[currentSectionId] ?? 0;
    const existingScore    = state.quizScores[currentModuleId]?.[currentSectionId] ?? -1;
    const scoreToPersist   = Math.max(score, existingScore);

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
    if (currentSectionId.endsWith('final') && scoreToPersist >= passingScore) {
      newCompletedModules.add(currentModuleId);
    }

    setState(prev => ({
      ...prev,
      quizScores:       updatedQuizScores,
      completedModules: newCompletedModules,
    }));
    setSectionAttempts(updatedAttempts);

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

    if (currentSectionId.endsWith('final')) {
      setShowResults(true);
    }
  };

  const handleProceedToNext = () => {
    if (nextSection) {
      setState(prev => ({
        ...prev,
        currentSectionId: nextSection.id,
        subState:         'video',
      }));
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
    hasLoadedOnce.current = false;
    setState(buildDefaultState());
    setSectionAttempts({});
    setShowResults(false);
    setShowDashboard(true);
    setDisplayName(null);
    setShowOnboarding(false);
    setShowAuth(false);
  };

  // ── Gates ─────────────────────────────────────────────────────────────────

  const isLoading = sessionLoading || !minLoadDone;

  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-6 bg-background">
        <img src="/logo_2.png" alt="CrawLearn" className="h-12 w-auto opacity-90" />
        <div className="flex items-center gap-2">
          {[0, 150, 300].map((delay, i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-highlight animate-bounce"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
        <p className="text-xs uppercase tracking-widest text-white/30 font-semibold">
          Starting up…
        </p>
      </div>
    );
  }

  if (!session) {
    if (showAuth) {
      return (
        <AuthScreen
          mode={authMode}
          onSuccess={() => setShowAuth(false)}
          onBack={() => setShowAuth(false)}
        />
      );
    }
    return (
      <LandingPage
        onLogin={() => { setAuthMode('login'); setShowAuth(true); }}
        onSignup={() => { setAuthMode('signup'); setShowAuth(true); }}
      />
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  const moduleScores       = state.quizScores[state.currentModuleId] ?? {};
  const currentModuleIndex = COURSE_CONFIG.findIndex(m => m.id === state.currentModuleId);
  const nextModule         = COURSE_CONFIG[currentModuleIndex + 1] ?? null;
  const finalPassed        = state.completedModules.has(state.currentModuleId);
  const isFinalSection     = state.currentSectionId.endsWith('final');
  const userName           = displayName ?? session.user.user_metadata?.full_name ?? session.user.email;

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">

      {showOnboarding && (
        <OnboardingModal onSubmit={handleOnboardingSubmit} />
      )}

      <header className="flex-none h-18 bg-background border-b border-white/5 relative z-50">
        <ModuleNavigator
          modules={COURSE_CONFIG}
          currentState={state}
          onModuleNavigate={handleModuleNavigate}
          onSignOut={handleSignOut}
          onHome={() => { setShowDashboard(true); setShowResults(false); }}
          userName={userName}
        />
      </header>

      <div className="flex flex-1 overflow-hidden">
        {!showDashboard && (
          <CourseSidebar
            modules={COURSE_CONFIG}
            currentState={state}
            collapsed={sidebarCollapsed}
            onCollapsedChange={setSidebarCollapsed}
            onSectionNavigate={handleSectionNavigate}
          />
        )}

        <main className="flex-1 overflow-y-auto bg-[#f6f8fa] custom-scrollbar">
          <div className="mx-auto py-6 px-6 md:py-8 md:px-10">
            {showDashboard ? (
              <Dashboard
                modules={COURSE_CONFIG}
                currentState={state}
                userName={userName}
                onNavigate={handleDashboardNavigate}
              />
            ) : showResults ? (
              <ModuleResults
                moduleTitle={currentModule?.title ?? 'Module'}
                scores={
                  (currentModule?.sections ?? []).reduce((acc, sec) => {
                    if ((sec.id.endsWith('-quiz') || sec.id.endsWith('final')) && (sec.questions?.length ?? 0) > 0) {
                      acc[sec.title] = {
                        score:        moduleScores[sec.id] ?? 0,
                        total:        sec.questions?.length ?? 0,
                        passingScore: sec.passingScore,
                      };
                    }
                    return acc;
                  }, {} as Record<string, { score: number; total: number; passingScore?: number }>)
                }
                nextModuleTitle={nextModule?.title}
                nextModuleLocked={!finalPassed}
                onReviewModule={() => {
                  setShowResults(false);
                  setState(prev => ({
                    ...prev,
                    currentSectionId: currentModule?.sections[0]?.id ?? 'ch1',
                    subState: 'video',
                  }));
                }}
                onNextModule={nextModule ? () => {
                  setShowResults(false);
                  handleModuleNavigate(nextModule.id);
                } : undefined}
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
                    {currentSection?.questions?.length && 'type' in (currentSection.questions[0] ?? {}) ? (
                      <InteractiveQuizSection
                        key={state.currentSectionId}
                        sectionId={state.currentSectionId}
                        questions={currentSection.questions as InteractiveQuizQuestion[]}
                        nextSectionTitle={nextSectionTitle}
                        onComplete={handleQuizComplete}
                        onProceed={handleProceedToNext}
                      />
                    ) : (
                      <QuizSection
                        key={state.currentSectionId}
                        sectionId={state.currentSectionId}
                        questions={(currentSection?.questions ?? []) as Question[]}
                        nextSectionTitle={nextSectionTitle}
                        previousAttempts={isFinalSection ? currentFinalAttempts : 0}
                        alreadyPassed={
                          isFinalSection
                            ? (state.quizScores[state.currentModuleId]?.[state.currentSectionId] ?? -1) >= (currentSection?.passingScore ?? 0)
                            : false
                        }
                        onComplete={handleQuizComplete}
                        onProceed={handleProceedToNext}
                      />
                    )}
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