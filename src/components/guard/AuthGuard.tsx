"use client";

import { useGetMe } from "@/hooks";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import AuthLoading from "./AuthLoading";
import { ROUTES } from "@/constants";

export default function AuthGuard({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const { data: user, isPending, isError } = useGetMe();

    useEffect(() => {
        if (isPending) {
            return;
        }

        if (isError || !user) {
            router.replace(
                `${ROUTES.login}?next=${encodeURIComponent(pathname)}`,
            );
        }
    }, [isPending, isError, user, pathname, router]);

    if (isPending) {
        return <AuthLoading />;
    }

    if (isError || !user) {
        return <AuthLoading />;
    }

    return <>{children}</>;
}
