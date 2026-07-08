import { GENERATION_MODEL, embedQuery, getSupabase, searchChunks, setCors } from '../lib.js';

function buildSystemPrompt(chunks) {
  const contextBlock = chunks.map(c => `[Source: ${c.source} @ ${c.start_hms}]\n${c.text}`).join('\n\n');
  return `You are Crawley, a friendly course tutor. Answer the student's question using ONLY the transcript excerpts provided below. If the excerpts don't fully answer it, say what you do know and note the gap. Keep the answer conversational and under 150 words.

TRANSCRIPT EXCERPTS:
${contextBlock}`;
}

async function generateAnswer(question, chunks, apiKey) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GENERATION_MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: buildSystemPrompt(chunks) }] },
        contents: [{ role: 'user', parts: [{ text: question }] }],
        generationConfig: { temperature: 0.5, topP: 0.9, maxOutputTokens: 400 },
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
  return text || 'I was unable to produce a response. Please try again.';
}

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { question, module = null, n_results = 4 } = req.body ?? {};
    if (!question) return res.status(400).json({ error: 'question is required' });

    const apiKey = process.env.GEMINI_API_KEY;
    const supabase = getSupabase();

    const queryEmbedding = await embedQuery(question, apiKey);
    const matches = await searchChunks(supabase, queryEmbedding, { module, nResults: n_results });

    if (!matches || matches.length === 0) {
      return res.json({
        answer: "I couldn't find anything in the course material about that yet. Try rephrasing, or ask about a different topic.",
        sources: [],
      });
    }

    const answer = await generateAnswer(question, matches, apiKey);

    res.json({
      answer,
      sources: matches.map(m => ({ source: m.source, module: m.module, start_hms: m.start_hms, end_hms: m.end_hms, score: m.score })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
  }
}
