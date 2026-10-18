import type { Metadata } from "next";
import { CreateAdminPage as SharedCreateAdminPage } from "@/components/modules/admin-dashboard/pages";

export const metadata: Metadata = {
  title: "Create admin · ParcelFlow",
  description: "Grant dashboard access to a teammate.",
};

export default function CreateAdminPage() {
  return <SharedCreateAdminPage />;
}
