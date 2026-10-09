"use client";

import { MapPin, Package, Phone, Truck } from "lucide-react";
import { initials } from "@/components/dashboard/nav";
import { formatBackendDate } from "@/utils";
import type { Assignment } from "@/types";
import AssignmentCancel from "./AssignmentCancel";
import {
    ASSIGNMENT_STATUS_META,
    assignmentPill,
} from "./assignment-status";

/** One assignment card: rider, parcel, leg, status, cancel action. */
export default function AssignmentCard({
    assignment,
    index,
}: {
    assignment: Assignment;
    index: number;
}) {
    const { rider, parcel } = assignment;

    return (
        <article
            aria-label={`Assignment of ${parcel.trackingId} to ${rider.name}`}
            className="flex min-w-0 flex-col rounded-2xl bg-card p-4 ring-1 ring-secondary/10 transition-[box-shadow,transform] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:fill-mode-backwards hover:shadow-[0_20px_40px_-28px_rgba(15,32,86,0.5)] sm:p-5"
            style={{ animationDelay: `${Math.min(index, 7) * 50}ms` }}
        >
            {/* Rider */}
            <div className="flex min-w-0 items-center gap-3">
                <span
                    aria-hidden
                    className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand font-heading text-sm font-extrabold text-white"
                >
                    {initials(rider.name)}
                </span>
                <span className="min-w-0 flex-1">
                    <span className="block truncate font-heading text-[15px] font-extrabold tracking-tight text-secondary">
                        {rider.name}
                    </span>
                    <a
                        href={`tel:${rider.phone.replace(/\s/g, "")}`}
                        className="mt-0.5 flex min-w-0 items-center gap-1 truncate text-xs text-secondary/55 underline-offset-4 outline-none transition-colors hover:text-brand hover:underline focus-visible:text-brand focus-visible:underline"
                    >
                        <Phone aria-hidden className="size-3 shrink-0" />
                        <span className="truncate">{rider.phone}</span>
                    </a>
                </span>
                <span className={assignmentPill(assignment.status)}>
                    {ASSIGNMENT_STATUS_META[assignment.status].label}
                </span>
            </div>

            {/* Parcel + leg */}
            <div className="mt-3 flex flex-col gap-2 border-t border-secondary/8 pt-3 text-[13px]">
                <p className="flex min-w-0 items-center gap-1.5 text-secondary/70">
                    <Package
                        aria-hidden
                        className="size-3.5 shrink-0 text-brand"
                        strokeWidth={2.25}
                    />
                    <span className="min-w-0 flex-1 truncate font-mono font-bold tracking-tight text-secondary">
                        {parcel.trackingId}
                    </span>
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-secondary/5 px-2 py-0.5 font-heading text-[11px] font-bold text-secondary/60 ring-1 ring-secondary/10 ring-inset">
                        {assignment.leg === "PICKUP" ? (
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
                        {assignment.leg === "PICKUP" ? "Pickup" : "Delivery"}
                    </span>
                </p>
                <p className="flex items-center justify-between gap-3 text-xs text-secondary/55">
                    <span>
                        Assigned {formatBackendDate(assignment.assignedAt)}
                        {assignment.attemptNumber > 1
                            ? ` · attempt ${assignment.attemptNumber}`
                            : ""}
                    </span>
                    <AssignmentCancel assignment={assignment} />
                </p>
                {assignment.failureReason ? (
                    <p className="rounded-xl bg-destructive/8 px-3 py-2 text-xs leading-relaxed text-destructive ring-1 ring-destructive/15 ring-inset">
                        <span className="font-heading font-bold">
                            Failed:{" "}
                        </span>
                        {assignment.failureReason}
                    </p>
                ) : null}
            </div>
        </article>
    );
}
