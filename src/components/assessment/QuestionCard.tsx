import { Question } from '../../types';

interface CardProps {
  question: Question;
  selectedIndex?: number;
  isFinal?: boolean;
  onSelect: (index: number) => void;
}

export default function QuestionCard({ question, selectedIndex, isFinal = false, onSelect }: CardProps) {
  const getOptionStyle = (idx: number) => {
    if (selectedIndex === undefined) {
      // Nothing picked yet — all hoverable
      return 'border-gray-200 hover:border-accent/50 hover:bg-gray-50 text-gray-800 bg-white';
    }

    if (idx === selectedIndex) {
      // The picked answer
      if (isFinal) {
        return 'border-accent bg-accent/10 text-accent font-semibold';
      }
      return idx === question.correctIndex
        ? 'border-green-500 bg-green-50 text-green-700 font-semibold'
        : 'border-red-400 bg-red-50 text-red-600 font-semibold';
    }

    if (!isFinal && idx === question.correctIndex && selectedIndex !== question.correctIndex) {
      // Reveal correct answer after a wrong pick
      return 'border-green-400 bg-green-50/60 text-green-700 font-semibold';
    }

    // All other options — dimmed, locked
    return 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed';
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
            onClick={() => selectedIndex === undefined && onSelect(idx)}
            className={`text-left p-4 rounded-lg border transition-all duration-200 ${getOptionStyle(idx)}`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}