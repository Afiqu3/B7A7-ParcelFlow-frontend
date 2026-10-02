"use client";

import { Check } from "lucide-react";
import { motion, stagger, type Variants } from "motion/react";
import { EASE_OUT } from "@/components/modules/landing/motion";
import { cn } from "@/lib/utils";

// Same statuses as the tracking card on the landing page.
const STATUSES = [
  "Created",
  "Pickup assigned",
  "Picked up",
  "At hub",
  "Out for delivery",
  "Delivered",
];

const list: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: stagger(0.14, { startDelay: 0.15 }) },
  },
};

// Each status "fills in" left to right, like a progress bar.
const fill: Variants = {
  hidden: { clipPath: "inset(0 100% 0 0 round 0.75rem)" },
  visible: {
    clipPath: "inset(0 0% 0 0 round 0.75rem)",
    transition: { duration: 0.45, ease: EASE_OUT },
  },
};

function Face({
  label,
  index,
  state,
}: {
  label: string;
  index: number;
  state: "pending" | "done" | "final";
}) {
  return (
    <span
      className={cn(
        "flex h-full items-center gap-2 rounded-xl px-3 py-2.5 font-heading text-[13px] font-semibold",
        state === "pending" &&
          "bg-white text-secondary/45 ring-1 ring-secondary/10 ring-inset",
        state === "done" && "bg-brand text-white",
        state === "final" && "bg-brand-orange text-brand-ink",
      )}
    >
      <span
        className={cn(
          "grid size-5 shrink-0 place-items-center rounded-full text-[11px]",
          state === "pending" ? "bg-secondary/8" : "bg-white/15",
          state === "final" && "bg-brand-ink/15",
        )}
      >
        {state === "pending" ? (
          index + 1
        ) : (
          <Check className="size-3" strokeWidth={3.5} />
        )}
      </span>
      {label}
    </span>
  );
}

/** Parcel statuses lighting up in order as they scroll into view. */
export default function StatusTrail() {
  return (
    <motion.ol
      aria-label="Parcel statuses, in order"
      variants={list}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
      className="grid grid-cols-2 gap-2 sm:grid-cols-3"
    >
      {STATUSES.map((status, index) => {
        const isLast = index === STATUSES.length - 1;
        return (
          <li key={status} className="relative">
            <Face label={status} index={index} state="pending" />
            <motion.span
              aria-hidden
              variants={fill}
              className="absolute inset-0"
            >
              <Face
                label={status}
                index={index}
                state={isLast ? "final" : "done"}
              />
            </motion.span>
          </li>
        );
      })}
    </motion.ol>
  );
}
