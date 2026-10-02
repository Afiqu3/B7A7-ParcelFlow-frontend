"use client";

import {
  motion,
  useInView,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef } from "react";
import { formatTaka } from "@/lib/pricing";
import { cn } from "@/lib/utils";

type AnimatedNumberProps = {
  value: number;
  /** Formats the in-between values. Defaults to taka. */
  format?: (value: number, decimals: number) => string;
  /** Count up from 0 the first time the number scrolls into view. */
  countUp?: boolean;
  className?: string;
};

/**
 * A number that springs to its new value whenever it changes. Screen
 * readers get the final value only; reduced motion skips the animation.
 */
export default function AnimatedNumber({
  value,
  format = formatTaka,
  countUp = false,
  className,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotion();

  // Over-damped, so it settles without overshooting the real price.
  const spring = useSpring(countUp ? 0 : value, {
    stiffness: 120,
    damping: 20,
    mass: 0.6,
  });
  const decimals = Number.isInteger(value) ? 0 : 2;
  const text = useTransform(spring, (latest) => format(latest, decimals));

  useEffect(() => {
    if (countUp && !inView) return;
    if (reduceMotion) spring.jump(value);
    else spring.set(value);
  }, [countUp, inView, reduceMotion, spring, value]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      <motion.span aria-hidden>{text}</motion.span>
      <span className="sr-only">{format(value, decimals)}</span>
    </span>
  );
}
