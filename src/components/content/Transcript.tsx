import { useRef, useEffect } from 'react';

export interface TranscriptLine {
  id: string;
  timeLabel: string;
  seconds: number;
  text: string;
}

interface TranscriptProps {
  lines?: TranscriptLine[];
  currentTime?: number; // Synced with the video player's current time
  onSeek?: (seconds: number) => void;
}

// Mock Data - Typically fetched alongside the video URL
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
  onSeek 
}: TranscriptProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Determine the active line based on the video's current time
  // Reverses the array to find the most recent timestamp passed
  const activeLineIndex = lines.reduce((latestIdx, line, idx) => {
    return currentTime >= line.seconds ? idx : latestIdx;
  }, 0);

  // Optional: Auto-scroll to the active line (useful for long videos)
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
      <div className="flex justify-between items-center mb-4 px-2 text-accent text-sm font-semibold tracking-wider flex-none">
        <span>TRANSCRIPT</span>
      </div>
      
      {/* Scrollable Container */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar"
      >
        {lines.map((line, idx) => {
          const isActive = idx === activeLineIndex;

          return (
            <button
              key={line.id}
              onClick={() => onSeek && onSeek(line.seconds)}
              className={`
                w-full text-left p-3 rounded-lg flex gap-4 transition-colors duration-200 group focus:outline-none
                ${isActive 
                  ? 'bg-accent/20 border border-accent/40 text-white' 
                  : 'bg-transparent border border-transparent text-gray-400 hover:bg-black/20 hover:text-gray-200'
                }
              `}
            >
              <span className={`
                font-mono text-sm mt-0.5 flex-none
                ${isActive ? 'text-highlight' : 'text-accent/60 group-hover:text-accent'}
              `}>
                {line.timeLabel}
              </span>
              <span className="leading-relaxed text-sm md:text-base">
                {line.text}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}