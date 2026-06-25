import { SectionConfig } from '../types';

/**
 * Computes which sections are unlocked based on quiz scores.
 * Shared by CourseSidebar and Dashboard (mini-map).
 *
 * Rules:
 *  - First section always unlocked.
 *  - Chapter quiz: unlocks when its preceding video section is unlocked.
 *  - Chapter video (not first): unlocks when preceding quiz is passed.
 *  - Final assessment: unlocks when preceding quiz is passed.
 */
export function computeUnlocked(
  sections: SectionConfig[],
  quizScores: Record<string, number>
): Set<string> {
  const unlocked = new Set<string>();

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];

    if (i === 0) {
      unlocked.add(section.id);
      continue;
    }

    const prev = sections[i - 1];

    if (section.id.endsWith('final')) {
      const score  = quizScores[prev.id] ?? -1;
      const passed = prev.passingScore !== undefined && score >= prev.passingScore;
      if (passed) unlocked.add(section.id);
    } else if (!section.hasVideo) {
      // Chapter quiz: unlocks when its video is unlocked
      if (unlocked.has(prev.id)) unlocked.add(section.id);
    } else {
      // Next chapter video: unlocks when preceding quiz passed
      const score  = quizScores[prev.id] ?? -1;
      const passed = prev.passingScore !== undefined && score >= prev.passingScore;
      if (passed) unlocked.add(section.id);
    }
  }

  return unlocked;
}