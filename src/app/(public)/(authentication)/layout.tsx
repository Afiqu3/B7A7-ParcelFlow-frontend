import PublicGuard from "@/components/guard/PublicGuard";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return <PublicGuard> {children}</PublicGuard>;
}
