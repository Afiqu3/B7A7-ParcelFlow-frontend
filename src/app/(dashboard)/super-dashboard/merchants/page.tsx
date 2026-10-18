import type { Metadata } from "next";
import { MerchantsPage as SharedMerchantsPage } from "@/components/modules/admin-dashboard/pages";

export const metadata: Metadata = {
  title: "Merchants · ParcelFlow",
  description: "Every registered merchant — search by name or email.",
};

export default function MerchantsPage() {
  return <SharedMerchantsPage />;
}
