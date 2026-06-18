export type SubState = 'video' | 'quiz';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
}

export interface SectionConfig {
  id: string;
  title: string;
  hasVideo: boolean;
  passingScore?: number;
  questions?: Question[];
}

export interface ModuleConfig {
  id: string;
  title: string;
  sections: SectionConfig[];
}

export interface LearningState {
  currentModuleId: string;
  currentSectionId: string;
  subState: SubState;
  unlockedSections: Record<string, Set<string>>;
  quizScores: Record<string, Record<string, number>>;
  completedModules: Set<string>;
}