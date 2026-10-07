"use client";

import { useReducedMotion } from "motion/react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import AnimatedNumber from "@/components/modules/pricing/AnimatedNumber";

function DonutTooltip({
    active,
    payload,
}: {
    active?: boolean;
    payload?: { name: string; value: number }[];
}) {
    if (!active || !payload || payload.length === 0) return null;
    return (
        <div className="rounded-xl bg-brand px-3 py-2 text-white shadow-xl ring-1 ring-white/10">
            <p className="font-heading text-sm font-extrabold tabular-nums">
                {payload[0].value}{" "}
                <span className="text-xs font-bold text-white/70">
                    {payload[0].name}
                </span>
            </p>
        </div>
    );
}

/** Prepaid vs COD split donut for the merchant dashboard. */
export default function PaymentDonut({
    prepaid,
    cod,
}: {
    prepaid: number;
    cod: number;
}) {
    const reduceMotion = useReducedMotion();
    const total = prepaid + cod;
    const slices = [
        { name: "Prepaid", value: prepaid, color: "#0F2056" },
        { name: "COD", value: cod, color: "#FF6B2D" },
    ];

    return (
        <section
            aria-label="Payment type split"
            className="flex min-w-0 flex-col rounded-2xl bg-card p-5 ring-1 ring-secondary/10 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:fill-mode-backwards sm:p-6"
            style={{ animationDelay: "200ms" }}
        >
            <p className="font-heading text-[11px] font-bold tracking-[0.18em] text-brand-orange-ink uppercase">
                Payment split
            </p>
            <h2 className="mt-1 font-heading text-base font-extrabold tracking-tight text-secondary">
                How customers pay
            </h2>

            {total === 0 ? (
                <p className="mt-4 flex-1 rounded-xl bg-secondary/5 px-4 py-8 text-center text-[13px] text-secondary/60 ring-1 ring-secondary/10 ring-inset">
                    No parcels yet — the split appears here.
                </p>
            ) : (
                <>
                    <div className="relative mx-auto mt-2 h-48 w-full max-w-60">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Tooltip content={<DonutTooltip />} />
                                <Pie
                                    data={slices}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius="68%"
                                    outerRadius="88%"
                                    paddingAngle={4}
                                    cornerRadius={6}
                                    strokeWidth={0}
                                    isAnimationActive={!reduceMotion}
                                    animationDuration={800}
                                >
                                    {slices.map((slice) => (
                                        <Cell
                                            key={slice.name}
                                            fill={slice.color}
                                        />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div
                            aria-hidden
                            className="pointer-events-none absolute inset-0 grid place-items-center"
                        >
                            <p className="font-heading text-2xl font-extrabold tracking-tight text-secondary tabular-nums">
                                <AnimatedNumber
                                    countUp
                                    value={total}
                                    format={(value) =>
                                        Math.round(value).toString()
                                    }
                                />
                            </p>
                        </div>
                    </div>
                    <ul className="mt-2 flex flex-col gap-2">
                        {slices.map((slice) => (
                            <li
                                key={slice.name}
                                className="flex items-center gap-2.5 rounded-xl bg-secondary/[0.04] px-3.5 py-2.5 ring-1 ring-secondary/8 ring-inset"
                            >
                                <span
                                    aria-hidden
                                    className="size-2.5 shrink-0 rounded-full"
                                    style={{ backgroundColor: slice.color }}
                                />
                                <span className="font-heading text-[13px] font-bold text-secondary">
                                    {slice.name}
                                </span>
                                <span className="ml-auto font-heading text-[13px] font-extrabold text-secondary tabular-nums">
                                    {slice.value}
                                    <span className="ml-1.5 font-semibold text-secondary/50">
                                        {Math.round(
                                            (slice.value / total) * 100,
                                        )}
                                        %
                                    </span>
                                </span>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </section>
    );
}
