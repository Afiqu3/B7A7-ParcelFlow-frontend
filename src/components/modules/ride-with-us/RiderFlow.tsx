"use client";

import {
  HandCoins,
  type LucideIcon,
  MapPin,
  Motorbike,
  Package,
} from "lucide-react";
import { motion, type Variants } from "motion/react";
import { Container, Eyebrow } from "@/components/modules/landing/decor";
import {
  EASE_OUT,
  Reveal,
  RevealGroup,
  RevealItem,
} from "@/components/modules/landing/motion";

const FLOW: { title: string; body: string; icon: LucideIcon }[] = [
  {
    title: "Get assigned",
    body: "Pickups and deliveries in your area are assigned to you.",
    icon: MapPin,
  },
  {
    title: "Pick up",
    body: "Collect parcels from merchants and bring them to the hub.",
    icon: Package,
  },
  {
    title: "Deliver",
    body: "Take each parcel out for delivery, straight to the customer’s door.",
    icon: Motorbike,
  },
  {
    title: "Collect & confirm",
    body: "Collect cash on delivery when there is any, then mark it delivered.",
    icon: HandCoins,
  },
];

// Draws the dashed connector across the steps once the group is in view.
const connector: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 1.1, ease: EASE_OUT, delay: 0.15 },
  },
};

export default function RiderFlow() {
  return (
    <section
      aria-labelledby="rider-flow-heading"
      className="bg-accent py-20 sm:py-24 lg:py-28"
    >
      <Container>
        <Reveal>
          <Eyebrow>On the road</Eyebrow>
          <h2
            id="rider-flow-heading"
            className="mt-4 max-w-lg font-heading text-4xl leading-[1.02] font-bold tracking-[-0.04em] text-secondary sm:text-5xl"
          >
            A delivery, start to finish.
          </h2>
        </Reveal>

        <RevealGroup
          className="relative mt-12 grid gap-10 sm:grid-cols-2 sm:gap-x-8 lg:mt-14 lg:grid-cols-4 lg:gap-8"
          interval={0.12}
        >
          {/* Runs from the first icon's centre to the last one's (lg only).
              Icons are 3.5rem wide and left-aligned in 4 columns with a
              2rem gap, so the last centre is 25% - 1.5rem - 1.75rem from
              the right edge. */}
          <motion.span
            aria-hidden
            variants={connector}
            className="absolute top-7 right-[calc(25%-3.25rem)] left-7 hidden origin-left border-t-2 border-dashed border-secondary/20 lg:block"
          />
          {FLOW.map(({ title, body, icon: Icon }, index) => (
            <RevealItem key={title}>
              {/* Icon beside the text on phones, above it from sm up. */}
              <div className="group flex gap-5 sm:block">
                <span className="relative z-10 grid size-14 shrink-0 place-items-center rounded-2xl bg-brand text-brand-orange shadow-[0_16px_32px_-18px_rgba(15,32,86,0.8)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:-rotate-6">
                  <Icon className="size-6" strokeWidth={2} />
                </span>
                <div className="sm:mt-6">
                  <p className="font-heading text-xs font-bold tracking-[0.2em] text-brand-orange-ink uppercase">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-1.5 font-heading text-xl font-bold tracking-tight text-secondary sm:mt-2">
                    {title}
                  </h3>
                  <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-secondary/70">
                    {body}
                  </p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.2}>
          <p className="mt-12 max-w-xl rounded-2xl bg-white px-5 py-4 text-[15px] leading-relaxed text-secondary/75 ring-1 ring-secondary/5">
            <span className="font-heading font-bold text-secondary">
              Nobody home?
            </span>{" "}
            The parcel is re-attempted, up to 3 tries before it goes back to the
            merchant.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
