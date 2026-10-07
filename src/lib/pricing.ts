import type {
  DeliverySpeed,
  ParcelCategory,
  Pricing,
  PricingRule,
  ZoneType,
} from "@/types";

export type PickupMethod = "HUB_DROP_OFF" | "RIDER_PICKUP";
export type PaymentMethod = "PREPAID" | "COD";

const toNumber = (value: string | number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

/** Parses the decimal strings of an API pricing rule into numbers. */
export function toPricingRule(rule: Pricing): PricingRule {
  return {
    ...rule,
    baseWeightKg: toNumber(rule.baseWeightKg),
    baseCharge: toNumber(rule.baseCharge),
    perKgCharge: toNumber(rule.perKgCharge),
    expressSurcharge: toNumber(rule.expressSurcharge),
    sameDaySurcharge: toNumber(rule.sameDaySurcharge),
    riderPickupCharge: toNumber(rule.riderPickupCharge),
    codFeePercent: toNumber(rule.codFeePercent),
  };
}

export function findRule(
  rules: PricingRule[],
  zone: ZoneType,
  category: ParcelCategory,
) {
  return rules.find(
    (rule) => rule.zoneType === zone && rule.parcelCategory === category,
  );
}

/** Cheapest base charge in a zone, for "from ৳X" labels. */
export function lowestBaseCharge(rules: PricingRule[], zone: ZoneType) {
  const charges = rules
    .filter((rule) => rule.zoneType === zone)
    .map((rule) => rule.baseCharge);
  return charges.length ? Math.min(...charges) : null;
}

export function speedSurcharge(rule: PricingRule, speed: DeliverySpeed) {
  if (speed === "EXPRESS") return rule.expressSurcharge;
  if (speed === "SAME_DAY") return rule.sameDaySurcharge;
  return 0;
}

export type EstimateInput = {
  weightKg: number;
  speed: DeliverySpeed;
  pickup: PickupMethod;
  payment: PaymentMethod;
  /** Cash the rider collects from the customer. Only used for COD. */
  codAmount: number;
};

export type Estimate = {
  baseCharge: number;
  /** Whole kilograms charged above the rule's base weight. */
  extraKg: number;
  weightCharge: number;
  speedCharge: number;
  pickupCharge: number;
  codFee: number;
  total: number;
};

const roundMoney = (value: number) => Math.round(value * 100) / 100;

/**
 * Client-side estimate of a parcel's delivery charge.
 *
 * ASSUMPTIONS: keep these in sync with the backend's price calculation.
 * - Weight above `baseWeightKg` is charged per started kg, so 2.5 kg on a
 *   1 kg base is 2 extra kg.
 * - The COD fee is `codFeePercent` of the cash collected and only applies
 *   to cash-on-delivery parcels.
 * - The rider pickup charge is skipped when the parcel is dropped at a hub.
 */
export function estimateCharge(
  rule: PricingRule,
  input: EstimateInput,
): Estimate {
  const extraKg = Math.max(0, Math.ceil(input.weightKg - rule.baseWeightKg));
  const weightCharge = extraKg * rule.perKgCharge;
  const speedCharge = speedSurcharge(rule, input.speed);
  const pickupCharge =
    input.pickup === "RIDER_PICKUP" ? rule.riderPickupCharge : 0;
  const codFee =
    input.payment === "COD"
      ? roundMoney((Math.max(0, input.codAmount) * rule.codFeePercent) / 100)
      : 0;

  return {
    baseCharge: rule.baseCharge,
    extraKg,
    weightCharge,
    speedCharge,
    pickupCharge,
    codFee,
    total: roundMoney(
      rule.baseCharge + weightCharge + speedCharge + pickupCharge + codFee,
    ),
  };
}

const numberFormats = new Map<number, Intl.NumberFormat>();

/** `1500` → `৳1,500`, `12.5` → `৳12.50`. Uses lakh grouping (`৳1,00,000`). */
export function formatTaka(
  value: number,
  decimals = Number.isInteger(value) ? 0 : 2,
) {
  let format = numberFormats.get(decimals);
  if (!format) {
    format = new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    numberFormats.set(decimals, format);
  }
  return `৳${format.format(value)}`;
}

export function formatPercent(
  value: number,
  decimals = Number.isInteger(value) ? 0 : 1,
) {
  const num = Number(value);
  const safe = Number.isFinite(num) ? num : 0;
  const resolved = Number.isInteger(safe) ? 0 : decimals;
  return `${safe.toFixed(resolved)}%`;
}

export function formatKg(value: number) {
  const num = Number(value);
  const safe = Number.isFinite(num) ? num : 0;
  return `${Number.isInteger(safe) ? safe : safe.toFixed(1)} kg`;
}
