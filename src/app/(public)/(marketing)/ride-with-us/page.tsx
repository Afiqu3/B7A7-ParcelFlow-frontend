import type { Metadata } from "next";
import Link from "next/link";
import CtaLink from "@/components/modules/landing/CtaLink";
import RideWithUs from "@/components/modules/ride-with-us/ride-with-us";
import VehicleTiles from "@/components/modules/ride-with-us/VehicleTiles";
import PageHero from "@/components/shared/PageHero";
import { ROUTES } from "@/constants";

export const metadata: Metadata = {
  title: "Ride with us — ParcelFlow",
  description:
    "Pick up and deliver parcels in your area with a bike, bicycle or van. See what you need and how to apply.",
};

export default function RideWithUsPage() {
  return (
    <>
      <PageHero
        tone="orange"
        headingId="ride-with-us-heading"
        eyebrow="For riders"
        lines={[{ text: "Ride with" }, { text: "ParcelFlow." }]}
        description={
          <p>
            Pick up and deliver parcels in your area. Apply online — our team
            reviews every application.
          </p>
        }
        actions={
          <>
            <CtaLink href={ROUTES.riderApply} variant="ink" arrow>
              Apply as a rider
            </CtaLink>
            <Link
              href={ROUTES.login}
              className="w-fit rounded-sm font-heading text-[15px] font-bold underline decoration-2 underline-offset-4 outline-none transition-colors hover:decoration-brand-ink/40 focus-visible:ring-3 focus-visible:ring-brand-ink/30"
            >
              Already a rider? Log in
            </Link>
          </>
        }
        aside={<VehicleTiles />}
      />
      <RideWithUs />
    </>
  );
}
