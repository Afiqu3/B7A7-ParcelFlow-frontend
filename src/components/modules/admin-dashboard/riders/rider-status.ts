import type { RiderApplicationStatus } from "@/types";

export const RIDER_APPLICATION_ORDER: RiderApplicationStatus[] = [
    "PENDING",
    "APPROVED",
    "REJECTED",
];

export const RIDER_APPLICATION_META: Record<
    RiderApplicationStatus,
    { label: string; short: string; tone: string }
> = {
    PENDING: {
        label: "Pending review",
        short: "Pending",
        tone: "bg-amber-500/10 text-amber-800 ring-amber-600/25",
    },
    APPROVED: {
        label: "Approved",
        short: "Approved",
        tone: "bg-emerald-600/10 text-emerald-700 ring-emerald-600/20",
    },
    REJECTED: {
        label: "Rejected",
        short: "Rejected",
        tone: "bg-secondary/8 text-secondary/65 ring-secondary/15",
    },
};

/** Pill classes for a rider application-status badge. */
export function applicationPill(status: RiderApplicationStatus) {
    return `inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-heading text-[11px] font-bold tracking-wide uppercase ring-1 ring-inset ${RIDER_APPLICATION_META[status].tone}`;
}

export const VEHICLE_LABELS: Record<string, string> = {
    BIKE: "Bike",
    BICYCLE: "Bicycle",
    VAN: "Van",
};

/** Pill classes for a rider user-status (ACTIVE/BLOCKED) badge. */
export function riderUserPill(active: boolean) {
    return `inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-heading text-[11px] font-bold tracking-wide uppercase ring-1 ring-inset ${
        active
            ? "bg-emerald-600/10 text-emerald-700 ring-emerald-600/20"
            : "bg-destructive/10 text-destructive ring-destructive/20"
    }`;
}
