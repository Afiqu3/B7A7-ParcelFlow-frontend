import type { Parcel } from "@/types";

function num(value: unknown, fallback = 0): number {
    const parsed = typeof value === "number" ? value : Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function optNum(value: unknown): number | undefined {
    if (value === undefined || value === null || value === "") {
        return undefined;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
}

/**
 * Normalizes a parcel from the API. Prisma `Decimal` columns are
 * serialised as strings (e.g. `"2.5"`), while `Parcel` declares numbers —
 * without this, formatters like `formatKg` crash on `.toFixed`.
 */
export function toParcel(parcel: Parcel): Parcel {
    return {
        ...parcel,
        weightKg: num(parcel.weightKg),
        itemQuantity: optNum(parcel.itemQuantity),
        declaredValue: optNum(parcel.declaredValue),
        codAmount: optNum(parcel.codAmount),
        baseCharge: num(parcel.baseCharge),
        weightCharge: num(parcel.weightCharge),
        deliveryTypeSurcharge: num(parcel.deliveryTypeSurcharge),
        pickupModeCharge: optNum(parcel.pickupModeCharge),
        codFee: num(parcel.codFee),
        totalCharge: num(parcel.totalCharge),
        reattemptCount: optNum(parcel.reattemptCount),
        maxReattempts: optNum(parcel.maxReattempts),
        transaction: parcel.transaction
            ? {
                  ...parcel.transaction,
                  amount: num(parcel.transaction.amount),
              }
            : parcel.transaction,
    };
}
