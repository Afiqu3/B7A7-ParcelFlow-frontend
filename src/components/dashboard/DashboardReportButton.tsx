"use client";

import {
  AlertCircle,
  FileChartColumnIncreasing,
  LoaderCircle,
  Sparkles,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { adminStats, merchantStats, riderStats } from "@/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { UserRole } from "@/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function getDashboardStats(role: UserRole) {
  const response =
    role === "MERCHANT"
      ? await merchantStats()
      : role === "RIDER"
        ? await riderStats()
        : await adminStats();

  if (!response.success || !response.data) {
    throw new Error(
      "Could not load dashboard data. Please refresh and try again.",
    );
  }

  return response.data;
}

export default function DashboardReportButton({ role }: { role: UserRole }) {
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState("");
  const [error, setError] = useState("");
  const shouldReduceMotion = useReducedMotion();

  const generateReport = async () => {
    if (isGenerating) return;
    setOpen(true);
    setIsGenerating(true);
    setReport("");
    setError("");

    try {
      const stats = await getDashboardStats(role);
      const response = await fetch("/api/dashboard-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, stats }),
      });
      const result: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          isRecord(result) && typeof result.error === "string"
            ? result.error
            : "Could not generate your report. Please try again.";
        throw new Error(message);
      }

      if (!isRecord(result) || typeof result.report !== "string") {
        throw new Error("The report service returned an invalid response.");
      }

      setReport(result.report);
    } catch (generationError) {
      setError(
        generationError instanceof Error
          ? generationError.message
          : "Could not generate your report. Please try again.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={generateReport}
        aria-label="Generate AI dashboard report"
        title="Generate report"
        className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand px-2.5 font-heading text-xs font-bold text-white shadow-[0_10px_24px_-14px_var(--color-brand)] outline-none transition-[filter,transform] hover:-translate-y-0.5 hover:brightness-125 active:scale-95 focus-visible:ring-3 focus-visible:ring-brand-orange/50 sm:px-3"
      >
        <FileChartColumnIncreasing
          aria-hidden="true"
          className="size-4 text-brand-orange"
          strokeWidth={2.25}
        />
        <span className="hidden lg:inline">Generate Report</span>
      </button>

      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (!isGenerating) setOpen(nextOpen);
        }}
      >
        <DialogContent className="max-h-[min(85dvh,48rem)] overflow-hidden p-0 sm:max-w-2xl">
          <DialogHeader className="border-b border-secondary/8 bg-brand px-5 py-5 pr-12 text-white sm:px-7">
            <div className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                <Sparkles
                  aria-hidden="true"
                  className="size-5 text-brand-orange"
                />
              </span>
              <div>
                <DialogTitle className="font-heading text-lg font-extrabold text-white">
                  Dashboard report
                </DialogTitle>
                <DialogDescription className="mt-1 text-xs text-white/70">
                  AI-generated insights from your dashboard summary data.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="max-h-[calc(85dvh-7rem)] overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex min-h-44 flex-col items-center justify-center gap-3 text-center"
                >
                  <span className="grid size-12 place-items-center rounded-2xl bg-brand/8 text-brand">
                    <LoaderCircle
                      aria-hidden="true"
                      className={`size-6 text-brand-orange-ink ${
                        shouldReduceMotion ? "" : "animate-spin"
                      }`}
                    />
                  </span>
                  <output className="font-heading text-sm font-bold text-secondary">
                    Analyzing your dashboard data…
                  </output>
                  <p className="max-w-sm text-xs leading-relaxed text-secondary/60">
                    This may take a few moments while we securely prepare your
                    report.
                  </p>
                </motion.div>
              ) : error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex min-h-40 flex-col items-center justify-center gap-3 text-center"
                >
                  <span className="grid size-11 place-items-center rounded-2xl bg-destructive/10 text-destructive">
                    <AlertCircle aria-hidden="true" className="size-5" />
                  </span>
                  <p role="alert" className="max-w-md text-sm text-destructive">
                    {error}
                  </p>
                  <button
                    type="button"
                    onClick={generateReport}
                    className="rounded-xl bg-brand px-4 py-2 font-heading text-xs font-bold text-white outline-none transition hover:brightness-125 focus-visible:ring-3 focus-visible:ring-brand-orange/50"
                  >
                    Try again
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="report"
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="whitespace-pre-wrap text-sm leading-7 text-secondary"
                >
                  {report}
                </motion.div>
              )}
            </AnimatePresence>
            <p className="mt-6 border-t border-secondary/8 pt-3 text-[11px] leading-relaxed text-secondary/50">
              AI-generated analysis may be inaccurate. Verify important
              decisions against your dashboard.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
