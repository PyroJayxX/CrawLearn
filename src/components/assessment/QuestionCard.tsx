import { Question } from '../../types';

interface CardProps {
  question:      Question;
  selectedIndex?: number;
  isFinal?:      boolean;
  /** true on attempt 4+ of the final assessment — reveals correct answer */
  showAnswers?:  boolean;
  onSelect:      (index: number) => void;
}

export default function QuestionCard({
  question,
  selectedIndex,
  isFinal = false,
  showAnswers = false,
  onSelect,
}: CardProps) {
  const getOptionStyle = (idx: number) => {
    // ── Answer-reveal mode (final, attempt 4+) ──────────────────────────────
    if (showAnswers) {
      if (idx === question.correctIndex) {
        return selectedIndex === idx
          ? 'border-green-500 bg-green-50 text-green-700 font-semibold'  // picked + correct
          : 'border-green-400 bg-green-50/60 text-green-700 font-semibold'; // correct, not picked
      }
      if (selectedIndex === idx) {
        // They picked this wrong answer
        return 'border-red-400 bg-red-50 text-red-600 font-semibold';
      }
      return 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed';
    }

    // ── Nothing picked yet ──────────────────────────────────────────────────
    if (selectedIndex === undefined) {
      return 'border-gray-200 hover:border-accent/50 hover:bg-gray-50 text-gray-800 bg-white';
    }

    // ── After picking, final quiz (no reveal) ───────────────────────────────
    if (isFinal) {
      if (idx === selectedIndex) return 'border-accent bg-accent/10 text-accent font-semibold';
      return 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed';
    }

    // ── After picking, regular quiz (reveal correct) ────────────────────────
    if (idx === selectedIndex) {
      return idx === question.correctIndex
        ? 'border-green-500 bg-green-50 text-green-700 font-semibold'
        : 'border-red-400 bg-red-50 text-red-600 font-semibold';
    }
    if (idx === question.correctIndex) {
      return 'border-green-400 bg-green-50/60 text-green-700 font-semibold';
    }
    return 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed';
  };

  const isLocked = selectedIndex !== undefined;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
      {showAnswers && (
        <p className="mb-4 text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          Answer reveal active — correct answers are highlighted.
        </p>
      )}
      <h3 className="text-xl md:text-2xl font-medium mb-6 leading-relaxed text-gray-900">
        {question.text}
      </h3>
      <div className="flex flex-col gap-3">
        {question.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => !isLocked && onSelect(idx)}
            disabled={isLocked}
            className={`text-left p-4 rounded-lg border transition-all duration-200 ${getOptionStyle(idx)}`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}