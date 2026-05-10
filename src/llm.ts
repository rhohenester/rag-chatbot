import OpenAI from "openai";
import type { SearchResult } from "./vectorStore.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const CHAT_MODEL = "gpt-4o-mini";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

// Prompt engineering
function buildSystemPrompt(results: SearchResult[]): string {
  const context = results
    .map(
      ({ document, score }, i) =>
        `[${i + 1}] (source: ${document.metadata.source}, relevance: ${score.toFixed(2)})\n${document.content}`,
    )
    .join("\n\n---\n\n");

  // Do not hallucinate when the context is insufficient
  return `You are a helpful assistant. Answer the user's question using only the context provided below. If the context does not contain enough information to answer, say so honestly — do not make things up.

<context>
${context}
</context>`;
}

export async function chat(
  query: string,
  context: SearchResult[],
  history: Message[],
): Promise<string> {
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: buildSystemPrompt(context) },
    /*
     * The `...history` spread inserts all previous turns in between,
     * so the model remembers the whole conversation.
     */
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: query },
  ];

  const response = await openai.chat.completions.create({
    model: CHAT_MODEL,
    messages,
    // Mostly factual but with a little natural variation in phrasing.
    temperature: 0.3,
  });

  return response.choices[0].message.content ?? "(no response)";
}
