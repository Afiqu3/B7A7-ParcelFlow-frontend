"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { RadioGroup } from "radix-ui";
import { type ReactNode, useId } from "react";
import { cn } from "@/lib/utils";

export type SegmentOption<T extends string> = {
  value: T;
  label: ReactNode;
  /** Small second line, e.g. a price or delivery time. */
  hint?: ReactNode;
  icon?: LucideIcon;
};

type SegmentedControlProps<T extends string> = {
  value: T;
  onValueChange: (value: T) => void;
  options: SegmentOption<T>[];
  /** `light` sits on cream/white backgrounds, `dark` on navy. */
  tone?: "light" | "dark";
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
};

/**
 * Single-choice pill switch. Built on Radix RadioGroup, so arrow keys move
 * the selection and screen readers announce it as a radio group. The
 * highlight slides between options with a shared layout animation.
 */
export default function SegmentedControl<T extends string>({
  value,
  onValueChange,
  options,
  tone = "light",
  className,
  ...aria
}: SegmentedControlProps<T>) {
  const highlightId = useId();
  const dark = tone === "dark";

  return (
    <RadioGroup.Root
      value={value}
      onValueChange={(next) => onValueChange(next as T)}
      className={cn(
        "grid auto-cols-fr grid-flow-col gap-1 rounded-2xl p-1 ring-1",
        dark ? "bg-brand-deep/70 ring-white/5" : "bg-white ring-secondary/10",
        className,
      )}
      {...aria}
    >
      {options.map((option) => {
        const selected = option.value === value;
        const Icon = option.icon;

        return (
          <RadioGroup.Item
            key={option.value}
            value={option.value}
            className={cn(
              "relative isolate flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-2 text-center font-heading text-[13px] leading-tight font-bold outline-none transition-colors duration-200 focus-visible:ring-3 sm:px-3 sm:text-sm",
              dark
                ? "focus-visible:ring-brand-orange/50"
                : "focus-visible:ring-brand-orange/40",
              selected
                ? dark
                  ? "text-brand-ink"
                  : "text-white"
                : dark
                  ? "text-brand-muted hover:text-white"
                  : "text-secondary/65 hover:text-secondary",
            )}
          >
            {selected ? (
              <motion.span
                layoutId={highlightId}
                aria-hidden
                className={cn(
                  "absolute inset-0 -z-10 rounded-xl",
                  dark
                    ? "bg-brand-orange shadow-[0_10px_24px_-12px_var(--color-brand-orange)]"
                    : "bg-brand shadow-[0_10px_24px_-14px_rgba(15,32,86,0.8)]",
                )}
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            ) : null}
            <span className="inline-flex items-center gap-1.5">
              {Icon ? (
                <Icon className="size-4 shrink-0" strokeWidth={2.25} />
              ) : null}
              {option.label}
            </span>
            {option.hint ? (
              <span
                className={cn(
                  "text-[11px] font-semibold transition-colors sm:text-xs",
                  selected
                    ? dark
                      ? "text-brand-ink/75"
                      : "text-brand-orange"
                    : dark
                      ? "text-brand-muted/70"
                      : "text-secondary/50",
                )}
              >
                {option.hint}
              </span>
            ) : null}
          </RadioGroup.Item>
        );
      })}
    </RadioGroup.Root>
  );
}
