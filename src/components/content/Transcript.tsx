import { useRef, useEffect } from 'react';

export interface TranscriptLine {
  id: string;
  timeLabel: string;
  seconds: number;
  text: string;
}

interface TranscriptProps {
  lines?: TranscriptLine[];
  currentTime?: number;
  onSeek?: (seconds: number) => void;
}

const MOCK_LINES: TranscriptLine[] = [
  { id: 't1', timeLabel: '0:00', seconds: 0, text: 'Welcome to this CrawLearn module.' },
  { id: 't2', timeLabel: '0:15', seconds: 15, text: 'Today, we are going to dive into frontend architecture.' },
  { id: 't3', timeLabel: '0:35', seconds: 35, text: 'We will start by looking at how components interact.' },
  { id: 't4', timeLabel: '1:10', seconds: 70, text: 'Notice how state is passed down strictly as props.' },
  { id: 't5', timeLabel: '1:45', seconds: 105, text: 'This keeps our application predictable and easy to debug.' },
];

export default function InteractiveTranscript({
  lines = MOCK_LINES,
  currentTime = 0,
  onSeek,
}: TranscriptProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const activeLineIndex = lines.reduce((latestIdx, line, idx) => {
    return currentTime >= line.seconds ? idx : latestIdx;
  }, 0);

  useEffect(() => {
    if (containerRef.current) {
      const activeElement = containerRef.current.children[activeLineIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [activeLineIndex]);

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* ── Header: label + search + options ── */}
      <div className="flex items-center justify-between mb-4 flex-none">
        <span className="text-xs font-bold tracking-widest uppercase text-gray-500">Transcript</span>
        <div className="flex items-center gap-1">
          {/* Search icon */}
          <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors" title="Search transcript">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </button>
          {/* More options */}
          <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors" title="Options">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Scrollable transcript lines ── */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar"
      >
        {lines.map((line, idx) => {
          const isActive = idx === activeLineIndex;
          return (
            <button
              key={line.id}
              onClick={() => onSeek?.(line.seconds)}
              className={`w-full text-left px-3 py-3 rounded-lg flex gap-3 transition-colors duration-200 group focus:outline-none
                ${isActive
                  ? 'bg-accent/15 border border-accent/30'
                  : 'border border-transparent hover:bg-gray-50'}`}
            >
              <span className={`font-mono text-xs mt-0.5 flex-none w-8
                ${isActive ? 'text-accent font-bold' : 'text-gray-400 group-hover:text-accent/70'}`}>
                {line.timeLabel}
              </span>
              <span className={`leading-relaxed text-sm
                ${isActive ? 'text-gray-900 font-medium' : 'text-gray-500 group-hover:text-gray-700'}`}>
                {line.text}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Footer: Download Notes ── */}
      <div className="pt-3 mt-2 border-t border-gray-100 flex-none">
        <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
          </svg>
          Download Notes (PDF)
        </button>
      </div>

    </div>
  );
}