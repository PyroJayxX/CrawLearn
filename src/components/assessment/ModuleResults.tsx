import { useMemo } from 'react';

interface ScoreEntry {
  score: number;
  total: number;
  passingScore?: number;
}

interface ModuleResultsProps {
  moduleTitle:     string;
  scores:          Record<string, ScoreEntry>;
  completionSummary?: {
    xpEarned:      number;
    rank?:         number;
    totalLearners?: number;
  } | null;
  nextModuleTitle?: string;   // e.g. "Module 2" — if undefined, no next button
  nextModuleLocked?: boolean; // true = next module not yet unlocked (shouldn't happen after pass, but guard)
  onReviewModule:  () => void;
  onNextModule?:   () => void;
}

// ── CoverageRing ──────────────────────────────────────────────────────────────
// The hero: a single ring showing overall mastery across every assessment,
// styled like a policy gauge rather than a generic donut chart.

function CoverageRing({ pct, passed }: { pct: number; passed: boolean }) {
  const size   = 128;
  const stroke = 10;
  const r      = (size - stroke) / 2;
  const circ   = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);

  return (
    <div className="relative flex-none" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="#eef1f2" strokeWidth={stroke}
        />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke={passed ? '#3c99aa' : '#10374d'}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 900ms ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif text-4xl font-semibold text-gray-900 tabular-nums">{pct}%</span>
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mt-0.5">coverage</span>
      </div>
    </div>
  );
}

// ── ModuleResults ─────────────────────────────────────────────────────────────

export default function ModuleResults({
  moduleTitle,
  scores,
  completionSummary = null,
  nextModuleTitle,
  nextModuleLocked = false,
  onReviewModule,
  onNextModule,
}: ModuleResultsProps) {
  const entries = Object.entries(scores);

  const finalEntry  = scores['Final Assessment'];
  const finalTaken  = finalEntry != null;
  const finalPassed = finalTaken && finalEntry.score >= (finalEntry.passingScore ?? 12);

  const overallPct = useMemo(() => {
    if (entries.length === 0) return 0;
    const avg = entries.reduce((sum, [, e]) => sum + (e.total > 0 ? e.score / e.total : 0), 0) / entries.length;
    return Math.round(avg * 100);
  }, [entries]);

  const topPercent = completionSummary?.rank && completionSummary.totalLearners
    ? Math.max(1, Math.ceil((completionSummary.rank / completionSummary.totalLearners) * 100))
    : null;

  const headline = finalPassed
    ? 'Module complete'
    : finalTaken
    ? 'So close — one more pass'
    : 'Assessment summary';

  const subtext = finalPassed
    ? "You've cleared every checkpoint in this module."
    : finalTaken
    ? "Review what tripped you up, then retake the Final Assessment."
    : "Here's how you did across each checkpoint so far.";

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 grid grid-cols-1 md:grid-cols-[300px_1fr] gap-5 items-start">

      {/* Hero */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-6 flex flex-col items-center text-center gap-3 md:sticky md:top-6">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400">{moduleTitle}</p>

        <CoverageRing pct={overallPct} passed={finalPassed} />

        <div className="flex flex-col gap-1">
          <h1 className="font-serif text-2xl font-semibold text-gray-900">{headline}</h1>
          <p className="text-gray-500 text-sm">{subtext}</p>
        </div>

        {finalPassed && (completionSummary?.xpEarned || topPercent) && (
          <div className="flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-4 py-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-none" />
            <p className="text-sm font-semibold text-amber-800">
              +{completionSummary?.xpEarned ?? 0} XP
              {topPercent ? <span className="font-normal text-amber-700"> · top {topPercent}% of learners</span> : null}
            </p>
          </div>
        )}
      </div>

      {/* Right column: ledger + actions */}
      <div className="flex flex-col gap-5 min-w-0">

        {/* Ledger */}
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
          <div className="px-6 py-3 border-b border-gray-100">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400">Checkpoints</p>
          </div>
          <div className="flex flex-col">
            {entries.map(([label, { score, total, passingScore }], i) => {
              const isFinal = label === 'Final Assessment';
              const pct     = total > 0 ? Math.round((score / total) * 100) : 0;
              const thresh  = passingScore ?? (isFinal ? 12 : 3);
              const passed  = score >= thresh;

              return (
                <div
                  key={label}
                  className={`flex items-center justify-between gap-4 px-6 py-3
                    ${i !== entries.length - 1 ? 'border-b border-gray-100' : ''}
                    ${isFinal ? 'bg-accent/[0.04]' : ''}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-2 h-2 rounded-full flex-none ${passed ? 'bg-accent' : 'bg-rose-400'}`} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-800 truncate">{label}</p>
                        {isFinal && (
                          <span className="text-[9px] font-bold uppercase tracking-wide text-accent bg-accent/10 rounded px-1.5 py-0.5 flex-none">
                            Final
                          </span>
                        )}
                      </div>
                      {isFinal && (
                        <p className={`text-xs mt-0.5 font-medium ${passed ? 'text-accent' : 'text-rose-500'}`}>
                          {passed ? 'Passed' : `Needs ${thresh}/${total} to pass`}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-none">
                    <p className="font-serif text-lg font-semibold text-gray-900 tabular-nums">{score}<span className="text-gray-300 font-normal">/{total}</span></p>
                    <p className="text-[11px] text-gray-400">{pct}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onReviewModule}
            className="flex-1 px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            Review {moduleTitle}
          </button>

          {nextModuleTitle && (
            <button
              onClick={onNextModule}
              disabled={nextModuleLocked || !finalPassed}
              title={!finalPassed ? 'Pass the Final Assessment to unlock' : undefined}
              className="flex-1 px-6 py-3 rounded-lg bg-accent text-white font-semibold text-sm
                hover:opacity-90 transition-opacity
                disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Proceed to {nextModuleTitle} →
            </button>
          )}
        </div>

      </div>

    </div>
  );
}