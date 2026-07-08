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
        generationConfig: { temperature: 0.7, topP: 0.9, maxOutputTokens: 2048, responseMimeType: 'application/json' },
      }),
    }
  );
  if (!res.ok) {
    let detail = '';
    try { detail = (await res.json())?.error?.message ?? ''; } catch { /* ignore */ }
    throw new Error(detail || `Request failed with status ${res.status}`);
  }
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.map(p => p?.text ?? '').join('').trim();
  const cleaned = (text || '').replace(/^```json\s*|```$/g, '').trim();
  return JSON.parse(cleaned);
}

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { moduleId, moduleTitle, chapter, n_questions = 5 } = req.body ?? {};
    if (!moduleId) return res.status(400).json({ error: 'moduleId is required' });

    const supabase = getSupabase();
    const chapterNum = (chapter ?? '').match(/\d+/)?.[0];
    const guessedSource = chapterNum ? `${moduleId}/Lesson${chapterNum}.srt` : null;

    let chunks = guessedSource ? await getChunksBySource(supabase, { module: moduleId, source: guessedSource }) : [];
    if (!chunks || chunks.length === 0) {
      chunks = await getModuleChunks(supabase, moduleId);
    }
    if (!chunks || chunks.length === 0) {
      return res.json({ questions: [], error: 'No course material found for that module yet.' });
    }

    const contextBlock = chunks.map(c => c.text).join('\n\n');
    const systemPrompt = `You are Crawley, a course tutor generating a quiz for the module "${moduleTitle ?? moduleId}".
Using ONLY the transcript material below, write ${n_questions} multiple-choice questions that test understanding of the key concepts.

TRANSCRIPT MATERIAL:
${contextBlock}

Respond with ONLY a JSON array (no markdown fences, no commentary), where each item has this exact shape:
{
  "question": string,
  "options": [string, string, string, string],
  "correctIndex": number (0-3),
  "explanation": string (1-2 sentences on why the answer is correct)
}`;

    const questions = await generateJSON(systemPrompt, 'Generate the quiz now.', process.env.VITE_GEMINI_API_KEY);
    res.json({ questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
  }
}
