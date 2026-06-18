import { useState, useRef } from 'react';

interface VideoLessonProps {
  videoUrl?: string; // Optional for the mock, required in production
  title?: string;
  onVideoComplete: () => void;
}

export default function VideoLesson({ videoUrl, title = 'Current Lesson', onVideoComplete }: VideoLessonProps) {
  const [hasWatched, setHasWatched] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Triggered natively when the HTML5 video reaches the end
  const handleVideoEnded = () => {
    setHasWatched(true);
  };

  // Fallback for demo/mocking purposes so we can progress without a real video
  const handleMockCompletion = () => {
    setHasWatched(true);
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex justify-between items-center text-accent text-sm font-semibold tracking-wider">
        <span>NOW PLAYING</span>
      </div>

      <div className="bg-black/40 border border-accent/20 rounded-xl overflow-hidden aspect-video relative flex items-center justify-center group">
        {videoUrl ? (
          <video 
            ref={videoRef}
            src={videoUrl} 
            controls 
            onEnded={handleVideoEnded}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center p-8">
            <svg className="w-16 h-16 mx-auto mb-4 text-accent/50 group-hover:text-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-400 mb-4">Video player placeholder for <strong>{title}</strong></p>
            <button 
              onClick={handleMockCompletion}
              className="text-sm px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 transition-colors"
            >
              Simulate Video End
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-auto pt-4 border-t border-accent/20">
        <h2 className="text-xl md:text-2xl font-medium text-white/90">{title}</h2>
        
        <button 
          onClick={onVideoComplete}
          disabled={!hasWatched}
          className="px-6 py-3 bg-accent text-background font-bold rounded-lg hover:bg-highlight disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
        >
          Continue to Quiz
        </button>
      </div>
    </div>
  );
}