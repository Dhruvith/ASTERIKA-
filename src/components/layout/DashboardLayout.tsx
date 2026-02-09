"use client";

import React from "react";
import { Navbar } from "./Navbar";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-20">
                <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
