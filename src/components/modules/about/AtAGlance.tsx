"use client";

import { CheckCircle2, MapPin, PackageCheck, Truck } from "lucide-react";
import { motion, stagger, type Variants } from "motion/react";
import { EASE_OUT } from "@/components/modules/landing/motion";

const FACTS = [
  { label: "Coverage", value: "64 districts nationwide", icon: MapPin },
  { label: "Fleet & riders", value: "500+ active riders", icon: Truck },
  { label: "Parcels moved", value: "120k+ delivered", icon: PackageCheck },
  { label: "On-time rate", value: "99% of deliveries", icon: CheckCircle2 },
];

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

/** Hero aside: the company at a glance. */
export default function AtAGlance() {
  return (
    <div className="w-full max-w-md rounded-3xl bg-brand-card p-2 ring-1 ring-white/5 sm:p-3 lg:ml-auto">
      <motion.dl
        variants={list}
        initial="hidden"
        animate="visible"
        className="divide-y divide-white/5"
      >
        {FACTS.map(({ label, value, icon: Icon }) => (
          <motion.div
            key={label}
            variants={item}
            className="flex items-center gap-4 px-3 py-3.5 sm:px-4"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand text-brand-orange">
              <Icon aria-hidden className="size-5" strokeWidth={2.25} />
            </span>
            <div className="min-w-0 flex-1">
              <dt className="font-heading text-[15px] font-bold text-white">
                {label}
              </dt>
              <dd className="text-sm text-brand-muted">{value}</dd>
            </div>
          </motion.div>
        ))}
      </motion.dl>
    </div>
  );
}
