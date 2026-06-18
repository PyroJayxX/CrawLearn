import { useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import VideoLesson from '../content/VideoLesson';
import InteractiveTranscript from '../content/Transcript';

interface LessonContainerProps {
  lessonId: string;
  onComplete: () => void;
}

// Updated with your actual YouTube Links
const LESSON_DATA: Record<string, { videoUrl: string; transcript: any[] }> = {
  'ch1': {
    videoUrl: 'https://www.youtube.com/watch?v=_H01KLkpzFU', 
    transcript: [
      { id: '1', timeLabel: '0:00', seconds: 0, text: 'This is the hardcoded transcript for Video 1.' },
    ]
  },
  'ch2': {
    videoUrl: 'https://www.youtube.com/watch?v=PRwZE8a_ITM', 
    transcript: [ /* ... */ ]
  },
  'ch3': {
    videoUrl: 'https://www.youtube.com/watch?v=YRgSUywizZs', 
    transcript: [ /* ... */ ]
  }
};

export default function LessonContainer({ lessonId, onComplete }: LessonContainerProps) {
  const playerRef = useRef<any>(null);
  const [currentTime, setCurrentTime] = useState(0);

  const currentLesson = LESSON_DATA[lessonId];

  const handleSeek = (seconds: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds, 'seconds');
      const internalPlayer = playerRef.current.getInternalPlayer();
      if (internalPlayer && typeof internalPlayer.playVideo === 'function') {
        internalPlayer.playVideo();
      }
    }
  };

  if (!currentLesson) return <div>Lesson data not found.</div>;


return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 w-full h-full">
      
      <div className="lg:col-span-3">
        <VideoLesson 
          playerRef={playerRef} 
          videoUrl={currentLesson.videoUrl}
          onTimeUpdate={setCurrentTime}
          onVideoComplete={onComplete}
        />
      </div>

      <div className="hidden lg:flex flex-col bg-black/20 rounded-xl p-4 border border-accent/20 h-[60vh] lg:h-auto">
        <InteractiveTranscript 
          lines={currentLesson.transcript}
          currentTime={currentTime}
          onSeek={handleSeek}
        />
      </div>
    </div>
  );
}