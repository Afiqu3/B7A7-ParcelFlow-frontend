import AuthGuard from "@/components/guard/AuthGuard";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return <AuthGuard> {children}</AuthGuard>;
}
