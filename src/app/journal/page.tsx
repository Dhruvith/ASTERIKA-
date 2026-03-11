"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout, AuthGuard } from "@/components/layout";
import { useAccounts } from "@/hooks/useAccounts";
import { useTrades } from "@/hooks/useTrades";
import { useAccountStore } from "@/store/useAccountStore";
import {
    Plus,
    Loader2,
    BookOpen,
    Smile,
    Frown,
    Meh,
    ThumbsUp,
    ThumbsDown,
    Calendar,
    Lightbulb,
    AlertTriangle,
    Sparkles,
    Link2,
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
import { cn, formatDate, formatDateTime, formatCurrency } from "@/lib/utils";

const moodConfig = {
    great: { label: "Great", emoji: "🔥", color: "text-emerald-400", bg: "bg-emerald-500/10" },
    good: { label: "Good", emoji: "😊", color: "text-green-400", bg: "bg-green-500/10" },
    neutral: { label: "Neutral", emoji: "😐", color: "text-blue-400", bg: "bg-blue-500/10" },
    bad: { label: "Bad", emoji: "😔", color: "text-amber-400", bg: "bg-amber-500/10" },
    terrible: { label: "Terrible", emoji: "😩", color: "text-rose-400", bg: "bg-rose-500/10" },
};

type MoodType = keyof typeof moodConfig;

export default function JournalPage() {
    const { journalEntries, accounts, createJournalEntry } = useAccounts();
    const { trades } = useTrades();
    const {
        isAddJournalModalOpen,
        openAddJournalModal,
        closeAddJournalModal,
    } = useAccountStore();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        accountId: "",
        title: "",
        content: "",
        mood: "neutral" as MoodType,
        tagsInput: "",
        lessonsLearned: "",
        mistakes: "",
        improvements: "",
        createdAt: new Date().toISOString().slice(0, 16),
        tradeId: "",
    });

    const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

    const handleCreate = async () => {
        if (!form.title.trim() || !form.content.trim()) return;
        setIsSubmitting(true);
        try {
            await createJournalEntry({
                accountId: form.accountId || accounts[0]?.id || "",
                title: form.title,
                content: form.content,
                mood: form.mood,
                tags: form.tagsInput ? form.tagsInput.split(",").map((t) => t.trim()).filter(Boolean) : [],
                lessonsLearned: form.lessonsLearned,
                mistakes: form.mistakes,
                improvements: form.improvements,
                createdAt: new Date(form.createdAt),
                tradeId: form.tradeId || undefined,
            });
            setForm({
                accountId: "",
                title: "",
                content: "",
                mood: "neutral",
                tagsInput: "",
                lessonsLearned: "",
                mistakes: "",
                improvements: "",
                createdAt: new Date().toISOString().slice(0, 16),
                tradeId: "",
            });
            closeAddJournalModal();
        } catch (err) {
            console.error("Failed to create journal entry:", err);
        } finally {
            setIsSubmitting(false);
        }
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
                                Trade Journal
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Record your thoughts, lessons, and reflections
                            </p>
                        </div>
                        <Button onClick={openAddJournalModal}>
                            <Plus className="w-4 h-4 mr-2" />
                            New Entry
                        </Button>
                    </motion.div>

                    {/* Journal Entries */}
                    {journalEntries.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center py-20 bg-card rounded-xl border border-border"
                        >
                            <BookOpen className="w-16 h-16 text-muted-foreground/30 mb-4" />
                            <h3 className="text-xl font-semibold text-foreground mb-2">No Journal Entries</h3>
                            <p className="text-muted-foreground text-center max-w-md mb-6">
                                Start journaling your trades to reflect on lessons learned and improve your trading.
                            </p>
                            <Button onClick={openAddJournalModal}>
                                <Plus className="w-4 h-4 mr-2" />
                                Write Entry
                            </Button>
                        </motion.div>
                    ) : (
                        <div className="space-y-4">
                            <AnimatePresence>
                                {journalEntries.map((entry, i) => {
                                    const mood = moodConfig[entry.mood] || moodConfig.neutral;
                                    const acc = accounts.find((a) => a.id === entry.accountId);
                                    const isExpanded = expandedEntry === entry.id;

                                    return (
                                        <motion.div
                                            key={entry.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ delay: i * 0.03 }}
                                        >
                                            <Card
                                                className="p-0 overflow-hidden cursor-pointer hover:border-primary/30 transition-colors"
                                                onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}
                                            >
                                                <div className="p-5">
                                                    {/* Entry Header */}
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-lg", mood.bg)}>
                                                                {mood.emoji}
                                                            </div>
                                                            <div>
                                                                <h3 className="font-semibold text-foreground text-base">
                                                                    {entry.title}
                                                                </h3>
                                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                    <Calendar className="w-3 h-3" />
                                                                    {formatDateTime(entry.createdAt)}
                                                                    {acc && (
                                                                        <>
                                                                            <span>•</span>
                                                                            <span>{acc.name}</span>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", mood.bg, mood.color)}>
                                                            {mood.label}
                                                        </span>
                                                    </div>

                                                    {/* Content Preview */}
                                                    <p className={cn("text-sm text-muted-foreground", !isExpanded && "line-clamp-2")}>
                                                        {entry.content}
                                                    </p>

                                                    {/* Tags */}
                                                    {entry.tags.length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5 mt-3">
                                                            {entry.tags.map((tag) => (
                                                                <span
                                                                    key={tag}
                                                                    className="text-[10px] px-2 py-0.5 bg-secondary rounded-full text-muted-foreground"
                                                                >
                                                                    #{tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Expanded Details */}
                                                    <AnimatePresence>
                                                        {isExpanded && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: "auto", opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                className="mt-4 space-y-3 overflow-hidden"
                                                            >
                                                                {entry.lessonsLearned && (
                                                                    <div className="flex gap-2 p-3 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
                                                                        <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                                                        <div>
                                                                            <p className="text-xs font-medium text-emerald-400 mb-0.5">Lessons Learned</p>
                                                                            <p className="text-sm text-foreground">{entry.lessonsLearned}</p>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {entry.mistakes && (
                                                                    <div className="flex gap-2 p-3 bg-rose-500/5 rounded-lg border border-rose-500/10">
                                                                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                                                                        <div>
                                                                            <p className="text-xs font-medium text-rose-400 mb-0.5">Mistakes</p>
                                                                            <p className="text-sm text-foreground">{entry.mistakes}</p>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {entry.improvements && (
                                                                    <div className="flex gap-2 p-3 bg-blue-500/5 rounded-lg border border-blue-500/10">
                                                                        <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                                                                        <div>
                                                                            <p className="text-xs font-medium text-blue-400 mb-0.5">Improvements</p>
                                                                            <p className="text-sm text-foreground">{entry.improvements}</p>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Add Journal Entry Modal */}
                <Dialog open={isAddJournalModalOpen} onOpenChange={closeAddJournalModal}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>New Journal Entry</DialogTitle>
                            <DialogDescription>Reflect on your trading day</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Date and Time"
                                    type="datetime-local"
                                    value={form.createdAt}
                                    onChange={(e) => setForm({ ...form, createdAt: e.target.value })}
                                />
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Account</label>
                                    <Select
                                        value={form.accountId || accounts[0]?.id}
                                        onValueChange={(v) => setForm({ ...form, accountId: v })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select account" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {accounts.map((a) => (
                                                <SelectItem key={a.id} value={a.id}>
                                                    {a.name} ({a.type.toUpperCase()})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Link to Recent Trade - PROMINENT */}
                            {trades.length > 0 && (
                                <div className="space-y-3 p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10 shadow-inner">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                                            <Link2 className="w-4 h-4" />
                                            Select Recent Trade (Optional)
                                        </label>
                                        <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Recommended</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Log your thoughts immediately after a trade to capture your exact mindset.</p>
                                    <Select
                                        value={form.tradeId}
                                        onValueChange={(tradeId: string) => {
                                            const trade = trades.find((t) => t.id === tradeId);
                                            if (trade) {
                                                const pnlStr = trade.pnl >= 0 ? `+${formatCurrency(trade.pnl)}` : formatCurrency(trade.pnl);
                                                setForm({
                                                    ...form,
                                                    tradeId: tradeId,
                                                    title: `${trade.side.toUpperCase()} ${trade.symbol} — ${pnlStr} (${formatDate(trade.exitDate)})`,
                                                    accountId: trade.accountId,
                                                    createdAt: new Date(trade.exitDate).toISOString().slice(0, 16),
                                                });
                                            }
                                        }}
                                    >
                                        <SelectTrigger className="bg-background border-emerald-500/20">
                                            <SelectValue placeholder="Journal a specific trade..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {trades.slice(0, 20).map((trade) => (
                                                <SelectItem key={trade.id} value={trade.id}>
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-bold w-12">{trade.symbol}</span>
                                                        <span className={cn(
                                                            "text-[10px] px-1.5 py-0.5 rounded uppercase font-black tracking-tight",
                                                            trade.side === "long" ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"
                                                        )}>{trade.side}</span>
                                                        <span className={cn(
                                                            "font-mono font-bold",
                                                            trade.pnl >= 0 ? "text-emerald-400" : "text-rose-400"
                                                        )}>
                                                            {trade.pnl >= 0 ? "+" : ""}{formatCurrency(trade.pnl)}
                                                        </span>
                                                        <span className="text-muted-foreground text-[10px] ml-auto">{formatDate(trade.exitDate)}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            <Input
                                label="Title"
                                placeholder="e.g., Trading day review - NQ scalping"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                            />



                            {/* Mood */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Mood</label>
                                <div className="flex gap-2">
                                    {(Object.entries(moodConfig) as [MoodType, (typeof moodConfig)[MoodType]][]).map(([key, config]) => (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() => setForm({ ...form, mood: key })}
                                            className={cn(
                                                "flex-1 py-2 px-2 rounded-lg text-center transition-all text-sm font-medium border",
                                                form.mood === key
                                                    ? cn(config.bg, config.color, "border-current ring-1 ring-current")
                                                    : "bg-background border-input text-muted-foreground hover:bg-secondary"
                                            )}
                                        >
                                            <span className="text-lg block">{config.emoji}</span>
                                            <span className="text-[10px]">{config.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Journal Entry</label>
                                <textarea
                                    value={form.content}
                                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                                    rows={5}
                                    placeholder="Write about your trading session, what happened, how you felt..."
                                    className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <Lightbulb className="w-4 h-4 text-emerald-400" />
                                    Lessons Learned
                                </label>
                                <textarea
                                    value={form.lessonsLearned}
                                    onChange={(e) => setForm({ ...form, lessonsLearned: e.target.value })}
                                    rows={2}
                                    placeholder="What did you learn today?"
                                    className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                                    Mistakes Made
                                </label>
                                <textarea
                                    value={form.mistakes}
                                    onChange={(e) => setForm({ ...form, mistakes: e.target.value })}
                                    rows={2}
                                    placeholder="What mistakes did you make?"
                                    className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-blue-400" />
                                    Improvements
                                </label>
                                <textarea
                                    value={form.improvements}
                                    onChange={(e) => setForm({ ...form, improvements: e.target.value })}
                                    rows={2}
                                    placeholder="What will you improve next time?"
                                    className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                                />
                            </div>

                            <Input
                                label="Tags (comma separated)"
                                placeholder="e.g., scalping, NQ, news-event"
                                value={form.tagsInput}
                                onChange={(e) => setForm({ ...form, tagsInput: e.target.value })}
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={closeAddJournalModal}>Cancel</Button>
                            <Button onClick={handleCreate} disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Save Entry
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </DashboardLayout>
        </AuthGuard>
    );
}
