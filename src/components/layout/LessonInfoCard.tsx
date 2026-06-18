interface Topic {
  icon: string;
  label: string;
}

interface LessonInfoCardProps {
  tag: string;
  title: string;
  duration: string;
  description: string;
  topics: Topic[];
  onContinue: () => void;
}

export default function LessonInfoCard({
  tag,
  title,
  duration,
  description,
  topics,
  onContinue,
}: LessonInfoCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">

      {/* Top row: tag + CTA button */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase text-accent mb-1">
            {tag}
          </p>
          <h2 className="text-2xl font-bold text-gray-900 leading-tight">
            {title}
          </h2>
        </div>
        <button
          onClick={onContinue}
          className="flex-none flex items-center gap-2 px-5 py-3 bg-background hover:bg-background/90 text-white font-bold text-sm rounded-xl transition-colors shadow-sm"
        >
          Continue to Quiz
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Duration */}
      <div className="flex items-center gap-1.5 text-gray-400 text-sm mb-5">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {duration}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 mb-5" />

      {/* What you'll learn */}
      <h3 className="text-base font-bold text-gray-900 mb-2">What you'll learn in this lesson</h3>
      <p className="text-sm text-gray-500 leading-relaxed mb-5">{description}</p>

      {/* Topic pills */}
      <div className="flex flex-wrap gap-3">
        {topics.map((topic, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 bg-gray-50"
          >
            <span className="text-accent text-base leading-none">{topic.icon}</span>
            {topic.label}
          </div>
        ))}
      </div>

    </div>
  );
}