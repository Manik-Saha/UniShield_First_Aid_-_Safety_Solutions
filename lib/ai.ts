/**
 * AI provider abstraction. Set ONE of these env vars to switch providers:
 *
 *   GEMINI_API_KEY=AIza...          → Google Gemini (free at aistudio.google.com)
 *   GROQ_API_KEY=gsk_...            → Groq (free tier at console.groq.com)
 *   OLLAMA_BASE_URL=http://localhost:11434  → Ollama running locally (free)
 *   ANTHROPIC_API_KEY=sk-ant-...    → Anthropic Claude (paid, default fallback)
 *
 * Priority order: Gemini → Groq → Ollama → Anthropic
 *
 * Free models used:
 *   Gemini:  gemini-2.0-flash  (1500 req/day free)
 *   Groq:    llama-3.3-70b-versatile
 *   Ollama:  set OLLAMA_MODEL=llama3.2 (or any pulled model)
 */

type Provider = "gemini" | "groq" | "ollama" | "anthropic";

function detectProvider(): Provider {
  if (process.env.GEMINI_API_KEY) return "gemini";
  if (process.env.GROQ_API_KEY) return "groq";
  if (process.env.OLLAMA_BASE_URL) return "ollama";
  return "anthropic";
}

export async function generateText(prompt: string): Promise<string> {
  const provider = detectProvider();

  // OpenAI-compatible providers: Gemini, Groq, Ollama
  if (provider !== "anthropic") {
    const { default: OpenAI } = await import("openai");

    const configs = {
      gemini: {
        apiKey: process.env.GEMINI_API_KEY!,
        baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
        model: process.env.GEMINI_MODEL ?? "gemini-2.0-flash",
      },
      groq: {
        apiKey: process.env.GROQ_API_KEY!,
        baseURL: "https://api.groq.com/openai/v1",
        model: "llama-3.3-70b-versatile",
      },
      ollama: {
        apiKey: "ollama",
        baseURL: (process.env.OLLAMA_BASE_URL ?? "http://localhost:11434") + "/v1",
        model: process.env.OLLAMA_MODEL ?? "llama3.2",
      },
    };

    const { apiKey, baseURL, model } = configs[provider];
    const client = new OpenAI({ apiKey, baseURL });
    const resp = await client.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2048,
    });
    return resp.choices[0]?.message?.content ?? "";
  }

  // Default: Anthropic Claude
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const stream = client.messages.stream({
    model: "claude-opus-4-8",
    max_tokens: 2048,
    thinking: { type: "adaptive" },
    messages: [{ role: "user", content: prompt }],
  });
  const message = await stream.finalMessage();
  const textBlock = message.content.find((b) => b.type === "text");
  return textBlock ? textBlock.text : "";
}
