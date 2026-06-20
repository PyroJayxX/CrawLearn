import { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaMuteButton,
  MediaVolumeRange,
  MediaFullscreenButton,
} from 'media-chrome/react';

// npm install media-chrome

interface VideoLessonProps {
  videoUrl: string;
  title?: string;
  onVideoComplete: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  playerRef?: React.RefObject<any> | ((player: any) => void);
}

export default function VideoLesson({
  videoUrl,
  onVideoComplete,
  onTimeUpdate,
  playerRef,
}: VideoLessonProps) {
  const [hasEnded, setHasEnded] = useState(false);
  const internalRef = useRef<any>(null);

  // Support both ref shapes the caller might pass in, same as before
  const attachRef = (instance: any) => {
    internalRef.current = instance;
    if (typeof playerRef === 'function') playerRef(instance);
    else if (playerRef) (playerRef as React.RefObject<any>).current = instance;
  };

  const handleReplay = () => {
    setHasEnded(false);
    internalRef.current?.seekTo?.(0);
    internalRef.current?.play?.();
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="relative w-full flex-1 min-h-0">
        <MediaController
          // [&_iframe] disables mouse interaction on the YouTube iframe
          // itself, so its native title/branding overlay (which links back
          // to YouTube and can't be turned off via config) is never
          // clickable. All clicks are handled by our own shield div below.
          className="w-full h-full rounded-xl overflow-hidden bg-black [&_iframe]:pointer-events-none"
          style={{
            // Override these to match your app's palette
            ['--media-primary-color' as any]: '#ffffff',
            ['--media-secondary-color' as any]: 'rgba(0,0,0,0.6)',
            ['--media-accent-color' as any]: '#6366f1',
            ['--media-control-bar-display' as any]: hasEnded ? 'none' : 'flex',
          }}
        >
          <ReactPlayer
            slot="media"
            ref={attachRef}
            src={videoUrl}
            controls={false}
            style={{ width: '100%', height: '100%' }}
            config={{
              // v3 flattens these directly under `youtube`, no nested
              // `playerVars` key. rel is the only one of the old privacy
              // params that still does anything (limits related videos to
              // the same channel) — modestbranding / showinfo are dead
              // as of 2018 / 2023.
              youtube: { rel: 0, iv_load_policy: 3 },
            }}
            onTimeUpdate={(e: any) => onTimeUpdate?.(e.target.currentTime)}
            onEnded={() => {
              setHasEnded(true);
              onVideoComplete();
            }}
          />

          {/* Sits above the inert iframe, below the control bar. Handles
              click-to-toggle since the iframe itself can't receive clicks
              anymore. */}
          {!hasEnded && (
            <div
              className="absolute inset-0 cursor-pointer"
              onClick={() => {
                const p = internalRef.current;
                if (!p) return;
                if (p.paused) p.play?.();
                else p.pause?.();
              }}
            />
          )}

          <MediaControlBar>
            <MediaPlayButton />
            <MediaSeekBackwardButton seekOffset={10} />
            <MediaSeekForwardButton seekOffset={10} />
            <MediaTimeRange />
            <MediaTimeDisplay showDuration />
            <MediaMuteButton />
            <MediaVolumeRange />
            <MediaFullscreenButton />
          </MediaControlBar>
        </MediaController>

        {/* Covers the iframe on end so YouTube's own end-card / suggested
            videos overlay is never visible or clickable. */}
        {hasEnded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/90 rounded-xl text-white">
            <p className="text-sm opacity-80">Lesson complete</p>
            <button
              onClick={handleReplay}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium"
            >
              Watch again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}