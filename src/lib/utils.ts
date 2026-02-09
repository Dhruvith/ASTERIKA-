import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency: string = "USD"): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

export function formatPercent(value: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "percent",
        minimumFractionDigits: 1,
        maximumFractionDigits: 2,
    }).format(value / 100);
}

export function formatNumber(value: number, decimals: number = 2): string {
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);
}

export function formatDate(date: Date | string | number): string {
    const d = new Date(date);
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(d);
}

export function formatDateTime(date: Date | string | number): string {
    const d = new Date(date);
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    }).format(d);
}

export function calculatePnL(
    entryPrice: number,
    exitPrice: number,
    quantity: number,
    side: "long" | "short"
): number {
    if (side === "long") {
        return (exitPrice - entryPrice) * quantity;
    }
    return (entryPrice - exitPrice) * quantity;
}

export function calculatePnLPercent(
    entryPrice: number,
    exitPrice: number,
    side: "long" | "short"
): number {
    if (side === "long") {
        return ((exitPrice - entryPrice) / entryPrice) * 100;
    }
    return ((entryPrice - exitPrice) / entryPrice) * 100;
}

export function calculateRiskReward(
    entryPrice: number,
    stopLoss: number,
    takeProfit: number,
    side: "long" | "short"
): number {
    if (side === "long") {
        const risk = entryPrice - stopLoss;
        const reward = takeProfit - entryPrice;
        return risk > 0 ? reward / risk : 0;
    }
    const risk = stopLoss - entryPrice;
    const reward = entryPrice - takeProfit;
    return risk > 0 ? reward / risk : 0;
}

export function getTradeStatus(pnl: number): "win" | "loss" | "breakeven" {
    if (pnl > 0) return "win";
    if (pnl < 0) return "loss";
    return "breakeven";
}

export function generateId(): string {
    return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
}
