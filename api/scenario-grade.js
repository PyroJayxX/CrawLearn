import { GENERATION_MODEL, setCors } from '../lib.js';

async function generateJSON(systemPrompt, userMessage, apiKey) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GENERATION_MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        generationConfig: { temperature: 0.3, topP: 0.9, maxOutputTokens: 1024, responseMimeType: 'application/json' },
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
    const { scenario, keyPoints, userAnswer } = req.body ?? {};
    if (!scenario || !userAnswer) {
      return res.status(400).json({ error: 'scenario and userAnswer are required' });
    }

    const systemPrompt = `You are Crawley, a course tutor grading a student's response to a scenario question.

SCENARIO:
${scenario}

KEY POINTS THE ANSWER SHOULD DEMONSTRATE:
${(keyPoints ?? []).map((k, i) => `${i + 1}. ${k}`).join('\n')}

STUDENT'S ANSWER:
${userAnswer}

Grade the answer on how well it applies the key points to the scenario, not just recall. Be encouraging but honest.

Respond with ONLY a JSON object (no markdown fences, no commentary) with this exact shape:
{
  "score": number (0-100),
  "verdict": "strong" | "partial" | "weak",
  "feedback": string (2-3 sentences, direct and specific),
  "hits": [string],
  "misses": [string]
}`;

    const result = await generateJSON(systemPrompt, 'Grade the answer now.', process.env.VITE_GEMINI_API_KEY);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
  }
}
