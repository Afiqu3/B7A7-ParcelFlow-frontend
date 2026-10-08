"use client";

import { ChevronRight, Store, Wallet } from "lucide-react";
import { formatTaka } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { formatBackendDate } from "@/utils";
import type { Transaction } from "@/types";
import {
    parseTransactionAmount,
    TRANSACTION_STATUS_TONE,
} from "@/components/modules/transactions/transaction-meta";

/** One ledger row with merchant attribution and a details affordance. */
export default function TransactionRow({
    transaction,
    index,
    onView,
}: {
    transaction: Transaction;
    index: number;
    onView: (transaction: Transaction) => void;
}) {
    const amount = parseTransactionAmount(transaction.amount);
    const refunded = transaction.refundedAmount
        ? parseTransactionAmount(transaction.refundedAmount)
        : null;

    return (
        <li
            className="flex min-w-0 flex-col gap-2.5 px-5 py-4 transition-colors motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:fill-mode-backwards hover:bg-secondary/[0.03] sm:flex-row sm:items-center sm:gap-4 sm:px-6"
            style={{ animationDelay: `${Math.min(index, 7) * 50}ms` }}
        >
            <span className="grid size-10 shrink-0 place-items-center self-start rounded-xl bg-brand/8 text-brand ring-1 ring-brand/10 ring-inset sm:self-center">
                <Wallet className="size-4.5" strokeWidth={2.25} />
            </span>

            <span className="min-w-0 flex-1">
                <span className="block truncate font-mono text-[13px] font-bold tracking-tight text-secondary">
                    {transaction.parcel.trackingId}
                </span>
                <span className="mt-0.5 flex min-w-0 items-center gap-1 truncate text-xs text-secondary/55">
                    <Store aria-hidden className="size-3 shrink-0" />
                    <span className="truncate font-semibold">
                        {transaction.parcel.merchant.name}
                    </span>
                </span>
                <span className="mt-0.5 block truncate text-xs text-secondary/55">
                    {[
                        transaction.bkashTrxID,
                        formatBackendDate(transaction.paidAt),
                    ]
                        .filter((part) => part && part !== "—")
                        .join(" · ") || "No gateway reference yet"}
                </span>
                {refunded !== null ? (
                    <span className="mt-0.5 block truncate text-xs font-semibold text-brand">
                        Refunded {formatTaka(refunded)}
                        {transaction.refundReason
                            ? ` · ${transaction.refundReason}`
                            : ""}
                    </span>
                ) : null}
            </span>

            <span className="flex shrink-0 items-center gap-2.5 sm:gap-3">
                <span
                    className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-1 font-heading text-[11px] font-bold tracking-wide uppercase ring-1 ring-inset",
                        TRANSACTION_STATUS_TONE[transaction.status],
                    )}
                >
                    {transaction.status}
                </span>
                <span className="font-heading text-base font-extrabold tracking-tight text-secondary tabular-nums sm:text-lg">
                    {amount !== null ? formatTaka(amount) : "—"}
                </span>
                <button
                    type="button"
                    onClick={() => onView(transaction)}
                    title="View transaction details"
                    aria-label={`View details for ${transaction.parcel.trackingId}`}
                    className="grid size-9 shrink-0 place-items-center rounded-xl text-secondary/50 outline-none transition-all hover:bg-brand hover:text-white focus-visible:ring-2 focus-visible:ring-brand-orange/50 active:scale-95"
                >
                    <ChevronRight className="size-4.5" strokeWidth={2.25} />
                </button>
            </span>
        </li>
    );
}
