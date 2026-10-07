import type { Parcel, ParcelStatus } from "@/types";

export const PARCEL_STATUS_ORDER: ParcelStatus[] = [
    "CREATED",
    "PICKUP_ASSIGNED",
    "PICKED_UP",
    "AT_HUB",
    "IN_TRANSIT",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "DELIVERY_FAILED",
    "RETURNED_TO_MERCHANT",
    "CANCELLED",
];

type StatusTone = "brand" | "amber" | "emerald" | "destructive" | "muted";

export const PARCEL_STATUS_META: Record<
    ParcelStatus,
    { label: string; short: string; tone: StatusTone }
> = {
    CREATED: { label: "Created", short: "Created", tone: "brand" },
    PICKUP_ASSIGNED: {
        label: "Pickup assigned",
        short: "Assigned",
        tone: "brand",
    },
    PICKED_UP: { label: "Picked up", short: "Picked up", tone: "brand" },
    AT_HUB: { label: "At hub", short: "At hub", tone: "amber" },
    IN_TRANSIT: { label: "In transit", short: "In transit", tone: "amber" },
    OUT_FOR_DELIVERY: {
        label: "Out for delivery",
        short: "Out for delivery",
        tone: "amber",
    },
    DELIVERED: { label: "Delivered", short: "Delivered", tone: "emerald" },
    DELIVERY_FAILED: {
        label: "Delivery failed",
        short: "Failed",
        tone: "destructive",
    },
    RETURNED_TO_MERCHANT: {
        label: "Returned to merchant",
        short: "Returned",
        tone: "muted",
    },
    CANCELLED: { label: "Cancelled", short: "Cancelled", tone: "muted" },
};

const tonePill: Record<StatusTone, string> = {
    brand: "bg-brand/8 text-brand ring-brand/15",
    amber: "bg-amber-500/10 text-amber-800 ring-amber-600/25",
    emerald: "bg-emerald-600/10 text-emerald-700 ring-emerald-600/20",
    destructive: "bg-destructive/10 text-destructive ring-destructive/20",
    muted: "bg-secondary/8 text-secondary/65 ring-secondary/15",
};

const toneDot: Record<StatusTone, string> = {
    brand: "bg-brand",
    amber: "bg-amber-500",
    emerald: "bg-emerald-600",
    destructive: "bg-destructive",
    muted: "bg-secondary/40",
};

/** Pill classes for a parcel status badge. */
export function statusPill(status: ParcelStatus) {
    return `inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-heading text-[11px] font-bold tracking-wide uppercase ring-1 ring-inset ${tonePill[PARCEL_STATUS_META[status].tone]}`;
}

/** Dot classes for a parcel status badge. */
export function statusDot(status: ParcelStatus) {
    return `size-1.5 rounded-full ${toneDot[PARCEL_STATUS_META[status].tone]}`;
}

/** Whether a parcel still needs online payment: it has a transaction
 *  whose status is PENDING or FAILED. PAID, REFUNDED and CANCELLED need
 *  no further payment. Narrows `transaction` to defined for the pay
 *  button amount. */
export function needsPayment(
    parcel: Parcel,
): parcel is Parcel & { transaction: NonNullable<Parcel["transaction"]> } {
    const status = parcel.transaction?.status;
    return status === "PENDING" || status === "FAILED";
}

export function formatParcelDate(iso: string | undefined) {
    if (!iso) return "—";
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}
