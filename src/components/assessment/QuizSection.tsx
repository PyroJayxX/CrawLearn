import { useState } from 'react';
import QuestionCard from './QuestionCard';
import { Question } from '../../types';

interface QuizProps {
  sectionId: string;
  questions: Question[];
  nextSectionTitle?: string;
  onComplete: (score: number) => void;
}

export default function QuizSection({ sectionId, questions, nextSectionTitle, onComplete }: QuizProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const isFinal = sectionId === 'final';
  const currentQ = questions[currentIdx];
  const selectedIndex = answers[currentIdx];
  const isLastQuestion = currentIdx === questions.length - 1;
  const canProceed = selectedIndex !== undefined;

  const handleSelect = (optionIndex: number) => {
    if (selectedIndex !== undefined) return; // locked after first pick
    setAnswers(prev => ({ ...prev, [currentIdx]: optionIndex }));
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentIdx(prev => prev + 1);
      return;
    }
    let score = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) score++;
    });
    onComplete(score);
  };

  const lastButtonLabel = isFinal
    ? 'Submit Assessment'
    : nextSectionTitle
      ? `Proceed to ${nextSectionTitle} →`
      : 'Finish Quiz →';

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-lg font-medium text-gray-600">No questions available for this section yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full justify-center">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold tracking-widest uppercase text-gray-500">
          Question {currentIdx + 1} of {questions.length}
        </span>
        {!isFinal && selectedIndex !== undefined && (
          <span className={`text-xs font-semibold ${selectedIndex === currentQ.correctIndex ? 'text-green-600' : 'text-red-500'}`}>
            {selectedIndex === currentQ.correctIndex ? 'Correct!' : 'Incorrect'}
          </span>
        )}
      </div>

      <QuestionCard
        question={currentQ}
        selectedIndex={selectedIndex}
        isFinal={isFinal}
        onSelect={handleSelect}
      />

      <div className="flex justify-end mt-4">
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className="
            px-8 py-3 rounded-lg font-bold text-sm transition-colors duration-200
            bg-accent text-white
            hover:bg-accent/80
            disabled:opacity-40 disabled:cursor-not-allowed
          "
        >
          {isLastQuestion ? lastButtonLabel : 'Next Question →'}
        </button>
      </div>
    </div>
  );
}