"use client";

import { Bike, type LucideIcon, Motorbike, Truck } from "lucide-react";
import { motion, stagger, type Variants } from "motion/react";
import { EASE_OUT } from "@/components/modules/landing/motion";

const VEHICLES: { label: string; icon: LucideIcon }[] = [
  { label: "Bike", icon: Motorbike },
  { label: "Bicycle", icon: Bike },
  { label: "Van", icon: Truck },
];

const list: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: stagger(0.1, { startDelay: 0.3 }) },
  },
};

const tile: Variants = {
  hidden: { opacity: 0, y: 32, rotate: -4 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { type: "spring", stiffness: 260, damping: 22 },
  },
};

const caption: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: EASE_OUT } },
};

/** Hero aside on the rider page: the vehicles riders can use. */
export default function VehicleTiles() {
  return (
    <motion.div
      variants={list}
      initial="hidden"
      animate="visible"
      className="w-full max-w-md lg:ml-auto"
    >
      <ul className="grid grid-cols-3 gap-3 sm:gap-4">
        {VEHICLES.map(({ label, icon: Icon }) => (
          <motion.li key={label} variants={tile}>
            <div className="group flex aspect-6/7 flex-col justify-between rounded-3xl bg-brand-ink p-4 transition-transform duration-300 hover:-translate-y-1.5 hover:-rotate-1 sm:p-6">
              <Icon
                aria-hidden
                className="size-9 text-brand-orange transition-transform duration-500 ease-out group-hover:translate-x-2 sm:size-11"
                strokeWidth={1.75}
              />
              <p className="font-heading text-lg font-bold text-white sm:text-2xl">
                {label}
              </p>
            </div>
          </motion.li>
        ))}
      </ul>
      <motion.p
        variants={caption}
        className="mt-4 font-heading text-sm font-semibold text-brand-ink/75 lg:text-right"
      >
        Ride what you have: a bike, bicycle or van.
      </motion.p>
    </motion.div>
  );
}
