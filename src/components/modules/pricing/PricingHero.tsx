"use client";

import { Check } from "lucide-react";
import { motion, stagger, type Variants } from "motion/react";
import CtaLink from "@/components/modules/landing/CtaLink";
import { Container, PulseDot } from "@/components/modules/landing/decor";
import { EASE_OUT } from "@/components/modules/landing/motion";
import { ROUTES, SECTION_IDS } from "@/constants";
import { useGetAllPricingRule } from "@/hooks";
import { scrollToSection } from "@/lib/scroll";
import ZoneRings from "./ZoneRings";

const HEADLINE = [
  { text: "Simple rates.", accent: false },
  { text: "No surprises.", accent: true },
];

const PERKS = [
  "Free merchant account",
  "bKash or cash on delivery",
  "No pickup charge at the hub",
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

// Headline lines slide up from behind a mask, like the landing hero.
const line: Variants = {
  hidden: { y: "105%" },
  visible: { y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};

export default function PricingHero() {
  // Shares the cached query with the rate cards below; it only feeds the
  // "from ৳X" labels, so the hero never waits on it.
  const { data: rules } = useGetAllPricingRule();

  return (
    <section
      aria-labelledby="pricing-heading"
      className="relative overflow-hidden bg-brand text-white"
    >
      <Container className="grid items-center gap-14 pt-12 pb-16 sm:pt-16 sm:pb-20 lg:grid-cols-[1.1fr_1fr] lg:gap-8 lg:pb-24">
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
            Pricing
          </motion.p>

          <h1
            id="pricing-heading"
            className="mt-6 font-heading text-[3.1rem] leading-[0.92] font-bold tracking-tighter sm:text-7xl lg:text-[4.9rem]"
          >
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
            Every price comes from three things: where it&rsquo;s going, what it
            weighs and how fast it needs to get there. You see it before you
            book, and it&rsquo;s locked once you do.
          </motion.p>

          <motion.div
            variants={fade}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <CtaLink
              href={`#${SECTION_IDS.estimator}`}
              arrow
              onClick={(event) => {
                event.preventDefault();
                scrollToSection(SECTION_IDS.estimator);
              }}
            >
              Estimate a parcel
            </CtaLink>
            <CtaLink href={ROUTES.register} variant="outline">
              Create merchant account
            </CtaLink>
          </motion.div>

          <motion.ul
            variants={fade}
            className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-x-5"
          >
            {PERKS.map((perk) => (
              <li
                key={perk}
                className="inline-flex items-center gap-2 font-heading text-[14px] font-semibold text-brand-cream"
              >
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-brand-orange">
                  <Check className="size-3 text-brand-ink" strokeWidth={3.5} />
                </span>
                {perk}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        <div className="relative z-10">
          <ZoneRings rules={rules} />
        </div>
      </Container>
    </section>
  );
}
