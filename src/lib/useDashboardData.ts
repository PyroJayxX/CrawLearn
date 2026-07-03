import { useEffect, useState } from 'react';
import { loadStreak, loadLeaderboard, LeaderboardEntry } from './db';

// ── Streak ───────────────────────────────────────────────────────────────

export interface StreakData {
  currentStreak:  number;
  longestStreak:  number;
  lastActiveDate: string | null;
}

export function useStreak(userId?: string) {
  const [streak,  setStreak]  = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    let cancelled = false;
    setLoading(true);

    loadStreak(userId).then(data => {
      if (cancelled) return;
      setStreak(data);
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [userId]);

  return { streak, loading };
}

// ── Leaderboard ──────────────────────────────────────────────────────────

export function useLeaderboard(currentUserId?: string, limit = 5) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUserId) { setLoading(false); return; }
    let cancelled = false;
    setLoading(true);

    loadLeaderboard(currentUserId, limit).then(data => {
      if (cancelled) return;
      setEntries(data);
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [currentUserId, limit]);

  return { entries, loading };
}
