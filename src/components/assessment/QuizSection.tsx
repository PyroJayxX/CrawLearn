import { useState } from 'react';
import QuestionCard from './QuestionCard';
import { Question } from '../../types';

interface QuizProps {
  sectionId: string;
  questions: Question[];
  onComplete: (score: number) => void;
}

export default function QuizSection({ sectionId, questions, onComplete }: QuizProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-accent">
        <p className="text-lg font-medium">No questions available for this section yet.</p>
      </div>
    );
  }

  const handleSelect = (optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [currentIdx]: optionIndex }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      let score = 0;
      questions.forEach((q, idx) => {
        if (answers[idx] === q.correctIndex) score++;
      });
      onComplete(score);
    }
  };

  const currentQ = questions[currentIdx];

  return (
    <div className="flex flex-col gap-6 h-full justify-center">
      <div className="flex justify-between items-center text-accent text-sm font-semibold tracking-wider">
        <span>QUESTION {currentIdx + 1} OF {questions.length}</span>
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
        {currentIdx === questions.length - 1 ? 'Submit Assessment' : 'Next Question'}
      </button>
    </div>
  );
}