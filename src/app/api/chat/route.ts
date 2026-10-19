import { NextResponse } from "next/server";
import { SUPPORT } from "@/constants";
import { generateAIResponse } from "@/lib/server/ai-provider";

type ChatRole = "user" | "assistant";
type ChatMessage = { role: ChatRole; content: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

const MAX_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 1200;
const MAX_BODY_BYTES = 20_000;
const SYSTEM_PROMPT = `You are ParcelFlow's friendly support assistant for a courier and payments service for merchants in Bangladesh.
Help users understand parcel booking, tracking, delivery types, cash on delivery, bKash payments, merchant accounts, rider applications, and how to use the website.
Keep answers concise, practical, and grounded in the conversation. Do not invent live parcel status, account information, exact prices, service guarantees, or policies. When information is account-specific or uncertain, direct the user to log in or contact support at ${SUPPORT.email}.
Useful website pages: /pricing, /how-it-works, /contact, /ride-with-us, /apply-rider, and /login. Never ask users to provide passwords, payment credentials, verification codes, or sensitive personal information.`;

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
  if (contentLength > MAX_BODY_BYTES) {
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

  if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
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
    !isRecord(body) ||
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

  try {
    const reply = await generateAIResponse(
      SYSTEM_PROMPT,
      body.messages as ChatMessage[],
      600,
    );
    return NextResponse.json({ reply });
  } catch (error) {
    const reason =
      error instanceof Error ? error.message : "Unknown AI service error";
    console.error(`Chat request failed: ${reason}`);
    return NextResponse.json(
      { error: "Chat is temporarily unavailable. Please try again later." },
      { status: 503 },
    );
  }
}
