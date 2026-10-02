"use client";

import { Inbox, RefreshCw, TriangleAlert } from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { EASE_OUT } from "@/components/modules/landing/motion";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Placeholder cards with the same footprint as the real rate cards. */
export function RateCardsSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="grid gap-4 lg:grid-cols-3 lg:gap-5"
    >
      <span className="sr-only">Loading rates…</span>
      {["inside", "sub", "outside"].map((key) => (
        <div
          key={key}
          aria-hidden
          className="flex flex-col rounded-3xl bg-white p-6 ring-1 ring-secondary/5 sm:p-7 md:p-6 lg:p-7"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <Skeleton className="h-6 w-32 bg-secondary/8" />
              <Skeleton className="mt-3 h-4 w-48 max-w-full bg-secondary/6" />
            </div>
            <Skeleton className="size-11 rounded-full bg-secondary/8" />
          </div>
          <Skeleton className="mt-8 h-12 w-28 bg-secondary/8" />
          <Skeleton className="mt-3 h-4 w-36 bg-secondary/6" />
          <div className="mt-6 flex flex-col gap-4 border-t border-secondary/8 pt-4">
            {[0, 1, 2, 3, 4].map((row) => (
              <div key={row} className="flex justify-between gap-4">
                <Skeleton className="h-4 w-28 bg-secondary/6" />
                <Skeleton className="h-4 w-12 bg-secondary/6" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function StateCard({
  icon: Icon,
  title,
  body,
  tone,
  children,
}: {
  icon: typeof Inbox;
  title: string;
  body: string;
  tone: "error" | "neutral";
  children?: ReactNode;
}) {
  return (
    <motion.div
      role={tone === "error" ? "alert" : "status"}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE_OUT }}
      className="mx-auto flex max-w-lg flex-col items-center rounded-3xl bg-white px-6 py-12 text-center text-secondary ring-1 ring-secondary/5 sm:px-10"
    >
      <span
        className={cn(
          "grid size-12 place-items-center rounded-2xl",
          tone === "error"
            ? "bg-destructive/10 text-destructive"
            : "bg-brand text-brand-orange",
        )}
      >
        <Icon className="size-6" strokeWidth={2.25} />
      </span>
      <h3 className="mt-5 font-heading text-xl font-bold tracking-tight">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-secondary/65">{body}</p>
      {children}
    </motion.div>
  );
}

export function PricingError({
  onRetry,
  retrying,
}: {
  onRetry: () => void;
  retrying: boolean;
}) {
  return (
    <StateCard
      icon={TriangleAlert}
      tone="error"
      title="We couldn’t load our rates"
      body="Check your connection and try again. If it keeps happening, our support team can share the price list."
    >
      <button
        type="button"
        onClick={onRetry}
        disabled={retrying}
        className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 font-heading text-sm font-bold text-white outline-none transition-colors hover:bg-brand-ink focus-visible:ring-4 focus-visible:ring-brand/30 disabled:opacity-60"
      >
        <RefreshCw
          className={cn("size-4", retrying && "motion-safe:animate-spin")}
          strokeWidth={2.5}
        />
        {retrying ? "Retrying…" : "Try again"}
      </button>
    </StateCard>
  );
}

export function PricingEmpty() {
  return (
    <StateCard
      icon={Inbox}
      tone="neutral"
      title="Rates are on their way"
      body="We’re updating our price list right now. Check back shortly, or create an account to see prices when you book."
    />
  );
}
