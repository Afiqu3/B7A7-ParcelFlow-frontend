import type { Metadata } from "next";
import { AdminsPage as SharedAdminsPage } from "@/components/modules/admin-dashboard/pages";

export const metadata: Metadata = {
  title: "Admins · ParcelFlow",
  description: "Everyone with dashboard access — search by name or email.",
};

export default function AdminsPage() {
  return <SharedAdminsPage superAdmin />;
}
