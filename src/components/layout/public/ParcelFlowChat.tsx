"use client";

import {
  Bot,
  LoaderCircle,
  MessageCircle,
  Send,
  ShieldAlert,
  X,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isChatReply(value: unknown): value is { reply: string } {
  return isRecord(value) && typeof value.reply === "string";
}

const WELCOME_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "Hi! I’m the ParcelFlow assistant. Ask me about parcel delivery, payments, tracking, or riding with us.",
};

export default function ParcelFlowChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const messageCount = messages.length;

  useEffect(() => {
    if (!isOpen) return;

    inputRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  useEffect(() => {
    if (messageCount === 0) return;
    messageEndRef.current?.scrollIntoView({
      behavior: shouldReduceMotion ? "auto" : "smooth",
      block: "end",
    });
  }, [messageCount, shouldReduceMotion]);

  const sendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = draft.trim();
    if (!content || isSending) return;

    const userMessage: ChatMessage = { role: "user", content };
    const conversation = [...messages.slice(1), userMessage].slice(-12);
    setMessages((current) => [...current, userMessage]);
    setDraft("");
    setError("");
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversation }),
      });
      const result: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          result &&
          typeof result === "object" &&
          "error" in result &&
          typeof result.error === "string"
            ? result.error
            : "Chat is unavailable right now. Please try again.";
        throw new Error(message);
      }

      if (!isChatReply(result)) {
        throw new Error("Chat is unavailable right now. Please try again.");
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", content: result.reply },
      ]);
    } catch (sendError) {
      setError(
        sendError instanceof Error
          ? sendError.message
          : "Message could not be sent. Please try again.",
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen ? (
          <motion.section
            id="parcelflow-chat-panel"
            role="dialog"
            aria-label="ParcelFlow AI chat"
            aria-modal="false"
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 16, scale: 0.97 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 12, scale: 0.98 }
            }
            transition={{ duration: shouldReduceMotion ? 0.12 : 0.2 }}
            className="fixed right-4 bottom-36 z-50 flex h-[min(36rem,calc(100dvh-11rem))] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-3xl bg-background text-foreground shadow-2xl ring-1 ring-brand/15 sm:right-8"
          >
            <header className="flex items-center justify-between gap-3 bg-brand px-4 py-4 text-white">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                  <Bot
                    aria-hidden="true"
                    className="size-5 text-brand-orange"
                  />
                </span>
                <div className="min-w-0">
                  <h2 className="truncate font-heading text-sm font-extrabold">
                    ParcelFlow assistant
                  </h2>
                  <p className="mt-0.5 text-xs text-white/65">
                    Here to help with your delivery
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="grid size-9 shrink-0 place-items-center rounded-xl text-white/75 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange"
              >
                <X aria-hidden="true" className="size-4.5" />
              </button>
            </header>

            <div
              aria-live="polite"
              aria-relevant="additions text"
              className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto bg-brand/3 px-4 py-4"
            >
              {messages.map((message, index) => (
                <motion.div
                  key={`${index}-${message.role}`}
                  initial={
                    shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: shouldReduceMotion ? 0.1 : 0.18 }}
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "self-end rounded-br-md bg-brand text-white"
                      : "self-start rounded-bl-md bg-card text-secondary ring-1 ring-secondary/8"
                  }`}
                >
                  {message.content}
                </motion.div>
              ))}
              {isSending ? (
                <output
                  aria-live="polite"
                  className="inline-flex w-fit items-center gap-2 self-start rounded-2xl rounded-bl-md bg-card px-3.5 py-2.5 text-xs text-secondary/65 ring-1 ring-secondary/8"
                >
                  <LoaderCircle
                    aria-hidden="true"
                    className={`size-3.5 text-brand-orange-ink ${
                      shouldReduceMotion ? "" : "animate-spin"
                    }`}
                  />
                  Thinking…
                </output>
              ) : null}
              <div ref={messageEndRef} />
            </div>

            <div className="border-t border-secondary/8 bg-background p-3">
              {error ? (
                <p role="alert" className="mb-2 px-1 text-xs text-destructive">
                  {error}
                </p>
              ) : null}
              <form onSubmit={sendMessage} className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  maxLength={1200}
                  placeholder="Ask ParcelFlow…"
                  aria-label="Your message"
                  className="h-11 min-w-0 flex-1 rounded-xl border border-secondary/12 bg-card px-3.5 text-sm text-secondary outline-none transition focus:border-brand-orange focus:ring-3 focus:ring-brand-orange/20 disabled:opacity-60"
                  disabled={isSending}
                />
                <button
                  type="submit"
                  disabled={isSending || !draft.trim()}
                  aria-label="Send message"
                  className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-orange text-brand-ink transition-[transform,filter] hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <Send aria-hidden="true" className="size-4" />
                </button>
              </form>
              <p className="mt-2 flex items-start gap-1.5 px-1 text-[10px] leading-relaxed text-secondary/50">
                <ShieldAlert
                  aria-hidden="true"
                  className="mt-0.5 size-3 shrink-0"
                />
                AI can make mistakes. Don’t share passwords, payment details, or
                verification codes.
              </p>
            </div>
          </motion.section>
        ) : null}
      </AnimatePresence>

      <button
        type="button"
        aria-label={isOpen ? "Close ParcelFlow chat" : "Chat with ParcelFlow"}
        aria-expanded={isOpen}
        aria-controls={isOpen ? "parcelflow-chat-panel" : undefined}
        onClick={() => setIsOpen((open) => !open)}
        className="fixed right-5 bottom-[5.25rem] z-50 grid size-12 place-items-center rounded-full bg-brand text-white shadow-lg ring-1 ring-white/15 transition-[transform,background-color] hover:-translate-y-1 hover:bg-brand-card focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange sm:right-8"
      >
        {isOpen ? (
          <X aria-hidden="true" className="size-5" />
        ) : (
          <MessageCircle
            aria-hidden="true"
            className="size-5 text-brand-orange"
            strokeWidth={2.25}
          />
        )}
      </button>
    </>
  );
}
