"use client";

import { useEffect, useCallback } from "react";
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    Timestamp,
    limit,
    where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useTradeStore } from "@/store/useTradeStore";
import { useAuth } from "./useAuth";
import { Trade, TradeInput, TradeStats } from "@/types/trade";
import {
    calculatePnL,
    calculatePnLPercent,
    calculateRiskReward,
    generateId,
} from "@/lib/utils";

function convertFirestoreToTrade(docData: Record<string, unknown>, id: string): Trade {
    const safeDate = (val: unknown): Date => {
        if (!val) return new Date();
        if (val instanceof Date) return val;
        if (typeof val === 'object' && val !== null && 'toDate' in val) {
            return (val as Timestamp).toDate();
        }
        return new Date(val as string | number);
    };

    return {
        id,
        userId: (docData.userId as string) || "",
        accountId: (docData.accountId as string) || "",
        symbol: (docData.symbol as string) || "",
        side: (docData.side as Trade["side"]) || "long",
        entryPrice: Number(docData.entryPrice) || 0,
        exitPrice: Number(docData.exitPrice) || 0,
        quantity: Number(docData.quantity) || 0,
        entryDate: safeDate(docData.entryDate),
        exitDate: safeDate(docData.exitDate),
        pnl: Number(docData.pnl) || 0,
        pnlPercent: Number(docData.pnlPercent) || 0,
        commission: Number(docData.commission) || 0,
        strategy: (docData.strategy as string) || "",
        tags: Array.isArray(docData.tags) ? docData.tags : [],
        emotion: (docData.emotion as Trade["emotion"]) || "neutral",
        notes: (docData.notes as string) || "",
        setupScore: Number(docData.setupScore) || 0,
        screenshots: Array.isArray(docData.screenshots) ? docData.screenshots : [],
        riskReward: Number(docData.riskReward) || 0,
        positionSize: Number(docData.positionSize) || 0,
        stopLoss: Number(docData.stopLoss) || 0,
        takeProfit: Number(docData.takeProfit) || 0,
        marketCondition: (docData.marketCondition as Trade["marketCondition"]) || "ranging",
        createdAt: safeDate(docData.createdAt),
        updatedAt: safeDate(docData.updatedAt),
    };
}

function calculateStats(trades: Trade[]): TradeStats {
    if (trades.length === 0) {
        return {
            totalTrades: 0,
            winningTrades: 0,
            losingTrades: 0,
            winRate: 0,
            totalPnL: 0,
            avgWin: 0,
            avgLoss: 0,
            largestWin: 0,
            largestLoss: 0,
            profitFactor: 0,
            avgRiskReward: 0,
            expectancy: 0,
            sharpeRatio: 0,
            maxDrawdown: 0,
            avgTradeDuration: 0,
            consecutiveWins: 0,
            consecutiveLosses: 0,
        };
    }

    const winningTrades = trades.filter((t) => t.pnl > 0);
    const losingTrades = trades.filter((t) => t.pnl < 0);

    const totalPnL = trades.reduce((sum, t) => sum + t.pnl, 0);
    const grossProfit = winningTrades.reduce((sum, t) => sum + t.pnl, 0);
    const grossLoss = Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0));

    const avgWin = winningTrades.length > 0
        ? grossProfit / winningTrades.length
        : 0;
    const avgLoss = losingTrades.length > 0
        ? grossLoss / losingTrades.length
        : 0;

    const largestWin = winningTrades.length > 0
        ? Math.max(...winningTrades.map((t) => t.pnl))
        : 0;
    const largestLoss = losingTrades.length > 0
        ? Math.min(...losingTrades.map((t) => t.pnl))
        : 0;

    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : 0;

    const winRate = (winningTrades.length / trades.length) * 100;

    const avgRiskReward = trades.reduce((sum, t) => sum + t.riskReward, 0) / trades.length;

    // Calculate expectancy
    const winProb = winningTrades.length / trades.length;
    const loseProb = losingTrades.length / trades.length;
    const expectancy = (winProb * avgWin) - (loseProb * avgLoss);

    // Calculate max drawdown
    let peak = 0;
    let maxDrawdown = 0;
    let runningTotal = 0;
    const sortedTrades = [...trades].sort(
        (a, b) => a.exitDate.getTime() - b.exitDate.getTime()
    );
    for (const trade of sortedTrades) {
        runningTotal += trade.pnl;
        if (runningTotal > peak) {
            peak = runningTotal;
        }
        const drawdown = peak - runningTotal;
        if (drawdown > maxDrawdown) {
            maxDrawdown = drawdown;
        }
    }

    // Calculate average trade duration
    const totalDuration = trades.reduce((sum, t) => {
        return sum + (t.exitDate.getTime() - t.entryDate.getTime());
    }, 0);
    const avgTradeDuration = totalDuration / trades.length / (1000 * 60 * 60); // in hours

    // Calculate consecutive wins/losses
    let currentWinStreak = 0;
    let currentLossStreak = 0;
    let maxWinStreak = 0;
    let maxLossStreak = 0;

    for (const trade of sortedTrades) {
        if (trade.pnl > 0) {
            currentWinStreak++;
            currentLossStreak = 0;
            maxWinStreak = Math.max(maxWinStreak, currentWinStreak);
        } else if (trade.pnl < 0) {
            currentLossStreak++;
            currentWinStreak = 0;
            maxLossStreak = Math.max(maxLossStreak, currentLossStreak);
        }
    }

    // Calculate Sharpe Ratio (simplified - daily returns std dev)
    const returns = trades.map((t) => t.pnlPercent);
    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);
    const sharpeRatio = stdDev > 0 ? (avgReturn / stdDev) * Math.sqrt(252) : 0;

    return {
        totalTrades: trades.length,
        winningTrades: winningTrades.length,
        losingTrades: losingTrades.length,
        winRate,
        totalPnL,
        avgWin,
        avgLoss,
        largestWin,
        largestLoss,
        profitFactor,
        avgRiskReward,
        expectancy,
        sharpeRatio,
        maxDrawdown,
        avgTradeDuration,
        consecutiveWins: maxWinStreak,
        consecutiveLosses: maxLossStreak,
    };
}

export function useTrades() {
    const { user } = useAuth();
    const {
        trades,
        stats,
        loading,
        error,
        setTrades,
        setStats,
        setLoading,
        setError,
        addTrade: addTradeToStore,
        updateTrade: updateTradeInStore,
        removeTrade: removeTradeFromStore,
    } = useTradeStore();

    // Subscribe to real-time trade updates
    useEffect(() => {
        if (!user) {
            setTrades([]);
            return;
        }

        setLoading(true);
        const tradesRef = collection(db, "users", user.uid, "trades");
        const q = query(tradesRef, orderBy("exitDate", "desc"), limit(500));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const tradesData = snapshot.docs.map((doc) =>
                    convertFirestoreToTrade(doc.data(), doc.id)
                );
                setTrades(tradesData);
                setStats(calculateStats(tradesData));
            },
            (err) => {
                console.error("Error fetching trades:", err);
                setError("Failed to load trades");
            }
        );

        return () => unsubscribe();
    }, [user, setTrades, setStats, setLoading, setError]);

    const addTrade = useCallback(
        async (input: TradeInput) => {
            if (!user) throw new Error("Not authenticated");

            const pnl = calculatePnL(
                input.entryPrice,
                input.exitPrice,
                input.quantity,
                input.side
            ) - (input.commission || 0);

            const pnlPercent = calculatePnLPercent(
                input.entryPrice,
                input.exitPrice,
                input.side
            );

            const riskReward = input.stopLoss && input.takeProfit
                ? calculateRiskReward(
                    input.entryPrice,
                    input.stopLoss,
                    input.takeProfit,
                    input.side
                )
                : 0;

            const positionSize = input.entryPrice * input.quantity;

            const tradeData = {
                userId: user.uid,
                accountId: input.accountId || "",
                symbol: input.symbol.toUpperCase(),
                side: input.side,
                entryPrice: input.entryPrice,
                exitPrice: input.exitPrice,
                quantity: input.quantity,
                entryDate: Timestamp.fromDate(input.entryDate),
                exitDate: Timestamp.fromDate(input.exitDate),
                pnl,
                pnlPercent,
                commission: input.commission || 0,
                strategy: input.strategy || "Unspecified",
                tags: input.tags || [],
                emotion: input.emotion || "neutral",
                notes: input.notes || "",
                setupScore: 0,
                screenshots: input.screenshots || [],
                riskReward,
                positionSize,
                stopLoss: input.stopLoss || 0,
                takeProfit: input.takeProfit || 0,
                marketCondition: input.marketCondition || "ranging",
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
            };

            const tradesRef = collection(db, "users", user.uid, "trades");
            const docRef = await addDoc(tradesRef, tradeData);

            return { id: docRef.id, pnl };
        },
        [user]
    );

    const updateTrade = useCallback(
        async (tradeId: string, input: Partial<TradeInput>) => {
            if (!user) throw new Error("Not authenticated");

            const tradeRef = doc(db, "users", user.uid, "trades", tradeId);

            const updateData: Record<string, unknown> = {
                ...input,
                updatedAt: Timestamp.now(),
            };

            if (input.entryDate) {
                updateData.entryDate = Timestamp.fromDate(input.entryDate);
            }
            if (input.exitDate) {
                updateData.exitDate = Timestamp.fromDate(input.exitDate);
            }

            // Recalculate PnL if price/quantity changed
            if (input.entryPrice || input.exitPrice || input.quantity) {
                const existingTrade = trades.find((t) => t.id === tradeId);
                if (existingTrade) {
                    const entryPrice = input.entryPrice ?? existingTrade.entryPrice;
                    const exitPrice = input.exitPrice ?? existingTrade.exitPrice;
                    const quantity = input.quantity ?? existingTrade.quantity;
                    const side = existingTrade.side;

                    updateData.pnl = calculatePnL(entryPrice, exitPrice, quantity, side) -
                        (existingTrade.commission || 0);
                    updateData.pnlPercent = calculatePnLPercent(entryPrice, exitPrice, side);
                    updateData.positionSize = entryPrice * quantity;
                }
            }

            await updateDoc(tradeRef, updateData);
        },
        [user, trades]
    );

    const deleteTrade = useCallback(
        async (tradeId: string) => {
            if (!user) throw new Error("Not authenticated");

            const tradeRef = doc(db, "users", user.uid, "trades", tradeId);
            await deleteDoc(tradeRef);
        },
        [user]
    );

    return {
        trades,
        stats,
        loading,
        error,
        addTrade,
        updateTrade,
        deleteTrade,
    };
}
