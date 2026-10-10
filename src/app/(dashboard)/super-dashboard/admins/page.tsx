import type { Metadata } from "next";
import Admins from "@/components/modules/super-admin/Admins/Admins";
import { ROUTES } from "@/constants";
import { UserRoundPlus, Users } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Admins · ParcelFlow",
    description: "Everyone with dashboard access — search by name or email.",
};

export default function AdminsPage() {
    return (
        <div className="flex flex-col gap-5 sm:gap-6">
            {/* Page header */}
            <div className="flex flex-col gap-3 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                    <p className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1 font-heading text-[11px] font-bold tracking-[0.14em] text-white uppercase">
                        <Users
                            className="size-3.5 text-brand-orange"
                            strokeWidth={2.5}
                        />
                        Team · Admins
                    </p>
                    <h1 className="mt-2.5 font-heading text-2xl font-extrabold tracking-tight text-balance text-secondary sm:text-[28px] sm:leading-[1.15]">
                        Admins
                    </h1>
                    <p className="mt-1.5 max-w-xl text-sm text-pretty text-secondary/70">
                        Everyone with dashboard access — search, review status,
                        or toggle access.
                    </p>
                </div>
                <Link
                    href={`${ROUTES.superAdminDashboard}/create-admin`}
                    className="inline-flex h-10 w-fit shrink-0 items-center gap-2 rounded-xl bg-brand-orange px-4 font-heading text-sm font-bold text-brand-ink shadow-[0_12px_28px_-12px_var(--color-brand-orange)] transition outline-none hover:brightness-110 focus-visible:ring-3 focus-visible:ring-brand-orange/40 active:scale-[0.99]"
                >
                    <UserRoundPlus className="size-4" />
                    Create admin
                </Link>
            </div>

            <Admins />
        </div>
    );
}
