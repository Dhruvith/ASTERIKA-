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
    const { isAddModalOpen, closeAddModal } = useTradeStore();
    const { addTrade } = useTrades();
    const { accounts, defaultAccountId } = useAccounts();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedSide, setSelectedSide] = useState<TradeSide>("long");
    const [selectedAccountId, setSelectedAccountId] = useState<string>("");

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

            await addTrade(tradeInput);
            reset();
            closeAddModal();
        } catch (error) {
            console.error("Failed to add trade:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        reset();
        closeAddModal();
    };

    return (
        <Dialog open={isAddModalOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Trade</DialogTitle>
                    <DialogDescription>
                        Log your trade details for analysis and tracking.
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
                                onValueChange={setSelectedAccountId}
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
                    <Input
                        {...register("symbol")}
                        label="Symbol"
                        placeholder="e.g., AAPL"
                        error={errors.symbol?.message}
                    />

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

                    {/* Stop Loss & Take Profit */}
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            {...register("stopLoss", { valueAsNumber: true })}
                            type="number"
                            step="any"
                            label="Stop Loss"
                            placeholder="0.00"
                        />
                        <Input
                            {...register("takeProfit", { valueAsNumber: true })}
                            type="number"
                            step="any"
                            label="Take Profit"
                            placeholder="0.00"
                        />
                    </div>

                    {/* Strategy */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-muted-foreground">
                            Strategy
                        </label>
                        <Select
                            defaultValue="Breakout"
                            onValueChange={(value) => setValue("strategy", value)}
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
                            onValueChange={(value) => setValue("marketCondition", value as MarketCondition)}
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
                            {isSubmitting ? "Adding..." : "Add Trade"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
