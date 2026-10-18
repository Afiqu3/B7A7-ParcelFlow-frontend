import type { Metadata } from "next";
import { RidersPage as SharedRidersPage } from "@/components/modules/admin-dashboard/pages";

export const metadata: Metadata = {
  title: "Riders · ParcelFlow",
  description: "Review applications and manage rider access.",
};

export default function RidersPage() {
  return <SharedRidersPage />;
}
