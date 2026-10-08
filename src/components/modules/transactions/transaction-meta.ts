import type { TransactionStatus } from "@/types";

export const TRANSACTION_STATUS_TONE: Record<TransactionStatus, string> = {
    PAID: "bg-emerald-600/10 text-emerald-700 ring-emerald-600/20",
    PENDING: "bg-amber-500/10 text-amber-800 ring-amber-600/25",
    FAILED: "bg-destructive/10 text-destructive ring-destructive/20",
    CANCELLED: "bg-secondary/8 text-secondary/65 ring-secondary/15",
    REFUNDED: "bg-brand/8 text-brand ring-brand/15",
};

/** Decimal strings from the API (`"1500"`) → number, else `null`. */
export function parseTransactionAmount(raw: string | undefined): number | null {
    if (raw === undefined) return null;
    const value = Number(raw);
    return Number.isFinite(value) ? value : null;
}
