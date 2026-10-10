"use client";

import { ROUTES } from "@/constants";
import { useGetMe } from "@/hooks";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import AuthLoading from "./AuthLoading";

const AUTH_ROUTES: string[] = [
    ROUTES.login,
    ROUTES.register,
    ROUTES.forgotPassword,
    ROUTES.resetPassword,
    ROUTES.riderApply,
];

export default function PublicGuard({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const { data, isPending, isError } = useGetMe();

    useEffect(() => {
        if (isPending) return;

        if (data && AUTH_ROUTES.includes(pathname)) {
            if (data.role === "MERCHANT") {
                router.push(ROUTES.merchantDashboard);
            } else if (data.role === "RIDER") {
                router.push(ROUTES.riderDashboard);
            } else if (data.role === "ADMIN") {
                router.push(ROUTES.adminDashboard);
            } else if (data.role === "SUPER_ADMIN") {
                router.push(ROUTES.superAdminDashboard);
            }
        }
    }, [data, isPending, pathname, router]);

    if (isPending) {
        return <AuthLoading />;
    }

    if (isError) {
        return <>{children}</>;
    }

    return <>{children}</>;
}
