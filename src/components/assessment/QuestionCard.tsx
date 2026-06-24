import { useState } from 'react';
import { Question } from '../../types';

interface CardProps {
  question:        Question;
  selectedIndex?:  number;
  isFinal?:        boolean;
  showAnswers?:    boolean;
  isLastQuestion?: boolean;
  nextLabel:       string;
  onSelect:        (index: number) => void;
  onNext:          () => void;
}

export default function QuestionCard({
  question,
  selectedIndex,
  isFinal = false,
  showAnswers = false,
  isLastQuestion = false,
  nextLabel,
  onSelect,
  onNext,
}: CardProps) {
  const [pendingIndex, setPendingIndex] = useState<number | undefined>(undefined);

  const isCommitted = selectedIndex !== undefined;
  const isCorrect   = selectedIndex === question.correctIndex;

  const getOptionStyle = (idx: number) => {
    // ── Answer-reveal mode (final, attempt 4+, only after committed) ────────
    if (showAnswers && isCommitted) {
      if (idx === question.correctIndex)
        return selectedIndex === idx
          ? 'border-green-500 bg-green-50 text-green-700 font-semibold'
          : 'border-green-400 bg-green-50/60 text-green-700 font-semibold';
      if (selectedIndex === idx)
        return 'border-red-400 bg-red-50 text-red-600 font-semibold';
      return 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed';
    }

    // ── Committed (after Submit Answer) ────────────────────────────────────
    if (isCommitted) {
      if (isFinal) {
        if (idx === selectedIndex) return 'border-accent bg-accent/10 text-accent font-semibold';
        return 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed';
      }
      if (idx === selectedIndex)
        return idx === question.correctIndex
          ? 'border-green-500 bg-green-50 text-green-700 font-semibold'
          : 'border-red-400 bg-red-50 text-red-600 font-semibold';
      if (idx === question.correctIndex)
        return 'border-green-400 bg-green-50/60 text-green-700 font-semibold';
      return 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed';
    }

    // ── Pending selection (before Submit Answer) ───────────────────────────
    if (pendingIndex === idx)
      return 'border-accent bg-accent/10 text-accent font-semibold ring-2 ring-accent/30';

    return 'border-gray-200 hover:border-accent/50 hover:bg-gray-50 text-gray-800 bg-white';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
      <h3 className="text-xl md:text-2xl font-medium mb-6 leading-relaxed text-gray-900">
        {question.text}
      </h3>

      <div className="flex flex-col gap-3">
        {question.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (isCommitted) return;
              setPendingIndex(idx);
            }}
            disabled={isCommitted}
            className={`text-left p-4 rounded-lg border transition-all duration-200 ${getOptionStyle(idx)}`}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* ── Single action button ── */}
      <div className="mt-5 flex justify-end">
        {!isCommitted ? (
          <button
            onClick={() => {
              if (pendingIndex === undefined) return;
              onSelect(pendingIndex);
            }}
            disabled={pendingIndex === undefined}
            className="px-6 py-2.5 rounded-lg font-semibold text-sm bg-accent text-white
              hover:bg-accent/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={onNext}
            className="px-6 py-2.5 rounded-lg font-semibold text-sm bg-accent text-white
              hover:bg-accent/80 transition-colors"
          >
            {nextLabel}
          </button>
        )}
      </div>
    </div>
  );
}