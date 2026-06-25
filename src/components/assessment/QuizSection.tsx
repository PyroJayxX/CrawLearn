import { useEffect, useState } from 'react';
import QuestionCard from './QuestionCard';
import { Question } from '../../types';
import { playPass, playFail } from '../../lib/sounds';

interface QuizProps {
  sectionId:         string;
  questions:         Question[];
  nextSectionTitle?: string;
  previousAttempts?: number;
  alreadyPassed?:    boolean;
  onComplete:        (score: number) => void;
  onProceed?:        () => void;
}

// Caterpillar progress — hollow circles, filled as questions are answered
function CaterpillarProgress({ total, answered, current }: { total: number; answered: number; current: number }) {
  // Cap display at 15 segments to avoid overflow; for longer quizzes show ratio text
  const displayMax = 15;
  const show = total <= displayMax;

  if (!show) {
    // Fallback: compact bar for very long quizzes (final 15q)
    const pct = Math.round((answered / total) * 100);
    return (
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden relative">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out bg-accent"
            style={{ width: `${pct}%` }}
          />
          {/* Caterpillar head at the progress tip */}
          {pct > 0 && (
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full border-2 border-accent bg-white flex items-center justify-center transition-all duration-500"
              style={{ left: `${pct}%` }}
            >
              <div className="w-1 h-1 rounded-full bg-accent" />
            </div>
          )}
        </div>
        <span className="text-xs font-bold text-gray-500 flex-none">{answered}/{total}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {Array.from({ length: total }).map((_, i) => {
        const isDone    = i < answered;
        const isCurrent = i === current;
        return (
          <div
            key={i}
            className={`rounded-full border-2 transition-all duration-300 flex items-center justify-center
              ${isDone
                ? 'border-accent bg-accent'
                : isCurrent
                ? 'border-accent bg-white scale-110'
                : 'border-gray-300 bg-white'}`}
            style={{ width: 14, height: 14 }}
          >
            {/* Eye dot on current segment (caterpillar head) */}
            {isCurrent && !isDone && (
              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function QuizSection({
  sectionId,
  questions,
  nextSectionTitle,
  previousAttempts = 0,
  alreadyPassed = false,
  onComplete,
  onProceed,
}: QuizProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers,    setAnswers]    = useState<Record<number, number>>({});
  const [submitted,  setSubmitted]  = useState(false);
  const [finalScore, setFinalScore] = useState<number>(0);

  const isFinal      = sectionId === 'final' || sectionId.endsWith('_final');
  const showAnswers  = isFinal && (previousAttempts >= 3 || alreadyPassed);
  const currentTry   = previousAttempts + 1;
  const triesLeft    = Math.max(0, 3 - previousAttempts);
  const passingScore = isFinal ? 12 : 3;

  const currentQ       = questions[currentIdx];
  const selectedIndex  = answers[currentIdx];
  const isLastQuestion = currentIdx === questions.length - 1;

  const hasFailed = submitted && finalScore < passingScore;
  const hasPassed = submitted && finalScore >= passingScore;

  const answeredCount = Object.keys(answers).length;
  const computeScore = (finalAnswers: Record<number, number>) => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (finalAnswers[idx] === q.correctIndex) score++;
    });
    return score;
  };

  const handleSelect = (optionIndex: number) => {
    if (selectedIndex !== undefined) return;
    setAnswers(prev => ({ ...prev, [currentIdx]: optionIndex }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      const score = computeScore({ ...answers });
      setFinalScore(score);
      setSubmitted(true);
      onComplete(score);
    } else {
      setCurrentIdx(prev => prev + 1);
    }
  };

  const handleRetry = () => {
    setCurrentIdx(0);
    setAnswers({});
    setSubmitted(false);
    setFinalScore(0);
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

  useEffect(() => {
    if (!submitted) return;
    hasPassed ? playPass() : playFail();
  }, [submitted]);

// ── Failed ───────────────────────────────────────────────────────────────
if (hasFailed) {
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white border border-gray-200 rounded-xl p-10 shadow-sm flex flex-col items-center gap-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{isFinal ? 'Assessment Failed' : 'Quiz Failed'}</h2>
          <p className="text-gray-500 text-sm">
            You scored <span className="font-semibold text-gray-700">{finalScore} / {questions.length}</span>.{' '}
            You need at least <span className="font-semibold text-gray-700">{passingScore}</span> to pass.
          </p>
          {isFinal && triesLeft > 0 && (
            <p className="text-xs text-gray-400 mt-2">
              {triesLeft} {triesLeft === 1 ? 'attempt' : 'attempts'} remaining before answers are revealed.
            </p>
          )}
        </div>
        <button onClick={handleRetry} className="px-8 py-3 rounded-lg font-bold text-sm bg-accent text-white hover:bg-accent/80 transition-colors">
          Try Again
        </button>
      </div>
    </div>
  );
}

// ── Passed ───────────────────────────────────────────────────────────────
if (hasPassed) {
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white border border-gray-200 rounded-xl p-10 shadow-sm flex flex-col items-center gap-6 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{isFinal ? 'Assessment Passed!' : 'Quiz Passed!'}</h2>
          <p className="text-gray-500 text-sm">
            You scored <span className="font-semibold text-gray-700">{finalScore} / {questions.length}</span>. Great work!
          </p>
        </div>
        {!isFinal && nextSectionTitle && (
          <button onClick={onProceed} className="px-8 py-3 rounded-lg font-bold text-sm bg-accent text-white hover:bg-accent/80 transition-colors">
            Proceed to {nextSectionTitle} →
          </button>
        )}
        {isFinal && <p className="text-xs text-gray-400">Loading your results…</p>}
      </div>
    </div>
  );
}

  // ── In progress ──────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4 h-full justify-center">

      {/* Attempt banner (final only) */}
      {/* Progress header */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold tracking-widest uppercase text-gray-500">
            Question {currentIdx + 1} of {questions.length}
          </span>
          {isFinal && !alreadyPassed && (
            showAnswers ? (
              <span className="text-xs font-semibold text-amber-600">⚠ Answers revealed</span>
            ) : (
              <span className="text-xs text-gray-400">Attempt {currentTry} of 3</span>
            )
          )}
          {!isFinal && selectedIndex !== undefined && (
            <span className={`text-xs font-semibold ${selectedIndex === currentQ.correctIndex ? 'text-green-600' : 'text-red-500'}`}>
              {selectedIndex === currentQ.correctIndex ? 'Correct!' : 'Incorrect'}
            </span>
          )}
        </div>
        <CaterpillarProgress
          total={questions.length}
          answered={answeredCount}
          current={currentIdx}
        />
      </div>

      <QuestionCard
        key={currentIdx}
        question={currentQ}
        selectedIndex={selectedIndex}
        isFinal={isFinal}
        showAnswers={showAnswers}
        isLastQuestion={isLastQuestion}
        nextLabel={isLastQuestion ? lastButtonLabel : 'Next Question →'}
        onSelect={handleSelect}
        onNext={handleNext}
      />
    </div>
  );
}