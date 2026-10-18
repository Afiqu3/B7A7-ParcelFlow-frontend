"use client";

import { ArrowUp } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const updateVisibility = () => setIsVisible(window.scrollY > 400);

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  if (!isVisible) return null;

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: shouldReduceMotion ? "auto" : "smooth",
        })
      }
      className="fixed right-5 bottom-5 z-50 grid size-12 place-items-center rounded-full bg-brand-orange text-brand-ink shadow-lg ring-1 ring-black/10 transition-[transform,background-color] hover:-translate-y-1 hover:bg-brand-orange-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange sm:right-8 sm:bottom-8"
    >
      <ArrowUp aria-hidden="true" className="size-5" strokeWidth={2.5} />
    </button>
  );
}
