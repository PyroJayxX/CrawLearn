import { useRef, useState, useEffect } from 'react';
import VideoLesson from '../content/VideoLesson';
import InteractiveTranscript from '../content/Transcript';
import LessonInfoCard from './LessonInfoCard';
import { parseSrt } from '../utils/ParseSRT';
import { TranscriptLine } from '../content/Transcript';

interface LessonContainerProps {
  lessonId: string;
  onComplete: () => void;
}

const LESSON_DATA: Record<string, {
  videoUrl: string;
  srtFile: string;
  title: string;
  subtitle: string;
  tag: string;
  duration: string;
  topics: { icon: string; label: string }[];
  description: string;
}> = {
  ch1: {
    videoUrl: 'https://www.youtube.com/watch?v=_H01KLkpzFU',
    srtFile: 'Lesson1',
    title: 'Chapter 1',
    subtitle: 'Core Module • Part 1',
    tag: 'CORE MODULE • PART 1',
    duration: '15 mins of video content remaining',
    description: 'In this section, we dive deep into the fundamental patterns that define scalable web applications. We\'ll explore how component-driven design synergizes with state management to create fluid, high-performance user interfaces.',
    topics: [
      { icon: '◈', label: 'Understanding Atomic Design hierarchy' },
      { icon: '⬡', label: 'Centralized vs Decentralized state' },
    ],
  },
  ch2: {
    videoUrl: 'https://www.youtube.com/watch?v=PRwZE8a_ITM',
    srtFile: 'Lesson2',
    title: 'Chapter 2',
    subtitle: 'Core Module • Part 2',
    tag: 'CORE MODULE • PART 2',
    duration: '20 mins of video content remaining',
    description: 'Explore component-driven design patterns and how they shape modern frontend development. Learn to build reusable, composable UI elements that scale.',
    topics: [
      { icon: '◈', label: 'Component composition strategies' },
      { icon: '⬡', label: 'Props vs Context trade-offs' },
    ],
  },
  ch3: {
    videoUrl: 'https://www.youtube.com/watch?v=YRgSUywizZs',
    srtFile: 'Lesson3',
    title: 'Chapter 3',
    subtitle: 'Core Module • Part 3',
    tag: 'CORE MODULE • PART 3',
    duration: '22 mins of video content remaining',
    description: 'Advanced state management patterns for complex applications. Understand when to reach for global state and how to keep it predictable.',
    topics: [
      { icon: '◈', label: 'Reducers and action patterns' },
      { icon: '⬡', label: 'Async state and side effects' },
    ],
  },
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

  const handlePlayerRef = (player: any) => { playerRef.current = player; };
  const handleSeek = (seconds: number) => { if (playerRef.current) playerRef.current.currentTime = seconds; };

  if (!currentLesson) return <div className="text-gray-500 p-8">Lesson data not found.</div>;

  return (
    <div className="flex gap-6 w-full" style={{ minHeight: 'calc(100vh - 72px - 80px)' }}>

      {/* ── Left column: Video + info card ── */}
      <div className="flex flex-col flex-[7] min-w-0 gap-5">

        {/* Video player */}
        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden flex-none">
          <VideoLesson
            playerRef={handlePlayerRef}
            videoUrl={currentLesson.videoUrl}
            onTimeUpdate={setCurrentTime}
            onVideoComplete={onComplete}
          />
        </div>

        {/* ── Info card ── */}
        <LessonInfoCard
          tag={currentLesson.tag}
          title={currentLesson.title}
          duration={currentLesson.duration}
          description={currentLesson.description}
          topics={currentLesson.topics}
          onContinue={onComplete}
        />
      </div>

      {/* ── Right column: Transcript ── */}
      <div
        className="hidden lg:flex flex-col flex-[3] min-w-0 bg-white rounded-xl p-5 border border-gray-200 overflow-hidden"
        style={{ maxHeight: 'calc(100vh - 72px - 80px)', position: 'sticky', top: 0 }}
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