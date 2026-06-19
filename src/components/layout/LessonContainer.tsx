import { useRef, useState, useEffect } from 'react';
import VideoLesson from '../content/VideoLesson';
import InteractiveTranscript from '../content/Transcript';
import LessonInfoCard from './LessonInfoCard';
import { parseSrt } from '../utils/ParseSRT';
import { TranscriptLine } from '../content/Transcript';
import { LESSON_DATA } from '../../data/LessonData';

interface LessonContainerProps {
  lessonId: string;
  onComplete: () => void;
}

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

  const handlePlayerRef = (player: any) => { playerRef.current = player; };
  const handleSeek = (seconds: number) => { if (playerRef.current) playerRef.current.currentTime = seconds; };

  if (!currentLesson) return <div className="text-gray-500 p-8">Lesson data not found.</div>;

  return (
    <div className="flex gap-6 w-full" style={{ minHeight: 'calc(100vh - 72px - 80px)' }}>

      {/* Left column: video + info card */}
      <div className="flex flex-col flex-[7] min-w-0 gap-5">
        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden flex-none">
          <VideoLesson
            playerRef={handlePlayerRef}
            videoUrl={currentLesson.videoUrl}
            onTimeUpdate={setCurrentTime}
            onVideoComplete={onComplete}
          />
        </div>

        <LessonInfoCard
          tag={currentLesson.tag}
          title={currentLesson.title}
          duration={currentLesson.duration}
          description={currentLesson.description}
          topics={currentLesson.topics}
          faqs={currentLesson.faqs}
          onContinue={onComplete}
        />
      </div>

      {/* Right column: transcript */}
      <div
        className="hidden lg:flex flex-col flex-[3] min-w-0 bg-white rounded-xl p-5 border border-gray-200 overflow-hidden sticky top-0"
        style={{ maxHeight: 'calc(100vh - 72px - 80px)' }}
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