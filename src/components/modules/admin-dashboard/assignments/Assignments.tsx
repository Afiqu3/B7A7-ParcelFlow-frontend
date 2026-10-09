"use client";

import {
    CircleAlert,
    ClipboardList,
    ListFilter,
    RefreshCw,
} from "lucide-react";
import { useState } from "react";
import DataPager from "@/components/shared/DataPager";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetAllAssignment } from "@/hooks";
import { cn } from "@/lib/utils";
import type { AssignmentParams, AssignmentStatus } from "@/types";
import AssignmentCard from "./AssignmentCard";
import {
    ASSIGNMENT_STATUS_META,
    ASSIGNMENT_STATUS_ORDER,
} from "./assignment-status";

const PAGE_LIMIT = 10;

type StatusFilter = "ALL" | AssignmentStatus;

/** Assignment directory: status tabs, cards with cancel, pagination. */
export default function Assignments() {
    const [status, setStatus] = useState<StatusFilter>("ALL");
    const [page, setPage] = useState(1);

    const params: AssignmentParams = {
        status: status === "ALL" ? undefined : status,
        page,
        limit: PAGE_LIMIT,
        sortOrder: "desc",
    };
    const { data, isPending, isError, error, refetch, isFetching } =
        useGetAllAssignment(params);

    const assignments = data?.data ?? [];
    const total = data?.meta?.total ?? assignments.length;
    const totalPages = Math.max(1, data?.meta?.totalPages ?? 1);
    const safePage = Math.min(page, totalPages);
    const refreshing = isFetching && !isPending;
    const filtered = status !== "ALL";

    return (
        <div className="flex min-w-0 flex-col gap-5">
            {/* Controls: status tabs */}
            <div
                className="flex flex-col gap-3 rounded-2xl bg-card p-4 ring-1 ring-secondary/10 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:fill-mode-backwards sm:p-5"
                style={{ animationDelay: "80ms" }}
            >
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
                                aria-label="Filter assignments by status"
                                className="flex w-max justify-start gap-1 rounded-xl bg-secondary/5 p-1 ring-1 ring-secondary/10 ring-inset"
                            >
                                <TabsTrigger
                                    value="ALL"
                                    className="h-9 shrink-0 rounded-lg px-3.5 font-heading text-[13px] font-bold whitespace-nowrap text-secondary/60 transition-colors hover:text-secondary data-active:bg-brand data-active:text-white data-active:shadow-[0_8px_20px_-10px_rgba(15,32,86,0.8)]"
                                >
                                    All
                                </TabsTrigger>
                                {ASSIGNMENT_STATUS_ORDER.map((value) => (
                                    <TabsTrigger
                                        key={value}
                                        value={value}
                                        className="h-9 shrink-0 rounded-lg px-3.5 font-heading text-xs font-bold whitespace-nowrap text-secondary/60 transition-colors hover:text-brand-orange data-active:bg-brand data-active:text-white data-active:shadow-[0_8px_20px_-10px_rgba(15,32,86,0.8)]"
                                    >
                                        {
                                            ASSIGNMENT_STATUS_META[value]
                                                .short
                                        }
                                    </TabsTrigger>
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
                            ? "Loading assignments…"
                            : `${total} assignment${total === 1 ? "" : "s"}${
                                  filtered ? " match your filter" : ""
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
                            onClick={() => {
                                setStatus("ALL");
                                setPage(1);
                            }}
                            className="ml-auto font-heading text-xs font-bold text-brand-orange-ink underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-brand-orange/50"
                        >
                            Clear filter
                        </button>
                    ) : null}
                </div>
            </div>

            {/* Results */}
            {isPending ? (
                <AssignmentGridSkeleton />
            ) : isError || !data ? (
                <div className="flex flex-col items-center gap-3 rounded-2xl bg-card px-6 py-12 text-center ring-1 ring-secondary/10">
                    <span className="grid size-12 place-items-center rounded-2xl bg-destructive/10 text-destructive">
                        <CircleAlert className="size-6" strokeWidth={2} />
                    </span>
                    <div>
                        <h2 className="font-heading text-lg font-extrabold tracking-tight text-secondary">
                            Couldn&apos;t load assignments
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
            ) : assignments.length === 0 ? (
                <div className="flex flex-col items-center gap-4 rounded-2xl bg-card px-6 py-12 text-center ring-1 ring-secondary/10 sm:py-16">
                    <span className="grid size-14 place-items-center rounded-2xl bg-brand/8 text-brand ring-1 ring-brand/10 ring-inset">
                        <ClipboardList
                            className="size-7"
                            strokeWidth={2}
                        />
                    </span>
                    <div>
                        <h2 className="font-heading text-lg font-extrabold tracking-tight text-secondary">
                            {filtered
                                ? "No assignments match your filter"
                                : "No assignments yet"}
                        </h2>
                        <p className="mx-auto mt-1 max-w-sm text-sm text-secondary/65">
                            {filtered
                                ? "Try a different status — or clear the filter to see everything."
                                : "Assign parcels to riders and they will appear here."}
                        </p>
                    </div>
                    {filtered ? (
                        <Button
                            type="button"
                            onClick={() => {
                                setStatus("ALL");
                                setPage(1);
                            }}
                            className="h-10 rounded-xl bg-brand px-5 font-heading text-sm font-bold text-white transition hover:brightness-125 active:scale-[0.99]"
                        >
                            Clear filter
                        </Button>
                    ) : null}
                </div>
            ) : (
                <>
                    <div
                        key={`${status}|${safePage}`}
                        aria-busy={refreshing}
                        className={cn(
                            "grid grid-cols-1 items-start gap-4 transition-opacity sm:grid-cols-2 xl:grid-cols-3",
                            refreshing && "opacity-70",
                        )}
                    >
                        {assignments.map((assignment, index) => (
                            <AssignmentCard
                                key={assignment.id}
                                assignment={assignment}
                                index={index}
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
        </div>
    );
}

function AssignmentGridSkeleton() {
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
                        <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            ))}
            <span className="sr-only">Loading assignments…</span>
        </div>
    );
}
