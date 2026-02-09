"use client";

import React, { useMemo } from "react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from "recharts";
import { Card } from "@/components/ui";
import { TradeStats } from "@/types/trade";

interface WinLossChartProps {
    stats: TradeStats | null;
}

// Pro Terminal Colors
const COLORS = {
    win: "#10b981", // emerald-500
    loss: "#e11d48", // rose-600
    breakeven: "#3b82f6", // blue-500
};

export function WinLossChart({ stats }: WinLossChartProps) {
    const data = useMemo(() => {
        if (!stats) return [];

        const breakeven = stats.totalTrades - stats.winningTrades - stats.losingTrades;

        return [
            { name: "Winning", value: stats.winningTrades, color: COLORS.win },
            { name: "Losing", value: stats.losingTrades, color: COLORS.loss },
            ...(breakeven > 0 ? [{ name: "Breakeven", value: breakeven, color: COLORS.breakeven }] : []),
        ].filter(item => item.value > 0);
    }, [stats]);

    if (!stats || stats.totalTrades === 0) {
        return (
            <Card className="p-6">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-foreground">
                        Win/Loss Distribution
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Trade outcome breakdown
                    </p>
                </div>
                <div className="h-[280px] flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                            </svg>
                        </div>
                        <p className="text-foreground font-medium">No data available</p>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-6">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                    Win/Loss Distribution
                </h3>
                <p className="text-sm text-muted-foreground">
                    Trade outcome breakdown
                </p>
            </div>
            <div className="h-[280px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={3}
                            dataKey="value"
                            animationDuration={1000}
                            animationEasing="ease-out"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#0f172a", // slate-900
                                border: "1px solid #334155", // slate-700
                                borderRadius: "8px",
                                padding: "8px 12px",
                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            }}
                            labelStyle={{ color: "#f8fafc", fontWeight: 600 }}
                            itemStyle={{ color: "#f8fafc" }}
                            formatter={(value: number | undefined) => [`${value ?? 0} trades`, ""]}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            formatter={(value) => (
                                <span className="text-sm font-medium text-foreground ml-2">
                                    {value}
                                </span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-8 mt-2">
                <div className="text-center">
                    <p className="text-2xl font-bold font-mono text-emerald-500">
                        {stats.winningTrades}
                    </p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Wins</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold font-mono text-rose-500">
                        {stats.losingTrades}
                    </p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Losses</p>
                </div>
            </div>
        </Card>
    );
}
