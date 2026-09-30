"use client";

import { ArrowRight, Check, Download } from "lucide-react";
import { motion, stagger, type Variants } from "motion/react";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "./motion";

type StepState = "done" | "current" | "pending";

const TIMELINE: { label: string; state: StepState }[] = [
  { label: "Created", state: "done" },
  { label: "Pickup assigned", state: "done" },
  { label: "Picked up", state: "done" },
  { label: "At hub", state: "done" },
  { label: "Out for delivery", state: "current" },
  { label: "Delivered", state: "pending" },
];

const TAGS = ["Outside city", "Express", "Parcel · 2.5 kg"];

const listVariants: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: stagger(0.14, { startDelay: 0.9 }) },
  },
};

const stepVariants: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: EASE_OUT } },
};

const markerVariants: Variants = {
  hidden: { scale: 0 },
  visible: {
    scale: 1,
    transition: { type: "spring", stiffness: 500, damping: 22 },
  },
};

const connectorVariants: Variants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: { duration: 0.3, ease: "easeOut", delay: 0.1 },
  },
};

function connectorColor(next: StepState | undefined) {
  if (next === "done") return "bg-brand";
  if (next === "current") return "bg-gradient-to-b from-brand to-brand-orange";
  return "bg-secondary/12";
}

/** Mock parcel-tracking card shown in the hero. Purely illustrative. */
export default function TrackingCard() {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 40, rotate: 2 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.25 }}
    >
      {/* Orange card peeking out behind */}
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-[1.75rem] bg-linear-to-b from-[#F0662D] to-[#C4532A]"
        initial={{ x: 0, y: 0 }}
        animate={{ x: 14, y: 14 }}
        transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.75 }}
      />

      {/* Gentle idle float */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration: 6,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
          delay: 1.6,
        }}
        className="relative rounded-[1.75rem] bg-white p-5 text-secondary shadow-[0_30px_60px_-20px_rgba(2,6,23,0.55)] sm:p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
          <div>
            <p className="font-heading text-[11px] font-bold uppercase tracking-[0.16em] text-secondary/60">
              Tracking ID
            </p>
            <p className="mt-1 font-mono text-[17px] font-semibold tracking-tight sm:text-xl">
              PF-20260925-7A3F1C
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-brand-orange/12 px-3 py-1 font-heading text-xs font-bold text-brand-orange-ink">
            Out for delivery
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-accent px-4 py-3">
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-secondary/60">From</p>
            <p className="font-heading text-[13px] font-bold sm:text-sm">
              Mirpur, Dhaka
            </p>
          </div>
          <motion.span
            aria-hidden
            className="shrink-0 text-brand-orange-ink"
            animate={{ x: [0, 4, 0] }}
            transition={{
              duration: 1.6,
              ease: "easeInOut",
              repeat: Number.POSITIVE_INFINITY,
            }}
          >
            <ArrowRight className="size-5" strokeWidth={2.5} />
          </motion.span>
          <div className="min-w-0 text-right">
            <p className="text-[11px] font-medium text-secondary/60">To</p>
            <p className="font-heading text-[13px] font-bold sm:text-sm">
              Agrabad, Chattogram
            </p>
          </div>
        </div>

        <ul className="mt-3 flex flex-wrap gap-2">
          {TAGS.map((tag) => (
            <li
              key={tag}
              className="rounded-lg bg-brand/[0.07] px-2.5 py-1 font-heading text-xs font-semibold text-secondary"
            >
              {tag}
            </li>
          ))}
        </ul>

        <motion.ol
          className="mt-4"
          aria-label="Parcel status"
          variants={listVariants}
          initial="hidden"
          animate="visible"
        >
          {TIMELINE.map((step, i) => {
            const next = TIMELINE[i + 1]?.state;
            return (
              <motion.li
                key={step.label}
                variants={stepVariants}
                className="relative flex items-center gap-3 pb-3 last:pb-0"
              >
                {next !== undefined && (
                  <motion.span
                    aria-hidden
                    variants={connectorVariants}
                    className={cn(
                      "absolute top-4.5 left-2 h-[calc(100%-18px)] w-0.5 origin-top",
                      connectorColor(next),
                    )}
                  />
                )}

                <motion.span
                  variants={markerVariants}
                  className="relative grid size-4.5 shrink-0 place-items-center"
                >
                  {step.state === "done" && (
                    <span className="grid size-full place-items-center rounded-full bg-brand">
                      <Check className="size-3 text-white" strokeWidth={3.5} />
                    </span>
                  )}
                  {step.state === "current" && (
                    <>
                      <span className="absolute inset-0 rounded-full bg-brand-orange motion-safe:animate-pulse-ring" />
                      <span className="relative grid size-full place-items-center rounded-full bg-brand-orange ring-4 ring-brand-orange/20">
                        <span className="size-1.5 rounded-full bg-brand-ink" />
                      </span>
                    </>
                  )}
                  {step.state === "pending" && (
                    <span className="size-full rounded-full border-2 border-secondary/15 bg-white" />
                  )}
                </motion.span>

                <span
                  className={cn(
                    "font-heading text-sm",
                    step.state === "done" && "font-semibold text-secondary",
                    step.state === "current" &&
                      "font-bold text-brand-orange-ink",
                    step.state === "pending" && "font-medium text-secondary/55",
                  )}
                >
                  {step.label}
                  {step.state === "current" && (
                    <span className="sr-only"> (current status)</span>
                  )}
                </span>
              </motion.li>
            );
          })}
        </motion.ol>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-secondary/10 pt-4 font-heading text-sm">
          <span className="flex items-center gap-2 font-semibold">
            <span className="size-2 rounded-full bg-emerald-700" />
            Paid via bKash
          </span>
          <span className="flex items-center gap-1.5 font-bold text-brand-orange-ink">
            Invoice PDF
            <Download className="size-4" strokeWidth={2.5} />
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
