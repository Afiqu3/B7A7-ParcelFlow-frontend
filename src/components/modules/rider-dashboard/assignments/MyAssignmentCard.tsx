"use client";

import {
    ASSIGNMENT_STATUS_META,
    assignmentPill,
} from "@/components/modules/admin-dashboard/assignments/assignment-status";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
    useAcceptAssignment,
    useCompleteAssignment,
    useFailAssignment,
    useRejectAssignment,
    useStartAssignment,
} from "@/hooks";
import { formatTaka } from "@/lib/pricing";
import type { MyAssignment } from "@/types";
import { formatBackendDate } from "@/utils";
import { failAssignmentSchema } from "@/validation";
import {
    Check,
    CircleCheck,
    Flag,
    Loader2,
    MapPin,
    Phone,
    Play,
    TriangleAlert,
    Truck,
    X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { FetchError } from "ofetch";
import { useState } from "react";
import { toast } from "sonner";

function actionError(action: string) {
    return (err: FetchError) => {
        toast.error(`Could not ${action}`, {
            description:
                err.data?.message ||
                err.message ||
                "Something went wrong. Please try again.",
        });
    };
}

/** One of the rider's own assignments with its next-step actions. */
export default function MyAssignmentCard({
    assignment,
    index,
}: {
    assignment: MyAssignment;
    index: number;
}) {
    const [confirming, setConfirming] = useState<"reject" | null>(null);
    const [failureDialogOpen, setFailureDialogOpen] = useState(false);
    const [failureReason, setFailureReason] = useState("");
    const [failureReasonError, setFailureReasonError] = useState("");

    const { mutate: accept, isPending: accepting } = useAcceptAssignment(
        assignment.id,
    );
    const { mutate: reject, isPending: rejecting } = useRejectAssignment(
        assignment.id,
    );
    const { mutate: start, isPending: starting } = useStartAssignment(
        assignment.id,
    );
    const { mutate: complete, isPending: completing } = useCompleteAssignment(
        assignment.id,
    );
    const { mutate: fail, isPending: failing } = useFailAssignment(assignment.id);
    const busy = accepting || rejecting || starting || completing || failing;

    const run = (
        action: "accept" | "reject" | "start" | "complete",
    ) => {
        const verbs = {
            accept: ["accept", "Assignment accepted"],
            reject: ["reject", "Assignment rejected"],
            start: ["start", "Job started"],
            complete: ["complete", "Job completed"],
        } as const;
        const [verb, done] = verbs[action];
        const invoke = { accept, reject, start, complete }[action];
        invoke(undefined, {
            onSuccess: (res) => {
                if (
                    res &&
                    typeof res === "object" &&
                    "success" in res &&
                    !res.success
                ) {
                    toast.error(`Could not ${verb} assignment`, {
                        description: "Something went wrong. Please try again.",
                    });
                    return;
                }
                toast.success(done, {
                    description: assignment.parcel.trackingId,
                });
                setConfirming(null);
            },
            onError: actionError(`${verb} assignment`),
        });
    };

    const closeFailureDialog = () => {
        if (failing) return;
        setFailureDialogOpen(false);
        setFailureReason("");
        setFailureReasonError("");
    };

    const confirmFailure = () => {
        const parsed = failAssignmentSchema.safeParse({
            reason: failureReason,
        });
        if (!parsed.success) {
            setFailureReasonError(
                parsed.error.issues[0]?.message ?? "A failure reason is required",
            );
            return;
        }

        fail(parsed.data, {
            onSuccess: (res) => {
                if (
                    res &&
                    typeof res === "object" &&
                    "success" in res &&
                    !res.success
                ) {
                    toast.error("Could not mark assignment as failed", {
                        description: "Something went wrong. Please try again.",
                    });
                    return;
                }
                toast.success("Assignment marked as failed", {
                    description: assignment.parcel.trackingId,
                });
                setFailureDialogOpen(false);
                setFailureReason("");
                setFailureReasonError("");
            },
            onError: actionError("mark assignment as failed"),
        });
    };

    const { parcel } = assignment;
    const isPickup = assignment.leg === "PICKUP";
    const contactName = isPickup
        ? parcel.pickupContactName
        : parcel.recipientName;
    const contactPhone = isPickup
        ? parcel.pickupContactPhone
        : parcel.recipientPhone;
    const address = isPickup
        ? `${parcel.pickupAddressLine}, ${parcel.pickupDistrict}, ${parcel.pickupCity}`
        : `${parcel.deliveryAddressLine}, ${parcel.deliveryDistrict}, ${parcel.deliveryCity}`;

    return (
        <article
            aria-label={`Assignment ${parcel.trackingId}`}
            className="flex min-w-0 flex-col rounded-2xl bg-card p-4 ring-1 ring-secondary/10 transition-[box-shadow,transform] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:fill-mode-backwards hover:shadow-[0_20px_40px_-28px_rgba(15,32,86,0.5)] sm:p-5"
            style={{ animationDelay: `${Math.min(index, 7) * 50}ms` }}
        >
            {/* Status row */}
            <div className="flex flex-wrap items-center gap-1.5">
                <span className={assignmentPill(assignment.status)}>
                    {ASSIGNMENT_STATUS_META[assignment.status].label}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-secondary/5 px-2.5 py-1 font-heading text-[11px] font-bold text-secondary/60 ring-1 ring-secondary/10 ring-inset">
                    {isPickup ? (
                        <Truck
                            aria-hidden
                            className="size-3"
                            strokeWidth={2.5}
                        />
                    ) : (
                        <MapPin
                            aria-hidden
                            className="size-3"
                            strokeWidth={2.5}
                        />
                    )}
                    {isPickup ? "Pickup" : "Delivery"}
                </span>
                {parcel.paymentType === "COD" &&
                parcel.codAmount !== undefined ? (
                    <span className="inline-flex items-center rounded-full bg-brand-orange/12 px-2.5 py-1 font-heading text-[11px] font-bold text-brand-orange-ink ring-1 ring-brand-orange/25 ring-inset">
                        Collect {formatTaka(parcel.codAmount)}
                    </span>
                ) : null}
            </div>

            {/* Tracking + contact */}
            <p className="mt-3 truncate font-mono text-[13px] font-bold tracking-tight text-secondary">
                {parcel.trackingId}
            </p>
            <p className="mt-1.5 flex min-w-0 items-start gap-1.5 text-[13px] text-secondary/70">
                <MapPin
                    aria-hidden
                    className="mt-0.5 size-3.5 shrink-0 text-brand"
                    strokeWidth={2.25}
                />
                <span className="min-w-0">
                    <span className="block truncate font-semibold text-secondary">
                        {contactName}
                    </span>
                    <span className="block truncate">{address}</span>
                    <a
                        href={`tel:${contactPhone.replace(/\s/g, "")}`}
                        className="mt-0.5 inline-flex items-center gap-1 font-semibold text-brand underline-offset-4 outline-none hover:underline focus-visible:underline"
                    >
                        <Phone aria-hidden className="size-3" />
                        {contactPhone}
                    </a>
                </span>
            </p>

            <p className="mt-2 text-xs text-secondary/55">
                Assigned {formatBackendDate(assignment.assignedAt)}
                {assignment.attemptNumber > 1
                    ? ` · attempt ${assignment.attemptNumber}`
                    : ""}
            </p>
            {assignment.failureReason ? (
                <p className="mt-2 rounded-xl bg-destructive/8 px-3 py-2 text-xs leading-relaxed text-destructive ring-1 ring-destructive/15 ring-inset">
                    <span className="font-heading font-bold">
                        Failure note:{" "}
                    </span>
                    {assignment.failureReason}
                </p>
            ) : null}

            {/* Next-step actions */}
            <div className="mt-3 border-t border-secondary/8 pt-3">
                <AnimatePresence mode="wait" initial={false}>
                    {assignment.status === "ASSIGNED" ? (
                        confirming === "reject" ? (
                            <ConfirmStrip
                                key="confirm-reject"
                                label="Reject this job?"
                                confirmLabel="Confirm reject"
                                busy={busy}
                                pending={rejecting}
                                onCancel={() => setConfirming(null)}
                                onConfirm={() => run("reject")}
                            />
                        ) : (
                            <motion.div
                                key="assigned-actions"
                                {...swap}
                                className="flex gap-2"
                            >
                                <Button
                                    type="button"
                                    disabled={busy}
                                    onClick={() => run("accept")}
                                    className="h-10 flex-1 rounded-xl bg-emerald-700 font-heading text-[13px] font-bold text-white transition hover:brightness-110 active:scale-[0.99] disabled:opacity-70"
                                >
                                    {accepting ? (
                                        <Loader2 className="size-4 animate-spin" />
                                    ) : (
                                        <Check className="size-4" />
                                    )}
                                    {accepting ? "Accepting…" : "Accept"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={busy}
                                    onClick={() => setConfirming("reject")}
                                    className="h-10 flex-1 rounded-xl border-destructive/30 font-heading text-[13px] font-bold text-destructive hover:bg-destructive/10 hover:text-destructive"
                                >
                                    <X className="size-4" />
                                    Reject
                                </Button>
                            </motion.div>
                        )
                    ) : assignment.status === "ACCEPTED" ? (
                        <motion.div key="start-action" {...swap}>
                            <Button
                                type="button"
                                disabled={busy}
                                onClick={() => run("start")}
                                className="h-11 w-full rounded-xl bg-brand font-heading text-sm font-bold text-white transition hover:brightness-125 active:scale-[0.99] disabled:opacity-70"
                            >
                                {starting ? (
                                    <Loader2 className="size-4 animate-spin" />
                                ) : (
                                    <Play className="size-4" />
                                )}
                                {starting ? "Starting…" : "Start job"}
                            </Button>
                        </motion.div>
                    ) : assignment.status === "IN_PROGRESS" ? (
                        <motion.div
                            key="progress-actions"
                            {...swap}
                            className="flex gap-2"
                        >
                            <Button
                                type="button"
                                disabled={busy}
                                onClick={() => run("complete")}
                                className="h-11 flex-1 rounded-xl bg-emerald-700 font-heading text-sm font-bold text-white transition hover:brightness-110 active:scale-[0.99] disabled:opacity-70"
                            >
                                {completing ? (
                                    <Loader2 className="size-4 animate-spin" />
                                ) : (
                                    <CircleCheck className="size-4" />
                                )}
                                {completing ? "Completing…" : "Mark completed"}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                disabled={busy}
                                onClick={() => {
                                    setFailureReason("");
                                    setFailureReasonError("");
                                    setFailureDialogOpen(true);
                                }}
                                className="h-11 flex-1 rounded-xl border-destructive/30 font-heading text-sm font-bold text-destructive hover:bg-destructive/10 hover:text-destructive"
                            >
                                <Flag className="size-4" />
                                Fail
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.p
                            key="terminal"
                            {...swap}
                            className="rounded-xl bg-secondary/4 px-3.5 py-2.5 text-center text-[13px] font-medium text-secondary/60 ring-1 ring-secondary/8 ring-inset"
                        >
                            {assignment.status === "COMPLETED"
                                ? "Completed — nice work."
                                : assignment.status === "REJECTED"
                                  ? "You declined this job."
                                  : assignment.status === "CANCELLED"
                                    ? "Cancelled by the dispatcher."
                                    : "Closed."}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
            <Dialog
                open={failureDialogOpen}
                onOpenChange={(open) => {
                    if (!open) closeFailureDialog();
                }}
            >
                <DialogContent className="max-h-[min(90dvh,36rem)] overflow-y-auto p-5 sm:max-w-md sm:p-6">
                    <DialogHeader className="flex-row items-start gap-3 space-y-0 text-left">
                        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-destructive/10 text-destructive ring-1 ring-destructive/20 ring-inset">
                            <TriangleAlert
                                aria-hidden="true"
                                className="size-5"
                                strokeWidth={2.25}
                            />
                        </span>
                        <span className="min-w-0">
                            <DialogTitle className="font-heading text-base font-extrabold tracking-tight text-secondary">
                                Mark this {isPickup ? "pickup" : "delivery"} as
                                failed?
                            </DialogTitle>
                            <DialogDescription className="mt-1 text-sm leading-relaxed text-secondary/65">
                                Provide a reason for{" "}
                                <span className="font-mono font-bold text-secondary">
                                    {parcel.trackingId}
                                </span>
                                . This will be saved with the assignment.
                            </DialogDescription>
                        </span>
                    </DialogHeader>

                    <div className="flex flex-col gap-1.5">
                        <label
                            htmlFor={`failure-reason-${assignment.id}`}
                            className="font-heading text-[13px] font-bold text-secondary"
                        >
                            Failure reason{" "}
                            <span className="text-destructive" aria-hidden="true">
                                *
                            </span>
                            <span className="sr-only">required</span>
                        </label>
                        <Textarea
                            id={`failure-reason-${assignment.id}`}
                            value={failureReason}
                            maxLength={500}
                            disabled={failing}
                            aria-invalid={Boolean(failureReasonError)}
                            aria-describedby={
                                failureReasonError
                                    ? `failure-reason-error-${assignment.id}`
                                    : `failure-reason-hint-${assignment.id}`
                            }
                            onChange={(event) => {
                                setFailureReason(event.target.value);
                                if (failureReasonError) {
                                    setFailureReasonError("");
                                }
                            }}
                            placeholder="Explain why the delivery could not be completed"
                            className="min-h-28 resize-y rounded-xl border-secondary/15 bg-background text-secondary shadow-none placeholder:text-secondary/40 focus-visible:border-brand-orange focus-visible:ring-3 focus-visible:ring-brand-orange/30"
                        />
                        <div className="flex items-start justify-between gap-3 text-xs">
                            {failureReasonError ? (
                                <p
                                    id={`failure-reason-error-${assignment.id}`}
                                    role="alert"
                                    className="text-destructive"
                                >
                                    {failureReasonError}
                                </p>
                            ) : (
                                <p
                                    id={`failure-reason-hint-${assignment.id}`}
                                    className="text-secondary/55"
                                >
                                    Required · up to 500 characters
                                </p>
                            )}
                            <span
                                aria-live="polite"
                                className="ml-auto shrink-0 text-secondary/45"
                            >
                                {failureReason.length}/500
                            </span>
                        </div>
                    </div>

                    <DialogFooter className="gap-2.5 sm:flex-row">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={failing}
                            onClick={closeFailureDialog}
                            className="h-10 rounded-xl border-secondary/15 font-heading text-sm font-bold text-secondary hover:bg-secondary/5 hover:text-secondary"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            disabled={failing}
                            onClick={confirmFailure}
                            className="h-10 rounded-xl px-5 font-heading text-sm font-bold"
                        >
                            <AnimatePresence initial={false} mode="popLayout">
                                {failing ? (
                                    <motion.span
                                        key="failing"
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        transition={{ duration: 0.18 }}
                                        className="inline-flex items-center gap-2"
                                    >
                                        <Loader2 className="size-4 animate-spin" />
                                        Marking failed…
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="confirm-failure"
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        transition={{ duration: 0.18 }}
                                        className="inline-flex items-center gap-2"
                                    >
                                        Confirm failure
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </article>
    );
}

const swap = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.2, ease: "easeOut" as const },
};

function ConfirmStrip({
    label,
    confirmLabel,
    busy,
    pending,
    onCancel,
    onConfirm,
}: {
    label: string;
    confirmLabel: string;
    busy: boolean;
    pending: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}) {
    return (
        <motion.div
            key="confirm"
            {...swap}
            className="flex items-center gap-2 rounded-xl bg-destructive/6 p-2 ring-1 ring-destructive/15 ring-inset"
        >
            <p className="min-w-0 flex-1 pl-1.5 font-heading text-[13px] font-bold text-destructive">
                {label}
            </p>
            <Button
                type="button"
                variant="outline"
                disabled={busy}
                onClick={onCancel}
                className="h-9 shrink-0 rounded-lg border-secondary/15 px-3 font-heading text-xs font-bold text-secondary hover:bg-secondary/5"
            >
                Back
            </Button>
            <Button
                type="button"
                disabled={busy}
                onClick={onConfirm}
                className="h-9 shrink-0 rounded-lg bg-destructive px-3 font-heading text-xs font-bold text-white transition hover:brightness-110 active:scale-[0.99] disabled:opacity-70"
            >
                {pending ? <Loader2 className="size-3.5 animate-spin" /> : null}
                {confirmLabel}
            </Button>
        </motion.div>
    );
}
