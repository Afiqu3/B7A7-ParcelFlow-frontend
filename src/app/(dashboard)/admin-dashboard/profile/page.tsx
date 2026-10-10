import type { Metadata } from "next";
import AdminProfile from "@/components/modules/admin-profile/admin-profile";
import { UserRound } from "lucide-react";

export const metadata: Metadata = {
    title: "Profile · ParcelFlow",
    description: "Your admin identity — photo and contact details.",
};

export default function page() {
    return (
        <div className="flex flex-col gap-5 sm:gap-6">
            {/* Page header */}
            <div className="flex flex-col gap-3 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                    <p className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1 font-heading text-[11px] font-bold tracking-[0.14em] text-white uppercase">
                        <UserRound
                            className="size-3.5 text-brand-orange"
                            strokeWidth={2.5}
                        />
                        Account · Profile
                    </p>
                    <h1 className="mt-2.5 font-heading text-2xl font-extrabold tracking-tight text-balance text-secondary sm:text-[28px] sm:leading-[1.15]">
                        Profile
                    </h1>
                </div>
            </div>

            <AdminProfile />
        </div>
    );
}
