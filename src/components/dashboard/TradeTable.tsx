"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Plus,
    Pencil,
    Trash2,
    ArrowUpDown,
    TrendingUp,
    TrendingDown
} from "lucide-react";
import { Card, Button, Input, Badge, TableRowSkeleton } from "@/components/ui";
import { Trade } from "@/types/trade";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { useTradeStore } from "@/store/useTradeStore";

interface TradeTableProps {
    trades: Trade[];
    loading?: boolean;
    onEdit?: (trade: Trade) => void;
    onDelete?: (tradeId: string) => void;
}

type SortField = "exitDate" | "symbol" | "pnl" | "strategy";
type SortDirection = "asc" | "desc";

export function TradeTable({ trades, loading, onEdit, onDelete }: TradeTableProps) {
    const { openAddModal, searchQuery, setSearchQuery } = useTradeStore();
    const [sortField, setSortField] = useState<SortField>("exitDate");
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

    const filteredAndSortedTrades = useMemo(() => {
        let result = [...trades];

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (trade) =>
                    trade.symbol.toLowerCase().includes(query) ||
                    trade.strategy.toLowerCase().includes(query) ||
                    trade.notes.toLowerCase().includes(query)
            );
        }

        // Sort
        result.sort((a, b) => {
            let comparison = 0;
            switch (sortField) {
                case "exitDate":
                    comparison = new Date(a.exitDate).getTime() - new Date(b.exitDate).getTime();
                    break;
                case "symbol":
                    comparison = a.symbol.localeCompare(b.symbol);
                    break;
                case "pnl":
                    comparison = a.pnl - b.pnl;
                    break;
                case "strategy":
                    comparison = a.strategy.localeCompare(b.strategy);
                    break;
            }
            return sortDirection === "asc" ? comparison : -comparison;
        });

        return result;
    }, [trades, searchQuery, sortField, sortDirection]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("desc");
        }
    };

    if (loading) {
        return (
            <Card className="overflow-hidden">
                <div className="p-6 border-b border-border">
                    <h3 className="text-lg font-semibold text-foreground">Recent Trades</h3>
                    <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
                <div>
                    {[...Array(5)].map((_, i) => (
                        <TableRowSkeleton key={i} />
                    ))}
                </div>
            </Card>
        );
    }

    return (
        <Card className="overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-border flex flex-col md:flex-row gap-4 items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-foreground">Recent Trades</h3>
                    <p className="text-sm text-muted-foreground">
                        {filteredAndSortedTrades.length} of {trades.length} trades
                    </p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search trades..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-10 w-full rounded-md border border-input bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <Button onClick={openAddModal} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                    </Button>
                </div>
            </div>

            {/* Table */}
            {filteredAndSortedTrades.length === 0 ? (
                <div className="py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
                        <TrendingUp className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-foreground font-medium mb-1">
                        {searchQuery ? "No trades found" : "No trades yet"}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                        {searchQuery ? "Try adjusting your search" : "Start by adding your first trade"}
                    </p>
                    {!searchQuery && (
                        <Button onClick={openAddModal}>Add Trade</Button>
                    )}
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-secondary/50">
                            <tr className="border-b border-border">
                                {["Symbol", "Side", "Entry", "Exit", "P&L", "Date", "Strategy", "Actions"].map((header) => (
                                    <th key={header} className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        {header !== "Actions" && header !== "Entry" && header !== "Exit" && header !== "Side" ? (
                                            <button
                                                onClick={() => {
                                                    const field = header.toLowerCase();
                                                    if (field === "date") handleSort("exitDate");
                                                    else if (field === "p&l") handleSort("pnl");
                                                    else handleSort(field as SortField);
                                                }}
                                                className="flex items-center gap-1 hover:text-foreground"
                                            >
                                                {header}
                                                <ArrowUpDown className="w-3 h-3" />
                                            </button>
                                        ) : (
                                            header
                                        )}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            <AnimatePresence>
                                {filteredAndSortedTrades.map((trade, index) => (
                                    <motion.tr
                                        key={trade.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ delay: index * 0.02 }}
                                        className="group hover:bg-secondary/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-md flex items-center justify-center font-bold text-sm border border-transparent",
                                                    trade.pnl >= 0
                                                        ? "bg-emerald-500/10 text-emerald-500"
                                                        : "bg-rose-500/10 text-rose-500"
                                                )}>
                                                    {trade.symbol.substring(0, 2)}
                                                </div>
                                                <span className="font-semibold text-foreground">{trade.symbol}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={trade.side === "long" ? "success" : "danger"} size="sm">
                                                {trade.side.toUpperCase()}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-sm text-muted-foreground">
                                            {formatCurrency(trade.entryPrice)}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-sm text-muted-foreground">
                                            {formatCurrency(trade.exitPrice)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "font-mono text-sm font-bold",
                                                trade.pnl >= 0 ? "text-emerald-500" : "text-rose-500"
                                            )}>
                                                {trade.pnl >= 0 ? "+" : ""}{formatCurrency(trade.pnl)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">
                                            {formatDate(trade.exitDate)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="outline" size="sm">{trade.strategy}</Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => onEdit?.(trade)} className="p-2 hover:bg-secondary rounded-md text-muted-foreground hover:text-foreground">
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => onDelete?.(trade.id)} className="p-2 hover:bg-destructive/10 rounded-md text-muted-foreground hover:text-destructive">
                                                    <Trash2 className="w-4 h-4" />
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
