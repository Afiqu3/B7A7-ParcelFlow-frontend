import DashboardShell from "@/components/dashboard/dashboard-shell";
import RoleGuard from "@/components/guard/RoleGuard";
import type { UserRole } from "@/types";
import type { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
    return (
        <RoleGuard roles={["ADMIN"]}>
            <DashboardShell role={"ADMIN" as UserRole}>
                {children}
            </DashboardShell>
        </RoleGuard>
    );
}
