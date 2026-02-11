"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout, AuthGuard } from "@/components/layout";
import { useAccounts } from "@/hooks/useAccounts";
import { useAccountStore } from "@/store/useAccountStore";
import { useTrades } from "@/hooks/useTrades";
import {
    Plus,
    Trash2,
    Loader2,
    Target,
    TrendingUp,
    TrendingDown,
    Trophy,
    Palette,
} from "lucide-react";
import {
    Button,
    Card,
    Input,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    Badge,
} from "@/components/ui";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";

const presetColors = [
    "#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b",
    "#ef4444", "#ec4899", "#f97316", "#14b8a6", "#6366f1",
];

export default function StrategiesPage() {
    const { strategies, createStrategy, deleteStrategy } = useAccounts();
    const { trades } = useTrades();
    const {
        isAddStrategyModalOpen,
        openAddStrategyModal,
        closeAddStrategyModal,
    } = useAccountStore();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        name: "",
        description: "",
        color: "#3b82f6",
    });

    const handleCreate = async () => {
        if (!form.name.trim()) return;
        setIsSubmitting(true);
        try {
            await createStrategy(form);
            setForm({ name: "", description: "", color: "#3b82f6" });
            closeAddStrategyModal();
        } catch (err) {
            console.error("Failed to create strategy:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Delete this strategy?")) {
            await deleteStrategy(id);
        }
    };

    // Calculate live stats from trades
    const getStrategyLiveStats = (strategyName: string) => {
        const strategyTrades = trades.filter((t) => t.strategy === strategyName);
        const wins = strategyTrades.filter((t) => t.pnl > 0).length;
        const losses = strategyTrades.filter((t) => t.pnl < 0).length;
        const totalPnL = strategyTrades.reduce((sum, t) => sum + t.pnl, 0);
        const winRate = strategyTrades.length > 0 ? (wins / strategyTrades.length) * 100 : 0;
        return {
            totalTrades: strategyTrades.length,
            wins,
            losses,
            totalPnL,
            winRate,
        };
    };

    return (
        <AuthGuard>
            <DashboardLayout>
                <div className="space-y-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                Strategies
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Track performance by strategy to find your edge
                            </p>
                        </div>
                        <Button onClick={openAddStrategyModal}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Strategy
                        </Button>
                    </motion.div>

                    {/* Strategies Grid */}
                    {strategies.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center py-20 bg-card rounded-xl border border-border"
                        >
                            <Target className="w-16 h-16 text-muted-foreground/30 mb-4" />
                            <h3 className="text-xl font-semibold text-foreground mb-2">No Strategies Yet</h3>
                            <p className="text-muted-foreground text-center max-w-md mb-6">
                                Create custom strategies to track which approaches generate the most profit.
                            </p>
                            <Button onClick={openAddStrategyModal}>
                                <Plus className="w-4 h-4 mr-2" />
                                Create Strategy
                            </Button>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {strategies.map((strategy, i) => {
                                    const liveStats = getStrategyLiveStats(strategy.name);

                                    return (
                                        <motion.div
                                            key={strategy.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <Card className="p-0 overflow-hidden relative group hover:border-primary/30 transition-colors">
                                                {/* Color bar */}
                                                <div className="h-1" style={{ backgroundColor: strategy.color }} />

                                                <div className="p-5 space-y-4">
                                                    {/* Header */}
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                                                style={{ backgroundColor: strategy.color + "20" }}
                                                            >
                                                                <Target className="w-5 h-5" style={{ color: strategy.color }} />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-semibold text-foreground text-base">
                                                                    {strategy.name}
                                                                </h3>
                                                                {strategy.description && (
                                                                    <p className="text-xs text-muted-foreground line-clamp-1">
                                                                        {strategy.description}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                                                            onClick={() => handleDelete(strategy.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>

                                                    {/* Stats */}
                                                    <div className="grid grid-cols-3 gap-3">
                                                        <div className="text-center p-2 bg-secondary/30 rounded-lg">
                                                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Trades</p>
                                                            <p className="text-lg font-bold font-mono text-foreground">{liveStats.totalTrades}</p>
                                                        </div>
                                                        <div className="text-center p-2 bg-secondary/30 rounded-lg">
                                                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Win Rate</p>
                                                            <p className={cn("text-lg font-bold font-mono", liveStats.winRate >= 50 ? "text-emerald-400" : "text-rose-400")}>
                                                                {liveStats.winRate.toFixed(0)}%
                                                            </p>
                                                        </div>
                                                        <div className="text-center p-2 bg-secondary/30 rounded-lg">
                                                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">P&L</p>
                                                            <p className={cn("text-lg font-bold font-mono", liveStats.totalPnL >= 0 ? "text-emerald-400" : "text-rose-400")}>
                                                                {liveStats.totalPnL >= 0 ? "+" : ""}{formatCurrency(liveStats.totalPnL)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Win/Loss bar */}
                                                    {liveStats.totalTrades > 0 && (
                                                        <div>
                                                            <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                                                                <span className="flex items-center gap-1">
                                                                    <Trophy className="w-3 h-3 text-emerald-400" />
                                                                    {liveStats.wins} Wins
                                                                </span>
                                                                <span>{liveStats.losses} Losses</span>
                                                            </div>
                                                            <div className="h-2 bg-secondary rounded-full overflow-hidden flex">
                                                                <div
                                                                    className="bg-emerald-500 h-full rounded-l-full transition-all"
                                                                    style={{ width: `${liveStats.winRate}%` }}
                                                                />
                                                                <div
                                                                    className="bg-rose-500 h-full rounded-r-full transition-all"
                                                                    style={{ width: `${100 - liveStats.winRate}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Add Strategy Modal */}
                <Dialog open={isAddStrategyModalOpen} onOpenChange={closeAddStrategyModal}>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Add Custom Strategy</DialogTitle>
                            <DialogDescription>Define a strategy to track performance</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <Input
                                label="Strategy Name"
                                placeholder="e.g., Breakout, ICT Concept"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Description (optional)</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    rows={3}
                                    placeholder="Describe when and how you use this strategy..."
                                    className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <Palette className="w-4 h-4" />
                                    Color
                                </label>
                                <div className="flex gap-2 flex-wrap">
                                    {presetColors.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setForm({ ...form, color })}
                                            className={cn(
                                                "w-8 h-8 rounded-full transition-all border-2",
                                                form.color === color
                                                    ? "border-foreground scale-110 shadow-lg"
                                                    : "border-transparent hover:scale-105"
                                            )}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={closeAddStrategyModal}>Cancel</Button>
                            <Button onClick={handleCreate} disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Create Strategy
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </DashboardLayout>
        </AuthGuard>
    );
}
