"use client";

import React from "react";
import { NewsManager } from "@/components/superadmin/NewsManager";
import { Newspaper, Bell, History } from "lucide-react";

export default function SuperAdminNewsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Newspaper className="w-6 h-6 text-amber-400" />
                        News & Updates Management
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Compose news, updates, and blogs for the AsterikaFX community.
                    </p>
                </div>
                <div className="flex items-center gap-4 px-4 py-2 rounded-xl bg-amber-500/5 border border-amber-500/10">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Platform News</span>
                        <span className="text-xs text-amber-400 font-semibold italic">Broadcasting to all users</span>
                    </div>
                    <Bell className="w-5 h-5 text-amber-400" />
                </div>
            </div>

            <NewsManager />
        </div>
    );
}
