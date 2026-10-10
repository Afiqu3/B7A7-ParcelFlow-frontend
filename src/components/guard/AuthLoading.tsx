"use client";

import Logo from "@/assets/svg/Logo";
import { Spinner } from "@/components/ui/spinner";

/**
 * Full-screen session check shown by `PublicGuard` while the signed-in
 * state resolves. Auth theme (`bg-accent`, navy brand mark) so the swap
 * to the real auth page doesn't flash.
 */
export default function AuthLoading() {
    return (
        <div
            role="status"
            aria-live="polite"
            className="grid min-h-svh place-items-center bg-accent px-6 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-300"
        >
            <span className="sr-only">Checking your session…</span>
            <div
                aria-hidden
                className="flex flex-col items-center gap-5 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300"
            >
                <span className="block size-16 drop-shadow-[0_20px_40px_rgba(15,32,86,0.35)]">
                    <Logo />
                </span>
                <span className="flex items-center gap-2.5 font-heading text-sm font-bold text-secondary">
                    <Spinner className="size-4 text-brand-orange" />
                    Checking your session…
                </span>
            </div>
        </div>
    );
}
