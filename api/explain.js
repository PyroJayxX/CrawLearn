import { GENERATION_MODEL, embedQuery, getSupabase, searchChunks, setCors } from '../lib.js';

function buildSystemPrompt(chunks) {
  const contextBlock = chunks.map(c => `[Source: ${c.source} @ ${c.start_hms}]\n${c.text}`).join('\n\n');
  return `You are Crawley, a friendly course tutor. Answer the student's question using ONLY the transcript excerpts provided below. If the excerpts don't fully answer it, say what you do know and note the gap. Keep the answer conversational and under 150 words.

TRANSCRIPT EXCERPTS:
${contextBlock}`;
}

// Streams the answer back as Server-Sent Events instead of waiting for the
// full Gemini response. Each event is one of:
//   { sources: [...] }        — sent once, immediately, before any text
//   { delta: "..." }          — a chunk of answer text, sent repeatedly
//   { done: true }            — sent once, at the very end
//   { error: "..." }          — sent instead of done, if something failed mid-stream
async function streamAnswer(res, question, chunks, apiKey) {
  const geminiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GENERATION_MODEL}:streamGenerateContent?alt=sse&key=${apiKey}`,
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

  if (!geminiRes.ok || !geminiRes.body) {
    let detail = '';
    try { detail = (await geminiRes.json())?.error?.message ?? ''; } catch { /* ignore */ }
    throw new Error(detail || `Request failed with status ${geminiRes.status}`);
  }

  const reader = geminiRes.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? ''; // last entry may be a partial line — keep it for next read

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const jsonStr = line.slice(6).trim();
      if (!jsonStr) continue;

      let parsed;
      try {
        parsed = JSON.parse(jsonStr);
      } catch {
        continue; // skip any malformed/partial SSE frame
      }

      const textPiece = parsed?.candidates?.[0]?.content?.parts
        ?.map(p => p?.text ?? '')
        .join('') ?? '';

      if (textPiece) {
        res.write(`data: ${JSON.stringify({ delta: textPiece })}\n\n`);
      }
    }
  }
}

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { question, module = null, n_results = 4 } = req.body ?? {};
  if (!question) return res.status(400).json({ error: 'question is required' });

  // Retrieval happens before we open the stream — this part is fast and
  // still needs to fully complete (and might fail) before we commit to a
  // streaming response, so ordinary JSON error handling still applies here.
  let matches;
  try {
    const apiKey = process.env.VITE_GEMINI_API_KEY;
    const supabase = getSupabase();
    const queryEmbedding = await embedQuery(question, apiKey);
    matches = await searchChunks(supabase, queryEmbedding, { module, nResults: n_results });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
  }

  if (!matches || matches.length === 0) {
    return res.json({
      answer: "I couldn't find anything in the course material about that yet. Try rephrasing, or ask about a different topic.",
      sources: [],
    });
  }

  // From here on we're committed to a streaming response.
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  res.write(`data: ${JSON.stringify({
    sources: matches.map(m => ({ source: m.source, module: m.module, start_hms: m.start_hms, end_hms: m.end_hms, score: m.score })),
  })}\n\n`);

  try {
    await streamAnswer(res, question, matches, process.env.VITE_GEMINI_API_KEY);
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
  } catch (err) {
    console.error(err);
    res.write(`data: ${JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' })}\n\n`);
  } finally {
    res.end();
  }
}