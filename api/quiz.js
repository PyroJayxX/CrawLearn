import { GENERATION_MODEL, getChunksBySource, getModuleChunks, getSupabase, setCors } from '../lib.js';

async function generateJSON(systemPrompt, userMessage, apiKey) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GENERATION_MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        generationConfig: { temperature: 0.7, topP: 0.9, maxOutputTokens: 4096, responseMimeType: 'application/json' },
      }),
    }
  );
  if (!res.ok) {
    let detail = '';
    try { detail = (await res.json())?.error?.message ?? ''; } catch { /* ignore */ }
    throw new Error(detail || `Request failed with status ${res.status}`);
  }
  const data = await res.json();
  const candidate = data?.candidates?.[0];
  const text = candidate?.content?.parts?.map(p => p?.text ?? '').join('').trim();

  if (candidate?.finishReason === 'MAX_TOKENS') {
    throw new Error('Gemini response was cut off (hit maxOutputTokens) before finishing the JSON.');
  }
  if (!text) {
    throw new Error(`Gemini returned no text (finishReason: ${candidate?.finishReason ?? 'unknown'})`);
  }

  const cleaned = text.replace(/^```json\s*|```$/g, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error(`Gemini response wasn't valid JSON: ${cleaned.slice(0, 200)}`);
  }
}

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { moduleId, moduleTitle, chapter, previousQuestions = [] } = req.body ?? {};
    if (!moduleId) return res.status(400).json({ error: 'moduleId is required' });

    const supabase = getSupabase();
    const chapterNum = (chapter ?? '').match(/\d+/)?.[0];
    const guessedSource = chapterNum ? `${moduleId}/Lesson${chapterNum}.srt` : null;

    let chunks = guessedSource ? await getChunksBySource(supabase, { module: moduleId, source: guessedSource }) : [];
    if (!chunks || chunks.length === 0) {
      chunks = await getModuleChunks(supabase, moduleId);
    }
    if (!chunks || chunks.length === 0) {
      return res.json({ question: null, error: 'No course material found for that module yet.' });
    }

    const contextBlock = chunks.map(c => c.text).join('\n\n');
    const avoidBlock = previousQuestions.length > 0
      ? `\n\nQUESTIONS ALREADY ASKED (do NOT repeat these or ask near-duplicates):\n${previousQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`
      : '';

    const systemPrompt = `You are Crawley, a course tutor generating a quiz question for the module "${moduleTitle ?? moduleId}".
Using ONLY the transcript material below, write ONE multiple-choice question that tests understanding of a key concept.

TRANSCRIPT MATERIAL:
${contextBlock}${avoidBlock}

Respond with ONLY a JSON object (no markdown fences, no commentary) with this exact shape:
{
  "question": string,
  "options": [string, string, string, string],
  "correctIndex": number (0-3),
  "explanation": string (1-2 sentences on why the answer is correct)
}`;

    const question = await generateJSON(systemPrompt, 'Generate the question now.', process.env.VITE_GEMINI_API_KEY);
    res.json({ question });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
  }
}