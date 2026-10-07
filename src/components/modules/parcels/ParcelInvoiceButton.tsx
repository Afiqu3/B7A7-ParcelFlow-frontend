"use client";

import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDownloadInvoice } from "@/hooks";
import { cn } from "@/lib/utils";

/**
 * Invoice download button for a parcel. `icon` fits the card action row;
 * `full` fits dialog footers and other wide spots.
 */
export default function ParcelInvoiceButton({
    parcelId,
    trackingId,
    variant = "icon",
}: {
    parcelId: string;
    trackingId: string;
    variant?: "icon" | "full";
}) {
    const { mutate: download, isPending } = useDownloadInvoice();

    if (variant === "full") {
        return (
            <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={() => download(parcelId)}
                className="h-10 rounded-xl border-secondary/15 font-heading text-sm font-bold text-secondary hover:bg-secondary/5 hover:text-secondary"
            >
                {isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                ) : (
                    <Download className="size-4" />
                )}
                {isPending ? "Preparing…" : "Invoice"}
            </Button>
        );
    }

    return (
        <button
            type="button"
            onClick={() => download(parcelId)}
            disabled={isPending}
            title="Download invoice"
            aria-label={
                isPending
                    ? `Preparing invoice for ${trackingId}`
                    : `Download invoice for ${trackingId}`
            }
            className={cn(
                "grid size-9 place-items-center rounded-xl text-secondary/60 outline-none transition-all hover:bg-secondary/8 hover:text-secondary focus-visible:ring-2 focus-visible:ring-brand-orange/50 active:scale-95 disabled:opacity-60",
                isPending && "animate-pulse",
            )}
        >
            {isPending ? (
                <Loader2 className="size-4 animate-spin" />
            ) : (
                <Download className="size-4" strokeWidth={2.25} />
            )}
        </button>
    );
}
