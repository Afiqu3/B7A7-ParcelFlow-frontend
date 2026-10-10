import Parcels from "@/components/modules/parcels/Parcels";
import PaymentReturnHandler from "@/components/modules/parcels/PaymentReturnHandler";
import { ROUTES } from "@/constants";
import { PackagePlus, PackageSearch } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Parcels · ParcelFlow",
    description:
        "Track every booking — search by tracking ID or filter by delivery status.",
};

export default function ParcelsPage() {
    return (
        <div className="flex flex-col gap-5 sm:gap-6">
            {/* Page header */}
            <div className="flex flex-col gap-3 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                    <p className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1 font-heading text-[11px] font-bold tracking-[0.14em] text-white uppercase">
                        <PackageSearch
                            className="size-3.5 text-brand-orange"
                            strokeWidth={2.5}
                        />
                        Shipping · Parcels
                    </p>
                    <h1 className="mt-2.5 font-heading text-2xl font-extrabold tracking-tight text-balance text-secondary sm:text-[28px] sm:leading-[1.15]">
                        Parcels
                    </h1>
                    <p className="mt-1.5 max-w-xl text-sm text-pretty text-secondary/70">
                        Track every booking — search by tracking ID or filter
                        by delivery status.
                    </p>
                </div>
                <Link
                    href={ROUTES.newParcel}
                    className="inline-flex h-10 w-fit shrink-0 items-center gap-2 rounded-xl bg-brand-orange px-4 font-heading text-sm font-bold text-brand-ink shadow-[0_12px_28px_-12px_var(--color-brand-orange)] transition outline-none hover:brightness-110 focus-visible:ring-3 focus-visible:ring-brand-orange/40 active:scale-[0.99]"
                >
                    <PackagePlus className="size-4" />
                    New parcel
                </Link>
            </div>

            {/* Gateway return (?status=success|failure) toasts. Suspended:
                useSearchParams needs a boundary for static prerendering. */}
            <Suspense fallback={null}>
                <PaymentReturnHandler />
            </Suspense>

            <Parcels />
        </div>
    );
}
