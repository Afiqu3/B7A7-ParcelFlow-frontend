"use client";

import { Check } from "lucide-react";
import { motion, stagger, type Variants } from "motion/react";
import { Container, Eyebrow } from "@/components/modules/landing/decor";
import { EASE_OUT, Reveal } from "@/components/modules/landing/motion";

const REQUIREMENTS = [
  "National ID (NID)",
  "Driving license",
  "Vehicle papers",
  "A bike, bicycle or van",
];

const APPLY_STEPS = [
  { title: "Apply online", body: "Details, NID, license and vehicle papers." },
  {
    title: "Verify your email",
    body: "Enter the code we send within an hour.",
  },
  { title: "Get approved", body: "We email you as soon as you’re reviewed." },
];

const list: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: stagger(0.1, { startDelay: 0.1 }) },
  },
};

const row: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE_OUT } },
};

// The tick pops in just after its row arrives.
const tick: Variants = {
  hidden: { scale: 0 },
  visible: {
    scale: 1,
    transition: { type: "spring", stiffness: 500, damping: 20, delay: 0.15 },
  },
};

const rail: Variants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: { duration: 0.5, ease: EASE_OUT, delay: 0.25 },
  },
};

/** What riders need, and the three steps to apply. */
export default function RiderJoin() {
  return (
    <section
      aria-labelledby="rider-join-heading"
      className="bg-white py-20 sm:py-24"
    >
      <Container className="grid gap-14 lg:grid-cols-2 lg:gap-16">
        <div>
          <Reveal>
            <Eyebrow>Before you apply</Eyebrow>
            <h2
              id="rider-join-heading"
              className="mt-4 font-heading text-4xl leading-[1.02] font-bold tracking-[-0.04em] text-secondary sm:text-5xl"
            >
              What you need.
            </h2>
          </Reveal>

          <motion.ul
            variants={list}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="mt-10 divide-y divide-secondary/8 border-y border-secondary/8"
          >
            {REQUIREMENTS.map((item) => (
              <motion.li
                key={item}
                variants={row}
                className="flex items-center gap-4 py-4 font-heading text-lg font-semibold text-secondary"
              >
                <motion.span
                  variants={tick}
                  className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-orange"
                >
                  <Check
                    aria-hidden
                    className="size-4 text-brand-ink"
                    strokeWidth={3.5}
                  />
                </motion.span>
                {item}
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <div>
          <Reveal delay={0.1}>
            <Eyebrow>How to apply</Eyebrow>
            <h2 className="mt-4 font-heading text-4xl leading-[1.02] font-bold tracking-[-0.04em] text-secondary sm:text-5xl">
              Three steps to start.
            </h2>
          </Reveal>

          <motion.ol
            variants={list}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="mt-10"
          >
            {APPLY_STEPS.map((step, index) => (
              <motion.li
                key={step.title}
                variants={row}
                className="relative flex gap-5 pb-8 last:pb-0"
              >
                {/* Joins this number to the next one, drawn downward. */}
                {index < APPLY_STEPS.length - 1 ? (
                  <motion.span
                    aria-hidden
                    variants={rail}
                    className="absolute top-10 bottom-0 left-5 w-0.5 -translate-x-1/2 origin-top bg-brand-orange/40"
                  />
                ) : null}
                <span className="relative z-10 grid size-10 shrink-0 place-items-center rounded-xl bg-brand font-heading text-base font-bold text-brand-orange">
                  {index + 1}
                </span>
                <div className="pt-1.5">
                  <h3 className="font-heading text-lg font-bold text-secondary">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-secondary/70">
                    {step.body}
                  </p>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </Container>
    </section>
  );
}
