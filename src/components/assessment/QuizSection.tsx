import { useState } from 'react';
import QuestionCard from './QuestionCard';
import { Question } from '../../types';

interface QuizProps {
  sectionId:         string;
  questions:         Question[];
  nextSectionTitle?: string;
  previousAttempts?: number;
  onComplete:        (score: number) => void;
}

export default function QuizSection({
  sectionId,
  questions,
  nextSectionTitle,
  previousAttempts = 0,
  onComplete,
}: QuizProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers]       = useState<Record<number, number>>({});

  const isFinal      = sectionId === 'final';
  const showAnswers  = isFinal && previousAttempts >= 3;
  const currentTry   = previousAttempts + 1;   // 1-based, for display
  const triesLeft    = Math.max(0, 3 - previousAttempts);

  const currentQ       = questions[currentIdx];
  const selectedIndex  = answers[currentIdx];
  const isLastQuestion = currentIdx === questions.length - 1;
  const canProceed     = selectedIndex !== undefined;

  const handleSelect = (optionIndex: number) => {
    if (selectedIndex !== undefined) return;
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

      {/* ── Attempt banner (final assessment only) ── */}
      {isFinal && (
        <div className={`flex items-center justify-between rounded-xl px-4 py-3 border text-sm
          ${showAnswers
            ? 'bg-amber-50 border-amber-200'
            : 'bg-blue-50 border-blue-200'}`}
        >
          <div className="flex items-center gap-2">
            {showAnswers ? (
              <>
                <span className="text-amber-600">⚠</span>
                <span className="font-semibold text-amber-700">Answers revealed</span>
                <span className="text-amber-600/70 text-xs">· You've used all 3 attempts</span>
              </>
            ) : (
              <>
                <span className="text-blue-500">📋</span>
                <span className="font-semibold text-blue-700">
                  Try {currentTry} of 3
                </span>
                {triesLeft > 0 && (
                  <span className="text-blue-500/70 text-xs">
                    · Answers revealed after {triesLeft} more failed {triesLeft === 1 ? 'attempt' : 'attempts'}
                  </span>
                )}
              </>
            )}
          </div>

          {/* Question counter */}
          <span className="text-xs font-bold tracking-widest uppercase text-gray-400">
            {currentIdx + 1} / {questions.length}
          </span>
        </div>
      )}

      {/* ── Question counter (regular quizzes) ── */}
      {!isFinal && (
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold tracking-widest uppercase text-gray-500">
            Question {currentIdx + 1} of {questions.length}
          </span>
          {selectedIndex !== undefined && (
            <span className={`text-xs font-semibold ${
              selectedIndex === currentQ.correctIndex ? 'text-green-600' : 'text-red-500'
            }`}>
              {selectedIndex === currentQ.correctIndex ? 'Correct!' : 'Incorrect'}
            </span>
          )}
        </div>
      )}

      <QuestionCard
        key={currentIdx}
        question={currentQ}
        selectedIndex={selectedIndex}
        isFinal={isFinal}
        showAnswers={showAnswers}
        nextLabel={isLastQuestion ? lastButtonLabel : 'Next Question →'}
        onSelect={handleSelect}
        onNext={handleNext}
      />

      <div className="flex justify-end mt-4">
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className="
            px-8 py-3 rounded-lg font-bold text-sm transition-colors duration-200
            bg-accent text-white hover:bg-accent/80
            disabled:opacity-40 disabled:cursor-not-allowed
          "
        >
          {isLastQuestion ? lastButtonLabel : 'Next Question →'}
        </button>
      </div>
    </div>
  );
}