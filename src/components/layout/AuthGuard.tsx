"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui";

interface AuthGuardProps {
    children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
    const { user, loading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push("/login");
        }
    }, [loading, isAuthenticated, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 mx-auto mb-4 flex items-center justify-center animate-pulse shadow-lg shadow-primary/20">
                        <svg className="w-8 h-8 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M7 17L17 7M17 7H7M17 7V17" />
                        </svg>
                    </div>
                    <p className="text-muted-foreground font-medium">Loading Asterika...</p>
                    <div className="mt-4 flex gap-1 justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
                    </div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}
