import { useMemo, useState } from 'react';
import { LearningState, ModuleConfig } from '../../types';

type TutorMode = 'home' | 'quiz' | 'explain' | 'scenario' | 'weakspot';

interface TutorPageProps {
  modules: ModuleConfig[];
  currentState: LearningState;
}

export default function TutorPage({ modules, currentState }: TutorPageProps) {
  const [mode, setMode] = useState<TutorMode>('home');
  const [selectedModuleId, setSelectedModuleId] = useState(
    modules.find(mod => mod.id === currentState.currentModuleId)?.id ?? modules[0]?.id ?? ''
  );
  const [selectedChapter, setSelectedChapter] = useState('Chapter 1');
  const [topic, setTopic] = useState('');

  const tutorModules = useMemo(() => modules.slice(0, 2), [modules]);

  const promptText = (() => {
    switch (mode) {
      case 'quiz':
        return 'Sure! Which module and chapter do you want to be quizzed on?';
      case 'explain':
        return 'What topic or concept would you like me to explain?';
      case 'scenario':
      case 'weakspot':
        return 'This feature is coming soon! Stay tuned.';
      default:
        return 'Hey! What would you like to do today?';
    }
  })();

  const resetToHome = () => setMode('home');

  const handleGenerateQuiz = () => {
    console.log('Tutor quiz selection:', { moduleId: selectedModuleId, chapter: selectedChapter });
  };

  const handleAskCrawley = () => {
    console.log('Tutor explain request:', { topic });
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
              <p className="flex-1 text-left text-xl font-semibold leading-relaxed text-gray-900 md:text-2xl">{promptText}</p>
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
                    onClick={handleGenerateQuiz}
                    className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 hover:shadow-md"
                  >
                    Generate Quiz
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

          {mode === 'explain' && (
            <div className="w-full max-w-xl rounded-3xl border border-gray-200 bg-white p-5 text-left shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Topic</label>
                  <input
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    placeholder="e.g. What is subrogation?"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 hover:border-accent/60 focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={handleAskCrawley}
                    className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 hover:shadow-md"
                  >
                    Ask Crawley
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

          {(mode === 'scenario' || mode === 'weakspot') && (
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