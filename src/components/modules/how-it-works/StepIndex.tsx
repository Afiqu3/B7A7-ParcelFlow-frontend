"use client";

import { ArrowDown } from "lucide-react";
import { motion, stagger, type Variants } from "motion/react";
import { EASE_OUT } from "@/components/modules/landing/motion";
import { scrollToSection } from "@/lib/scroll";
import { MERCHANT_STEPS } from "./steps";

const list: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: stagger(0.08, { startDelay: 0.35 }) },
  },
};

const item: Variants = {
  hidden: { opacity: 0, x: 16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};

/** Hero aside: the four steps as jump links into the timeline. */
export default function StepIndex() {
  return (
    <nav
      aria-label="Jump to a step"
      className="w-full max-w-md rounded-3xl bg-brand-card p-2 ring-1 ring-white/5 sm:p-3 lg:ml-auto"
    >
      <motion.ol
        variants={list}
        initial="hidden"
        animate="visible"
        className="divide-y divide-white/5"
      >
        {MERCHANT_STEPS.map((step, index) => (
          <motion.li key={step.id} variants={item}>
            <a
              href={`#${step.id}`}
              onClick={(event) => {
                event.preventDefault();
                scrollToSection(step.id);
              }}
              className="group flex items-center gap-4 rounded-2xl px-3 py-3.5 outline-none transition-colors hover:bg-white/5 focus-visible:ring-3 focus-visible:ring-brand-orange/50 sm:px-4"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand font-heading text-base font-bold text-brand-orange transition-transform duration-300 group-hover:-rotate-6">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-heading text-[15px] font-bold text-white">
                  {step.title}
                </span>
                <span className="block text-sm text-brand-muted">
                  {step.short}
                </span>
              </span>
              <ArrowDown
                aria-hidden
                className="size-4 shrink-0 text-brand-muted transition-[color,translate] duration-200 group-hover:translate-y-0.5 group-hover:text-white"
                strokeWidth={2.5}
              />
            </a>
          </motion.li>
        ))}
      </motion.ol>
    </nav>
  );
}
