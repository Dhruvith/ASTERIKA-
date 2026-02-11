"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout, AuthGuard } from "@/components/layout";
import { useAccounts } from "@/hooks/useAccounts";
import { useAccountStore } from "@/store/useAccountStore";
import {
    Plus,
    Star,
    StarOff,
    Trash2,
    ArrowUpCircle,
    ArrowDownCircle,
    Loader2,
    Wallet,
    DollarSign,
    TrendingUp,
    Shield,
    Zap,
    MoreHorizontal,
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Badge,
} from "@/components/ui";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { AccountType } from "@/types/account";

const accountTypeConfig: Record<AccountType, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
    live: {
        label: "LIVE",
        color: "text-emerald-400",
        bg: "bg-emerald-500/10 border-emerald-500/30",
        icon: <TrendingUp className="w-4 h-4" />,
    },
    funded: {
        label: "FUNDED",
        color: "text-amber-400",
        bg: "bg-amber-500/10 border-amber-500/30",
        icon: <Shield className="w-4 h-4" />,
    },
    demo: {
        label: "DEMO",
        color: "text-blue-400",
        bg: "bg-blue-500/10 border-blue-500/30",
        icon: <Zap className="w-4 h-4" />,
    },
};

export default function AccountsPage() {
    const {
        accounts,
        defaultAccount,
        transactions,
        loading,
        createAccount,
        setDefaultAccount,
        deleteAccount,
        addDeposit,
        addWithdrawal,
    } = useAccounts();

    const {
        isAddAccountModalOpen,
        isDepositModalOpen,
        isWithdrawModalOpen,
        selectedAccountId,
        openAddAccountModal,
        closeAddAccountModal,
        openDepositModal,
        closeDepositModal,
        openWithdrawModal,
        closeWithdrawModal,
    } = useAccountStore();

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form states
    const [accountForm, setAccountForm] = useState({
        name: "",
        type: "demo" as AccountType,
        broker: "",
        initialBalance: 0,
        currency: "USD",
    });

    const [txAmount, setTxAmount] = useState(0);
    const [txNote, setTxNote] = useState("");

    // Account Log filter
    const [logAccountFilter, setLogAccountFilter] = useState<string>("all");

    const handleCreateAccount = async () => {
        if (!accountForm.name || !accountForm.broker) return;
        setIsSubmitting(true);
        try {
            await createAccount(accountForm);
            setAccountForm({ name: "", type: "demo", broker: "", initialBalance: 0, currency: "USD" });
            closeAddAccountModal();
        } catch (err) {
            console.error("Failed to create account:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeposit = async () => {
        if (!selectedAccountId || txAmount <= 0) return;
        setIsSubmitting(true);
        try {
            await addDeposit({ accountId: selectedAccountId, type: "deposit", amount: txAmount, note: txNote });
            setTxAmount(0);
            setTxNote("");
            closeDepositModal();
        } catch (err) {
            console.error("Failed to deposit:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleWithdraw = async () => {
        if (!selectedAccountId || txAmount <= 0) return;
        setIsSubmitting(true);
        try {
            await addWithdrawal({ accountId: selectedAccountId, type: "withdrawal", amount: txAmount, note: txNote });
            setTxAmount(0);
            setTxNote("");
            closeWithdrawModal();
        } catch (err) {
            console.error("Failed to withdraw:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this account? All related data may be lost.")) {
            await deleteAccount(id);
        }
    };

    const filteredTransactions = logAccountFilter === "all"
        ? transactions
        : transactions.filter((tx) => tx.accountId === logAccountFilter);

    const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

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
                                Trading Accounts
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Manage your live, funded, and demo accounts
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Balance</p>
                                <p className={cn("text-xl font-bold font-mono", totalBalance >= 0 ? "text-emerald-400" : "text-rose-400")}>
                                    {formatCurrency(totalBalance)}
                                </p>
                            </div>
                            <Button onClick={openAddAccountModal}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Account
                            </Button>
                        </div>
                    </motion.div>

                    {/* Accounts Grid */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : accounts.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center py-20 bg-card rounded-xl border border-border"
                        >
                            <Wallet className="w-16 h-16 text-muted-foreground/30 mb-4" />
                            <h3 className="text-xl font-semibold text-foreground mb-2">No Accounts Yet</h3>
                            <p className="text-muted-foreground text-center max-w-md mb-6">
                                Create your first trading account to start tracking balances, deposits, withdrawals, and trades.
                            </p>
                            <Button onClick={openAddAccountModal}>
                                <Plus className="w-4 h-4 mr-2" />
                                Create Account
                            </Button>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {accounts.map((account, i) => {
                                    const cfg = accountTypeConfig[account.type];
                                    const profit = account.balance - account.initialBalance;
                                    const profitPercent = account.initialBalance > 0 ? (profit / account.initialBalance) * 100 : 0;

                                    return (
                                        <motion.div
                                            key={account.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <Card className="p-0 overflow-hidden relative group hover:border-primary/30 transition-colors">
                                                {account.isDefault && (
                                                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-bl-md uppercase tracking-wider z-10">
                                                        Default
                                                    </div>
                                                )}
                                                <div className="p-5 space-y-4">
                                                    {/* Header */}
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className={cn("p-2.5 rounded-lg border", cfg.bg)}>
                                                                {cfg.icon}
                                                            </div>
                                                            <div>
                                                                <h3 className="font-semibold text-foreground text-base">
                                                                    {account.name}
                                                                </h3>
                                                                <p className="text-xs text-muted-foreground">{account.broker}</p>
                                                            </div>
                                                        </div>
                                                        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider", cfg.bg, cfg.color)}>
                                                            {cfg.label}
                                                        </span>
                                                    </div>

                                                    {/* Balance */}
                                                    <div>
                                                        <p className="text-xs text-muted-foreground mb-1">Balance</p>
                                                        <p className="text-2xl font-bold font-mono text-foreground tracking-tight">
                                                            {formatCurrency(account.balance, account.currency)}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className={cn("text-xs font-medium font-mono", profit >= 0 ? "text-emerald-400" : "text-rose-400")}>
                                                                {profit >= 0 ? "+" : ""}{formatCurrency(profit, account.currency)}
                                                            </span>
                                                            <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium", profit >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400")}>
                                                                {profit >= 0 ? "+" : ""}{profitPercent.toFixed(1)}%
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-2 pt-2 border-t border-border">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="flex-1 text-xs h-8"
                                                            onClick={() => openDepositModal(account.id)}
                                                        >
                                                            <ArrowDownCircle className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                                                            Deposit
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="flex-1 text-xs h-8"
                                                            onClick={() => openWithdrawModal(account.id)}
                                                        >
                                                            <ArrowUpCircle className="w-3.5 h-3.5 mr-1 text-rose-400" />
                                                            Withdraw
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0"
                                                            onClick={() => setDefaultAccount(account.id)}
                                                            title="Set as default"
                                                        >
                                                            {account.isDefault ? (
                                                                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                                            ) : (
                                                                <StarOff className="w-4 h-4 text-muted-foreground" />
                                                            )}
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                                            onClick={() => handleDelete(account.id)}
                                                            title="Delete account"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Account Logs / Transaction History */}
                    {accounts.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card className="overflow-hidden">
                                <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                        <h2 className="text-lg font-semibold text-foreground">Account Logs</h2>
                                        <p className="text-sm text-muted-foreground">Deposit & withdrawal entries</p>
                                    </div>
                                    <Select value={logAccountFilter} onValueChange={setLogAccountFilter}>
                                        <SelectTrigger className="w-48">
                                            <SelectValue placeholder="Filter by account" />
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
                                </div>

                                {filteredTransactions.length === 0 ? (
                                    <div className="p-12 text-center text-muted-foreground">
                                        <DollarSign className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                        <p>No transactions yet</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
                                        {filteredTransactions.map((tx) => {
                                            const acc = accounts.find((a) => a.id === tx.accountId);
                                            return (
                                                <div key={tx.id} className="flex items-center justify-between px-5 py-3 hover:bg-secondary/30 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn(
                                                            "w-8 h-8 rounded-full flex items-center justify-center",
                                                            tx.type === "deposit" ? "bg-emerald-500/10" : "bg-rose-500/10"
                                                        )}>
                                                            {tx.type === "deposit" ? (
                                                                <ArrowDownCircle className="w-4 h-4 text-emerald-400" />
                                                            ) : (
                                                                <ArrowUpCircle className="w-4 h-4 text-rose-400" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-foreground capitalize">
                                                                {tx.type}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {acc?.name || "Unknown"} • {tx.note || "—"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className={cn(
                                                            "text-sm font-semibold font-mono",
                                                            tx.type === "deposit" ? "text-emerald-400" : "text-rose-400"
                                                        )}>
                                                            {tx.type === "deposit" ? "+" : "-"}{formatCurrency(tx.amount)}
                                                        </p>
                                                        <p className="text-[10px] text-muted-foreground">
                                                            {formatDate(tx.createdAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </Card>
                        </motion.div>
                    )}
                </div>

                {/* Add Account Modal */}
                <Dialog open={isAddAccountModalOpen} onOpenChange={closeAddAccountModal}>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Add Trading Account</DialogTitle>
                            <DialogDescription>Set up a new live, funded, or demo account</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <Input
                                label="Account Name"
                                placeholder="e.g., FTMO Challenge"
                                value={accountForm.name}
                                onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
                            />
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Account Type</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {(["live", "funded", "demo"] as AccountType[]).map((type) => {
                                        const cfg = accountTypeConfig[type];
                                        return (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setAccountForm({ ...accountForm, type })}
                                                className={cn(
                                                    "flex flex-col items-center gap-1 py-3 px-2 rounded-lg border transition-all text-sm font-medium",
                                                    accountForm.type === type
                                                        ? cn(cfg.bg, cfg.color, "ring-1 ring-current")
                                                        : "bg-background border-input text-muted-foreground hover:bg-secondary"
                                                )}
                                            >
                                                {cfg.icon}
                                                <span className="text-xs">{cfg.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <Input
                                label="Broker"
                                placeholder="e.g., FTMO, IC Markets"
                                value={accountForm.broker}
                                onChange={(e) => setAccountForm({ ...accountForm, broker: e.target.value })}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Initial Balance"
                                    type="number"
                                    step="any"
                                    placeholder="10000"
                                    value={accountForm.initialBalance || ""}
                                    onChange={(e) => setAccountForm({ ...accountForm, initialBalance: Number(e.target.value) })}
                                />
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Currency</label>
                                    <Select
                                        value={accountForm.currency}
                                        onValueChange={(v) => setAccountForm({ ...accountForm, currency: v })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="USD">USD</SelectItem>
                                            <SelectItem value="EUR">EUR</SelectItem>
                                            <SelectItem value="GBP">GBP</SelectItem>
                                            <SelectItem value="INR">INR</SelectItem>
                                            <SelectItem value="AUD">AUD</SelectItem>
                                            <SelectItem value="CAD">CAD</SelectItem>
                                            <SelectItem value="JPY">JPY</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={closeAddAccountModal}>Cancel</Button>
                            <Button onClick={handleCreateAccount} disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Create Account
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Deposit Modal */}
                <Dialog open={isDepositModalOpen} onOpenChange={closeDepositModal}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Add Deposit</DialogTitle>
                            <DialogDescription>Deposit funds to your account</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <Input
                                label="Amount"
                                type="number"
                                step="any"
                                placeholder="0.00"
                                value={txAmount || ""}
                                onChange={(e) => setTxAmount(Number(e.target.value))}
                            />
                            <Input
                                label="Note (optional)"
                                placeholder="e.g., Monthly deposit"
                                value={txNote}
                                onChange={(e) => setTxNote(e.target.value)}
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={closeDepositModal}>Cancel</Button>
                            <Button onClick={handleDeposit} disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700">
                                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Deposit
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Withdraw Modal */}
                <Dialog open={isWithdrawModalOpen} onOpenChange={closeWithdrawModal}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Withdraw Funds</DialogTitle>
                            <DialogDescription>Withdraw funds from your account</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <Input
                                label="Amount"
                                type="number"
                                step="any"
                                placeholder="0.00"
                                value={txAmount || ""}
                                onChange={(e) => setTxAmount(Number(e.target.value))}
                            />
                            <Input
                                label="Note (optional)"
                                placeholder="e.g., Profit withdrawal"
                                value={txNote}
                                onChange={(e) => setTxNote(e.target.value)}
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={closeWithdrawModal}>Cancel</Button>
                            <Button onClick={handleWithdraw} disabled={isSubmitting} variant="destructive">
                                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Withdraw
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </DashboardLayout>
        </AuthGuard>
    );
}
