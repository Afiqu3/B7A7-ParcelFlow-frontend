import DashboardShell from "@/components/dashboard/dashboard-shell";
import type { UserRole } from "@/types";
import type { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
    return (
        <DashboardShell role={"ADMIN" as UserRole}>
            {children}
        </DashboardShell>
    );
}
