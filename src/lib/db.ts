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

export interface LeaderboardEntry {
  rank:          number;
  userId:        string;
  name:          string;
  xp:            number;
  isCurrentUser: boolean;
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

  for (const row of (progress ?? []) as {
    module_id:  string;
    section_id: string;
    quiz_score: number | null;
    attempts:   number | null;
  }[]) {
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

/**
 * Load the current user's streak. Returns zeros if no profile row exists yet.
 */
export async function loadStreak(userId: string): Promise<{
  currentStreak:  number;
  longestStreak:  number;
  lastActiveDate: string | null;
}> {
  const { data, error } = await supabase
    .from('profiles')
    .select('current_streak, longest_streak, last_active_date')
    .eq('id', userId)
    .single();

  if (error || !data) return { currentStreak: 0, longestStreak: 0, lastActiveDate: null };

  return {
    currentStreak:  data.current_streak   ?? 0,
    longestStreak:  data.longest_streak   ?? 0,
    lastActiveDate: data.last_active_date ?? null,
  };
}

/**
 * Load the top N users by XP. XP itself is awarded automatically by a DB
 * trigger whenever quiz_passed flips to true on user_section_progress —
 * nothing to call here, this is a read-only leaderboard fetch.
 */
export async function loadLeaderboard(
  currentUserId: string,
  limit = 3
): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, display_name, xp')
    .order('xp', { ascending: false })
    .limit(limit);

  if (error || !data) { console.error('loadLeaderboard:', error); return []; }

  const topEntries = data.map((row: { id: string; display_name: string | null; xp: number | null }, i: number) => ({
    rank:          i + 1,
    userId:        row.id,
    name:          row.display_name ?? 'Learner',
    xp:            row.xp ?? 0,
    isCurrentUser: row.id === currentUserId,
  }));

  if (topEntries.some(entry => entry.isCurrentUser)) {
    return topEntries;
  }

  const { data: currentUser, error: currentUserError } = await supabase
    .from('profiles')
    .select('id, display_name, xp')
    .eq('id', currentUserId)
    .single();

  if (currentUserError || !currentUser) {
    console.error('loadLeaderboard current user:', currentUserError);
    return topEntries;
  }

  const currentXp = currentUser.xp ?? 0;
  const { count: higherCount, error: rankError } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .gt('xp', currentXp);

  if (rankError) {
    console.error('loadLeaderboard rank:', rankError);
    return topEntries;
  }

  return [
    ...topEntries,
    {
      rank:          (higherCount ?? topEntries.length) + 1,
      userId:        currentUser.id,
      name:          currentUser.display_name ?? 'Learner',
      xp:            currentXp,
      isCurrentUser: true,
    },
  ];
}

/**
 * Load the user's profile (display_name, user_number, etc.)
 * Returns null if no profile row exists yet.
 */
export async function loadUserProfile(userId: string): Promise<{
  displayName: string | null;
  userNumber:  number | null;
  xp:          number;
} | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('display_name, user_number, xp')
    .eq('id', userId)
    .single();

  if (error || !data) return null;

  return {
    displayName: data.display_name ?? null,
    userNumber:  data.user_number  ?? null,
    xp:          data.xp            ?? 0,
  };
}

export async function loadLearnerRank(userId: string): Promise<{
  rank:  number;
  total: number;
} | null> {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('xp')
    .eq('id', userId)
    .single();

  if (profileError || !profile) return null;

  const currentXp = profile.xp ?? 0;

  const [{ count: higherCount, error: higherError }, { count: totalCount, error: totalError }] = await Promise.all([
    supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .gt('xp', currentXp),
    supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true }),
  ]);

  if (higherError || totalError) {
    console.error('loadLearnerRank:', higherError ?? totalError);
    return null;
  }

  return {
    rank:  (higherCount ?? 0) + 1,
    total: totalCount ?? 0,
  };
}

// ─── Write ────────────────────────────────────────────────────────────────────

/**
 * Save a quiz submission. Always increments attempts.
 * For the final assessment, the DB trigger automatically writes to
 * user_module_completions when quiz_passed flips to true.
 *
 * XP + streak for a passed quiz are ALSO handled automatically by a DB
 * trigger on user_section_progress — no extra call needed here.
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
 *
 * Also bumps the daily streak. Quiz passes bump the streak automatically
 * via the DB trigger, but finishing a video doesn't touch quiz_passed, so
 * it's bumped explicitly here instead.
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

  if (error) { console.error('saveVideoComplete:', error); return; }

  const { error: streakError } = await supabase.rpc('bump_streak');
  if (streakError) console.error('bump_streak:', streakError);
}

/**
 * Save the display name the user sets in the onboarding modal.
 */
export async function saveDisplayName(userId: string, displayName: string) {
  const { error } = await supabase
    .from('profiles')
    .update({ display_name: displayName })
    .eq('id', userId);

  if (error) throw error;
}