"use client";

import { Check, Copy, Landmark, ReceiptText, Undo2, Wallet } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { ReactNode } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { formatTaka } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { formatBackendDate, formatBackendDateTime } from "@/utils";
import type { Transaction } from "@/types";
import {
    parseTransactionAmount,
    TRANSACTION_STATUS_TONE,
} from "./transaction-meta";

function DetailRow({
    label,
    value,
    href,
    mono,
}: {
    label: string;
    value: ReactNode;
    href?: string;
    mono?: boolean;
}) {
    return (
        <div className="min-w-0">
            <dt className="text-xs font-medium text-secondary/55">{label}</dt>
            <dd
                className={cn(
                    "mt-0.5 truncate font-heading text-sm font-bold text-secondary",
                    mono && "font-mono tracking-tight",
                )}
            >
                {href ? (
                    <a
                        href={href}
                        className="underline-offset-4 outline-none transition-colors hover:text-brand hover:underline focus-visible:text-brand focus-visible:underline"
                    >
                        {value}
                    </a>
                ) : (
                    value
                )}
            </dd>
        </div>
    );
}

function Block({
    icon: Icon,
    title,
    children,
}: {
    icon: typeof Wallet;
    title: string;
    children: ReactNode;
}) {
    return (
        <section aria-label={title} className="min-w-0">
            <h3 className="flex items-center gap-2 font-heading text-[13px] font-extrabold tracking-tight text-secondary">
                <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-brand/8 text-brand ring-1 ring-brand/10 ring-inset">
                    <Icon className="size-3.5" strokeWidth={2.25} />
                </span>
                {title}
            </h3>
            <div className="mt-2.5">{children}</div>
        </section>
    );
}

function CopyButton({ value, label }: { value: string; label: string }) {
    const [copied, setCopied] = useState(false);

    return (
        <button
            type="button"
            onClick={async () => {
                try {
                    await navigator.clipboard.writeText(value);
                    setCopied(true);
                    toast.success("Copied", { description: value });
                    window.setTimeout(() => setCopied(false), 1600);
                } catch {
                    toast.error("Could not copy", {
                        description: "Your browser blocked clipboard access.",
                    });
                }
            }}
            aria-label={copied ? `${label} copied` : `Copy ${label}`}
            className="grid size-7 shrink-0 place-items-center rounded-lg text-secondary/45 outline-none transition-colors hover:bg-secondary/8 hover:text-secondary focus-visible:ring-2 focus-visible:ring-brand-orange/50"
        >
            {copied ? (
                <Check
                    className="size-3.5 text-emerald-600"
                    strokeWidth={2.75}
                />
            ) : (
                <Copy className="size-3.5" />
            )}
        </button>
    );
}

/** Full transaction record with titled sections. No fetch needed — the
 *  row already carries the complete transaction. */
export default function TransactionDetailsDialog({
    transaction,
    onClose,
}: {
    transaction: Transaction | null;
    onClose: () => void;
}) {
    return (
        <Dialog
            open={transaction !== null}
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
        >
            <DialogContent className="max-h-[85svh] overflow-y-auto p-5 sm:max-w-lg sm:p-6">
                {transaction ? (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex flex-wrap items-center gap-2 font-heading text-base font-extrabold tracking-tight">
                                <span
                                    className={cn(
                                        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase ring-1 ring-inset",
                                        TRANSACTION_STATUS_TONE[
                                            transaction.status
                                        ],
                                    )}
                                >
                                    {transaction.status}
                                </span>
                                <span className="tabular-nums">
                                    {(() => {
                                        const amount = parseTransactionAmount(
                                            transaction.amount,
                                        );
                                        return amount !== null
                                            ? formatTaka(amount)
                                            : "—";
                                    })()}
                                </span>
                            </DialogTitle>
                            <DialogDescription>
                                Paid{" "}
                                {formatBackendDateTime(transaction.paidAt) ===
                                "—"
                                    ? "date not recorded"
                                    : formatBackendDateTime(transaction.paidAt)}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-5">
                            <Block icon={ReceiptText} title="Transaction">
                                <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 rounded-xl bg-secondary/[0.04] p-3.5 ring-1 ring-secondary/8 ring-inset">
                                    <DetailRow
                                        label="Transaction ID"
                                        value={transaction.id}
                                        mono
                                    />
                                    <DetailRow
                                        label="Status"
                                        value={transaction.status}
                                    />
                                    <DetailRow
                                        label="Amount"
                                        value={(() => {
                                            const amount =
                                                parseTransactionAmount(
                                                    transaction.amount,
                                                );
                                            return amount !== null
                                                ? formatTaka(amount)
                                                : "—";
                                        })()}
                                    />
                                    <DetailRow
                                        label="Currency"
                                        value={transaction.currency}
                                    />
                                </dl>
                            </Block>

                            <Block icon={Landmark} title="Gateway">
                                <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 rounded-xl bg-secondary/[0.04] p-3.5 ring-1 ring-secondary/8 ring-inset">
                                    {transaction.bkashTrxID ? (
                                        <div className="col-span-2 flex items-end justify-between gap-2">
                                            <DetailRow
                                                label="bKash TrxID"
                                                value={transaction.bkashTrxID}
                                                mono
                                            />
                                            <CopyButton
                                                value={transaction.bkashTrxID}
                                                label="bKash TrxID"
                                            />
                                        </div>
                                    ) : (
                                        <p className="col-span-2 text-[13px] text-secondary/60">
                                            No gateway reference recorded for
                                            this transaction yet.
                                        </p>
                                    )}
                                </dl>
                            </Block>

                            {transaction.refundedAmount !== undefined ||
                            transaction.refundReason ? (
                                <Block icon={Undo2} title="Refund">
                                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 rounded-xl bg-secondary/[0.04] p-3.5 ring-1 ring-secondary/8 ring-inset">
                                        <DetailRow
                                            label="Refunded amount"
                                            value={(() => {
                                                const amount =
                                                    parseTransactionAmount(
                                                        transaction.refundedAmount,
                                                    );
                                                return amount !== null
                                                    ? formatTaka(amount)
                                                    : "—";
                                            })()}
                                        />
                                        <DetailRow
                                            label="Refunded at"
                                            value={formatBackendDateTime(
                                                transaction.refundedAt,
                                            )}
                                        />
                                        {transaction.refundTxID ? (
                                            <DetailRow
                                                label="Refund TxID"
                                                value={transaction.refundTxID}
                                                mono
                                            />
                                        ) : null}
                                        {transaction.refundReason ? (
                                            <DetailRow
                                                label="Reason"
                                                value={transaction.refundReason}
                                            />
                                        ) : null}
                                    </dl>
                                </Block>
                            ) : null}

                            <Block icon={Wallet} title="Parcel">
                                <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 rounded-xl bg-secondary/[0.04] p-3.5 ring-1 ring-secondary/8 ring-inset">
                                    <div className="col-span-2 flex items-end justify-between gap-2">
                                        <DetailRow
                                            label="Tracking ID"
                                            value={
                                                transaction.parcel.trackingId
                                            }
                                            mono
                                        />
                                        <CopyButton
                                            value={
                                                transaction.parcel.trackingId
                                            }
                                            label="tracking ID"
                                        />
                                    </div>
                                    <DetailRow
                                        label="Merchant"
                                        value={transaction.parcel.merchant.name}
                                    />
                                </dl>
                            </Block>
                        </div>

                        <DialogFooter showCloseButton />
                    </>
                ) : null}
            </DialogContent>
        </Dialog>
    );
}
