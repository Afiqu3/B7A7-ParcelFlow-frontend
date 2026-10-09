"use client";

import {
    CircleAlert,
    ListFilter,
    Package,
    RefreshCw,
    Search,
    X,
} from "lucide-react";
import { useState } from "react";
import DataPager from "@/components/shared/DataPager";
import ParcelDetailsDialog from "@/components/modules/parcels/ParcelDetailsDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDebounce, useGetAllParcels, useGetSingleParcelAsAdmin } from "@/hooks";
import { cn } from "@/lib/utils";
import type { MyParcelsParams, ParcelStatus } from "@/types";
import {
    PARCEL_STATUS_META,
    PARCEL_STATUS_ORDER,
} from "@/components/modules/parcels/parcel-status";
import AdminParcelCard from "./AdminParcelCard";

const PAGE_LIMIT = 10;

type StatusFilter = "ALL" | ParcelStatus;

/** All-merchant parcel directory: status tabs, search, grid, pagination. */
export default function Parcels() {
    const [status, setStatus] = useState<StatusFilter>("ALL");
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search);
    const [page, setPage] = useState(1);
    const [selectedId, setSelectedId] = useState("");

    const params: MyParcelsParams = {
        status: status === "ALL" ? undefined : status,
        searchTerm: debouncedSearch.trim() || undefined,
        page,
        limit: PAGE_LIMIT,
        sortOrder: "desc",
    };
    const { data, isPending, isError, error, refetch, isFetching } =
        useGetAllParcels(params);

    const parcels = data?.data ?? [];
    const total = data?.meta?.total ?? parcels.length;
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
                        placeholder="Search by tracking ID…"
                        aria-label="Search parcels by tracking ID"
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
                                aria-label="Filter parcels by status"
                                className="flex w-max justify-start gap-1 rounded-xl bg-secondary/5 p-1 ring-1 ring-secondary/10 ring-inset"
                            >
                                <StatusTab value="ALL" label="All" />
                                {PARCEL_STATUS_ORDER.map((value) => (
                                    <StatusTab
                                        key={value}
                                        value={value}
                                        label={
                                            PARCEL_STATUS_META[value].short
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
                            ? "Loading parcels…"
                            : `${total} parcel${total === 1 ? "" : "s"}${
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
                <ParcelGridSkeleton />
            ) : isError || !data ? (
                <div className="flex flex-col items-center gap-3 rounded-2xl bg-card px-6 py-12 text-center ring-1 ring-secondary/10">
                    <span className="grid size-12 place-items-center rounded-2xl bg-destructive/10 text-destructive">
                        <CircleAlert className="size-6" strokeWidth={2} />
                    </span>
                    <div>
                        <h2 className="font-heading text-lg font-extrabold tracking-tight text-secondary">
                            Couldn&apos;t load parcels
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
            ) : parcels.length === 0 ? (
                <div className="flex flex-col items-center gap-4 rounded-2xl bg-card px-6 py-12 text-center ring-1 ring-secondary/10 sm:py-16">
                    <span className="grid size-14 place-items-center rounded-2xl bg-brand/8 text-brand ring-1 ring-brand/10 ring-inset">
                        <Package className="size-7" strokeWidth={2} />
                    </span>
                    <div>
                        <h2 className="font-heading text-lg font-extrabold tracking-tight text-secondary">
                            {filtered
                                ? "No parcels match your filters"
                                : "No parcels yet"}
                        </h2>
                        <p className="mx-auto mt-1 max-w-sm text-sm text-secondary/65">
                            {filtered
                                ? "Try a different tracking ID or status — or clear the filters to see everything."
                                : "Merchant bookings will appear here for hub processing."}
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
                <>
                    <div
                        key={`${status}|${debouncedSearch}|${safePage}`}
                        aria-busy={refreshing}
                        className={cn(
                            "grid grid-cols-1 items-start gap-4 transition-opacity sm:grid-cols-2 xl:grid-cols-3",
                            refreshing && "opacity-70",
                        )}
                    >
                        {parcels.map((parcel, index) => (
                            <AdminParcelCard
                                key={parcel.id}
                                parcel={parcel}
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

            <ParcelDetailsDialog
                parcelId={selectedId}
                onClose={() => setSelectedId("")}
                fetchHook={useGetSingleParcelAsAdmin}
            />
        </div>
    );
}

function StatusTab({ value, label }: { value: string; label: string }) {
    return (
        <TabsTrigger
            value={value}
            className="h-9 shrink-0 rounded-lg px-3.5 font-heading text-xs font-bold whitespace-nowrap text-secondary/60 transition-colors hover:text-brand-orange data-active:bg-brand data-active:text-white data-active:shadow-[0_8px_20px_-10px_rgba(15,32,86,0.8)]"
        >
            {label}
        </TabsTrigger>
    );
}

function ParcelGridSkeleton() {
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
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex gap-1.5">
                        <Skeleton className="h-6 w-24 rounded-full" />
                        <Skeleton className="h-6 w-28 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex items-center justify-between border-t border-secondary/8 pt-3">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-10 w-full rounded-xl" />
                </div>
            ))}
            <span className="sr-only">Loading parcels…</span>
        </div>
    );
}
