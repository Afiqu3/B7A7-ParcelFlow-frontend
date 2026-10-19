import "server-only";

import { NextResponse } from "next/server";
import { SUPPORT } from "@/constants";

type ChatRole = "user" | "assistant";
type ChatMessage = { role: ChatRole; content: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

const MAX_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 1200;
const REQUEST_TIMEOUT_MS = 15_000;
const SYSTEM_PROMPT = `You are ParcelFlow's friendly support assistant for a courier and payments service for merchants in Bangladesh.
Help users understand parcel booking, tracking, delivery types, cash on delivery, bKash payments, merchant accounts, rider applications, and how to use the website.
Keep answers concise, practical, and grounded in the conversation. Do not invent live parcel status, account information, exact prices, service guarantees, or policies. When information is account-specific or uncertain, direct the user to log in or contact support at ${SUPPORT.email}.
Useful website pages: /pricing, /how-it-works, /contact, /ride-with-us, /apply-rider, and /login. Never ask users to provide passwords, payment credentials, verification codes, or sensitive personal information.`;

type ChatProvider = {
  name: string;
  request: (messages: ChatMessage[]) => Promise<string>;
};

function getProviders(): ChatProvider[] {
  const geminiKey = process.env.GEMINI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;
  const openRouterKey = process.env.OPENROUTER_API_KEY;

  return [
    ...(geminiKey
      ? [
          {
            name: "Gemini",
            request: (messages: ChatMessage[]) =>
              requestGemini(
                process.env.GEMINI_API_URL ||
                  "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
                geminiKey,
                messages,
              ),
          },
        ]
      : []),
    ...(groqKey
      ? [
          {
            name: "Groq",
            request: (messages: ChatMessage[]) =>
              requestOpenAiCompatible(
                process.env.GROQ_API_URL ||
                  "https://api.groq.com/openai/v1/chat/completions",
                groqKey,
                process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
                messages,
              ),
          },
        ]
      : []),
    ...(openRouterKey
      ? [
          {
            name: "OpenRouter",
            request: (messages: ChatMessage[]) =>
              requestOpenAiCompatible(
                process.env.OPENROUTER_API_URL ||
                  "https://openrouter.ai/api/v1/chat/completions",
                openRouterKey,
                process.env.OPENROUTER_MODEL ||
                  "deepseek/deepseek-v4.1-flash-1017",
                messages,
              ),
          },
        ]
      : []),
  ];
}

async function fetchJson(url: string, init: RequestInit) {
  const response = await fetch(url, {
    ...init,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Provider returned HTTP ${response.status}`);
  }

  return response.json() as Promise<unknown>;
}

async function requestGemini(
  url: string,
  apiKey: string,
  messages: ChatMessage[],
) {
  const body = await fetchJson(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: messages.map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: [{ text: message.content }],
      })),
      generationConfig: { maxOutputTokens: 600, temperature: 0.4 },
    }),
  });

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
  messages: ChatMessage[],
) {
  const body = await fetchJson(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      max_tokens: 600,
      temperature: 0.4,
    }),
  });

  if (!isRecord(body) || !Array.isArray(body.choices)) {
    throw new Error("Provider returned an invalid response");
  }

  const choice = body.choices[0];
  if (
    !isRecord(choice) ||
    !isRecord(choice.message) ||
    typeof choice.message.content !== "string"
  ) {
    throw new Error("Provider returned no answer");
  }

  const answer = choice.message.content.trim();
  if (!answer) throw new Error("Provider returned an empty answer");
  return answer;
}

function isChatMessage(value: unknown): value is ChatMessage {
  return (
    isRecord(value) &&
    (value.role === "user" || value.role === "assistant") &&
    typeof value.content === "string" &&
    value.content.trim().length > 0 &&
    value.content.length <= MAX_MESSAGE_LENGTH
  );
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 20_000) {
    return NextResponse.json(
      { error: "Your message is too large. Please shorten it and try again." },
      { status: 413 },
    );
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json(
      { error: "The chat request was invalid. Please try again." },
      { status: 400 },
    );
  }

  if (new TextEncoder().encode(rawBody).byteLength > 20_000) {
    return NextResponse.json(
      { error: "Your message is too large. Please shorten it and try again." },
      { status: 413 },
    );
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      { error: "The chat request was invalid. Please try again." },
      { status: 400 },
    );
  }

  if (
    !body ||
    typeof body !== "object" ||
    !("messages" in body) ||
    !Array.isArray(body.messages) ||
    body.messages.length === 0 ||
    body.messages.length > MAX_MESSAGES ||
    !body.messages.every(isChatMessage) ||
    body.messages[body.messages.length - 1]?.role !== "user"
  ) {
    return NextResponse.json(
      { error: "Please send a valid message of up to 1,200 characters." },
      { status: 400 },
    );
  }

  const providers = getProviders();
  if (providers.length === 0) {
    console.error(
      "Chat is unavailable: no server-side AI providers are configured.",
    );
    return NextResponse.json(
      { error: "Chat is temporarily unavailable. Please try again later." },
      { status: 503 },
    );
  }

  const messages = body.messages as ChatMessage[];
  const failures: string[] = [];
  for (const provider of providers) {
    try {
      return NextResponse.json({ reply: await provider.request(messages) });
    } catch (error) {
      const reason =
        error instanceof Error ? error.message : "Unknown provider error";
      console.error(`Chat provider ${provider.name} failed: ${reason}`);
      failures.push(provider.name);
    }
  }

  console.error(`All chat providers failed: ${failures.join(", ")}.`);
  return NextResponse.json(
    { error: "I couldn't connect just now. Please try again in a moment." },
    { status: 503 },
  );
}
