import AvailableRiders from "@/components/modules/admin-dashboard/available-riders/AvailableRiders";
import { UserCheck } from "lucide-react";

export default function AvailableRidersPage() {
    return (
        <div className="flex flex-col gap-5 sm:gap-6">
            {/* Page header */}
            <div className="min-w-0 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300">
                <p className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1 font-heading text-[11px] font-bold tracking-[0.14em] text-white uppercase">
                    <UserCheck
                        className="size-3.5 text-brand-orange"
                        strokeWidth={2.5}
                    />
                    Operations · Available riders
                </p>
                <h1 className="mt-2.5 font-heading text-2xl font-extrabold tracking-tight text-balance text-secondary sm:text-[28px] sm:leading-[1.15]">
                    Available riders
                </h1>
                <p className="mt-1.5 max-w-xl text-sm text-pretty text-secondary/70">
                    Riders free right now — search and assign parcels in one
                    go.
                </p>
            </div>

            <AvailableRiders />
        </div>
    );
}
