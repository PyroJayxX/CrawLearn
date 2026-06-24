import { useEffect, useRef, useState } from 'react';
import { LESSON_DATA } from '../../data/LessonData';

interface CrawleyWidgetProps {
  lessonId: string;
  transcriptLines: { timeLabel: string; text: string }[];
}

function buildSystemPrompt(lessonId: string, transcriptLines: { timeLabel: string; text: string }[]): string {
  const lesson = LESSON_DATA[lessonId];
  const lessonTitle = lesson?.title ?? 'this lesson';
  const lessonTag = lesson?.tag ?? '';
  const transcriptText = transcriptLines.length > 0
    ? transcriptLines.map(l => `[${l.timeLabel}] ${l.text}`).join('\n')
    : '(No transcript available for this lesson.)';

  return `You are Crawley, an AI learning assistant built into CrawLearn — an online insurance education platform.

Your job is to help learners understand the content of the current lesson they are watching.

CURRENT LESSON CONTEXT:
Topic: ${lessonTag}
Title: ${lessonTitle}

LESSON TRANSCRIPT (your primary knowledge source):
${transcriptText}

ANSWERING RULES — follow in order:
1. If the question is directly answered by the transcript, answer from the transcript. This is always your first priority.
2. If the question is not in the transcript but is clearly related to the lesson topic — such as historical background, real-world modern equivalents, current industry context, or clarifying questions about concepts mentioned — answer using your general knowledge. Keep it brief and tie it back to the lesson where possible.
3. If the question is completely unrelated to insurance, or the lesson topic (e.g. coding, sports, celebrities unrelated to the subject), politely decline and redirect the learner back to the lesson.

RESPONSE RULES:
- Keep every response to 1–5 short sentences. No long paragraphs.
- No Markdown formatting. Plain text only.
- Refer to yourself as Crawley.
- Maintain a calm, professional, and encouraging tone.`;
}

async function fetchCrawleyResponse(
  userMessage: string,
  lessonId: string,
  transcriptLines: { timeLabel: string; text: string }[]
): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return 'Crawley is not configured yet. Add VITE_GEMINI_API_KEY to your .env file and restart the dev server.';

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: buildSystemPrompt(lessonId, transcriptLines) }] },
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        generationConfig: { temperature: 0.5, topP: 0.9, maxOutputTokens: 1024 },
      }),
    }
  );

  if (!res.ok) {
    let detail = '';
    try { detail = (await res.json())?.error?.message ?? ''; } catch { /* ignore */ }
    throw new Error(detail || `Request failed with status ${res.status}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts
    ?.map((p: any) => p?.text ?? '')
    .join('')
    .trim();

  return text || 'I was unable to produce a response. Please try again.';
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  displayText: string;
  isTyping: boolean;
}

export default function CrawleyWidget({ lessonId, transcriptLines }: CrawleyWidgetProps) {
  const [isOpen,      setIsOpen]      = useState(false);
  const [inputValue,  setInputValue]  = useState('');
  const [isLoading,   setIsLoading]   = useState(false);
  const [typingId,    setTypingId]    = useState<string | null>(null);
  const [messages,    setMessages]    = useState<Message[]>([{
    id: 'welcome',
    role: 'assistant',
    text: "Hi, I'm Crawley! Ask me anything about the current lesson.",
    displayText: "Hi, I'm Crawley! Ask me anything about the current lesson.",
    isTyping: false,
  }]);

  const messageAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const el = messageAreaRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isOpen]);

  useEffect(() => {
    if (!typingId) return;
    const msg = messages.find(m => m.id === typingId);
    if (!msg || !msg.isTyping || msg.displayText.length >= msg.text.length) {
      setTypingId(null);
      return;
    }
    const t = setTimeout(() => {
      setMessages(prev =>
        prev.map(m =>
          m.id === typingId
            ? { ...m, displayText: msg.text.slice(0, msg.displayText.length + 1) }
            : m
        )
      );
    }, 14);
    return () => clearTimeout(t);
  }, [typingId, messages]);

  const sendMessage = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading) return;

    setMessages(prev => [...prev, {
      id: `${Date.now()}-user`,
      role: 'user',
      text: trimmed,
      displayText: trimmed,
      isTyping: false,
    }]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetchCrawleyResponse(trimmed, lessonId, transcriptLines);
      const id = `${Date.now()}-assistant`;
      setMessages(prev => [...prev, { id, role: 'assistant', text: response, displayText: '', isTyping: true }]);
      setTypingId(id);
    } catch (err) {
      const text = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setMessages(prev => [...prev, { id: `${Date.now()}-error`, role: 'assistant', text, displayText: text, isTyping: false }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const lessonTitle = LESSON_DATA[lessonId]?.title ?? 'Current Lesson';

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">

      {/* FAB */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open Crawley AI"
          className="flex items-center gap-2 px-4 py-3 bg-background text-highlight rounded-full shadow-xl hover:-translate-y-0.5 hover:shadow-2xl transition-all duration-200 font-bold text-sm"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
            <path d="M12 13c-2.5 0-4.5-1.8-4.5-4S9.5 5 12 5s4.5 1.8 4.5 4-2 4-4.5 4z" fill="currentColor" opacity=".9"/>
            <path d="M8 13.5c-1.5 1-3 .5-3.5-.5M16 13.5c1.5 1 3 .5 3.5-.5M9 16c-.5 1.5-2 2-3 1.5M15 16c.5 1.5 2 2 3 1.5M10 17.5c0 1.5-1 2.5-2 2.5M14 17.5c0 1.5 1 2.5 2 2.5"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="10" cy="8.5" r="1" fill="white" opacity=".8"/>
            <circle cx="14" cy="8.5" r="1" fill="white" opacity=".8"/>
          </svg>
          Ask Crawley
        </button>
      )}

      {/* Chat window — fixed height always, scrollable messages */}
      {isOpen && (
        <div className="
          flex flex-col bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden
          w-[calc(100vw-48px)] sm:w-[340px]
          h-[480px]
        ">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-background flex-none">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-accent border-2 border-highlight/30 flex items-center justify-center text-white text-xs font-bold flex-none">
                C
              </div>
              <div>
                <p className="text-[13px] font-bold text-highlight leading-none">Crawley</p>
                <p className="text-[11px] text-highlight/50 leading-none mt-0.5">Lesson AI Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close Crawley"
              className="p-1.5 rounded-lg text-highlight/50 hover:text-highlight transition-colors"
            >
              <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" fill="none">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Context pill */}
          <div className="flex items-center gap-2 px-4 py-2 bg-accent/5 border-b border-gray-200 flex-none overflow-hidden">
            <span className="w-1.5 h-1.5 rounded-full bg-accent flex-none animate-pulse" />
            <span className="text-[11px] font-semibold text-accent truncate">{lessonTitle}</span>
          </div>

          {/* Messages — flex-1 so it fills remaining space */}
          <div
            ref={messageAreaRef}
            className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2.5 custom-scrollbar min-h-0"
          >
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`max-w-[85%] px-3 py-2 rounded-xl text-[13px] leading-relaxed break-words
                  ${msg.role === 'assistant'
                    ? 'self-start bg-accent/8 border border-accent/15 text-gray-800 rounded-bl-sm'
                    : 'self-end bg-background text-highlight rounded-br-sm'
                  }`}
              >
                {msg.displayText || msg.text}
                {msg.isTyping && msg.displayText.length < msg.text.length && (
                  <span className="inline-block ml-0.5 text-accent animate-[blink_0.8s_steps(1)_infinite]">▌</span>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="self-start flex items-center gap-1 px-4 py-3 bg-accent/8 border border-accent/15 rounded-xl rounded-bl-sm">
                {[0, 200, 400].map((delay, i) => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                ))}
              </div>
            )}
          </div>

          {/* Input row */}
          <div className="flex items-center gap-2 px-3 py-2.5 border-t border-gray-200 bg-white flex-none">
            <input
              className="flex-1 px-3 py-2 text-[13px] bg-gray-50 border border-gray-200 rounded-full outline-none focus:border-accent focus:bg-white transition-colors placeholder:text-gray-400 disabled:opacity-50"
              placeholder="Ask about this lesson…"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputValue.trim()}
              aria-label="Send"
              className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center flex-none hover:bg-background disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}