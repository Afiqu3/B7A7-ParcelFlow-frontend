"use client";

import { AnimatePresence, motion } from "motion/react";
import {
    ArrowRight,
    Check,
    Copy,
    Eye,
    Loader2,
    MapPin,
    Truck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { FetchError } from "ofetch";
import { CATEGORIES, SPEEDS } from "@/components/modules/pricing/pricing-meta";
import {
    formatParcelDate,
    PARCEL_STATUS_META,
    statusDot,
    statusPill,
} from "@/components/modules/parcels/parcel-status";
import { Button } from "@/components/ui/button";
import { useParcelStatusUpdateAdmin } from "@/hooks";
import { formatTaka } from "@/lib/pricing";
import type { Parcel, ParcelStatus } from "@/types";
import AdminParcelCancel, { canAdminCancel } from "./AdminParcelCancel";

/** Next hub status for an actionable parcel, or null when terminal/early. */
function nextStatus(status: ParcelStatus): "AT_HUB" | "IN_TRANSIT" | null {
    if (status === "PICKED_UP") return "AT_HUB";
    if (status === "AT_HUB") return "IN_TRANSIT";
    return null;
}

const NEXT_LABEL: Record<"AT_HUB" | "IN_TRANSIT", string> = {
    AT_HUB: "At hub",
    IN_TRANSIT: "In transit",
};

/** One parcel in the admin grid: copy ID + hub-progress action. */
export default function AdminParcelCard({
    parcel,
    index,
    onView,
}: {
    parcel: Parcel;
    index: number;
    onView: (parcelId: string) => void;
}) {
    const [copied, setCopied] = useState(false);
    const target = nextStatus(parcel.status);
    const { mutate: advance, isPending } = useParcelStatusUpdateAdmin(
        parcel.id,
        target ? { status: target } : { status: "AT_HUB" },
    );

    const copyId = async () => {
        try {
            await navigator.clipboard.writeText(parcel.id);
            setCopied(true);
            toast.success("Parcel ID copied", {
                description: parcel.id,
            });
            window.setTimeout(() => setCopied(false), 1600);
        } catch {
            toast.error("Could not copy", {
                description: "Your browser blocked clipboard access.",
            });
        }
    };

    const handleAdvance = () => {
        if (!target) return;
        advance(undefined, {
            onSuccess: (res) => {
                if (
                    res &&
                    typeof res === "object" &&
                    "success" in res &&
                    !res.success
                ) {
                    toast.error("Could not update status", {
                        description:
                            "Something went wrong. Please try again.",
                    });
                    return;
                }
                toast.success(`Parcel moved to ${NEXT_LABEL[target]}`, {
                    description: parcel.trackingId,
                });
            },
            onError: (err: FetchError) => {
                toast.error("Could not update status", {
                    description:
                        err.data?.message ||
                        err.message ||
                        "Something went wrong. Please try again.",
                });
            },
        });
    };

    return (
        <article
            aria-label={`Parcel ${parcel.trackingId}`}
            className="flex min-w-0 flex-col rounded-2xl bg-card p-4 ring-1 ring-secondary/10 transition-[box-shadow,transform] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:fill-mode-backwards hover:shadow-[0_20px_40px_-28px_rgba(15,32,86,0.5)] sm:p-5"
            style={{ animationDelay: `${Math.min(index, 7) * 50}ms` }}
        >
            {/* Tracking + copy parcel ID */}
            <div className="flex items-center gap-2">
                <p className="min-w-0 flex-1 truncate font-mono text-[13px] font-bold tracking-tight text-secondary">
                    {parcel.trackingId}
                </p>
                <button
                    type="button"
                    onClick={copyId}
                    title="Copy parcel ID"
                    aria-label={
                        copied
                            ? "Parcel ID copied"
                            : `Copy parcel ID of ${parcel.trackingId}`
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
            <div className="mt-3 flex items-end justify-between gap-3 border-t border-secondary/8 pt-3">
                <p className="font-heading text-lg leading-none font-extrabold tracking-tight text-secondary">
                    {formatTaka(parcel.totalCharge)}
                </p>
                <p className="shrink-0 text-xs text-secondary/55">
                    {parcel.paymentType === "COD" &&
                    parcel.codAmount !== undefined
                        ? `COD ${formatTaka(parcel.codAmount)} · `
                        : "Prepaid · "}
                    {formatParcelDate(parcel.createdAt)}
                </p>
            </div>

            {/* Hub-progress action */}
            <AnimatePresence initial={false}>
                {target ? (
                    <motion.div
                        key={`advance-${target}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="overflow-hidden"
                    >
                        <Button
                            type="button"
                            disabled={isPending}
                            onClick={handleAdvance}
                            className="mt-3 h-10 w-full rounded-xl bg-brand font-heading text-[13px] font-bold text-white transition hover:brightness-125 active:scale-[0.99] disabled:opacity-70"
                        >
                            <AnimatePresence initial={false} mode="popLayout">
                                {isPending ? (
                                    <motion.span
                                        key="pending"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="inline-flex items-center gap-2"
                                    >
                                        <Loader2 className="size-4 animate-spin" />
                                        Updating…
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="idle"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="inline-flex items-center gap-2"
                                    >
                                        {target === "AT_HUB" ? (
                                            <Truck className="size-4" />
                                        ) : (
                                            <ArrowRight className="size-4" />
                                        )}
                                        Mark as {NEXT_LABEL[target]}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Button>
                    </motion.div>
                ) : null}
            </AnimatePresence>

            {/* View details + cancel */}
            <div className="mt-3 flex items-center gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => onView(parcel.id)}
                    className="h-10 flex-1 rounded-xl border-secondary/15 font-heading text-[13px] font-bold text-secondary hover:bg-brand hover:text-white hover:ring-brand"
                >
                    <Eye className="size-4" />
                    View details
                </Button>
                {canAdminCancel(parcel) ? (
                    <AdminParcelCancel parcel={parcel} />
                ) : null}
            </div>
        </article>
    );
}
