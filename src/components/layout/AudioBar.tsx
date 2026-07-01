import { useRef, useState } from 'react';
import ReactPlayer from 'react-player';

interface AudioBarProps {
  videoUrl:      string;
  onTimeUpdate?: (currentTime: number) => void;
  playerRef?:    (player: any) => void;
}

// Reuses the same YouTube URL as the video lesson — YouTube doesn't expose a
// raw audio-only stream, so instead we keep the iframe player mounted and
// playing but visually collapsed to nothing, and drive it with our own
// minimal play/pause/scrub UI. Audio keeps playing regardless of what's
// shown in the panel next to it (transcript or PDF).
export default function AudioBar({ videoUrl, onTimeUpdate, playerRef }: AudioBarProps) {
  const internalRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const attachRef = (instance: any) => {
    internalRef.current = instance;
    playerRef?.(instance);
  };

  const togglePlay = () => {
    const p = internalRef.current;
    if (!p) return;
    if (p.paused) { p.play?.(); setIsPlaying(true); }
    else { p.pause?.(); setIsPlaying(false); }
  };

  const handleSeekBar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seconds = Number(e.target.value);
    internalRef.current?.seekTo?.(seconds);
    setCurrentTime(seconds);
  };

  const formatTime = (s: number) => {
    if (!Number.isFinite(s)) return '0:00';
    const m   = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  return (
    <div className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 px-5 py-4">
      {/* Player stays mounted + playing, just visually removed from layout */}
      <div className="absolute w-0 h-0 overflow-hidden opacity-0 pointer-events-none">
        <ReactPlayer
          ref={attachRef}
          src={videoUrl}
          controls={false}
          onTimeUpdate={(e: any) => {
            const t = e.target.currentTime;
            setCurrentTime(t);
            onTimeUpdate?.(t);
          }}
          onDurationChange={(e: any) => setDuration(e.target.duration ?? 0)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        />
      </div>

      <button
        onClick={togglePlay}
        className="flex-none w-11 h-11 rounded-full bg-background text-white flex items-center justify-center hover:bg-background/90 transition-colors"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      <span className="text-xs font-mono text-gray-400 flex-none w-9 text-right">
        {formatTime(currentTime)}
      </span>

      <input
        type="range"
        min={0}
        max={duration || 0}
        step={0.1}
        value={currentTime}
        onChange={handleSeekBar}
        className="flex-1 accent-accent h-1 cursor-pointer"
      />

      <span className="text-xs font-mono text-gray-400 flex-none w-9">
        {formatTime(duration)}
      </span>

      <div className="flex-none hidden sm:flex items-center gap-1.5 text-gray-400">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
        </svg>
        <span className="text-[10px] font-bold uppercase tracking-widest">Listening</span>
      </div>
    </div>
  );
}
