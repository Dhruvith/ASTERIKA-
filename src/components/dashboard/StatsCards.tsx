"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    TrendingUp,
    TrendingDown,
    Target,
    Activity,
    DollarSign,
    BarChart3,
    Zap,
    Award,
    ArrowUpRight,
    ArrowDownRight,
    Minus
} from "lucide-react";
import { Card, CardSkeleton, CardContainer, CardBody, CardItem } from "@/components/ui";
import { cn, formatCurrency, formatNumber } from "@/lib/utils";
import { TradeStats } from "@/types/trade";

interface StatsCardsProps {
    stats: TradeStats | null;
    loading?: boolean;
}

const statCards = [
    {
        key: "totalPnL",
        title: "Total P&L",
        icon: DollarSign,
        format: (stats: TradeStats) => formatCurrency(stats.totalPnL),
        trend: (stats: TradeStats) => stats.totalPnL,
        color: (stats: TradeStats) => stats.totalPnL >= 0 ? "success" : "danger",
    },
    {
        key: "winRate",
        title: "Win Rate",
        icon: Target,
        format: (stats: TradeStats) => `${formatNumber(stats.winRate, 1)}%`,
        trend: (stats: TradeStats) => stats.winRate - 50,
        color: (stats: TradeStats) => stats.winRate >= 50 ? "success" : "danger",
    },
    {
        key: "profitFactor",
        title: "Profit Factor",
        icon: Activity,
        format: (stats: TradeStats) => stats.profitFactor === Infinity ? "∞" : formatNumber(stats.profitFactor, 2),
        trend: (stats: TradeStats) => stats.profitFactor - 1,
        color: (stats: TradeStats) => stats.profitFactor >= 1 ? "success" : "danger",
    },
    {
        key: "sharpeRatio",
        title: "Sharpe Ratio",
        icon: BarChart3,
        format: (stats: TradeStats) => formatNumber(stats.sharpeRatio, 2),
        trend: (stats: TradeStats) => stats.sharpeRatio,
        color: (stats: TradeStats) => stats.sharpeRatio >= 0 ? "success" : "danger",
    },
    {
        key: "avgWin",
        title: "Avg Win",
        icon: TrendingUp,
        format: (stats: TradeStats) => formatCurrency(stats.avgWin),
        trend: () => 1,
        color: () => "success" as const,
    },
    {
        key: "avgLoss",
        title: "Avg Loss",
        icon: TrendingDown,
        format: (stats: TradeStats) => formatCurrency(stats.avgLoss),
        trend: () => -1,
        color: () => "danger" as const,
    },
    {
        key: "totalTrades",
        title: "Total Trades",
        icon: Zap,
        format: (stats: TradeStats) => stats.totalTrades.toString(),
        trend: () => 0,
        color: () => "primary" as const,
    },
    {
        key: "expectancy",
        title: "Expectancy",
        icon: Award,
        format: (stats: TradeStats) => formatCurrency(stats.expectancy),
        trend: (stats: TradeStats) => stats.expectancy,
        color: (stats: TradeStats) => stats.expectancy >= 0 ? "success" : "danger",
    },
];

function getTrendIcon(value: number) {
    if (value > 0) return ArrowUpRight;
    if (value < 0) return ArrowDownRight;
    return Minus;
}

export function StatsCards({ stats, loading }: StatsCardsProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                    <CardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card) => (
                    <Card key={card.key} variant="default" className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <span className="text-sm font-medium text-muted-foreground">
                                {card.title}
                            </span>
                            <div className="p-2 rounded-md bg-secondary text-muted-foreground">
                                <card.icon className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold font-mono text-foreground">
                            --
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">No data yet</p>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((card, index) => {
                const Icon = card.icon;
                const color = card.color(stats);
                const trend = card.trend(stats);
                const TrendIcon = getTrendIcon(trend);

                // Only use 3D card for Total PnL to make it pop, others use standard animated cards
                if (card.key === "totalPnL") {
                    return (
                        <div key={card.key} className="h-full">
                            <CardContainer className="inter-var w-full h-full" containerClassName="py-0">
                                <CardBody className="bg-card relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-card dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl p-6 border transition-all duration-300">
                                    <div className="flex items-start justify-between mb-4">
                                        <CardItem translateZ="50" className="text-sm font-medium text-muted-foreground">
                                            {card.title}
                                        </CardItem>
                                        <CardItem translateZ="60" className={cn(
                                            "p-2 rounded-md transition-colors",
                                            color === "success" && "bg-emerald-500/10 text-emerald-500",
                                            color === "danger" && "bg-rose-500/10 text-rose-500",
                                            color === "primary" && "bg-blue-500/10 text-blue-500"
                                        )}>
                                            <Icon className="w-4 h-4" />
                                        </CardItem>
                                    </div>
                                    <CardItem translateZ="80" className="text-3xl font-bold font-mono tracking-tight text-foreground mb-1">
                                        {card.format(stats)}
                                    </CardItem>
                                    <CardItem translateZ="40" className={cn(
                                        "flex items-center gap-1 text-xs font-medium",
                                        trend > 0 ? "text-emerald-500" : trend < 0 ? "text-rose-500" : "text-muted-foreground"
                                    )}>
                                        <TrendIcon className="w-3 h-3" />
                                        <span>
                                            {trend > 0 ? "Positive" : trend < 0 ? "Negative" : "Neutral"}
                                        </span>
                                    </CardItem>
                                </CardBody>
                            </CardContainer>
                        </div>
                    );
                }

                return (
                    <motion.div
                        key={card.key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                        <Card
                            className="p-6 hover:shadow-lg transition-all border-border/60 hover:border-primary/50 group h-full"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                    {card.title}
                                </span>
                                <div className={cn(
                                    "p-2 rounded-md transition-colors",
                                    color === "success" && "bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500/20",
                                    color === "danger" && "bg-rose-500/10 text-rose-500 group-hover:bg-rose-500/20",
                                    color === "primary" && "bg-blue-500/10 text-blue-500 group-hover:bg-blue-500/20"
                                )}>
                                    <Icon className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-2xl font-bold font-mono tracking-tight text-foreground">
                                    {card.format(stats)}
                                </p>
                                {card.key !== "totalTrades" && (
                                    <div className={cn(
                                        "flex items-center gap-1 text-xs font-medium",
                                        trend > 0 ? "text-emerald-500" : trend < 0 ? "text-rose-500" : "text-muted-foreground"
                                    )}>
                                        <TrendIcon className="w-3 h-3" />
                                        <span>
                                            {trend > 0 ? "Positive" : trend < 0 ? "Negative" : "Neutral"}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </motion.div>
                );
            })}
        </div>
    );
}
