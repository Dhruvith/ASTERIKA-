"use client";

import React, { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout, AuthGuard } from "@/components/layout";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { TradeTable } from "@/components/dashboard/TradeTable";
import { AddTradeModal } from "@/components/dashboard/AddTradeModal";
import { EquityCurve } from "@/components/charts/EquityCurve";
import { WinLossChart } from "@/components/charts/WinLossChart";
import { PnLByDay } from "@/components/charts/PnLByDay";
import { useTrades } from "@/hooks/useTrades";
import { useAuth } from "@/hooks/useAuth";
import { useTradeStore } from "@/store/useTradeStore";
import { formatDate, formatCurrency, cn } from "@/lib/utils";
import {
    Plus,
    Flame,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    Trophy,
    Keyboard,
} from "lucide-react";
import { Card, Button } from "@/components/ui";

export default function DashboardPage() {
    const { user } = useAuth();
    const { trades, stats, loading, deleteTrade } = useTrades();
    const { openAddModal, openEditModal } = useTradeStore();

    // Keyboard shortcut: N to open Add Trade modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Only trigger when not in an input/textarea
            const target = e.target as HTMLElement;
            if (
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.tagName === "SELECT" ||
                target.isContentEditable
            ) {
                return;
            }
            if (e.key === "n" || e.key === "N") {
                e.preventDefault();
                openAddModal();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [openAddModal]);

    const handleDeleteTrade = async (tradeId: string) => {
        if (confirm("Are you sure you want to delete this trade?")) {
            try {
                await deleteTrade(tradeId);
            } catch (error) {
                console.error("Failed to delete trade:", error);
            }
        }
    };

    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    // Calculate streaks & psychological metrics
    const psychMetrics = useMemo(() => {
        if (!trades.length) return null;

        const sorted = [...trades].sort(
            (a, b) =>
                new Date(a.exitDate).getTime() - new Date(b.exitDate).getTime()
        );

        // Current streak
        let currentStreak = 0;
        let streakType: "win" | "loss" | "none" = "none";
        for (let i = sorted.length - 1; i >= 0; i--) {
            if (i === sorted.length - 1) {
                streakType = sorted[i].pnl > 0 ? "win" : "loss";
                currentStreak = 1;
            } else {
                const isWin = sorted[i].pnl > 0;
                if (
                    (streakType === "win" && isWin) ||
                    (streakType === "loss" && !isWin)
                ) {
                    currentStreak++;
                } else {
                    break;
                }
            }
        }

        // Revenge trade detection (3 losses in a row)
        let maxLossStreak = 0;
        let currentLossStreak = 0;
        let revengeTrades = 0;
        for (const trade of sorted) {
            if (trade.pnl < 0) {
                currentLossStreak++;
                maxLossStreak = Math.max(maxLossStreak, currentLossStreak);
            } else {
                if (currentLossStreak >= 3) revengeTrades++;
                currentLossStreak = 0;
            }
        }

        // Best/worst day of week
        const dayPnL: Record<string, number> = {};
        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        for (const trade of sorted) {
            const day = daysOfWeek[new Date(trade.exitDate).getDay()];
            dayPnL[day] = (dayPnL[day] || 0) + trade.pnl;
        }
        const dayEntries = Object.entries(dayPnL);
        const bestDay = dayEntries.length
            ? dayEntries.reduce((a, b) => (a[1] > b[1] ? a : b))
            : null;
        const worstDay = dayEntries.length
            ? dayEntries.reduce((a, b) => (a[1] < b[1] ? a : b))
            : null;

        // Today's P&L
        const today = new Date();
        const todayPnL = sorted
            .filter(
                (t) =>
                    new Date(t.exitDate).toDateString() === today.toDateString()
            )
            .reduce((sum, t) => sum + t.pnl, 0);

        return {
            currentStreak,
            streakType,
            revengeTrades,
            bestDay,
            worstDay,
            todayPnL,
        };
    }, [trades]);

    return (
        <AuthGuard>
            <DashboardLayout>
                <div className="space-y-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between"
                    >
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                {greeting()},{" "}
                                {user?.displayName?.split(" ")[0] || "Trader"} 👋
                            </h1>
                            <p className="text-muted-foreground mt-1 text-lg">
                                Here's your trading performance overview for{" "}
                                {formatDate(new Date())}
                            </p>
                        </div>
                        <div className="hidden md:flex items-center gap-3">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-md border border-border">
                                <Keyboard className="w-3.5 h-3.5" />
                                Press <kbd className="px-1.5 py-0.5 bg-card border border-border rounded text-[10px] font-mono font-bold">N</kbd> to add trade
                            </div>
                        </div>
                    </motion.div>

                    {/* Streak & Psychology Row */}
                    {psychMetrics && trades.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-3"
                        >
                            {/* Current Streak */}
                            <div
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors",
                                    psychMetrics.streakType === "win"
                                        ? "bg-emerald-500/5 border-emerald-500/20"
                                        : psychMetrics.streakType === "loss"
                                            ? "bg-rose-500/5 border-rose-500/20"
                                            : "bg-card border-border"
                                )}
                            >
                                <div
                                    className={cn(
                                        "w-9 h-9 rounded-lg flex items-center justify-center",
                                        psychMetrics.streakType === "win"
                                            ? "bg-emerald-500/10"
                                            : "bg-rose-500/10"
                                    )}
                                >
                                    <Flame
                                        className={cn(
                                            "w-4.5 h-4.5",
                                            psychMetrics.streakType === "win"
                                                ? "text-emerald-500"
                                                : "text-rose-500"
                                        )}
                                    />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Current Streak
                                    </p>
                                    <p
                                        className={cn(
                                            "text-lg font-bold font-mono",
                                            psychMetrics.streakType === "win"
                                                ? "text-emerald-500"
                                                : "text-rose-500"
                                        )}
                                    >
                                        {psychMetrics.currentStreak}{" "}
                                        {psychMetrics.streakType === "win"
                                            ? "W"
                                            : "L"}
                                    </p>
                                </div>
                            </div>

                            {/* Today's P&L */}
                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card">
                                <div
                                    className={cn(
                                        "w-9 h-9 rounded-lg flex items-center justify-center",
                                        psychMetrics.todayPnL >= 0
                                            ? "bg-emerald-500/10"
                                            : "bg-rose-500/10"
                                    )}
                                >
                                    {psychMetrics.todayPnL >= 0 ? (
                                        <TrendingUp className="w-4.5 h-4.5 text-emerald-500" />
                                    ) : (
                                        <TrendingDown className="w-4.5 h-4.5 text-rose-500" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Today's P&L
                                    </p>
                                    <p
                                        className={cn(
                                            "text-lg font-bold font-mono",
                                            psychMetrics.todayPnL >= 0
                                                ? "text-emerald-500"
                                                : "text-rose-500"
                                        )}
                                    >
                                        {psychMetrics.todayPnL >= 0 ? "+" : ""}
                                        {formatCurrency(psychMetrics.todayPnL)}
                                    </p>
                                </div>
                            </div>

                            {/* Best Day */}
                            {psychMetrics.bestDay && (
                                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card">
                                    <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-emerald-500/10">
                                        <Trophy className="w-4.5 h-4.5 text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Best Day
                                        </p>
                                        <p className="text-sm font-bold text-foreground">
                                            {psychMetrics.bestDay[0]}{" "}
                                            <span className="text-emerald-500 font-mono text-xs">
                                                {formatCurrency(
                                                    psychMetrics.bestDay[1]
                                                )}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Revenge Trades Warning */}
                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card">
                                <div
                                    className={cn(
                                        "w-9 h-9 rounded-lg flex items-center justify-center",
                                        psychMetrics.revengeTrades > 0
                                            ? "bg-amber-500/10"
                                            : "bg-emerald-500/10"
                                    )}
                                >
                                    <AlertTriangle
                                        className={cn(
                                            "w-4.5 h-4.5",
                                            psychMetrics.revengeTrades > 0
                                                ? "text-amber-500"
                                                : "text-emerald-500"
                                        )}
                                    />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Revenge Trades
                                    </p>
                                    <p
                                        className={cn(
                                            "text-lg font-bold font-mono",
                                            psychMetrics.revengeTrades > 0
                                                ? "text-amber-500"
                                                : "text-emerald-500"
                                        )}
                                    >
                                        {psychMetrics.revengeTrades > 0
                                            ? `${psychMetrics.revengeTrades} ⚠️`
                                            : "Clean ✓"}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Stats Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <StatsCards stats={stats} loading={loading} />
                    </motion.div>

                    {/* Charts Row - Equity Curve Full Width */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <EquityCurve trades={trades} startingCapital={10000} />
                    </motion.div>

                    {/* Charts Row 2 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <WinLossChart stats={stats} />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <PnLByDay trades={trades} />
                        </motion.div>
                    </div>

                    {/* Trade Table */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <TradeTable
                            trades={trades}
                            loading={loading}
                            onEdit={openEditModal}
                            onDelete={handleDeleteTrade}
                        />
                    </motion.div>
                </div>

                {/* Add Trade Modal */}
                <AddTradeModal />

                {/* Quick Add Trade FAB */}
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: 0.8,
                    }}
                    onClick={openAddModal}
                    className="fixed bottom-8 right-8 z-40 w-14 h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full flex items-center justify-center shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-110 active:scale-95 group"
                    title="Add New Trade (N)"
                >
                    <Plus className="w-6 h-6 transition-transform group-hover:rotate-90" />
                </motion.button>
            </DashboardLayout>
        </AuthGuard>
    );
}
