"use client";

import React, { useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { format, parseISO } from "date-fns";
import { Card } from "@/components/ui";
import { Trade } from "@/types/trade";
import { formatCurrency } from "@/lib/utils";

interface PnLByDayProps {
    trades: Trade[];
}

interface DailyPnL {
    date: string;
    pnl: number;
    trades: number;
}

export function PnLByDay({ trades }: PnLByDayProps) {
    const data = useMemo<DailyPnL[]>(() => {
        if (trades.length === 0) return [];

        const dailyMap = new Map<string, { pnl: number; trades: number }>();

        for (const trade of trades) {
            const dateKey = format(new Date(trade.exitDate), "yyyy-MM-dd");
            const existing = dailyMap.get(dateKey) || { pnl: 0, trades: 0 };
            dailyMap.set(dateKey, {
                pnl: existing.pnl + trade.pnl,
                trades: existing.trades + 1,
            });
        }

        const sortedEntries = Array.from(dailyMap.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .slice(-30); // Last 30 days

        return sortedEntries.map(([date, data]) => ({
            date: format(parseISO(date), "MMM d"),
            pnl: data.pnl,
            trades: data.trades,
        }));
    }, [trades]);

    // Theme colors
    const successColor = "#10b981"; // Emerald-500
    const failureColor = "#e11d48"; // Rose-600

    if (trades.length === 0) {
        return (
            <Card className="p-6">
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-foreground">
                        Daily P&L
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Profit/Loss by day (last 30 days)
                    </p>
                </div>
                <div className="h-[280px] flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground">
                    Daily P&L
                </h3>
                <p className="text-sm text-muted-foreground">
                    Profit/Loss by day (last 30 days)
                </p>
            </div>
            <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#334155"
                            vertical={false}
                            className="opacity-20"
                        />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: "#94a3b8" }}
                            dy={10}
                            interval="preserveStartEnd"
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: "#94a3b8", fontFamily: "JetBrains Mono, monospace" }}
                            tickFormatter={(value) => `$${value >= 1000 || value <= -1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
                            width={55}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#0f172a", // slate-900
                                border: "1px solid #334155", // slate-700
                                borderRadius: "8px",
                                padding: "8px 12px",
                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            }}
                            labelStyle={{ color: "#f8fafc", fontWeight: 600, marginBottom: 8 }}
                            formatter={(value: number | undefined) => [
                                `${formatCurrency(value ?? 0)}`,
                                "P&L",
                            ]}
                            itemStyle={{ color: "#f8fafc" }}
                        />
                        <Bar
                            dataKey="pnl"
                            radius={[4, 4, 0, 0]}
                            animationDuration={1000}
                            animationEasing="ease-out"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.pnl >= 0 ? successColor : failureColor}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
