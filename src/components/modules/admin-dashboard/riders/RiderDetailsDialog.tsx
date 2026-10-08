"use client";

import { AnimatePresence, motion } from "motion/react";
import {
    BadgeCheck,
    Bike,
    CircleAlert,
    FileText,
    Fingerprint,
    Loader2,
    RefreshCw,
    ShieldCheck,
    UserRound,
    XCircle,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import type { FetchError } from "ofetch";
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
import { Textarea } from "@/components/ui/textarea";
import { useApproveOrRejectRider, useGetSingleRider } from "@/hooks";
import { cn } from "@/lib/utils";
import { formatBackendDate, formatBackendDateTime } from "@/utils";
import type { Rider } from "@/types";
import {
    applicationPill,
    RIDER_APPLICATION_META,
    VEHICLE_LABELS,
} from "./rider-status";

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
    icon: typeof UserRound;
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

const cardBox =
    "rounded-xl bg-secondary/[0.04] p-3.5 ring-1 ring-secondary/8 ring-inset";

/** Full rider record with approve / reject review actions. */
export default function RiderDetailsDialog({
    riderId,
    onClose,
}: {
    riderId: string;
    onClose: () => void;
}) {
    const { data, isPending, isError, error, refetch, isFetching } =
        useGetSingleRider(riderId);

    return (
        <Dialog
            open={riderId !== ""}
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
        >
            <DialogContent className="max-h-[85svh] overflow-y-auto p-5 sm:max-w-2xl sm:p-6">
                {isPending || isError || !data?.data ? (
                    <ReviewDialogState
                        isError={isError}
                        message={(error as Error)?.message}
                        retrying={isFetching}
                        onRetry={() => refetch()}
                    />
                ) : (
                    <RiderDetailsBody rider={data.data} />
                )}
                <DialogFooter showCloseButton />
            </DialogContent>
        </Dialog>
    );
}

function ReviewDialogState({
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
                <span className="sr-only">Loading rider details…</span>
            </div>
        );
    }
    return (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
            <span className="grid size-12 place-items-center rounded-2xl bg-destructive/10 text-destructive">
                <CircleAlert className="size-6" strokeWidth={2} />
            </span>
            <div>
                <DialogTitle>Couldn&apos;t load rider details</DialogTitle>
                <DialogDescription className="mt-1">
                    {message || "Something went wrong. Please try again."}
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

function RiderDetailsBody({ rider }: { rider: Rider }) {
    const [rejecting, setRejecting] = useState(false);
    const [reason, setReason] = useState("");
    const [reasonError, setReasonError] = useState<string | null>(null);
    const { mutate: review, isPending } = useApproveOrRejectRider();

    const pending = rider.applicationStatus === "PENDING";

    const submitReview = (status: "APPROVED" | "REJECTED") => {
        const trimmed = reason.trim();
        if (status === "REJECTED") {
            if (trimmed.length < 3) {
                setReasonError(
                    "A rejection reason of at least 3 characters is required.",
                );
                return;
            }
        }
        review(
            {
                riderId: rider.id,
                applicationStatus: status,
                ...(status === "REJECTED"
                    ? { rejectionReason: trimmed }
                    : {}),
            },
            {
                onSuccess: (res) => {
                    if (
                        res &&
                        typeof res === "object" &&
                        "success" in res &&
                        !res.success
                    ) {
                        toast.error(
                            status === "APPROVED"
                                ? "Could not approve rider"
                                : "Could not reject rider",
                            {
                                description:
                                    "Something went wrong. Please try again.",
                            },
                        );
                        return;
                    }
                    toast.success(
                        status === "APPROVED"
                            ? "Rider approved"
                            : "Rider rejected",
                        { description: rider.name },
                    );
                    setRejecting(false);
                    setReason("");
                    setReasonError(null);
                },
                onError: (err: FetchError) => {
                    toast.error(
                        status === "APPROVED"
                            ? "Could not approve rider"
                            : "Could not reject rider",
                        {
                            description:
                                err.data?.message ||
                                err.message ||
                                "Something went wrong. Please try again.",
                        },
                    );
                },
            },
        );
    };

    return (
        <>
            <DialogHeader>
                <DialogTitle className="font-heading text-base font-extrabold tracking-tight">
                    {rider.name}
                </DialogTitle>
                <DialogDescription className="flex flex-wrap items-center gap-2">
                    <span className={applicationPill(rider.applicationStatus)}>
                        {
                            RIDER_APPLICATION_META[rider.applicationStatus]
                                .label
                        }
                    </span>
                    <span>
                        Applied {formatBackendDate(rider.createdAt)}
                    </span>
                </DialogDescription>
            </DialogHeader>

            <div className="grid gap-5 sm:grid-cols-2">
                <Block icon={UserRound} title="Applicant">
                    <dl className={`flex flex-col gap-2 ${cardBox}`}>
                        <DetailRow label="Full name" value={rider.name} />
                        <DetailRow
                            label="Email"
                            value={rider.email}
                            href={`mailto:${rider.email}`}
                        />
                        <DetailRow
                            label="Phone"
                            value={rider.phone}
                            href={`tel:${rider.phone.replace(/\s/g, "")}`}
                        />
                        <DetailRow
                            label="Address"
                            value={rider.address || "—"}
                        />
                    </dl>
                </Block>

                <Block icon={Fingerprint} title="Identity">
                    <dl className={`flex flex-col gap-2 ${cardBox}`}>
                        <DetailRow label="NID number" value={rider.nid} mono />
                        <DetailRow
                            label="Driving license"
                            value={rider.licenseNumber}
                            mono
                        />
                        <DetailRow
                            label="Account status"
                            value={
                                rider.user.status === "BLOCKED"
                                    ? "Blocked"
                                    : "Active"
                            }
                        />
                    </dl>
                </Block>

                <Block icon={Bike} title="Vehicle">
                    <dl className={`flex flex-col gap-2 ${cardBox}`}>
                        <DetailRow
                            label="Vehicle type"
                            value={
                                VEHICLE_LABELS[rider.vehicleType] ??
                                rider.vehicleType
                            }
                        />
                        <div>
                            <dt className="text-xs font-medium text-secondary/55">
                                Vehicle paper
                            </dt>
                            <dd className="mt-1">
                                <a
                                    href={rider.vehiclePaper}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex h-9 items-center gap-2 rounded-xl border border-secondary/15 px-3.5 font-heading text-xs font-bold text-secondary outline-none transition-colors hover:bg-brand hover:text-white hover:ring-brand focus-visible:ring-2 focus-visible:ring-brand-orange/50"
                                >
                                    <FileText className="size-4" />
                                    View document
                                </a>
                            </dd>
                        </div>
                    </dl>
                </Block>

                <Block icon={ShieldCheck} title="Review">
                    <dl className={`flex flex-col gap-2 ${cardBox}`}>
                        <DetailRow
                            label="Application status"
                            value={
                                RIDER_APPLICATION_META[
                                    rider.applicationStatus
                                ].label
                            }
                        />
                        <DetailRow
                            label="Reviewed at"
                            value={formatBackendDateTime(rider.reviewedAt)}
                        />
                        {rider.rejectionReason ? (
                            <DetailRow
                                label="Rejection reason"
                                value={rider.rejectionReason}
                            />
                        ) : null}
                    </dl>
                </Block>
            </div>

            {pending ? (
                <div className="rounded-2xl bg-secondary/[0.03] p-4 ring-1 ring-secondary/10 ring-inset">
                    {!rejecting ? (
                        <div className="flex flex-col gap-2.5 sm:flex-row">
                            <Button
                                type="button"
                                disabled={isPending}
                                onClick={() => submitReview("APPROVED")}
                                className="h-11 flex-1 rounded-xl bg-emerald-700 font-heading text-sm font-bold text-white transition hover:brightness-110 active:scale-[0.99] disabled:opacity-70"
                            >
                                {isPending ? (
                                    <Loader2 className="size-4 animate-spin" />
                                ) : (
                                    <BadgeCheck className="size-4" />
                                )}
                                {isPending ? "Approving…" : "Approve rider"}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                disabled={isPending}
                                onClick={() => setRejecting(true)}
                                className="h-11 flex-1 rounded-xl border-destructive/30 font-heading text-sm font-bold text-destructive hover:bg-destructive/10 hover:text-destructive"
                            >
                                <XCircle className="size-4" />
                                Reject
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2.5">
                            <label
                                htmlFor={`reject-reason-${rider.id}`}
                                className="font-heading text-[13px] font-bold text-secondary"
                            >
                                Rejection reason{" "}
                                <span className="font-medium text-secondary/45">
                                    (required)
                                </span>
                            </label>
                            <Textarea
                                id={`reject-reason-${rider.id}`}
                                value={reason}
                                maxLength={500}
                                disabled={isPending}
                                onChange={(event) => {
                                    setReason(event.target.value);
                                    setReasonError(null);
                                }}
                                placeholder="Why is this application being rejected?"
                                aria-invalid={reasonError !== null}
                                className="min-h-20 rounded-xl border-secondary/15 bg-background text-secondary shadow-none placeholder:text-secondary/40 focus-visible:border-brand-orange focus-visible:ring-3 focus-visible:ring-brand-orange/30 aria-invalid:border-destructive/60"
                            />
                            <AnimatePresence initial={false}>
                                {reasonError ? (
                                    <motion.p
                                        key="reject-error"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        role="alert"
                                        className="overflow-hidden text-[13px] font-medium text-destructive"
                                    >
                                        {reasonError}
                                    </motion.p>
                                ) : null}
                            </AnimatePresence>
                            <div className="flex flex-col gap-2.5 sm:flex-row">
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={isPending}
                                    onClick={() => {
                                        setRejecting(false);
                                        setReason("");
                                        setReasonError(null);
                                    }}
                                    className="h-10 flex-1 rounded-xl border-secondary/15 font-heading text-sm font-bold text-secondary hover:bg-secondary/5 hover:text-secondary"
                                >
                                    Back
                                </Button>
                                <Button
                                    type="button"
                                    disabled={isPending}
                                    onClick={() => submitReview("REJECTED")}
                                    className="h-10 flex-1 rounded-xl bg-destructive font-heading text-sm font-bold text-white transition hover:brightness-110 active:scale-[0.99] disabled:opacity-70"
                                >
                                    {isPending ? (
                                        <Loader2 className="size-4 animate-spin" />
                                    ) : null}
                                    {isPending
                                        ? "Rejecting…"
                                        : "Confirm rejection"}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            ) : null}
        </>
    );
}
