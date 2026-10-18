import type { Metadata } from "next";
import { AssignmentsPage as SharedAssignmentsPage } from "@/components/modules/admin-dashboard/pages";

export const metadata: Metadata = {
  title: "Assignments · ParcelFlow",
  description: "Rider jobs across every parcel — filter by status.",
};

export default function AssignmentsPage() {
  return <SharedAssignmentsPage />;
}
