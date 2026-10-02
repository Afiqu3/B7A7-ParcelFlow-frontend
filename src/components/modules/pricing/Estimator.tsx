"use client";

import { Minus, Plus } from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { type ReactNode, useId, useRef, useState } from "react";
import { Container, Eyebrow } from "@/components/modules/landing/decor";
import { EASE_OUT, Reveal } from "@/components/modules/landing/motion";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { SECTION_IDS } from "@/constants";
import {
  estimateCharge,
  findRule,
  formatKg,
  formatPercent,
  formatTaka,
  type PaymentMethod,
  type PickupMethod,
  speedSurcharge,
} from "@/lib/pricing";
import { cn } from "@/lib/utils";
import type {
  DeliverySpeed,
  ParcelCategory,
  PricingRule,
  ZoneType,
} from "@/types";
import AnimatedNumber from "./AnimatedNumber";
import EstimateReceipt from "./EstimateReceipt";
import {
  CATEGORIES,
  PAYMENT_METHODS,
  PICKUP_METHODS,
  SPEED_ORDER,
  SPEEDS,
  ZONES,
} from "./pricing-meta";
import SegmentedControl from "./SegmentedControl";

const WEIGHT = { min: 0.5, max: 20, step: 0.5 } as const;
const COD_PRESETS = [500, 1000, 2500, 5000];
const COD_COLLAPSED = {
  opacity: 0,
  height: 0,
  marginTop: -28,
  marginBottom: 0,
};

const clampWeight = (kg: number) =>
  Math.min(WEIGHT.max, Math.max(WEIGHT.min, Math.round(kg * 2) / 2));

/** Digits and one decimal point, at most 2 decimals and 7 whole digits. */
function sanitizeAmount(raw: string) {
  const [whole = "", ...rest] = raw.replace(/[^\d.]/g, "").split(".");
  const decimals = rest.join("").slice(0, 2);
  return raw.includes(".")
    ? `${whole.slice(0, 7)}.${decimals}`
    : whole.slice(0, 7);
}

type EstimatorProps = {
  rules: PricingRule[];
  zones: ZoneType[];
  categories: ParcelCategory[];
  zone: ZoneType;
  category: ParcelCategory;
  onZoneChange: (zone: ZoneType) => void;
  onCategoryChange: (category: ParcelCategory) => void;
};

export default function Estimator({
  rules,
  zones,
  categories,
  zone,
  category,
  onZoneChange,
  onCategoryChange,
}: EstimatorProps) {
  const ids = useId();
  const [weightKg, setWeightKg] = useState(1);
  const [speed, setSpeed] = useState<DeliverySpeed>("REGULAR");
  const [pickup, setPickup] = useState<PickupMethod>("RIDER_PICKUP");
  const [payment, setPayment] = useState<PaymentMethod>("PREPAID");
  const [codInput, setCodInput] = useState("1000");

  const rule = findRule(rules, zone, category);
  const weighted = (rule?.perKgCharge ?? 0) > 0;
  const input = {
    weightKg,
    speed,
    pickup,
    payment,
    codAmount: Number(codInput) || 0,
  };
  const estimate = rule ? estimateCharge(rule, input) : null;

  // Below lg the receipt sits under the form, so a bar keeps the total in
  // sight while the form is being filled in.
  const formRef = useRef<HTMLFormElement>(null);
  const receiptRef = useRef<HTMLDivElement>(null);
  const formInView = useInView(formRef);
  // Most of the receipt (so the total too) must be on screen to hide the bar.
  const receiptInView = useInView(receiptRef, { amount: 0.6 });
  const showTotalBar = Boolean(estimate) && formInView && !receiptInView;

  return (
    <section
      id={SECTION_IDS.estimator}
      aria-labelledby="estimator-heading"
      className="scroll-mt-16 bg-brand py-20 text-white sm:py-24 lg:py-28"
    >
      <Container>
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10">
          <Reveal>
            <Eyebrow tone="onDark">Price estimator</Eyebrow>
            <h2
              id="estimator-heading"
              className="mt-4 max-w-xl font-heading text-4xl leading-[1.02] font-bold tracking-[-0.04em] sm:text-5xl"
            >
              Know the price before you book.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-[17px] leading-relaxed text-brand-muted md:pb-1">
              Pick where it&rsquo;s going and how. The total updates as you
              change anything.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-5 lg:mt-14 lg:grid-cols-[1.3fr_1fr] lg:items-start lg:gap-8">
          <Reveal amount={0.15}>
            <form
              ref={formRef}
              aria-label="Estimate a delivery"
              onSubmit={(event) => event.preventDefault()}
              className="flex flex-col gap-7 rounded-3xl bg-brand-card p-5 ring-1 ring-white/5 sm:p-7"
            >
              <Control id={`${ids}-zone`} label="Delivery zone">
                <SegmentedControl
                  tone="dark"
                  aria-labelledby={`${ids}-zone`}
                  value={zone}
                  onValueChange={onZoneChange}
                  options={zones.map((z) => {
                    const zoneRule = findRule(rules, z, category);
                    return {
                      value: z,
                      label: ZONES[z].label,
                      hint: zoneRule
                        ? formatTaka(zoneRule.baseCharge)
                        : "Not offered",
                    };
                  })}
                />
              </Control>

              <Control id={`${ids}-category`} label="What are you sending?">
                <SegmentedControl
                  tone="dark"
                  aria-labelledby={`${ids}-category`}
                  value={category}
                  onValueChange={onCategoryChange}
                  options={categories.map((c) => ({
                    value: c,
                    label: CATEGORIES[c].label,
                    icon: CATEGORIES[c].icon,
                  }))}
                />
              </Control>

              <Control
                id={`${ids}-weight`}
                label="Weight"
                aside={
                  weighted ? (
                    <span className="rounded-lg bg-brand-deep/70 px-2.5 py-1 font-heading text-base font-bold tabular-nums">
                      {formatKg(weightKg)}
                    </span>
                  ) : null
                }
              >
                <AnimatePresence mode="wait" initial={false}>
                  {weighted && rule ? (
                    <motion.div
                      key="slider"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <div className="flex items-center gap-3">
                        <StepButton
                          label="Decrease weight"
                          disabled={weightKg <= WEIGHT.min}
                          onClick={() =>
                            setWeightKg((kg) => clampWeight(kg - WEIGHT.step))
                          }
                        >
                          <Minus className="size-4" strokeWidth={2.5} />
                        </StepButton>
                        <Slider
                          aria-label="Parcel weight"
                          aria-valuetext={formatKg(weightKg)}
                          min={WEIGHT.min}
                          max={WEIGHT.max}
                          step={WEIGHT.step}
                          value={[weightKg]}
                          onValueChange={([kg]) => setWeightKg(clampWeight(kg))}
                          className="flex-1 py-2 [&_[data-slot=slider-range]]:bg-brand-orange [&_[data-slot=slider-thumb]]:size-5 [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-thumb]]:border-brand-orange [&_[data-slot=slider-thumb]]:ring-brand-orange/30 [&_[data-slot=slider-track]]:h-2 [&_[data-slot=slider-track]]:bg-brand-deep"
                        />
                        <StepButton
                          label="Increase weight"
                          disabled={weightKg >= WEIGHT.max}
                          onClick={() =>
                            setWeightKg((kg) => clampWeight(kg + WEIGHT.step))
                          }
                        >
                          <Plus className="size-4" strokeWidth={2.5} />
                        </StepButton>
                      </div>
                      <p className="mt-3 text-xs leading-relaxed text-brand-muted">
                        First {formatKg(rule.baseWeightKg)} included, then{" "}
                        {formatTaka(rule.perKgCharge)} for each extra kg or part
                        of one.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.p
                      key="flat"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="rounded-2xl bg-brand-deep/50 px-4 py-3 text-sm text-brand-muted"
                    >
                      {CATEGORIES[category].label}s have no weight charge in
                      this zone.
                    </motion.p>
                  )}
                </AnimatePresence>
              </Control>

              <Control id={`${ids}-speed`} label="Delivery speed">
                <SegmentedControl
                  tone="dark"
                  aria-labelledby={`${ids}-speed`}
                  value={speed}
                  onValueChange={setSpeed}
                  options={SPEED_ORDER.map((s) => {
                    const surcharge = rule ? speedSurcharge(rule, s) : 0;
                    return {
                      value: s,
                      label: SPEEDS[s].label,
                      hint:
                        surcharge > 0
                          ? `+${formatTaka(surcharge)}`
                          : SPEEDS[s].eta,
                    };
                  })}
                />
              </Control>

              {/* Side by side only where the form spans the full width. */}
              <div className="grid gap-7 sm:grid-cols-2 sm:gap-5 lg:grid-cols-1 lg:gap-7">
                <Control id={`${ids}-pickup`} label="Pickup">
                  <SegmentedControl
                    tone="dark"
                    aria-labelledby={`${ids}-pickup`}
                    value={pickup}
                    onValueChange={setPickup}
                    options={(["HUB_DROP_OFF", "RIDER_PICKUP"] as const).map(
                      (p) => ({
                        value: p,
                        label: PICKUP_METHODS[p].label,
                        icon: PICKUP_METHODS[p].icon,
                        hint:
                          p === "RIDER_PICKUP" &&
                          rule &&
                          rule.riderPickupCharge > 0
                            ? `+${formatTaka(rule.riderPickupCharge)}`
                            : "Free",
                      }),
                    )}
                  />
                </Control>

                <Control id={`${ids}-payment`} label="Payment">
                  <SegmentedControl
                    tone="dark"
                    aria-labelledby={`${ids}-payment`}
                    value={payment}
                    onValueChange={setPayment}
                    options={(["PREPAID", "COD"] as const).map((p) => ({
                      value: p,
                      label: PAYMENT_METHODS[p].label,
                      icon: PAYMENT_METHODS[p].icon,
                      hint:
                        p === "PREPAID"
                          ? "bKash"
                          : rule && rule.codFeePercent > 0
                            ? `${formatPercent(rule.codFeePercent)} fee`
                            : "No fee",
                    }))}
                  />
                </Control>
              </div>

              <AnimatePresence initial={false}>
                {payment === "COD" ? (
                  <motion.div
                    key="cod-amount"
                    // Closed, the negative top margin cancels the form's gap-7
                    // (28px) so nothing jumps when the block unmounts.
                    initial={COD_COLLAPSED}
                    animate={{
                      opacity: 1,
                      height: "auto",
                      marginTop: -16,
                      marginBottom: -4,
                    }}
                    exit={COD_COLLAPSED}
                    transition={{ duration: 0.28, ease: EASE_OUT }}
                    // -mx-1 + p-1 keeps the input's focus ring visible inside
                    // the overflow clip that the height animation needs.
                    className="-mx-1 overflow-hidden"
                  >
                    <div className="p-1">
                      <label
                        htmlFor={`${ids}-cod`}
                        className="font-heading text-sm font-bold text-white"
                      >
                        Cash to collect from your customer
                      </label>
                      <div className="relative mt-3">
                        <span
                          aria-hidden
                          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 font-heading text-lg font-bold text-brand-muted"
                        >
                          ৳
                        </span>
                        <Input
                          id={`${ids}-cod`}
                          inputMode="decimal"
                          autoComplete="off"
                          value={codInput}
                          onChange={(event) =>
                            setCodInput(sanitizeAmount(event.target.value))
                          }
                          placeholder="0"
                          className="h-12 rounded-xl border-white/10 bg-brand-deep/60 pl-9 font-heading text-lg font-bold text-white tabular-nums placeholder:text-white/30 focus-visible:border-brand-orange focus-visible:ring-brand-orange/30 md:text-lg"
                        />
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {COD_PRESETS.map((amount) => {
                          const active = Number(codInput) === amount;
                          return (
                            <button
                              key={amount}
                              type="button"
                              aria-pressed={active}
                              onClick={() => setCodInput(String(amount))}
                              className={cn(
                                "rounded-full px-3 py-1.5 font-heading text-xs font-bold ring-1 outline-none transition-colors focus-visible:ring-3 focus-visible:ring-brand-orange/50",
                                active
                                  ? "bg-brand-orange text-brand-ink ring-brand-orange"
                                  : "text-brand-muted ring-white/10 hover:bg-white/5 hover:text-white",
                              )}
                            >
                              {formatTaka(amount)}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </form>
          </Reveal>

          <Reveal delay={0.1} amount={0.15} className="lg:sticky lg:top-24">
            <div ref={receiptRef}>
              <EstimateReceipt
                zone={zone}
                category={category}
                rule={rule}
                input={input}
                estimate={estimate}
                showWeight={weighted}
              />
            </div>
          </Reveal>
        </div>
      </Container>

      <AnimatePresence>
        {showTotalBar && estimate ? (
          <motion.div
            key="total-bar"
            initial={{ y: "120%" }}
            animate={{ y: 0 }}
            exit={{ y: "120%" }}
            transition={{ type: "spring", stiffness: 420, damping: 38 }}
            className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] lg:hidden"
          >
            <button
              type="button"
              onClick={() => {
                const reduceMotion = window.matchMedia(
                  "(prefers-reduced-motion: reduce)",
                ).matches;
                receiptRef.current?.scrollIntoView({
                  behavior: reduceMotion ? "auto" : "smooth",
                  block: "center",
                });
              }}
              className="mx-auto flex w-full max-w-md items-center justify-between gap-4 rounded-2xl bg-brand-cream px-5 py-3 text-left text-secondary shadow-[0_-8px_40px_-8px_rgba(2,6,23,0.65)] ring-1 ring-secondary/10 outline-none focus-visible:ring-4 focus-visible:ring-brand-orange/50"
            >
              <span>
                <span className="block font-heading text-xs font-bold tracking-[0.18em] text-brand-orange-ink uppercase">
                  Estimated total
                </span>
                <span className="text-xs text-secondary/60">
                  Tap to see the breakdown
                </span>
              </span>
              <AnimatedNumber
                value={estimate.total}
                className="font-heading text-3xl font-bold tracking-[-0.04em]"
              />
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

function Control({
  id,
  label,
  aside,
  children,
}: {
  id: string;
  label: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex min-h-8 items-center justify-between gap-3">
        <span id={id} className="font-heading text-sm font-bold text-white">
          {label}
        </span>
        {aside}
      </div>
      {children}
    </div>
  );
}

function StepButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-deep/70 text-white ring-1 ring-white/5 outline-none transition-[background-color,transform] hover:bg-brand-deep active:scale-95 focus-visible:ring-3 focus-visible:ring-brand-orange/50 disabled:cursor-not-allowed disabled:opacity-35"
    >
      {children}
    </button>
  );
}
