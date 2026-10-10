"use client";

import { ArrowLeft, House, ShieldX } from "lucide-react";
import Link from "next/link";
import { ROLE_LABEL } from "@/routes";
import type { UserRole } from "@/types";

/**
 * 403 shown inside the dashboard shell when a signed-in user opens a
 * dashboard outside their role. Tells them which area they hit, what
 * they are, and where to go instead.
 */
export default function AccessDenied({
    requiredRoles,
    actualRole,
    homeHref,
}: {
    requiredRoles: UserRole[];
    actualRole: UserRole;
    homeHref: string;
}) {
    return (
        <div
            aria-labelledby="access-denied-heading"
            className="mx-auto flex w-full max-w-xl flex-col items-center px-4 py-14 text-center sm:py-20 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300"
        >
            <p className="inline-flex items-center gap-2 rounded-full bg-brand px-3.5 py-1.5 font-heading text-[13px] font-semibold text-brand-cream ring-1 ring-white/5">
                <span
                    aria-hidden
                    className="size-2 animate-pulse rounded-full bg-brand-orange"
                />
                403 · This route went off-limits
            </p>

            <span
                aria-hidden
                className="mt-8 grid size-20 place-items-center rounded-[1.75rem] bg-brand text-white shadow-[0_30px_60px_-20px_rgba(15,32,86,0.55)]"
            >
                <ShieldX className="size-10" strokeWidth={2} />
            </span>

            <h1
                id="access-denied-heading"
                className="mt-6 font-heading text-5xl leading-[0.95] font-bold tracking-tighter text-secondary sm:text-6xl"
            >
                Access
                <span className="block text-brand-orange">denied.</span>
            </h1>

            <p className="mt-5 max-w-md text-[17px] leading-relaxed text-secondary/70">
                This area belongs to{" "}
                <strong className="font-semibold text-secondary">
                    {requiredRoles.map((role) => ROLE_LABEL[role]).join(", ")}
                </strong>
                , and you&apos;re signed in as{" "}
                <strong className="font-semibold text-secondary">
                    {ROLE_LABEL[actualRole]}
                </strong>
                . Nothing is broken — you&apos;re just in the wrong
                dashboard.
            </p>

            <p className="mt-6 inline-flex max-w-full items-center gap-3 rounded-2xl border-[1.5px] border-dashed border-secondary/20 bg-card px-4 py-3 font-mono text-sm">
                <ShieldX
                    aria-hidden
                    className="size-4 shrink-0 text-brand-orange-ink"
                    strokeWidth={2.5}
                />
                <span className="truncate text-secondary">
                    PF-403-ROLE-MISMATCH
                </span>
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Link
                    href={homeHref}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-orange px-6 font-heading text-sm font-bold text-brand-ink shadow-[0_12px_28px_-12px_var(--color-brand-orange)] outline-none transition hover:brightness-110 focus-visible:ring-3 focus-visible:ring-brand-orange/40 active:scale-[0.99]"
                >
                    <House className="size-4" strokeWidth={2.5} />
                    Back to my dashboard
                </Link>
                <Link
                    href="/"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-secondary/15 px-6 font-heading text-sm font-bold text-secondary outline-none transition-colors hover:bg-secondary/5 focus-visible:ring-3 focus-visible:ring-brand-orange/40"
                >
                    <ArrowLeft className="size-4" strokeWidth={2.5} />
                    Back to website
                </Link>
            </div>
        </div>
    );
}
