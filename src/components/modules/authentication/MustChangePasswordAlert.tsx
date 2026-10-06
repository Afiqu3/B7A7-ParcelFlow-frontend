"use client";

import { useGetMe } from "@/hooks";
import { TriangleAlert } from "lucide-react";
import { motion } from "motion/react";

/**
 * Warning shown at the top of the change-password page while the signed-in
 * user still has `mustChangePassword` (e.g. an admin-issued temporary
 * password). Renders nothing while loading or for regular password
 * changes. Entrance is motion-based and honours the shell's
 * `reducedMotion="user"` setting.
 */
export default function MustChangePasswordAlert() {
    const { data: user, isPending } = useGetMe();

    if (isPending || !user?.mustChangePassword) return null;

    return (
        <motion.div
            role="alert"
            initial={{ opacity: 0, y: -10, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex items-start gap-3 rounded-2xl bg-amber-500/10 px-4 py-3.5 ring-1 ring-amber-600/25 ring-inset sm:items-center sm:px-5"
        >
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-amber-500/15 text-amber-700 ring-1 ring-amber-600/25 ring-inset">
                <TriangleAlert className="size-4.5" strokeWidth={2.25} />
            </span>
            <div className="min-w-0">
                <p className="font-heading text-sm font-extrabold tracking-tight text-amber-950">
                    Password change required
                </p>
                <p className="mt-0.5 text-[13px] leading-relaxed text-amber-900/80">
                    Your account is using a temporary password. Please set a
                    new password below to continue using ParcelFlow.
                </p>
            </div>
        </motion.div>
    );
}
