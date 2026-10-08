"use client";

import {
    ArrowRight,
    CircleAlert,
    ReceiptText,
    RefreshCw,
    Wallet,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants";
import { useGetAllMyTransactions } from "@/hooks";
import { cn } from "@/lib/utils";
import type { Transaction } from "@/types";
import TransactionDetailsDialog from "./TransactionDetailsDialog";
import TransactionPager from "./TransactionPager";
import TransactionRow from "./TransactionRow";

const PAGE_LIMIT = 10;

/** Merchant transaction history: ledger rows, details dialog, pagination. */
export default function Transactions() {
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState<Transaction | null>(null);

    const { data, isPending, isError, error, refetch, isFetching } =
        useGetAllMyTransactions({
            page,
            limit: PAGE_LIMIT,
            sortOrder: "desc",
        });

    const transactions = data?.data ?? [];
    const total = data?.meta?.total ?? transactions.length;
    const totalPages = Math.max(1, data?.meta?.totalPages ?? 1);
    const safePage = Math.min(page, totalPages);
    const refreshing = isFetching && !isPending;

    return (
        <div className="flex min-w-0 flex-col gap-5">
            <div
                className="overflow-hidden rounded-2xl bg-card ring-1 ring-secondary/10 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:fill-mode-backwards"
                style={{ animationDelay: "80ms" }}
            >
                <div className="flex items-center gap-2 border-b border-secondary/8 bg-linear-to-r from-brand-cream via-brand-cream/40 to-transparent px-5 py-4 sm:px-6">
                    <Wallet
                        aria-hidden
                        className="size-4 text-brand"
                        strokeWidth={2.25}
                    />
                    <p
                        aria-live="polite"
                        className="font-heading text-[13px] font-bold text-secondary"
                    >
                        {isPending
                            ? "Loading transactions…"
                            : `${total} transaction${total === 1 ? "" : "s"}`}
                    </p>
                    {refreshing ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/8 px-2.5 py-0.5 font-heading text-[11px] font-bold text-brand">
                            <RefreshCw className="size-3 animate-spin" />
                            Updating…
                        </span>
                    ) : null}
                </div>

                {isPending ? (
                    <TransactionSkeleton />
                ) : isError || !data ? (
                    <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
                        <span className="grid size-12 place-items-center rounded-2xl bg-destructive/10 text-destructive">
                            <CircleAlert
                                className="size-6"
                                strokeWidth={2}
                            />
                        </span>
                        <div>
                            <h2 className="font-heading text-lg font-extrabold tracking-tight text-secondary">
                                Couldn&apos;t load transactions
                            </h2>
                            <p className="mx-auto mt-1 max-w-sm text-sm text-secondary/65">
                                {(error as Error)?.message ||
                                    "Something went wrong. Please try again."}
                            </p>
                        </div>
                        <Button
                            type="button"
                            onClick={() => refetch()}
                            disabled={isFetching}
                            className="h-10 rounded-xl bg-brand px-5 font-heading text-sm font-bold text-white transition hover:brightness-125 active:scale-[0.99] disabled:opacity-70"
                        >
                            <RefreshCw
                                className={`size-4 ${isFetching ? "animate-spin" : ""}`}
                            />
                            {isFetching ? "Retrying…" : "Try again"}
                        </Button>
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 px-6 py-12 text-center sm:py-16">
                        <span className="grid size-14 place-items-center rounded-2xl bg-brand/8 text-brand ring-1 ring-brand/10 ring-inset">
                            <ReceiptText
                                className="size-7"
                                strokeWidth={2}
                            />
                        </span>
                        <div>
                            <h2 className="font-heading text-lg font-extrabold tracking-tight text-secondary">
                                No transactions yet
                            </h2>
                            <p className="mx-auto mt-1 max-w-sm text-sm text-secondary/65">
                                Payments for your bookings will appear here
                                with their bKash references.
                            </p>
                        </div>
                        <Button
                            asChild
                            className="h-11 rounded-xl bg-brand-orange px-6 font-heading text-sm font-bold text-brand-ink shadow-[0_12px_28px_-12px_var(--color-brand-orange)] transition hover:brightness-110 active:scale-[0.99]"
                        >
                            <Link href={ROUTES.newParcel}>
                                Book your first parcel
                                <ArrowRight className="size-4" />
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <ul
                        key={safePage}
                        aria-busy={refreshing}
                        className={cn(
                            "divide-y divide-secondary/8 transition-opacity",
                            refreshing && "opacity-70",
                        )}
                    >
                        {transactions.map((transaction, index) => (
                            <TransactionRow
                                key={transaction.id}
                                transaction={transaction}
                                index={index}
                                onView={setSelected}
                            />
                        ))}
                    </ul>
                )}
            </div>

            {!isPending && !isError && data ? (
                <TransactionPager
                    page={safePage}
                    totalPages={totalPages}
                    onChange={setPage}
                />
            ) : null}

            <TransactionDetailsDialog
                transaction={selected}
                onClose={() => setSelected(null)}
            />
        </div>
    );
}

function TransactionSkeleton() {
    return (
        <ul aria-hidden className="divide-y divide-secondary/8">
            {Array.from({ length: 6 }).map((_, index) => (
                <li
                    // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholders
                    key={index}
                    className="flex items-center gap-4 px-5 py-4 sm:px-6"
                >
                    <Skeleton className="size-10 shrink-0 rounded-xl" />
                    <div className="min-w-0 flex-1">
                        <Skeleton className="h-4 w-2/5" />
                        <Skeleton className="mt-2 h-3 w-3/5" />
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-5 w-16" />
                    </div>
                </li>
            ))}
            <span className="sr-only">Loading transactions…</span>
        </ul>
    );
}
