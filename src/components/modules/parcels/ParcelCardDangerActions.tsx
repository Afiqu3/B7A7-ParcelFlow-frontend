"use client";

import { AnimatePresence, motion } from "motion/react";
import { Ban, Loader2, Trash2, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { FetchError } from "ofetch";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
    useCancelParcelByMerchant,
    useDeleteParcelByMerchant,
} from "@/hooks";
import { cn } from "@/lib/utils";
import type { Parcel } from "@/types";

type ConfirmMode = "cancel" | "delete";

const canCancelStatus = (status: Parcel["status"]) =>
    status === "CREATED" || status === "PICKUP_ASSIGNED";

const canDeleteStatus = (status: Parcel["status"]) => status === "CREATED";

/**
 * Cancel + delete icon buttons for a parcel card, each guarded by a
 * confirm dialog. Rendered alongside "View details"; renders nothing
 * when the parcel status allows neither action.
 */
export default function ParcelCardDangerActions({
    parcel,
}: {
    parcel: Parcel;
}) {
    const [confirm, setConfirm] = useState<ConfirmMode | null>(null);
    const [reason, setReason] = useState("");
    const [reasonError, setReasonError] = useState<string | null>(null);

    const { mutate: cancelParcel, isPending: cancelling } =
        useCancelParcelByMerchant(parcel.id, {
            cancelReason: reason.trim() || undefined,
        });
    const { mutate: deleteParcel, isPending: deleting } =
        useDeleteParcelByMerchant(parcel.id);
    const busy = cancelling || deleting;

    if (!canCancelStatus(parcel.status) && !canDeleteStatus(parcel.status)) {
        return null;
    }

    const close = () => {
        if (busy) return;
        setConfirm(null);
        setReason("");
        setReasonError(null);
    };

    const confirmCancel = () => {
        const trimmed = reason.trim();
        if (trimmed.length === 1) {
            setReasonError(
                "If you give a reason, it must be at least 2 characters.",
            );
            return;
        }
        cancelParcel(undefined, {
            onSuccess: (res) => {
                if (
                    res &&
                    typeof res === "object" &&
                    "success" in res &&
                    !res.success
                ) {
                    toast.error("Could not cancel parcel", {
                        description:
                            "Something went wrong. Please try again.",
                    });
                    return;
                }
                toast.success("Parcel cancelled", {
                    description: parcel.trackingId,
                });
                setConfirm(null);
                setReason("");
                setReasonError(null);
            },
            onError: (err: FetchError) => {
                toast.error("Could not cancel parcel", {
                    description:
                        err.data?.message ||
                        err.message ||
                        "Something went wrong. Please try again.",
                });
            },
        });
    };

    const confirmDelete = () => {
        deleteParcel(undefined, {
            onSuccess: (res) => {
                if (
                    res &&
                    typeof res === "object" &&
                    "success" in res &&
                    !res.success
                ) {
                    toast.error("Could not delete parcel", {
                        description:
                            "Something went wrong. Please try again.",
                    });
                    return;
                }
                toast.success("Parcel deleted", {
                    description: parcel.trackingId,
                });
                setConfirm(null);
            },
            onError: (err: FetchError) => {
                toast.error("Could not delete parcel", {
                    description:
                        err.data?.message ||
                        err.message ||
                        "Something went wrong. Please try again.",
                });
            },
        });
    };

    const isDeleteMode = confirm === "delete";

    return (
        <>
            <span className="inline-flex shrink-0 items-center gap-1.5">
                {canCancelStatus(parcel.status) ? (
                    <button
                        type="button"
                        onClick={() => setConfirm("cancel")}
                        title="Cancel parcel"
                        aria-label={`Cancel parcel ${parcel.trackingId}`}
                        className="grid size-9 place-items-center rounded-xl text-amber-700 outline-none transition-all hover:bg-amber-500/10 focus-visible:ring-2 focus-visible:ring-brand-orange/50 active:scale-95"
                    >
                        <Ban className="size-4" strokeWidth={2.25} />
                    </button>
                ) : null}
                {canDeleteStatus(parcel.status) ? (
                    <button
                        type="button"
                        onClick={() => setConfirm("delete")}
                        title="Delete parcel"
                        aria-label={`Delete parcel ${parcel.trackingId}`}
                        className="grid size-9 place-items-center rounded-xl text-destructive outline-none transition-all hover:bg-destructive/10 focus-visible:ring-2 focus-visible:ring-destructive/40 active:scale-95"
                    >
                        <Trash2 className="size-4" strokeWidth={2.25} />
                    </button>
                ) : null}
            </span>

            <Dialog
                open={confirm !== null}
                onOpenChange={(open) => {
                    if (!open) close();
                }}
            >
                <DialogContent className="p-5 sm:max-w-md sm:p-6">
                    <div className="flex items-start gap-3">
                        <span
                            className={cn(
                                "grid size-11 shrink-0 place-items-center rounded-xl ring-1 ring-inset",
                                isDeleteMode
                                    ? "bg-destructive/10 text-destructive ring-destructive/20"
                                    : "bg-amber-500/10 text-amber-700 ring-amber-600/25",
                            )}
                        >
                            <TriangleAlert
                                className="size-5"
                                strokeWidth={2.25}
                            />
                        </span>
                        <div className="min-w-0">
                            <DialogTitle className="font-heading text-base font-extrabold tracking-tight">
                                {isDeleteMode
                                    ? "Delete this parcel?"
                                    : "Cancel this parcel?"}
                            </DialogTitle>
                            <DialogDescription className="mt-1 break-all">
                                <span className="font-mono font-bold">
                                    {parcel.trackingId}
                                </span>
                                {isDeleteMode
                                    ? " will be permanently removed. This cannot be undone."
                                    : " will stop here — no rider will pick it up."}
                            </DialogDescription>
                        </div>
                    </div>

                    {!isDeleteMode ? (
                        <div className="flex flex-col gap-1.5">
                            <label
                                htmlFor={`cancel-reason-${parcel.id}`}
                                className="font-heading text-[13px] font-bold text-secondary"
                            >
                                Reason{" "}
                                <span className="font-medium text-secondary/45">
                                    (optional)
                                </span>
                            </label>
                            <Textarea
                                id={`cancel-reason-${parcel.id}`}
                                value={reason}
                                maxLength={250}
                                disabled={busy}
                                onChange={(event) => {
                                    setReason(event.target.value);
                                    setReasonError(null);
                                }}
                                placeholder="e.g. Customer asked to hold the order"
                                aria-invalid={reasonError !== null}
                                aria-describedby={
                                    reasonError
                                        ? `cancel-reason-error-${parcel.id}`
                                        : undefined
                                }
                                className="min-h-20 rounded-xl border-secondary/15 bg-background text-secondary shadow-none placeholder:text-secondary/40 focus-visible:border-brand-orange focus-visible:ring-3 focus-visible:ring-brand-orange/30 aria-invalid:border-destructive/60"
                            />
                            <AnimatePresence initial={false}>
                                {reasonError ? (
                                    <motion.p
                                        key="reason-error"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        id={`cancel-reason-error-${parcel.id}`}
                                        role="alert"
                                        className="overflow-hidden text-[13px] font-medium text-destructive"
                                    >
                                        {reasonError}
                                    </motion.p>
                                ) : null}
                            </AnimatePresence>
                        </div>
                    ) : null}

                    <DialogFooter showCloseButton={false} className="gap-2.5">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={busy}
                            onClick={close}
                            className="h-10 rounded-xl border-secondary/15 font-heading text-sm font-bold text-secondary hover:bg-secondary/5 hover:text-secondary"
                        >
                            Keep parcel
                        </Button>
                        <Button
                            type="button"
                            disabled={busy}
                            onClick={
                                isDeleteMode ? confirmDelete : confirmCancel
                            }
                            className={cn(
                                "h-10 rounded-xl px-5 font-heading text-sm font-bold text-white transition active:scale-[0.99] disabled:opacity-70",
                                isDeleteMode
                                    ? "bg-destructive hover:brightness-110"
                                    : "bg-amber-600 hover:brightness-110",
                            )}
                        >
                            {busy ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : null}
                            {busy
                                ? isDeleteMode
                                    ? "Deleting…"
                                    : "Cancelling…"
                                : isDeleteMode
                                  ? "Delete parcel"
                                  : "Confirm cancel"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
