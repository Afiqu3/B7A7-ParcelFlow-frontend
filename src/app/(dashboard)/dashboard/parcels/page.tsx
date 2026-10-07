import { ROUTES } from "@/constants";
import { ArrowRight, PackagePlus, PackageSearch } from "lucide-react";
import Link from "next/link";

/** Parcels list placeholder until the list view is built. */
export default function ParcelsPage() {
    return (
        <div className="flex flex-col gap-5 sm:gap-6">
            <div className="min-w-0 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300">
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
                    Every parcel you book will appear here with live tracking.
                </p>
            </div>

            <div
                className="flex flex-col items-center gap-4 rounded-2xl bg-card px-6 py-12 text-center ring-1 ring-secondary/10 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:fill-mode-backwards sm:py-16"
                style={{ animationDelay: "80ms" }}
            >
                <span className="grid size-14 place-items-center rounded-2xl bg-brand/8 text-brand ring-1 ring-brand/10 ring-inset">
                    <PackagePlus className="size-7" strokeWidth={2} />
                </span>
                <div>
                    <h2 className="font-heading text-lg font-extrabold tracking-tight text-secondary">
                        No parcels yet
                    </h2>
                    <p className="mx-auto mt-1 max-w-sm text-sm text-secondary/65">
                        Book your first parcel and it will show up here with
                        pickup, tracking and payment status.
                    </p>
                </div>
                <div className="flex flex-col gap-2.5 sm:flex-row">
                    <Link
                        href={ROUTES.newParcel}
                        className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand-orange px-6 font-heading text-sm font-bold text-brand-ink shadow-[0_12px_28px_-12px_var(--color-brand-orange)] transition outline-none hover:brightness-110 focus-visible:ring-3 focus-visible:ring-brand-orange/40 active:scale-[0.99]"
                    >
                        Create your first parcel
                        <ArrowRight className="size-4" />
                    </Link>
                    <Link
                        href={ROUTES.pricing}
                        className="inline-flex h-11 items-center justify-center rounded-xl border border-secondary/15 px-6 font-heading text-sm font-bold text-secondary transition-colors outline-none hover:bg-secondary/5 focus-visible:ring-3 focus-visible:ring-brand-orange/40"
                    >
                        View pricing
                    </Link>
                </div>
            </div>
        </div>
    );
}
