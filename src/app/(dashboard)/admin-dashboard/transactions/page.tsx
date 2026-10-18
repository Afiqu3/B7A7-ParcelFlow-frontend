import type { Metadata } from "next";
import { TransactionsPage as SharedTransactionsPage } from "@/components/modules/admin-dashboard/pages";

export const metadata: Metadata = {
  title: "Transactions · ParcelFlow",
  description: "Every merchant payment and refund, newest first.",
};

export default function TransactionsPage() {
  return <SharedTransactionsPage />;
}
