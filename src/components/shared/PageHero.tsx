"use client";

import { motion, stagger, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { Container, PulseDot } from "@/components/modules/landing/decor";
import { EASE_OUT } from "@/components/modules/landing/motion";
import { cn } from "@/lib/utils";

export type HeadlineLine = { text: string; accent?: boolean };

type PageHeroProps = {
  /** Id for the <h1>, used as the section's accessible name. */
  headingId: string;
  eyebrow: string;
  lines: HeadlineLine[];
  description: ReactNode;
  actions?: ReactNode;
  /** Optional right-hand column on large screens (below on mobile). */
  aside?: ReactNode;
  /** `navy` for merchant pages, `orange` for rider pages. */
  tone?: "navy" | "orange";
};

const container: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: stagger(0.09, { startDelay: 0.05 }) },
  },
};

const fade: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT } },
};

// Headline lines slide up from behind a mask, like the landing hero.
const line: Variants = {
  hidden: { y: "105%" },
  visible: { y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};

/** Top section shared by the marketing sub-pages. */
export default function PageHero({
  headingId,
  eyebrow,
  lines,
  description,
  actions,
  aside,
  tone = "navy",
}: PageHeroProps) {
  const orange = tone === "orange";

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative overflow-hidden",
        orange ? "bg-brand-orange text-brand-ink" : "bg-brand text-white",
      )}
    >
      <Container
        className={cn(
          "grid items-center gap-12 pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pb-24",
          aside && "lg:grid-cols-[1.1fr_1fr] lg:gap-10",
        )}
      >
        <motion.div
          className="relative z-10"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            variants={fade}
            className={cn(
              "inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5 font-heading text-[13px] font-semibold ring-1",
              orange
                ? "bg-brand-ink text-brand-cream ring-brand-ink"
                : "bg-brand-card text-brand-cream ring-white/5",
            )}
          >
            <PulseDot />
            {eyebrow}
          </motion.p>

          <h1
            id={headingId}
            // Steps down at lg, where the text shares the row with the aside.
            className="mt-6 font-heading text-[3.1rem] leading-[0.92] font-bold tracking-tighter sm:text-7xl lg:text-[4.25rem] xl:text-[4.9rem]"
          >
            {lines.map((l) => (
              <span
                key={l.text}
                className="mb-[-0.08em] block overflow-hidden pb-[0.08em]"
              >
                <motion.span
                  variants={line}
                  className={cn(
                    "block",
                    // White on orange is too low-contrast, so rider pages
                    // keep every line ink.
                    l.accent && !orange && "text-brand-orange",
                  )}
                >
                  {l.text}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div
            variants={fade}
            className={cn(
              "mt-7 max-w-120 text-[17px] leading-relaxed",
              orange ? "text-brand-ink/85" : "text-brand-muted",
            )}
          >
            {description}
          </motion.div>

          {actions ? (
            <motion.div
              variants={fade}
              className="mt-8 flex flex-col gap-x-7 gap-y-4 sm:flex-row sm:flex-wrap sm:items-center"
            >
              {actions}
            </motion.div>
          ) : null}
        </motion.div>

        {aside ? <div className="relative z-10">{aside}</div> : null}
      </Container>
    </section>
  );
}
