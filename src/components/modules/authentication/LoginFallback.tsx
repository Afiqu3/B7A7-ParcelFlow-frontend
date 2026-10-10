import { Skeleton } from "@/components/ui/skeleton";

/**
 * Suspense fallback for `login/page.tsx`.
 *
 * Mirrors the footprint of `LoginForm` (heading, email + password fields,
 * submit button, divider, Google button) so swapping the real form in
 * causes no layout shift. Uses the auth theme: `bg-accent` page,
 * `text-secondary` copy.
 */
export default function LoginFallback() {
    return (
        <div
            role="status"
            aria-live="polite"
            aria-busy="true"
            className="flex flex-col gap-5"
        >
            <span className="sr-only">Loading login form…</span>

            {/* Header */}
            <div aria-hidden="true" className="flex flex-col gap-2">
                <Skeleton className="h-9 w-32 bg-secondary/10" />
                <Skeleton className="h-4 w-full bg-secondary/8" />
            </div>

            {/* Email field */}
            <div aria-hidden="true" className="flex flex-col gap-2">
                <Skeleton className="h-4 w-16 bg-secondary/10" />
                <Skeleton className="h-9 w-full rounded-lg bg-secondary/8" />
            </div>

            {/* Password field */}
            <div aria-hidden="true" className="flex flex-col gap-2">
                <Skeleton className="h-4 w-24 bg-secondary/10" />
                <Skeleton className="h-9 w-full rounded-lg bg-secondary/8" />
            </div>

            {/* Submit button */}
            <div
                aria-hidden="true"
                className="flex items-center justify-center gap-2 rounded-lg bg-chart-2/70 py-5 font-heading text-sm font-bold text-secondary"
            >
                Preparing login…
            </div>
        </div>
    );
}
