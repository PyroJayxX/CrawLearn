import { useRef, useState, useEffect } from 'react';
import VideoLesson from '../content/VideoLesson';
import InteractiveTranscript from '../content/Transcript';
import LessonInfoCard from './LessonInfoCard';
import CrawleyWidget from './CrawleyWidget';
import { parseSrt } from '../utils/ParseSRT';
import { TranscriptLine } from '../content/Transcript';
import { LESSON_DATA } from '../../data/LessonData';

interface LessonContainerProps {
  lessonId:   string;
  onComplete: () => void;
}

export default function LessonContainer({ lessonId, onComplete }: LessonContainerProps) {
  const playerRef   = useRef<any>(null);
  const [currentTime,     setCurrentTime]     = useState(0);
  const [transcriptLines, setTranscriptLines] = useState<TranscriptLine[]>([]);

  const currentLesson = LESSON_DATA[lessonId];

  useEffect(() => {
    if (!currentLesson) return;
    const folder = lessonId.startsWith('mod2_') ? 'module2' : 'module1';
    fetch(`/transcripts/${folder}/${currentLesson.srtFile}.srt`)
      .then(res => res.text())
      .then(raw => setTranscriptLines(parseSrt(raw)))
      .catch(() => setTranscriptLines([]));
  }, [lessonId, currentLesson]);

  const handlePlayerRef = (player: any) => { playerRef.current = player; };
  const handleSeek      = (seconds: number) => { if (playerRef.current) playerRef.current.currentTime = seconds; };

  // ── Coming soon ───────────────────────────────────────────────────────────
  if (!currentLesson) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-32 text-center">
        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-700">Coming Soon</h3>
        <p className="text-sm text-gray-400 max-w-xs">This lesson is still being prepared. Check back later.</p>
      </div>
    );
  }

  return (
    <>
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

      <CrawleyWidget lessonId={lessonId} transcriptLines={transcriptLines} />
    </>
  );
}