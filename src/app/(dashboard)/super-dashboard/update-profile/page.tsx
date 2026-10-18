import type { Metadata } from "next";
import { UpdateAdminProfilePage as SharedUpdateAdminProfilePage } from "@/components/modules/admin-dashboard/pages";
import { ROUTES } from "@/constants";

export const metadata: Metadata = {
  title: "Update profile · ParcelFlow",
  description: "Keep your display name current.",
};

export default function UpdateAdminProfilePage() {
  return (
    <SharedUpdateAdminProfilePage dashboardBase={ROUTES.superAdminDashboard} />
  );
}
