"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    Button,
    Input,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui";
import { useTradeStore } from "@/store/useTradeStore";
import { useTrades } from "@/hooks/useTrades";
import { useAccounts } from "@/hooks/useAccounts";
import { TradeInput, TradeSide, TradeEmotion, MarketCondition } from "@/types/trade";
import { TrendingUp, TrendingDown, Loader2, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

const tradeSchema = z.object({
    symbol: z.string().min(1, "Symbol is required").max(10, "Symbol too long"),
    side: z.enum(["long", "short"]),
    entryPrice: z.number().min(0.0001, "Entry price must be positive"),
    exitPrice: z.number().min(0.0001, "Exit price must be positive"),
    quantity: z.number().min(0.0001, "Quantity must be positive"),
    entryDate: z.string().min(1, "Entry date is required"),
    exitDate: z.string().min(1, "Exit date is required"),
    commission: z.number().min(0).optional(),
    strategy: z.string().optional(),
    stopLoss: z.number().min(0).optional(),
    takeProfit: z.number().min(0).optional(),
    emotion: z.enum(["calm", "confident", "fearful", "fomo", "neutral"]).optional(),
    marketCondition: z.enum(["bullish", "bearish", "ranging", "volatile"]).optional(),
    notes: z.string().optional(),
});

type TradeFormData = z.infer<typeof tradeSchema>;

const commonSymbols = [
    "XAUUSD",
    "EURUSD",
    "GBPUSD",
    "USDJPY",
    "USDCHF",
    "AUDUSD",
    "NZDUSD",
    "USDCAD",
    "GBPJPY",
    "EURJPY",
    "EURGBP",
    "XAGUSD",
    "US30",
    "NAS100",
    "SPX500",
    "BTCUSD",
    "ETHUSD",
];

const strategies = [
    "Breakout",
    "Momentum",
    "Mean Reversion",
    "Scalping",
    "Swing Trade",
    "Position Trade",
    "News Trading",
    "Technical Pattern",
    "Other",
];

const emotions: { value: TradeEmotion; label: string; emoji: string }[] = [
    { value: "calm", label: "Calm", emoji: "😌" },
    { value: "confident", label: "Confident", emoji: "💪" },
    { value: "neutral", label: "Neutral", emoji: "😐" },
    { value: "fearful", label: "Fearful", emoji: "😰" },
    { value: "fomo", label: "FOMO", emoji: "🤑" },
];

const marketConditions: { value: MarketCondition; label: string }[] = [
    { value: "bullish", label: "Bullish 📈" },
    { value: "bearish", label: "Bearish 📉" },
    { value: "ranging", label: "Ranging ↔️" },
    { value: "volatile", label: "Volatile ⚡" },
];

export function AddTradeModal() {
    const { isAddModalOpen, closeAddModal, isEditModalOpen, closeEditModal, selectedTrade } = useTradeStore();
    const { addTrade, updateTrade, trades } = useTrades();
    const { accounts, defaultAccountId } = useAccounts();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedSide, setSelectedSide] = useState<TradeSide>("long");
    const [customSymbol, setCustomSymbol] = useState("");
    const [showCustomSymbol, setShowCustomSymbol] = useState(false);
    const [selectedAccountId, setSelectedAccountId] = useState<string>("");

    const isOpen = isAddModalOpen || isEditModalOpen;
    const isEditing = isEditModalOpen && !!selectedTrade;

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<TradeFormData>({
        resolver: zodResolver(tradeSchema),
        defaultValues: {
            side: "long",
            commission: 0,
            strategy: "Breakout",
            emotion: "neutral",
            marketCondition: "ranging",
            notes: "",
        },
    });

    // Reset form when modal opens/changes
    React.useEffect(() => {
        if (isOpen) {
            if (isEditing && selectedTrade) {
                reset({
                    symbol: selectedTrade.symbol,
                    side: selectedTrade.side,
                    entryPrice: selectedTrade.entryPrice,
                    exitPrice: selectedTrade.exitPrice,
                    quantity: selectedTrade.quantity,
                    entryDate: new Date(selectedTrade.entryDate).toISOString().slice(0, 16),
                    exitDate: new Date(selectedTrade.exitDate).toISOString().slice(0, 16),
                    commission: selectedTrade.commission,
                    strategy: selectedTrade.strategy,
                    stopLoss: selectedTrade.stopLoss,
                    takeProfit: selectedTrade.takeProfit,
                    emotion: selectedTrade.emotion,
                    marketCondition: selectedTrade.marketCondition,
                    notes: selectedTrade.notes || "",
                });
                setSelectedSide(selectedTrade.side);
                setSelectedAccountId(selectedTrade.accountId);
            } else {
                reset({
                    side: "long",
                    commission: 0,
                    strategy: "Breakout",
                    emotion: "neutral",
                    marketCondition: "ranging",
                    notes: "",
                    entryDate: new Date().toISOString().slice(0, 16),
                    exitDate: new Date().toISOString().slice(0, 16),
                });
                setSelectedSide("long");
            }
        }
    }, [isOpen, isEditing, selectedTrade, reset]);

    const recentSymbols = Array.from(new Set(trades.slice(0, 20).map(t => t.symbol))).slice(0, 5);

    const onSubmit = async (data: TradeFormData) => {
        setIsSubmitting(true);
        try {
            const tradeInput: TradeInput = {
                accountId: selectedAccountId || defaultAccountId || "",
                symbol: data.symbol.toUpperCase(),
                side: data.side,
                entryPrice: data.entryPrice,
                exitPrice: data.exitPrice,
                quantity: data.quantity,
                entryDate: new Date(data.entryDate),
                exitDate: new Date(data.exitDate),
                commission: data.commission,
                strategy: data.strategy,
                stopLoss: data.stopLoss,
                takeProfit: data.takeProfit,
                emotion: data.emotion,
                marketCondition: data.marketCondition,
                notes: data.notes,
            };

            if (isEditing) {
                await updateTrade(selectedTrade!.id, tradeInput);
            } else {
                await addTrade(tradeInput);
            }
            handleClose();
        } catch (error) {
            console.error("Failed to save trade:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        reset();
        if (isEditing) closeEditModal();
        else closeAddModal();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit Trade" : "Add New Trade"}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? "Update your trade details." : "Log your trade details for analysis and tracking."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Account Selector */}
                    {accounts.length > 0 && (
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                                <Wallet className="w-3.5 h-3.5" />
                                Trading Account
                            </label>
                            <Select
                                value={selectedAccountId || defaultAccountId || accounts[0]?.id}
                                onValueChange={(value: string) => setSelectedAccountId(value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select account" />
                                </SelectTrigger>
                                <SelectContent>
                                    {accounts.map((acc) => (
                                        <SelectItem key={acc.id} value={acc.id}>
                                            {acc.name} ({acc.type.toUpperCase()})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Side Selector */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-muted-foreground">
                            Trade Side
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedSide("long");
                                    setValue("side", "long");
                                }}
                                className={cn(
                                    "flex items-center justify-center gap-2 py-2.5 px-4 rounded-md font-medium transition-all text-sm",
                                    selectedSide === "long"
                                        ? "bg-emerald-500 text-white shadow-sm"
                                        : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                                )}
                            >
                                <TrendingUp className="w-4 h-4" />
                                Long
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedSide("short");
                                    setValue("side", "short");
                                }}
                                className={cn(
                                    "flex items-center justify-center gap-2 py-2.5 px-4 rounded-md font-medium transition-all text-sm",
                                    selectedSide === "short"
                                        ? "bg-rose-500 text-white shadow-sm"
                                        : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                                )}
                            >
                                <TrendingDown className="w-4 h-4" />
                                Short
                            </button>
                        </div>
                    </div>

                    {/* Symbol */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-muted-foreground">
                            Symbol
                        </label>
                        {showCustomSymbol ? (
                            <div className="flex gap-2">
                                <Input
                                    value={customSymbol || watch("symbol")}
                                    onChange={(e) => {
                                        const val = e.target.value.toUpperCase();
                                        setCustomSymbol(val);
                                        setValue("symbol", val);
                                    }}
                                    placeholder="e.g., AAPL"
                                    error={errors.symbol?.message}
                                    className="flex-1"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="shrink-0 h-10"
                                    onClick={() => {
                                        setShowCustomSymbol(false);
                                        setCustomSymbol("");
                                    }}
                                >
                                    Back
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Select
                                    value={watch("symbol")}
                                    onValueChange={(value: string) => {
                                        if (value === "__custom__") {
                                            setShowCustomSymbol(true);
                                        } else {
                                            setValue("symbol", value);
                                        }
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select symbol" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {recentSymbols.length > 0 && (
                                            <>
                                                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recent</div>
                                                {recentSymbols.map((sym) => (
                                                    <SelectItem key={`recent-${sym}`} value={sym}>
                                                        {sym}
                                                    </SelectItem>
                                                ))}
                                                <div className="h-px bg-border my-1" />
                                            </>
                                        )}
                                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">All Assets</div>
                                        {commonSymbols.map((sym) => (
                                            <SelectItem key={sym} value={sym}>
                                                {sym}
                                            </SelectItem>
                                        ))}
                                        <SelectItem value="__custom__">
                                            ✏️ Enter custom symbol...
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.symbol && (
                                    <p className="text-xs text-destructive">{errors.symbol.message}</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Prices */}
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            {...register("entryPrice", { valueAsNumber: true })}
                            type="number"
                            step="any"
                            label="Entry Price"
                            placeholder="0.00"
                            error={errors.entryPrice?.message}
                        />
                        <Input
                            {...register("exitPrice", { valueAsNumber: true })}
                            type="number"
                            step="any"
                            label="Exit Price"
                            placeholder="0.00"
                            error={errors.exitPrice?.message}
                        />
                    </div>

                    {/* Live Profit or Loss Preview */}
                    {(() => {
                        const entry = watch("entryPrice");
                        const exit = watch("exitPrice");
                        const qty = watch("quantity");
                        const side = watch("side") || selectedSide;
                        if (entry > 0 && exit > 0 && qty > 0) {
                            const pnl = side === "long"
                                ? (exit - entry) * qty
                                : (entry - exit) * qty;
                            const commission = watch("commission") || 0;
                            const netPnl = pnl - commission;
                            return (
                                <div className={cn(
                                    "flex items-center justify-between px-4 py-3 rounded-lg border",
                                    netPnl >= 0
                                        ? "bg-emerald-500/5 border-emerald-500/20"
                                        : "bg-rose-500/5 border-rose-500/20"
                                )}>
                                    <span className="text-sm font-medium text-muted-foreground">Profit or Loss</span>
                                    <span className={cn(
                                        "text-lg font-bold font-mono",
                                        netPnl >= 0 ? "text-emerald-500" : "text-rose-500"
                                    )}>
                                        {netPnl >= 0 ? "+" : ""}
                                        ${netPnl.toFixed(2)}
                                    </span>
                                </div>
                            );
                        }
                        return null;
                    })()}

                    {/* Quantity & Commission */}
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            {...register("quantity", { valueAsNumber: true })}
                            type="number"
                            step="any"
                            label="Quantity"
                            placeholder="0"
                            error={errors.quantity?.message}
                        />
                        <Input
                            {...register("commission", { valueAsNumber: true })}
                            type="number"
                            step="any"
                            label="Commission"
                            placeholder="0.00"
                        />
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            {...register("entryDate")}
                            type="datetime-local"
                            label="Entry Date"
                            error={errors.entryDate?.message}
                        />
                        <Input
                            {...register("exitDate")}
                            type="datetime-local"
                            label="Exit Date"
                            error={errors.exitDate?.message}
                        />
                    </div>

                    {/* Stop Loss & Take Profit (Optional) */}
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            {...register("stopLoss", { valueAsNumber: true })}
                            type="number"
                            step="any"
                            label="Stop Loss (Optional)"
                            placeholder="0.00"
                        />
                        <Input
                            {...register("takeProfit", { valueAsNumber: true })}
                            type="number"
                            step="any"
                            label="Take Profit (Optional)"
                            placeholder="0.00"
                        />
                    </div>

                    {/* Strategy */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-muted-foreground">
                            Strategy
                        </label>
                        <Select
                            value={watch("strategy")}
                            onValueChange={(value: string) => setValue("strategy", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select strategy" />
                            </SelectTrigger>
                            <SelectContent>
                                {strategies.map((strategy) => (
                                    <SelectItem key={strategy} value={strategy}>
                                        {strategy}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Emotion */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-muted-foreground">
                            Emotional State
                        </label>
                        <div className="flex gap-2">
                            {emotions.map((emotion) => (
                                <button
                                    key={emotion.value}
                                    type="button"
                                    onClick={() => setValue("emotion", emotion.value)}
                                    className={cn(
                                        "flex-1 py-1.5 px-2 rounded-md text-center transition-all text-sm font-medium border",
                                        watch("emotion") === emotion.value
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "bg-background border-input text-muted-foreground hover:bg-secondary hover:text-foreground"
                                    )}
                                >
                                    <span className="text-lg leading-none">{emotion.emoji}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Market Condition */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-muted-foreground">
                            Market Condition
                        </label>
                        <Select
                            defaultValue="ranging"
                            onValueChange={(value: string) => setValue("marketCondition", value as MarketCondition)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select condition" />
                            </SelectTrigger>
                            <SelectContent>
                                {marketConditions.map((condition) => (
                                    <SelectItem key={condition.value} value={condition.value}>
                                        {condition.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-muted-foreground">
                            Notes
                        </label>
                        <textarea
                            {...register("notes")}
                            rows={3}
                            placeholder="Trade setup, reasoning, learnings..."
                            className={cn(
                                "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                            )}
                        />
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                            {isSubmitting ? (isEditing ? "Updating..." : "Adding...") : (isEditing ? "Update Trade" : "Add Trade")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
