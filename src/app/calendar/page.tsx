"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { DashboardLayout, AuthGuard } from "@/components/layout";
import { useTrades } from "@/hooks/useTrades";
import { Card, Button } from "@/components/ui";
import { formatCurrency, cn } from "@/lib/utils";
import {
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    format,
    addMonths,
    subMonths,
    isSameMonth,
    isSameDay,
    isToday
} from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, TrendingUp, TrendingDown } from "lucide-react";

export default function CalendarPage() {
    const { trades } = useTrades();
    const [currentDate, setCurrentDate] = useState(new Date());

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = useMemo(() => {
        return eachDayOfInterval({
            start: startDate,
            end: endDate,
        });
    }, [startDate, endDate]);

    const dailyPnL = useMemo(() => {
        const pnlMap: Record<string, { pnl: number; count: number; wins: number; losses: number }> = {};

        trades.forEach((trade) => {
            const dateKey = format(trade.exitDate, "yyyy-MM-dd");
            if (!pnlMap[dateKey]) {
                pnlMap[dateKey] = { pnl: 0, count: 0, wins: 0, losses: 0 };
            }
            pnlMap[dateKey].pnl += trade.pnl;
            pnlMap[dateKey].count += 1;
            if (trade.pnl > 0) pnlMap[dateKey].wins += 1;
            if (trade.pnl < 0) pnlMap[dateKey].losses += 1;
        });

        return pnlMap;
    }, [trades]);

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const goToToday = () => setCurrentDate(new Date());

    const monthStats = useMemo(() => {
        let totalPnL = 0;
        let totalTrades = 0;
        let winDays = 0;
        let lossDays = 0;

        const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

        daysInMonth.forEach((day) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const dayData = dailyPnL[dateKey];
            if (dayData) {
                totalPnL += dayData.pnl;
                totalTrades += dayData.count;
                if (dayData.pnl > 0) winDays++;
                if (dayData.pnl < 0) lossDays++;
            }
        });

        return { totalPnL, totalTrades, winDays, lossDays };
    }, [dailyPnL, monthStart, monthEnd]);

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <AuthGuard>
            <DashboardLayout>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                Trading Calendar
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Visualize your performance day by day
                            </p>
                        </div>

                        <div className="flex items-center gap-2 bg-card border border-border p-1 rounded-lg">
                            <Button variant="ghost" size="icon" onClick={prevMonth}>
                                <ChevronLeft className="w-5 h-5" />
                            </Button>
                            <span className="min-w-[140px] text-center font-medium text-lg">
                                {format(currentDate, "MMMM yyyy")}
                            </span>
                            <Button variant="ghost" size="icon" onClick={nextMonth}>
                                <ChevronRight className="w-5 h-5" />
                            </Button>
                            <div className="h-6 w-px bg-border mx-1" />
                            <Button variant="ghost" size="sm" onClick={goToToday} className="text-xs">
                                Today
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Month Stats Sidebar */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-1 space-y-4"
                        >
                            <Card className="p-6 bg-gradient-to-br from-card to-secondary/30 border-border">
                                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                                    {format(currentDate, "MMMM")} Summary
                                </h3>

                                <div className="space-y-6">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Net P&L</p>
                                        <p className={cn(
                                            "text-3xl font-bold font-mono",
                                            monthStats.totalPnL >= 0 ? "text-emerald-500" : "text-rose-500"
                                        )}>
                                            {formatCurrency(monthStats.totalPnL)}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                                            <div className="flex items-center gap-2 mb-1">
                                                <TrendingUp className="w-4 h-4 text-emerald-500" />
                                                <span className="text-xs font-semibold text-emerald-500">Win Days</span>
                                            </div>
                                            <p className="text-xl font-bold text-foreground">{monthStats.winDays}</p>
                                        </div>
                                        <div className="p-3 bg-rose-500/10 rounded-lg border border-rose-500/20">
                                            <div className="flex items-center gap-2 mb-1">
                                                <TrendingDown className="w-4 h-4 text-rose-500" />
                                                <span className="text-xs font-semibold text-rose-500">Loss Days</span>
                                            </div>
                                            <p className="text-xl font-bold text-foreground">{monthStats.lossDays}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Total Trades</p>
                                        <p className="text-xl font-semibold text-foreground">{monthStats.totalTrades}</p>
                                    </div>
                                </div>
                            </Card>

                            <div className="hidden lg:block p-4 border border-border rounded-xl bg-card/50">
                                <h4 className="text-xs font-semibold text-muted-foreground mb-3">Calendar Legend</h4>
                                <div className="space-y-2 text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-sm bg-emerald-500" />
                                        <span>Profitable Day</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-sm bg-rose-500" />
                                        <span>Loss Day</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-sm bg-secondary border border-border" />
                                        <span>No Trades</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Calendar Grid */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="lg:col-span-3 bg-card border border-border rounded-xl overflow-hidden shadow-sm"
                        >
                            {/* Weekday Headers */}
                            <div className="grid grid-cols-7 border-b border-border bg-secondary/30">
                                {weekDays.map((day) => (
                                    <div key={day} className="py-3 text-center text-sm font-semibold text-muted-foreground">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Days Grid */}
                            <div className="grid grid-cols-7 auto-rows-[120px]">
                                {calendarDays.map((day, dayIdx) => {
                                    const dateKey = format(day, "yyyy-MM-dd");
                                    const dayData = dailyPnL[dateKey];
                                    const isCurrentMonth = isSameMonth(day, monthStart);
                                    const isTodayDate = isToday(day);

                                    return (
                                        <div
                                            key={day.toString()}
                                            className={cn(
                                                "border-b border-r border-border p-2 relative group transition-colors hover:bg-secondary/50",
                                                !isCurrentMonth && "bg-secondary/10 dark:bg-secondary/5 text-muted-foreground/30",
                                                isTodayDate && "bg-primary/5 shadow-inner"
                                            )}
                                        >
                                            <div className={cn(
                                                "flex justify-between items-start",
                                                !isCurrentMonth && "opacity-30"
                                            )}>
                                                <span className={cn(
                                                    "text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full",
                                                    isTodayDate ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                                                )}>
                                                    {format(day, "d")}
                                                </span>
                                            </div>

                                            {dayData && (
                                                <div className="mt-2 text-right space-y-1">
                                                    <p className={cn(
                                                        "text-sm font-bold font-mono",
                                                        dayData.pnl >= 0 ? "text-emerald-500" : "text-rose-500"
                                                    )}>
                                                        {dayData.pnl >= 0 ? "+" : ""}{formatCurrency(dayData.pnl)}
                                                    </p>
                                                    <div className="flex justify-end gap-1">
                                                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary/80 text-muted-foreground">
                                                            {dayData.count}t
                                                        </span>
                                                    </div>

                                                    {/* Hover Details */}
                                                    <div className="absolute inset-0 bg-card/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-center p-1 z-10">
                                                        <p className="text-xs font-semibold mb-1 text-foreground">{format(day, "MMM d")}</p>
                                                        <div className="flex gap-2 text-xs">
                                                            <span className="text-emerald-500 font-bold">{dayData.wins}W</span>
                                                            <span className="text-rose-500 font-bold">{dayData.losses}L</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </DashboardLayout>
        </AuthGuard>
    );
}
