"use client";

import {
    ArrowRight,
    Bike,
    CircleAlert,
    ListFilter,
    RefreshCw,
    Search,
    X,
} from "lucide-react";
import { useState } from "react";
import DataPager from "@/components/shared/DataPager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDebounce, useGetAllRider } from "@/hooks";
import { cn } from "@/lib/utils";
import type { RiderApplicationStatus, RiderParams } from "@/types";
import RiderCard from "./RiderCard";
import RiderDetailsDialog from "./RiderDetailsDialog";
import {
    RIDER_APPLICATION_META,
    RIDER_APPLICATION_ORDER,
} from "./rider-status";

const PAGE_LIMIT = 10;

type StatusFilter = "ALL" | RiderApplicationStatus;

/** Admin rider directory: status tabs, search, cards, pagination. */
export default function Riders() {
    const [status, setStatus] = useState<StatusFilter>("ALL");
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search);
    const [page, setPage] = useState(1);
    const [selectedId, setSelectedId] = useState("");

    const params: RiderParams = {
        applicationStatus: status === "ALL" ? undefined : status,
        searchTerm: debouncedSearch.trim() || undefined,
        page,
        limit: PAGE_LIMIT,
        sortOrder: "desc",
    };
    const { data, isPending, isError, error, refetch, isFetching } =
        useGetAllRider(params);

    const riders = data?.data ?? [];
    const total = data?.meta?.total ?? riders.length;
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
                        aria-label="Search riders by name or email"
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
                    <div className="relative">
                        <div className="overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden px-5">
                            <TabsList
                                aria-label="Filter riders by application status"
                                className="flex w-max justify-start gap-1 rounded-xl bg-secondary/5 p-1 ring-1 ring-secondary/10 ring-inset"
                            >
                                <StatusTab value="ALL" label="All" />
                                {RIDER_APPLICATION_ORDER.map((value) => (
                                    <StatusTab
                                        key={value}
                                        value={value}
                                        label={
                                            RIDER_APPLICATION_META[value].short
                                        }
                                    />
                                ))}
                            </TabsList>
                        </div>
                        <div
                            aria-hidden
                            className="pointer-events-none absolute inset-y-0 left-0 w-8 rounded-l-xl bg-linear-to-r from-card via-card/70 to-transparent"
                        />
                        <div
                            aria-hidden
                            className="pointer-events-none absolute inset-y-0 right-0 w-8 rounded-r-xl bg-linear-to-l from-card via-card/70 to-transparent"
                        />
                    </div>
                </Tabs>

                <div className="flex items-center gap-2 text-xs text-secondary/60">
                    <ListFilter aria-hidden className="size-3.5" />
                    <p aria-live="polite">
                        {isPending
                            ? "Loading riders…"
                            : `${total} rider${total === 1 ? "" : "s"}${
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
            {isPending ? (
                <RiderGridSkeleton />
            ) : isError || !data ? (
                <div className="flex flex-col items-center gap-3 rounded-2xl bg-card px-6 py-12 text-center ring-1 ring-secondary/10">
                    <span className="grid size-12 place-items-center rounded-2xl bg-destructive/10 text-destructive">
                        <CircleAlert className="size-6" strokeWidth={2} />
                    </span>
                    <div>
                        <h2 className="font-heading text-lg font-extrabold tracking-tight text-secondary">
                            Couldn&apos;t load riders
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
            ) : riders.length === 0 ? (
                <div className="flex flex-col items-center gap-4 rounded-2xl bg-card px-6 py-12 text-center ring-1 ring-secondary/10 sm:py-16">
                    <span className="grid size-14 place-items-center rounded-2xl bg-brand/8 text-brand ring-1 ring-brand/10 ring-inset">
                        <Bike className="size-7" strokeWidth={2} />
                    </span>
                    <div>
                        <h2 className="font-heading text-lg font-extrabold tracking-tight text-secondary">
                            {filtered
                                ? "No riders match your filters"
                                : "No riders yet"}
                        </h2>
                        <p className="mx-auto mt-1 max-w-sm text-sm text-secondary/65">
                            {filtered
                                ? "Try a different name, email or status — or clear the filters to see everyone."
                                : "Rider applications will appear here for review."}
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
                    ) : (
                        <p className="flex items-center gap-1.5 text-sm text-secondary/55">
                            Share the
                            <ArrowRight className="size-4" aria-hidden />
                            rider application link to get started.
                        </p>
                    )}
                </div>
            ) : (
                <>
                    <div
                        key={`${status}|${debouncedSearch}|${safePage}`}
                        aria-busy={refreshing}
                        className={cn(
                            "grid grid-cols-1 items-start gap-4 transition-opacity sm:grid-cols-2 xl:grid-cols-3",
                            refreshing && "opacity-70",
                        )}
                    >
                        {riders.map((rider, index) => (
                            <RiderCard
                                key={rider.id}
                                rider={rider}
                                index={index}
                                onView={setSelectedId}
                            />
                        ))}
                    </div>

                    <DataPager
                        page={safePage}
                        totalPages={totalPages}
                        onChange={setPage}
                    />
                </>
            )}

            <RiderDetailsDialog
                riderId={selectedId}
                onClose={() => setSelectedId("")}
            />
        </div>
    );
}

function StatusTab({ value, label }: { value: string; label: string }) {
    return (
        <TabsTrigger
            value={value}
            className="h-9 shrink-0 rounded-lg px-3.5 font-heading text-[13px] font-bold whitespace-nowrap text-secondary/60 transition-colors hover:text-brand-orange data-active:bg-brand data-active:text-white data-active:shadow-[0_8px_20px_-10px_rgba(15,32,86,0.8)]"
        >
            {label}
        </TabsTrigger>
    );
}

function RiderGridSkeleton() {
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
                    <div className="flex items-center gap-3">
                        <Skeleton className="size-11 rounded-2xl" />
                        <div className="flex-1">
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="mt-1.5 h-3 w-1/2" />
                        </div>
                    </div>
                    <div className="flex gap-1.5">
                        <Skeleton className="h-6 w-24 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex justify-end">
                        <Skeleton className="h-9 w-32 rounded-xl" />
                    </div>
                </div>
            ))}
            <span className="sr-only">Loading riders…</span>
        </div>
    );
}
