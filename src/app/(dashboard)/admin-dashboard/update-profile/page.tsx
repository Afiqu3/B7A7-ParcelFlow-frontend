import type { Metadata } from "next";
import UpdateAdminProfileFrom from "@/components/form/update-admin-profile-from";
import { ROUTES } from "@/constants";
import { UserRound, UserRoundPen } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Update profile · ParcelFlow",
    description: "Keep your display name current.",
};

export default function UpdateAdminProfilePage() {
    return (
        <div className="flex flex-col gap-5 sm:gap-6">
            {/* Page header */}
            <div className="flex flex-col gap-3 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                    <p className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1 font-heading text-[11px] font-bold tracking-[0.14em] text-white uppercase">
                        <UserRoundPen
                            className="size-3.5 text-brand-orange"
                            strokeWidth={2.5}
                        />
                        Account · Update profile
                    </p>
                    <h1 className="mt-2.5 font-heading text-2xl font-extrabold tracking-tight text-balance text-secondary sm:text-[28px] sm:leading-[1.15]">
                        Update profile
                    </h1>
                    <p className="mt-1.5 max-w-xl text-sm text-pretty text-secondary/70">
                        Keep your display name current across the admin
                        dashboard.
                    </p>
                </div>
                <Link
                    href={`${ROUTES.adminDashboard}/profile`}
                    className="flex w-fit shrink-0 items-center gap-2 rounded-xl bg-card px-3.5 py-2.5 text-xs font-bold text-secondary ring-1 ring-secondary/10 transition-colors outline-none hover:bg-secondary/5 focus-visible:ring-2 focus-visible:ring-brand-orange/50"
                >
                    <UserRound className="size-4 text-brand" strokeWidth={2.25} />
                    View profile
                </Link>
            </div>

            {/* Content grid: form + side tips */}
            <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
                <div
                    className="min-w-0 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:fill-mode-backwards"
                    style={{ animationDelay: "80ms" }}
                >
                    <UpdateAdminProfileFrom />
                </div>

                <aside className="flex min-w-0 flex-col gap-5">
                    {/* Navy tips card */}
                    <div
                        className="relative overflow-hidden rounded-2xl bg-brand p-5 text-white ring-1 ring-white/10 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:fill-mode-backwards sm:p-6"
                        style={{ animationDelay: "140ms" }}
                    >
                        <div
                            aria-hidden
                            className="pointer-events-none absolute -top-16 -right-16 size-44 rounded-full bg-brand-orange/30 blur-3xl"
                        />
                        <div
                            aria-hidden
                            className="pointer-events-none absolute -bottom-20 -left-10 size-44 rounded-full bg-white/10 blur-3xl"
                        />
                        <div className="relative">
                            <h2 className="font-heading text-base font-extrabold tracking-tight">
                                Good names travel well
                            </h2>
                            <p className="mt-1 text-[13px] leading-relaxed text-white/70">
                                Your name appears across the admin workspace.
                            </p>
                            <ul className="mt-4 flex flex-col gap-3">
                                {[
                                    {
                                        title: "Use your real name",
                                        body: "Teammates and audit logs reference it.",
                                    },
                                    {
                                        title: "Keep it short",
                                        body: "Between 3 and 50 characters.",
                                    },
                                ].map((tip, index) => (
                                    <li
                                        key={tip.title}
                                        className="flex items-start gap-3 rounded-xl bg-white/6 px-3 py-2.5 ring-1 ring-white/10 ring-inset transition-colors hover:bg-white/10"
                                    >
                                        <span
                                            aria-hidden
                                            className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-orange/15 font-heading text-[13px] font-extrabold text-brand-orange ring-1 ring-brand-orange/25 ring-inset"
                                        >
                                            {index + 1}
                                        </span>
                                        <span className="min-w-0">
                                            <span className="block font-heading text-[13px] font-bold">
                                                {tip.title}
                                            </span>
                                            <span className="block text-xs leading-relaxed text-white/65">
                                                {tip.body}
                                            </span>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
