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
  const [finalScore, setFinalScore] = useState<number | undefined>(undefined);

  const isFinal      = sectionId === 'final';
  const showAnswers  = isFinal && previousAttempts >= 3;
  const currentTry   = previousAttempts + 1;
  const triesLeft    = Math.max(0, 3 - previousAttempts);
  const passingScore = isFinal ? 12 : 3;

  const currentQ       = questions[currentIdx];
  const selectedIndex  = answers[currentIdx];
  const isLastQuestion = currentIdx === questions.length - 1;

  const hasFailed = finalScore !== undefined && finalScore < passingScore;

  // Progress: count answered questions; if current is answered count it too
  const answeredCount  = Object.keys(answers).length;
  const progressPct    = Math.round((answeredCount / questions.length) * 100);

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
    setFinalScore(score);
    if (score >= passingScore) {
      onComplete(score);
    }
  };

  const handleRetry = () => {
    setCurrentIdx(0);
    setAnswers({});
    setFinalScore(undefined);
    onComplete(finalScore!);
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

  if (hasFailed) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-20 max-w-md mx-auto text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Failed</h2>
          <p className="text-gray-500 text-sm">
            You scored <span className="font-semibold text-gray-700">{finalScore} / {questions.length}</span>.
            You need at least <span className="font-semibold text-gray-700">{passingScore}</span> to pass.
          </p>
        </div>
        <button
          onClick={handleRetry}
          className="px-8 py-3 rounded-lg font-bold text-sm bg-accent text-white hover:bg-accent/80 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-full justify-center">

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
                <span className="font-semibold text-blue-700">Try {currentTry} of 3</span>
                {triesLeft > 0 && (
                  <span className="text-blue-500/70 text-xs">
                    · Answers revealed after {triesLeft} more failed {triesLeft === 1 ? 'attempt' : 'attempts'}
                  </span>
                )}
              </>
            )}
          </div>
          <span className="text-xs font-bold tracking-widest uppercase text-gray-400">
            {currentIdx + 1} / {questions.length}
          </span>
        </div>
      )}

      {/* ── Question counter + progress bar ── */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold tracking-widest uppercase text-gray-500">
            {isFinal ? `Question ${currentIdx + 1} of ${questions.length}` : `Question ${currentIdx + 1} of ${questions.length}`}
          </span>
          {!isFinal && selectedIndex !== undefined && (
            <span className={`text-xs font-semibold ${
              selectedIndex === currentQ.correctIndex ? 'text-green-600' : 'text-red-500'
            }`}>
              {selectedIndex === currentQ.correctIndex ? 'Correct!' : 'Incorrect'}
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out bg-accent"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

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
    </div>
  );
}