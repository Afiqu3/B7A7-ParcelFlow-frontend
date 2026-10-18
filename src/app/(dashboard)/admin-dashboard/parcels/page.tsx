import type { Metadata } from "next";
import AllParcelsPage from "@/components/modules/admin-dashboard/parcels/AllParcelsPage";

export const metadata: Metadata = {
  title: "Parcels · ParcelFlow",
  description:
    "Every merchant booking — search, filter and move through the hub.",
};

export default function ParcelsPage() {
  return <AllParcelsPage />;
}
