export type ZoneType =
    | "INSIDE_CITY" // same city (Dhaka -> Dhaka)
    | "SUB_CITY" // nearby district, same division
    | "OUTSIDE_CITY"; // other division / nationwide

/** What is being shipped. Each zone has one pricing rule per category. */
export type ParcelCategory = "PARCEL" | "DOCUMENT";

/** How fast it is delivered. Picked per parcel, priced as a surcharge. */
export type DeliverySpeed =
    | "REGULAR" // 48-72h
    | "EXPRESS" // 24h
    | "SAME_DAY";

/** Prisma `Decimal` columns are serialised as strings, e.g. "60". */
type DecimalString = string;

/** A pricing rule exactly as `GET /rule` returns it. */
export interface Pricing {
    id: string;
    name: string;
    zoneType: ZoneType;
    parcelCategory: ParcelCategory;
    baseWeightKg: DecimalString;
    baseCharge: DecimalString;
    perKgCharge: DecimalString;
    expressSurcharge: DecimalString;
    sameDaySurcharge: DecimalString;
    riderPickupCharge: DecimalString;
    codFeePercent: DecimalString;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

type DecimalField =
    | "baseWeightKg"
    | "baseCharge"
    | "perKgCharge"
    | "expressSurcharge"
    | "sameDaySurcharge"
    | "riderPickupCharge"
    | "codFeePercent";

/** A pricing rule with its decimal fields parsed into numbers. */
export type PricingRule = Omit<Pricing, DecimalField> &
    Record<DecimalField, number>;

export interface CreatePricingRulePayload {
    name: string;

    zoneType: ZoneType;
    parcelCategory: ParcelCategory;

    baseWeightKg?: number;
    baseCharge: number;
    perKgCharge: number;

    expressSurcharge?: number;
    sameDaySurcharge?: number;

    riderPickupCharge?: number;

    codFeePercent?: number;

    isActive?: boolean;
}

export type UpdatePricingRulePayload = Partial<CreatePricingRulePayload>;
