import type { Metadata } from "next";
import { AvailableRidersPage as SharedAvailableRidersPage } from "@/components/modules/admin-dashboard/pages";

export const metadata: Metadata = {
  title: "Available riders · ParcelFlow",
  description: "Riders free right now — search and assign parcels.",
};

export default function AvailableRidersPage() {
  return <SharedAvailableRidersPage />;
}
