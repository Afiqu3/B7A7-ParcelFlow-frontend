"use client";

import { AnimatePresence, motion } from "motion/react";
import { Ban, Loader2, TriangleAlert } from "lucide-react";
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
import { useCancelAssignment } from "@/hooks";
import { cn } from "@/lib/utils";
import type { Assignment } from "@/types";
import { canCancelAssignment } from "./assignment-status";

/** Cancel button + confirm dialog (optional reason) for one assignment. */
export default function AssignmentCancel({
    assignment,
}: {
    assignment: Assignment;
}) {
    const [confirming, setConfirming] = useState(false);
    const [reason, setReason] = useState("");
    const { mutate: cancel, isPending } = useCancelAssignment(
        assignment.id,
        { reason: reason.trim() || undefined },
    );

    if (!canCancelAssignment(assignment.status)) return null;

    const close = () => {
        if (isPending) return;
        setConfirming(false);
        setReason("");
    };

    const confirm = () =>
        cancel(undefined, {
            onSuccess: (res) => {
                if (
                    res &&
                    typeof res === "object" &&
                    "success" in res &&
                    !res.success
                ) {
                    toast.error("Could not cancel assignment", {
                        description:
                            "Something went wrong. Please try again.",
                    });
                    return;
                }
                toast.success("Assignment cancelled", {
                    description: `${assignment.rider.name} · ${assignment.parcel.trackingId}`,
                });
                setConfirming(false);
                setReason("");
            },
            onError: (err: FetchError) => {
                toast.error("Could not cancel assignment", {
                    description:
                        err.data?.message ||
                        err.message ||
                        "Something went wrong. Please try again.",
                });
            },
        });

    return (
        <>
            <button
                type="button"
                onClick={() => setConfirming(true)}
                title="Cancel assignment"
                aria-label={`Cancel assignment of ${assignment.parcel.trackingId} to ${assignment.rider.name}`}
                className="grid size-9 shrink-0 place-items-center rounded-xl text-destructive outline-none transition-all hover:bg-destructive/10 focus-visible:ring-2 focus-visible:ring-destructive/40 active:scale-95"
            >
                <Ban className="size-4" strokeWidth={2.25} />
            </button>

            <Dialog
                open={confirming}
                onOpenChange={(open) => {
                    if (!open) close();
                }}
            >
                <DialogContent className="p-5 sm:max-w-md sm:p-6">
                    <div className="flex items-start gap-3">
                        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-destructive/10 text-destructive ring-1 ring-destructive/20 ring-inset">
                            <TriangleAlert
                                className="size-5"
                                strokeWidth={2.25}
                            />
                        </span>
                        <div className="min-w-0">
                            <DialogTitle className="font-heading text-base font-extrabold tracking-tight">
                                Cancel this assignment?
                            </DialogTitle>
                            <DialogDescription className="mt-1">
                                <span className="font-semibold">
                                    {assignment.rider.name}
                                </span>{" "}
                                will stand down from{" "}
                                <span className="font-mono font-bold">
                                    {assignment.parcel.trackingId}
                                </span>
                                .
                            </DialogDescription>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label
                            htmlFor={`cancel-assignment-reason-${assignment.id}`}
                            className="font-heading text-[13px] font-bold text-secondary"
                        >
                            Reason{" "}
                            <span className="font-medium text-secondary/45">
                                (optional)
                            </span>
                        </label>
                        <Textarea
                            id={`cancel-assignment-reason-${assignment.id}`}
                            value={reason}
                            maxLength={250}
                            disabled={isPending}
                            onChange={(event) =>
                                setReason(event.target.value)
                            }
                            placeholder="e.g. Reassigning to a closer rider"
                            className="min-h-20 rounded-xl border-secondary/15 bg-background text-secondary shadow-none placeholder:text-secondary/40 focus-visible:border-brand-orange focus-visible:ring-3 focus-visible:ring-brand-orange/30"
                        />
                    </div>

                    <DialogFooter
                        showCloseButton={false}
                        className="gap-2.5"
                    >
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isPending}
                            onClick={close}
                            className="h-10 rounded-xl border-secondary/15 font-heading text-sm font-bold text-secondary hover:bg-secondary/5 hover:text-secondary"
                        >
                            Keep assignment
                        </Button>
                        <Button
                            type="button"
                            disabled={isPending}
                            onClick={confirm}
                            className={cn(
                                "h-10 rounded-xl bg-destructive px-5 font-heading text-sm font-bold text-white transition hover:brightness-110 active:scale-[0.99] disabled:opacity-70",
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
                                        Cancelling…
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
                                        Confirm cancel
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
