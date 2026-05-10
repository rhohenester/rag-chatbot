# ✨ rag-chatbot ✨

A cute little Retrieval-Augmented Generation (RAG) chatbot powered by OpenAI 🤍  
Built with an in-memory vector store for fast and lightweight semantic search.

---

## 🌸 Features

- 💬 Chat with your documents
- 🧠 OpenAI-powered responses (gpt-4o-mini)
- 🔎 Semantic search using vector embeddings (text-embedding-3-small)
- ⚡ Lightweight in-memory vector store with cosine similarity
- 🗂️ Supports `.txt` and `.md` files

---

## 🛠️ Tech Stack

- **Runtime** — Node.js with TypeScript
- **LLM** — gpt-4o-mini (OpenAI)
- **Embeddings** — text-embedding-3-small (OpenAI)
- **Vector store** — in-memory with cosine similarity (no external database)
- **CLI** — Node.js readline module
- **Config** — dotenv for environment variables

---

## 💖 What is RAG?

RAG stands for **Retrieval-Augmented Generation**.

Instead of relying only on AI memory, the chatbot:
1. Splits your documents into overlapping chunks
2. Embeds each chunk into a vector using OpenAI
3. When you ask a question, finds the most relevant chunks via cosine similarity
4. Injects those chunks into the prompt so the LLM answers from your documents ✨

---

## 🌷 Project Structure

```
rag-chatbot/
├── src/
│   ├── index.ts        # CLI entry point — wires everything together
│   ├── vectorStore.ts  # In-memory vector store with cosine similarity
│   ├── embeddings.ts   # OpenAI embeddings wrapper
│   ├── ingest.ts       # Reads files, chunks text, stores embeddings
│   └── llm.ts          # Builds prompt and calls gpt-4o-mini
├── documents/          # Drop your .txt or .md files here
├── .env.example        # Copy to .env and add your OpenAI API key
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and add your OpenAI API key:
   ```bash
   cp .env.example .env
   ```

3. Add your `.txt` or `.md` files to the `documents/` folder.

4. Start the chatbot:
   ```bash
   npm start
   ```

5. Type your questions and press Enter. Type `exit` to quit.
