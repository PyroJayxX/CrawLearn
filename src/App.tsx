import { useState, useMemo } from 'react';
import { LearningState, SectionConfig, SectionId, SubState } from './types';
import ModuleNavigator from './components/layout/ModuleNavigator';
import VideoLesson from './components/content/VideoLesson';
import QuizSection from './components/assessment/QuizSection';
import FAQPanel from './components/shared/FAQPanel';
import Transcript from './components/content/Transcript';

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
    unlockedSections: new Set(['ch1', 'faq']), // FAQ always unlocked
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
    <div className="h-screen w-screen flex flex-col bg-background text-white overflow-hidden">
      {/* Navigation Header */}
      <header className="flex-none border-b border-accent/30 p-4">
        <ModuleNavigator 
          sections={MODULE_CONFIG}
          currentState={state}
          onNavigate={handleNavigation}
        />
      </header>

      {/* Main Content Area - Scrollable, prevents bleeding */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {currentConfig?.id === 'faq' ? (
            <div className="lg:col-span-3"><FAQPanel /></div>
          ) : (
            <>
              {/* Left Column: Core Content */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                {state.subState === 'video' && currentConfig?.hasVideo ? (
                  <VideoLesson 
                    onVideoComplete={() => setState(prev => ({ ...prev, subState: 'quiz' }))} 
                  />
                ) : (
                  <QuizSection 
                    sectionId={state.currentSection}
                    onComplete={handleQuizComplete} 
                  />
                )}
              </div>

              {/* Right Column: Supplementary / Transcript */}
              <div className="hidden lg:flex flex-col bg-black/20 rounded-xl p-4 border border-accent/20">
                 {state.subState === 'video' && <Transcript />}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}