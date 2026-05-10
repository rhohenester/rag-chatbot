import "dotenv/config";
import readline from "readline";
import path from "path";
import { VectorStore } from "./vectorStore.js";
import { embed } from "./embeddings.js";
import { ingestDirectory } from "./ingest.js";
import { chat, type Message } from "./llm.js";

const DOCS_DIR = path.join(process.cwd(), "documents");
const TOP_K = 5;

async function main() {
  console.log("RAG Chatbot starting...\n");

  // Guard: fail early if no API key is set
  if (!process.env.OPENAI_API_KEY) {
    console.error(
      "❌ OPENAI_API_KEY is not set. Copy .env.example to .env and add your key.",
    );
    process.exit(1);
  }

  // 1. Ingest all documents into the vector store
  const store = new VectorStore();
  const totalChunks = await ingestDirectory(DOCS_DIR, store);

  if (totalChunks === 0) {
    console.error(
      "❌ No documents were ingested. Add .txt or .md files to the documents/ folder.",
    );
    process.exit(1);
  }

  console.log(`\nReady — ${totalChunks} chunks indexed.\n`);
  console.log('Ask me anything about your documents. Type "exit" to quit.\n');

  // 2. Keep chat history across turns
  const history: Message[] = [];

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // 3. Chat loop
  // When input arrives, do something and at the end of that something, ask for input again
  const prompt = () => {
    rl.question("You: ", async (input) => {
      const query = input.trim();

      if (!query) {
        prompt();
        return;
      }

      if (query.toLowerCase() === "exit" || query.toLowerCase() === "quit") {
        console.log("\nGoodbye!");
        rl.close();
        return;
      }

      try {
        // Embed the question, retrieve the top K chunks, generate an answer
        const queryEmbedding = await embed(query); // Turn the question into a vector
        const results = store.similaritySearch(queryEmbedding, TOP_K); // Find the most relevant chunks
        const answer = await chat(query, results, history); // Generate an answer grounded in those chunks

        console.log(`\nAssistant: ${answer}\n`);

        // Append this turn to history so the next answer has context
        history.push({ role: "user", content: query });
        history.push({ role: "assistant", content: answer });
      } catch (err) {
        console.error("\n Error:", (err as Error).message, "\n");
      }

      prompt();
    });
  };

  prompt();
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
