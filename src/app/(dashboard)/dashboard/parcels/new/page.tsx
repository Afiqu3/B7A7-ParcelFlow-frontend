import CreateParcelForm from "@/components/form/create-parcel-from";
import { ROUTES } from "@/constants";
import { PackagePlus } from "lucide-react";
import Link from "next/link";

export default function ParcelCreatePage() {
    return (
        <div className="flex flex-col gap-5 sm:gap-6">
            {/* Page header */}
            <div className="flex flex-col gap-3 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                    <p className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1 font-heading text-[11px] font-bold tracking-[0.14em] text-white uppercase">
                        <PackagePlus
                            className="size-3.5 text-brand-orange"
                            strokeWidth={2.5}
                        />
                        Shipping · New parcel
                    </p>
                    <h1 className="mt-2.5 font-heading text-2xl font-extrabold tracking-tight text-balance text-secondary sm:text-[28px] sm:leading-[1.15]">
                        Create parcel
                    </h1>
                    <p className="mt-1.5 max-w-xl text-sm text-pretty text-secondary/70">
                        Book a pickup in under a minute — the price updates
                        live as you fill in the details.
                    </p>
                </div>
                <Link
                    href={ROUTES.pricing}
                    className="flex w-fit shrink-0 items-center gap-2 rounded-xl bg-card px-3.5 py-2.5 text-xs font-bold text-secondary ring-1 ring-secondary/10 transition-colors outline-none hover:bg-secondary/5 focus-visible:ring-2 focus-visible:ring-brand-orange/50"
                >
                    View pricing
                </Link>
            </div>

            <CreateParcelForm />
        </div>
    );
}
