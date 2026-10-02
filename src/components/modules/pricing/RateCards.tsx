"use client";

import { ArrowRight, Banknote, Bike, type LucideIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { Container, Eyebrow } from "@/components/modules/landing/decor";
import {
  EASE_OUT,
  Reveal,
  RevealGroup,
  RevealItem,
} from "@/components/modules/landing/motion";
import { SECTION_IDS } from "@/constants";
import { findRule, formatKg, formatPercent } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import type { ParcelCategory, PricingRule, ZoneType } from "@/types";
import AnimatedNumber from "./AnimatedNumber";
import { CATEGORIES, SPEED_ORDER, SPEEDS, ZONES } from "./pricing-meta";
import SegmentedControl from "./SegmentedControl";

/** Section shell, so loading and error states keep the same heading. */
export function RatesSection({
  toolbar,
  children,
}: {
  toolbar?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      id={SECTION_IDS.rates}
      aria-labelledby="rates-heading"
      className="scroll-mt-16 bg-accent py-20 sm:py-24 lg:py-28"
    >
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
          <Reveal>
            <Eyebrow>Rates by zone</Eyebrow>
            <h2
              id="rates-heading"
              className="mt-4 max-w-lg font-heading text-4xl leading-[1.02] font-bold tracking-[-0.04em] text-secondary sm:text-5xl"
            >
              Pay for the distance. Nothing else.
            </h2>
          </Reveal>
          {toolbar ? (
            <Reveal delay={0.1} className="w-full md:w-auto">
              {toolbar}
            </Reveal>
          ) : null}
        </div>

        <div className="mt-12 lg:mt-14">{children}</div>
      </Container>
    </section>
  );
}

export function CategorySwitch({
  categories,
  value,
  onValueChange,
}: {
  categories: ParcelCategory[];
  value: ParcelCategory;
  onValueChange: (category: ParcelCategory) => void;
}) {
  return (
    <SegmentedControl
      aria-label="Show rates for"
      value={value}
      onValueChange={onValueChange}
      options={categories.map((category) => ({
        value: category,
        label: CATEGORIES[category].label,
        icon: CATEGORIES[category].icon,
      }))}
      className="w-full md:w-72"
    />
  );
}

type RateCardGridProps = {
  rules: PricingRule[];
  zones: ZoneType[];
  category: ParcelCategory;
  onEstimate: (zone: ZoneType) => void;
};

export function RateCardGrid({
  rules,
  zones,
  category,
  onEstimate,
}: RateCardGridProps) {
  return (
    <>
      <RevealGroup
        className={cn(
          "grid gap-4 lg:gap-5",
          zones.length >= 3 && "lg:grid-cols-3",
          zones.length === 2 && "lg:grid-cols-2",
        )}
      >
        {zones.map((zone) => (
          <RevealItem key={zone} className="h-full">
            <RateCard
              zone={zone}
              category={category}
              rule={findRule(rules, zone, category)}
              onEstimate={() => onEstimate(zone)}
            />
          </RevealItem>
        ))}
      </RevealGroup>
      <Reveal delay={0.2}>
        <p className="mt-6 text-sm leading-relaxed text-secondary/60">
          All prices are in taka. Speed, rider pickup and COD charges are added
          on top of the base rate.
        </p>
      </Reveal>
    </>
  );
}

type RateCardProps = {
  zone: ZoneType;
  category: ParcelCategory;
  rule?: PricingRule;
  onEstimate: () => void;
};

function RateCard({ zone, category, rule, onEstimate }: RateCardProps) {
  const meta = ZONES[zone];

  return (
    // On tablets the cards are full width, so the rows sit in a second column
    // instead of stretching across the card.
    <article className="group flex h-full flex-col rounded-3xl bg-white p-6 text-secondary ring-1 ring-secondary/5 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-28px_rgba(15,32,86,0.35)] sm:p-7 md:max-lg:grid md:max-lg:grid-cols-2 md:max-lg:grid-rows-[auto_auto_1fr] md:max-lg:gap-x-10">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-heading text-xl font-bold tracking-tight">
            {meta.label}
          </h3>
          {/* Two lines tall in the 3-column layout so the prices line up. */}
          <p className="mt-1.5 text-sm leading-relaxed text-secondary/65 lg:min-h-[2lh]">
            {meta.description}
          </p>
        </div>
        <ZoneGlyph ring={meta.ring} />
      </header>

      {rule ? (
        <>
          <div className="mt-7">
            <p className="flex flex-wrap items-baseline gap-x-2">
              <AnimatedNumber
                value={rule.baseCharge}
                countUp
                className="font-heading text-5xl font-bold tracking-[-0.04em] lg:text-[3.4rem]"
              />
              <span className="text-sm font-semibold text-secondary/60">
                first {formatKg(rule.baseWeightKg)}
              </span>
            </p>
            {/* Cross-fades when switching between parcel and document. */}
            <div className="mt-2 h-5 font-heading text-sm font-bold text-brand-orange-ink">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={rule.perKgCharge > 0 ? "per-kg" : "flat"}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: EASE_OUT }}
                >
                  {rule.perKgCharge > 0 ? (
                    <>
                      +<AnimatedNumber value={rule.perKgCharge} /> per extra kg
                    </>
                  ) : (
                    "No weight charge"
                  )}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          <dl className="mt-6 divide-y divide-secondary/8 border-t border-secondary/8 text-sm md:max-lg:col-start-2 md:max-lg:row-span-3 md:max-lg:row-start-1 md:max-lg:mt-0 md:max-lg:border-t-0">
            {SPEED_ORDER.map((speed) => {
              const amount =
                speed === "EXPRESS"
                  ? rule.expressSurcharge
                  : speed === "SAME_DAY"
                    ? rule.sameDaySurcharge
                    : 0;
              return (
                <RateRow
                  key={speed}
                  icon={SPEEDS[speed].icon}
                  label={SPEEDS[speed].label}
                  hint={SPEEDS[speed].eta}
                >
                  {amount > 0 ? (
                    <>
                      +<AnimatedNumber value={amount} />
                    </>
                  ) : (
                    <Included>Included</Included>
                  )}
                </RateRow>
              );
            })}
            <RateRow
              icon={Bike}
              label="Rider pickup"
              hint="or drop at hub free"
            >
              {rule.riderPickupCharge > 0 ? (
                <>
                  +<AnimatedNumber value={rule.riderPickupCharge} />
                </>
              ) : (
                <Included>Free</Included>
              )}
            </RateRow>
            <RateRow icon={Banknote} label="COD fee" hint="of cash collected">
              {rule.codFeePercent > 0 ? (
                <AnimatedNumber
                  value={rule.codFeePercent}
                  format={(value, decimals) =>
                    formatPercent(value, Math.min(decimals, 1))
                  }
                />
              ) : (
                <Included>None</Included>
              )}
            </RateRow>
          </dl>

          <div className="mt-auto pt-7 md:max-lg:self-end">
            <button
              type="button"
              onClick={onEstimate}
              className="group/estimate inline-flex items-center gap-2 rounded-md font-heading text-sm font-bold text-secondary underline decoration-brand-orange decoration-2 underline-offset-4 outline-none transition-colors hover:text-brand-orange-ink focus-visible:ring-3 focus-visible:ring-brand-orange/40"
            >
              Estimate {meta.label} delivery
              <ArrowRight
                aria-hidden
                className="size-4 transition-transform duration-200 group-hover/estimate:translate-x-1"
                strokeWidth={2.5}
              />
            </button>
          </div>
        </>
      ) : (
        <p className="mt-7 rounded-2xl bg-accent px-4 py-5 text-sm text-secondary/70 md:max-lg:col-start-2 md:max-lg:row-start-1 md:max-lg:mt-0">
          {CATEGORIES[category].label} delivery isn&rsquo;t offered in this zone
          yet.
        </p>
      )}
    </article>
  );
}

function RateRow({
  icon: Icon,
  label,
  hint,
  children,
}: {
  icon: LucideIcon;
  label: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <dt className="flex items-center gap-2.5">
        <Icon
          aria-hidden
          className="size-4 shrink-0 text-brand-orange-ink"
          strokeWidth={2.25}
        />
        <span>
          <span className="font-semibold">{label}</span>
          {/* Own line until there's room for it beside the label. */}
          <span className="block text-xs text-secondary/50 xl:ml-1.5 xl:inline">
            {hint}
          </span>
        </span>
      </dt>
      <dd className="shrink-0 font-heading font-bold tabular-nums">
        {children}
      </dd>
    </div>
  );
}

function Included({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-emerald-600/10 px-2 py-0.5 text-xs font-bold text-emerald-700">
      {children}
    </span>
  );
}

/** Concentric rings with the card's zone highlighted. */
function ZoneGlyph({ ring }: { ring: 1 | 2 | 3 }) {
  return (
    <svg
      viewBox="0 0 44 44"
      aria-hidden="true"
      className="size-11 shrink-0 transition-transform duration-500 ease-out group-hover:rotate-90"
    >
      {[7, 13, 19].map((r, index) => {
        const active = index + 1 === ring;
        return (
          <circle
            key={r}
            cx={22}
            cy={22}
            r={r}
            fill="none"
            strokeWidth={active ? 2.5 : 1.5}
            strokeDasharray={active ? undefined : "2 3.5"}
            className={active ? "stroke-brand-orange" : "stroke-secondary/20"}
          />
        );
      })}
      <circle cx={22} cy={22} r={2.75} className="fill-brand" />
    </svg>
  );
}
