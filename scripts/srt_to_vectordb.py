"""
srt_to_vectordb.py

Batch pipeline: parse a folder of .srt transcripts -> chunk them ->
embed with a local (free, no API key) sentence-transformers model ->
store in a persistent ChromaDB vector database.

Usage
-----
1) Install dependencies (one time):
   pip install sentence-transformers chromadb

2) Put all your .srt files in one folder, e.g. ./transcripts

3) Ingest everything:
   python srt_to_vectordb.py ingest --input_dir ./transcripts --db_dir ./vector_db

4) Query it:
   python srt_to_vectordb.py query --db_dir ./vector_db --q "What does CTPL cover?"

Re-running ingest on the same folder is safe: files already ingested are
skipped (tracked by filename) unless you pass --overwrite.
"""

import argparse
import json
import os
import re
import sys

import chromadb
from sentence_transformers import SentenceTransformer

EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"  # small, fast, good default. 384-dim.
COLLECTION_NAME = "transcripts"


# ---------------------------------------------------------------------------
# SRT parsing
# ---------------------------------------------------------------------------

def parse_srt(path):
    with open(path, encoding="utf-8-sig") as f:
        content = f.read()
    blocks = re.split(r"\n\s*\n", content.strip())
    cues = []
    for block in blocks:
        lines = block.strip().split("\n")
        if len(lines) < 3:
            continue
        time_line = lines[1]
        if "-->" not in time_line:
            continue
        start_str, end_str = [t.strip() for t in time_line.split("-->")]
        text = " ".join(lines[2:]).strip()
        text = re.sub(r"<[^>]+>", "", text)  # strip any <i>, <b> style tags
        if not text:
            continue
        cues.append({
            "start": srt_time_to_seconds(start_str),
            "end": srt_time_to_seconds(end_str),
            "text": text,
        })
    return cues


def srt_time_to_seconds(t):
    h, m, s_ms = t.strip().split(":")
    s, ms = s_ms.split(",")
    return int(h) * 3600 + int(m) * 60 + int(s) + int(ms) / 1000


def seconds_to_hms(s):
    m, s = divmod(int(s), 60)
    h, m = divmod(m, 60)
    return f"{h:02d}:{m:02d}:{s:02d}"


# ---------------------------------------------------------------------------
# Chunking
# ---------------------------------------------------------------------------

def chunk_cues(cues, window_seconds=45, max_chars=800, min_chars=200):
    """Group consecutive cues into chunks by a time window / char cap.
    Merges a too-small trailing chunk into the previous one."""
    chunks = []
    current = []
    chunk_start = None

    for cue in cues:
        if chunk_start is None:
            chunk_start = cue["start"]
        current.append(cue["text"])
        joined = " ".join(current)

        elapsed = cue["end"] - chunk_start
        if elapsed >= window_seconds or len(joined) >= max_chars:
            chunks.append({"start": chunk_start, "end": cue["end"], "text": joined})
            current = []
            chunk_start = None

    if current:
        tail = {"start": chunk_start, "end": cues[-1]["end"], "text": " ".join(current)}
        if chunks and len(tail["text"]) < min_chars:
            chunks[-1]["end"] = tail["end"]
            chunks[-1]["text"] += " " + tail["text"]
        else:
            chunks.append(tail)

    return chunks


def build_records(srt_path, window_seconds=45, max_chars=800):
    source = os.path.basename(srt_path)
    cues = parse_srt(srt_path)
    if not cues:
        return []
    chunks = chunk_cues(cues, window_seconds=window_seconds, max_chars=max_chars)
    records = []
    for i, c in enumerate(chunks):
        records.append({
            "id": f"{source}::chunk_{i + 1}",
            "source": source,
            "chunk_index": i + 1,
            "start_time": round(c["start"], 2),
            "end_time": round(c["end"], 2),
            "start_hms": seconds_to_hms(c["start"]),
            "end_hms": seconds_to_hms(c["end"]),
            "text": c["text"],
        })
    return records


# ---------------------------------------------------------------------------
# Ingest
# ---------------------------------------------------------------------------

def ingest(input_dir, db_dir, window_seconds, max_chars, overwrite):
    srt_files = sorted(
        f for f in os.listdir(input_dir) if f.lower().endswith(".srt")
    )
    if not srt_files:
        print(f"No .srt files found in {input_dir}")
        return

    print(f"Found {len(srt_files)} .srt file(s). Loading embedding model "
          f"'{EMBEDDING_MODEL_NAME}' (first run downloads it, ~90MB)...")
    model = SentenceTransformer(EMBEDDING_MODEL_NAME)

    client = chromadb.PersistentClient(path=db_dir)
    collection = client.get_or_create_collection(COLLECTION_NAME)

    already_done = set()
    if not overwrite:
        existing = collection.get(include=["metadatas"])
        already_done = {m["source"] for m in existing["metadatas"]} if existing["metadatas"] else set()

    total_chunks = 0
    for fname in srt_files:
        if fname in already_done:
            print(f"  - {fname}: already ingested, skipping (use --overwrite to redo)")
            continue

        path = os.path.join(input_dir, fname)
        records = build_records(path, window_seconds=window_seconds, max_chars=max_chars)
        if not records:
            print(f"  - {fname}: no parseable cues, skipping")
            continue

        if overwrite:
            collection.delete(where={"source": fname})

        texts = [r["text"] for r in records]
        embeddings = model.encode(texts, show_progress_bar=False).tolist()

        collection.add(
            ids=[r["id"] for r in records],
            embeddings=embeddings,
            documents=texts,
            metadatas=[{
                "source": r["source"],
                "chunk_index": r["chunk_index"],
                "start_time": r["start_time"],
                "end_time": r["end_time"],
                "start_hms": r["start_hms"],
                "end_hms": r["end_hms"],
            } for r in records],
        )
        print(f"  - {fname}: {len(records)} chunks added")
        total_chunks += len(records)

    print(f"\nDone. {total_chunks} new chunks stored in '{db_dir}' "
          f"(collection: {COLLECTION_NAME}).")


# ---------------------------------------------------------------------------
# Query
# ---------------------------------------------------------------------------

def query(db_dir, question, n_results):
    model = SentenceTransformer(EMBEDDING_MODEL_NAME)
    client = chromadb.PersistentClient(path=db_dir)
    collection = client.get_or_create_collection(COLLECTION_NAME)

    q_embedding = model.encode([question]).tolist()
    results = collection.query(query_embeddings=q_embedding, n_results=n_results)

    docs = results["documents"][0]
    metas = results["metadatas"][0]
    dists = results["distances"][0]

    if not docs:
        print("No results (is the database empty? run 'ingest' first).")
        return

    print(f"\nTop {len(docs)} result(s) for: {question!r}\n")
    for doc, meta, dist in zip(docs, metas, dists):
        print(f"[{meta['source']} | {meta['start_hms']}-{meta['end_hms']} | "
              f"score={1 - dist:.3f}]")
        print(doc)
        print()


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = parser.add_subparsers(dest="command", required=True)

    p_ingest = sub.add_parser("ingest", help="Chunk + embed all .srt files in a folder into the vector DB")
    p_ingest.add_argument("--input_dir", required=True, help="Folder containing .srt files")
    p_ingest.add_argument("--db_dir", default="./vector_db", help="Where to store the persistent vector DB")
    p_ingest.add_argument("--window_seconds", type=float, default=45, help="Target chunk duration in seconds")
    p_ingest.add_argument("--max_chars", type=int, default=800, help="Max characters per chunk")
    p_ingest.add_argument("--overwrite", action="store_true", help="Re-ingest files even if already present")

    p_query = sub.add_parser("query", help="Search the vector DB")
    p_query.add_argument("--db_dir", default="./vector_db", help="Path to the persistent vector DB")
    p_query.add_argument("--q", required=True, help="Your search question")
    p_query.add_argument("--n", type=int, default=3, help="Number of results to return")

    args = parser.parse_args()

    if args.command == "ingest":
        ingest(args.input_dir, args.db_dir, args.window_seconds, args.max_chars, args.overwrite)
    elif args.command == "query":
        query(args.db_dir, args.q, args.n)


if __name__ == "__main__":
    main()