import DashboardShell from "@/components/dashboard/dashboard-shell";
import { UserRole } from "@/types";
import { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
    return (
        <DashboardShell role={"MERCHANT" as UserRole}>
            {children}
        </DashboardShell>
    );
}
