import { useState } from 'react';
import ReactPlayer from 'react-player';

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
  playerRef
}: VideoLessonProps) {
  const [hasWatched, setHasWatched] = useState(false);

  const playerProps: any = {
    ref: playerRef,
    src: videoUrl,
    controls: true,
    // Let the wrapper dictate size; ReactPlayer fills it
    width: '100%',
    height: '100%',
    className: 'absolute top-0 left-0',
    onTimeUpdate: (e: any) => {
      if (onTimeUpdate) onTimeUpdate(e.target.currentTime);
    },
    onEnded: () => setHasWatched(true),
    config: {
      youtube: {
        playerVars: { showinfo: 0, rel: 0, modestbranding: 1 },
      },
    },
  };

  return (
    // flex-col, fills parent height from LessonContainer
    <div className="flex flex-col gap-4 h-full">
      {/* 
        aspect-video keeps the 16:9 ratio.
        flex-1 + min-h-0 makes it grow to fill available space in the flex column
        without overflowing — the key fix for "video not taking full space".
      */}
      <div className="relative w-full flex-1 min-h-0 bg-black rounded-xl overflow-hidden">
        <div className="absolute inset-0">
          <ReactPlayer {...playerProps} />
        </div>
      </div>
    </div>
  );
}