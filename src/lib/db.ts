/**
 * db.ts — all Supabase read/write operations for Crawlearn.
 *
 * Keeping DB calls here (not scattered across components) means
 * you only touch this file when the schema changes.
 */

import { supabase } from './supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserProgress {
  /** quizScores[moduleId][sectionId] = score */
  quizScores: Record<string, Record<string, number>>;
  /** set of moduleIds the user has fully completed */
  completedModules: Set<string>;
  /**
   * attempts[moduleId][sectionId] = attempt count already used.
   * Used by the final assessment to decide when to reveal answers.
   */
  attempts: Record<string, Record<string, number>>;
}

// ─── Read ─────────────────────────────────────────────────────────────────────

/**
 * Load all progress for the logged-in user in one round-trip.
 * Call this once on app boot after the session is established.
 */
export async function loadUserProgress(userId: string): Promise<UserProgress> {
  const [{ data: progress }, { data: completions }] = await Promise.all([
    supabase
      .from('user_section_progress')
      .select('module_id, section_id, quiz_score, attempts')
      .eq('user_id', userId),
    supabase
      .from('user_module_completions')
      .select('module_id')
      .eq('user_id', userId),
  ]);

  const quizScores: Record<string, Record<string, number>> = {};
  const attempts:   Record<string, Record<string, number>> = {};

  for (const row of progress ?? []) {
    // scores
    if (row.quiz_score !== null) {
      quizScores[row.module_id] ??= {};
      quizScores[row.module_id][row.section_id] = row.quiz_score;
    }
    // attempts
    attempts[row.module_id] ??= {};
    attempts[row.module_id][row.section_id] = row.attempts ?? 0;
  }

  const completedModules = new Set<string>(
    (completions ?? []).map((c: { module_id: string }) => c.module_id)
  );

  return { quizScores, completedModules, attempts };
}

// ─── Write ────────────────────────────────────────────────────────────────────

/**
 * Save a quiz submission. Always increments attempts.
 * For the final assessment, the DB trigger automatically writes to
 * user_module_completions when quiz_passed flips to true.
 */
export async function saveQuizScore({
  userId,
  moduleId,
  sectionId,
  score,
  passingScore,
  previousAttempts,
}: {
  userId:           string;
  moduleId:         string;
  sectionId:        string;
  score:            number;
  passingScore:     number;
  previousAttempts: number;
}) {
  const { error } = await supabase
    .from('user_section_progress')
    .upsert(
      {
        user_id:    userId,
        module_id:  moduleId,
        section_id: sectionId,
        quiz_score: score,
        quiz_passed: score >= passingScore,
        attempts:   previousAttempts + 1,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,module_id,section_id' }
    );

  if (error) throw error;
}

/**
 * Mark a video section as watched.
 * Safe to call multiple times — upsert is idempotent.
 */
export async function saveVideoComplete(
  userId:    string,
  moduleId:  string,
  sectionId: string
) {
  const { error } = await supabase
    .from('user_section_progress')
    .upsert(
      {
        user_id:         userId,
        module_id:       moduleId,
        section_id:      sectionId,
        video_completed: true,
        updated_at:      new Date().toISOString(),
      },
      { onConflict: 'user_id,module_id,section_id' }
    );

  if (error) console.error('saveVideoComplete:', error);
}
