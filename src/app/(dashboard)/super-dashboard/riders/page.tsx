import Riders from "@/components/modules/admin-dashboard/riders/Riders";
import { Bike } from "lucide-react";

export default function RidersPage() {
    return (
        <div className="flex flex-col gap-5 sm:gap-6">
            {/* Page header */}
            <div className="flex flex-col gap-3 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                    <p className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1 font-heading text-[11px] font-bold tracking-[0.14em] text-white uppercase">
                        <Bike
                            className="size-3.5 text-brand-orange"
                            strokeWidth={2.5}
                        />
                        Configuration · Riders
                    </p>
                    <h1 className="mt-2.5 font-heading text-2xl font-extrabold tracking-tight text-balance text-secondary sm:text-[28px] sm:leading-[1.15]">
                        Riders
                    </h1>
                    <p className="mt-1.5 max-w-xl text-sm text-pretty text-secondary/70">
                        Review applications, manage access, and keep deliveries
                        moving.
                    </p>
                </div>
            </div>

            <Riders />
        </div>
    );
}
