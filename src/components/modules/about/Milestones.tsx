"use client";

import { motion, stagger, type Variants } from "motion/react";
import { Container, Eyebrow } from "@/components/modules/landing/decor";
import { EASE_OUT, Reveal } from "@/components/modules/landing/motion";

const MILESTONES = [
  {
    year: "2022",
    title: "The first route",
    body: "ParcelFlow begins in Dhaka with a handful of merchants and 12 riders covering three areas of the city.",
  },
  {
    year: "2023",
    title: "Prepay and COD",
    body: "bKash prepayments and cash on delivery launch side by side, with wallet settlement the next business day.",
  },
  {
    year: "2024",
    title: "Nationwide coverage",
    body: "Outside City zones open, connecting district towns and upazilas to the same tracked, insured network.",
  },
  {
    year: "2025",
    title: "500+ riders strong",
    body: "The rider network passes 500 active partners, delivering on time to customers all over Bangladesh.",
  },
];

const list: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: stagger(0.12, { startDelay: 0.1 }) },
  },
};

const row: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE_OUT } },
};

const rail: Variants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: { duration: 0.5, ease: EASE_OUT, delay: 0.2 },
  },
};

/** The company journey, as a vertical timeline. */
export default function Milestones() {
  return (
    <section
      aria-labelledby="about-milestones-heading"
      className="bg-white py-20 sm:py-24 lg:py-28"
    >
      <Container className="grid gap-14 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <Reveal>
          <Eyebrow>Our journey</Eyebrow>
          <h2
            id="about-milestones-heading"
            className="mt-4 max-w-md font-heading text-4xl leading-[1.02] font-bold tracking-[-0.04em] text-secondary sm:text-5xl"
          >
            Milestones on the road so far.
          </h2>
          <p className="mt-6 max-w-md text-[17px] leading-relaxed text-secondary/70">
            A few moments that shaped how ParcelFlow ships today — and where
            we’re headed next.
          </p>
        </Reveal>

        <motion.ol
          variants={list}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {MILESTONES.map((milestone, index) => {
            const isLast = index === MILESTONES.length - 1;
            return (
              <motion.li
                key={milestone.year}
                variants={row}
                className="relative flex gap-5 pb-10 last:pb-0 sm:gap-6"
              >
                {/* Joins this year to the next one, drawn downward. */}
                {!isLast ? (
                  <motion.span
                    aria-hidden
                    variants={rail}
                    className="absolute top-11 bottom-0 left-8 w-0.5 origin-top -translate-x-1/2 bg-brand-orange/40"
                  />
                ) : null}
                <span className="relative z-10 grid h-10 w-16 shrink-0 place-items-center rounded-xl bg-brand font-heading text-sm font-bold text-brand-orange">
                  {milestone.year}
                </span>
                <div className="pt-1">
                  <h3 className="font-heading text-lg font-bold text-secondary">
                    {milestone.title}
                  </h3>
                  <p className="mt-1 max-w-xl text-[15px] leading-relaxed text-secondary/70">
                    {milestone.body}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </motion.ol>
      </Container>
    </section>
  );
}
