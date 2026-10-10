import ChangePasswordForm from "@/components/form/change-password-form";
import MustChangePasswordAlert from "@/components/modules/authentication/MustChangePasswordAlert";
import {
    BellRing,
    Fingerprint,
    KeyRound,
    MonitorSmartphone,
    ShieldCheck,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Change password · ParcelFlow",
    description: "Update your sign-in password.",
};

const tips = [
    {
        icon: Fingerprint,
        title: "Make it unique",
        body: "Don't reuse a password from email or social accounts.",
    },
    {
        icon: KeyRound,
        title: "Use a passphrase",
        body: "Three random words plus a number and symbol works well.",
    },
    {
        icon: BellRing,
        title: "Watch for alerts",
        body: "We'll notify you if a sign-in looks unfamiliar.",
    },
];

export default function ChangePasswordPage() {
    return (
        <div className="flex flex-col gap-5 sm:gap-6">
            {/* Page header */}
            <div className="flex flex-col gap-3 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                    <p className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1 font-heading text-[11px] font-bold tracking-[0.14em] text-white uppercase">
                        <ShieldCheck
                            className="size-3.5 text-brand-orange"
                            strokeWidth={2.5}
                        />
                        Account · Security
                    </p>
                    <h1 className="mt-2.5 font-heading text-2xl font-extrabold tracking-tight text-balance text-secondary sm:text-[28px] sm:leading-[1.15]">
                        Change password
                    </h1>
                    <p className="mt-1.5 max-w-xl text-sm text-pretty text-secondary/70">
                        Keep your merchant account protected. Your new password
                        takes effect immediately on your next sign-in.
                    </p>
                </div>
                <div className="flex shrink-0 items-center gap-2 rounded-xl bg-card px-3.5 py-2.5 text-xs font-medium text-secondary/70 ring-1 ring-secondary/10">
                    <MonitorSmartphone
                        className="size-4 text-brand"
                        strokeWidth={2.25}
                    />
                    You stay signed in on this device
                </div>
            </div>

            {/* Forced-change warning (temporary password). */}
            <MustChangePasswordAlert />

            {/* Content grid: form + side tips */}
            <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
                <div
                    className="min-w-0 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:fill-mode-backwards"
                    style={{ animationDelay: "80ms" }}
                >
                    <ChangePasswordForm />
                </div>

                <aside className="flex min-w-0 flex-col gap-5">
                    {/* Navy tips card */}
                    <div
                        className="relative overflow-hidden rounded-2xl bg-brand p-5 text-white ring-1 ring-white/10 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:fill-mode-backwards sm:p-6"
                        style={{ animationDelay: "140ms" }}
                    >
                        <div
                            aria-hidden
                            className="pointer-events-none absolute -top-16 -right-16 size-44 rounded-full bg-brand-orange/30 blur-3xl"
                        />
                        <div
                            aria-hidden
                            className="pointer-events-none absolute -bottom-20 -left-10 size-44 rounded-full bg-white/10 blur-3xl"
                        />
                        <div className="relative">
                            <h2 className="font-heading text-base font-extrabold tracking-tight">
                                Keep it strong
                            </h2>
                            <p className="mt-1 text-[13px] leading-relaxed text-white/70">
                                A few habits that stop most account takeovers.
                            </p>
                            <ul className="mt-4 flex flex-col gap-3">
                                {tips.map((tip) => (
                                    <li
                                        key={tip.title}
                                        className="flex items-start gap-3 rounded-xl bg-white/6 px-3 py-2.5 ring-1 ring-white/10 ring-inset transition-colors hover:bg-white/10"
                                    >
                                        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-orange/15 text-brand-orange ring-1 ring-brand-orange/25 ring-inset">
                                            <tip.icon
                                                className="size-4"
                                                strokeWidth={2.25}
                                            />
                                        </span>
                                        <span className="min-w-0">
                                            <span className="block font-heading text-[13px] font-bold">
                                                {tip.title}
                                            </span>
                                            <span className="block text-xs leading-relaxed text-white/65">
                                                {tip.body}
                                            </span>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* What happens next */}
                    <div
                        className="rounded-2xl bg-card p-5 ring-1 ring-secondary/10 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:fill-mode-backwards sm:p-6"
                        style={{ animationDelay: "200ms" }}
                    >
                        <h2 className="font-heading text-sm font-extrabold tracking-tight text-secondary">
                            What happens next
                        </h2>
                        <ol className="mt-3 flex flex-col gap-2.5 text-[13px] leading-relaxed text-secondary/70">
                            {[
                                "We verify your current password first.",
                                "Your new password is saved securely.",
                                "Use it the next time you sign in.",
                            ].map((step, index) => (
                                <li
                                    key={step}
                                    className="flex items-start gap-2.5"
                                >
                                    <span
                                        aria-hidden
                                        className="grid size-5.5 shrink-0 place-items-center rounded-full bg-brand-orange/15 font-heading text-[11px] font-extrabold text-brand-orange-ink"
                                    >
                                        {index + 1}
                                    </span>
                                    {step}
                                </li>
                            ))}
                        </ol>
                    </div>
                </aside>
            </div>
        </div>
    );
}
