"use client";

import { motion } from "motion/react";
import {
    Banknote,
    CircleAlert,
    Gauge,
    Package,
    PackageCheck,
    RefreshCw,
    Truck,
    Wallet,
    type LucideIcon,
} from "lucide-react";
import AnimatedNumber from "@/components/modules/pricing/AnimatedNumber";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMerchantStats } from "@/hooks";
import { formatTaka } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import type { MerchantStats } from "@/types";
import {
    PARCEL_STATUS_META,
    PARCEL_STATUS_ORDER,
} from "@/components/modules/parcels/parcel-status";
import PaymentDonut from "./PaymentDonut";
import TrendsChart from "./TrendsChart";

const intFormat = (value: number) => Math.round(value).toString();

/** Merchant dashboard home: KPIs, 30-day trend, payment split, breakdowns. */
export default function Stats() {
    const { data, isPending, isError, error, refetch, isFetching } =
        useMerchantStats();

    if (isPending) return <StatsSkeleton />;

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

    return <StatsContent stats={data.data} />;
}

function StatsContent({ stats }: { stats: MerchantStats }) {
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
            icon: PackageCheck,
            label: "Delivered",
            value: stats.overview.delivered,
            format: intFormat,
            sub: "completed",
            tile: "bg-emerald-600 text-white",
        },
        {
            icon: Truck,
            label: "In flight",
            value: stats.overview.inFlight,
            format: intFormat,
            sub: "moving right now",
            tile: "bg-amber-500 text-white",
        },
        {
            icon: Gauge,
            label: "Success rate",
            value: stats.delivery.successRate,
            format: (value) => `${value.toFixed(1)}%`,
            sub: "deliveries succeeded",
            tile: "bg-brand-orange text-brand-ink",
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
                        <p className="mt-3 font-heading text-2xl font-extrabold tracking-tight text-secondary tabular-nums sm:text-[28px]">
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

            {/* Trend + payment split */}
            <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
                <TrendsChart points={stats.trends.parcelsCreated} />
                <PaymentDonut
                    prepaid={stats.parcels.byPaymentType.PREPAID}
                    cod={stats.parcels.byPaymentType.COD}
                />
            </div>

            {/* Status breakdown + money */}
            <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
                <StatusBreakdown stats={stats} />
                <MoneyPanel stats={stats} />
            </div>
        </div>
    );
}

function StatusBreakdown({ stats }: { stats: MerchantStats }) {
    const counts = PARCEL_STATUS_ORDER.map((status) => ({
        status,
        count: stats.parcels.byStatus[status] ?? 0,
    }));
    const max = Math.max(1, ...counts.map((entry) => entry.count));

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
                Parcels by status
            </h2>
            <ul className="mt-4 grid gap-x-6 gap-y-3.5 sm:grid-cols-2">
                {counts.map((entry) => (
                    <li key={entry.status} className="min-w-0">
                        <p className="flex items-baseline justify-between gap-3 text-[13px]">
                            <span className="min-w-0 truncate font-semibold text-secondary/80">
                                {PARCEL_STATUS_META[entry.status].label}
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
                                    width: `${Math.max(
                                        entry.count > 0 ? 4 : 0,
                                        (entry.count / max) * 100,
                                    )}%`,
                                }}
                                transition={{
                                    duration: 0.7,
                                    ease: "easeOut",
                                }}
                                className="h-full rounded-full bg-brand"
                            />
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}

function MoneyPanel({ stats }: { stats: MerchantStats }) {
    const rows: {
        label: string;
        amount: number;
    }[][] = [
        [
            { label: "Delivery charges", amount: stats.spend.totalDeliveryCharge },
            { label: "Prepaid paid", amount: stats.spend.prepaidPaid },
            { label: "Prepaid pending", amount: stats.spend.prepaidPending },
        ],
        [
            { label: "COD collected", amount: stats.cod.collected },
            { label: "COD pending", amount: stats.cod.pending },
        ],
    ];

    return (
        <section
            aria-label="Spend and COD collections"
            className="flex min-w-0 flex-col gap-5 rounded-2xl bg-card p-5 ring-1 ring-secondary/10 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:fill-mode-backwards sm:p-6"
            style={{ animationDelay: "260ms" }}
        >
            <div>
                <h2 className="flex items-center gap-2 font-heading text-sm font-extrabold tracking-tight text-secondary">
                    <Wallet
                        className="size-4 text-brand"
                        strokeWidth={2.25}
                    />
                    Spend
                </h2>
                <dl className="mt-2.5 flex flex-col gap-2">
                    {rows[0].map((row, index) => (
                        <div
                            key={row.label}
                            className={cn(
                                "flex items-baseline justify-between gap-3",
                                index === 0 &&
                                    "rounded-xl bg-secondary/4 px-3 py-2 ring-1 ring-secondary/8 ring-inset",
                            )}
                        >
                            <dt className="text-[13px] text-secondary/65">
                                {row.label}
                            </dt>
                            <dd
                                className={cn(
                                    "font-heading font-bold text-secondary tabular-nums",
                                    index === 0 ? "text-base" : "text-sm",
                                )}
                            >
                                {formatTaka(row.amount)}
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
            <div className="border-t border-secondary/8 pt-5">
                <h2 className="flex items-center gap-2 font-heading text-sm font-extrabold tracking-tight text-secondary">
                    <Banknote
                        className="size-4 text-brand-orange-ink"
                        strokeWidth={2.25}
                    />
                    COD collections
                </h2>
                <dl className="mt-2.5 flex flex-col gap-2">
                    {rows[1].map((row) => (
                        <div
                            key={row.label}
                            className="flex items-baseline justify-between gap-3"
                        >
                            <dt className="text-[13px] text-secondary/65">
                                {row.label}
                            </dt>
                            <dd className="font-heading text-sm font-bold text-secondary tabular-nums">
                                {formatTaka(row.amount)}
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    );
}

function StatsSkeleton() {
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
            <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
                <div className="rounded-2xl bg-card p-5 ring-1 ring-secondary/10 sm:p-6">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="mt-4 h-64 w-full rounded-xl sm:h-72" />
                </div>
                <div className="rounded-2xl bg-card p-5 ring-1 ring-secondary/10 sm:p-6">
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="mx-auto mt-4 size-44 rounded-full" />
                    <Skeleton className="mt-4 h-10 w-full rounded-xl" />
                    <Skeleton className="mt-2 h-10 w-full rounded-xl" />
                </div>
            </div>
            <span className="sr-only">Loading dashboard stats…</span>
        </div>
    );
}
