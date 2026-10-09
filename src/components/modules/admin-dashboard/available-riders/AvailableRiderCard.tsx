"use client";

import { Check, ClipboardList, Copy, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { initials } from "@/components/dashboard/nav";
import { Button } from "@/components/ui/button";
import type { Rider } from "@/types";
import { VEHICLE_LABELS } from "@/components/modules/admin-dashboard/riders/rider-status";

/** One available rider with an assign action. */
export default function AvailableRiderCard({
    rider,
    index,
    onAssign,
}: {
    rider: Rider;
    index: number;
    onAssign: (rider: Rider) => void;
}) {
    const [copied, setCopied] = useState(false);

    const copyPhone = async () => {
        try {
            await navigator.clipboard.writeText(rider.phone);
            setCopied(true);
            toast.success("Phone copied", { description: rider.phone });
            window.setTimeout(() => setCopied(false), 1600);
        } catch {
            toast.error("Could not copy", {
                description: "Your browser blocked clipboard access.",
            });
        }
    };

    return (
        <article
            aria-label={`Available rider ${rider.name}`}
            className="flex min-w-0 flex-col rounded-2xl bg-card p-4 ring-1 ring-secondary/10 transition-[box-shadow,transform] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:fill-mode-backwards hover:shadow-[0_20px_40px_-28px_rgba(15,32,86,0.5)] sm:p-5"
            style={{ animationDelay: `${Math.min(index, 7) * 50}ms` }}
        >
            <div className="flex min-w-0 items-center gap-3">
                <span className="relative grid size-11 shrink-0 place-items-center rounded-2xl bg-brand font-heading text-sm font-extrabold text-white">
                    <span aria-hidden>{initials(rider.name)}</span>
                    <span
                        aria-label="Available now"
                        title="Available now"
                        className="absolute -top-1 -right-1 size-3.5 rounded-full border-2 border-card bg-emerald-500"
                    />
                </span>
                <span className="min-w-0 flex-1">
                    <span className="block truncate font-heading text-[15px] font-extrabold tracking-tight text-secondary">
                        {rider.name}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-secondary/55">
                        {rider.email}
                    </span>
                </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center rounded-full bg-emerald-600/10 px-2.5 py-1 font-heading text-[11px] font-bold tracking-wide text-emerald-700 uppercase ring-1 ring-emerald-600/20 ring-inset">
                    <span
                        aria-hidden
                        className="mr-1.5 size-1.5 rounded-full bg-emerald-600"
                    />
                    Available
                </span>
                <span className="inline-flex items-center rounded-full bg-secondary/5 px-2.5 py-1 font-heading text-[11px] font-bold text-secondary/60 ring-1 ring-secondary/10 ring-inset">
                    {VEHICLE_LABELS[rider.vehicleType] ?? rider.vehicleType}
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
                    className="min-w-0 flex-1 truncate underline-offset-4 outline-none transition-colors hover:text-brand hover:underline focus-visible:text-brand focus-visible:underline"
                >
                    {rider.phone}
                </a>
                <button
                    type="button"
                    onClick={copyPhone}
                    aria-label={
                        copied ? "Phone copied" : `Copy phone ${rider.phone}`
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
            </p>

            <Button
                type="button"
                onClick={() => onAssign(rider)}
                className="mt-3 h-10 w-full rounded-xl bg-brand font-heading text-[13px] font-bold text-white transition hover:brightness-125 active:scale-[0.99]"
            >
                <ClipboardList className="size-4" />
                Assign parcel
            </Button>
        </article>
    );
}
