import { Question } from '../../types';

interface CardProps {
  question: Question;
  selectedIndex?: number;
  onSelect: (index: number) => void;
}

export default function QuestionCard({ question, selectedIndex, onSelect }: CardProps) {
  return (
    <div className="bg-black/20 border border-accent/30 rounded-xl p-6 md:p-8">
      <h3 className="text-xl md:text-2xl font-medium mb-6 leading-relaxed">
        {question.text}
      </h3>
      <div className="flex flex-col gap-3">
        {question.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(idx)}
            className={`
              text-left p-4 rounded-lg border transition-all duration-200
              ${selectedIndex === idx 
                ? 'border-highlight bg-highlight/10 text-highlight' 
                : 'border-accent/20 hover:border-accent/60 bg-transparent'}
            `}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}