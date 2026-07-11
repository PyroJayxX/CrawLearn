import { useMemo, useState } from 'react';
import { LearningState, ModuleConfig } from '../../types';
import { playCorrect, playDragClick, playIncorrect, playPass } from '../../lib/sounds';

type TutorMode = 'home' | 'quiz' | 'explain' | 'scenario' | 'weakspot';

interface TutorPageProps {
  modules: ModuleConfig[];
  currentState: LearningState;
  sectionAttempts: Record<string, Record<string, number>>;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface ScenarioData {
  scenario: string;
  keyPoints: string[];
}

interface GradeResult {
  score: number;
  verdict: 'strong' | 'partial' | 'weak';
  feedback: string;
  hits: string[];
  misses: string[];
}

interface WeakSpot {
  moduleId: string;
  moduleTitle: string;
  sectionId: string;
  sectionTitle: string;
  chapter?: string; // e.g. "Chapter 2" — omitted for Finals so /api/quiz falls back to whole-module material
  score: number;
  total: number;
  ratio: number;
  attempts: number;
}

export default function TutorPage({ modules, currentState, sectionAttempts }: TutorPageProps) {
  const [mode, setMode] = useState<TutorMode>('home');
  const [selectedModuleId, setSelectedModuleId] = useState(
    modules.find(mod => mod.id === currentState.currentModuleId)?.id ?? modules[0]?.id ?? ''
  );
  const [selectedChapter, setSelectedChapter] = useState('Chapter 1');
  const [topic, setTopic] = useState('');

  // RAG explain state
  const [explainAnswer, setExplainAnswer] = useState<string | null>(null);
  const [explainLoading, setExplainLoading] = useState(false);
  const [explainStreaming, setExplainStreaming] = useState(false);
  const [explainError, setExplainError] = useState<string | null>(null);

  // RAG quiz state — all questions are fetched in a single batch call up
  // front, then the user pages through them locally with no further
  // network round-trips.
  const TOTAL_QUIZ_QUESTIONS = 5;
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  // Scenario mode state
  const [scenarioData, setScenarioData] = useState<ScenarioData | null>(null);
  const [scenarioLoading, setScenarioLoading] = useState(false);
  const [scenarioError, setScenarioError] = useState<string | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [gradeResult, setGradeResult] = useState<GradeResult | null>(null);
  const [gradingLoading, setGradingLoading] = useState(false);
  const [gradingError, setGradingError] = useState<string | null>(null);

  // Weak spot targeter state — drilling reuses /api/quiz (same as quiz mode),
  // but results are never persisted: no saveQuizScore call, unscored practice only.
  const [drillTarget, setDrillTarget] = useState<WeakSpot | null>(null);
  const [drillQuestions, setDrillQuestions] = useState<QuizQuestion[]>([]);
  const [drillIndex, setDrillIndex] = useState(0);
  const [drillLoading, setDrillLoading] = useState(false);
  const [drillError, setDrillError] = useState<string | null>(null);
  const [drillAnswers, setDrillAnswers] = useState<Record<number, number>>({});

  const tutorModules = useMemo(() => modules.slice(0, 6), [modules]);

  // Scans ALL modules (not just tutorModules) since weak-spot detection should
  // reflect whatever the user has actually attempted, not the Quiz-mode dropdown's
  // content-availability limit.
  const weakSpots = useMemo<WeakSpot[]>(() => {
  const list: WeakSpot[] = [];

  modules.forEach(mod => {
    mod.sections.forEach(sec => {
      const isQuizBearing = sec.id.endsWith('-quiz') || sec.id.endsWith('final');
      if (!isQuizBearing) return;

      const score = currentState.quizScores[mod.id]?.[sec.id];
      if (score === undefined) return;

      const passingScore = sec.passingScore ?? 0;
      if (score < passingScore) return; // must be passed

      const total = sec.questionCount ?? sec.questions?.length ?? 0;
      if (!total) return;

      if (score >= total) return; // perfect score — skip, nothing to drill

      const chapterMatch = sec.id.match(/ch(\d+)-quiz$/);
      const chapter = chapterMatch ? `Chapter ${chapterMatch[1]}` : undefined;

      list.push({
        moduleId: mod.id,
        moduleTitle: mod.title,
        sectionId: sec.id,
        sectionTitle: sec.title,
        chapter,
        score,
        total,
        ratio: score / total,
        attempts: sectionAttempts?.[mod.id]?.[sec.id] ?? 0,
      });
    });
  });

  return list.sort((a, b) => {
    if (a.ratio !== b.ratio) return a.ratio - b.ratio;
    return b.attempts - a.attempts;
  });
}, [modules, currentState.quizScores, sectionAttempts]);

  const promptText = (() => {
    if (mode === 'explain') {
      // explainLoading = waiting on retrieval, before any text has arrived yet.
      // explainStreaming = text is actively arriving (explainAnswer already
      // has partial content by this point, so it takes priority below).
      if (explainLoading) return 'Let me look that up in the course material...';
      if (explainError) return `Hmm, something went wrong: ${explainError}`;
      if (explainAnswer) return explainAnswer;
      return 'What topic or concept would you like me to explain?';
    }
    if (mode === 'quiz') {
      if (quizLoading) return 'Putting together your quiz...';
      if (quizError) return `Hmm, something went wrong: ${quizError}`;
      if (quizQuestions.length > 0) {
        return `Question ${quizIndex + 1} of ${quizQuestions.length}`;
      }
      return 'Sure! Which module and chapter do you want to be quizzed on?';
    }
    if (mode === 'scenario') {
      if (scenarioLoading) return 'Cooking up a real-world scenario...';
      if (scenarioError) return `Hmm, something went wrong: ${scenarioError}`;
      if (gradingLoading) return 'Let me grade that...';
      if (gradingError) return `Hmm, something went wrong: ${gradingError}`;
      if (gradeResult) return gradeResult.feedback;
      if (scenarioData) return scenarioData.scenario;
      return 'Which module do you want a scenario from?';
    }
    if (mode === 'weakspot') {
      if (drillTarget) {
        if (drillLoading) return 'Pulling together some practice questions...';
        if (drillError) return `Hmm, something went wrong: ${drillError}`;
        if (drillQuestions.length > 0) {
          return `Question ${drillIndex + 1} of ${drillQuestions.length}`;
        }
        return 'Getting that ready...';
      }
      return weakSpots.length > 0
        ? "Here's where extra practice would help most, ranked from weakest to strongest. Pick one to drill."
        : "You don't have any passed quizzes yet to analyze — come back once you've completed a few!";
    }
    switch (mode) {
      default:
        return 'Hey! What would you like to do today?';
    }
  })();

  // Long Crawley responses (e.g. RAG explain answers) look oversized at the
  // default speech-bubble font. Step the size down as length grows so long
  // answers still read comfortably instead of overflowing/wrapping oddly.
  const promptTextSizeClass = (() => {
    const len = promptText.length;
    if (len > 400) return 'text-sm md:text-base';
    if (len > 220) return 'text-base md:text-lg';
    if (len > 120) return 'text-lg md:text-xl';
    return 'text-xl md:text-2xl';
  })();

  const resetToHome = () => {
    setMode('home');
    setExplainAnswer(null);
    setExplainError(null);
    setExplainStreaming(false);
    setQuizQuestions([]);
    setQuizIndex(0);
    setQuizStarted(false);
    setQuizError(null);
    setSelectedAnswers({});
    setScenarioData(null);
    setScenarioError(null);
    setUserAnswer('');
    setGradeResult(null);
    setGradingError(null);
    setDrillTarget(null);
    setDrillQuestions([]);
    setDrillIndex(0);
    setDrillError(null);
    setDrillAnswers({});
    setDrillLoading(false);
  };

  // Leaves an in-progress drill but stays on the weak-spot list, rather than
  // bouncing all the way back to the home menu.
  const handleBackToWeakSpotList = () => {
    setDrillTarget(null);
    setDrillQuestions([]);
    setDrillIndex(0);
    setDrillError(null);
    setDrillAnswers({});
    setDrillLoading(false);
  };

  const handleSelectAnswer = (qi: number, oi: number, correctIndex: number, isLastQuestion: boolean) => {
    playDragClick();
    setSelectedAnswers(prev => ({ ...prev, [qi]: oi }));

    const isCorrect = oi === correctIndex;
    setTimeout(() => {
      if (isCorrect) playCorrect();
      else playIncorrect();

      if (isLastQuestion) {
        setTimeout(() => playPass(), 300);
      }
    }, 120);
  };

  const handleStartQuiz = async () => {
    setQuizStarted(true);
    setQuizQuestions([]);
    setQuizIndex(0);
    setSelectedAnswers({});
    setQuizLoading(true);
    setQuizError(null);

    const moduleTitle = tutorModules.find(m => m.id === selectedModuleId)?.title;

    try {
      const res = await fetch(`/api/quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId: selectedModuleId,
          moduleTitle,
          chapter: selectedChapter,
        }),
      });

      if (!res.ok) throw new Error(`Server responded ${res.status}`);

      const data: { questions?: QuizQuestion[]; error?: string } = await res.json();
      if (data.error) throw new Error(data.error);
      if (!data.questions || data.questions.length === 0) throw new Error('No questions returned.');
      setQuizQuestions(data.questions);
    } catch (err) {
      setQuizError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setQuizLoading(false);
    }
  };

  const handleNextQuizQuestion = () => {
    setQuizIndex(i => Math.min(i + 1, quizQuestions.length - 1));
  };

  // Drill flow mirrors handleStartQuiz/handleNextQuizQuestion, but targets a
  // specific weak-spot section instead of the module/chapter dropdown, and
  // never calls saveQuizScore — this is unscored practice only.
  const handleSelectWeakSpot = async (spot: WeakSpot) => {
    setDrillTarget(spot);
    setDrillQuestions([]);
    setDrillIndex(0);
    setDrillAnswers({});
    setDrillError(null);
    setDrillLoading(true);

    try {
      const res = await fetch(`/api/quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId: spot.moduleId,
          moduleTitle: spot.moduleTitle,
          chapter: spot.chapter, // omitted for finals -> whole-module fallback in quiz.js
        }),
      });

      if (!res.ok) throw new Error(`Server responded ${res.status}`);

      const data: { questions?: QuizQuestion[]; error?: string } = await res.json();
      if (data.error) throw new Error(data.error);
      if (!data.questions || data.questions.length === 0) throw new Error('No questions returned.');
      setDrillQuestions(data.questions);
    } catch (err) {
      setDrillError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setDrillLoading(false);
    }
  };

  const handleSelectDrillAnswer = (qi: number, oi: number, correctIndex: number, isLastQuestion: boolean) => {
    playDragClick();
    setDrillAnswers(prev => ({ ...prev, [qi]: oi }));

    const isCorrect = oi === correctIndex;
    setTimeout(() => {
      if (isCorrect) playCorrect();
      else playIncorrect();

      if (isLastQuestion) {
        setTimeout(() => playPass(), 300);
      }
    }, 120);
  };

  const handleNextDrillQuestion = () => {
    setDrillIndex(i => Math.min(i + 1, drillQuestions.length - 1));
  };

  const handleAskCrawley = async () => {
    if (!topic.trim()) return;

    setExplainLoading(true);
    setExplainStreaming(false);
    setExplainError(null);
    setExplainAnswer(null);

    try {
      const res = await fetch(`/api/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: topic,
          module: selectedModuleId || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server responded ${res.status}`);
      }

      const contentType = res.headers.get('Content-Type') ?? '';

      // No-results case: explain.js falls back to a plain JSON response
      // instead of opening a stream, when there's no course material to
      // ground an answer in.
      if (!contentType.includes('text/event-stream')) {
        const data: { answer: string; sources?: unknown } = await res.json();
        setExplainAnswer(data.answer);
        setExplainLoading(false);
        return;
      }

      if (!res.body) throw new Error('No response stream received.');

      setExplainLoading(false);
      setExplainStreaming(true);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? ''; // keep any partial trailing line for next chunk

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (!jsonStr) continue;

          let parsed: { sources?: unknown; delta?: string; done?: boolean; error?: string };
          try {
            parsed = JSON.parse(jsonStr);
          } catch {
            continue; // ignore any malformed frame rather than crashing the stream
          }

          if (parsed.error) throw new Error(parsed.error);

          if (parsed.delta) {
            accumulated += parsed.delta;
            setExplainAnswer(accumulated);
          }
          // parsed.sources and parsed.done are both received but currently
          // unused here — sources could be surfaced in the UI later if needed.
        }
      }
    } catch (err) {
      setExplainError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setExplainLoading(false);
      setExplainStreaming(false);
    }
  };

  const handleGenerateScenario = async () => {
    setScenarioLoading(true);
    setScenarioError(null);
    setScenarioData(null);
    setUserAnswer('');
    setGradeResult(null);
    setGradingError(null);

    const moduleTitle = tutorModules.find(m => m.id === selectedModuleId)?.title;

    try {
      const res = await fetch(`/api/scenario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleId: selectedModuleId, moduleTitle }),
      });

      if (!res.ok) throw new Error(`Server responded ${res.status}`);

      const data: { scenario?: string; keyPoints?: string[]; error?: string } = await res.json();
      if (data.error) throw new Error(data.error);
      if (!data.scenario) throw new Error('No scenario returned.');
      setScenarioData({ scenario: data.scenario, keyPoints: data.keyPoints ?? [] });
    } catch (err) {
      setScenarioError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setScenarioLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim() || !scenarioData) return;

    setGradingLoading(true);
    setGradingError(null);
    setGradeResult(null);

    try {
      const res = await fetch(`/api/scenario-grade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: scenarioData.scenario,
          keyPoints: scenarioData.keyPoints,
          userAnswer,
        }),
      });

      if (!res.ok) throw new Error(`Server responded ${res.status}`);

      const data: GradeResult & { error?: string } = await res.json();
      if (data.error) throw new Error(data.error as string);
      setGradeResult(data);
    } catch (err) {
      setGradingError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setGradingLoading(false);
    }
  };

  const verdictClasses: Record<GradeResult['verdict'], string> = {
    strong: 'border-emerald-400 bg-emerald-50 text-emerald-800',
    partial: 'border-amber-300 bg-amber-50 text-amber-800',
    weak: 'border-red-300 bg-red-50 text-red-700',
  };

  return (
    <div className="relative isolate min-h-full overflow-hidden bg-[#f6f8fa] px-5 py-8 md:px-8 md:py-10">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[url('/tutor_backdrop.png')] bg-cover bg-center bg-no-repeat" />

      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="flex flex-col items-center text-center">

          <div className="relative mb-8 w-full max-w-3xl rounded-3xl border border-gray-100 bg-white px-8 py-7 text-left shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
            <div className="absolute -bottom-2 left-12 h-4 w-4 rotate-45 border-b border-r border-gray-100 bg-white" />
            <div className="relative flex items-center gap-4">
              <img src="/tutor.png" alt="Crawley" className="h-14 w-auto shrink-0 object-contain" />
              <p className={`flex-1 text-left font-semibold leading-relaxed text-gray-900 transition-[font-size] duration-150 ${promptTextSizeClass}`}>
                {promptText}
                {explainStreaming && <span className="ml-0.5 inline-block w-2 animate-pulse">▍</span>}
              </p>
            </div>
          </div>

          {mode === 'home' && (
            <div className="w-full max-w-xl space-y-3 text-left">
              <button
                onClick={() => setMode('quiz')}
                className="w-full rounded-xl border border-gray-200 bg-white px-5 py-4 text-left text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-accent hover:bg-accent hover:text-white hover:shadow-md"
              >
                Quiz me on a specific topic.
              </button>
              <button
                onClick={() => setMode('explain')}
                className="w-full rounded-xl border border-gray-200 bg-white px-5 py-4 text-left text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-accent hover:bg-accent hover:text-white hover:shadow-md"
              >
                Explain something from the course to me.
              </button>
              <button
                onClick={() => setMode('scenario')}
                className="w-full rounded-xl border border-gray-200 bg-white px-5 py-4 text-left text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-accent hover:bg-accent hover:text-white hover:shadow-md"
              >
                Challenge me with a real-world scenario.
              </button>
              <button
                onClick={() => setMode('weakspot')}
                className="w-full rounded-xl border border-gray-200 bg-white px-5 py-4 text-left text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-accent hover:bg-accent hover:text-white hover:shadow-md"
              >
                Find my weak spots and drill me on them.
              </button>
            </div>
          )}

          {mode === 'quiz' && (
            <div className="w-full max-w-xl rounded-3xl border border-gray-200 bg-white p-5 text-left shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
              {!quizStarted && (
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">Module</label>
                    <select
                      value={selectedModuleId}
                      onChange={e => setSelectedModuleId(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-colors hover:border-accent/60 focus:border-accent focus:ring-2 focus:ring-accent/20"
                    >
                      {tutorModules.map(mod => (
                        <option key={mod.id} value={mod.id}>
                          {mod.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">Chapter</label>
                    <select
                      value={selectedChapter}
                      onChange={e => setSelectedChapter(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-colors hover:border-accent/60 focus:border-accent focus:ring-2 focus:ring-accent/20"
                    >
                      <option>Chapter 1</option>
                      <option>Chapter 2</option>
                      <option>Chapter 3</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={handleStartQuiz}
                      className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 hover:shadow-md"
                    >
                      Start Quiz
                    </button>
                    <button
                      onClick={resetToHome}
                      className="rounded-xl px-3 py-3 text-left text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
                    >
                      ← Back
                    </button>
                  </div>
                </div>
              )}

              {quizStarted && quizLoading && (
                <div className="py-6 text-center text-sm text-gray-400">Generating your quiz...</div>
              )}

              {quizStarted && !quizLoading && quizError && (
                <div className="space-y-4">
                  <p className="text-sm text-red-600">{quizError}</p>
                  <button
                    onClick={resetToHome}
                    className="rounded-xl px-3 py-3 text-left text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
                  >
                    ← Back
                  </button>
                </div>
              )}

              {quizStarted && !quizLoading && !quizError && quizQuestions.length > 0 && (() => {
                const qi = quizIndex;
                const q = quizQuestions[qi];
                const picked = selectedAnswers[qi];
                const hasAnswered = picked !== undefined;
                const isLastQuestion = qi >= quizQuestions.length - 1;

                return (
                  <div className="space-y-4">
                    <p className="text-sm font-semibold text-gray-800">{q.question}</p>
                    <div className="space-y-2">
                      {q.options.map((opt, oi) => {
                        const isCorrect = oi === q.correctIndex;
                        const isPicked = oi === picked;
                        let stateClasses = 'border-gray-200 bg-white hover:border-accent/60';
                        if (hasAnswered) {
                          if (isCorrect) stateClasses = 'border-emerald-400 bg-emerald-50 text-emerald-800';
                          else if (isPicked) stateClasses = 'border-red-300 bg-red-50 text-red-700';
                          else stateClasses = 'border-gray-200 bg-white opacity-60';
                        }
                        return (
                          <button
                            key={oi}
                            disabled={hasAnswered}
                            onClick={() => handleSelectAnswer(qi, oi, q.correctIndex, isLastQuestion)}
                            className={`w-full rounded-lg border px-4 py-2.5 text-left text-sm transition-colors disabled:cursor-default ${stateClasses}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {hasAnswered && <p className="text-xs leading-relaxed text-gray-500">{q.explanation}</p>}

                    <div className="flex flex-col gap-3 sm:flex-row">
                      {hasAnswered && !isLastQuestion && (
                        <button
                          onClick={handleNextQuizQuestion}
                          className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 hover:shadow-md"
                        >
                          Next Question
                        </button>
                      )}
                      {hasAnswered && isLastQuestion && (
                        <button
                          onClick={handleStartQuiz}
                          className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 hover:shadow-md"
                        >
                          Quiz Complete — New Quiz
                        </button>
                      )}
                      <button
                        onClick={resetToHome}
                        className="rounded-xl px-3 py-3 text-left text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
                      >
                        ← Back
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {mode === 'explain' && (
            <div className="w-full max-w-xl rounded-3xl border border-gray-200 bg-white p-5 text-left shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Topic</label>
                  <input
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAskCrawley()}
                    placeholder="e.g. What is subrogation?"
                    disabled={explainLoading || explainStreaming}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 hover:border-accent/60 focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={handleAskCrawley}
                    disabled={explainLoading || explainStreaming || !topic.trim()}
                    className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {explainLoading ? 'Thinking...' : explainStreaming ? 'Answering...' : 'Ask Crawley'}
                  </button>
                  <button
                    onClick={resetToHome}
                    className="rounded-xl px-3 py-3 text-left text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
                  >
                    ← Back
                  </button>
                </div>
              </div>
            </div>
          )}

          {mode === 'scenario' && (
            <div className="w-full max-w-xl rounded-3xl border border-gray-200 bg-white p-5 text-left shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
              {!scenarioData && (
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">Module</label>
                    <select
                      value={selectedModuleId}
                      onChange={e => setSelectedModuleId(e.target.value)}
                      disabled={scenarioLoading}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-colors hover:border-accent/60 focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
                    >
                      {tutorModules.map(mod => (
                        <option key={mod.id} value={mod.id}>
                          {mod.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={handleGenerateScenario}
                      disabled={scenarioLoading}
                      className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {scenarioLoading ? 'Generating...' : 'Generate Scenario'}
                    </button>
                    <button
                      onClick={resetToHome}
                      className="rounded-xl px-3 py-3 text-left text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
                    >
                      ← Back
                    </button>
                  </div>
                </div>
              )}

              {scenarioData && !gradeResult && (
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">Your answer</label>
                    <textarea
                      value={userAnswer}
                      onChange={e => setUserAnswer(e.target.value)}
                      placeholder="Walk through how you'd handle this..."
                      rows={5}
                      disabled={gradingLoading}
                      className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 hover:border-accent/60 focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
                    />
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={gradingLoading || !userAnswer.trim()}
                      className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {gradingLoading ? 'Grading...' : 'Submit Answer'}
                    </button>
                    <button
                      onClick={resetToHome}
                      className="rounded-xl px-3 py-3 text-left text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
                    >
                      ← Back
                    </button>
                  </div>
                </div>
              )}

              {gradeResult && (
                <div className="space-y-4">
                  <div className={`rounded-xl border px-4 py-3 ${verdictClasses[gradeResult.verdict]}`}>
                    <p className="text-sm font-semibold capitalize">
                      {gradeResult.verdict} — {gradeResult.score}/100
                    </p>
                  </div>

                  {gradeResult.hits.length > 0 && (
                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">What you nailed</p>
                      <ul className="list-inside list-disc space-y-1 text-sm text-gray-700">
                        {gradeResult.hits.map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {gradeResult.misses.length > 0 && (
                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">What you missed</p>
                      <ul className="list-inside list-disc space-y-1 text-sm text-gray-700">
                        {gradeResult.misses.map((m, i) => (
                          <li key={i}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={handleGenerateScenario}
                      className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 hover:shadow-md"
                    >
                      New Scenario
                    </button>
                    <button
                      onClick={resetToHome}
                      className="rounded-xl px-3 py-3 text-left text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
                    >
                      ← Back
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {mode === 'weakspot' && !drillTarget && (
            <div className="w-full max-w-xl rounded-3xl border border-gray-200 bg-white p-5 text-left shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
              {weakSpots.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-5 text-sm text-gray-500">
                  Nothing to analyze yet — pass a few quizzes and check back.
                </div>
              ) : (
                <div className="space-y-2">
                  {weakSpots.map(spot => (
                    <button
                      key={`${spot.moduleId}-${spot.sectionId}`}
                      onClick={() => handleSelectWeakSpot(spot)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-5 py-4 text-left text-sm shadow-sm transition-all hover:border-accent hover:bg-accent hover:text-white hover:shadow-md"
                    >
                      <div className="font-medium">
                        {spot.moduleTitle} · {spot.sectionTitle}
                      </div>
                      <div className="mt-1 text-xs opacity-75">
                        {spot.score}/{spot.total} correct
                        {spot.attempts > 0 && ` · ${spot.attempts} attempt${spot.attempts === 1 ? '' : 's'}`}
                      </div>
                    </button>
                  ))}
                </div>
              )}
              <button
                onClick={resetToHome}
                className="mt-4 rounded-xl px-3 py-2 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
              >
                ← Back
              </button>
            </div>
          )}

          {mode === 'weakspot' && drillTarget && (
            <div className="w-full max-w-xl rounded-3xl border border-gray-200 bg-white p-5 text-left shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
              {drillLoading && (
                <div className="py-6 text-center text-sm text-gray-400">Generating practice questions...</div>
              )}

              {!drillLoading && drillError && (
                <div className="space-y-4">
                  <p className="text-sm text-red-600">{drillError}</p>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={() => handleSelectWeakSpot(drillTarget)}
                      className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 hover:shadow-md"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={handleBackToWeakSpotList}
                      className="rounded-xl px-3 py-3 text-left text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
                    >
                      ← Back
                    </button>
                  </div>
                </div>
              )}

              {!drillLoading && !drillError && drillQuestions.length > 0 && (() => {
                const qi = drillIndex;
                const q = drillQuestions[qi];
                const picked = drillAnswers[qi];
                const hasAnswered = picked !== undefined;
                const isLastQuestion = qi >= drillQuestions.length - 1;

                return (
                  <div className="space-y-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      {drillTarget.moduleTitle} · {drillTarget.sectionTitle} practice assessment
                    </p>
                    <p className="text-sm font-semibold text-gray-800">{q.question}</p>
                    <div className="space-y-2">
                      {q.options.map((opt, oi) => {
                        const isCorrect = oi === q.correctIndex;
                        const isPicked = oi === picked;
                        let stateClasses = 'border-gray-200 bg-white hover:border-accent/60';
                        if (hasAnswered) {
                          if (isCorrect) stateClasses = 'border-emerald-400 bg-emerald-50 text-emerald-800';
                          else if (isPicked) stateClasses = 'border-red-300 bg-red-50 text-red-700';
                          else stateClasses = 'border-gray-200 bg-white opacity-60';
                        }
                        return (
                          <button
                            key={oi}
                            disabled={hasAnswered}
                            onClick={() => handleSelectDrillAnswer(qi, oi, q.correctIndex, isLastQuestion)}
                            className={`w-full rounded-lg border px-4 py-2.5 text-left text-sm transition-colors disabled:cursor-default ${stateClasses}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {hasAnswered && <p className="text-xs leading-relaxed text-gray-500">{q.explanation}</p>}

                    <div className="flex flex-col gap-3 sm:flex-row">
                      {hasAnswered && !isLastQuestion && (
                        <button
                          onClick={handleNextDrillQuestion}
                          className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 hover:shadow-md"
                        >
                          Next Question
                        </button>
                      )}
                      {hasAnswered && isLastQuestion && (
                        <button
                          onClick={handleBackToWeakSpotList}
                          className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 hover:shadow-md"
                        >
                          Practice Complete
                        </button>
                      )}
                      <button
                        onClick={handleBackToWeakSpotList}
                        className="rounded-xl px-3 py-3 text-left text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
                      >
                        ← Back
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}