import { Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

/**
 * Suspense fallback for `register/verify-account/page.tsx`.
 *
 * Mirrors the footprint of `VerifyAccountForm` (back link, mail tile,
 * heading, OTP slots, timer row, submit button, info card) so swapping
 * the real form in causes no layout shift. Uses the auth theme:
 * `bg-accent` page, `text-secondary` copy, `bg-brand-orange/20` tile,
 * `bg-chart-2` primary action.
 */
export default function VerifyAccountFallback() {
    return (
        <div
            role="status"
            aria-live="polite"
            aria-busy="true"
            className="flex flex-col gap-5"
        >
            <span className="sr-only">Loading verification form…</span>

            {/* Header: back link, icon tile, title, description */}
            <div aria-hidden="true" className="flex flex-col gap-2">
                <Skeleton className="mb-7 h-4 w-32 bg-secondary/10" />
                <div className="flex max-w-17 items-center justify-center rounded-lg bg-brand-orange/20 p-4 text-brand-orange">
                    <Mail className="animate-pulse" aria-hidden="true" />
                </div>
                <Skeleton className="mt-2 h-9 w-60 bg-secondary/10" />
                <div className="flex flex-col gap-2 pt-1">
                    <Skeleton className="h-4 w-full bg-secondary/8" />
                    <Skeleton className="h-4 w-2/3 bg-secondary/8" />
                </div>
            </div>

            {/* OTP slots */}
            <div aria-hidden="true" className="flex flex-row gap-2">
                {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton
                        // biome-ignore lint/suspicious/noArrayIndexKey: static 6-slot placeholder
                        key={index}
                        className="h-13 w-12 rounded-sm bg-secondary/8"
                    />
                ))}
            </div>

            {/* Timer + resend row */}
            <div
                aria-hidden="true"
                className="flex flex-row items-center justify-between"
            >
                <Skeleton className="h-4 w-36 bg-secondary/8" />
                <Skeleton className="h-4 w-24 bg-brand-orange/25" />
            </div>

            {/* Submit button */}
            <div
                aria-hidden="true"
                className="flex items-center justify-center gap-2 rounded-lg bg-chart-2/70 py-5 font-heading text-sm font-bold text-secondary"
            >
                <Spinner className="size-4" aria-hidden="true" />
                Preparing verification…
            </div>

            {/* Info card */}
            <div aria-hidden="true" className="mt-5">
                <Card>
                    <CardContent className="flex flex-row gap-2">
                        <Skeleton className="size-6 shrink-0 rounded-md bg-secondary/10" />
                        <div className="flex w-full flex-col gap-2">
                            <Skeleton className="h-3 w-full bg-secondary/8" />
                            <Skeleton className="h-3 w-4/5 bg-secondary/8" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
