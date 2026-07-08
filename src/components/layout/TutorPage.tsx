import { useMemo, useState } from 'react';
import { LearningState, ModuleConfig } from '../../types';

type TutorMode = 'home' | 'quiz' | 'explain' | 'scenario' | 'weakspot';

interface TutorPageProps {
  modules: ModuleConfig[];
  currentState: LearningState;
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

export default function TutorPage({ modules, currentState }: TutorPageProps) {
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

  // RAG quiz state
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[] | null>(null);
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

  const tutorModules = useMemo(() => modules.slice(0, 2), [modules]);

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
      if (quizLoading) return 'Putting together some questions for you...';
      if (quizError) return `Hmm, something went wrong: ${quizError}`;
      if (quizQuestions) return `Here's your quiz! ${quizQuestions.length} questions, give it a go.`;
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
    switch (mode) {
      case 'weakspot':
        return 'This feature is coming soon! Stay tuned.';
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
    setQuizQuestions(null);
    setQuizError(null);
    setSelectedAnswers({});
    setScenarioData(null);
    setScenarioError(null);
    setUserAnswer('');
    setGradeResult(null);
    setGradingError(null);
  };

  const handleGenerateQuiz = async () => {
    setQuizLoading(true);
    setQuizError(null);
    setQuizQuestions(null);
    setSelectedAnswers({});

    const moduleTitle = tutorModules.find(m => m.id === selectedModuleId)?.title;

    try {
      const res = await fetch(`/api/quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId: selectedModuleId,
          moduleTitle,
          chapter: selectedChapter,
          n_questions: 5,
        }),
      });

      if (!res.ok) throw new Error(`Server responded ${res.status}`);

      const data: { questions?: QuizQuestion[]; error?: string } = await res.json();
      if (data.error) throw new Error(data.error);
      setQuizQuestions(data.questions ?? []);
    } catch (err) {
      setQuizError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setQuizLoading(false);
    }
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
              {!quizQuestions && (
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">Module</label>
                    <select
                      value={selectedModuleId}
                      onChange={e => setSelectedModuleId(e.target.value)}
                      disabled={quizLoading}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-colors hover:border-accent/60 focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
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
                      disabled={quizLoading}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-colors hover:border-accent/60 focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
                    >
                      <option>Chapter 1</option>
                      <option>Chapter 2</option>
                      <option>Chapter 3</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={handleGenerateQuiz}
                      disabled={quizLoading}
                      className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {quizLoading ? 'Generating...' : 'Generate Quiz'}
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

              {quizQuestions && (
                <div className="space-y-6">
                  {quizQuestions.map((q, qi) => {
                    const picked = selectedAnswers[qi];
                    const hasAnswered = picked !== undefined;
                    return (
                      <div key={qi} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                        <p className="mb-3 text-sm font-semibold text-gray-800">
                          {qi + 1}. {q.question}
                        </p>
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
                                onClick={() => setSelectedAnswers(prev => ({ ...prev, [qi]: oi }))}
                                className={`w-full rounded-lg border px-4 py-2.5 text-left text-sm transition-colors disabled:cursor-default ${stateClasses}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {hasAnswered && (
                          <p className="mt-2 text-xs leading-relaxed text-gray-500">{q.explanation}</p>
                        )}
                      </div>
                    );
                  })}

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={handleGenerateQuiz}
                      className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 hover:shadow-md"
                    >
                      New Quiz
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

          {mode === 'weakspot' && (
            <div className="w-full max-w-xl rounded-3xl border border-gray-200 bg-white p-5 text-left shadow-[0_10px_30px_rgba(15,23,42,0.05)] opacity-75">
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-5 text-sm text-gray-500">
                Coming soon
              </div>
              <button
                onClick={resetToHome}
                className="mt-4 rounded-xl px-3 py-2 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
              >
                ← Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}