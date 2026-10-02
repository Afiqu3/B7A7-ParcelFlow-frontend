"use client";

import { MapPin, Package } from "lucide-react";
import { motion } from "motion/react";
import { RoutePath } from "@/components/modules/landing/decor";
import { EASE_OUT } from "@/components/modules/landing/motion";
import { formatTaka, lowestBaseCharge } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import type { PricingRule, ZoneType } from "@/types";
import { ZONES } from "./pricing-meta";

// Geometry in the 400×400 viewBox. Rings grow outward from the pickup point.
const CENTER = 200;
const RINGS: {
  zone: ZoneType;
  r: number;
  fill: string;
  spin: string;
}[] = [
  {
    zone: "OUTSIDE_CITY",
    r: 176,
    fill: "fill-brand-deep/70",
    spin: "motion-safe:animate-[spin_90s_linear_infinite]",
  },
  {
    zone: "SUB_CITY",
    r: 122,
    fill: "fill-brand-card",
    spin: "motion-safe:animate-[spin_70s_linear_infinite_reverse]",
  },
  {
    zone: "INSIDE_CITY",
    r: 68,
    fill: "fill-brand-line/45",
    spin: "motion-safe:animate-[spin_50s_linear_infinite]",
  },
];

// Inner ring appears first, like a ripple moving outward.
const ringDelay = (index: number) => 0.2 + (RINGS.length - 1 - index) * 0.14;

/** Hero illustration: delivery zones as rings around the pickup point. */
export default function ZoneRings({ rules }: { rules?: PricingRule[] }) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[21rem] sm:max-w-sm lg:mr-0 lg:max-w-[26rem]">
      <svg
        viewBox="0 0 400 400"
        aria-hidden="true"
        className="absolute inset-0 size-full overflow-visible"
      >
        {RINGS.map((ring, index) => (
          <motion.g
            key={ring.zone}
            initial={{ scale: 0.55, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.8,
              ease: EASE_OUT,
              delay: ringDelay(index),
            }}
          >
            <circle cx={CENTER} cy={CENTER} r={ring.r} className={ring.fill} />
            {/* Dashed outline turns slowly, on its own element so it doesn't
                fight the entrance scale. */}
            <circle
              cx={CENTER}
              cy={CENTER}
              r={ring.r}
              fill="none"
              strokeWidth={1.5}
              strokeDasharray="3 7"
              strokeLinecap="round"
              className={cn(
                "origin-center stroke-brand-line transform-fill",
                ring.spin,
              )}
            />
          </motion.g>
        ))}

        <motion.g
          className="text-brand-orange"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <RoutePath d="M200 200 C 236 236, 262 300, 336 318" />
        </motion.g>
      </svg>

      {/* Pickup point */}
      <motion.span
        aria-hidden
        className="absolute top-1/2 left-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl bg-brand-orange text-brand-ink shadow-[0_12px_32px_-10px_var(--color-brand-orange)]"
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 380,
          damping: 18,
          delay: 0.15,
        }}
      >
        <Package className="size-6" strokeWidth={2.25} />
      </motion.span>

      {/* Drop-off pin at the end of the route */}
      <motion.span
        aria-hidden
        className="absolute top-[79.5%] left-[84%] -translate-x-1/2 -translate-y-full text-white"
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 420,
          damping: 16,
          delay: 1.25,
        }}
      >
        <MapPin
          className="size-8 fill-brand-orange stroke-brand-ink"
          strokeWidth={1.75}
        />
      </motion.span>

      {/* Zone labels sit on top of each ring */}
      <ul className="absolute inset-0">
        {RINGS.map((ring, index) => {
          const from = rules ? lowestBaseCharge(rules, ring.zone) : undefined;
          return (
            <motion.li
              key={ring.zone}
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ top: `${((CENTER - ring.r) / 400) * 100}%` }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: EASE_OUT,
                delay: ringDelay(index) + 0.45,
              }}
            >
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-brand px-3 py-1.5 font-heading text-xs font-semibold text-white ring-1 ring-brand-line sm:text-[13px]">
                {ZONES[ring.zone].label}
                {from === null ? null : (
                  <>
                    <span aria-hidden className="text-brand-muted">
                      ·
                    </span>
                    {from === undefined ? (
                      <span className="h-3 w-12 animate-pulse rounded-full bg-white/15" />
                    ) : (
                      <span className="text-brand-orange">
                        from {formatTaka(from)}
                      </span>
                    )}
                  </>
                )}
              </span>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
