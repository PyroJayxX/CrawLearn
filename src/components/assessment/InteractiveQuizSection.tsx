import { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import {
  InteractiveQuizQuestion,
  MultipleChoicePayload,
  ClassificationPayload,
  FillInTheBlanksPayload,
  SequentialOrderingPayload,
  SequentialCard,
} from '../../data/InteractiveQuizTypes';

// ── Caterpillar progress (reused from QuizSection) ────────────────────────
function CaterpillarProgress({ total, answered, current }: { total: number; answered: number; current: number }) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {Array.from({ length: total }).map((_, i) => {
        const isDone    = i < answered;
        const isCurrent = i === current;
        return (
          <div
            key={i}
            className={`rounded-full border-2 transition-all duration-300 flex items-center justify-center
              ${isDone ? 'border-accent bg-accent' : isCurrent ? 'border-accent bg-white scale-110' : 'border-gray-300 bg-white'}`}
            style={{ width: 14, height: 14 }}
          >
            {isCurrent && !isDone && <div className="w-1.5 h-1.5 rounded-full bg-accent" />}
          </div>
        );
      })}
    </div>
  );
}

// ── MULTIPLE CHOICE ───────────────────────────────────────────────────────
function MultipleChoiceQuestion({
  payload,
  onScore,
}: {
  payload: MultipleChoicePayload;
  onScore: (correct: boolean) => void;
}) {
  const [pending,   setPending]   = useState<number | undefined>();
  const [committed, setCommitted] = useState<number | undefined>();

  const isCommitted = committed !== undefined;

  const getStyle = (idx: number) => {
    if (isCommitted) {
      if (idx === payload.correctIndex)
        return 'border-green-500 bg-green-50 text-green-700 font-semibold';
      if (idx === committed)
        return 'border-red-400 bg-red-50 text-red-600 font-semibold';
      return 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed';
    }
    if (pending === idx) return 'border-accent bg-accent/10 text-accent font-semibold ring-2 ring-accent/30';
    return 'border-gray-200 hover:border-accent/50 hover:bg-gray-50 text-gray-800 bg-white';
  };

  const handleSubmit = () => {
    if (pending === undefined) return;
    setCommitted(pending);
    onScore(pending === payload.correctIndex);
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg md:text-xl font-medium text-gray-900 leading-relaxed">{payload.questionText}</p>
      <div className="flex flex-col gap-2.5">
        {payload.options.map((opt, idx) => (
          <button
            key={idx}
            disabled={isCommitted}
            onClick={() => !isCommitted && setPending(idx)}
            className={`text-left px-4 py-3.5 rounded-xl border-2 transition-all duration-200 text-sm ${getStyle(idx)}`}
          >
            {opt}
          </button>
        ))}
      </div>
      {!isCommitted && (
        <div className="flex justify-end">
          <button
            disabled={pending === undefined}
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-lg font-semibold text-sm bg-accent text-white hover:bg-accent/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Submit Answer
          </button>
        </div>
      )}
    </div>
  );
}

// ── CLASSIFICATION ────────────────────────────────────────────────────────

function DraggableCard({ id, text, style }: { id: string; text: string; style: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
  const s = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : undefined;
  return (
    <div
      ref={setNodeRef}
      style={s}
      {...attributes}
      {...listeners}
      className={`px-3 py-2 rounded-lg border-2 text-sm transition-all duration-200 cursor-grab active:cursor-grabbing select-none
        ${isDragging ? 'opacity-50 shadow-lg z-50' : ''}
        ${style}`}
    >
      {text}
    </div>
  );
}

function DroppableBucket({
  bucket,
  children,
  isTarget,
  submitted,
}: {
  bucket: string;
  children: React.ReactNode;
  isTarget: boolean;
  submitted: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: bucket });
  return (
    <div
      ref={setNodeRef}
      className={`min-h-[100px] rounded-xl border-2 p-3 flex flex-col gap-2 transition-all duration-200
        ${isOver && !submitted ? 'border-accent bg-accent/10' : isTarget && !submitted ? 'border-accent/40 bg-accent/5' : 'border-gray-200 bg-gray-50'}
        ${submitted ? 'cursor-default' : ''}`}
    >
      <p className="text-xs font-bold uppercase tracking-widest text-gray-500">{bucket}</p>
      <div className="flex flex-col gap-1.5">{children}</div>
    </div>
  );
}

function ClassificationQuestion({
  payload,
  attemptsLeft,
  onScore,
}: {
  payload: ClassificationPayload;
  attemptsLeft: number;
  onScore: (correct: boolean) => void;
}) {
  const [assignments, setAssignments] = useState<Record<string, string | null>>(
    () => Object.fromEntries(payload.cards.map(c => [c.text, null]))
  );
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [activeId,  setActiveId]  = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor,   { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  const allAssigned = payload.cards.every(c => assignments[c.text] !== null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    const cardText = active.id as string;
    const bucket   = over.id as string;
    if (payload.buckets.includes(bucket)) {
      setAssignments(prev => ({ ...prev, [cardText]: bucket }));
    } else if (over.id === 'bank') {
      setAssignments(prev => ({ ...prev, [cardText]: null }));
    }
  };

  const handleSubmit = () => {
    const correct = payload.cards.every(c => assignments[c.text] === c.belongsTo);
    setSubmitted(true);
    setIsCorrect(correct);
    onScore(correct);
  };

  const handleRetry = () => {
    setAssignments(Object.fromEntries(payload.cards.map(c => [c.text, null])));
    setSubmitted(false);
    setIsCorrect(false);
  };

  const getCardStyle = (text: string) => {
    if (submitted) {
      const card = payload.cards.find(c => c.text === text)!;
      return assignments[text] === card.belongsTo
        ? 'border-green-500 bg-green-50 text-green-700'
        : 'border-red-400 bg-red-50 text-red-600';
    }
    return 'border-gray-200 bg-white text-gray-800 hover:border-accent/50';
  };

  const unassigned = payload.cards.filter(c => assignments[c.text] === null);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col gap-5">
        {/* Card bank */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
            Drag cards into the buckets below ↓
          </p>
          <DroppableBucket bucket="bank" isTarget={false} submitted={submitted}>
            <div className="flex flex-wrap gap-2">
              {unassigned.map(card => (
                <DraggableCard
                  key={card.text}
                  id={card.text}
                  text={card.text}
                  style={getCardStyle(card.text)}
                />
              ))}
              {unassigned.length === 0 && !submitted && (
                <p className="text-xs text-gray-400 italic">All cards assigned.</p>
              )}
            </div>
          </DroppableBucket>
        </div>

        {/* Buckets */}
        <div className={`grid gap-4 ${payload.buckets.length === 2 ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-3'}`}>
          {payload.buckets.map(bucket => (
            <DroppableBucket key={bucket} bucket={bucket} isTarget={activeId !== null} submitted={submitted}>
              {payload.cards
                .filter(c => assignments[c.text] === bucket)
                .map(card => (
                  <DraggableCard
                    key={card.text}
                    id={card.text}
                    text={card.text}
                    style={getCardStyle(card.text)}
                  />
                ))}
            </DroppableBucket>
          ))}
        </div>

        {/* Actions */}
        {!submitted ? (
          <div className="flex justify-end">
            <button
              disabled={!allAssigned}
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-lg font-semibold text-sm bg-accent text-white hover:bg-accent/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Submit
            </button>
          </div>
        ) : (
          <div className={`flex items-center justify-between rounded-xl px-4 py-3 border
            ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
          >
            <span className={`text-sm font-semibold ${isCorrect ? 'text-green-700' : 'text-red-600'}`}>
              {isCorrect ? 'All correct!' : 'Some cards are in the wrong bucket.'}
            </span>
            {!isCorrect && attemptsLeft > 0 && (
              <button
                onClick={handleRetry}
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
              >
                Try Again ({attemptsLeft} left)
              </button>
            )}
          </div>
        )}
      </div>
    </DndContext>
  );
}

// ── FILL IN THE BLANKS ────────────────────────────────────────────────────
function FillInTheBlanksQuestion({
  payload,
  attemptsLeft,
  onScore,
}: {
  payload: FillInTheBlanksPayload;
  attemptsLeft: number;
  onScore: (correct: boolean) => void;
}) {
  const blankKeys = Object.keys(payload.correctAnswers).sort(); // ['blank1', 'blank2', ...]
  const [filled,    setFilled]    = useState<Record<string, string>>(() => Object.fromEntries(blankKeys.map(k => [k, ''])));
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleOptionClick = (opt: string) => {
    if (submitted) return;
    // Find first empty blank and fill it; if all filled, do nothing
    const firstEmpty = blankKeys.find(k => filled[k] === '');
    if (firstEmpty) {
      setFilled(prev => ({ ...prev, [firstEmpty]: opt }));
    }
  };

  const handleClearBlank = (key: string) => {
    if (submitted) return;
    setFilled(prev => ({ ...prev, [key]: '' }));
  };

  const allFilled = blankKeys.every(k => filled[k] !== '');

  const handleSubmit = () => {
    const correct = blankKeys.every(k => filled[k] === payload.correctAnswers[k]);
    setSubmitted(true);
    setIsCorrect(correct);
    onScore(correct);
  };

  const handleRetry = () => {
    setFilled(Object.fromEntries(blankKeys.map(k => [k, ''])));
    setSubmitted(false);
    setIsCorrect(false);
  };

  // Parse sentence into parts: text and blank placeholders
  const parts: { type: 'text' | 'blank'; value: string }[] = [];
  let remaining = payload.sentence;
  blankKeys.forEach(key => {
    const idx = remaining.indexOf(`[${key}]`);
    if (idx === -1) return;
    parts.push({ type: 'text', value: remaining.slice(0, idx) });
    parts.push({ type: 'blank', value: key });
    remaining = remaining.slice(idx + `[${key}]`.length);
  });
  if (remaining) parts.push({ type: 'text', value: remaining });

  const getBlankStyle = (key: string) => {
    if (!submitted) return filled[key] ? 'border-accent bg-accent/10 text-accent' : 'border-gray-300 bg-gray-50 text-gray-400';
    return filled[key] === payload.correctAnswers[key]
      ? 'border-green-500 bg-green-50 text-green-700 font-semibold'
      : 'border-red-400 bg-red-50 text-red-600 font-semibold';
  };

  // Used options (to show them as dimmed in the bank)
  const usedOptions = new Set(Object.values(filled).filter(Boolean));

  return (
    <div className="flex flex-col gap-5">
      {/* Sentence with blanks */}
      <div className="text-base md:text-lg text-gray-800 leading-loose bg-gray-50 rounded-xl px-5 py-4 border border-gray-200">
        {parts.map((part, i) => {
          if (part.type === 'text') return <span key={i}>{part.value}</span>;
          const key = part.value;
          const val = filled[key];
          return (
            <button
              key={i}
              onClick={() => handleClearBlank(key)}
              disabled={submitted || !val}
              className={`inline-flex items-center justify-center mx-1 px-3 py-0.5 rounded-lg border-2 min-w-[80px] text-sm font-semibold transition-all duration-200 ${getBlankStyle(key)}`}
            >
              {val || <span className="text-gray-400 font-normal text-xs">blank</span>}
            </button>
          );
        })}
      </div>

      {/* Options bank */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Word Bank — click to fill</p>
        <div className="flex flex-wrap gap-2">
          {payload.optionsBank.map(opt => {
            const isUsed = usedOptions.has(opt);
            return (
              <button
                key={opt}
                onClick={() => !isUsed && handleOptionClick(opt)}
                disabled={submitted || isUsed}
                className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-200
                  ${isUsed
                    ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                    : 'border-accent/40 bg-white text-accent hover:bg-accent/10 hover:border-accent cursor-pointer'}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      {!submitted ? (
        <div className="flex justify-end">
          <button
            disabled={!allFilled}
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-lg font-semibold text-sm bg-accent text-white hover:bg-accent/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Submit
          </button>
        </div>
      ) : (
        <div className={`flex items-center justify-between rounded-xl px-4 py-3 border
          ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
        >
          <span className={`text-sm font-semibold ${isCorrect ? 'text-green-700' : 'text-red-600'}`}>
            {isCorrect ? 'Correct!' : 'One or more blanks are wrong.'}
          </span>
          {!isCorrect && attemptsLeft > 0 && (
            <button
              onClick={handleRetry}
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
            >
              Try Again ({attemptsLeft} left)
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── SEQUENTIAL ORDERING ───────────────────────────────────────────────────
function SortableItem({ id, text, submitted, isCorrect }: { id: string; text: string; submitted: boolean; isCorrect: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 bg-white text-sm transition-all duration-200 select-none
        ${isDragging ? 'shadow-lg opacity-80 z-50' : ''}
        ${submitted
          ? isCorrect
            ? 'border-green-500 bg-green-50 text-green-700'
            : 'border-red-400 bg-red-50 text-red-600'
          : 'border-gray-200 text-gray-800 cursor-grab active:cursor-grabbing hover:border-accent/50 hover:shadow-sm'}`}
      {...attributes}
      {...listeners}
    >
      {/* Drag handle */}
      <svg className="w-4 h-4 text-gray-400 flex-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
      </svg>
      <span className="flex-1 leading-snug">{text}</span>
      {submitted && (
        <span className="flex-none text-base">{isCorrect ? '✓' : '✗'}</span>
      )}
    </div>
  );
}

function SequentialOrderingQuestion({
  payload,
  attemptsLeft,
  onScore,
}: {
  payload: SequentialOrderingPayload;
  attemptsLeft: number;
  onScore: (correct: boolean) => void;
}) {
  // Shuffle initially
  const [items, setItems] = useState<SequentialCard[]>(() => {
    const shuffled = [...payload.cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  });
  const [submitted,   setSubmitted]   = useState(false);
  const [isCorrect,   setIsCorrect]   = useState(false);
  const [correctness, setCorrectness] = useState<boolean[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor,   { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    if (submitted) return;
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems(prev => {
        const oldIdx = prev.findIndex(i => i.id === active.id);
        const newIdx = prev.findIndex(i => i.id === over.id);
        return arrayMove(prev, oldIdx, newIdx);
      });
    }
  };

  const handleSubmit = () => {
    // Compare current positions to correct order
    const result = items.map((item, idx) => item.order === idx + 1);
    const allCorrect = result.every(Boolean);
    setCorrectness(result);
    setSubmitted(true);
    setIsCorrect(allCorrect);
    onScore(allCorrect);
  };

  const handleRetry = () => {
    // Re-shuffle on retry
    const shuffled = [...payload.cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setItems(shuffled);
    setSubmitted(false);
    setIsCorrect(false);
    setCorrectness([]);
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-gray-400 font-medium">Drag the cards into the correct order ↕</p>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2">
            {items.map((item, idx) => (
              <SortableItem
                key={item.id}
                id={item.id}
                text={item.text}
                submitted={submitted}
                isCorrect={correctness[idx] ?? false}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {!submitted ? (
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-lg font-semibold text-sm bg-accent text-white hover:bg-accent/80 transition-colors"
          >
            Submit Order
          </button>
        </div>
      ) : (
        <div className={`flex items-center justify-between rounded-xl px-4 py-3 border
          ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
        >
          <span className={`text-sm font-semibold ${isCorrect ? 'text-green-700' : 'text-red-600'}`}>
            {isCorrect ? 'Perfect order!' : 'Some items are out of order.'}
          </span>
          {!isCorrect && attemptsLeft > 0 && (
            <button
              onClick={handleRetry}
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
            >
              Try Again ({attemptsLeft} left)
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── MAIN QUIZ SECTION ─────────────────────────────────────────────────────
interface InteractiveQuizSectionProps {
  sectionId:         string;
  questions:         InteractiveQuizQuestion[];
  nextSectionTitle?: string;
  onComplete:        (score: number) => void;
  onProceed?:        () => void;
}

const MAX_INTERACTIVE_ATTEMPTS = 3;

export default function InteractiveQuizSection({
  sectionId,
  questions,
  nextSectionTitle,
  onComplete,
  onProceed,
}: InteractiveQuizSectionProps) {
  const [currentIdx,  setCurrentIdx]  = useState(0);
  const [scores,      setScores]      = useState<(0 | 1)[]>([]);
  const [attempts,    setAttempts]    = useState(0); // for current interactive question
  const [locked,      setLocked]      = useState(false); // current question locked (0 scored)
  const [scored,      setScored]      = useState(false); // current question has been scored
  const [finalScore,  setFinalScore]  = useState<number | null>(null);
  // key to force remount of sub-question on retry
  const [questionKey, setQuestionKey] = useState(0);

  const current     = questions[currentIdx];
  const isMultipleChoice = current?.type === 'multiple-choice';
  const isInteractive    = !isMultipleChoice;
  const attemptsLeft     = Math.max(0, MAX_INTERACTIVE_ATTEMPTS - attempts);

  const handleScore = useCallback((correct: boolean) => {
    if (isMultipleChoice) {
      // MC: always score immediately, no retries
      const s = correct ? 1 : 0;
      setScores(prev => [...prev, s]);
      setScored(true);
    } else {
      // Interactive: track attempts
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (correct) {
        setScores(prev => [...prev, 1]);
        setScored(true);
        setLocked(true);
      } else if (newAttempts >= MAX_INTERACTIVE_ATTEMPTS) {
        // Used all attempts — score 0 and lock
        setScores(prev => [...prev, 0]);
        setScored(true);
        setLocked(true);
      }
      // else: still has attempts left — don't lock, don't advance
    }
  }, [attempts, isMultipleChoice]);

  const handleNext = () => {
    const next = currentIdx + 1;
    if (next >= questions.length) {
      // Quiz done
      const total = scores.reduce<number>((a, b) => a + b, 0);
      setFinalScore(total);
      onComplete(total);
    } else {
      setCurrentIdx(next);
      setAttempts(0);
      setLocked(false);
      setScored(false);
      setQuestionKey(k => k + 1);
    }
  };

  const passingScore = 3;
  const answeredCount = scores.length;

  // ── No questions ──────────────────────────────────────────────────────
  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-lg font-medium text-gray-600">No questions available for this section yet.</p>
      </div>
    );
  }
// ── Pass/Fail screen ──────────────────────────────────────────────────
if (finalScore !== null) {
  const passed = finalScore >= passingScore;
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white border border-gray-200 rounded-xl p-10 shadow-sm flex flex-col items-center gap-6 text-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${passed ? 'bg-green-100' : 'bg-red-100'}`}>
          <svg className={`w-8 h-8 ${passed ? 'text-green-500' : 'text-red-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {passed
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />}
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{passed ? 'Quiz Passed!' : 'Quiz Failed'}</h2>
          <p className="text-gray-500 text-sm">
            You scored <span className="font-semibold text-gray-700">{finalScore} / {questions.length}</span>.
            {!passed && <> You need at least <span className="font-semibold text-gray-700">{passingScore}</span> to pass.</>}
            {passed && ' Great work!'}
          </p>
        </div>
        {passed && nextSectionTitle && (
          <button onClick={onProceed} className="px-8 py-3 rounded-lg font-bold text-sm bg-accent text-white hover:bg-accent/80 transition-colors">
            Proceed to {nextSectionTitle} →
          </button>
        )}
        {!passed && (
          <button
            onClick={() => {
              setFinalScore(null);
              setCurrentIdx(0);
              setScores([]);
              setAttempts(0);
              setLocked(false);
              setScored(false);
              setQuestionKey(k => k + 1);
            }}
            className="px-8 py-3 rounded-lg font-bold text-sm bg-accent text-white hover:bg-accent/80 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
  // ── Quiz in progress ──────────────────────────────────────────────────
  const showNext = isMultipleChoice ? scored : (scored || locked);

  return (
    <div className="flex flex-col gap-5">

      {/* Progress header */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold tracking-widest uppercase text-gray-500">
            Question {currentIdx + 1} of {questions.length}
          </span>
          {isInteractive && !locked && attempts > 0 && (
            <span className="text-xs text-gray-400">
              Attempt {attempts} of {MAX_INTERACTIVE_ATTEMPTS}
            </span>
          )}
        </div>
        <CaterpillarProgress total={questions.length} answered={answeredCount} current={currentIdx} />
      </div>

      {/* Question card */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-7 shadow-sm">
        {/* Type badge + instruction */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full
            ${current.type === 'multiple-choice'     ? 'bg-blue-100 text-blue-600'
            : current.type === 'classification'      ? 'bg-purple-100 text-purple-600'
            : current.type === 'fill-in-the-blanks'  ? 'bg-amber-100 text-amber-600'
            : 'bg-teal-100 text-teal-600'}`}>
            {current.type.replace(/-/g, ' ')}
          </span>
        </div>
        <p className="text-base font-semibold text-gray-700 mb-5 leading-snug">{current.instruction}</p>

        {/* Render question type */}
        {current.type === 'multiple-choice' && (
          <MultipleChoiceQuestion
            key={questionKey}
            payload={current.payload as MultipleChoicePayload}
            onScore={handleScore}
          />
        )}
        {current.type === 'classification' && (
          <ClassificationQuestion
            key={questionKey}
            payload={current.payload as ClassificationPayload}
            attemptsLeft={attemptsLeft}
            onScore={handleScore}
          />
        )}
        {current.type === 'fill-in-the-blanks' && (
          <FillInTheBlanksQuestion
            key={questionKey}
            payload={current.payload as FillInTheBlanksPayload}
            attemptsLeft={attemptsLeft}
            onScore={handleScore}
          />
        )}
        {current.type === 'sequential-ordering' && (
          <SequentialOrderingQuestion
            key={questionKey}
            payload={current.payload as SequentialOrderingPayload}
            attemptsLeft={attemptsLeft}
            onScore={handleScore}
          />
        )}

        {/* Next button — appears after scoring */}
        {showNext && (
          <div className="flex justify-end mt-5 pt-4 border-t border-gray-100">
            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-lg font-semibold text-sm bg-accent text-white hover:bg-accent/80 transition-colors"
            >
              {currentIdx === questions.length - 1 ? 'Finish Quiz →' : 'Next Question →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}