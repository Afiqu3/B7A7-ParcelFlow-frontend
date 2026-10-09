"use client";

import { motion } from "motion/react";
import {
    Bike,
    CircleAlert,
    ClipboardList,
    Gauge,
    Package,
    RefreshCw,
    Truck,
    type LucideIcon,
} from "lucide-react";
import AnimatedNumber from "@/components/modules/pricing/AnimatedNumber";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRiderStats } from "@/hooks";
import { cn } from "@/lib/utils";
import type { RiderStats } from "@/types";
import RiderTrendsChart from "./RiderTrendsChart";

const intFormat = (value: number) => Math.round(value).toString();

const ASSIGNMENT_LABELS: Record<string, string> = {
    ASSIGNED: "Assigned",
    ACCEPTED: "Accepted",
    IN_PROGRESS: "In progress",
    COMPLETED: "Completed",
    FAILED: "Failed",
    CANCELLED: "Cancelled",
    REJECTED: "Rejected",
};

/** Rider dashboard home: KPIs, completion trend, assignments, performance. */
export default function RiderStat() {
    const { data, isPending, isError, error, refetch, isFetching } =
        useRiderStats();

    if (isPending) return <RiderStatsSkeleton />;

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

    return <RiderStatsContent stats={data.data} />;
}

function RiderStatsContent({ stats }: { stats: RiderStats }) {
    const kpis: {
        icon: LucideIcon;
        label: string;
        value: number;
        format: (value: number) => string;
        sub: string;
        tile: string;
    }[] = [
        {
            icon: ClipboardList,
            label: "Total assignments",
            value: stats.overview.totalAssignments,
            format: intFormat,
            sub: "jobs all time",
            tile: "bg-brand text-white",
        },
        {
            icon: Package,
            label: "Active pickups",
            value: stats.overview.activePickups,
            format: intFormat,
            sub: "to collect",
            tile: "bg-brand-orange text-brand-ink",
        },
        {
            icon: Truck,
            label: "Active deliveries",
            value: stats.overview.activeDeliveries,
            format: intFormat,
            sub: "on the way",
            tile: "bg-amber-500 text-white",
        },
        {
            icon: Gauge,
            label: "Success rate",
            value: stats.performance.deliverySuccessRate,
            format: (value) => `${value.toFixed(1)}%`,
            sub: "deliveries succeeded",
            tile: "bg-emerald-600 text-white",
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

            {/* Trend */}
            <RiderTrendsChart points={stats.trends.completedAssignments} />

            {/* Assignments + performance */}
            <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
                <AssignmentPanel stats={stats} />
                <PerformancePanel stats={stats} />
            </div>

            {/* Completed totals */}
            <div className="grid grid-cols-2 gap-4">
                {[
                    {
                        icon: Package,
                        label: "Pickups completed",
                        value: stats.overview.completedPickups,
                    },
                    {
                        icon: Bike,
                        label: "Deliveries completed",
                        value: stats.overview.completedDeliveries,
                    },
                ].map((tile, index) => (
                    <div
                        key={tile.label}
                        className="flex min-w-0 items-center gap-3 rounded-2xl bg-card px-4 py-3.5 ring-1 ring-secondary/10 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:fill-mode-backwards"
                        style={{ animationDelay: `${200 + index * 40}ms` }}
                    >
                        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-600/10 text-emerald-700 ring-1 ring-emerald-600/20 ring-inset">
                            <tile.icon
                                className="size-4"
                                strokeWidth={2.25}
                            />
                        </span>
                        <span className="min-w-0">
                            <span className="block truncate font-heading text-lg leading-none font-extrabold text-secondary tabular-nums">
                                <AnimatedNumber
                                    countUp
                                    value={tile.value}
                                    format={intFormat}
                                />
                            </span>
                            <span className="mt-1 block truncate text-xs text-secondary/55">
                                {tile.label}
                            </span>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function AssignmentPanel({ stats }: { stats: RiderStats }) {
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
                Breakdown
            </p>
            <h2 className="mt-1 font-heading text-base font-extrabold tracking-tight text-secondary">
                Assignments · {stats.assignments.active} active
            </h2>
            <ul className="mt-4 grid gap-x-6 gap-y-3.5 sm:grid-cols-2">
                {entries.map((entry) => (
                    <li key={entry.label} className="min-w-0">
                        <p className="flex items-baseline justify-between gap-3 text-[13px]">
                            <span className="min-w-0 truncate font-semibold text-secondary/80">
                                {entry.label}
                            </span>
                            <span className="shrink-0 font-heading font-extrabold text-secondary tabular-nums">
                                {entry.count}
                            </span>
                        </p>
                        <div
                            aria-hidden
                            className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary/10"
                        >
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{
                                    width: `${Math.max(entry.count > 0 ? 4 : 0, (entry.count / max) * 100)}%`,
                                }}
                                transition={{
                                    duration: 0.7,
                                    ease: "easeOut",
                                }}
                                className="h-full rounded-full bg-brand-orange"
                            />
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}

function PerformancePanel({ stats }: { stats: RiderStats }) {
    const rate = stats.performance.deliverySuccessRate;
    const rows = [
        {
            label: "Deliveries completed",
            amount: stats.performance.completedDeliveries,
        },
        {
            label: "Deliveries failed",
            amount: stats.performance.failedDeliveries,
        },
    ];

    return (
        <section
            aria-label="Delivery performance"
            className="flex min-w-0 flex-col rounded-2xl bg-card p-5 ring-1 ring-secondary/10 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:fill-mode-backwards sm:p-6"
            style={{ animationDelay: "240ms" }}
        >
            <p className="font-heading text-[11px] font-bold tracking-[0.18em] text-brand-orange-ink uppercase">
                Performance
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

function RiderStatsSkeleton() {
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
            <div className="rounded-2xl bg-card p-5 ring-1 ring-secondary/10 sm:p-6">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="mt-4 h-64 w-full rounded-xl sm:h-72" />
            </div>
            <span className="sr-only">Loading dashboard stats…</span>
        </div>
    );
}
