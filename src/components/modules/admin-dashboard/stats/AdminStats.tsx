"use client";

import { motion } from "motion/react";
import {
    Banknote,
    Bike,
    ClipboardList,
    CircleAlert,
    Gauge,
    Hourglass,
    Package,
    RefreshCw,
    ShieldAlert,
    Store,
    UserStar,
    Wallet,
    type LucideIcon,
} from "lucide-react";
import AnimatedNumber from "@/components/modules/pricing/AnimatedNumber";
import { PARCEL_STATUS_META } from "@/components/modules/parcels/parcel-status";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminStats } from "@/hooks";
import { formatTaka } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import type { AdminStats } from "@/types";
import AdminTrendsChart from "./AdminTrendsChart";

const intFormat = (value: number) => Math.round(value).toString();

/** Admin dashboard home: KPIs, trends, breakdowns, money. */
export default function AdminStats() {
    const { data, isPending, isError, error, refetch, isFetching } =
        useAdminStats();

    if (isPending) return <AdminStatsSkeleton />;

    if (isError || !data?.data) {
        return (
            <div className="flex flex-col items-center gap-3 rounded-2xl bg-card px-6 py-12 text-center ring-1 ring-secondary/10 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300">
                <span className="grid size-12 place-items-center rounded-2xl bg-destructive/10 text-destructive">
                    <CircleAlert className="size-6" strokeWidth={2} />
                </span>
                <div>
                    <h2 className="font-heading text-lg font-extrabold tracking-tight text-secondary">
                        Couldn&apos;t load dashboard stats
                    </h2>
                    <p className="mx-auto mt-1 max-w-sm text-sm text-secondary/65">
                        {(error as Error)?.message ||
                            "Something went wrong. Please try again."}
                    </p>
                </div>
                <Button
                    type="button"
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="h-10 rounded-xl bg-brand px-5 font-heading text-sm font-bold text-white transition hover:brightness-125 active:scale-[0.99] disabled:opacity-70"
                >
                    <RefreshCw
                        className={`size-4 ${isFetching ? "animate-spin" : ""}`}
                    />
                    {isFetching ? "Retrying…" : "Try again"}
                </Button>
            </div>
        );
    }

    return <AdminStatsContent stats={data.data} />;
}

function AdminStatsContent({ stats }: { stats: AdminStats }) {
    const kpis: {
        icon: LucideIcon;
        label: string;
        value: number;
        format: (value: number) => string;
        sub: string;
        tile: string;
    }[] = [
        {
            icon: Package,
            label: "Total parcels",
            value: stats.overview.totalParcels,
            format: intFormat,
            sub: "booked all time",
            tile: "bg-brand text-white",
        },
        {
            icon: Store,
            label: "Merchants",
            value: stats.overview.totalMerchants,
            format: intFormat,
            sub: `${stats.overview.blockedMerchants} blocked`,
            tile: "bg-brand-orange text-brand-ink",
        },
        {
            icon: Bike,
            label: "Riders",
            value: stats.overview.totalRiders,
            format: intFormat,
            sub: `${stats.overview.pendingRiderApprovals} approvals pending`,
            tile: "bg-emerald-600 text-white",
        },
        {
            icon: Banknote,
            label: "Revenue realized",
            value: stats.revenue.realizedDeliveryCharge,
            format: (value) => formatTaka(Math.round(value)),
            sub: "delivery charges earned",
            tile: "bg-brand text-white",
        },
    ];

    const minis: { icon: LucideIcon; label: string; value: number }[] = [
        {
            icon: ShieldAlert,
            label: "Blocked merchants",
            value: stats.overview.blockedMerchants,
        },
        {
            icon: UserStar,
            label: "Total admins",
            value: stats.overview.totalAdmins,
        },
        {
            icon: Hourglass,
            label: "Rider approvals",
            value: stats.overview.pendingRiderApprovals,
        },
        {
            icon: ClipboardList,
            label: "Active assignments",
            value: stats.overview.activeAssignments,
        },
    ];

    return (
        <div className="flex min-w-0 flex-col gap-5">
            {/* KPI cards */}
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                {kpis.map((kpi, index) => (
                    <div
                        key={kpi.label}
                        className="min-w-0 rounded-2xl bg-card p-4 ring-1 ring-secondary/10 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:fill-mode-backwards sm:p-5"
                        style={{ animationDelay: `${80 + index * 50}ms` }}
                    >
                        <span
                            className={cn(
                                "grid size-10 place-items-center rounded-xl",
                                kpi.tile,
                            )}
                        >
                            <kpi.icon
                                className="size-5"
                                strokeWidth={2.25}
                            />
                        </span>
                        <p className="mt-3 truncate font-heading text-2xl font-extrabold tracking-tight text-secondary tabular-nums sm:text-[28px]">
                            <AnimatedNumber
                                countUp
                                value={kpi.value}
                                format={kpi.format}
                            />
                        </p>
                        <p className="mt-1 truncate font-heading text-[13px] font-bold text-secondary">
                            {kpi.label}
                        </p>
                        <p className="truncate text-xs text-secondary/55">
                            {kpi.sub}
                        </p>
                    </div>
                ))}
            </div>

            {/* Mini strip */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {minis.map((mini, index) => (
                    <div
                        key={mini.label}
                        className="flex min-w-0 items-center gap-3 rounded-2xl bg-card px-4 py-3.5 ring-1 ring-secondary/10 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:fill-mode-backwards"
                        style={{ animationDelay: `${160 + index * 40}ms` }}
                    >
                        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand/8 text-brand ring-1 ring-brand/10 ring-inset">
                            <mini.icon
                                className="size-4"
                                strokeWidth={2.25}
                            />
                        </span>
                        <span className="min-w-0">
                            <span className="block truncate font-heading text-lg leading-none font-extrabold text-secondary tabular-nums">
                                <AnimatedNumber
                                    countUp
                                    value={mini.value}
                                    format={intFormat}
                                />
                            </span>
                            <span className="mt-1 block truncate text-xs text-secondary/55">
                                {mini.label}
                            </span>
                        </span>
                    </div>
                ))}
            </div>

            {/* Trends */}
            <AdminTrendsChart trends={stats.trends} />

            {/* Status breakdown + delivery */}
            <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
                <ParcelStatusPanel stats={stats} />
                <DeliveryPanel stats={stats} />
            </div>

            {/* Assignments + riders + money */}
            <div className="grid items-start gap-5 lg:grid-cols-2">
                <AssignmentPanel stats={stats} />
                <div className="flex min-w-0 flex-col gap-5">
                    <RidersPanel stats={stats} />
                    <MoneyPanel stats={stats} />
                </div>
            </div>
        </div>
    );
}

function BarRow({
    label,
    count,
    max,
    barClass = "bg-brand",
}: {
    label: string;
    count: number;
    max: number;
    barClass?: string;
}) {
    return (
        <li className="min-w-0">
            <p className="flex items-baseline justify-between gap-3 text-[13px]">
                <span className="min-w-0 truncate font-semibold text-secondary/80">
                    {label}
                </span>
                <span className="shrink-0 font-heading font-extrabold text-secondary tabular-nums">
                    {count}
                </span>
            </p>
            <div
                aria-hidden
                className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary/10"
            >
                <motion.div
                    initial={{ width: 0 }}
                    animate={{
                        width: `${Math.max(count > 0 ? 4 : 0, (count / Math.max(1, max)) * 100)}%`,
                    }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className={cn("h-full rounded-full", barClass)}
                />
            </div>
        </li>
    );
}

function ParcelStatusPanel({ stats }: { stats: AdminStats }) {
    const entries = (
        Object.keys(stats.parcels.byStatus) as (keyof typeof stats.parcels.byStatus)[]
    ).map((status) => ({
        label:
            PARCEL_STATUS_META[status as keyof typeof PARCEL_STATUS_META]
                ?.label ?? status,
        count: stats.parcels.byStatus[status] ?? 0,
    }));
    const max = Math.max(1, ...entries.map((entry) => entry.count));

    return (
        <section
            aria-label="Parcels by status"
            className="min-w-0 rounded-2xl bg-card p-5 ring-1 ring-secondary/10 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:fill-mode-backwards sm:p-6"
            style={{ animationDelay: "200ms" }}
        >
            <p className="font-heading text-[11px] font-bold tracking-[0.18em] text-brand-orange-ink uppercase">
                Breakdown
            </p>
            <h2 className="mt-1 font-heading text-base font-extrabold tracking-tight text-secondary">
                Parcels by status · {stats.parcels.total} total
            </h2>
            <ul className="mt-4 grid gap-x-6 gap-y-3.5 sm:grid-cols-2">
                {entries.map((entry) => (
                    <BarRow
                        key={entry.label}
                        label={entry.label}
                        count={entry.count}
                        max={max}
                    />
                ))}
            </ul>
        </section>
    );
}

function DeliveryPanel({ stats }: { stats: AdminStats }) {
    const rate = stats.delivery.successRate;
    const rows = [
        { label: "Delivered", amount: stats.delivery.delivered },
        { label: "Failed", amount: stats.delivery.failed },
        { label: "Returned", amount: stats.delivery.returned },
    ];

    return (
        <section
            aria-label="Delivery success"
            className="flex min-w-0 flex-col rounded-2xl bg-card p-5 ring-1 ring-secondary/10 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:fill-mode-backwards sm:p-6"
            style={{ animationDelay: "240ms" }}
        >
            <p className="font-heading text-[11px] font-bold tracking-[0.18em] text-brand-orange-ink uppercase">
                Delivery
            </p>
            <h2 className="mt-1 font-heading text-base font-extrabold tracking-tight text-secondary">
                Success rate
            </h2>
            <p className="mt-3 font-heading text-4xl font-extrabold tracking-tight text-secondary tabular-nums">
                <AnimatedNumber
                    countUp
                    value={rate}
                    format={(value) => `${value.toFixed(1)}%`}
                />
            </p>
            <div
                aria-hidden
                className="mt-2.5 h-2 overflow-hidden rounded-full bg-secondary/10"
            >
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, Math.max(0, rate))}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full bg-emerald-500"
                />
            </div>
            <dl className="mt-4 flex flex-col gap-2 border-t border-secondary/8 pt-4">
                {rows.map((row) => (
                    <div
                        key={row.label}
                        className="flex items-baseline justify-between gap-3"
                    >
                        <dt className="text-[13px] text-secondary/65">
                            {row.label}
                        </dt>
                        <dd className="font-heading text-sm font-bold text-secondary tabular-nums">
                            {row.amount}
                        </dd>
                    </div>
                ))}
            </dl>
        </section>
    );
}

function AssignmentPanel({ stats }: { stats: AdminStats }) {
    const entries = (
        Object.keys(stats.assignments.byStatus) as (keyof typeof stats.assignments.byStatus)[]
    ).map((status) => ({
        label: ASSIGNMENT_LABELS[status] ?? status,
        count: stats.assignments.byStatus[status] ?? 0,
    }));
    const max = Math.max(1, ...entries.map((entry) => entry.count));

    return (
        <section
            aria-label="Assignments by status"
            className="min-w-0 rounded-2xl bg-card p-5 ring-1 ring-secondary/10 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:fill-mode-backwards sm:p-6"
            style={{ animationDelay: "200ms" }}
        >
            <p className="font-heading text-[11px] font-bold tracking-[0.18em] text-brand-orange-ink uppercase">
                Rider work
            </p>
            <h2 className="mt-1 font-heading text-base font-extrabold tracking-tight text-secondary">
                Assignments · {stats.assignments.active} active
            </h2>
            <ul className="mt-4 grid gap-x-6 gap-y-3.5 sm:grid-cols-2">
                {entries.map((entry) => (
                    <BarRow
                        key={entry.label}
                        label={entry.label}
                        count={entry.count}
                        max={max}
                        barClass="bg-brand-orange"
                    />
                ))}
            </ul>
        </section>
    );
}

function RidersPanel({ stats }: { stats: AdminStats }) {
    const rows = [
        {
            label: "Pending review",
            count: stats.riders.byApplicationStatus.PENDING,
            tone: "bg-amber-500/10 text-amber-800 ring-amber-600/25",
        },
        {
            label: "Approved",
            count: stats.riders.byApplicationStatus.APPROVED,
            tone: "bg-emerald-600/10 text-emerald-700 ring-emerald-600/20",
        },
        {
            label: "Rejected",
            count: stats.riders.byApplicationStatus.REJECTED,
            tone: "bg-secondary/8 text-secondary/65 ring-secondary/15",
        },
    ];

    return (
        <section
            aria-label="Rider applications"
            className="min-w-0 rounded-2xl bg-card p-5 ring-1 ring-secondary/10 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:fill-mode-backwards sm:p-6"
            style={{ animationDelay: "240ms" }}
        >
            <h2 className="font-heading text-sm font-extrabold tracking-tight text-secondary">
                Rider applications · {stats.riders.total} riders
            </h2>
            <ul className="mt-3 flex flex-col gap-2">
                {rows.map((row) => (
                    <li
                        key={row.label}
                        className="flex items-center gap-2.5 rounded-xl bg-secondary/[0.04] px-3.5 py-2.5 ring-1 ring-secondary/8 ring-inset"
                    >
                        <span
                            className={cn(
                                "rounded-full px-2.5 py-0.5 font-heading text-[11px] font-bold uppercase ring-1 ring-inset",
                                row.tone,
                            )}
                        >
                            {row.label}
                        </span>
                        <span className="ml-auto font-heading text-sm font-extrabold text-secondary tabular-nums">
                            {row.count}
                        </span>
                    </li>
                ))}
            </ul>
        </section>
    );
}

function MoneyPanel({ stats }: { stats: AdminStats }) {
    const groups: { title: string; rows: { label: string; amount: number }[] }[] = [
        {
            title: "bKash",
            rows: [
                { label: "Paid", amount: stats.revenue.bkash.paid },
                { label: "Pending", amount: stats.revenue.bkash.pending },
                { label: "Refunded", amount: stats.revenue.bkash.refunded },
            ],
        },
        {
            title: "Cash on delivery",
            rows: [
                { label: "Collected", amount: stats.revenue.cod.collected },
                { label: "Outstanding", amount: stats.revenue.cod.outstanding },
            ],
        },
    ];

    return (
        <section
            aria-label="Revenue"
            className="flex min-w-0 flex-col gap-5 rounded-2xl bg-card p-5 ring-1 ring-secondary/10 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:fill-mode-backwards sm:p-6"
            style={{ animationDelay: "280ms" }}
        >
            {groups.map((group, groupIndex) => (
                <div
                    key={group.title}
                    className={cn(groupIndex > 0 && "border-t border-secondary/8 pt-5")}
                >
                    <h2 className="flex items-center gap-2 font-heading text-sm font-extrabold tracking-tight text-secondary">
                        <Wallet
                            className="size-4 text-brand"
                            strokeWidth={2.25}
                        />
                        {group.title}
                    </h2>
                    <dl className="mt-2.5 flex flex-col gap-2">
                        {group.rows.map((row, rowIndex) => (
                            <div
                                key={row.label}
                                className={cn(
                                    "flex items-baseline justify-between gap-3",
                                    rowIndex === 0 &&
                                        "rounded-xl bg-secondary/[0.04] px-3 py-2 ring-1 ring-secondary/8 ring-inset",
                                )}
                            >
                                <dt className="text-[13px] text-secondary/65">
                                    {row.label}
                                </dt>
                                <dd
                                    className={cn(
                                        "font-heading font-bold text-secondary tabular-nums",
                                        rowIndex === 0 ? "text-base" : "text-sm",
                                    )}
                                >
                                    {formatTaka(row.amount)}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            ))}
        </section>
    );
}

const ASSIGNMENT_LABELS: Record<string, string> = {
    ASSIGNED: "Assigned",
    ACCEPTED: "Accepted",
    IN_PROGRESS: "In progress",
    COMPLETED: "Completed",
    FAILED: "Failed",
    CANCELLED: "Cancelled",
    REJECTED: "Rejected",
};

function AdminStatsSkeleton() {
    return (
        <div aria-hidden className="flex min-w-0 flex-col gap-5">
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholders
                        key={index}
                        className="rounded-2xl bg-card p-4 ring-1 ring-secondary/10 sm:p-5"
                    >
                        <Skeleton className="size-10 rounded-xl" />
                        <Skeleton className="mt-3 h-8 w-2/3" />
                        <Skeleton className="mt-2 h-4 w-1/2" />
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton
                        // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholders
                        key={index}
                        className="h-16 rounded-2xl"
                    />
                ))}
            </div>
            <div className="rounded-2xl bg-card p-5 ring-1 ring-secondary/10 sm:p-6">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="mt-4 h-64 w-full rounded-xl sm:h-72" />
            </div>
            <span className="sr-only">Loading dashboard stats…</span>
        </div>
    );
}
