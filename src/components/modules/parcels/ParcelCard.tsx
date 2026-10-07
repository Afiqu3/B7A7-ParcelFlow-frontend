"use client";

import { Check, Copy, Eye, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CATEGORIES, SPEEDS } from "@/components/modules/pricing/pricing-meta";
import { Button } from "@/components/ui/button";
import { formatTaka } from "@/lib/pricing";
import type { Parcel } from "@/types";
import {
    formatParcelDate,
    needsPayment,
    PARCEL_STATUS_META,
    statusDot,
    statusPill,
} from "./parcel-status";
import ParcelCardDangerActions from "./ParcelCardDangerActions";
import ParcelInvoiceButton from "./ParcelInvoiceButton";
import ParcelPayNowButton from "./ParcelPayNowButton";

function useCopyTracking() {
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const copy = async (parcel: Parcel) => {
        try {
            await navigator.clipboard.writeText(parcel.trackingId);
            setCopiedId(parcel.id);
            toast.success("Tracking ID copied", {
                description: parcel.trackingId,
            });
            window.setTimeout(() => {
                setCopiedId((current) =>
                    current === parcel.id ? null : current,
                );
            }, 1600);
        } catch {
            toast.error("Could not copy", {
                description: "Your browser blocked clipboard access.",
            });
        }
    };

    return { copiedId, copy };
}

/** One parcel in the merchant's parcel grid. */
export default function ParcelCard({
    parcel,
    index,
    onView,
}: {
    parcel: Parcel;
    index: number;
    onView: (parcelId: string) => void;
}) {
    const { copiedId, copy } = useCopyTracking();
    const copied = copiedId === parcel.id;

    return (
        <article
            aria-label={`Parcel ${parcel.trackingId}`}
            className="flex min-w-0 flex-col rounded-2xl bg-card p-4 ring-1 ring-secondary/10 transition-[box-shadow,transform] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:fill-mode-backwards hover:shadow-[0_20px_40px_-28px_rgba(15,32,86,0.5)] sm:p-5"
            style={{ animationDelay: `${Math.min(index, 7) * 50}ms` }}
        >
            {/* Tracking + copy */}
            <div className="flex items-center gap-2">
                <p className="min-w-0 flex-1 truncate font-mono text-[13px] font-bold tracking-tight text-secondary">
                    {parcel.trackingId}
                </p>
                <button
                    type="button"
                    onClick={() => copy(parcel)}
                    aria-label={
                        copied
                            ? "Tracking ID copied"
                            : `Copy tracking ID ${parcel.trackingId}`
                    }
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
            </div>

            {/* Status + category */}
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                <span className={statusPill(parcel.status)}>
                    <span aria-hidden className={statusDot(parcel.status)} />
                    {PARCEL_STATUS_META[parcel.status].label}
                </span>
                <span className="inline-flex items-center rounded-full bg-secondary/5 px-2.5 py-1 font-heading text-[11px] font-bold text-secondary/60 ring-1 ring-secondary/10 ring-inset">
                    {CATEGORIES[parcel.parcelCategory].label} ·{" "}
                    {SPEEDS[parcel.deliveryType].label}
                </span>
            </div>

            {/* Route */}
            <p className="mt-3 flex min-w-0 items-start gap-1.5 text-[13px] text-secondary/70">
                <MapPin
                    aria-hidden
                    className="mt-0.5 size-3.5 shrink-0 text-brand"
                    strokeWidth={2.25}
                />
                <span className="min-w-0">
                    <span className="block truncate font-semibold text-secondary">
                        {parcel.recipientName}
                    </span>
                    <span className="block truncate">
                        {parcel.deliveryDistrict}, {parcel.deliveryCity}
                    </span>
                </span>
            </p>

            {/* Charge + date */}
            <div className="mt-3 flex items-end justify-between gap-2 border-t border-secondary/8 pt-3">
                <div className="min-w-0 flex-1">
                    <p className="font-heading text-lg leading-none font-extrabold tracking-tight text-secondary">
                        {formatTaka(parcel.totalCharge)}
                    </p>
                    <p className="mt-1 truncate text-xs text-secondary/55">
                        {parcel.paymentType === "COD" &&
                        parcel.codAmount !== undefined
                            ? `COD ${formatTaka(parcel.codAmount)} · `
                            : "Prepaid · "}
                        {formatParcelDate(parcel.createdAt)}
                    </p>
                </div>
                <span className="flex shrink-0 items-center gap-1.5">
                    <ParcelCardDangerActions parcel={parcel} />
                    <ParcelInvoiceButton
                        parcelId={parcel.id}
                        trackingId={parcel.trackingId}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onView(parcel.id)}
                        className="h-9 shrink-0 rounded-xl border-secondary/15 px-3 font-heading text-xs font-bold text-secondary hover:bg-brand hover:text-white hover:ring-brand"
                    >
                        <Eye className="size-4" />
                        <span className="hidden min-[380px]:inline">
                            View details
                        </span>
                        <span className="sr-only min-[380px]:hidden">
                            View details
                        </span>
                    </Button>
                </span>
            </div>
            {needsPayment(parcel) ? (
                <ParcelPayNowButton
                    parcelId={parcel.id}
                    trackingId={parcel.trackingId}
                    amount={parcel.transaction.amount}
                />
            ) : null}
        </article>
    );
}
