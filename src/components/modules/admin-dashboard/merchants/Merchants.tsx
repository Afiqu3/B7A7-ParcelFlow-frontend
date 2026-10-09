"use client";

import {
    CircleAlert,
    ListFilter,
    RefreshCw,
    Search,
    Store,
    X,
} from "lucide-react";
import { useState } from "react";
import { initials } from "@/components/dashboard/nav";
import DataPager from "@/components/shared/DataPager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDebounce, useGetAllMerchant } from "@/hooks";
import { cn } from "@/lib/utils";
import type { Merchant, MerchantParams, UserStatus } from "@/types";
import MerchantStatusToggle from "./MerchantStatusToggle";

const PAGE_LIMIT = 10;

type StatusFilter = "ALL" | UserStatus;

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
    { value: "ALL", label: "All" },
    { value: "ACTIVE", label: "Active" },
    { value: "BLOCKED", label: "Blocked" },
];

/** Merchant directory: name + email rows, status tabs, toggle, pagination. */
export default function Merchants() {
    const [status, setStatus] = useState<StatusFilter>("ALL");
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search);
    const [page, setPage] = useState(1);

    const params: MerchantParams = {
        status: status === "ALL" ? undefined : status,
        searchTerm: debouncedSearch.trim() || undefined,
        page,
        limit: PAGE_LIMIT,
        sortOrder: "desc",
    };
    const { data, isPending, isError, error, refetch, isFetching } =
        useGetAllMerchant(params);

    const merchants = (data?.data ?? []) as Merchant[];
    const total = data?.meta?.total ?? merchants.length;
    const totalPages = Math.max(1, data?.meta?.totalPages ?? 1);
    const safePage = Math.min(page, totalPages);
    const refreshing = isFetching && !isPending;
    const filtered = status !== "ALL" || debouncedSearch.trim() !== "";

    const clearFilters = () => {
        setStatus("ALL");
        setSearch("");
        setPage(1);
    };

    return (
        <div className="flex min-w-0 flex-col gap-5">
            {/* Controls: search + status tabs */}
            <div
                className="flex flex-col gap-3 rounded-2xl bg-card p-4 ring-1 ring-secondary/10 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:fill-mode-backwards sm:p-5"
                style={{ animationDelay: "80ms" }}
            >
                <div className="relative">
                    <Search
                        aria-hidden
                        className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-secondary/40"
                    />
                    <Input
                        type="search"
                        value={search}
                        onChange={(event) => {
                            setSearch(event.target.value);
                            setPage(1);
                        }}
                        placeholder="Search by name or email…"
                        aria-label="Search merchants by name or email"
                        className="h-11 rounded-xl border-secondary/15 bg-background pr-10 pl-10 text-secondary shadow-none placeholder:text-secondary/40 focus-visible:border-brand-orange focus-visible:ring-3 focus-visible:ring-brand-orange/30 [&::-webkit-search-cancel-button]:hidden"
                    />
                    {search ? (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");
                                setPage(1);
                            }}
                            aria-label="Clear search"
                            className="absolute top-1/2 right-3 grid size-7 -translate-y-1/2 place-items-center rounded-lg text-secondary/50 outline-none transition-colors hover:bg-secondary/8 hover:text-secondary focus-visible:ring-2 focus-visible:ring-brand-orange/50"
                        >
                            <X className="size-4" />
                        </button>
                    ) : null}
                </div>

                <Tabs
                    value={status}
                    onValueChange={(next) => {
                        setStatus(next as StatusFilter);
                        setPage(1);
                    }}
                    className="gap-0"
                >
                    <TabsList
                        aria-label="Filter merchants by status"
                        className="flex w-full justify-start gap-1 rounded-xl bg-secondary/5 p-1 ring-1 ring-secondary/10 ring-inset sm:w-fit"
                    >
                        {STATUS_TABS.map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="h-9 flex-1 rounded-lg px-4 font-heading text-[13px] font-bold whitespace-nowrap text-secondary/60 transition-colors outline-none hover:text-secondary focus-visible:ring-2 focus-visible:ring-brand-orange/50 data-active:bg-brand data-active:text-white data-active:shadow-[0_8px_20px_-10px_rgba(15,32,86,0.8)] sm:flex-none"
                            >
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>

                <div className="flex items-center gap-2 text-xs text-secondary/60">
                    <ListFilter aria-hidden className="size-3.5" />
                    <p aria-live="polite">
                        {isPending
                            ? "Loading merchants…"
                            : `${total} merchant${total === 1 ? "" : "s"}${
                                  filtered ? " match your filters" : ""
                              }`}
                    </p>
                    {refreshing ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/8 px-2.5 py-0.5 font-heading text-[11px] font-bold text-brand">
                            <RefreshCw className="size-3 animate-spin" />
                            Updating…
                        </span>
                    ) : null}
                    {filtered && !isPending ? (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="ml-auto font-heading text-xs font-bold text-brand-orange-ink underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-brand-orange/50"
                        >
                            Clear filters
                        </button>
                    ) : null}
                </div>
            </div>

            {/* Results */}
            <div
                className="overflow-hidden rounded-2xl bg-card ring-1 ring-secondary/10 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:fill-mode-backwards"
                style={{ animationDelay: "140ms" }}
            >
                {isPending ? (
                    <MerchantTableSkeleton />
                ) : isError || !data ? (
                    <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
                        <span className="grid size-12 place-items-center rounded-2xl bg-destructive/10 text-destructive">
                            <CircleAlert
                                className="size-6"
                                strokeWidth={2}
                            />
                        </span>
                        <div>
                            <h2 className="font-heading text-lg font-extrabold tracking-tight text-secondary">
                                Couldn&apos;t load merchants
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
                ) : merchants.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 px-6 py-12 text-center sm:py-16">
                        <span className="grid size-14 place-items-center rounded-2xl bg-brand/8 text-brand ring-1 ring-brand/10 ring-inset">
                            <Store className="size-7" strokeWidth={2} />
                        </span>
                        <div>
                            <h2 className="font-heading text-lg font-extrabold tracking-tight text-secondary">
                                {filtered
                                    ? "No merchants match your filters"
                                    : "No merchants yet"}
                            </h2>
                            <p className="mx-auto mt-1 max-w-sm text-sm text-secondary/65">
                                {filtered
                                    ? "Try a different name, email or status — or clear the filters to see everyone."
                                    : "Merchant registrations will appear here."}
                            </p>
                        </div>
                        {filtered ? (
                            <Button
                                type="button"
                                onClick={clearFilters}
                                className="h-10 rounded-xl bg-brand px-5 font-heading text-sm font-bold text-white transition hover:brightness-125 active:scale-[0.99]"
                            >
                                Clear filters
                            </Button>
                        ) : null}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-150 border-collapse text-left text-sm">
                            <caption className="sr-only">
                                Merchants
                                {filtered
                                    ? ` matching “${debouncedSearch.trim()}”`
                                    : ""}
                                , page {safePage} of {totalPages}
                            </caption>
                            <thead>
                                <tr className="border-b border-secondary/8 bg-secondary/[0.03] font-heading text-[11px] font-bold tracking-[0.14em] text-secondary/55 uppercase">
                                    <th
                                        scope="col"
                                        className="w-12 px-5 py-3.5 pr-0 font-bold sm:px-6"
                                    >
                                        <span className="sr-only">Row</span>
                                        <span aria-hidden>#</span>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-3.5 font-bold"
                                    >
                                        Merchant
                                    </th>
                                    <th
                                        scope="col"
                                        className="hidden px-4 py-3.5 font-bold md:table-cell"
                                    >
                                        Email
                                    </th>
                                    <th
                                        scope="col"
                                        className="hidden px-4 py-3.5 font-bold sm:table-cell"
                                    >
                                        Status
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-5 py-3.5 pr-5 pl-4 text-right font-bold sm:px-6"
                                    >
                                        <span className="sr-only">
                                            Toggle status
                                        </span>
                                        <span aria-hidden>Action</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody
                                key={`${status}|${debouncedSearch}|${safePage}`}
                                aria-busy={refreshing}
                                className={cn(
                                    "transition-opacity",
                                    refreshing && "opacity-70",
                                )}
                            >
                                {merchants.map((merchant, index) => {
                                    const blocked =
                                        merchant.status === "BLOCKED";
                                    return (
                                        <tr
                                            key={merchant.id}
                                            className="border-b border-secondary/6 transition-colors motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 motion-safe:duration-300 motion-safe:fill-mode-backwards last:border-0 hover:bg-secondary/[0.03]"
                                            style={{
                                                animationDelay: `${Math.min(index, 7) * 40}ms`,
                                            }}
                                        >
                                            <td className="w-12 px-5 py-3.5 pr-0 font-mono text-xs text-secondary/40 tabular-nums sm:px-6">
                                                {(safePage - 1) * PAGE_LIMIT +
                                                    index +
                                                    1}
                                            </td>
                                            <td className="min-w-0 px-4 py-3.5">
                                                <span className="flex min-w-0 items-center gap-3">
                                                    <span
                                                        aria-hidden
                                                        className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand font-heading text-xs font-extrabold text-white"
                                                    >
                                                        {initials(
                                                            merchant.name,
                                                        )}
                                                    </span>
                                                    <span className="min-w-0">
                                                        <span className="block truncate font-heading text-sm font-bold text-secondary">
                                                            {merchant.name}
                                                        </span>
                                                        <span className="block truncate text-xs text-secondary/55 md:hidden">
                                                            {merchant.email}
                                                        </span>
                                                        <span className="mt-1 block sm:hidden">
                                                            <StatusBadge
                                                                blocked={
                                                                    blocked
                                                                }
                                                            />
                                                        </span>
                                                    </span>
                                                </span>
                                            </td>
                                            <td className="hidden max-w-60 px-4 py-3.5 md:table-cell">
                                                <a
                                                    href={`mailto:${merchant.email}`}
                                                    className="block truncate text-secondary/75 underline-offset-4 outline-none transition-colors hover:text-brand hover:underline focus-visible:text-brand focus-visible:underline"
                                                >
                                                    {merchant.email}
                                                </a>
                                            </td>
                                            <td className="hidden px-4 py-3.5 sm:table-cell">
                                                <StatusBadge
                                                    blocked={blocked}
                                                />
                                            </td>
                                            <td className="px-5 py-3.5 pr-5 pl-4 text-right sm:px-6">
                                                <span className="inline-flex justify-end">
                                                    <MerchantStatusToggle
                                                        merchant={merchant}
                                                    />
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {!isPending && !isError && data ? (
                <DataPager
                    page={safePage}
                    totalPages={totalPages}
                    onChange={setPage}
                />
            ) : null}
        </div>
    );
}

function StatusBadge({ blocked }: { blocked: boolean }) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-heading text-[11px] font-bold tracking-wide whitespace-nowrap uppercase ring-1 ring-inset",
                blocked
                    ? "bg-destructive/10 text-destructive ring-destructive/20"
                    : "bg-emerald-600/10 text-emerald-700 ring-emerald-600/20",
            )}
        >
            <span
                aria-hidden
                className={cn(
                    "size-1.5 rounded-full",
                    blocked ? "bg-destructive" : "bg-emerald-600",
                )}
            />
            {blocked ? "Blocked" : "Active"}
        </span>
    );
}

function MerchantTableSkeleton() {
    return (
        <div aria-hidden className="flex flex-col">
            {Array.from({ length: 6 }).map((_, index) => (
                <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholders
                    key={index}
                    className="flex items-center gap-3 border-b border-secondary/6 px-5 py-3.5 last:border-0 sm:px-6"
                >
                    <Skeleton className="size-9 shrink-0 rounded-xl" />
                    <div className="min-w-0 flex-1">
                        <Skeleton className="h-4 w-2/5" />
                        <Skeleton className="mt-1.5 h-3 w-3/5 md:hidden" />
                    </div>
                    <Skeleton className="hidden h-4 w-48 md:block" />
                    <Skeleton className="hidden h-6 w-20 rounded-full sm:block" />
                    <Skeleton className="size-9 shrink-0 rounded-xl" />
                </div>
            ))}
            <span className="sr-only">Loading merchants…</span>
        </div>
    );
}
