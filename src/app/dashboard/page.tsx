"use client";

import React from "react";
import { motion } from "framer-motion";
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
import { formatDate } from "@/lib/utils";

export default function DashboardPage() {
    const { user } = useAuth();
    const { trades, stats, loading, deleteTrade } = useTrades();
    const { openEditModal } = useTradeStore();

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
                                {greeting()}, {user?.displayName?.split(" ")[0] || "Trader"} 👋
                            </h1>
                            <p className="text-muted-foreground mt-1 text-lg">
                                Here's your trading performance overview for {formatDate(new Date())}
                            </p>
                        </div>
                    </motion.div>

                    {/* Stats Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <StatsCards stats={stats} loading={loading} />
                    </motion.div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-3 gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="col-span-2"
                        >
                            <EquityCurve trades={trades} startingCapital={10000} />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <WinLossChart stats={stats} />
                        </motion.div>
                    </div>

                    {/* Daily P&L Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <PnLByDay trades={trades} />
                    </motion.div>

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
            </DashboardLayout>
        </AuthGuard>
    );
}
