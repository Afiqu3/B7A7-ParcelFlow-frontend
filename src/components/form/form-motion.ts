"use client";

import {
  stagger,
  useAnimate,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { EASE_OUT } from "@/components/modules/landing/motion";

// Shared motion presets for the auth forms (login, register) so they move the
// same way. Wrap a form in <MotionConfig reducedMotion="user"> to honour the
// OS "reduce motion" setting.

export { EASE_OUT };

// Parent: staggers each child's entrance.
export const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: stagger(0.05, { startDelay: 0.1 }) },
  },
};

// Children: fade + rise into place.
export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE_OUT },
  },
};

// Field errors: expand/collapse. Field uses `gap-2` (8px), so the negative
// margin cancels that gap while collapsed to avoid a layout jump.
export const errorMotion = {
  initial: { opacity: 0, height: 0, marginTop: -8 },
  animate: { opacity: 1, height: "auto", marginTop: 0 },
  exit: { opacity: 0, height: 0, marginTop: -8 },
  transition: { duration: 0.2, ease: EASE_OUT },
} as const;

// Submit button label: slides up when switching idle <-> pending.
export const labelSwapMotion = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -14 },
  transition: { duration: 0.2, ease: EASE_OUT },
} as const;

// Small icon swaps, e.g. the show/hide password eye.
export const iconSwapMotion = {
  initial: { opacity: 0, scale: 0.6, rotate: -45 },
  animate: { opacity: 1, scale: 1, rotate: 0 },
  exit: { opacity: 0, scale: 0.6, rotate: 45 },
  transition: { duration: 0.15 },
} as const;

/** Small horizontal shake to signal a failed attempt. Skipped for reduced motion. */
export function useShake<T extends Element>() {
  const [scope, animate] = useAnimate<T>();
  const shouldReduceMotion = useReducedMotion();

  const shake = () => {
    if (shouldReduceMotion || !scope.current) return;
    animate(
      scope.current,
      { x: [0, -8, 8, -5, 5, -2, 0] },
      { duration: 0.4, ease: "easeInOut" },
    );
  };

  return [scope, shake] as const;
}
