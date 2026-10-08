"use client";

import { useGetMe } from "@/hooks";
import ProfileSkeleton from "../profile/ProfileSkeleton";
import { BadgeCheck, CalendarDays, CircleAlert, Fingerprint, LayoutDashboard, Mail, RefreshCw, ShieldCheck, TriangleAlert, UserKey, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { User } from "@/types";
import { ROLE_LABEL } from "@/routes";
import { formatJoinedOn, formatMemberSince } from "@/utils";
import ProfilePhotoCard from "@/components/shared/ProfilePhotoCard";
import Link from "next/link";

export default function AdminProfile() {
    const {
        data: user,
        isPending,
        isError,
        error,
        refetch,
        isFetching,
    } = useGetMe();

    if (isPending) return <ProfileSkeleton />;
    if (isError || !user) {
        return (
            <div className="flex flex-col items-center gap-3 rounded-2xl bg-card px-6 py-12 text-center ring-1 ring-secondary/10 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300">
                <span className="grid size-12 place-items-center rounded-2xl bg-destructive/10 text-destructive">
                    <CircleAlert className="size-6" strokeWidth={2} />
                </span>
                <div>
                    <h2 className="font-heading text-lg font-extrabold tracking-tight text-secondary">
                        Couldn&apos;t load your profile
                    </h2>
                    <p className="mx-auto mt-1 max-w-sm text-sm text-secondary/65">
                        {(error as Error)?.message ||
                            "Something went wrong while fetching your merchant information. Please try again."}
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
        );
    }
    return <ProfileContent user={user} />;
}

function ProfileContent({ user }: { user: User }) {
    const verified = user.emailVerified;
    const active = user.status === "ACTIVE";

    const stats = [
        {
            icon: CalendarDays,
            label: "Member since",
            value: formatMemberSince(user.createdAt),
        },
        {
            icon: Fingerprint,
            label: "Auth provider",
            value:
                user.authProvider.charAt(0).toUpperCase() +
                user.authProvider.slice(1).toLowerCase(),
        },
        {
            icon: ShieldCheck,
            label: "Account status",
            value: active ? "Active" : "Blocked",
        },
    ];

    const details = [
        {
            icon: UserRound,
            label: "Full name",
            value: user.name,
        },
        {
            icon: Mail,
            label: "Email",
            value: user.email,
            href: `mailto:${user.email}`,
        },
    ];

    return (
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
            {/* Main column */}
            <div className="flex min-w-0 flex-col gap-5">
                {/* Identity card */}
                <section
                    aria-labelledby="profile-identity-title"
                    className="overflow-hidden rounded-2xl bg-card ring-1 ring-secondary/10 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:fill-mode-backwards"
                    style={{ animationDelay: "80ms" }}
                >
                    <div className="border-b border-secondary/8 bg-linear-to-r from-brand-cream via-brand-cream/40 to-transparent px-5 py-5 sm:px-6">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1 font-heading text-[11px] font-bold tracking-wide text-white uppercase">
                                {ROLE_LABEL[user.role]}
                            </span>
                            <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-heading text-[11px] font-bold tracking-wide uppercase ${
                                    active
                                        ? "bg-emerald-600/10 text-emerald-700 ring-1 ring-emerald-600/20 ring-inset"
                                        : "bg-destructive/10 text-destructive ring-1 ring-destructive/20 ring-inset"
                                }`}
                            >
                                <span
                                    aria-hidden
                                    className={`size-1.5 rounded-full ${active ? "bg-emerald-600" : "bg-destructive"}`}
                                />
                                {active ? "Active" : "Blocked"}
                            </span>
                            <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-heading text-[11px] font-bold tracking-wide uppercase ${
                                    verified
                                        ? "bg-brand/8 text-brand ring-1 ring-brand/15 ring-inset"
                                        : "bg-amber-500/10 text-amber-800 ring-1 ring-amber-600/25 ring-inset"
                                }`}
                            >
                                {verified ? (
                                    <BadgeCheck
                                        className="size-3.5"
                                        strokeWidth={2.5}
                                    />
                                ) : (
                                    <TriangleAlert
                                        className="size-3.5"
                                        strokeWidth={2.5}
                                    />
                                )}
                                {verified ? "Verified" : "Unverified"}
                            </span>
                        </div>
                        <h2
                            id="profile-identity-title"
                            className="mt-3 font-heading text-xl font-extrabold tracking-tight text-balance text-secondary sm:text-2xl"
                        >
                            {user.name}
                        </h2>
                        <p className="mt-1 truncate text-sm text-secondary/65">
                            {user.email}
                        </p>
                    </div>
                    <dl className="grid grid-cols-1 gap-3 px-5 py-5 sm:grid-cols-3 sm:px-6">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="rounded-xl bg-secondary/4 px-4 py-3 ring-1 ring-secondary/8 ring-inset"
                            >
                                <dt className="flex items-center gap-1.5 text-xs font-medium text-secondary/60">
                                    <stat.icon
                                        className="size-3.5 text-brand"
                                        strokeWidth={2.25}
                                    />
                                    {stat.label}
                                </dt>
                                <dd className="mt-1 truncate font-heading text-[15px] font-extrabold text-secondary">
                                    {stat.value}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </section>

                {/* Contact & business card */}
                <section
                    aria-labelledby="profile-details-title"
                    className="rounded-2xl bg-card p-5 ring-1 ring-secondary/10 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:fill-mode-backwards sm:p-6"
                    style={{ animationDelay: "140ms" }}
                >
                    <h2
                        id="profile-details-title"
                        className="font-heading text-base font-extrabold tracking-tight text-secondary"
                    >
                        Contact &amp; business
                    </h2>
                    <p className="mt-1 text-[13px] text-secondary/60">
                        How ParcelFlow reaches you and what your customers see.
                    </p>
                    <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {details.map((item) => (
                            <div
                                key={item.label}
                                className="flex items-start gap-3 rounded-xl border border-secondary/8 px-3.5 py-3 transition-colors hover:bg-secondary/3"
                            >
                                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand/8 text-brand ring-1 ring-brand/10 ring-inset">
                                    <item.icon
                                        className="size-4"
                                        strokeWidth={2.25}
                                    />
                                </span>
                                <span className="min-w-0">
                                    <dt className="text-xs font-medium text-secondary/60">
                                        {item.label}
                                    </dt>
                                    <dd className="truncate font-heading text-sm font-bold text-secondary">
                                        {item.href ? (
                                            <a
                                                href={item.href}
                                                className="underline-offset-4 transition-colors outline-none hover:text-brand hover:underline focus-visible:text-brand focus-visible:underline"
                                            >
                                                {item.value}
                                            </a>
                                        ) : (
                                            item.value
                                        )}
                                    </dd>
                                </span>
                            </div>
                        ))}
                    </dl>
                    <p className="mt-4 border-t border-secondary/8 pt-3.5 text-xs text-secondary/55">
                        Joined on {formatJoinedOn(user.createdAt)} · To
                        update these details, please contact ParcelFlow support.
                    </p>
                </section>
            </div>

            {/* Side column */}
            <aside className="flex min-w-0 flex-col gap-5">
                <ProfilePhotoCard subject={user} />

                {/* Navy quick links */}
                <nav
                    aria-label="Account shortcuts"
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
                            Account shortcuts
                        </h2>
                        <p className="mt-1 text-[13px] leading-relaxed text-white/70">
                            Manage security and get back to work.
                        </p>
                        <ul className="mt-4 flex flex-col gap-2.5">
                            <li>
                                <Link
                                    href={"/admin-dashboard/change-password"}
                                    className="flex items-center gap-3 rounded-xl bg-white/6 px-3.5 py-3 ring-1 ring-white/10 ring-inset transition-all outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-brand-orange/60 active:scale-[0.99]"
                                >
                                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-orange/15 text-brand-orange ring-1 ring-brand-orange/25 ring-inset">
                                        <UserKey
                                            className="size-4"
                                            strokeWidth={2.25}
                                        />
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block font-heading text-[13px] font-bold">
                                            Change password
                                        </span>
                                        <span className="block text-xs text-white/65">
                                            Update your sign-in password
                                        </span>
                                    </span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={"/admin-dashboard"}
                                    className="flex items-center gap-3 rounded-xl bg-white/6 px-3.5 py-3 ring-1 ring-white/10 ring-inset transition-all outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-brand-orange/60 active:scale-[0.99]"
                                >
                                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/10 text-white ring-1 ring-white/15 ring-inset">
                                        <LayoutDashboard
                                            className="size-4"
                                            strokeWidth={2.25}
                                        />
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block font-heading text-[13px] font-bold">
                                            Back to dashboard
                                        </span>
                                        <span className="block text-xs text-white/65">
                                            Parcels, payments &amp; more
                                        </span>
                                    </span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </aside>
        </div>
    );
}
