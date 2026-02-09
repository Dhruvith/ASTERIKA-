import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "circular" | "text";
}

function Skeleton({ className, variant = "default", ...props }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse bg-muted",
                variant === "default" && "rounded-md",
                variant === "circular" && "rounded-full",
                variant === "text" && "rounded h-4",
                className
            )}
            {...props}
        />
    );
}

function CardSkeleton() {
    return (
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <Skeleton variant="text" className="w-24 h-4" />
                <Skeleton variant="circular" className="w-8 h-8" />
            </div>
            <Skeleton variant="text" className="w-32 h-8 mb-2" />
            <Skeleton variant="text" className="w-20 h-4" />
        </div>
    );
}

function TableRowSkeleton() {
    return (
        <div className="flex items-center gap-4 py-4 px-6 border-b border-border">
            <Skeleton variant="circular" className="w-10 h-10" />
            <Skeleton variant="text" className="w-20" />
            <Skeleton variant="text" className="w-16 flex-1" />
            <Skeleton variant="text" className="w-16 flex-1" />
            <Skeleton variant="text" className="w-20 flex-1" />
            <Skeleton variant="text" className="w-24 flex-1" />
            <Skeleton variant="text" className="w-16" />
        </div>
    );
}

function ChartSkeleton() {
    return (
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <Skeleton variant="text" className="w-32 h-5" />
                <div className="flex gap-2">
                    <Skeleton className="w-16 h-8" />
                    <Skeleton className="w-16 h-8" />
                </div>
            </div>
            <div className="h-[300px] flex items-end justify-between gap-2 pt-8">
                {[...Array(12)].map((_, i) => (
                    <Skeleton
                        key={i}
                        className="flex-1 rounded-t-md"
                        style={{ height: `${30 + Math.random() * 60}%` }}
                    />
                ))}
            </div>
        </div>
    );
}

export { Skeleton, CardSkeleton, TableRowSkeleton, ChartSkeleton };
