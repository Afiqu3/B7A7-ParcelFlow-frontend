import "server-only";

type AIMessage = {
  role: "user" | "assistant";
  content: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function providerErrorMessage(value: unknown) {
  if (!isRecord(value)) return null;
  const error = value.error;
  if (typeof error === "string") return error;
  if (isRecord(error) && typeof error.message === "string") {
    return error.message;
  }
  return typeof value.message === "string" ? value.message : null;
}

async function fetchJson(url: string, init: RequestInit, apiKey: string) {
  const response = await fetch(url, {
    ...init,
    signal: AbortSignal.timeout(15_000),
    cache: "no-store",
  });

  if (!response.ok) {
    let message: string | null = null;
    try {
      message = providerErrorMessage(await response.json());
    } catch {
      message = null;
    }
    const detail = message
      ?.replaceAll(apiKey, "[redacted]")
      .replaceAll(/[\r\n]+/g, " ")
      .slice(0, 300);
    throw new Error(
      `Provider returned HTTP ${response.status}${detail ? `: ${detail}` : ""}`,
    );
  }

  return response.json() as Promise<unknown>;
}

function assistantText(value: unknown) {
  if (typeof value === "string") return value;
  if (!Array.isArray(value)) return "";
  return value
    .flatMap((part: unknown) =>
      isRecord(part) && typeof part.text === "string" ? [part.text] : [],
    )
    .join("");
}

async function requestGemini(
  url: string,
  apiKey: string,
  systemPrompt: string,
  messages: AIMessage[],
  maxTokens: number,
) {
  const body = await fetchJson(
    url,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: messages.map((message) => ({
          role: message.role === "assistant" ? "model" : "user",
          parts: [{ text: message.content }],
        })),
        generationConfig: { maxOutputTokens: maxTokens, temperature: 0.4 },
      }),
    },
    apiKey,
  );

  if (!isRecord(body) || !Array.isArray(body.candidates)) {
    throw new Error("Provider returned an invalid response");
  }

  const candidate = body.candidates[0];
  if (
    !isRecord(candidate) ||
    !isRecord(candidate.content) ||
    !Array.isArray(candidate.content.parts)
  ) {
    throw new Error("Provider returned no answer");
  }

  const answer = candidate.content.parts
    .flatMap((part: unknown) =>
      isRecord(part) && typeof part.text === "string" ? [part.text] : [],
    )
    .join("")
    .trim();

  if (!answer) throw new Error("Provider returned an empty answer");
  return answer;
}

async function requestOpenAiCompatible(
  url: string,
  apiKey: string,
  model: string,
  systemPrompt: string,
  messages: AIMessage[],
  maxTokens: number,
) {
  const body = await fetchJson(
    url,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        max_tokens: maxTokens,
        temperature: 0.4,
      }),
    },
    apiKey,
  );

  if (!isRecord(body) || !Array.isArray(body.choices)) {
    throw new Error("Provider returned an invalid response");
  }

  const choice = body.choices[0];
  if (!isRecord(choice) || !isRecord(choice.message)) {
    throw new Error("Provider returned no answer");
  }

  const answer = assistantText(choice.message.content).trim();
  if (!answer) {
    const finishReason =
      typeof choice.finish_reason === "string"
        ? ` (finish reason: ${choice.finish_reason})`
        : "";
    throw new Error(`Provider returned no answer${finishReason}`);
  }
  return answer;
}

export async function generateAIResponse(
  systemPrompt: string,
  messages: AIMessage[],
  maxTokens: number,
) {
  const providers = [
    ...(process.env.GEMINI_API_KEY
      ? [
          {
            name: "Gemini",
            request: () =>
              requestGemini(
                process.env.GEMINI_API_URL ||
                  "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
                process.env.GEMINI_API_KEY as string,
                systemPrompt,
                messages,
                maxTokens,
              ),
          },
        ]
      : []),
    ...(process.env.GROQ_API_KEY
      ? [
          {
            name: "Groq",
            request: () =>
              requestOpenAiCompatible(
                process.env.GROQ_API_URL ||
                  "https://api.groq.com/openai/v1/chat/completions",
                process.env.GROQ_API_KEY as string,
                process.env.GROQ_MODEL || "openai/gpt-oss-120b",
                systemPrompt,
                messages,
                maxTokens,
              ),
          },
        ]
      : []),
    ...(process.env.OPENROUTER_API_KEY
      ? [
          {
            name: "OpenRouter",
            request: () =>
              requestOpenAiCompatible(
                process.env.OPENROUTER_API_URL ||
                  "https://openrouter.ai/api/v1/chat/completions",
                process.env.OPENROUTER_API_KEY as string,
                process.env.OPENROUTER_MODEL ||
                  "deepseek/deepseek-v4.1-flash-1017",
                systemPrompt,
                messages,
                maxTokens,
              ),
          },
        ]
      : []),
  ];

  if (providers.length === 0) {
    throw new Error("No server-side AI providers are configured");
  }

  for (const provider of providers) {
    try {
      return await provider.request();
    } catch (error) {
      const cause =
        error instanceof Error && isRecord(error.cause) ? error.cause : null;
      const causeCode =
        cause && typeof cause.code === "string" ? cause.code : "";
      const reason =
        error instanceof Error ? error.message : "Unknown provider error";
      console.error(
        `AI provider ${provider.name} failed: ${reason}${
          causeCode ? ` (cause: ${causeCode})` : ""
        }`,
      );
    }
  }

  throw new Error("All configured AI providers failed");
}
