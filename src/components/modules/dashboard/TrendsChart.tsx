"use client";

import { useReducedMotion } from "motion/react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import AnimatedNumber from "@/components/modules/pricing/AnimatedNumber";
import type { ParcelsCreated } from "@/types";

function formatDay(iso: string) {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return iso;
    return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
    });
}

function formatFullDay(iso: string) {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return iso;
    return date.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
    });
}

function TrendsTooltip({
    active,
    payload,
    label,
}: {
    active?: boolean;
    payload?: { value: number | string }[];
    label?: string;
}) {
    if (!active || !payload || payload.length === 0) return null;
    return (
        <div className="rounded-xl bg-brand px-3.5 py-2.5 text-white shadow-xl ring-1 ring-white/10">
            <p className="font-heading text-[11px] font-bold tracking-[0.14em] text-brand-muted uppercase">
                {label ? formatFullDay(label) : ""}
            </p>
            <p className="mt-1 font-heading text-xl leading-none font-extrabold tabular-nums">
                {payload[0].value}{" "}
                <span className="text-xs font-bold text-white/70">
                    parcel{payload[0].value === 1 ? "" : "s"}
                </span>
            </p>
        </div>
    );
}

/** 30-day parcels-booked area chart for the merchant dashboard. */
export default function TrendsChart({
    points,
}: {
    points: ParcelsCreated[];
}) {
    const reduceMotion = useReducedMotion();
    const total = points.reduce((sum, point) => sum + point.count, 0);
    const interval = Math.max(0, Math.floor((points.length - 1) / 5));

    return (
        <section
            aria-label="Booking trend, last 30 days"
            className="flex min-w-0 flex-col rounded-2xl bg-card p-5 ring-1 ring-secondary/10 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:fill-mode-backwards sm:p-6"
            style={{ animationDelay: "140ms" }}
        >
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="font-heading text-[11px] font-bold tracking-[0.18em] text-brand-orange-ink uppercase">
                        Last 30 days
                    </p>
                    <h2 className="mt-1 font-heading text-base font-extrabold tracking-tight text-secondary">
                        Booking trend
                    </h2>
                </div>
                <p className="font-heading text-2xl font-extrabold tracking-tight text-secondary tabular-nums">
                    <AnimatedNumber
                        countUp
                        value={total}
                        format={(value) => Math.round(value).toString()}
                    />{" "}
                    <span className="text-xs font-bold text-secondary/55">
                        booked
                    </span>
                </p>
            </div>

            {points.length === 0 ? (
                <p className="mt-4 rounded-xl bg-secondary/5 px-4 py-8 text-center text-[13px] text-secondary/60 ring-1 ring-secondary/10 ring-inset">
                    No bookings in the last 30 days — new parcels will draw
                    the trend here.
                </p>
            ) : (
                <div className="mt-4 h-64 w-full sm:h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={points}
                            margin={{ top: 8, right: 4, bottom: 0, left: 0 }}
                        >
                            <defs>
                                <linearGradient
                                    id="trendFill"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor="#0F2056"
                                        stopOpacity={0.28}
                                    />
                                    <stop
                                        offset="100%"
                                        stopColor="#0F2056"
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                vertical={false}
                                stroke="rgba(9,20,51,0.08)"
                            />
                            <XAxis
                                dataKey="date"
                                tickFormatter={formatDay}
                                interval={interval}
                                tickLine={false}
                                axisLine={false}
                                tick={{
                                    fill: "rgba(9,20,51,0.5)",
                                    fontSize: 12,
                                }}
                                dy={6}
                            />
                            <YAxis
                                allowDecimals={false}
                                width={30}
                                tickLine={false}
                                axisLine={false}
                                tick={{
                                    fill: "rgba(9,20,51,0.5)",
                                    fontSize: 12,
                                }}
                            />
                            <Tooltip
                                content={<TrendsTooltip />}
                                cursor={{
                                    stroke: "#FF6B2D",
                                    strokeWidth: 1.5,
                                    strokeDasharray: "4 4",
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="count"
                                name="Parcels"
                                stroke="#0F2056"
                                strokeWidth={2.5}
                                fill="url(#trendFill)"
                                dot={false}
                                activeDot={{
                                    r: 5,
                                    fill: "#FF6B2D",
                                    stroke: "#fff",
                                    strokeWidth: 2,
                                }}
                                isAnimationActive={!reduceMotion}
                                animationDuration={800}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}

            <p className="sr-only" aria-live="polite">
                {total} parcels booked in the last 30 days.
            </p>
        </section>
    );
}
