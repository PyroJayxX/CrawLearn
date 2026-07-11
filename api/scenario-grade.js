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
        generationConfig: {
          temperature: 0.3,
          topP: 0.9,
          maxOutputTokens: 4096,
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              score: {
                type: 'INTEGER',
                description: 'Score from 0 to 100.',
              },
              verdict: {
                type: 'STRING',
                enum: ['strong', 'partial', 'weak'],
              },
              feedback: {
                type: 'STRING',
                description: '2-3 sentences, direct and specific.',
              },
              hits: {
                type: 'ARRAY',
                items: { type: 'STRING' },
                description: 'Key points the answer correctly demonstrated.',
              },
              misses: {
                type: 'ARRAY',
                items: { type: 'STRING' },
                description: 'Key points the answer missed or got wrong.',
              },
            },
            required: ['score', 'verdict', 'feedback', 'hits', 'misses'],
          },
        },
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

Grade the answer on how well it applies the key points to the scenario, not just recall. Be encouraging but honest.`;

    const result = await generateJSON(systemPrompt, 'Grade the answer now.', process.env.VITE_GEMINI_API_KEY);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
  }
}