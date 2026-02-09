"use client";

import React from "react";
import { motion } from "framer-motion";
import { DashboardLayout, AuthGuard } from "@/components/layout";
import { useTrades } from "@/hooks/useTrades";
import { EquityCurve } from "@/components/charts/EquityCurve";
import { WinLossChart } from "@/components/charts/WinLossChart";
import { PnLByDay } from "@/components/charts/PnLByDay";
import { Card } from "@/components/ui";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { TrendingUp, TrendingDown, Target, Activity, BarChart, Percent } from "lucide-react";

export default function AnalyticsPage() {
    const { trades, stats } = useTrades();

    const metrics = stats ? [
        {
            label: "Profit Factor",
            value: formatNumber(stats.profitFactor),
            icon: TrendingUp,
            desc: "Gross Profit / Gross Loss",
            color: stats.profitFactor > 1.5 ? "text-emerald-500" : stats.profitFactor > 1 ? "text-yellow-500" : "text-rose-500",
            bg: stats.profitFactor > 1.5 ? "bg-emerald-500/10" : stats.profitFactor > 1 ? "bg-yellow-500/10" : "bg-rose-500/10"
        },
        {
            label: "Win Rate",
            value: `${formatNumber(stats.winRate)}%`,
            icon: Percent,
            desc: "Percentage of winning trades",
            color: stats.winRate > 50 ? "text-emerald-500" : "text-rose-500",
            bg: stats.winRate > 50 ? "bg-emerald-500/10" : "bg-rose-500/10"
        },
        {
            label: "Risk/Reward",
            value: formatNumber(stats.avgRiskReward),
            icon: Target,
            desc: "Average Risk to Reward Ratio",
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            label: "Expectancy",
            value: formatCurrency(stats.expectancy),
            icon: Activity,
            desc: "Expected value per trade",
            color: stats.expectancy > 0 ? "text-emerald-500" : "text-rose-500",
            bg: stats.expectancy > 0 ? "bg-emerald-500/10" : "bg-rose-500/10"
        },
        {
            label: "Sharpe Ratio",
            value: formatNumber(stats.sharpeRatio),
            icon: BarChart,
            desc: "Risk-adjusted return",
            color: stats.sharpeRatio > 1 ? "text-purple-500" : "text-muted-foreground",
            bg: stats.sharpeRatio > 1 ? "bg-purple-500/10" : "bg-secondary"
        },
        {
            label: "Max Drawdown",
            value: formatCurrency(stats.maxDrawdown),
            icon: TrendingDown,
            desc: "Largest peak-to-valley decline",
            color: "text-rose-500",
            bg: "bg-rose-500/10"
        }
    ] : [];

    return (
        <AuthGuard>
            <DashboardLayout>
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Analytics Dashboard
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Deep dive into your trading performance metrics
                        </p>
                    </motion.div>

                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                        {metrics.map((metric, i) => {
                            const Icon = metric.icon;
                            return (
                                <motion.div
                                    key={metric.label}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Card className="p-4 border-border hover:border-primary/50 transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className={`p-2 rounded-lg ${metric.bg}`}>
                                                <Icon className={`w-4 h-4 ${metric.color}`} />
                                            </div>
                                            {metric.label === "Win Rate" && stats && (
                                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${metric.bg} ${metric.color}`}>
                                                    {stats.winningTrades}W / {stats.losingTrades}L
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                                            <h3 className={`text-2xl font-bold ${metric.color}`}>{metric.value}</h3>
                                            <p className="text-xs text-muted-foreground mt-1 truncate" title={metric.desc}>
                                                {metric.desc}
                                            </p>
                                        </div>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Charts Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Equity Curve - Full Width on Mobile, 2/3 on Desktop */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="lg:col-span-2"
                        >
                            <EquityCurve trades={trades} startingCapital={10000} />
                        </motion.div>

                        {/* Win/Loss Distribution */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <WinLossChart stats={stats} />
                        </motion.div>

                        {/* PnL By Day - Full Width */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="lg:col-span-3"
                        >
                            <PnLByDay trades={trades} />
                        </motion.div>
                    </div>
                </div>
            </DashboardLayout>
        </AuthGuard>
    );
}
