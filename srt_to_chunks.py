"""
srt_to_chunks.py

Walks a folder of .srt transcripts (organized in module subfolders),
chunks each one by time window / char cap, and writes a single
chunks.json file shaped exactly the way embed-chunks.js expects:

    [
      {
        "id": "module1/Lesson1.srt::chunk_1",
        "source": "module1/Lesson1.srt",
        "module": "module1",
        "chunk_index": 1,
        "start_time": 0.0,
        "end_time": 44.8,
        "start_hms": "00:00:00",
        "end_hms": "00:00:44",
        "text": "..."
      },
      ...
    ]

No embedding model, no vector DB — this only produces the JSON that
`npm run embed -- --input ./chunks.json` then reads and embeds via Gemini.

Usage
-----
    python srt_to_chunks.py --input_dir ./transcripts --output ./chunks.json

Folder layout expected (same as your Vite app's /public/transcripts):
    transcripts/
        module1/
            Lesson1.srt
            Lesson2.srt
        module2/
            Lesson1.srt
            ...
"""

import argparse
import json
import os
import re


# ---------------------------------------------------------------------------
# SRT parsing (identical to srt_to_vectordb.py)
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
        text = re.sub(r"<[^>]+>", "", text)
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
# File discovery
# ---------------------------------------------------------------------------

def find_srt_files(input_dir):
    found = []
    for root, _dirs, files in os.walk(input_dir):
        for fname in files:
            if not fname.lower().endswith(".srt"):
                continue
            abs_path = os.path.join(root, fname)
            rel_path = os.path.relpath(abs_path, input_dir).replace(os.sep, "/")
            parts = rel_path.split("/")
            module = parts[0] if len(parts) > 1 else ""
            found.append((abs_path, rel_path, module))
    return sorted(found, key=lambda t: t[1])


# ---------------------------------------------------------------------------
# Chunking
# ---------------------------------------------------------------------------

def chunk_cues(cues, window_seconds=45, max_chars=800, min_chars=200):
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


def build_records(abs_path, rel_path, module, window_seconds, max_chars):
    cues = parse_srt(abs_path)
    if not cues:
        return []
    chunks = chunk_cues(cues, window_seconds=window_seconds, max_chars=max_chars)
    records = []
    for i, c in enumerate(chunks):
        records.append({
            "id": f"{rel_path}::chunk_{i + 1}",
            "source": rel_path,
            "module": module,
            "chunk_index": i + 1,
            "start_time": round(c["start"], 2),
            "end_time": round(c["end"], 2),
            "start_hms": seconds_to_hms(c["start"]),
            "end_hms": seconds_to_hms(c["end"]),
            "text": c["text"],
        })
    return records


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--input_dir", required=True, help="Root folder containing module subfolders of .srt files")
    parser.add_argument("--output", default="./chunks.json", help="Where to write the output JSON")
    parser.add_argument("--window_seconds", type=float, default=45, help="Target chunk duration in seconds")
    parser.add_argument("--max_chars", type=int, default=800, help="Max characters per chunk")
    args = parser.parse_args()

    srt_files = find_srt_files(args.input_dir)
    if not srt_files:
        print(f"No .srt files found under {args.input_dir}")
        return

    all_records = []
    for abs_path, rel_path, module in srt_files:
        records = build_records(abs_path, rel_path, module, args.window_seconds, args.max_chars)
        if not records:
            print(f"  - {rel_path}: no parseable cues, skipping")
            continue
        all_records.extend(records)
        print(f"  - {rel_path}: {len(records)} chunks")

    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(all_records, f, ensure_ascii=False, indent=2)

    print(f"\nWrote {len(all_records)} chunks from {len(srt_files)} file(s) to {args.output}")


if __name__ == "__main__":
    main()
