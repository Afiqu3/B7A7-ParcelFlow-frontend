import type { Metadata } from "next";
import { PricingRulesPage as SharedPricingRulesPage } from "@/components/modules/admin-dashboard/pages";

export const metadata: Metadata = {
  title: "Pricing rules · ParcelFlow",
  description: "One rate per zone and parcel category.",
};

export default function PricingRulePage() {
  return <SharedPricingRulesPage />;
}
