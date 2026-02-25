"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trade } from "@/types/trade";
import { cn, formatCurrency, formatPercent, formatDate, formatNumber } from "@/lib/utils";
import {
    Search,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    ChevronRight,
    Pencil,
    Trash2,
    MoreHorizontal,
    TrendingUp,
    TrendingDown,
    Minus,
    BarChart2,
} from "lucide-react";
import { Card, Badge, Button } from "@/components/ui";

interface TradeTableProps {
    trades: Trade[];
    loading: boolean;
    onEdit: (trade: Trade) => void;
    onDelete: (id: string) => void;
}

type SortField = "exitDate" | "symbol" | "pnl" | "pnlPercent" | "side" | "riskReward";
type SortDirection = "asc" | "desc";

export function TradeTable({ trades, loading, onEdit, onDelete }: TradeTableProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortField, setSortField] = useState<SortField>("exitDate");
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortField(field);
            setSortDirection("desc");
        }
    };

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) return <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground/50" />;
        return sortDirection === "asc" ? (
            <ArrowUp className="w-3.5 h-3.5 text-primary" />
        ) : (
            <ArrowDown className="w-3.5 h-3.5 text-primary" />
        );
    };

    const filteredAndSortedTrades = useMemo(() => {
        let filtered = trades;

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = trades.filter(
                (t) =>
                    t.symbol.toLowerCase().includes(query) ||
                    t.strategy?.toLowerCase().includes(query) ||
                    t.side.toLowerCase().includes(query) ||
                    t.tags?.some((tag) => tag.toLowerCase().includes(query))
            );
        }

        return [...filtered].sort((a, b) => {
            let comparison = 0;
            switch (sortField) {
                case "exitDate":
                    comparison =
                        new Date(a.exitDate).getTime() - new Date(b.exitDate).getTime();
                    break;
                case "symbol":
                    comparison = a.symbol.localeCompare(b.symbol);
                    break;
                case "pnl":
                    comparison = a.pnl - b.pnl;
                    break;
                case "pnlPercent":
                    comparison = (a.pnlPercent || 0) - (b.pnlPercent || 0);
                    break;
                case "side":
                    comparison = a.side.localeCompare(b.side);
                    break;
                case "riskReward":
                    comparison = (a.riskReward || 0) - (b.riskReward || 0);
                    break;
            }

            return sortDirection === "asc" ? comparison : -comparison;
        });
    }, [trades, searchQuery, sortField, sortDirection]);

    if (loading) {
        return (
            <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-semibold text-foreground">Recent Trades</h3>
                        <p className="text-sm text-muted-foreground">Loading your trades...</p>
                    </div>
                </div>
                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-12 bg-secondary/50 rounded-lg animate-pulse" />
                    ))}
                </div>
            </Card>
        );
    }

    return (
        <Card className="overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <BarChart2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-foreground">Recent Trades</h3>
                        <p className="text-sm text-muted-foreground">
                            {trades.length} total trade{trades.length !== 1 ? "s" : ""}{" "}
                            {searchQuery && `• ${filteredAndSortedTrades.length} matching`}
                        </p>
                    </div>
                </div>
                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search trades..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-2 w-full sm:w-[260px] bg-secondary/50 border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                    />
                </div>
            </div>

            {/* Table */}
            {filteredAndSortedTrades.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6">
                    <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
                        <Search className="w-7 h-7 text-muted-foreground/40" />
                    </div>
                    <p className="text-foreground font-semibold text-base">
                        {searchQuery ? "No trades found" : "No trades yet"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1 text-center max-w-md">
                        {searchQuery
                            ? `No trades match "${searchQuery}". Try a different search term.`
                            : "Add your first trade to start tracking your performance."}
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                        <thead>
                            <tr className="border-b border-border bg-secondary/30">
                                <th className="px-4 py-3 text-left">
                                    <button
                                        onClick={() => handleSort("exitDate")}
                                        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Date <SortIcon field="exitDate" />
                                    </button>
                                </th>
                                <th className="px-4 py-3 text-left">
                                    <button
                                        onClick={() => handleSort("symbol")}
                                        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Symbol <SortIcon field="symbol" />
                                    </button>
                                </th>
                                <th className="px-4 py-3 text-left">
                                    <button
                                        onClick={() => handleSort("side")}
                                        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Side <SortIcon field="side" />
                                    </button>
                                </th>
                                <th className="px-4 py-3 text-right">
                                    <button
                                        onClick={() => handleSort("pnl")}
                                        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors ml-auto"
                                    >
                                        P&L <SortIcon field="pnl" />
                                    </button>
                                </th>
                                <th className="px-4 py-3 text-right">
                                    <button
                                        onClick={() => handleSort("pnlPercent")}
                                        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors ml-auto"
                                    >
                                        P&L % <SortIcon field="pnlPercent" />
                                    </button>
                                </th>
                                <th className="px-4 py-3 text-right">
                                    <button
                                        onClick={() => handleSort("riskReward")}
                                        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors ml-auto"
                                    >
                                        R:R <SortIcon field="riskReward" />
                                    </button>
                                </th>
                                <th className="px-4 py-3 text-right">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Actions
                                    </span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {filteredAndSortedTrades.map((trade, i) => (
                                    <motion.tr
                                        key={trade.id}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ delay: Math.min(i * 0.02, 0.3) }}
                                        className={cn(
                                            "border-b border-border/50 hover:bg-secondary/30 transition-colors cursor-pointer group",
                                            expandedRow === trade.id && "bg-secondary/20"
                                        )}
                                        onClick={() =>
                                            setExpandedRow((prev) =>
                                                prev === trade.id ? null : trade.id
                                            )
                                        }
                                    >
                                        {/* Date */}
                                        <td className="px-4 py-3.5">
                                            <span className="text-sm text-foreground font-medium">
                                                {formatDate(trade.exitDate)}
                                            </span>
                                        </td>

                                        {/* Symbol */}
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-foreground">
                                                    {trade.symbol}
                                                </span>
                                                {trade.strategy && (
                                                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-secondary text-muted-foreground font-medium">
                                                        {trade.strategy}
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Side Badge */}
                                        <td className="px-4 py-3.5">
                                            <span
                                                className={cn(
                                                    "inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider",
                                                    trade.side === "long"
                                                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                                        : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                                                )}
                                            >
                                                {trade.side === "long" ? (
                                                    <TrendingUp className="w-3 h-3" />
                                                ) : (
                                                    <TrendingDown className="w-3 h-3" />
                                                )}
                                                {trade.side}
                                            </span>
                                        </td>

                                        {/* P&L */}
                                        <td className="px-4 py-3.5 text-right">
                                            <span
                                                className={cn(
                                                    "text-sm font-bold font-mono",
                                                    trade.pnl > 0
                                                        ? "text-emerald-500"
                                                        : trade.pnl < 0
                                                            ? "text-rose-500"
                                                            : "text-muted-foreground"
                                                )}
                                            >
                                                {trade.pnl > 0 ? "+" : ""}
                                                {formatCurrency(trade.pnl)}
                                            </span>
                                        </td>

                                        {/* P&L % */}
                                        <td className="px-4 py-3.5 text-right">
                                            <span
                                                className={cn(
                                                    "text-xs font-semibold font-mono px-2 py-0.5 rounded-md",
                                                    trade.pnlPercent > 0
                                                        ? "text-emerald-500 bg-emerald-500/10"
                                                        : trade.pnlPercent < 0
                                                            ? "text-rose-500 bg-rose-500/10"
                                                            : "text-muted-foreground bg-secondary"
                                                )}
                                            >
                                                {trade.pnlPercent > 0 ? "+" : ""}
                                                {isFinite(trade.pnlPercent)
                                                    ? formatNumber(trade.pnlPercent, 2)
                                                    : "0.00"}
                                                %
                                            </span>
                                        </td>

                                        {/* R:R */}
                                        <td className="px-4 py-3.5 text-right">
                                            <span className="text-sm font-mono text-muted-foreground">
                                                {trade.riskReward > 0
                                                    ? `${formatNumber(trade.riskReward, 1)}R`
                                                    : "—"}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-3.5 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onEdit(trade);
                                                    }}
                                                    className="p-1.5 rounded-md hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                                                    title="Edit trade"
                                                >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDelete(trade.id);
                                                    }}
                                                    className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                                                    title="Delete trade"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            )}
        </Card>
    );
}
