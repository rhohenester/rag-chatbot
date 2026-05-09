export interface Document {
  id: string;
  content: string;
  metadata: Record<string, string>;
  embedding: number[];
}

export interface SearchResult {
  document: Document;
  score: number;
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export class VectorStore {
  private documents: Document[] = [];

  add(doc: Document): void {
    this.documents.push(doc);
  }

  similaritySearch(queryEmbedding: number[], topK = 5): SearchResult[] {
    return this.documents
      .map((doc) => ({
        document: doc,
        score: cosineSimilarity(queryEmbedding, doc.embedding),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  size(): number {
    return this.documents.length;
  }
}
