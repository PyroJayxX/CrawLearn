import { useState } from 'react';
import ReactPlayer from 'react-player';

interface VideoLessonProps {
  videoUrl: string;
  title?: string;
  onVideoComplete: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  playerRef?: React.RefObject<any>; 
}

export default function VideoLesson({ 
  videoUrl, 
  title = 'Current Lesson', 
  onVideoComplete, 
  onTimeUpdate, 
  playerRef 
}: VideoLessonProps) {
  const [hasWatched, setHasWatched] = useState(false);

  console.log("THE INCOMING URL IS:", videoUrl);

  // We bundle all props into an 'any' object to permanently 
  // bypass the broken @types/react-player definitions.
  const playerProps: any = {
    ref: playerRef,
    src: videoUrl,
    controls: true,
    width: "100%",
    height: "100%",
    className: "absolute top-0 left-0",
    onProgress: (state: any) => {
      if (onTimeUpdate) {
        onTimeUpdate(state.playedSeconds);
      }
    },
    onEnded: () => setHasWatched(true),
    config: {
      youtube: {
        playerVars: { 
          showinfo: 0, 
          rel: 0,
          modestbranding: 1
        }
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full">

      {/* Video Player Wrapper */}
      <div className="bg-black/40 border border-accent/20 rounded-xl overflow-hidden aspect-video relative group">
        
        {/* So clean! No more TypeScript yelling. */}
        <ReactPlayer {...playerProps} />

      </div>

      {/* Footer with Title and Continue Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-auto pt-4 border-t border-accent/20 gap-4">
        <h2 className="text-xl md:text-2xl font-medium text-white/90">{title}</h2>
        
        <button 
          onClick={onVideoComplete}
          disabled={!hasWatched}
          className="w-full md:w-auto px-6 py-3 bg-accent text-background font-bold rounded-lg hover:bg-highlight disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
        >
          Continue to Quiz
        </button>
      </div>
    </div>
  );
}