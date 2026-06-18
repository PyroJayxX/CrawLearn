export type SectionId = 'ch1' | 'ch2' | 'ch3' | 'final' | 'faq';
export type SubState = 'video' | 'quiz';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
}

export interface SectionConfig {
  id: SectionId;
  title: string;
  hasVideo: boolean;
  quizQuestions?: Question[];
  passingScore?: number;
  prerequisite?: SectionId;
}

// Our application state
export interface LearningState {
  currentSection: SectionId;
  subState: SubState; 
  unlockedSections: Set<SectionId>;
  quizScores: Record<SectionId, number>; // e.g., { 'ch1': 4, 'ch2': 5 }
}