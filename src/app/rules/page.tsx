"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout, AuthGuard } from "@/components/layout";
import { useAccounts } from "@/hooks/useAccounts";
import { useAccountStore } from "@/store/useAccountStore";
import {
    Plus,
    Trash2,
    Loader2,
    Shield,
    CheckCircle2,
    XCircle,
    ArrowRightCircle,
    ArrowLeftCircle,
    AlertTriangle,
    FileText,
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
} from "@/components/ui";
import { cn } from "@/lib/utils";

const categoryConfig = {
    entry: { label: "Entry", color: "text-emerald-400", bg: "bg-emerald-500/10", icon: ArrowRightCircle },
    exit: { label: "Exit", color: "text-blue-400", bg: "bg-blue-500/10", icon: ArrowLeftCircle },
    risk: { label: "Risk", color: "text-amber-400", bg: "bg-amber-500/10", icon: AlertTriangle },
    general: { label: "General", color: "text-purple-400", bg: "bg-purple-500/10", icon: FileText },
};

type RuleCategory = keyof typeof categoryConfig;

export default function RulesPage() {
    const { tradeRules, createTradeRule, deleteTradeRule, toggleTradeRuleActive } = useAccounts();
    const {
        isAddRuleModalOpen,
        openAddRuleModal,
        closeAddRuleModal,
    } = useAccountStore();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        rule: "",
        category: "general" as RuleCategory,
    });

    const handleCreate = async () => {
        if (!form.rule.trim()) return;
        setIsSubmitting(true);
        try {
            await createTradeRule(form);
            setForm({ rule: "", category: "general" });
            closeAddRuleModal();
        } catch (err) {
            console.error("Failed to create rule:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Delete this rule?")) {
            await deleteTradeRule(id);
        }
    };

    // Group rules by category
    const groupedRules = {
        entry: tradeRules.filter((r) => r.category === "entry"),
        exit: tradeRules.filter((r) => r.category === "exit"),
        risk: tradeRules.filter((r) => r.category === "risk"),
        general: tradeRules.filter((r) => r.category === "general"),
    };

    const activeRules = tradeRules.filter((r) => r.isActive).length;

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
                                Trade Rules
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Define and manage your trading discipline checklist
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Active Rules</p>
                                <p className="text-xl font-bold font-mono text-primary">
                                    {activeRules} / {tradeRules.length}
                                </p>
                            </div>
                            <Button onClick={openAddRuleModal}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Rule
                            </Button>
                        </div>
                    </motion.div>

                    {/* Rules by Category */}
                    {tradeRules.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center py-20 bg-card rounded-xl border border-border"
                        >
                            <Shield className="w-16 h-16 text-muted-foreground/30 mb-4" />
                            <h3 className="text-xl font-semibold text-foreground mb-2">No Rules Defined</h3>
                            <p className="text-muted-foreground text-center max-w-md mb-6">
                                Create rules to keep your trading disciplined. Rules can be toggled before each session.
                            </p>
                            <Button onClick={openAddRuleModal}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add First Rule
                            </Button>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {(Object.entries(groupedRules) as [RuleCategory, typeof tradeRules][]).map(([category, rules]) => {
                                const cfg = categoryConfig[category];
                                const Icon = cfg.icon;

                                if (rules.length === 0) return null;

                                return (
                                    <motion.div
                                        key={category}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <Card className="overflow-hidden">
                                            <div className="p-4 border-b border-border flex items-center gap-3">
                                                <div className={cn("p-2 rounded-lg", cfg.bg)}>
                                                    <Icon className={cn("w-4 h-4", cfg.color)} />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-foreground text-sm">{cfg.label} Rules</h3>
                                                    <p className="text-[10px] text-muted-foreground">{rules.length} rules</p>
                                                </div>
                                            </div>
                                            <div className="divide-y divide-border">
                                                <AnimatePresence>
                                                    {rules.map((rule) => (
                                                        <motion.div
                                                            key={rule.id}
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/20 transition-colors group"
                                                        >
                                                            <button
                                                                onClick={() => toggleTradeRuleActive(rule.id)}
                                                                className="shrink-0"
                                                            >
                                                                {rule.isActive ? (
                                                                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                                                ) : (
                                                                    <XCircle className="w-5 h-5 text-muted-foreground/40" />
                                                                )}
                                                            </button>
                                                            <p className={cn(
                                                                "flex-1 text-sm",
                                                                rule.isActive ? "text-foreground" : "text-muted-foreground line-through"
                                                            )}>
                                                                {rule.rule}
                                                            </p>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                                                                onClick={() => handleDelete(rule.id)}
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </Button>
                                                        </motion.div>
                                                    ))}
                                                </AnimatePresence>
                                            </div>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Add Rule Modal */}
                <Dialog open={isAddRuleModalOpen} onOpenChange={closeAddRuleModal}>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Add Trade Rule</DialogTitle>
                            <DialogDescription>Define a rule to keep yourself disciplined</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Rule</label>
                                <textarea
                                    value={form.rule}
                                    onChange={(e) => setForm({ ...form, rule: e.target.value })}
                                    rows={3}
                                    placeholder="e.g., Never risk more than 1% per trade"
                                    className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Category</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {(Object.entries(categoryConfig) as [RuleCategory, typeof categoryConfig.entry][]).map(([key, cfg]) => {
                                        const Icon = cfg.icon;
                                        return (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => setForm({ ...form, category: key })}
                                                className={cn(
                                                    "flex flex-col items-center gap-1 py-2 px-2 rounded-lg border transition-all text-xs font-medium",
                                                    form.category === key
                                                        ? cn(cfg.bg, cfg.color, "border-current ring-1 ring-current")
                                                        : "bg-background border-input text-muted-foreground hover:bg-secondary"
                                                )}
                                            >
                                                <Icon className="w-4 h-4" />
                                                {cfg.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={closeAddRuleModal}>Cancel</Button>
                            <Button onClick={handleCreate} disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Add Rule
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </DashboardLayout>
        </AuthGuard>
    );
}
