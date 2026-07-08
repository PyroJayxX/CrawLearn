/**
 * embed-chunks.js
 *
 * One-time (or re-run-per-new-content) local script — NOT deployed to
 * Vercel. Reads your existing chunk JSON, embeds each chunk with Gemini,
 * and upserts into the Supabase `chunks` table (see supabase-schema.sql).
 *
 * Usage:
 *   node embed-chunks.js --input ./chunks.json
 *
 * Requires in your local .env (not deployed — this only runs from your machine):
 *   VITE_GEMINI_API_KEY=...
 *   SUPABASE_URL=...
 *   VITE_SUPABASE_ANON_KEY=...   (service role, not the anon key — needed to write)
 */

import 'dotenv/config';
import fs from 'node:fs';
import { embedTexts, getSupabase } from './lib.js';

function parseArgs() {
  const args = process.argv.slice(2);
  const out = { input: null };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--input') out.input = args[++i];
  }
  if (!out.input) {
    console.error('Usage: node embed-chunks.js --input <chunks.json>');
    process.exit(1);
  }
  return out;
}

// Adjust if your existing chunk objects use different field names.
function mapChunk(raw, i) {
  return {
    id: raw.id ?? `${raw.source}::chunk_${raw.chunk_index ?? i + 1}`,
    source: raw.source,
    module: raw.module ?? '',
    chunk_index: raw.chunk_index ?? i + 1,
    start_time: raw.start_time ?? null,
    end_time: raw.end_time ?? null,
    start_hms: raw.start_hms ?? '',
    end_hms: raw.end_hms ?? '',
    text: raw.text,
  };
}

async function main() {
  const apiKey = process.env.VITE_GEMINI_API_KEY;
  if (!apiKey || !process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
    console.error('Missing VITE_GEMINI_API_KEY / VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY in your .env.');
    process.exit(1);
  }

  const { input } = parseArgs();
  const rawChunks = JSON.parse(fs.readFileSync(input, 'utf-8'));
  if (!Array.isArray(rawChunks)) {
    console.error('Input file must be a JSON array of chunk objects.');
    process.exit(1);
  }

  const chunks = rawChunks.map(mapChunk);
  console.log(`Loaded ${chunks.length} chunk(s) from ${input}. Embedding...`);

  const embeddings = await embedTexts(chunks.map(c => c.text), apiKey);
  const rows = chunks.map((c, i) => ({ ...c, embedding: embeddings[i] }));

  const supabase = getSupabase();
  // upsert on id — safe to re-run; re-embeds and overwrites matching rows.
  const { error } = await supabase.from('chunks').upsert(rows, { onConflict: 'id' });
  if (error) {
    console.error('Supabase upsert failed:', error.message);
    process.exit(1);
  }

  console.log(`Done. ${rows.length} chunks upserted into Supabase.`);
}

main().catch(err => {
  console.error('Embedding failed:', err);
  process.exit(1);
});
