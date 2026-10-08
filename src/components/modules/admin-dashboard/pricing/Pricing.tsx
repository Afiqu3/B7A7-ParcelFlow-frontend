"use client";

import {
    CircleAlert,
    Pencil,
    Plus,
    Receipt,
    RefreshCw,
} from "lucide-react";
import { useMemo, useState } from "react";
import { CATEGORIES, ZONES } from "@/components/modules/pricing/pricing-meta";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminPricingRules } from "@/hooks";
import { formatKg, formatTaka } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import type { PricingRule } from "@/types";
import PricingRuleForm from "./PricingRuleForm";
import UpdatePricingRuleDialog from "./UpdatePricingRuleDialog";

const ZONE_RANK: Record<PricingRule["zoneType"], number> = {
    INSIDE_CITY: 0,
    SUB_CITY: 1,
    OUTSIDE_CITY: 2,
};

/** Pricing rules management: create form + editable rule cards. */
export default function Pricing() {
    const { data, isPending, isError, error, refetch, isFetching } =
        useAdminPricingRules();
    const [editing, setEditing] = useState<PricingRule | null>(null);

    const rules = useMemo(
        () =>
            [...(data ?? [])].sort(
                (a, b) =>
                    ZONE_RANK[a.zoneType] - ZONE_RANK[b.zoneType] ||
                    a.parcelCategory.localeCompare(b.parcelCategory),
            ),
        [data],
    );
    const activeCount = rules.filter((rule) => rule.isActive).length;

    return (
        <div className="flex min-w-0 flex-col gap-5">
            {/* Create card */}
            <section
                aria-labelledby="create-rule-title"
                className="overflow-hidden rounded-2xl bg-card ring-1 ring-secondary/10 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:fill-mode-backwards"
                style={{ animationDelay: "80ms" }}
            >
                <div className="flex items-center gap-3 border-b border-secondary/8 bg-gradient-to-r from-brand-cream via-brand-cream/40 to-transparent px-5 py-5 sm:px-6">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand text-white shadow-[0_12px_24px_-12px_rgba(15,32,86,0.7)]">
                        <Plus className="size-5" strokeWidth={2.25} />
                    </span>
                    <div className="min-w-0">
                        <h2
                            id="create-rule-title"
                            className="font-heading text-lg font-extrabold tracking-tight text-secondary"
                        >
                            Create pricing rule
                        </h2>
                        <p className="mt-0.5 text-sm text-secondary/70">
                            One rule per zone and parcel category.
                        </p>
                    </div>
                </div>
                <div className="px-5 py-5 sm:px-6 sm:py-6">
                    <PricingRuleForm />
                </div>
            </section>

            {/* Rules list */}
            <section aria-labelledby="rules-list-title">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2
                        id="rules-list-title"
                        className="font-heading text-base font-extrabold tracking-tight text-secondary"
                    >
                        All rules
                    </h2>
                    <p aria-live="polite" className="text-xs text-secondary/60">
                        {!isPending &&
                            !isError &&
                            `${rules.length} rule${rules.length === 1 ? "" : "s"} · ${activeCount} active`}
                        {isFetching && !isPending ? " · Updating…" : ""}
                    </p>
                </div>

                <div className="mt-3">
                    {isPending ? (
                        <RuleGridSkeleton />
                    ) : isError ? (
                        <div className="flex flex-col items-center gap-3 rounded-2xl bg-card px-6 py-12 text-center ring-1 ring-secondary/10">
                            <span className="grid size-12 place-items-center rounded-2xl bg-destructive/10 text-destructive">
                                <CircleAlert
                                    className="size-6"
                                    strokeWidth={2}
                                />
                            </span>
                            <div>
                                <h3 className="font-heading text-lg font-extrabold tracking-tight text-secondary">
                                    Couldn&apos;t load pricing rules
                                </h3>
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
                    ) : rules.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 rounded-2xl bg-card px-6 py-12 text-center ring-1 ring-secondary/10">
                            <span className="grid size-12 place-items-center rounded-2xl bg-brand/8 text-brand ring-1 ring-brand/10 ring-inset">
                                <Receipt
                                    className="size-6"
                                    strokeWidth={2}
                                />
                            </span>
                            <div>
                                <h3 className="font-heading text-lg font-extrabold tracking-tight text-secondary">
                                    No pricing rules yet
                                </h3>
                                <p className="mx-auto mt-1 max-w-sm text-sm text-secondary/65">
                                    Create the first rule above — bookings
                                    need a rate for every zone and category.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div
                            key={rules.map((rule) => rule.id).join("|")}
                            className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 xl:grid-cols-3"
                        >
                            {rules.map((rule, index) => (
                                <RuleCard
                                    key={rule.id}
                                    rule={rule}
                                    index={index}
                                    onEdit={() => setEditing(rule)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <UpdatePricingRuleDialog
                rule={editing}
                onClose={() => setEditing(null)}
            />
        </div>
    );
}

function RuleCard({
    rule,
    index,
    onEdit,
}: {
    rule: PricingRule;
    index: number;
    onEdit: () => void;
}) {
    const charges: { label: string; value: string }[] = [
        {
            label: `Base · first ${formatKg(rule.baseWeightKg)}`,
            value: formatTaka(rule.baseCharge),
        },
        { label: "Per extra kg", value: formatTaka(rule.perKgCharge) },
        { label: "Express", value: formatTaka(rule.expressSurcharge) },
        { label: "Same day", value: formatTaka(rule.sameDaySurcharge) },
        { label: "Rider pickup", value: formatTaka(rule.riderPickupCharge) },
        { label: "COD fee", value: `${rule.codFeePercent}%` },
    ];

    return (
        <article
            aria-label={`${rule.name} pricing rule`}
            className={cn(
                "flex min-w-0 flex-col rounded-2xl bg-card p-4 ring-1 ring-secondary/10 transition-[box-shadow,opacity] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:fill-mode-backwards hover:shadow-[0_20px_40px_-28px_rgba(15,32,86,0.5)] sm:p-5",
                !rule.isActive && "opacity-70",
            )}
            style={{ animationDelay: `${Math.min(index, 7) * 50}ms` }}
        >
            <div className="flex items-start justify-between gap-3">
                <h3 className="min-w-0 flex-1 truncate font-heading text-[15px] font-extrabold tracking-tight text-secondary">
                    {rule.name}
                </h3>
                <span
                    className={cn(
                        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 font-heading text-[11px] font-bold tracking-wide uppercase ring-1 ring-inset",
                        rule.isActive
                            ? "bg-emerald-600/10 text-emerald-700 ring-emerald-600/20"
                            : "bg-secondary/8 text-secondary/60 ring-secondary/15",
                    )}
                >
                    <span
                        aria-hidden
                        className={cn(
                            "size-1.5 rounded-full",
                            rule.isActive
                                ? "bg-emerald-600"
                                : "bg-secondary/40",
                        )}
                    />
                    {rule.isActive ? "Active" : "Inactive"}
                </span>
            </div>

            <div className="mt-2.5 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-brand/8 px-2.5 py-1 font-heading text-[11px] font-bold text-brand ring-1 ring-brand/15 ring-inset">
                    {ZONES[rule.zoneType].label}
                </span>
                <span className="rounded-full bg-secondary/5 px-2.5 py-1 font-heading text-[11px] font-bold text-secondary/65 ring-1 ring-secondary/10 ring-inset">
                    {CATEGORIES[rule.parcelCategory].label}
                </span>
            </div>

            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 border-t border-secondary/8 pt-3 text-[13px]">
                {charges.map((charge) => (
                    <div
                        key={charge.label}
                        className="flex min-w-0 items-baseline justify-between gap-2"
                    >
                        <dt className="truncate text-secondary/60">
                            {charge.label}
                        </dt>
                        <dd className="shrink-0 font-heading font-bold text-secondary tabular-nums">
                            {charge.value}
                        </dd>
                    </div>
                ))}
            </dl>

            <Button
                type="button"
                variant="outline"
                onClick={onEdit}
                className="mt-4 h-10 w-full rounded-xl border-secondary/15 font-heading text-[13px] font-bold text-secondary hover:bg-brand hover:text-white hover:ring-brand"
            >
                <Pencil className="size-4" />
                Update rule
            </Button>
        </article>
    );
}

function RuleGridSkeleton() {
    return (
        <div
            aria-hidden
            className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
            {Array.from({ length: 6 }).map((_, index) => (
                <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholders
                    key={index}
                    className="flex flex-col gap-3 rounded-2xl bg-card p-4 ring-1 ring-secondary/10 sm:p-5"
                >
                    <div className="flex items-start justify-between gap-3">
                        <Skeleton className="h-5 w-2/3" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                    <div className="flex gap-1.5">
                        <Skeleton className="h-6 w-24 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                    <Skeleton className="h-10 w-full rounded-xl" />
                </div>
            ))}
            <span className="sr-only">Loading pricing rules…</span>
        </div>
    );
}
