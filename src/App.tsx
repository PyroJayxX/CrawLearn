import { useState, useMemo } from 'react';
import { LearningState, SectionConfig, SectionId, SubState } from './types';
import ModuleNavigator from './components/layout/ModuleNavigator';
import QuizSection from './components/assessment/QuizSection';
import FAQPanel from './components/shared/FAQPanel';
import LessonContainer from './components/layout/LessonContainer'; 

// Mock Config - In reality, this might be fetched or separated into a config file
const MODULE_CONFIG: SectionConfig[] = [
  { id: 'ch1', title: 'Chapter 1', hasVideo: true, passingScore: 3 },
  { id: 'ch2', title: 'Chapter 2', hasVideo: true, passingScore: 3, prerequisite: 'ch1' },
  { id: 'ch3', title: 'Chapter 3', hasVideo: true, passingScore: 3, prerequisite: 'ch2' },
  { id: 'final', title: 'Final Assessment', hasVideo: false, passingScore: 12, prerequisite: 'ch3' },
  { id: 'faq', title: 'FAQs', hasVideo: false }
];


export default function App() {
  const [state, setState] = useState<LearningState>({
    currentSection: 'ch1',
    subState: 'video',
    unlockedSections: new Set(['ch1', 'faq']),
    quizScores: {} as Record<SectionId, number>,
  });

  const currentConfig = useMemo(() => 
    MODULE_CONFIG.find(c => c.id === state.currentSection), 
  [state.currentSection]);

  const handleNavigation = (id: SectionId) => {
    if (state.unlockedSections.has(id)) {
      setState(prev => ({ ...prev, currentSection: id, subState: 'video' }));
    }
  };

  const handleQuizComplete = (score: number) => {
    const { currentSection, unlockedSections, quizScores } = state;
    const config = MODULE_CONFIG.find(c => c.id === currentSection);
    
    const newScores = { ...quizScores, [currentSection]: score };
    const newUnlocked = new Set(unlockedSections);

    // Progression Logic
    if (config && config.passingScore && score >= config.passingScore) {
      const currentIndex = MODULE_CONFIG.findIndex(c => c.id === currentSection);
      const nextSection = MODULE_CONFIG[currentIndex + 1];
      if (nextSection) newUnlocked.add(nextSection.id);
    }

    setState(prev => ({
      ...prev,
      quizScores: newScores,
      unlockedSections: newUnlocked
    }));
  };
return (
    <div className="h-screen w-screen flex flex-col bg-background text-white overflow-hidden relative">
      {/* Background Glow Effect */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[150px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-highlight/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      
      {/* Navigation Header */}
      <header className="flex-none border-b border-accent/30 p-4 relative z-10">
        <ModuleNavigator 
          sections={MODULE_CONFIG}
          currentState={state}
          onNavigate={handleNavigation}
        />
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center relative z-10 custom-scrollbar">
        <div className="w-full max-w-[95rem] px-4">
          
          {currentConfig?.id === 'faq' ? (
            <FAQPanel />
          ) : (
            <>
              {state.subState === 'video' && currentConfig?.hasVideo ? (
                <LessonContainer 
                  lessonId={state.currentSection}
                  onComplete={() => setState(prev => ({ ...prev, subState: 'quiz' }))} 
                />
              ) : (
                <div className="max-w-3xl mx-auto">
                  <QuizSection 
                    sectionId={state.currentSection}
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