"use client";

import { AnimatePresence, motion } from "motion/react";
import {
    Check,
    CircleCheck,
    Flag,
    Loader2,
    MapPin,
    Phone,
    Play,
    Truck,
    X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { FetchError } from "ofetch";
import {
    ASSIGNMENT_STATUS_META,
    assignmentPill,
} from "@/components/modules/admin-dashboard/assignments/assignment-status";
import { Button } from "@/components/ui/button";
import {
    useAcceptAssignment,
    useCompleteAssignment,
    useFailAssignment,
    useRejectAssignment,
    useStartAssignment,
} from "@/hooks";
import { formatTaka } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { formatBackendDate } from "@/utils";
import type { MyAssignment } from "@/types";

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
    const [confirming, setConfirming] = useState<"reject" | "fail" | null>(
        null,
    );

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
    const { mutate: fail, isPending: failing } = useFailAssignment(
        assignment.id,
    );
    const busy =
        accepting || rejecting || starting || completing || failing;

    const run = (
        action: "accept" | "reject" | "start" | "complete" | "fail",
    ) => {
        const verbs = {
            accept: ["accept", "Assignment accepted"],
            reject: ["reject", "Assignment rejected"],
            start: ["start", "Job started"],
            complete: ["complete", "Job completed"],
            fail: ["mark as failed", "Assignment marked as failed"],
        } as const;
        const [verb, done] = verbs[action];
        const invoke = { accept, reject, start, complete, fail }[action];
        invoke(undefined, {
            onSuccess: (res) => {
                if (
                    res &&
                    typeof res === "object" &&
                    "success" in res &&
                    !res.success
                ) {
                    toast.error(`Could not ${verb} assignment`, {
                        description:
                            "Something went wrong. Please try again.",
                    });
                    return;
                }
                toast.success(done, {
                    description: assignment.parcel.trackingId,
                });
                setConfirming(null);
            },
            onError: actionError(verb + " assignment"),
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
                        confirming === "fail" ? (
                            <ConfirmStrip
                                key="confirm-fail"
                                label="Mark this job as failed?"
                                confirmLabel="Confirm failure"
                                busy={busy}
                                pending={failing}
                                onCancel={() => setConfirming(null)}
                                onConfirm={() => run("fail")}
                            />
                        ) : (
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
                                    {completing
                                        ? "Completing…"
                                        : "Mark completed"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={busy}
                                    onClick={() => setConfirming("fail")}
                                    className="h-11 flex-1 rounded-xl border-destructive/30 font-heading text-sm font-bold text-destructive hover:bg-destructive/10 hover:text-destructive"
                                >
                                    <Flag className="size-4" />
                                    Fail
                                </Button>
                            </motion.div>
                        )
                    ) : (
                        <motion.p
                            key="terminal"
                            {...swap}
                            className="rounded-xl bg-secondary/[0.04] px-3.5 py-2.5 text-center text-[13px] font-medium text-secondary/60 ring-1 ring-secondary/8 ring-inset"
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
            className="flex items-center gap-2 rounded-xl bg-destructive/[0.06] p-2 ring-1 ring-destructive/15 ring-inset"
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
                {pending ? (
                    <Loader2 className="size-3.5 animate-spin" />
                ) : null}
                {confirmLabel}
            </Button>
        </motion.div>
    );
}
