"use client";

import {
    ArrowRight,
    Banknote,
    CircleAlert,
    MapPin,
    Package,
    RefreshCw,
    Wallet,
} from "lucide-react";
import type { ReactNode } from "react";
import { CATEGORIES, SPEEDS } from "@/components/modules/pricing/pricing-meta";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSingleParcelAsMerchant } from "@/hooks";
import { formatKg, formatTaka } from "@/lib/pricing";
import type { Parcel, TransactionStatus } from "@/types";
import {
    formatParcelDate,
    needsPayment,
    PARCEL_STATUS_META,
    statusDot,
    statusPill,
} from "./parcel-status";
import ParcelInvoiceButton from "./ParcelInvoiceButton";
import ParcelPayNowButton from "./ParcelPayNowButton";

const transactionTone: Record<TransactionStatus, string> = {
    PAID: "bg-emerald-600/10 text-emerald-700 ring-emerald-600/20",
    PENDING: "bg-amber-500/10 text-amber-800 ring-amber-600/25",
    FAILED: "bg-destructive/10 text-destructive ring-destructive/20",
    CANCELLED: "bg-secondary/8 text-secondary/65 ring-secondary/15",
    REFUNDED: "bg-brand/8 text-brand ring-brand/15",
};

function DetailRow({
    label,
    value,
    href,
}: {
    label: string;
    value: ReactNode;
    href?: string;
}) {
    return (
        <div className="min-w-0">
            <dt className="text-xs font-medium text-secondary/55">{label}</dt>
            <dd className="mt-0.5 truncate font-heading text-sm font-bold text-secondary">
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
    icon: typeof Package;
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

/** Full parcel information in a dialog, fetched fresh on open. */
export default function ParcelDetailsDialog({
    parcelId,
    onClose,
}: {
    parcelId: string;
    onClose: () => void;
}) {
    const { data, isPending, isError, error, refetch, isFetching } =
        useGetSingleParcelAsMerchant(parcelId);

    return (
        <Dialog
            open={parcelId !== ""}
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
        >
            <DialogContent className="max-h-[85svh] overflow-y-auto p-5 sm:max-w-2xl sm:p-6">
                {isPending || isError || !data?.data ? (
                    <>
                        <DialogState
                            isError={isError}
                            message={(error as Error)?.message}
                            retrying={isFetching}
                            onRetry={() => refetch()}
                        />
                        <DialogFooter showCloseButton />
                    </>
                ) : (
                    <>
                        <ParcelDetailsBody parcel={data.data} />
                        <DialogFooter showCloseButton>
                            <ParcelInvoiceButton
                                variant="full"
                                parcelId={data.data.id}
                                trackingId={data.data.trackingId}
                            />
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}

function DialogState({
    isError,
    message,
    retrying,
    onRetry,
}: {
    isError: boolean;
    message?: string;
    retrying: boolean;
    onRetry: () => void;
}) {
    if (!isError) {
        return (
            <div aria-hidden className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-24 w-full rounded-xl" />
                <Skeleton className="h-24 w-full rounded-xl" />
                <Skeleton className="h-32 w-full rounded-xl" />
                <span className="sr-only">Loading parcel details…</span>
            </div>
        );
    }
    return (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
            <span className="grid size-12 place-items-center rounded-2xl bg-destructive/10 text-destructive">
                <CircleAlert className="size-6" strokeWidth={2} />
            </span>
            <div>
                <DialogTitle>Couldn&apos;t load parcel details</DialogTitle>
                <DialogDescription className="mt-1">
                    {message ||
                        "Something went wrong. Please try again."}
                </DialogDescription>
            </div>
            <Button
                type="button"
                onClick={onRetry}
                disabled={retrying}
                className="h-10 rounded-xl bg-brand px-5 font-heading text-sm font-bold text-white transition hover:brightness-125 active:scale-[0.99] disabled:opacity-70"
            >
                <RefreshCw
                    className={`size-4 ${retrying ? "animate-spin" : ""}`}
                />
                {retrying ? "Retrying…" : "Try again"}
            </Button>
        </div>
    );
}

function ParcelDetailsBody({ parcel }: { parcel: Parcel }) {
    const transaction = parcel.transaction;
    const charges: { label: string; detail?: string; amount: number }[] = [
        { label: "Base charge", amount: parcel.baseCharge },
        ...(parcel.weightCharge > 0
            ? [
                  {
                      label: "Weight charge",
                      detail: formatKg(parcel.weightKg),
                      amount: parcel.weightCharge,
                  },
              ]
            : []),
        ...(parcel.deliveryTypeSurcharge > 0
            ? [
                  {
                      label: `${SPEEDS[parcel.deliveryType].label} surcharge`,
                      amount: parcel.deliveryTypeSurcharge,
                  },
              ]
            : []),
        ...(parcel.pickupModeCharge !== undefined &&
        parcel.pickupModeCharge > 0
            ? [
                  {
                      label: "Pickup charge",
                      amount: parcel.pickupModeCharge,
                  },
              ]
            : []),
        ...(parcel.paymentType === "COD"
            ? [{ label: "COD fee", amount: parcel.codFee }]
            : []),
    ];

    return (
        <>
            <DialogHeader>
                <DialogTitle className="font-mono text-base font-bold tracking-tight break-all">
                    {parcel.trackingId}
                </DialogTitle>
                <DialogDescription className="flex flex-wrap items-center gap-2">
                    <span className={statusPill(parcel.status)}>
                        <span
                            aria-hidden
                            className={statusDot(parcel.status)}
                        />
                        {PARCEL_STATUS_META[parcel.status].label}
                    </span>
                    <span>Booked {formatParcelDate(parcel.createdAt)}</span>
                </DialogDescription>
            </DialogHeader>

            <div className="grid gap-5 sm:grid-cols-2">
                <Block icon={MapPin} title="Pickup">
                    <dl className="flex flex-col gap-2 rounded-xl bg-secondary/[0.04] p-3.5 ring-1 ring-secondary/8 ring-inset">
                        <DetailRow
                            label="Contact"
                            value={`${parcel.pickupContactName} · ${parcel.pickupContactPhone}`}
                        />
                        <DetailRow
                            label="Address"
                            value={`${parcel.pickupAddressLine}, ${parcel.pickupDistrict}, ${parcel.pickupCity}`}
                        />
                        <DetailRow
                            label="Mode"
                            value={
                                parcel.pickupMode === "RIDER_PICKUP"
                                    ? "Rider pickup"
                                    : "Drop at hub"
                            }
                        />
                    </dl>
                </Block>

                <Block icon={ArrowRight} title="Delivery">
                    <dl className="flex flex-col gap-2 rounded-xl bg-secondary/[0.04] p-3.5 ring-1 ring-secondary/8 ring-inset">
                        <DetailRow
                            label="Recipient"
                            value={`${parcel.recipientName} · ${parcel.recipientPhone}`}
                        />
                        <DetailRow
                            label="Email"
                            value={parcel.recipientEmail}
                            href={`mailto:${parcel.recipientEmail}`}
                        />
                        <DetailRow
                            label="Address"
                            value={`${parcel.deliveryAddressLine}, ${parcel.deliveryDistrict}, ${parcel.deliveryCity}`}
                        />
                    </dl>
                </Block>

                <Block icon={Package} title="Parcel">
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 rounded-xl bg-secondary/[0.04] p-3.5 ring-1 ring-secondary/8 ring-inset">
                        <DetailRow
                            label="Category"
                            value={CATEGORIES[parcel.parcelCategory].label}
                        />
                        <DetailRow
                            label="Weight"
                            value={formatKg(parcel.weightKg)}
                        />
                        <DetailRow
                            label="Quantity"
                            value={parcel.itemQuantity ?? 1}
                        />
                        <DetailRow
                            label="Speed"
                            value={SPEEDS[parcel.deliveryType].label}
                        />
                        <DetailRow
                            label="Declared value"
                            value={
                                parcel.declaredValue !== undefined
                                    ? formatTaka(parcel.declaredValue)
                                    : "—"
                            }
                        />
                        <DetailRow
                            label="Description"
                            value={parcel.itemDescription}
                        />
                    </dl>
                    {parcel.note ? (
                        <p className="mt-2 rounded-xl bg-amber-500/8 px-3.5 py-2.5 text-[13px] leading-relaxed text-amber-900 ring-1 ring-amber-600/20 ring-inset">
                            <span className="font-heading font-bold">
                                Pickup note:{" "}
                            </span>
                            {parcel.note}
                        </p>
                    ) : null}
                </Block>

                <Block icon={Banknote} title="Charges">
                    <dl className="flex flex-col gap-1 rounded-xl bg-secondary/[0.04] p-3.5 text-sm ring-1 ring-secondary/8 ring-inset">
                        {charges.map((line) => (
                            <div
                                key={line.label}
                                className="flex items-baseline justify-between gap-3"
                            >
                                <dt className="text-secondary/70">
                                    {line.label}
                                    {line.detail ? (
                                        <span className="ml-1.5 text-xs text-secondary/50">
                                            {line.detail}
                                        </span>
                                    ) : null}
                                </dt>
                                <dd className="font-heading font-bold text-secondary tabular-nums">
                                    {formatTaka(line.amount)}
                                </dd>
                            </div>
                        ))}
                        <div className="mt-1.5 flex items-baseline justify-between gap-3 border-t border-secondary/10 pt-2.5">
                            <dt className="font-heading font-extrabold text-secondary">
                                Total
                            </dt>
                            <dd className="font-heading text-xl font-extrabold tracking-tight text-secondary tabular-nums">
                                {formatTaka(parcel.totalCharge)}
                            </dd>
                        </div>
                    </dl>
                </Block>

                <div className="sm:col-span-2">
                    <Block icon={Wallet} title="Payment">
                        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 rounded-xl bg-secondary/[0.04] p-3.5 ring-1 ring-secondary/8 ring-inset sm:grid-cols-4">
                            <DetailRow
                                label="Type"
                                value={
                                    parcel.paymentType === "COD"
                                        ? "Cash on delivery"
                                        : "Prepaid"
                                }
                            />
                            <DetailRow
                                label="COD amount"
                                value={
                                    parcel.codAmount !== undefined
                                        ? formatTaka(parcel.codAmount)
                                        : "—"
                                }
                            />
                            <DetailRow
                                label="Transaction"
                                value={
                                    transaction ? (
                                        <span
                                            className={`inline-flex rounded-full px-2 py-0.5 font-heading text-[11px] font-bold uppercase ring-1 ring-inset ${transactionTone[transaction.status]}`}
                                        >
                                            {transaction.status}
                                        </span>
                                    ) : (
                                        "—"
                                    )
                                }
                            />
                            <DetailRow
                                label="Transaction amount"
                                value={
                                    transaction
                                        ? `${formatTaka(transaction.amount)} ${transaction.currency}`
                                        : "—"
                                }
                            />
                            {transaction?.bkashTrxID ? (
                                <DetailRow
                                    label="bKash TrxID"
                                    value={transaction.bkashTrxID}
                                />
                            ) : null}
                            {transaction?.paidAt ? (
                                <DetailRow
                                    label="Paid at"
                                    value={formatParcelDate(transaction.paidAt)}
                                />
                            ) : null}
                        </dl>
                        {needsPayment(parcel) ? (
                            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                                <ParcelPayNowButton
                                    variant="dialog"
                                    parcelId={parcel.id}
                                    trackingId={parcel.trackingId}
                                    amount={parcel.transaction.amount}
                                />
                                <p className="text-xs text-secondary/55">
                                    Complete the bKash checkout to confirm this
                                    booking.
                                </p>
                            </div>
                        ) : null}
                    </Block>
                </div>

                {parcel.failureReason ||
                parcel.cancelReason ||
                parcel.deliveredAt ||
                parcel.returnedAt ||
                (parcel.reattemptCount ?? 0) > 0 ? (
                    <div className="sm:col-span-2">
                        <Block icon={RefreshCw} title="Delivery activity">
                            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 rounded-xl bg-secondary/[0.04] p-3.5 ring-1 ring-secondary/8 ring-inset sm:grid-cols-4">
                                {parcel.deliveredAt ? (
                                    <DetailRow
                                        label="Delivered at"
                                        value={formatParcelDate(
                                            parcel.deliveredAt,
                                        )}
                                    />
                                ) : null}
                                {parcel.returnedAt ? (
                                    <DetailRow
                                        label="Returned at"
                                        value={formatParcelDate(
                                            parcel.returnedAt,
                                        )}
                                    />
                                ) : null}
                                {(parcel.reattemptCount ?? 0) > 0 ? (
                                    <DetailRow
                                        label="Reattempts"
                                        value={`${parcel.reattemptCount} of ${parcel.maxReattempts ?? "—"}`}
                                    />
                                ) : null}
                                {parcel.failureReason ? (
                                    <DetailRow
                                        label="Failure reason"
                                        value={parcel.failureReason}
                                    />
                                ) : null}
                                {parcel.cancelReason ? (
                                    <DetailRow
                                        label="Cancel reason"
                                        value={parcel.cancelReason}
                                    />
                                ) : null}
                            </dl>
                        </Block>
                    </div>
                ) : null}
            </div>
        </>
    );
}
