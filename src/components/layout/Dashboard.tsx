import { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { LearningState, ModuleConfig } from '../../types';
import { computeUnlocked } from '../../lib/progress';
import { useStreak, useLeaderboard } from '../../lib/useDashboardData';

interface DashboardProps {
  modules:      ModuleConfig[];
  currentState: LearningState;
  userName?:    string;
  userId?:      string; // Supabase auth user id — needed for streak + leaderboard
  onNavigate:   (moduleId: string, sectionId: string) => void;
  onTutorMode?: () => void;
}

function MiniMap({
  modules,
  currentState,
  onNavigate,
}: {
  modules:      ModuleConfig[];
  currentState: LearningState;
  onNavigate:   (moduleId: string, sectionId: string) => void;
}) {
  const { completedModules, quizScores, currentModuleId, currentSectionId } = currentState;

  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const s = new Set<string>();
    modules.forEach(mod => {
      const idx  = modules.findIndex(m => m.id === mod.id);
      const prev = modules[idx - 1];
      const isUnlockedMod = idx === 0 || completedModules.has(prev?.id);
      if (isUnlockedMod && !completedModules.has(mod.id)) s.add(mod.id);
    });
    return s;
  });

  const toggle = (modId: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(modId) ? next.delete(modId) : next.add(modId);
      return next;
    });
  };

  return (
    <div className="flex flex-col">
      {modules.map((mod, idx) => {
        const prevMod    = modules[idx - 1];
        const isUnlocked = idx === 0 || completedModules.has(prevMod?.id);
        const isDone     = completedModules.has(mod.id);
        const isCurrent  = mod.id === currentModuleId;
        const isOpen     = expanded.has(mod.id);

        const sections     = mod.sections.filter(s => s.id !== 'faq');
        const moduleScores = quizScores[mod.id] ?? {};
        const unlocked     = computeUnlocked(sections, moduleScores);

        return (
          <div key={mod.id}>
            <button
              onClick={() => isUnlocked && toggle(mod.id)}
              disabled={!isUnlocked}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors
                ${!isUnlocked
                  ? 'opacity-40 cursor-not-allowed'
                  : isCurrent
                  ? 'bg-accent/10'
                  : 'hover:bg-gray-100'}`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center flex-none
                ${isDone
                  ? 'bg-accent'
                  : isCurrent
                  ? 'bg-accent/30 ring-2 ring-accent'
                  : isUnlocked
                  ? 'bg-gray-300'
                  : 'bg-gray-200'}`}
              >
                {isDone ? (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : !isUnlocked ? (
                  <svg className="w-2 h-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ) : null}
              </span>

              <span className={`flex-1 text-xs font-semibold truncate
                ${isCurrent ? 'text-accent' : isUnlocked ? 'text-gray-700' : 'text-gray-400'}`}>
                {mod.title}
              </span>

              {isUnlocked && (
                <svg
                  className={`w-3 h-3 text-gray-400 flex-none transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>

            {isOpen && isUnlocked && (
              <div className="ml-5 mb-1 border-l-2 border-gray-100 pl-3 flex flex-col gap-0.5">
                {sections.map((sec, si) => {
                  const isSectionUnlocked = unlocked.has(sec.id);
                  const isSectionActive   = sec.id === currentSectionId && isCurrent;
                  const score             = moduleScores[sec.id];
                  const passed            = score !== undefined
                    && sec.passingScore !== undefined
                    && score >= sec.passingScore;
                  const failed            = score !== undefined && !passed && sec.passingScore !== undefined;

                  const nextSec        = sections[si + 1];
                  const nextScore      = nextSec ? moduleScores[nextSec.id] : undefined;
                  const videoCompleted = sec.hasVideo
                    && nextSec !== undefined
                    && !nextSec.hasVideo
                    && nextScore !== undefined
                    && nextSec.passingScore !== undefined
                    && nextScore >= nextSec.passingScore;

                  let dotColor = 'bg-gray-200';
                  if (!isSectionUnlocked)            dotColor = 'bg-gray-100';
                  else if (passed || videoCompleted) dotColor = 'bg-green-400';
                  else if (failed)                   dotColor = 'bg-red-300';
                  else if (isSectionActive)          dotColor = 'bg-accent';

                  return (
                    <button
                      key={sec.id}
                      disabled={!isSectionUnlocked}
                      onClick={() => isSectionUnlocked && onNavigate(mod.id, sec.id)}
                      className={`flex items-center gap-2 py-1.5 px-2 rounded-lg text-left transition-colors w-full
                        ${!isSectionUnlocked
                          ? 'opacity-40 cursor-not-allowed'
                          : isSectionActive
                          ? 'bg-accent/10'
                          : 'hover:bg-gray-50'}`}
                    >
                      <span className={`w-2 h-2 rounded-full flex-none ${dotColor}`} />
                      <span className={`text-[11px] truncate flex-1
                        ${isSectionActive ? 'text-accent font-semibold' : 'text-gray-600'}`}>
                        {sec.title}
                      </span>
                      {sec.passingScore !== undefined && score !== undefined && (
                        <span className={`text-[10px] font-bold flex-none
                          ${passed ? 'text-green-500' : 'text-red-400'}`}>
                          {score}/{sec.questions?.length ?? sec.questionCount ?? 0}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function StatsDonut({
  modules,
  quizScores,
  completedModules,
}: {
  modules:          ModuleConfig[];
  quizScores:       Record<string, Record<string, number>>;
  completedModules: Set<string>;
}) {
  const { passed, failed, remaining, total } = useMemo(() => {
    let passed = 0, failed = 0, remaining = 0;
    for (const mod of modules) {
      for (const sec of mod.sections) {
        if (sec.passingScore === undefined) continue;
        const score = quizScores[mod.id]?.[sec.id];
        if (score === undefined)            remaining++;
        else if (score >= sec.passingScore) passed++;
        else                                failed++;
      }
    }
    return { passed, failed, remaining, total: passed + failed + remaining };
  }, [modules, quizScores]);

  const hasAnyData = passed > 0 || failed > 0;
  const pct = total > 0 ? Math.round((passed / total) * 100) : 0;

  if (!hasAnyData) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">
          Your quiz stats will appear<br />here as you progress.
        </p>
      </div>
    );
  }

  const data = [
    { name: 'Passed',    value: passed    || 0.001, color: '#3c99aa' },
    { name: 'Failed',    value: failed    || 0.001, color: '#f87171' },
    { name: 'Remaining', value: remaining || 0.001, color: '#e5e7eb' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative h-36">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={44}
              outerRadius={60}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e5e7eb' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-gray-900">{pct}%</span>
          <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">done</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {[
          { label: 'Passed',    value: passed,    color: 'bg-accent' },
          { label: 'Failed',    value: failed,    color: 'bg-red-300' },
          { label: 'Remaining', value: remaining, color: 'bg-gray-200' },
        ].map(item => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full flex-none ${item.color}`} />
              <span className="text-xs text-gray-600">{item.label}</span>
            </div>
            <span className="text-xs font-semibold text-gray-700">
              {item.value} <span className="text-gray-400 font-normal">/ {total}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Streak — now backed by Supabase via useStreak() ─────────────────────
function StreakTracker({ userId }: { userId?: string }) {
  const { streak, loading } = useStreak(userId);

  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  // JS getDay(): 0 = Sunday ... 6 = Saturday. Convert to Mon-first index (0-6).
  const todayIdx = (new Date().getDay() + 6) % 7;

  if (!userId || loading) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gray-100 flex-none" />
          <div className="flex flex-col gap-1.5">
            <div className="h-6 w-8 bg-gray-100 rounded" />
            <div className="h-2.5 w-16 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    );
  }

  const currentStreak = streak?.currentStreak ?? 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-orange-100 flex items-center justify-center flex-none">
          <span className="text-lg">🔥</span>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900 leading-none">{currentStreak}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">day streak</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-1">
        {days.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1 flex-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors
                ${i === todayIdx
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-gray-200 bg-gray-50 text-gray-400'}`}
            >
              {d}
            </div>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-gray-400 leading-relaxed">
        Complete a chapter or quiz today to keep your streak going!
      </p>
    </div>
  );
}

// ── Leaderboard — now backed by Supabase via useLeaderboard() ───────────
function Leaderboard({ userId }: { userId?: string }) {
  const { entries, loading } = useLeaderboard(userId, 3);

  const medalColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-100 text-yellow-700';
    if (rank === 2) return 'bg-gray-100 text-gray-500';
    if (rank === 3) return 'bg-orange-100 text-orange-600';
    return 'bg-gray-50 text-gray-400';
  };

  if (!userId || loading) {
    return (
      <div className="flex flex-col gap-2 animate-pulse">
        {[0, 1, 2].map(i => (
          <div key={i} className="h-10 bg-gray-100 rounded-lg" />
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <p className="text-xs text-gray-400 leading-relaxed py-4 text-center">
        No XP earned yet — pass a quiz to appear on the leaderboard.
      </p>
    );
  }

  const topEntries = entries.slice(0, 3);
  const currentUserEntry = entries.find(entry => entry.isCurrentUser);
  const showSkippedBreak = Boolean(currentUserEntry && currentUserEntry.rank > 3);

  return (
    <div className="flex flex-col gap-2">
      {topEntries.map(entry => (
        <div
          key={entry.userId}
          className={`flex items-center gap-3 px-2.5 py-2 rounded-lg
            ${entry.isCurrentUser ? 'bg-accent/10 ring-1 ring-accent/30' : ''}`}
        >
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-none ${medalColor(entry.rank)}`}>
            {entry.rank}
          </span>
          <span className={`flex-1 text-xs truncate ${entry.isCurrentUser ? 'font-bold text-accent' : 'font-medium text-gray-700'}`}>
            {entry.name}{entry.isCurrentUser ? ' (You)' : ''}
          </span>
          <span className="text-[11px] font-semibold text-gray-400 flex-none">
            {entry.xp} XP
          </span>
        </div>
      ))}

      {showSkippedBreak && currentUserEntry && (
        <div className="flex items-center gap-3 py-2 px-1">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs font-semibold tracking-[0.35em] text-gray-300 uppercase leading-none">
            •••
          </span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>
      )}

      {showSkippedBreak && currentUserEntry && (
        <div
          className="flex items-center gap-3 px-2.5 py-2 rounded-lg bg-accent/10 ring-1 ring-accent/30"
        >
          <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-none bg-accent/15 text-accent">
            {currentUserEntry.rank}
          </span>
          <span className="flex-1 text-xs truncate font-bold text-accent">
            {currentUserEntry.name} (You)
          </span>
          <span className="text-[11px] font-semibold text-gray-400 flex-none">
            {currentUserEntry.xp} XP
          </span>
        </div>
      )}
    </div>
  );
}

// ── Tutor Mode teaser card ───────────────────────────────────────────────
function TutorModeCard({ onTutorMode }: { onTutorMode?: () => void }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-5 py-5 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full flex items-center justify-center flex-none bg-accent/15 border-2 border-accent/25">
          <svg className="w-5 h-5" style={{ color: '#0f6f5c' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 leading-tight">Tutor Mode</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Ask Crawley anything</p>
        </div>
      </div>
      <p className="text-xs text-gray-400 leading-relaxed">
        Get quizzed, ask for an explanation, or drill your weak spots — anytime.
      </p>
      <button
        onClick={onTutorMode ?? (() => console.log('Tutor Mode: no onTutorMode handler wired up yet'))}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
      >
        Open Tutor Mode
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

export default function Dashboard({ modules, currentState, userName, userId, onNavigate, onTutorMode }: DashboardProps) {
  const { completedModules, quizScores } = currentState;

  const [bannerDismissed, setBannerDismissed] = useState(false);

  const firstName = useMemo(() => {
    if (!userName) return 'there';
    if (!userName.includes('@')) return userName.split(' ')[0];
    return userName.split('@')[0];
  }, [userName]);

  const hasAnyProgress = useMemo(() =>
    Object.keys(quizScores).length > 0 || completedModules.size > 0,
  [quizScores, completedModules]);

  const realModules    = modules.filter(m => m.sections.some(s => (s.questions?.length ?? 0) > 0));
  const completedCount = realModules.filter(m => completedModules.has(m.id)).length;
  const overallPct     = realModules.length > 0
    ? Math.round((completedCount / realModules.length) * 100)
    : 0;

  const resumeTarget = useMemo(() => {
    for (const mod of modules) {
      if (completedModules.has(mod.id)) continue;
      const modIdx  = modules.findIndex(m => m.id === mod.id);
      const prevMod = modules[modIdx - 1];
      const isModUnlocked = modIdx === 0 || completedModules.has(prevMod?.id);
      if (!isModUnlocked) continue;

      const sections     = mod.sections.filter(s => s.id !== 'faq');
      const moduleScores = quizScores[mod.id] ?? {};

      for (let i = 0; i < sections.length; i++) {
        const sec = sections[i];
        if (sec.hasVideo) {
          const nextSec   = sections[i + 1];
          const nextScore = nextSec ? (moduleScores[nextSec.id] ?? -1) : -1;
          const videoDone = nextSec
            && !nextSec.hasVideo
            && nextSec.passingScore !== undefined
            && nextScore >= nextSec.passingScore;
          if (!videoDone)
            return { moduleId: mod.id, sectionId: sec.id, moduleTitle: mod.title, sectionTitle: sec.title };
        } else {
          const score  = moduleScores[sec.id] ?? -1;
          const passed = sec.passingScore !== undefined && score >= sec.passingScore;
          if (!passed)
            return { moduleId: mod.id, sectionId: sec.id, moduleTitle: mod.title, sectionTitle: sec.title };
        }
      }
    }
    return null;
  }, [modules, quizScores, completedModules]);

  const getModuleStatus = (mod: ModuleConfig): 'completed' | 'in-progress' | 'locked' => {
    if (completedModules.has(mod.id)) return 'completed';
    const idx = modules.findIndex(m => m.id === mod.id);
    if (idx === 0) return 'in-progress';
    return completedModules.has(modules[idx - 1]?.id) ? 'in-progress' : 'locked';
  };

  const getModuleProgress = (mod: ModuleConfig) => {
    const gradeable = mod.sections.filter(s => !s.hasVideo && s.id !== 'faq' && s.passingScore !== undefined);
    const passed    = gradeable.filter(s => (quizScores[mod.id]?.[s.id] ?? -1) >= (s.passingScore ?? Infinity));
    return { passed: passed.length, total: gradeable.length };
  };

  const getFirstIncompleteSection = (mod: ModuleConfig): string => {
    for (const sec of mod.sections.filter(s => s.id !== 'faq')) {
      if (sec.hasVideo) return sec.id;
      const score  = quizScores[mod.id]?.[sec.id] ?? -1;
      const passed = sec.passingScore !== undefined && score >= sec.passingScore;
      if (!passed) return sec.id;
    }
    return mod.sections[0].id;
  };

  return (
    <div className="max-w-[100rem] mx-auto py-6 sm:py-10 px-4 sm:px-6">

      {!hasAnyProgress && !bannerDismissed && (
        <div className="mb-6 bg-background rounded-2xl px-4 sm:px-6 py-5 flex items-start justify-between gap-4 sm:gap-6">
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-1">Getting started</p>
              <h2 className="text-lg font-bold text-white">Welcome to CrawLearn!</h2>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Each module starts with a video lesson followed by a short quiz.
              Pass the quiz to unlock the next chapter, and complete the Final Assessment
              to move on to the next module.
            </p>
            <div className="mt-1">
              <button
                onClick={() => onNavigate('module1', 'ch1')}
                className="px-5 py-2.5 rounded-lg bg-white text-background text-sm font-bold hover:opacity-90 transition-opacity"
              >
                Start Module 1 →
              </button>
            </div>
          </div>
          <button
            onClick={() => setBannerDismissed(true)}
            className="text-white/30 hover:text-white/60 transition-colors flex-none mt-0.5"
            aria-label="Dismiss"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* CHANGED: Added justify-center here so columns stay tightly grouped together in the middle */}
      <div className="flex flex-col xl:flex-row gap-6 items-start justify-center">

        {/* First column: Quiz Stats + Course Map — hidden on mobile/tablet, shown from xl breakpoint up */}
        <div className="hidden xl:flex w-full xl:w-72 flex-none flex-col gap-4 xl:sticky xl:top-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-5 py-5">
            <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-4">Quiz Stats</p>
            <StatsDonut
              modules={modules}
              quizScores={quizScores}
              completedModules={completedModules}
            />
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-4 py-5">
            <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3 px-1">Course Map</p>
            <MiniMap
              modules={modules}
              currentState={currentState}
              onNavigate={onNavigate}
            />
          </div>
        </div>

        {/* CHANGED: Removed flex-1 min-w-0 and added w-full xl:max-w-3xl to keep it cleanly sized */}
        <div className="w-full xl:max-w-3xl flex flex-col gap-6">

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-5 sm:px-7 py-5 sm:py-6 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-1">Dashboard</p>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Welcome back, {firstName}.</h1>
                <p className="text-gray-500 text-sm mt-1">
                  You've completed{' '}
                  <span className="font-semibold text-gray-700">{completedCount} of {realModules.length}</span>{' '}
                  modules.
                </p>
              </div>
              <div className="flex-none text-right">
                <span className="text-2xl sm:text-3xl font-bold text-accent">{overallPct}%</span>
                <p className="text-[11px] text-gray-400 mt-0.5">complete</p>
              </div>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out bg-accent"
                style={{ width: `${overallPct}%` }}
              />
            </div>
          </div>

          {hasAnyProgress && resumeTarget && (
            <div className="bg-background rounded-2xl px-4 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col gap-0.5">
                <p className="text-xs font-bold tracking-widest uppercase text-white/40">Continue Learning</p>
                <p className="text-white font-bold text-lg leading-snug">{resumeTarget.moduleTitle}</p>
                <p className="text-white/60 text-sm">{resumeTarget.sectionTitle}</p>
              </div>
              <button
                onClick={() => onNavigate(resumeTarget.moduleId, resumeTarget.sectionId)}
                className="flex-none flex items-center justify-center gap-2 px-5 py-3 bg-white text-background font-bold text-sm rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap w-full sm:w-auto"
              >
                Resume
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">Course Modules</p>
            <div className="flex flex-col gap-2">
              {modules.map((mod, index) => {
                const status     = getModuleStatus(mod);
                const progress   = getModuleProgress(mod);
                const isLocked   = status === 'locked';
                const isDone     = status === 'completed';
                const hasContent = mod.sections.some(s => (s.questions?.length ?? 0) > 0 || s.hasVideo);
                const quizSections = mod.sections.filter(
                  s => !s.hasVideo && s.id !== 'faq' && (s.questions?.length ?? 0) > 0
                );

                return (
                  <div
                    key={mod.id}
                    onClick={() => {
                      if (isLocked || !hasContent) return;
                      onNavigate(mod.id, getFirstIncompleteSection(mod));
                    }}
                    className={`
                      bg-white border border-gray-200 rounded-xl shadow-sm
                      flex items-center gap-3 sm:gap-5 px-4 sm:px-5 py-4 transition-all
                      ${isLocked || !hasContent
                        ? 'opacity-40 cursor-not-allowed'
                        : 'hover:shadow-md hover:border-gray-300 cursor-pointer'}
                    `}
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-none font-bold text-sm
                      ${isDone   ? 'bg-accent/15 text-accent'
                      : isLocked ? 'bg-gray-100 text-gray-400'
                                 : 'bg-background/10 text-background border-2 border-background/20'}`}
                    >
                      {isDone ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : isLocked ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      ) : index + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-gray-900">{mod.title}</p>
                        {!isLocked && hasContent && progress.total > 0 && (
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full
                            ${isDone ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                          >
                            {progress.passed}/{progress.total} passed
                          </span>
                        )}
                        {!hasContent && (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
                            Coming soon
                          </span>
                        )}
                      </div>
                      {!isLocked && quizSections.length > 0 && (
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          {quizSections.map(sec => {
                            const score  = quizScores[mod.id]?.[sec.id];
                            const passed = score !== undefined && sec.passingScore !== undefined && score >= sec.passingScore;
                            return (
                              <span key={sec.id} className={`text-[11px] font-medium
                                ${score !== undefined ? (passed ? 'text-green-600' : 'text-red-400') : 'text-gray-400'}`}>
                                {sec.title}: {score !== undefined ? `${score}/${sec.questions?.length ?? 0}` : '—'}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {!isLocked && hasContent && (
                      <svg className="w-4 h-4 text-gray-300 flex-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="w-full xl:w-72 flex-none flex flex-col gap-4 xl:sticky xl:top-6">
          <TutorModeCard onTutorMode={onTutorMode} />

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-5 py-5">
            <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-4">Streak</p>
            <StreakTracker userId={userId} />
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-4 py-5">
            <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3 px-1">Leaderboard</p>
            <Leaderboard userId={userId} />
          </div>
        </div>

      </div>
    </div>
  );
}