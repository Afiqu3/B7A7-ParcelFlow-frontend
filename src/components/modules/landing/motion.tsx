"use client";

import { MotionConfig, motion, stagger, type Variants } from "motion/react";
import type { ReactNode } from "react";

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Respects the OS "reduce motion" setting for everything below it. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

// `custom` carries an optional delay. It's left out of the transition when
// unset, so a parent's stagger timing isn't overridden.
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay?: number) => ({
    opacity: 1,
    y: 0,
    transition: delay
      ? { duration: 0.6, ease: EASE_OUT, delay }
      : { duration: 0.6, ease: EASE_OUT },
  }),
};

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Fraction of the element that must be visible before it animates. */
  amount?: number;
};

/** Fades and lifts a block into place the first time it scrolls into view. */
export function Reveal({
  children,
  className,
  delay,
  amount = 0.3,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={fadeUp}
      custom={delay}
    >
      {children}
    </motion.div>
  );
}

type RevealGroupProps = RevealProps & { interval?: number };

/** Staggers its `RevealItem` children as the group scrolls into view. */
export function RevealGroup({
  children,
  className,
  delay = 0,
  amount = 0.2,
  interval = 0.08,
}: RevealGroupProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: stagger(interval, { startDelay: delay }),
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
  variants = fadeUp,
}: {
  children: ReactNode;
  className?: string;
  variants?: Variants;
}) {
  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}
