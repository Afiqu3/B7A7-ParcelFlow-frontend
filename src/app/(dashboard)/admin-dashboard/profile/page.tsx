import type { Metadata } from "next";
import { AdminProfilePage } from "@/components/modules/admin-dashboard/pages";

export const metadata: Metadata = {
  title: "Profile · ParcelFlow",
  description: "Your admin identity — photo and contact details.",
};

export default function ProfilePage() {
  return <AdminProfilePage />;
}
