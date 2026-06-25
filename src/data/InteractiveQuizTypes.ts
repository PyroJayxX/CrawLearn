// ── Shared types for the interactive quiz system ──────────────────────────

export type QuestionType =
  | 'multiple-choice'
  | 'classification'
  | 'fill-in-the-blanks'
  | 'sequential-ordering';

export interface MultipleChoicePayload {
  questionText: string;
  options: string[];
  correctIndex: number;
}

export interface ClassificationCard {
  text: string;
  belongsTo: string;
}

export interface ClassificationPayload {
  buckets: string[];
  cards: ClassificationCard[];
}

export interface FillInTheBlanksPayload {
  sentence: string;          // contains [blank1], [blank2], etc.
  optionsBank: string[];
  correctAnswers: Record<string, string>; // { blank1: 'company', blank2: 'individuals' }
}

export interface SequentialCard {
  id: string;
  text: string;
  order: number; // 1-based correct position
}

export interface SequentialOrderingPayload {
  cards: SequentialCard[];
}

export interface InteractiveQuizQuestion {
  id: string;
  type: QuestionType;
  instruction: string;
  payload:
    | MultipleChoicePayload
    | ClassificationPayload
    | FillInTheBlanksPayload
    | SequentialOrderingPayload;
}