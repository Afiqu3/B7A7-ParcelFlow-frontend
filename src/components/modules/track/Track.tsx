"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import {
    Check,
    CircleAlert,
    Copy,
    History,
    PackageCheck,
    PackageSearch,
    Search,
    Truck,
    X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { errorMotion, useShake } from "@/components/form/form-motion";
import {
    PARCEL_STATUS_META,
    statusDot,
    statusPill,
} from "@/components/modules/parcels/parcel-status";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useTrackParcel } from "@/hooks";
import { cn } from "@/lib/utils";
import type { ParcelStatus } from "@/types";

const RECENT_KEY = "parceltrack:recent";
const RECENT_LIMIT = 5;

function readRecents(): string[] {
    try {
        const raw = window.localStorage.getItem(RECENT_KEY);
        const parsed: unknown = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed)
            ? parsed.filter((item): item is string => typeof item === "string")
            : [];
    } catch {
        return [];
    }
}

/** 0–3 along Booked → On the way → Out for delivery → Delivered, or null
 *  for ended/unknown statuses (failed, returned, cancelled). */
function stageIndex(status: string): number | null {
    switch (status) {
        case "CREATED":
        case "PICKUP_ASSIGNED":
            return 0;
        case "PICKED_UP":
        case "AT_HUB":
        case "IN_TRANSIT":
            return 1;
        case "OUT_FOR_DELIVERY":
            return 2;
        case "DELIVERED":
            return 3;
        default:
            return null;
    }
}

const STAGES = ["Booked", "On the way", "Out for delivery", "Delivered"];

function isKnownStatus(status: string): status is ParcelStatus {
    return status in PARCEL_STATUS_META;
}

/** Tracking-ID lookup with a short status response. */
export default function Track() {
    const [scope, shake] = useShake<HTMLDivElement>();
    const [input, setInput] = useState("");
    const [inputError, setInputError] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState("");
    const [recents, setRecents] = useState<string[]>([]);

    const { data, isPending, isError, error, refetch, isFetching } =
        useTrackParcel(submitted);

    useEffect(() => {
        setRecents(readRecents());
    }, []);

    const remember = (trackingId: string) => {
        setRecents((previous) => {
            const next = [
                trackingId,
                ...previous.filter((item) => item !== trackingId),
            ].slice(0, RECENT_LIMIT);
            try {
                window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
            } catch {
                // Private mode etc. — recents are a nicety, not a need.
            }
            return next;
        });
    };

    const submit = (raw: string) => {
        const trackingId = raw.trim();
        if (!trackingId) {
            setInputError("Enter a tracking ID first.");
            shake();
            return;
        }
        setInputError(null);
        setInput(trackingId);
        setSubmitted(trackingId);
        remember(trackingId);
    };

    const state = submitted === "" ? "idle" : isPending ? "loading" : isError || !data?.data ? "error" : "result";
    const tracked = data?.data;

    return (
        <MotionConfig reducedMotion="user">
            <div
                ref={scope}
                className="mx-auto flex w-full max-w-2xl flex-col gap-5"
            >
                {/* Search card */}
                <div className="rounded-2xl bg-card p-4 ring-1 ring-secondary/10 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:fill-mode-backwards sm:p-5">
                    <form
                        noValidate
                        onSubmit={(event) => {
                            event.preventDefault();
                            submit(input);
                        }}
                        className="flex flex-col gap-2.5 sm:flex-row"
                    >
                        <div className="relative min-w-0 flex-1">
                            <Search
                                aria-hidden
                                className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-secondary/40"
                            />
                            <Input
                                value={input}
                                onChange={(event) => {
                                    setInput(event.target.value);
                                    setInputError(null);
                                }}
                                placeholder="e.g. PF-20261007-66BB7E"
                                aria-label="Tracking ID"
                                aria-invalid={inputError !== null}
                                autoComplete="off"
                                spellCheck={false}
                                className="h-11 rounded-xl border-secondary/15 bg-background pr-10 pl-10 font-mono text-sm text-secondary shadow-none placeholder:font-sans placeholder:text-secondary/40 focus-visible:border-brand-orange focus-visible:ring-3 focus-visible:ring-brand-orange/30 aria-invalid:border-destructive/60"
                            />
                            {input ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setInput("");
                                        setInputError(null);
                                    }}
                                    aria-label="Clear tracking ID"
                                    className="absolute top-1/2 right-3 grid size-7 -translate-y-1/2 place-items-center rounded-lg text-secondary/50 outline-none transition-colors hover:bg-secondary/8 hover:text-secondary focus-visible:ring-2 focus-visible:ring-brand-orange/50"
                                >
                                    <X className="size-4" />
                                </button>
                            ) : null}
                        </div>
                        <Button
                            type="submit"
                            className="h-11 shrink-0 rounded-xl bg-brand-orange px-6 font-heading text-sm font-bold text-brand-ink shadow-[0_12px_28px_-12px_var(--color-brand-orange)] transition hover:brightness-110 active:scale-[0.99]"
                        >
                            <PackageSearch className="size-4" />
                            Track
                        </Button>
                    </form>
                    <AnimatePresence initial={false}>
                        {inputError ? (
                            <motion.p
                                key="track-empty-error"
                                {...errorMotion}
                                role="alert"
                                className="overflow-hidden pt-2 text-[13px] font-medium text-destructive"
                            >
                                {inputError}
                            </motion.p>
                        ) : null}
                    </AnimatePresence>

                    {recents.length > 0 ? (
                        <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-secondary/8 pt-3">
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-secondary/55">
                                <History aria-hidden className="size-3.5" />
                                Recent
                            </span>
                            {recents.map((recent) => (
                                <button
                                    key={recent}
                                    type="button"
                                    onClick={() => submit(recent)}
                                    className="max-w-44 truncate rounded-full bg-secondary/5 px-2.5 py-1 font-mono text-xs font-semibold text-secondary/75 ring-1 ring-secondary/10 ring-inset outline-none transition-colors hover:bg-secondary/10 hover:text-secondary focus-visible:ring-2 focus-visible:ring-brand-orange/50"
                                >
                                    {recent}
                                </button>
                            ))}
                        </div>
                    ) : null}
                </div>

                {/* Result area */}
                <AnimatePresence mode="wait" initial={false}>
                    {state === "idle" ? (
                        <motion.div
                            key="idle"
                            {...fadeSwap}
                            className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-secondary/15 px-6 py-12 text-center"
                        >
                            <span className="grid size-12 place-items-center rounded-2xl bg-brand/8 text-brand ring-1 ring-brand/10 ring-inset">
                                <PackageSearch
                                    className="size-6"
                                    strokeWidth={2}
                                />
                            </span>
                            <div>
                                <h2 className="font-heading text-base font-extrabold tracking-tight text-secondary">
                                    Where&apos;s your parcel?
                                </h2>
                                <p className="mx-auto mt-1 max-w-xs text-sm text-secondary/60">
                                    Enter a tracking ID above — you&apos;ll
                                    find it on any parcel card or invoice.
                                </p>
                            </div>
                        </motion.div>
                    ) : state === "loading" ? (
                        <motion.div
                            key="loading"
                            {...fadeSwap}
                            aria-hidden
                            className="flex flex-col gap-4 rounded-2xl bg-card p-5 ring-1 ring-secondary/10 sm:p-6"
                        >
                            <div className="flex items-center gap-3">
                                <Skeleton className="size-12 rounded-2xl" />
                                <div className="flex-1">
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="mt-2 h-4 w-48" />
                                </div>
                            </div>
                            <Skeleton className="h-2 w-full rounded-full" />
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="hidden h-4 w-16 sm:block" />
                            </div>
                            <span className="sr-only">
                                Looking up parcel…
                            </span>
                        </motion.div>
                    ) : state === "error" ? (
                        <motion.div
                            key="error"
                            {...fadeSwap}
                            role="alert"
                            className="flex flex-col items-center gap-3 rounded-2xl bg-card px-6 py-10 text-center ring-1 ring-secondary/10"
                        >
                            <span className="grid size-12 place-items-center rounded-2xl bg-destructive/10 text-destructive">
                                <CircleAlert
                                    className="size-6"
                                    strokeWidth={2}
                                />
                            </span>
                            <div>
                                <h2 className="font-heading text-base font-extrabold tracking-tight text-secondary">
                                    No parcel found
                                </h2>
                                <p className="mx-auto mt-1 max-w-xs text-sm text-secondary/60">
                                    {(error as Error)?.message ||
                                        `Nothing matches “${submitted}”. Check the ID and try again.`}
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                disabled={isFetching}
                                onClick={() => refetch()}
                                className="h-10 rounded-xl border-secondary/15 font-heading text-sm font-bold text-secondary hover:bg-secondary/5 hover:text-secondary"
                            >
                                Try again
                            </Button>
                        </motion.div>
                    ) : tracked ? (
                        <TrackResult
                            key={submitted}
                            trackingId={tracked.trackingId}
                            status={tracked.status}
                        />
                    ) : null}
                </AnimatePresence>
            </div>
        </MotionConfig>
    );
}

const fadeSwap = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.22, ease: "easeOut" as const },
};

function TrackResult({
    trackingId,
    status,
}: {
    trackingId: string;
    status: string;
}) {
    const [copied, setCopied] = useState(false);
    const known = isKnownStatus(status);
    const stage = stageIndex(status);
    const ended = stage === null;

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(trackingId);
            setCopied(true);
            toast.success("Tracking ID copied", {
                description: trackingId,
            });
            window.setTimeout(() => setCopied(false), 1600);
        } catch {
            toast.error("Could not copy", {
                description: "Your browser blocked clipboard access.",
            });
        }
    };

    return (
        <motion.section
            aria-label={`Tracking result for ${trackingId}`}
            {...fadeSwap}
            className="overflow-hidden rounded-2xl bg-card ring-1 ring-secondary/10 shadow-[0_24px_48px_-32px_rgba(15,32,86,0.35)]"
        >
            <div className="flex items-center gap-3.5 border-b border-secondary/8 bg-linear-to-r from-brand-cream via-brand-cream/40 to-transparent px-5 py-5 sm:px-6">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand text-white shadow-[0_12px_24px_-12px_rgba(15,32,86,0.7)]">
                    {status === "DELIVERED" ? (
                        <PackageCheck
                            className="size-6"
                            strokeWidth={2.25}
                        />
                    ) : (
                        <Truck className="size-6" strokeWidth={2.25} />
                    )}
                </span>
                <div className="min-w-0 flex-1">
                    {known ? (
                        <span className={statusPill(status)}>
                            <span
                                aria-hidden
                                className={statusDot(status)}
                            />
                            {PARCEL_STATUS_META[status].label}
                        </span>
                    ) : (
                        <span className="inline-flex items-center rounded-full bg-secondary/8 px-2.5 py-1 font-heading text-[11px] font-bold tracking-wide text-secondary/70 uppercase ring-1 ring-secondary/15 ring-inset">
                            {status.replaceAll("_", " ")}
                        </span>
                    )}
                    <p className="mt-1.5 flex min-w-0 items-center gap-2">
                        <span className="min-w-0 flex-1 truncate font-mono text-sm font-bold tracking-tight text-secondary">
                            {trackingId}
                        </span>
                        <button
                            type="button"
                            onClick={copy}
                            aria-label={
                                copied
                                    ? "Tracking ID copied"
                                    : `Copy tracking ID ${trackingId}`
                            }
                            className="grid size-7 shrink-0 place-items-center rounded-lg text-secondary/45 outline-none transition-colors hover:bg-secondary/8 hover:text-secondary focus-visible:ring-2 focus-visible:ring-brand-orange/50"
                        >
                            {copied ? (
                                <Check
                                    className="size-3.5 text-emerald-600"
                                    strokeWidth={2.75}
                                />
                            ) : (
                                <Copy className="size-3.5" />
                            )}
                        </button>
                    </p>
                </div>
            </div>

            <div className="px-5 py-5 sm:px-6">
                {stage !== null ? (
                    <ol
                        aria-label="Delivery progress"
                        className="flex items-start"
                    >
                        {STAGES.map((label, index) => {
                            const done = index <= stage;
                            const current = index === stage;
                            const first = index === 0;
                            const last = index === STAGES.length - 1;
                            return (
                                <li
                                    key={label}
                                    className="flex min-w-0 flex-1 flex-col items-center gap-1.5 text-center"
                                >
                                    <span className="flex w-full items-center">
                                        {!first ? (
                                            <span
                                                aria-hidden
                                                className={cn(
                                                    "h-1.5 flex-1 rounded-full transition-colors duration-500",
                                                    index <= stage
                                                        ? "bg-emerald-500"
                                                        : "bg-secondary/12",
                                                )}
                                            />
                                        ) : (
                                            <span
                                                aria-hidden
                                                className="flex-1"
                                            />
                                        )}
                                        <motion.span
                                            aria-hidden
                                            initial={false}
                                            animate={{
                                                scale: current
                                                    ? [1, 1.25, 1]
                                                    : 1,
                                            }}
                                            transition={{ duration: 0.4 }}
                                            className={cn(
                                                "mx-1 grid size-6 shrink-0 place-items-center rounded-full ring-4 transition-colors duration-300",
                                                done
                                                    ? "bg-brand text-white ring-brand/15"
                                                    : "bg-secondary/10 text-secondary/40 ring-transparent",
                                            )}
                                        >
                                            {done ? (
                                                <Check
                                                    className="size-3.5"
                                                    strokeWidth={3}
                                                />
                                            ) : (
                                                <span className="size-1.5 rounded-full bg-current" />
                                            )}
                                        </motion.span>
                                        {!last ? (
                                            <span
                                                aria-hidden
                                                className={cn(
                                                    "h-1.5 flex-1 rounded-full transition-colors duration-500",
                                                    index < stage
                                                        ? "bg-emerald-500"
                                                        : index === stage
                                                          ? "bg-brand-orange"
                                                          : "bg-secondary/12",
                                                )}
                                            />
                                        ) : (
                                            <span
                                                aria-hidden
                                                className="flex-1"
                                            />
                                        )}
                                    </span>
                                    <span
                                        className={cn(
                                            "font-heading text-[11px] font-bold sm:text-xs",
                                            current
                                                ? "text-brand-orange-ink"
                                                : done
                                                  ? "text-secondary"
                                                  : "text-secondary/45",
                                        )}
                                    >
                                        {label}
                                        <span className="sr-only">
                                            {done
                                                ? index === stage
                                                    ? " (current stage)"
                                                    : " (completed)"
                                                : " (upcoming)"}
                                        </span>
                                    </span>
                                </li>
                            );
                        })}
                    </ol>
                ) : (
                    <p className="rounded-xl bg-secondary/5 px-4 py-3.5 text-center text-[13px] leading-relaxed text-secondary/70 ring-1 ring-secondary/10 ring-inset">
                        {ended && status === "DELIVERY_FAILED"
                            ? "Delivery couldn't be completed — the parcel will be re-attempted or returned."
                            : ended
                              ? "This parcel's journey has ended — contact support if you expected more."
                              : "Live updates appear here as your parcel moves."}
                    </p>
                )}
            </div>
        </motion.section>
    );
}
