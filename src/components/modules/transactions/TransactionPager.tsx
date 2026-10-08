import {
    Pagination,
    PaginationContent,
    PaginationItem,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

/** Compact page window: [1, …, p-1, p, p+1, …, N]. */
export function pageWindow(
    current: number,
    total: number,
): (number | "gap")[] {
    if (total <= 7) {
        return Array.from({ length: total }, (_, index) => index + 1);
    }
    const wanted = new Set(
        [1, 2, current - 1, current, current + 1, total - 1, total].filter(
            (page) => page >= 1 && page <= total,
        ),
    );
    const sorted = [...wanted].sort((a, b) => a - b);
    const window: (number | "gap")[] = [];
    let previous = 0;
    for (const page of sorted) {
        if (page - previous > 1) window.push("gap");
        window.push(page);
        previous = page;
    }
    return window;
}

function PagerButton({
    label,
    current,
    disabled,
    onClick,
    className,
    children,
}: {
    label: string;
    current?: boolean;
    disabled?: boolean;
    onClick: () => void;
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            aria-label={label}
            aria-current={current ? "page" : undefined}
            disabled={disabled}
            onClick={onClick}
            className={cn(
                "grid h-9 min-w-9 place-items-center rounded-xl px-2 font-heading text-sm font-bold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-brand-orange/50 disabled:cursor-not-allowed disabled:opacity-40",
                current
                    ? "bg-brand text-white"
                    : "text-secondary/65 hover:bg-secondary/8 hover:text-secondary",
                className,
            )}
        >
            {children}
        </button>
    );
}

/** Prev / numbered / Next pager shared by dashboard list pages. */
export default function TransactionPager({
    page,
    totalPages,
    onChange,
}: {
    page: number;
    totalPages: number;
    onChange: (page: number) => void;
}) {
    if (totalPages <= 1) return null;

    return (
        <Pagination className="rounded-2xl bg-card py-3 ring-1 ring-secondary/10">
            <PaginationContent className="flex-wrap gap-1 px-2">
                <PaginationItem>
                    <PagerButton
                        label="Previous page"
                        disabled={page <= 1}
                        onClick={() => onChange(page - 1)}
                        className="px-3"
                    >
                        Previous
                    </PagerButton>
                </PaginationItem>
                {pageWindow(page, totalPages).map((entry, position) =>
                    entry === "gap" ? (
                        <PaginationItem
                            // biome-ignore lint/suspicious/noArrayIndexKey: gaps have no stable id
                            key={`gap-${position}`}
                            aria-hidden
                            className="hidden items-center px-1 text-secondary/40 sm:flex"
                        >
                            …
                        </PaginationItem>
                    ) : (
                        <PaginationItem
                            key={entry}
                            className={cn(
                                entry !== page &&
                                    entry !== 1 &&
                                    entry !== totalPages &&
                                    "hidden sm:block",
                            )}
                        >
                            <PagerButton
                                label={`Page ${entry}`}
                                current={entry === page}
                                onClick={() => onChange(entry)}
                            >
                                {entry}
                            </PagerButton>
                        </PaginationItem>
                    ),
                )}
                <PaginationItem>
                    <PagerButton
                        label="Next page"
                        disabled={page >= totalPages}
                        onClick={() => onChange(page + 1)}
                        className="px-3"
                    >
                        Next
                    </PagerButton>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
