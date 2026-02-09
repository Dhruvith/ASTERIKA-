"use client";

import React, { useMemo } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { Card } from "@/components/ui";
import { Trade, EquityPoint } from "@/types/trade";
import { formatCurrency } from "@/lib/utils";

interface EquityCurveProps {
    trades: Trade[];
    startingCapital?: number;
}

export function EquityCurve({ trades, startingCapital = 10000 }: EquityCurveProps) {
    const data = useMemo<EquityPoint[]>(() => {
        if (trades.length === 0) return [];

        const sortedTrades = [...trades].sort(
            (a, b) => new Date(a.exitDate).getTime() - new Date(b.exitDate).getTime()
        );

        let runningTotal = startingCapital;
        const points: EquityPoint[] = [
            {
                date: format(new Date(sortedTrades[0].exitDate), "MMM d"),
                value: startingCapital,
                pnl: 0,
            },
        ];

        for (const trade of sortedTrades) {
            runningTotal += trade.pnl;
            points.push({
                date: format(new Date(trade.exitDate), "MMM d"),
                value: runningTotal,
                pnl: trade.pnl,
            });
        }

        return points;
    }, [trades, startingCapital]);

    const isPositive = data.length > 1 && data[data.length - 1].value >= startingCapital;

    // Define colors relative to the theme (Success/Destructive)
    const successColor = "#10b981"; // Emerald-500
    const failureColor = "#e11d48"; // Rose-600
    const gridColor = "#334155"; // Slate-700
    const tooltipBg = "#0f172a"; // Slate-900

    if (trades.length === 0) {
        return (
            <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-semibold text-foreground">
                            Equity Curve
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Portfolio value over time
                        </p>
                    </div>
                </div>
                <div className="h-[320px] flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                            </svg>
                        </div>
                        <p className="text-foreground font-medium">No trades yet</p>
                        <p className="text-sm text-muted-foreground">
                            Add your first trade to see your equity curve
                        </p>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-foreground">
                        Equity Curve
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Portfolio value over time
                    </p>
                </div>
                <div className="text-right">
                    <p className={`text-2xl font-bold font-mono ${isPositive ? "text-emerald-500" : "text-rose-500"}`}>
                        {formatCurrency(data[data.length - 1]?.value || startingCapital)}
                    </p>
                    <p className={`text-sm font-medium ${isPositive ? "text-emerald-500" : "text-rose-500"}`}>
                        {isPositive ? "+" : ""}
                        {formatCurrency((data[data.length - 1]?.value || startingCapital) - startingCapital)}
                    </p>
                </div>
            </div>
            <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={successColor} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={successColor} stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={failureColor} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={failureColor} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={gridColor}
                            opacity={0.1} // reduced opacity for cleaner look
                            vertical={false}
                        />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: "#94a3b8" }} // start-400 equivalent
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: "#94a3b8", fontFamily: "JetBrains Mono, monospace" }}
                            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                            width={60}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: tooltipBg,
                                border: "1px solid #334155", // slate-700
                                borderRadius: "8px",
                                padding: "8px 12px",
                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                            }}
                            labelStyle={{ color: "#f8fafc", fontWeight: 600, marginBottom: 4 }}
                            itemStyle={{ color: "#f8fafc", fontFamily: "JetBrains Mono, monospace" }}
                            formatter={(value: number | undefined) => [formatCurrency(value ?? 0), "Portfolio"]}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={isPositive ? successColor : failureColor}
                            strokeWidth={2}
                            fill={isPositive ? "url(#colorPositive)" : "url(#colorNegative)"}
                            animationDuration={1500}
                            animationEasing="ease-out"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
