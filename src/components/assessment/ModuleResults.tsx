interface ScoreEntry {
  score: number;
  total: number;
}

interface ModuleResultsProps {
  moduleTitle: string;
  scores: Record<string, ScoreEntry>;
  onReviewModule: () => void;
}

export default function ModuleResults({ moduleTitle, scores, onReviewModule }: ModuleResultsProps) {
  const finalEntry = scores['Final Assessment'];
  const finalPassed = finalEntry && finalEntry.score >= 12;

  return (
    <div className="max-w-2xl mx-auto py-10 flex flex-col gap-8">

      {/* Header */}
      <div className="text-center flex flex-col gap-2">
        <p className="text-xs font-bold tracking-widest uppercase text-gray-400">{moduleTitle}</p>
        <h1 className="text-3xl font-bold text-gray-900">Module Complete</h1>
        <p className="text-gray-500 text-sm">Here's a summary of your scores across all assessments.</p>
      </div>

      {/* Score cards */}
      <div className="flex flex-col gap-3">
        {Object.entries(scores).map(([label, { score, total }]) => {
          const isFinal = label === 'Final Assessment';
          const pct = Math.round((score / total) * 100);
          const passed = score >= (isFinal ? 12 : 3);

          return (
            <div
              key={label}
              className={`flex items-center justify-between px-5 py-4 rounded-xl border bg-white shadow-sm
                ${isFinal ? 'border-accent/30 ring-1 ring-accent/20' : 'border-gray-200'}`}
            >
              <div className="flex items-center gap-3">
                {/* Pass/fail dot */}
                <span className={`w-2 h-2 rounded-full flex-none ${passed ? 'bg-green-500' : 'bg-red-400'}`} />
                <div>
                  <p className={`text-sm font-semibold ${isFinal ? 'text-accent' : 'text-gray-800'}`}>{label}</p>
                  {isFinal && (
                    <p className={`text-xs mt-0.5 font-medium ${finalPassed ? 'text-green-600' : 'text-red-500'}`}>
                      {finalPassed ? 'Passed' : 'Failed! Passing Score is 12/15'}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-right">
                <p className={`text-lg font-bold ${passed ? 'text-green-600' : 'text-red-500'}`}>
                  {score}/{total}
                </p>
                <p className="text-xs text-gray-400">{pct}%</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={onReviewModule}
          className="flex-1 px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
        >
          Review Module 1
        </button>
        <button
          disabled
          title="Module 2 is not yet available"
          className="flex-1 px-6 py-3 rounded-lg bg-accent text-white font-semibold text-sm opacity-40 cursor-not-allowed"
        >
          Proceed to Module 2 →
        </button>
      </div>

    </div>
  );
}