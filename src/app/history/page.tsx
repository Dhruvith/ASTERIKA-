"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { DashboardLayout, AuthGuard } from "@/components/layout";
import { useAccounts } from "@/hooks/useAccounts";
import { useTrades } from "@/hooks/useTrades";
import {
    ArrowUpCircle,
    ArrowDownCircle,
    TrendingUp,
    TrendingDown,
    Filter,
    History as HistoryIcon,
    DollarSign,
    Calendar,
    Search,
} from "lucide-react";
import {
    Button,
    Card,
    Input,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Badge,
} from "@/components/ui";
import { cn, formatCurrency, formatDate, formatDateTime } from "@/lib/utils";

type FilterType = "all" | "trade" | "deposit" | "withdrawal";

export default function HistoryPage() {
    const { accounts, transactions } = useAccounts();
    const { trades } = useTrades();

    const [filterType, setFilterType] = useState<FilterType>("all");
    const [filterAccount, setFilterAccount] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Combine trades and transactions into a unified history
    const historyItems = useMemo(() => {
        const items: {
            id: string;
            type: "trade" | "deposit" | "withdrawal";
            accountId: string;
            accountName: string;
            amount: number;
            description: string;
            date: Date;
            metadata?: Record<string, unknown>;
        }[] = [];

        // Add trades
        trades.forEach((trade) => {
            const acc = accounts.find((a) => a.id === trade.accountId);
            items.push({
                id: `trade-${trade.id}`,
                type: "trade",
                accountId: trade.accountId,
                accountName: acc?.name || "—",
                amount: trade.pnl,
                description: `${trade.side.toUpperCase()} ${trade.symbol} — ${trade.strategy}`,
                date: trade.exitDate,
                metadata: {
                    side: trade.side,
                    symbol: trade.symbol,
                    entryPrice: trade.entryPrice,
                    exitPrice: trade.exitPrice,
                    quantity: trade.quantity,
                },
            });
        });

        // Add transactions
        transactions.forEach((tx) => {
            const acc = accounts.find((a) => a.id === tx.accountId);
            items.push({
                id: `tx-${tx.id}`,
                type: tx.type,
                accountId: tx.accountId,
                accountName: acc?.name || "—",
                amount: tx.type === "deposit" ? tx.amount : -tx.amount,
                description: tx.note || (tx.type === "deposit" ? "Deposit" : "Withdrawal"),
                date: tx.createdAt,
            });
        });

        // Sort by date descending
        items.sort((a, b) => b.date.getTime() - a.date.getTime());

        return items;
    }, [trades, transactions, accounts]);

    // Filtered items
    const filteredItems = useMemo(() => {
        let items = historyItems;

        if (filterType !== "all") {
            items = items.filter((item) => item.type === filterType);
        }

        if (filterAccount !== "all") {
            items = items.filter((item) => item.accountId === filterAccount);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            items = items.filter(
                (item) =>
                    item.description.toLowerCase().includes(q) ||
                    item.accountName.toLowerCase().includes(q)
            );
        }

        return items;
    }, [historyItems, filterType, filterAccount, searchQuery]);

    // Summary stats
    const totalDeposits = historyItems
        .filter((i) => i.type === "deposit")
        .reduce((sum, i) => sum + i.amount, 0);
    const totalWithdrawals = Math.abs(
        historyItems
            .filter((i) => i.type === "withdrawal")
            .reduce((sum, i) => sum + i.amount, 0)
    );
    const totalTradePnL = historyItems
        .filter((i) => i.type === "trade")
        .reduce((sum, i) => sum + i.amount, 0);

    const getItemIcon = (type: string, amount: number) => {
        switch (type) {
            case "trade":
                return amount >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                ) : (
                    <TrendingDown className="w-4 h-4 text-rose-400" />
                );
            case "deposit":
                return <ArrowDownCircle className="w-4 h-4 text-emerald-400" />;
            case "withdrawal":
                return <ArrowUpCircle className="w-4 h-4 text-rose-400" />;
            default:
                return <DollarSign className="w-4 h-4 text-muted-foreground" />;
        }
    };

    const getItemBg = (type: string, amount: number) => {
        if (type === "trade") return amount >= 0 ? "bg-emerald-500/10" : "bg-rose-500/10";
        if (type === "deposit") return "bg-emerald-500/10";
        return "bg-rose-500/10";
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
                                Transaction History
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Complete history of trades, deposits, and withdrawals
                            </p>
                        </div>
                    </motion.div>

                    {/* Summary Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                    >
                        <Card className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/10 rounded-lg">
                                    <ArrowDownCircle className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Deposits</p>
                                    <p className="text-lg font-bold font-mono text-emerald-400">
                                        +{formatCurrency(totalDeposits)}
                                    </p>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-rose-500/10 rounded-lg">
                                    <ArrowUpCircle className="w-5 h-5 text-rose-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Withdrawals</p>
                                    <p className="text-lg font-bold font-mono text-rose-400">
                                        -{formatCurrency(totalWithdrawals)}
                                    </p>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-4">
                            <div className="flex items-center gap-3">
                                <div className={cn("p-2 rounded-lg", totalTradePnL >= 0 ? "bg-emerald-500/10" : "bg-rose-500/10")}>
                                    <TrendingUp className={cn("w-5 h-5", totalTradePnL >= 0 ? "text-emerald-400" : "text-rose-400")} />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Trade P&L</p>
                                    <p className={cn("text-lg font-bold font-mono", totalTradePnL >= 0 ? "text-emerald-400" : "text-rose-400")}>
                                        {totalTradePnL >= 0 ? "+" : ""}{formatCurrency(totalTradePnL)}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Filters */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="flex flex-col sm:flex-row gap-3"
                    >
                        <div className="relative flex-1">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search transactions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-9 pl-9 pr-3 rounded-md border border-input bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                            />
                        </div>
                        <Select value={filterType} onValueChange={(v) => setFilterType(v as FilterType)}>
                            <SelectTrigger className="w-44">
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="trade">Trades</SelectItem>
                                <SelectItem value="deposit">Deposits</SelectItem>
                                <SelectItem value="withdrawal">Withdrawals</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={filterAccount} onValueChange={setFilterAccount}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Account" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Accounts</SelectItem>
                                {accounts.map((a) => (
                                    <SelectItem key={a.id} value={a.id}>
                                        {a.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </motion.div>

                    {/* History List */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="overflow-hidden">
                            {filteredItems.length === 0 ? (
                                <div className="p-16 flex flex-col items-center justify-center text-center">
                                    <HistoryIcon className="w-12 h-12 text-muted-foreground/30 mb-4" />
                                    <p className="text-muted-foreground">No transactions found</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-border">
                                    {filteredItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between px-5 py-3.5 hover:bg-secondary/20 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={cn("w-9 h-9 rounded-full flex items-center justify-center", getItemBg(item.type, item.amount))}>
                                                    {getItemIcon(item.type, item.amount)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">
                                                        {item.description}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <span className={cn(
                                                            "text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider",
                                                            item.type === "trade"
                                                                ? "bg-primary/10 text-primary"
                                                                : item.type === "deposit"
                                                                    ? "bg-emerald-500/10 text-emerald-400"
                                                                    : "bg-rose-500/10 text-rose-400"
                                                        )}>
                                                            {item.type}
                                                        </span>
                                                        <span>•</span>
                                                        <span>{item.accountName}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={cn(
                                                    "text-sm font-semibold font-mono",
                                                    item.amount >= 0 ? "text-emerald-400" : "text-rose-400"
                                                )}>
                                                    {item.amount >= 0 ? "+" : ""}{formatCurrency(Math.abs(item.amount))}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground">
                                                    {formatDateTime(item.date)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </motion.div>
                </div>
            </DashboardLayout>
        </AuthGuard>
    );
}
