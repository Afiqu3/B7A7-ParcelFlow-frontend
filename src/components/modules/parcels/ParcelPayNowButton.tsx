"use client";

import { AnimatePresence, motion } from "motion/react";
import { Loader2, Wallet } from "lucide-react";
import { toast } from "sonner";
import type { FetchError } from "ofetch";
import { Button } from "@/components/ui/button";
import { usePaymentParcel } from "@/hooks";
import { formatTaka } from "@/lib/pricing";
import { cn } from "@/lib/utils";

function extractPaymentUrl(res: unknown): string | null {
    if (!res || typeof res !== "object") return null;
    if ("success" in res && !(res as { success: unknown }).success) {
        return null;
    }
    const data = (res as { data?: unknown }).data;
    if (!data || typeof data !== "object") return null;
    const url = (data as Record<string, unknown>).paymentUrl;
    return typeof url === "string" && url.length > 0 ? url : null;
}

/**
 * "Pay now" button for a parcel whose transaction is PENDING. Initiates the
 * bKash checkout, then redirects (same tab, no popup blockers) to the
 * `paymentUrl` from the payment response.
 */
export default function ParcelPayNowButton({
    parcelId,
    trackingId,
    amount,
    variant = "card",
}: {
    parcelId: string;
    trackingId: string;
    amount: number;
    variant?: "card" | "dialog";
}) {
    const { mutate: pay, isPending } = usePaymentParcel(parcelId);

    const handlePay = () =>
        pay(undefined, {
            onSuccess: (res) => {
                const url = extractPaymentUrl(res);
                if (!url) {
                    toast.error("Payment link unavailable", {
                        description:
                            "Something went wrong. Please try again.",
                    });
                    return;
                }
                toast.success("Redirecting to bKash", {
                    description: `Paying ${formatTaka(amount)} for ${trackingId}.`,
                });
                window.location.href = url;
            },
            onError: (err: FetchError) => {
                toast.error("Could not start payment", {
                    description:
                        err.data?.message ||
                        err.message ||
                        "Something went wrong. Please try again.",
                });
            },
        });

    if (variant === "dialog") {
        return (
            <Button
                type="button"
                disabled={isPending}
                onClick={handlePay}
                className="h-10 w-full rounded-xl bg-brand-orange px-4 font-heading text-sm font-bold text-brand-ink shadow-[0_12px_28px_-12px_var(--color-brand-orange)] transition hover:brightness-110 active:scale-[0.99] disabled:opacity-70 sm:w-auto"
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
                            Contacting bKash…
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
                            <Wallet className="size-4" />
                            Pay {formatTaka(amount)} now
                        </motion.span>
                    )}
                </AnimatePresence>
            </Button>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
        >
            <Button
                type="button"
                disabled={isPending}
                onClick={handlePay}
                className={cn(
                    "mt-3 h-11 w-full rounded-xl bg-brand-orange font-heading text-sm font-bold text-brand-ink",
                    "shadow-[0_12px_28px_-12px_var(--color-brand-orange)] transition hover:brightness-110 active:scale-[0.99] disabled:opacity-70",
                )}
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
                            Contacting bKash…
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
                            <Wallet className="size-4" />
                            Pay {formatTaka(amount)} now
                        </motion.span>
                    )}
                </AnimatePresence>
            </Button>
        </motion.div>
    );
}
