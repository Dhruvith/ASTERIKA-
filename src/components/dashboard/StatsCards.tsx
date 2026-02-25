"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui";
import { TradeStats } from "@/types/trade";
import { formatCurrency, formatNumber, cn } from "@/lib/utils";
import {
    DollarSign,
    Percent,
    TrendingUp,
    Activity,
    Target,
    BarChart,
    Sparkles,
    Zap,
} from "lucide-react";

interface StatsCardsProps {
    stats: TradeStats | null;
    loading: boolean;
}

export function StatsCards({ stats, loading }: StatsCardsProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl bg-secondary animate-pulse" />
                            <div className="w-12 h-4 bg-secondary rounded animate-pulse" />
                        </div>
                        <div className="w-24 h-8 bg-secondary rounded animate-pulse mb-2" />
                        <div className="w-32 h-3 bg-secondary rounded animate-pulse" />
                    </Card>
                ))}
            </div>
        );
    }

    if (!stats || stats.totalTrades === 0) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total P&L", value: "$0.00", icon: DollarSign },
                    { label: "Win Rate", value: "0%", icon: Percent },
                    { label: "Total Trades", value: "0", icon: BarChart },
                    { label: "Avg R:R", value: "0.0", icon: Target },
                ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Card className="p-5 border-border hover:border-primary/30 transition-colors">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-2.5 bg-secondary rounded-xl">
                                        <Icon className="w-4.5 h-4.5 text-muted-foreground" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-muted-foreground font-mono">
                                    {item.value}
                                </h3>
                                <p className="text-xs text-muted-foreground mt-1 font-medium uppercase tracking-wider">
                                    {item.label}
                                </p>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>
        );
    }

    const cards = [
        {
            label: "Total P&L",
            value: formatCurrency(stats.totalPnL),
            icon: DollarSign,
            color:
                stats.totalPnL > 0
                    ? "text-emerald-500"
                    : stats.totalPnL < 0
                        ? "text-rose-500"
                        : "text-foreground",
            bg:
                stats.totalPnL > 0
                    ? "bg-emerald-500/10"
                    : stats.totalPnL < 0
                        ? "bg-rose-500/10"
                        : "bg-secondary",
            iconColor:
                stats.totalPnL > 0
                    ? "text-emerald-500"
                    : stats.totalPnL < 0
                        ? "text-rose-500"
                        : "text-muted-foreground",
            desc: `${stats.totalTrades} trades`,
            featured: true,
        },
        {
            label: "Win Rate",
            value: `${formatNumber(stats.winRate)}%`,
            icon: Percent,
            color: stats.winRate > 50 ? "text-emerald-500" : "text-rose-500",
            bg: stats.winRate > 50 ? "bg-emerald-500/10" : "bg-rose-500/10",
            iconColor: stats.winRate > 50 ? "text-emerald-500" : "text-rose-500",
            desc: `${stats.winningTrades}W / ${stats.losingTrades}L`,
        },
        {
            label: "Profit Factor",
            value: isFinite(stats.profitFactor)
                ? formatNumber(stats.profitFactor)
                : "∞",
            icon: TrendingUp,
            color:
                stats.profitFactor > 1.5
                    ? "text-emerald-500"
                    : stats.profitFactor > 1
                        ? "text-yellow-500"
                        : "text-rose-500",
            bg:
                stats.profitFactor > 1.5
                    ? "bg-emerald-500/10"
                    : stats.profitFactor > 1
                        ? "bg-yellow-500/10"
                        : "bg-rose-500/10",
            iconColor:
                stats.profitFactor > 1.5
                    ? "text-emerald-500"
                    : stats.profitFactor > 1
                        ? "text-yellow-500"
                        : "text-rose-500",
            desc: "Gross Profit / Gross Loss",
        },
        {
            label: "Avg R:R",
            value: formatNumber(stats.avgRiskReward),
            icon: Target,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            iconColor: "text-blue-500",
            desc: "Risk to Reward Ratio",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card, i) => {
                const Icon = card.icon;
                return (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                    >
                        <Card
                            className={cn(
                                "p-5 border-border hover:border-primary/30 transition-all group",
                                card.featured &&
                                "bg-gradient-to-br from-card to-secondary/20 shadow-lg shadow-black/5"
                            )}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div
                                    className={cn(
                                        "p-2.5 rounded-xl transition-transform group-hover:scale-110",
                                        card.bg
                                    )}
                                >
                                    <Icon className={cn("w-4.5 h-4.5", card.iconColor)} />
                                </div>
                                {card.desc && (
                                    <span className="text-xs font-medium text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-md">
                                        {card.desc}
                                    </span>
                                )}
                            </div>
                            <h3
                                className={cn(
                                    "text-2xl font-bold font-mono tracking-tight",
                                    card.color
                                )}
                            >
                                {card.value}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1 font-medium uppercase tracking-wider">
                                {card.label}
                            </p>
                        </Card>
                    </motion.div>
                );
            })}
        </div>
    );
}
