//Talks to OpenAI to turn text into vectors
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const EMBEDDING_MODEL = "text-embedding-3-small";

/*
 * Embeds a single text string into a vector
 * This will be used at query time when the user types a question.
 */
export async function embed(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
  });
  return response.data[0].embedding;
}

/*
 * This is for many texts at once.
 * The OpenAI API accepts an array, so the chunks wil be sent in one request
 * instead of making one API call per chunk. Much faster and cheaper.
 */
export async function embedBatch(texts: string[]): Promise<number[][]> {
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: texts,
  });
  return response.data
    .sort((a, b) => a.index - b.index)
    .map((d) => d.embedding);
}
