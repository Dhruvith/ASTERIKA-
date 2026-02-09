"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: "default" | "success" | "warning" | "danger" | "outline" | "secondary";
    size?: "sm" | "default" | "lg";
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant = "default", size = "default", ...props }, ref) => {
        return (
            <span
                ref={ref}
                className={cn(
                    "inline-flex items-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    size === "sm" && "px-2 py-0.5 text-xs rounded-md",
                    size === "default" && "px-2.5 py-0.5 text-xs rounded-full",
                    size === "lg" && "px-3 py-1 text-sm rounded-full",
                    variant === "default" &&
                    "border-transparent bg-primary text-primary-foreground hover:bg-primary/80 shadow-sm",
                    variant === "secondary" &&
                    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                    variant === "success" &&
                    "border-transparent bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25",
                    variant === "warning" &&
                    "border-transparent bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25",
                    variant === "danger" &&
                    "border-transparent bg-rose-500/15 text-rose-600 dark:text-rose-400 hover:bg-rose-500/25",
                    variant === "outline" &&
                    "text-foreground border border-border",
                    className
                )}
                {...props}
            />
        );
    }
);
Badge.displayName = "Badge";

export { Badge };
