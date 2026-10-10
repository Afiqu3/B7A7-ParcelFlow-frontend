"use client";

import { Bike, Crown, ShieldCheck, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { FetchError } from "ofetch";
import { useLogin } from "@/hooks";
import { demoAccounts, type DemoAccount } from "@/lib/env";
import { completePasswordLogin } from "@/utils";
import { Spinner } from "@/components/ui/spinner";

const ROLE_ICONS = {
    MERCHANT: Store,
    RIDER: Bike,
    ADMIN: ShieldCheck,
    SUPER_ADMIN: Crown,
} as const;

/**
 * One-tap demo logins for every configured role. Renders nothing when no
 * demo credentials are set. Runs the exact same post-login flow as the
 * password form (forced-password check, `?next=` return).
 */
export default function DemoLogins({ next }: { next: string }) {
    const router = useRouter();
    const { mutate: login, isPending, variables } = useLogin();

    if (demoAccounts.length === 0) return null;

    const loginAs = (account: DemoAccount) =>
        login(
            { email: account.email, password: account.password },
            {
                onSuccess: (res) => {
                    completePasswordLogin(res, {
                        push: (url) => router.push(url),
                        next,
                    });
                },
                onError: (err: FetchError) => {
                    toast.error("Demo login failed", {
                        description:
                            err.data?.message ||
                            err.message ||
                            "Something went wrong. Please try again.",
                    });
                },
            },
        );

    return (
        <div className="flex flex-col gap-2.5">
            <p className="text-center font-heading text-xs font-bold tracking-[0.14em] text-secondary/60 uppercase">
                Try a demo account
            </p>
            <div className="grid grid-cols-2 gap-2.5">
                {demoAccounts.map((account) => {
                    const Icon = ROLE_ICONS[account.role];
                    const loading =
                        isPending && variables?.email === account.email;
                    return (
                        <button
                            key={account.role}
                            type="button"
                            disabled={isPending}
                            onClick={() => loginAs(account)}
                            aria-label={
                                loading
                                    ? `Logging in as ${account.label}…`
                                    : `Log in as ${account.label}`
                            }
                            className="group flex min-w-0 items-center gap-2.5 rounded-xl border border-secondary/12 bg-card px-3 py-2.5 text-left outline-none transition-all hover:border-brand-orange/50 hover:bg-brand-orange/5 focus-visible:ring-3 focus-visible:ring-brand-orange/40 active:scale-[0.98] disabled:opacity-70"
                        >
                            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand font-heading text-xs font-extrabold text-white transition-transform duration-300 group-hover:-rotate-6">
                                {loading ? (
                                    <Spinner className="size-4 text-white" />
                                ) : (
                                    <Icon className="size-4" strokeWidth={2.25} />
                                )}
                            </span>
                            <span className="min-w-0">
                                <span className="block truncate font-heading text-[13px] font-bold text-secondary">
                                    {account.label}
                                </span>
                                <span className="block truncate text-[11px] text-secondary/55">
                                    {account.email}
                                </span>
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
