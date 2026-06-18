import { useState } from 'react';
import QuestionCard from './QuestionCard';

interface QuizProps {
  sectionId: string;
  onComplete: (score: number) => void;
}

// Mock Data - In reality, passed down or filtered by sectionId
const MOCK_QUESTIONS = [
  { id: 'q1', text: 'What is a component?', options: ['Function', 'Style', 'Database'], correctIndex: 0 },
  // ... 4 more questions
];

export default function QuizSection({ sectionId, onComplete }: QuizProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const handleSelect = (optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [currentIdx]: optionIndex }));
  };

  const handleNext = () => {
    if (currentIdx < MOCK_QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      // Calculate Score
      let score = 0;
      MOCK_QUESTIONS.forEach((q, idx) => {
        if (answers[idx] === q.correctIndex) score++;
      });
      onComplete(score);
    }
  };

  const currentQ = MOCK_QUESTIONS[currentIdx];

  return (
    <div className="flex flex-col gap-6 h-full justify-center">
      <div className="flex justify-between items-center text-accent text-sm font-semibold tracking-wider">
        <span>QUESTION {currentIdx + 1} OF {MOCK_QUESTIONS.length}</span>
      </div>
      
      <QuestionCard 
        question={currentQ} 
        selectedIndex={answers[currentIdx]}
        onSelect={handleSelect}
      />

      <button 
        onClick={handleNext}
        disabled={answers[currentIdx] === undefined}
        className="mt-8 self-end px-8 py-3 bg-accent text-background font-bold rounded-lg hover:bg-highlight disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {currentIdx === MOCK_QUESTIONS.length - 1 ? 'Submit Assessment' : 'Next Question'}
      </button>
    </div>
  );
}