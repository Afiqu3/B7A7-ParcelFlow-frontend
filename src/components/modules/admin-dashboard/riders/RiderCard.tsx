"use client";

import { Check, Copy, Eye, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { initials } from "@/components/dashboard/nav";
import { Button } from "@/components/ui/button";
import type { Rider } from "@/types";
import {
    applicationPill,
    RIDER_APPLICATION_META,
    VEHICLE_LABELS,
} from "./rider-status";
import RiderStatusToggle from "./RiderStatusToggle";

/** One rider in the admin rider grid. */
export default function RiderCard({
    rider,
    index,
    onView,
}: {
    rider: Rider;
    index: number;
    onView: (riderId: string) => void;
}) {
    const [copied, setCopied] = useState(false);
    const blocked = rider.user.status === "BLOCKED";

    const copyEmail = async () => {
        try {
            await navigator.clipboard.writeText(rider.email);
            setCopied(true);
            toast.success("Email copied", { description: rider.email });
            window.setTimeout(() => setCopied(false), 1600);
        } catch {
            toast.error("Could not copy", {
                description: "Your browser blocked clipboard access.",
            });
        }
    };

    return (
        <article
            aria-label={`Rider ${rider.name}`}
            className="flex min-w-0 flex-col rounded-2xl bg-card p-4 ring-1 ring-secondary/10 transition-[box-shadow,transform] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:fill-mode-backwards hover:shadow-[0_20px_40px_-28px_rgba(15,32,86,0.5)] sm:p-5"
            style={{ animationDelay: `${Math.min(index, 7) * 50}ms` }}
        >
            <div className="flex min-w-0 items-center gap-3">
                <span
                    aria-hidden
                    className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand font-heading text-sm font-extrabold text-white"
                >
                    {initials(rider.name)}
                </span>
                <span className="min-w-0 flex-1">
                    <span className="block truncate font-heading text-[15px] font-extrabold tracking-tight text-secondary">
                        {rider.name}
                    </span>
                    <span className="mt-0.5 flex min-w-0 items-center gap-1.5 text-xs text-secondary/55">
                        <span className="min-w-0 flex-1 truncate">
                            {rider.email}
                        </span>
                        <button
                            type="button"
                            onClick={copyEmail}
                            aria-label={
                                copied
                                    ? "Email copied"
                                    : `Copy email ${rider.email}`
                            }
                            className="grid size-6 shrink-0 place-items-center rounded-md text-secondary/40 outline-none transition-colors hover:bg-secondary/8 hover:text-secondary focus-visible:ring-2 focus-visible:ring-brand-orange/50"
                        >
                            {copied ? (
                                <Check
                                    className="size-3 text-emerald-600"
                                    strokeWidth={2.75}
                                />
                            ) : (
                                <Copy className="size-3" />
                            )}
                        </button>
                    </span>
                </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className={applicationPill(rider.applicationStatus)}>
                    {RIDER_APPLICATION_META[rider.applicationStatus].label}
                </span>
                <span className="inline-flex items-center rounded-full bg-secondary/5 px-2.5 py-1 font-heading text-[11px] font-bold text-secondary/60 ring-1 ring-secondary/10 ring-inset">
                    {VEHICLE_LABELS[rider.vehicleType] ?? rider.vehicleType}
                </span>
                <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-heading text-[11px] font-bold tracking-wide uppercase ring-1 ring-inset ${
                        blocked
                            ? "bg-destructive/10 text-destructive ring-destructive/20"
                            : "bg-emerald-600/10 text-emerald-700 ring-emerald-600/20"
                    }`}
                >
                    <span
                        aria-hidden
                        className={`size-1.5 rounded-full ${blocked ? "bg-destructive" : "bg-emerald-600"}`}
                    />
                    {blocked ? "Blocked" : "Active"}
                </span>
            </div>

            <p className="mt-3 flex min-w-0 items-center gap-1.5 border-t border-secondary/8 pt-3 text-[13px] text-secondary/70">
                <Phone
                    aria-hidden
                    className="size-3.5 shrink-0 text-brand"
                    strokeWidth={2.25}
                />
                <a
                    href={`tel:${rider.phone.replace(/\s/g, "")}`}
                    className="truncate underline-offset-4 outline-none transition-colors hover:text-brand hover:underline focus-visible:text-brand focus-visible:underline"
                >
                    {rider.phone}
                </a>
            </p>

            <div className="mt-3 flex items-center justify-end gap-1.5">
                <RiderStatusToggle rider={rider} />
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => onView(rider.id)}
                    className="h-9 shrink-0 rounded-xl border-secondary/15 px-3 font-heading text-xs font-bold text-secondary hover:bg-brand hover:text-white hover:ring-brand"
                >
                    <Eye className="size-4" />
                    <span className="hidden min-[380px]:inline">
                        View details
                    </span>
                    <span className="sr-only min-[380px]:hidden">
                        View details
                    </span>
                </Button>
            </div>
        </article>
    );
}
