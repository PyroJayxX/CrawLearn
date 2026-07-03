import { useRef, useState, useEffect } from 'react';
import VideoLesson from '../content/VideoLesson';
import InteractiveTranscript from '../content/Transcript';
import LessonInfoCard from './LessonInfoCard';
import CrawleyWidget from './CrawleyWidget';
import AudioBar from './AudioBar';
import PdfViewer from './PdfViewer';
import { parseSrt } from '../utils/ParseSRT';
import { TranscriptLine } from '../content/Transcript';
import { LESSON_DATA } from '../../data/LessonData';

interface LessonContainerProps {
  lessonId:   string;
  onComplete: () => void;
}

type Mode = 'watch' | 'listen';

export default function LessonContainer({ lessonId, onComplete }: LessonContainerProps) {
  const playerRef             = useRef<any>(null);
  const [currentTime,         setCurrentTime]         = useState(0);
  const [transcriptLines,     setTranscriptLines]     = useState<TranscriptLine[]>([]);
  const [showTranscriptMobile, setShowTranscriptMobile] = useState(false);

  const [mode, setMode] = useState<Mode>('watch');
  const [isTranscriptCollapsed, setIsTranscriptCollapsed] = useState(false);

  const currentLesson = LESSON_DATA[lessonId];

  useEffect(() => {
  if (!currentLesson) return;

  const match  = lessonId.match(/^mod(\d+)_/);
  const folder = match ? `module${match[1]}` : 'module1';

  fetch(`/transcripts/${folder}/${currentLesson.srtFile}.srt`)
    .then(res => res.text())
    .then(raw => setTranscriptLines(parseSrt(raw)))
    .catch(() => setTranscriptLines([]));
}, [lessonId, currentLesson]);

  // Reset to a sane default whenever the lesson changes
  useEffect(() => {
    setMode('watch');
    setShowTranscriptMobile(false);
  }, [lessonId]);

  const handlePlayerRef = (player: any) => { playerRef.current = player; };
  const handleSeek      = (seconds: number) => { if (playerRef.current) playerRef.current.currentTime = seconds; };

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
      {/* ── Watch / Listen & Read toggle ── */}
      <div className="flex rounded-xl overflow-hidden border border-gray-200 bg-white mb-4 lg:mb-6 max-w-xs">
        <button
          onClick={() => setMode('watch')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-colors
            ${mode === 'watch' ? 'bg-background text-white' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.55-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.45.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Watch
        </button>
        <button
          onClick={() => setMode('listen')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-colors
            ${mode === 'listen' ? 'bg-background text-white' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
          </svg>
          Listen &amp; Read
        </button>
      </div>

      {mode === 'watch' ? (
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 w-full">

          {/* Left column: video + transcript toggle (mobile) + info card */}
          <div className="flex flex-col flex-[7] min-w-0 gap-4 lg:gap-5">

            {/* Video */}
            <div className="w-full aspect-video bg-black rounded-xl overflow-hidden flex-none">
              <VideoLesson
                playerRef={handlePlayerRef}
                videoUrl={currentLesson.videoUrl}
                onTimeUpdate={setCurrentTime}
                onVideoComplete={onComplete}
              />
            </div>

            {/* Mobile transcript toggle tab */}
            <div className="lg:hidden flex rounded-xl overflow-hidden border border-gray-200 bg-white">
              <button
                onClick={() => setShowTranscriptMobile(false)}
                className={`flex-1 py-2.5 text-sm font-semibold transition-colors
                  ${!showTranscriptMobile ? 'bg-background text-white' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                Lesson Info
              </button>
              <button
                onClick={() => setShowTranscriptMobile(true)}
                className={`flex-1 py-2.5 text-sm font-semibold transition-colors
                  ${showTranscriptMobile ? 'bg-background text-white' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                Transcript
              </button>
            </div>

            {/* Mobile: show either info card or transcript based on toggle */}
            <div className="lg:hidden">
              {showTranscriptMobile ? (
                <div className="bg-white rounded-xl p-5 border border-gray-200" style={{ minHeight: '400px' }}>
                  <InteractiveTranscript
                    lines={transcriptLines}
                    currentTime={currentTime}
                    onSeek={handleSeek}
                  />
                </div>
              ) : (
                <LessonInfoCard
                  tag={currentLesson.tag}
                  title={currentLesson.title}
                  duration={currentLesson.duration}
                  description={currentLesson.description}
                  topics={currentLesson.topics}
                  faqs={currentLesson.faqs}
                  onContinue={onComplete}
                />
              )}
            </div>

            {/* Desktop: always show info card */}
            <div className="hidden lg:block">
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
          </div>

          {/* Right column: transcript — desktop only, sticky, collapsible */}
          {isTranscriptCollapsed ? (
            <button
              onClick={() => setIsTranscriptCollapsed(false)}
              className="hidden lg:flex flex-none w-10 flex-col items-center gap-2 bg-white rounded-xl border border-gray-200 py-4 sticky top-0 hover:bg-gray-50 transition-colors"
              style={{ maxHeight: 'calc(100vh - 72px - 80px)' }}
              aria-label="Show transcript"
              title="Show transcript"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
              <span
                className="text-[10px] font-bold uppercase tracking-widest text-gray-400"
                style={{ writingMode: 'vertical-rl' }}
              >
                Transcript
              </span>
            </button>
          ) : (
            <div
              className="hidden lg:flex flex-col flex-[3] min-w-0 bg-white rounded-xl p-5 border border-gray-200 overflow-hidden sticky top-0"
              style={{ maxHeight: 'calc(100vh - 72px - 80px)' }}
            >
              <InteractiveTranscript
                lines={transcriptLines}
                currentTime={currentTime}
                onSeek={handleSeek}
                onCollapse={() => setIsTranscriptCollapsed(true)}
              />
            </div>
          )}

        </div>
      ) : (
        <div className="flex flex-col gap-4 lg:gap-6 w-full">

          {/* Audio bar — decoupled from whatever's shown below, pause never hides content */}
          <AudioBar
            videoUrl={currentLesson.videoUrl}
            onTimeUpdate={setCurrentTime}
            playerRef={handlePlayerRef}
          />

          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 w-full">

            {/* Left column: PDF source material — the main reading surface */}
            <div className="flex flex-col flex-[7] min-w-0 gap-4 lg:gap-5">
              <div
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                style={{ minHeight: '600px', height: 'calc(100vh - 72px - 220px)' }}
              >
                <PdfViewer pdfUrl={currentLesson.pdfUrl} title={currentLesson.title} />
              </div>

              {/* Mobile: transcript stacks below the PDF, no toggle needed */}
              <div className="lg:hidden bg-white rounded-xl p-5 border border-gray-200" style={{ minHeight: '300px' }}>
                <InteractiveTranscript
                  lines={transcriptLines}
                  currentTime={currentTime}
                  onSeek={handleSeek}
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

            {/* Right column: transcript stays available to follow along with audio — desktop only, sticky, collapsible */}
            {isTranscriptCollapsed ? (
              <button
                onClick={() => setIsTranscriptCollapsed(false)}
                className="hidden lg:flex flex-none w-10 flex-col items-center gap-2 bg-white rounded-xl border border-gray-200 py-4 sticky top-0 hover:bg-gray-50 transition-colors"
                style={{ maxHeight: 'calc(100vh - 72px - 80px)' }}
                aria-label="Show transcript"
                title="Show transcript"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
                <span
                  className="text-[10px] font-bold uppercase tracking-widest text-gray-400"
                  style={{ writingMode: 'vertical-rl' }}
                >
                  Transcript
                </span>
              </button>
            ) : (
              <div
                className="hidden lg:flex flex-col flex-[3] min-w-0 bg-white rounded-xl p-5 border border-gray-200 overflow-hidden sticky top-0"
                style={{ maxHeight: 'calc(100vh - 72px - 80px)' }}
              >
                <InteractiveTranscript
                  lines={transcriptLines}
                  currentTime={currentTime}
                  onSeek={handleSeek}
                  onCollapse={() => setIsTranscriptCollapsed(true)}
                />
              </div>
            )}

          </div>
        </div>
      )}

      <CrawleyWidget lessonId={lessonId} transcriptLines={transcriptLines} />
    </>
  );
}