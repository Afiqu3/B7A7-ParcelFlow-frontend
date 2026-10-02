"use client";

import {
  ArrowRight,
  Banknote,
  Bike,
  FileText,
  type LucideIcon,
  RotateCw,
  Smartphone,
  Warehouse,
} from "lucide-react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import Link from "next/link";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { Container, Eyebrow } from "@/components/modules/landing/decor";
import { Reveal } from "@/components/modules/landing/motion";
import {
  CATEGORIES,
  CATEGORY_ORDER,
  SPEED_ORDER,
  SPEEDS,
  ZONE_ORDER,
  ZONES,
} from "@/components/modules/pricing/pricing-meta";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";
import StatusTrail from "./StatusTrail";
import { MERCHANT_STEPS, type MerchantStepId } from "./steps";

const linkClass =
  "group/link inline-flex items-center gap-1.5 rounded-sm font-heading text-sm font-bold text-secondary underline decoration-brand-orange decoration-2 underline-offset-4 outline-none transition-colors hover:text-brand-orange-ink focus-visible:ring-3 focus-visible:ring-brand-orange/40";

const DETAILS: Record<MerchantStepId, ReactNode> = {
  "step-create": (
    <div className="flex flex-col gap-3">
      <ChipRow label="Zone" items={ZONE_ORDER.map((z) => ZONES[z].label)} />
      <ChipRow
        label="Type"
        items={CATEGORY_ORDER.map((c) => CATEGORIES[c].label)}
      />
      <ChipRow
        label="Speed"
        items={SPEED_ORDER.map((s) => `${SPEEDS[s].label} · ${SPEEDS[s].eta}`)}
      />
      <Link href={ROUTES.pricing} className={cn(linkClass, "mt-2 w-fit")}>
        See the price list
        <ArrowRight
          aria-hidden
          className="size-4 transition-transform duration-200 group-hover/link:translate-x-1"
          strokeWidth={2.5}
        />
      </Link>
    </div>
  ),
  "step-pay": (
    <OptionTiles
      options={[
        {
          icon: Smartphone,
          title: "bKash prepaid",
          body: "Cancel before pickup and the refund goes back automatically.",
        },
        {
          icon: Banknote,
          title: "Cash on delivery",
          body: "Riders collect the COD amount at the door.",
        },
      ]}
    />
  ),
  "step-pickup": (
    <OptionTiles
      options={[
        {
          icon: Bike,
          title: "Rider pickup",
          body: "A rider collects the parcel from your address.",
        },
        {
          icon: Warehouse,
          title: "Hub drop-off",
          body: "Bring it to the hub yourself, with no pickup charge.",
        },
      ]}
    />
  ),
  "step-deliver": (
    <div className="flex flex-col gap-4">
      <StatusTrail />
      <ul className="flex flex-col gap-2 text-sm text-secondary/70 sm:flex-row sm:gap-6">
        <li className="inline-flex items-center gap-2">
          <RotateCw
            aria-hidden
            className="size-4 text-brand-orange-ink"
            strokeWidth={2.25}
          />
          Up to 3 delivery attempts
        </li>
        <li className="inline-flex items-center gap-2">
          <FileText
            aria-hidden
            className="size-4 text-brand-orange-ink"
            strokeWidth={2.25}
          />
          PDF invoice for every parcel
        </li>
      </ul>
    </div>
  ),
};

/** The four merchant steps as a timeline that fills in as you scroll. */
export default function HowItWorks() {
  return (
    <section
      aria-labelledby="steps-heading"
      className="bg-accent py-20 sm:py-24 lg:py-28"
    >
      <Container className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <Eyebrow>Step by step</Eyebrow>
          <h2
            id="steps-heading"
            className="mt-4 max-w-sm font-heading text-4xl leading-[1.02] font-bold tracking-[-0.04em] text-secondary sm:text-5xl"
          >
            Four steps. One dashboard.
          </h2>
          <p className="mt-5 max-w-sm text-[17px] leading-relaxed text-secondary/70">
            No calls, no guesswork about what it costs. Everything happens from
            your merchant dashboard.
          </p>
        </Reveal>

        <div>
          <ol>
            {MERCHANT_STEPS.map((step, index) => (
              <Step
                key={step.id}
                id={step.id}
                index={index}
                title={step.title}
                body={step.body}
                isLast={index === MERCHANT_STEPS.length - 1}
              >
                {DETAILS[step.id]}
              </Step>
            ))}
          </ol>

          <Reveal>
            <p className="mt-14 border-t border-secondary/10 pt-6 text-[15px] text-secondary/70">
              Want to deliver parcels instead?{" "}
              <Link href={ROUTES.rideWithUs} className={linkClass}>
                Ride with us
                <ArrowRight
                  aria-hidden
                  className="size-4 transition-transform duration-200 group-hover/link:translate-x-1"
                  strokeWidth={2.5}
                />
              </Link>
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

type StepProps = {
  id: string;
  index: number;
  title: string;
  body: string;
  isLast: boolean;
  children: ReactNode;
};

/**
 * `useReducedMotion`, but `false` until after hydration. The page is
 * prerendered without knowing the setting, and React keeps the server's
 * classes on a hydration mismatch, so reading it during render would stick.
 */
function useReducedMotionAfterMount() {
  const prefersReduced = useReducedMotion();
  const [reduced, setReduced] = useState(false);
  useEffect(() => setReduced(Boolean(prefersReduced)), [prefersReduced]);
  return reduced;
}

function Step({ id, index, title, body, isLast, children }: StepProps) {
  const ref = useRef<HTMLLIElement>(null);
  const reduceMotion = useReducedMotionAfterMount();

  // 0 → 1 while this step travels past the middle of the screen. Drives
  // the rail below its marker, so the rail fills continuously step to step.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 55%", "end 55%"],
  });
  const [reached, setReached] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (progress) =>
    setReached(progress > 0),
  );
  const active = reached || reduceMotion;

  return (
    <li
      ref={ref}
      id={id}
      className="relative grid scroll-mt-28 grid-cols-[3rem_1fr] gap-x-5 pb-16 last:pb-0 sm:grid-cols-[4rem_1fr] sm:gap-x-8"
    >
      {/* Rail from this marker's centre down to the next marker. */}
      {isLast ? null : (
        <span
          aria-hidden
          className="absolute top-6 bottom-0 left-6 w-0.5 -translate-x-1/2 overflow-hidden rounded-full bg-secondary/10 sm:top-8 sm:left-8"
        >
          <motion.span
            className="block size-full origin-top bg-brand-orange"
            style={{ scaleY: reduceMotion ? 1 : scrollYProgress }}
          />
        </span>
      )}

      <motion.span
        aria-hidden
        animate={{ scale: active ? 1 : 0.88 }}
        transition={{ type: "spring", stiffness: 420, damping: 22 }}
        className={cn(
          "relative z-10 grid size-12 place-items-center rounded-2xl font-heading text-lg font-bold transition-colors duration-300 sm:size-16 sm:text-xl",
          active
            ? "bg-brand text-brand-orange shadow-[0_16px_32px_-16px_rgba(15,32,86,0.7)]"
            : "bg-white text-secondary/35 ring-1 ring-secondary/10",
        )}
      >
        {String(index + 1).padStart(2, "0")}
      </motion.span>

      <Reveal amount={0.25} className="min-w-0 pt-1.5 sm:pt-3.5">
        <p className="font-heading text-xs font-bold tracking-[0.2em] text-brand-orange-ink uppercase">
          Step {index + 1}
        </p>
        <h3 className="mt-2 font-heading text-2xl font-bold tracking-tight text-secondary sm:text-3xl">
          {title}
        </h3>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-secondary/70">
          {body}
        </p>
        <div className="mt-6">{children}</div>
      </Reveal>
    </li>
  );
}

function ChipRow({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
      <span className="w-14 shrink-0 font-heading text-xs font-bold tracking-[0.16em] text-secondary/45 uppercase">
        {label}
      </span>
      <ul className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-full bg-white px-3 py-1 font-heading text-[13px] font-semibold text-secondary ring-1 ring-secondary/10"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function OptionTiles({
  options,
}: {
  options: { icon: LucideIcon; title: string; body: string }[];
}) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {options.map(({ icon: Icon, title, body }) => (
        <li
          key={title}
          className="group flex gap-3.5 rounded-2xl bg-white p-4 ring-1 ring-secondary/5 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-24px_rgba(15,32,86,0.4)]"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand text-brand-orange transition-transform duration-300 group-hover:-rotate-6">
            <Icon className="size-4.5" strokeWidth={2.25} />
          </span>
          <span>
            <span className="block font-heading text-[15px] font-bold text-secondary">
              {title}
            </span>
            <span className="mt-1 block text-sm leading-relaxed text-secondary/65">
              {body}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
