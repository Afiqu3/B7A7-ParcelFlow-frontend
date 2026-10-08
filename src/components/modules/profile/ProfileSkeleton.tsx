import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileSkeleton() {
    return (
        <div
            aria-hidden
            className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]"
        >
            <div className="flex min-w-0 flex-col gap-5">
                <div className="overflow-hidden rounded-2xl bg-card ring-1 ring-secondary/10">
                    <div className="border-b border-secondary/8 px-5 py-5 sm:px-6">
                        <div className="flex gap-2">
                            <Skeleton className="h-6 w-24 rounded-full" />
                            <Skeleton className="h-6 w-20 rounded-full" />
                            <Skeleton className="h-6 w-24 rounded-full" />
                        </div>
                        <Skeleton className="mt-3 h-7 w-2/3" />
                        <Skeleton className="mt-2 h-4 w-1/2" />
                    </div>
                    <div className="grid grid-cols-1 gap-3 px-5 py-5 sm:grid-cols-3 sm:px-6">
                        <Skeleton className="h-16 rounded-xl" />
                        <Skeleton className="h-16 rounded-xl" />
                        <Skeleton className="h-16 rounded-xl" />
                    </div>
                </div>
                <div className="rounded-2xl bg-card p-5 ring-1 ring-secondary/10 sm:p-6">
                    <Skeleton className="h-5 w-44" />
                    <Skeleton className="mt-2 h-4 w-64" />
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Skeleton className="h-17 rounded-xl" />
                        <Skeleton className="h-17 rounded-xl" />
                        <Skeleton className="h-17 rounded-xl" />
                        <Skeleton className="h-17 rounded-xl" />
                    </div>
                </div>
            </div>
            <div className="flex min-w-0 flex-col gap-5">
                <div className="rounded-2xl bg-card p-5 ring-1 ring-secondary/10 sm:p-6">
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="mt-2 h-4 w-40" />
                    <div className="mt-4 flex flex-col items-center">
                        <Skeleton className="size-28 rounded-3xl sm:size-32" />
                        <Skeleton className="mt-4 h-10 w-full rounded-xl" />
                    </div>
                </div>
                <Skeleton className="h-56 rounded-2xl" />
            </div>
        </div>
    );
}
