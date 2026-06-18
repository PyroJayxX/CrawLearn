import { useRef, useState, useEffect } from 'react';
import VideoLesson from '../content/VideoLesson';
import InteractiveTranscript from '../content/Transcript';
import { parseSrt } from '../utils/ParseSRT';
import { TranscriptLine } from '../content/Transcript';

interface LessonContainerProps {
  lessonId: string;
  onComplete: () => void;
}

const LESSON_DATA: Record<string, { videoUrl: string; srtFile: string }> = {
  ch1: { videoUrl: 'https://www.youtube.com/watch?v=_H01KLkpzFU', srtFile: 'Lesson1' },
  ch2: { videoUrl: 'https://www.youtube.com/watch?v=PRwZE8a_ITM', srtFile: 'Lesson2' },
  ch3: { videoUrl: 'https://www.youtube.com/watch?v=YRgSUywizZs', srtFile: 'Lesson3' },
};

export default function LessonContainer({ lessonId, onComplete }: LessonContainerProps) {
  const playerRef = useRef<any>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [transcriptLines, setTranscriptLines] = useState<TranscriptLine[]>([]);

  const currentLesson = LESSON_DATA[lessonId];

  useEffect(() => {
    if (!currentLesson) return;
    fetch(`/transcripts/module1/${currentLesson.srtFile}.srt`)
      .then(res => res.text())
      .then(raw => setTranscriptLines(parseSrt(raw)))
      .catch(() => setTranscriptLines([]));
  }, [lessonId]);

  const handlePlayerRef = (player: any) => {
    playerRef.current = player;
  };

  const handleSeek = (seconds: number) => {
    if (playerRef.current) {
      playerRef.current.currentTime = seconds; // HTMLMediaElement API
    }
  };

  if (!currentLesson) return <div>Lesson data not found.</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 w-full h-full">
      <div className="lg:col-span-3">
        <VideoLesson
          playerRef={handlePlayerRef}
          videoUrl={currentLesson.videoUrl}
          onTimeUpdate={setCurrentTime}
          onVideoComplete={onComplete}
        />
      </div>

      <div
        className="hidden lg:flex flex-col bg-black/20 rounded-xl p-4 border border-accent/20 overflow-hidden"
        style={{ height: '70vh' }}
      >
        <InteractiveTranscript
          lines={transcriptLines}
          currentTime={currentTime}
          onSeek={handleSeek}
        />
      </div>
    </div>
  );
}