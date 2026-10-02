import type { Metadata } from "next";
import FinalCta from "@/components/modules/landing/FinalCta";
import Pricing from "@/components/modules/pricing/Pricing";
import PricingHero from "@/components/modules/pricing/PricingHero";
import PricingNotes from "@/components/modules/pricing/PricingNotes";

export const metadata: Metadata = {
  title: "Pricing — ParcelFlow",
  description:
    "Delivery rates for Inside City, Sub-City and Outside City parcels and documents. Estimate your price before you book.",
};

export default function PricingPage() {
  return (
    <>
      <PricingHero />
      <Pricing />
      <PricingNotes />
      <FinalCta />
    </>
  );
}
