import { TranscriptLine } from '../content/Transcript';

export function parseSrt(srt: string): TranscriptLine[] {
  const blocks = srt.trim().split(/\n\n+/);

  return blocks.map((block) => {
    const lines = block.trim().split('\n');
    const id = lines[0].trim();
    const timecode = lines[1];
    const text = lines.slice(2).join(' ');

    // Parse "00:00:15,000 --> 00:00:20,000" → start seconds
    const startTime = timecode.split(' --> ')[0];
    const [h, m, s] = startTime.split(':');
    const seconds = parseInt(h) * 3600 + parseInt(m) * 60 + parseFloat(s.replace(',', '.'));

    const totalSec = Math.floor(seconds);
    const mm = Math.floor(totalSec / 60);
    const ss = String(totalSec % 60).padStart(2, '0');

    return {
      id: `t${id}`,
      timeLabel: `${mm}:${ss}`,
      seconds,
      text,
    };
  });
}