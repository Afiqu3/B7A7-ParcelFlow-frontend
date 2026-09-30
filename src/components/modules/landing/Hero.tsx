"use client";

import { CalendarDays, Clock, Zap } from "lucide-react";
import { motion, stagger, type Variants } from "motion/react";
import { ROUTES } from "@/constants";
import CtaLink from "./CtaLink";
import { Container, PulseDot, RoutePath, SvgPulseDot } from "./decor";
import { EASE_OUT } from "./motion";
import TrackingCard from "./TrackingCard";

const HEADLINE = [
  { text: "Ship it.", accent: false },
  { text: "Track it.", accent: false },
  { text: "Get paid.", accent: true },
];

const SPEEDS = [
  { label: "Same day", icon: Zap },
  { label: "Express · 24h", icon: Clock },
  { label: "Regular · 48-72h", icon: CalendarDays },
];

const container: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: stagger(0.09, { startDelay: 0.05 }) },
  },
};

const fade: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT } },
};

// Headline lines slide up from behind a mask.
const line: Variants = {
  hidden: { y: "105%" },
  visible: { y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand text-white">
      <Container className="grid items-center gap-14 pt-12 pb-20 sm:pt-16 lg:grid-cols-[1.12fr_1fr] lg:gap-8 lg:pt-16 lg:pb-20">
        <motion.div
          className="relative z-10"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            variants={fade}
            className="inline-flex items-center gap-2.5 rounded-full bg-brand-card px-3.5 py-1.5 font-heading text-[13px] font-semibold text-brand-cream ring-1 ring-white/5"
          >
            <PulseDot />
            Courier &amp; payments for Bangladeshi merchants
          </motion.p>

          <h1 className="mt-6 font-heading text-[3.4rem] leading-[0.92] font-bold tracking-tighter sm:text-7xl lg:text-[5.4rem]">
            {HEADLINE.map((l) => (
              <span
                key={l.text}
                className="mb-[-0.08em] block overflow-hidden pb-[0.08em]"
              >
                <motion.span
                  variants={line}
                  className={l.accent ? "block text-brand-orange" : "block"}
                >
                  {l.text}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            variants={fade}
            className="mt-7 max-w-120 text-[17px] leading-relaxed text-brand-muted"
          >
            Book a pickup, prepay with bKash or collect cash on delivery, and
            follow every parcel from your door to your customer&rsquo;s.
          </motion.p>

          <motion.div
            variants={fade}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <CtaLink href={ROUTES.register} arrow>
              Create merchant account
            </CtaLink>
            <CtaLink href={ROUTES.riderApply} variant="outline">
              Become a rider
            </CtaLink>
          </motion.div>

          <motion.div variants={fade} className="relative mt-7">
            {/* Dotted route running behind the chips toward the card */}
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 -left-35 hidden h-60 w-225 -translate-y-40 overflow-visible text-brand-line lg:block"
              viewBox="-140 -160 900 240"
              fill="none"
            >
              <RoutePath d="M-140 6 C -40 -2, 140 38, 310 30 C 380 27, 420 12, 448 6 C 530 -8, 650 -44, 800 -110" />
              <SvgPulseDot cx={448} cy={6} />
            </svg>

            <ul className="relative flex flex-wrap gap-2.5">
              {SPEEDS.map(({ label, icon: Icon }) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-brand-line bg-brand px-3.5 py-1.5 font-heading text-[13px] font-semibold"
                >
                  <Icon
                    className="size-4 text-brand-orange"
                    strokeWidth={2.25}
                  />
                  {label}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        <div className="relative z-10 mx-auto w-full max-w-104 pr-3.5 pb-3.5 lg:mr-0">
          <TrackingCard />
        </div>
      </Container>
    </section>
  );
}
