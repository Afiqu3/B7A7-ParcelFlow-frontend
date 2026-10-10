"use client";

import { useGetMe } from "@/hooks";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { ROUTES } from "@/constants";
import { ROLE_HOME } from "@/routes";
import type { UserRole } from "@/types";
import AccessDenied from "./AccessDenied";
import AuthLoading from "./AuthLoading";

interface IProps {
    children: ReactNode;
    roles: UserRole[];
}

export default function RoleGuard({ children, roles }: IProps) {
    const router = useRouter();
    const pathname = usePathname();

    const { data: user, isPending, isError, refetch, isFetching } = useGetMe();
    // Network blips get exactly one silent retry before we give up.
    const [retried, setRetried] = useState(false);

    const isAuthorized = !!user && roles.includes(user.role);

    useEffect(() => {
        if (isPending || isFetching) {
            return;
        }

        if (isError && !retried) {
            setRetried(true);
            refetch();
            return;
        }

        if (!user) {
            router.replace(
                `${ROUTES.login}?next=${encodeURIComponent(pathname)}`,
            );
        }
    }, [
        isPending,
        isFetching,
        isError,
        retried,
        user,
        pathname,
        router,
        refetch,
    ]);

    if (isPending || (isError && !retried)) {
        return <AuthLoading />;
    }

    if (!user) {
        // Redirecting away — hold the loader instead of flashing guarded UI.
        return <AuthLoading />;
    }

    if (isAuthorized) {
        return <>{children}</>;
    }

    return (
        <AccessDenied requiredRoles={roles} actualRole={user.role} homeHref={ROLE_HOME[user.role] ?? ROUTES.home} />
    );
}
