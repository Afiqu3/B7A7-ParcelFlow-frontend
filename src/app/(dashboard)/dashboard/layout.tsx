import DashboardShell from "@/components/dashboard/dashboard-shell";
import { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <>
      <DashboardShell role="MERCHANT">{children}</DashboardShell>
    </>
  );
}
