import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { VectorStore } from "./vectorStore.js";
import { embedBatch } from "./embeddings.js";

const CHUNK_SIZE = 500;    // characters per chunk
const CHUNK_OVERLAP = 100; // characters shared between consecutive chunks

function chunkText(text: string): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + CHUNK_SIZE, text.length);
    const chunk = text.slice(start, end).trim();
    if (chunk.length > 0) chunks.push(chunk);
    if (end === text.length) break;
    start += CHUNK_SIZE - CHUNK_OVERLAP;
  }

  return chunks;
}

export async function ingestDirectory(
  dirPath: string,
  store: VectorStore
): Promise<number> {
  const files = fs
    .readdirSync(dirPath)
    .filter((f) => f.endsWith(".txt") || f.endsWith(".md"));

  if (files.length === 0) {
    console.log(`⚠️  No .txt or .md files found in ${dirPath}`);
    return 0;
  }

  let totalChunks = 0;

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const chunks = chunkText(content);

    console.log(`📄 "${file}" → ${chunks.length} chunks`);

    const embeddings = await embedBatch(chunks);

    for (let i = 0; i < chunks.length; i++) {
      store.add({
        id: randomUUID(),
        content: chunks[i],
        metadata: { source: file, chunk: String(i) },
        embedding: embeddings[i],
      });
    }

    totalChunks += chunks.length;
  }

  return totalChunks;
}
