"use client";

import { ReceiptText } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import CtaLink from "@/components/modules/landing/CtaLink";
import { EASE_OUT } from "@/components/modules/landing/motion";
import { ROUTES } from "@/constants";
import { useGetMe } from "@/hooks";
import { ROLE_HOME } from "@/routes";
import {
  type Estimate,
  type EstimateInput,
  formatKg,
  formatPercent,
  formatTaka,
} from "@/lib/pricing";
import type { ParcelCategory, PricingRule, ZoneType } from "@/types";
import AnimatedNumber from "./AnimatedNumber";
import { CATEGORIES, PICKUP_METHODS, SPEEDS, ZONES } from "./pricing-meta";

type Line = {
  id: string;
  label: string;
  detail?: string;
  amount: number;
  /** Shown instead of ৳0. */
  zeroLabel?: string;
};

function buildLines(
  rule: PricingRule,
  input: EstimateInput,
  estimate: Estimate,
): Line[] {
  const lines: Line[] = [
    {
      id: "base",
      label: "Base charge",
      detail: `first ${formatKg(rule.baseWeightKg)}`,
      amount: estimate.baseCharge,
    },
  ];

  if (estimate.weightCharge > 0) {
    lines.push({
      id: "weight",
      label: "Extra weight",
      detail: `${estimate.extraKg} kg × ${formatTaka(rule.perKgCharge)}`,
      amount: estimate.weightCharge,
    });
  }

  lines.push(
    {
      id: "speed",
      label: `${SPEEDS[input.speed].label} delivery`,
      detail: SPEEDS[input.speed].eta,
      amount: estimate.speedCharge,
      zeroLabel: "Included",
    },
    {
      id: "pickup",
      label: PICKUP_METHODS[input.pickup].label,
      amount: estimate.pickupCharge,
      zeroLabel: "Free",
    },
  );

  if (input.payment === "COD") {
    lines.push({
      id: "cod",
      label: "COD fee",
      detail:
        rule.codFeePercent > 0
          ? `${formatPercent(rule.codFeePercent)} of ${formatTaka(input.codAmount)}`
          : undefined,
      amount: estimate.codFee,
      zeroLabel: rule.codFeePercent > 0 ? undefined : "Free",
    });
  }

  return lines;
}

type EstimateReceiptProps = {
  zone: ZoneType;
  category: ParcelCategory;
  rule?: PricingRule;
  input: EstimateInput;
  estimate: Estimate | null;
  /** Whether weight changes the price, i.e. it's worth showing as a tag. */
  showWeight: boolean;
};

export default function EstimateReceipt({
  zone,
  category,
  rule,
  input,
  estimate,
  showWeight,
}: EstimateReceiptProps) {
  const { data: user } = useGetMe();
  const lines = rule && estimate ? buildLines(rule, input, estimate) : [];
  const tags = [
    ZONES[zone].label,
    CATEGORIES[category].label,
    ...(showWeight ? [formatKg(input.weightKg)] : []),
    SPEEDS[input.speed].label,
  ];

  return (
    <div className="relative rounded-3xl bg-brand-cream text-secondary shadow-[0_32px_64px_-32px_rgba(2,6,23,0.9)]">
      <div className="px-6 pt-6 pb-4 sm:px-7 sm:pt-7">
        <div className="flex items-center justify-between gap-4">
          <p className="font-heading text-[13px] font-bold tracking-[0.2em] text-brand-orange-ink uppercase">
            Your estimate
          </p>
          <ReceiptText
            aria-hidden
            className="size-5 text-secondary/40"
            strokeWidth={2}
          />
        </div>
        <ul
          aria-label="Selected options"
          className="mt-4 flex flex-wrap gap-1.5"
        >
          {tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-white px-2.5 py-1 font-heading text-xs font-semibold text-secondary/80 ring-1 ring-secondary/10"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>

      {/* Ticket perforation: the notches are page-coloured circles. */}
      <div aria-hidden className="relative h-6">
        <span className="absolute top-1/2 -left-3 size-6 -translate-y-1/2 rounded-full bg-brand" />
        <span className="absolute top-1/2 -right-3 size-6 -translate-y-1/2 rounded-full bg-brand" />
        <span className="absolute inset-x-6 top-1/2 border-t-2 border-dashed border-secondary/15" />
      </div>

      <div className="px-6 pt-3 pb-6 sm:px-7 sm:pb-7">
        {estimate ? (
          <>
            <ul className="text-sm">
              <AnimatePresence initial={false}>
                {lines.map((line) => (
                  <motion.li
                    key={line.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: EASE_OUT }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-baseline justify-between gap-4 py-1.5">
                      <span>
                        <span className="font-semibold">{line.label}</span>
                        {line.detail ? (
                          <span className="ml-1.5 text-xs text-secondary/55">
                            {line.detail}
                          </span>
                        ) : null}
                      </span>
                      {line.amount === 0 && line.zeroLabel ? (
                        <span className="shrink-0 font-heading text-xs font-bold text-emerald-700">
                          {line.zeroLabel}
                        </span>
                      ) : (
                        <AnimatedNumber
                          value={line.amount}
                          className="shrink-0 font-heading font-bold"
                        />
                      )}
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            <div className="mt-4 flex items-end justify-between gap-4 border-t-2 border-secondary/10 pt-5">
              <div>
                <p className="font-heading text-sm font-bold">Total</p>
                <p className="text-xs text-secondary/55">Delivery charge</p>
              </div>
              <AnimatedNumber
                value={estimate.total}
                className="font-heading text-5xl leading-none font-bold tracking-[-0.04em]"
              />
            </div>

            <AnimatePresence initial={false}>
              {input.payment === "COD" && input.codAmount > 0 ? (
                <motion.p
                  key="cod-note"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: EASE_OUT }}
                  className="overflow-hidden text-right text-xs text-secondary/60"
                >
                  <span className="block pt-2">
                    Rider collects {formatTaka(input.codAmount)} from your
                    customer.
                  </span>
                </motion.p>
              ) : null}
            </AnimatePresence>

            {/* One polite announcement per change, instead of every frame. */}
            <p className="sr-only" aria-live="polite">
              Estimated delivery charge {formatTaka(estimate.total)}
            </p>
          </>
        ) : (
          <p className="rounded-2xl bg-white px-4 py-5 text-sm text-secondary/70">
            {CATEGORIES[category].label} delivery isn&rsquo;t offered for{" "}
            {ZONES[zone].label} yet. Try another zone or parcel type.
          </p>
        )}

        <CtaLink
          href={
            user
              ? (user.role ? ROLE_HOME[user.role] : ROUTES.merchantDashboard)
              : ROUTES.register
          }
          variant="ink"
          arrow
          className="mt-6 w-full"
        >
          {user ? "Book from your dashboard" : "Create account to book"}
        </CtaLink>
        <p className="mt-3 text-center text-xs leading-relaxed text-secondary/55">
          This is an estimate. Your exact price is shown, and locked, when you
          create the parcel.
        </p>
      </div>
    </div>
  );
}
