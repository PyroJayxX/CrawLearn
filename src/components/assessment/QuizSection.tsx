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
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        {/* was text-accent — too light on white bg; use a readable gray instead */}
        <p className="text-lg font-medium text-gray-600">No questions available for this section yet.</p>
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
      {/* Question counter — was text-accent (too light on white), now a readable muted label */}
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold tracking-widest uppercase text-gray-500">
          Question {currentIdx + 1} of {questions.length}
        </span>
      </div>

      <QuestionCard
        question={currentQ}
        selectedIndex={answers[currentIdx]}
        onSelect={handleSelect}
      />

      <div className="flex justify-end mt-4">
        <button
          onClick={handleNext}
          disabled={answers[currentIdx] === undefined}
          className="
            px-8 py-3 rounded-lg font-bold text-sm transition-colors duration-200
            bg-accent text-white
            hover:bg-accent/80
            disabled:opacity-40 disabled:cursor-not-allowed
          "
        >
          {currentIdx === questions.length - 1 ? 'Submit Assessment' : 'Next Question →'}
        </button>
      </div>
    </div>
  );
}