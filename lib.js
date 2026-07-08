import { createClient } from '@supabase/supabase-js';

export const EMBEDDING_MODEL = 'gemini-embedding-001';
export const GENERATION_MODEL = 'gemini-2.5-flash';

// Server-side only — this uses the service role key, which bypasses Row
// Level Security. NEVER expose this key to the frontend/browser; it must
// only ever be read from process.env inside serverless functions.
export function getSupabase() {
  return createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
}

// ---------------------------------------------------------------------------
// Gemini embeddings
// ---------------------------------------------------------------------------

export async function embedTexts(texts, apiKey) {
  const BATCH_SIZE = 100;
  const allEmbeddings = [];

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:batchEmbedContents?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: batch.map(text => ({
            model: `models/${EMBEDDING_MODEL}`,
            content: { parts: [{ text }] },
          })),
        }),
      }
    );

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      throw new Error(`Embedding request failed (${res.status}): ${detail}`);
    }

    const data = await res.json();
    allEmbeddings.push(...data.embeddings.map(e => e.values));
  }

  return allEmbeddings;
}

export async function embedQuery(text, apiKey) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: { parts: [{ text }] } }),
    }
  );

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Embedding request failed (${res.status}): ${detail}`);
  }

  const data = await res.json();
  return data.embedding.values;
}

// ---------------------------------------------------------------------------
// Supabase-backed vector search (replaces the old local JSON file store)
// ---------------------------------------------------------------------------

export async function searchChunks(supabase, queryEmbedding, { module = null, nResults = 4 } = {}) {
  const { data, error } = await supabase.rpc('match_chunks', {
    query_embedding: queryEmbedding,
    match_count: nResults,
    filter_module: module,
  });
  if (error) throw new Error(`Supabase search failed: ${error.message}`);
  return data;
}

export async function getChunksBySource(supabase, { module, source }) {
  const { data, error } = await supabase
    .from('chunks')
    .select('*')
    .eq('module', module)
    .eq('source', source)
    .order('chunk_index', { ascending: true });
  if (error) throw new Error(`Supabase query failed: ${error.message}`);
  return data;
}

export async function getModuleChunks(supabase, module) {
  const { data, error } = await supabase.from('chunks').select('*').eq('module', module);
  if (error) throw new Error(`Supabase query failed: ${error.message}`);
  return data;
}

export function sampleChunks(chunks, n) {
  const shuffled = [...chunks].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

// CORS helper — since your frontend and API may or may not be the same
// Vercel project/domain, set this explicitly on every response.
export function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}
