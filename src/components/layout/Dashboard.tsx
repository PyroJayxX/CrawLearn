import { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { LearningState, ModuleConfig } from '../../types';
import { computeUnlocked } from '../../lib/progress';

interface DashboardProps {
  modules:      ModuleConfig[];
  currentState: LearningState;
  userName?:    string;
  onNavigate:   (moduleId: string, sectionId: string) => void;
}

// MiniMap component

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

  // Completed modules start collapsed; in-progress starts expanded
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

        const sections      = mod.sections.filter(s => s.id !== 'faq');
        const moduleScores  = quizScores[mod.id] ?? {};
        const unlocked      = computeUnlocked(sections, moduleScores);

        return (
          <div key={mod.id}>
            {/* Module row */}
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
              {/* Status dot */}
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

            {/* Section rows */}
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

                  // Video chapters are green when their following quiz is passed
                  const nextSec          = sections[si + 1];
                  const nextScore        = nextSec ? moduleScores[nextSec.id] : undefined;
                  const videoCompleted   = sec.hasVideo
                    && nextSec !== undefined
                    && !nextSec.hasVideo
                    && nextScore !== undefined
                    && nextSec.passingScore !== undefined
                    && nextScore >= nextSec.passingScore;

                  let dotColor = 'bg-gray-200';
                  if (!isSectionUnlocked)           dotColor = 'bg-gray-100';
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

// StatsDonut component

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
        if (sec.passingScore === undefined) continue; // skip video/faq sections
        const score = quizScores[mod.id]?.[sec.id];
        if (score === undefined)              remaining++;
        else if (score >= sec.passingScore)   passed++;
        else                                  failed++;
      }
    }
    return { passed, failed, remaining, total: passed + failed + remaining };
  }, [modules, quizScores]);

  const pct = total > 0 ? Math.round((passed / total) * 100) : 0;

  const data = [
    { name: 'Passed',     value: passed    || 0.001, color: '#3c99aa' },
    { name: 'Failed',     value: failed    || 0.001, color: '#f87171' },
    { name: 'Remaining',  value: remaining || 0.001, color: '#e5e7eb' },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Donut */}
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
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-gray-900">{pct}%</span>
          <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">done</span>
        </div>
      </div>

      {/* Legend */}
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

// Dashboard page

export default function Dashboard({ modules, currentState, userName, onNavigate }: DashboardProps) {
  const { completedModules, quizScores } = currentState;

  const firstName = useMemo(() => {
    if (!userName) return 'there';
    if (!userName.includes('@')) return userName.split(' ')[0];
    return userName.split('@')[0];
  }, [userName]);

  const realModules    = modules.filter(m => m.sections.some(s => (s.questions?.length ?? 0) > 0));
  const completedCount = realModules.filter(m => completedModules.has(m.id)).length;
  const overallPct     = realModules.length > 0
    ? Math.round((completedCount / realModules.length) * 100)
    : 0;

  const resumeTarget = useMemo(() => {
    for (const mod of modules) {
      // Skip completed modules
      if (completedModules.has(mod.id)) continue;

      // Skip locked modules
      const modIdx  = modules.findIndex(m => m.id === mod.id);
      const prevMod = modules[modIdx - 1];
      const isModUnlocked = modIdx === 0 || completedModules.has(prevMod?.id);
      if (!isModUnlocked) continue;

      const sections     = mod.sections.filter(s => s.id !== 'faq');
      const moduleScores = quizScores[mod.id] ?? {};

      for (let i = 0; i < sections.length; i++) {
        const sec = sections[i];

        if (sec.hasVideo) {
          // Video is done when its following quiz has been passed
          const nextSec   = sections[i + 1];
          const nextScore = nextSec ? (moduleScores[nextSec.id] ?? -1) : -1;
          const videoDone = nextSec
            && !nextSec.hasVideo
            && nextSec.passingScore !== undefined
            && nextScore >= nextSec.passingScore;
          if (!videoDone)
            return { moduleId: mod.id, sectionId: sec.id, moduleTitle: mod.title, sectionTitle: sec.title };
        } else {
          // Quiz/final: done when passed
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
    const idx  = modules.findIndex(m => m.id === mod.id);
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
    <div className="max-w-7xl mx-auto py-10 px-6">
      <div className="flex flex-col lg:flex-row gap-6 items-start">

        {/* Stats sidebar */}
        <div className="w-full lg:w-72 flex-none flex flex-col gap-4 lg:sticky lg:top-6">

          {/* Quick stats / donut */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-5 py-5">
            <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-4">Quiz Stats</p>
            <StatsDonut
              modules={modules}
              quizScores={quizScores}
              completedModules={completedModules}
            />
          </div>

          {/* Mini-map */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-4 py-5">
            <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3 px-1">Course Map</p>
            <MiniMap
              modules={modules}
              currentState={currentState}
              onNavigate={onNavigate}
            />
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">

          {/* Welcome card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-7 py-6 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-1">Dashboard</p>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {firstName}.</h1>
                <p className="text-gray-500 text-sm mt-1">
                  You've completed{' '}
                  <span className="font-semibold text-gray-700">{completedCount} of {realModules.length}</span>{' '}
                  modules.
                </p>
              </div>
              <div className="flex-none text-right">
                <span className="text-3xl font-bold text-accent">{overallPct}%</span>
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

          {/* Continue learning */}
          {resumeTarget && (
            <div className="bg-background rounded-2xl px-6 py-5 flex items-center justify-between gap-4">
              <div className="flex flex-col gap-0.5">
                <p className="text-xs font-bold tracking-widest uppercase text-white/40">Continue Learning</p>
                <p className="text-white font-bold text-lg leading-snug">{resumeTarget.moduleTitle}</p>
                <p className="text-white/60 text-sm">{resumeTarget.sectionTitle}</p>
              </div>
              <button
                onClick={() => onNavigate(resumeTarget.moduleId, resumeTarget.sectionId)}
                className="flex-none flex items-center gap-2 px-5 py-3 bg-white text-background font-bold text-sm rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                Resume
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          {/* Module list */}
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
                      flex items-center gap-5 px-5 py-4 transition-all
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

      </div>
    </div>
  );
}