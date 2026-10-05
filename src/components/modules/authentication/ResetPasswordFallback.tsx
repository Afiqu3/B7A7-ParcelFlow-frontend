import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

/**
 * Suspense fallback for `reset-password/page.tsx`.
 *
 * Mirrors the footprint of `ResetPasswordForm` (back link, heading,
 * description, 6-digit OTP slots, new + confirm password fields,
 * password-strength meter, submit button) so swapping the real form in
 * causes no layout shift. Uses the auth theme: `bg-accent` page,
 * `text-secondary` copy, `bg-chart-2` primary action.
 */
export default function ResetPasswordFallback() {
    return (
        <div
            role="status"
            aria-live="polite"
            aria-busy="true"
            className="flex flex-col gap-5"
        >
            <span className="sr-only">Loading password reset form…</span>

            {/* Header: back link, title, description */}
            <div aria-hidden="true" className="flex flex-col gap-2">
                <Skeleton className="mb-7 h-4 w-44 bg-secondary/10" />
                <Skeleton className="mt-2 h-9 w-64 bg-secondary/10" />
                <div className="flex flex-col gap-2 pt-1">
                    <Skeleton className="h-4 w-full bg-secondary/8" />
                    <Skeleton className="h-4 w-2/3 bg-secondary/8" />
                </div>
            </div>

            {/* Reset code OTP slots */}
            <div aria-hidden="true" className="flex flex-col gap-2">
                <Skeleton className="h-4 w-20 bg-secondary/10" />
                <div className="flex flex-row gap-2">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <Skeleton
                            // biome-ignore lint/suspicious/noArrayIndexKey: static 6-slot placeholder
                            key={index}
                            className="h-13 w-12 rounded-sm bg-secondary/8"
                        />
                    ))}
                </div>
            </div>

            {/* New password field */}
            <div aria-hidden="true" className="flex flex-col gap-2">
                <Skeleton className="h-4 w-28 bg-secondary/10" />
                <Skeleton className="h-9 w-full rounded-lg bg-secondary/8" />
            </div>

            {/* Confirm password field + strength meter */}
            <div aria-hidden="true" className="flex flex-col gap-2">
                <Skeleton className="h-4 w-40 bg-secondary/10" />
                <Skeleton className="h-9 w-full rounded-lg bg-secondary/8" />
                <div className="mt-1 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                        <div className="flex flex-1 gap-1">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <Skeleton
                                    // biome-ignore lint/suspicious/noArrayIndexKey: static 5-segment meter placeholder
                                    key={index}
                                    className="h-1.5 flex-1 rounded-full bg-secondary/10"
                                />
                            ))}
                        </div>
                        <Skeleton className="h-4 w-16 bg-secondary/10" />
                    </div>
                    <div className="grid gap-x-4 gap-y-1.5 sm:grid-cols-2">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div
                                // biome-ignore lint/suspicious/noArrayIndexKey: static 5-rule checklist placeholder
                                key={index}
                                className="flex items-center gap-2"
                            >
                                <Skeleton className="size-4 shrink-0 rounded-full bg-secondary/10" />
                                <Skeleton className="h-3 flex-1 bg-secondary/8" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Submit button */}
            <div
                aria-hidden="true"
                className="flex items-center justify-center gap-2 rounded-lg bg-chart-2/70 py-5 font-heading text-sm font-bold text-secondary"
            >
                <Spinner className="size-4" aria-hidden="true" />
                Preparing password reset…
            </div>
        </div>
    );
}
