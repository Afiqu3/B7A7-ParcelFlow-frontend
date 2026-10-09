import type { AssignmentStatus } from "@/types";

export const ASSIGNMENT_STATUS_ORDER: AssignmentStatus[] = [
    "ASSIGNED",
    "ACCEPTED",
    "IN_PROGRESS",
    "COMPLETED",
    "FAILED",
    "CANCELLED",
    "REJECTED",
];

export const ASSIGNMENT_STATUS_META: Record<
    AssignmentStatus,
    { label: string; short: string; tone: string }
> = {
    ASSIGNED: {
        label: "Assigned",
        short: "Assigned",
        tone: "bg-brand/8 text-brand ring-brand/15",
    },
    ACCEPTED: {
        label: "Accepted",
        short: "Accepted",
        tone: "bg-amber-500/10 text-amber-800 ring-amber-600/25",
    },
    IN_PROGRESS: {
        label: "In progress",
        short: "In progress",
        tone: "bg-brand-orange/12 text-brand-orange-ink ring-brand-orange/25",
    },
    COMPLETED: {
        label: "Completed",
        short: "Completed",
        tone: "bg-emerald-600/10 text-emerald-700 ring-emerald-600/20",
    },
    FAILED: {
        label: "Failed",
        short: "Failed",
        tone: "bg-destructive/10 text-destructive ring-destructive/20",
    },
    CANCELLED: {
        label: "Cancelled",
        short: "Cancelled",
        tone: "bg-secondary/8 text-secondary/65 ring-secondary/15",
    },
    REJECTED: {
        label: "Rejected",
        short: "Rejected",
        tone: "bg-secondary/8 text-secondary/65 ring-secondary/15",
    },
};

/** Pill classes for an assignment status badge. */
export function assignmentPill(status: AssignmentStatus) {
    return `inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-heading text-[11px] font-bold tracking-wide uppercase ring-1 ring-inset ${ASSIGNMENT_STATUS_META[status].tone}`;
}

/** Assignment legs still in motion can be cancelled. */
export function canCancelAssignment(status: AssignmentStatus) {
    return (
        status === "ASSIGNED" ||
        status === "ACCEPTED" ||
        status === "IN_PROGRESS"
    );
}
