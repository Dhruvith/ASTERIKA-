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
    getDocs,
    where,
    increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAccountStore } from "@/store/useAccountStore";
import { useAuth } from "./useAuth";
import {
    TradingAccount,
    AccountInput,
    Transaction,
    TransactionInput,
    Strategy,
    StrategyInput,
    JournalEntry,
    JournalEntryInput,
    TradeRule,
    TradeRuleInput,
} from "@/types/account";
import { generateId } from "@/lib/utils";

export function useAccounts() {
    const { user } = useAuth();
    const {
        accounts,
        defaultAccountId,
        transactions,
        strategies,
        journalEntries,
        tradeRules,
        loading,
        error,
        setAccounts,
        setDefaultAccountId,
        setTransactions,
        setStrategies,
        setJournalEntries,
        setTradeRules,
        setLoading,
        setError,
        addAccount: addAccountToStore,
        updateAccount: updateAccountInStore,
        addTransaction: addTransactionToStore,
        addStrategy: addStrategyToStore,
        addJournalEntry: addJournalEntryToStore,
        addTradeRule: addTradeRuleToStore,
    } = useAccountStore();

    // Subscribe to accounts
    useEffect(() => {
        if (!user) {
            setAccounts([]);
            return;
        }

        setLoading(true);
        const accountsRef = collection(db, "users", user.uid, "accounts");
        const q = query(accountsRef, orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const accountsData: TradingAccount[] = snapshot.docs.map((docSnap) => {
                    const data = docSnap.data();
                    return {
                        id: docSnap.id,
                        userId: data.userId,
                        name: data.name,
                        type: data.type,
                        broker: data.broker,
                        balance: data.balance || 0,
                        initialBalance: data.initialBalance || 0,
                        currency: data.currency || "USD",
                        isDefault: data.isDefault || false,
                        createdAt: data.createdAt?.toDate() || new Date(),
                        updatedAt: data.updatedAt?.toDate() || new Date(),
                    };
                });
                setAccounts(accountsData);
                setLoading(false);

                // Set default account if none set
                const defaultAcc = accountsData.find((a) => a.isDefault);
                if (defaultAcc && !defaultAccountId) {
                    setDefaultAccountId(defaultAcc.id);
                } else if (accountsData.length > 0 && !defaultAccountId) {
                    setDefaultAccountId(accountsData[0].id);
                }
            },
            (err) => {
                console.error("Error fetching accounts:", err);
                setError("Failed to load accounts");
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [user]);

    // Subscribe to transactions
    useEffect(() => {
        if (!user) {
            setTransactions([]);
            return;
        }

        const txRef = collection(db, "users", user.uid, "transactions");
        const q = query(txRef, orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const txData: Transaction[] = snapshot.docs.map((docSnap) => {
                    const data = docSnap.data();
                    return {
                        id: docSnap.id,
                        userId: data.userId,
                        accountId: data.accountId,
                        type: data.type,
                        amount: data.amount,
                        note: data.note || "",
                        createdAt: data.createdAt?.toDate() || new Date(),
                    };
                });
                setTransactions(txData);
            },
            (err) => {
                console.error("Error fetching transactions:", err);
            }
        );

        return () => unsubscribe();
    }, [user]);

    // Subscribe to strategies
    useEffect(() => {
        if (!user) {
            setStrategies([]);
            return;
        }

        const stratRef = collection(db, "users", user.uid, "strategies");
        const q = query(stratRef, orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const stratData: Strategy[] = snapshot.docs.map((docSnap) => {
                    const data = docSnap.data();
                    return {
                        id: docSnap.id,
                        userId: data.userId,
                        name: data.name,
                        description: data.description || "",
                        color: data.color || "#3b82f6",
                        totalTrades: data.totalTrades || 0,
                        wins: data.wins || 0,
                        losses: data.losses || 0,
                        winRate: data.winRate || 0,
                        totalPnL: data.totalPnL || 0,
                        createdAt: data.createdAt?.toDate() || new Date(),
                        updatedAt: data.updatedAt?.toDate() || new Date(),
                    };
                });
                setStrategies(stratData);
            },
            (err) => {
                console.error("Error fetching strategies:", err);
            }
        );

        return () => unsubscribe();
    }, [user]);

    // Subscribe to journal entries
    useEffect(() => {
        if (!user) {
            setJournalEntries([]);
            return;
        }

        const journalRef = collection(db, "users", user.uid, "journal");
        const q = query(journalRef, orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const entries: JournalEntry[] = snapshot.docs.map((docSnap) => {
                    const data = docSnap.data();
                    return {
                        id: docSnap.id,
                        userId: data.userId,
                        accountId: data.accountId || "",
                        tradeId: data.tradeId || undefined,
                        title: data.title,
                        content: data.content,
                        mood: data.mood || "neutral",
                        tags: data.tags || [],
                        lessonsLearned: data.lessonsLearned || "",
                        mistakes: data.mistakes || "",
                        improvements: data.improvements || "",
                        createdAt: data.createdAt?.toDate() || new Date(),
                        updatedAt: data.updatedAt?.toDate() || new Date(),
                    };
                });
                setJournalEntries(entries);
            },
            (err) => {
                console.error("Error fetching journal entries:", err);
            }
        );

        return () => unsubscribe();
    }, [user]);

    // Subscribe to trade rules
    useEffect(() => {
        if (!user) {
            setTradeRules([]);
            return;
        }

        const rulesRef = collection(db, "users", user.uid, "tradeRules");
        const q = query(rulesRef, orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const rules: TradeRule[] = snapshot.docs.map((docSnap) => {
                    const data = docSnap.data();
                    return {
                        id: docSnap.id,
                        userId: data.userId,
                        rule: data.rule,
                        category: data.category,
                        isActive: data.isActive !== false,
                        createdAt: data.createdAt?.toDate() || new Date(),
                    };
                });
                setTradeRules(rules);
            },
            (err) => {
                console.error("Error fetching trade rules:", err);
            }
        );

        return () => unsubscribe();
    }, [user]);

    // CRUD Operations

    const createAccount = useCallback(
        async (input: AccountInput) => {
            if (!user) throw new Error("Not authenticated");

            const accountData = {
                userId: user.uid,
                name: input.name,
                type: input.type,
                broker: input.broker,
                balance: input.initialBalance,
                initialBalance: input.initialBalance,
                currency: input.currency,
                isDefault: accounts.length === 0,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
            };

            const accountsRef = collection(db, "users", user.uid, "accounts");
            const docRef = await addDoc(accountsRef, accountData);

            // Create initial deposit transaction
            const txData = {
                userId: user.uid,
                accountId: docRef.id,
                type: "deposit",
                amount: input.initialBalance,
                note: "Initial deposit",
                createdAt: Timestamp.now(),
            };

            const txRef = collection(db, "users", user.uid, "transactions");
            await addDoc(txRef, txData);

            return docRef.id;
        },
        [user, accounts]
    );

    const setDefaultAccount = useCallback(
        async (accountId: string) => {
            if (!user) throw new Error("Not authenticated");

            // Unset all defaults
            for (const account of accounts) {
                if (account.isDefault) {
                    const ref = doc(db, "users", user.uid, "accounts", account.id);
                    await updateDoc(ref, { isDefault: false });
                }
            }

            // Set new default
            const ref = doc(db, "users", user.uid, "accounts", accountId);
            await updateDoc(ref, { isDefault: true });
            setDefaultAccountId(accountId);
        },
        [user, accounts, setDefaultAccountId]
    );

    const deleteAccount = useCallback(
        async (accountId: string) => {
            if (!user) throw new Error("Not authenticated");

            const ref = doc(db, "users", user.uid, "accounts", accountId);
            await deleteDoc(ref);

            if (defaultAccountId === accountId) {
                const remaining = accounts.filter((a) => a.id !== accountId);
                setDefaultAccountId(remaining.length > 0 ? remaining[0].id : null);
            }
        },
        [user, accounts, defaultAccountId, setDefaultAccountId]
    );

    const addDeposit = useCallback(
        async (input: TransactionInput) => {
            if (!user) throw new Error("Not authenticated");

            // Add transaction
            const txData = {
                userId: user.uid,
                accountId: input.accountId,
                type: "deposit",
                amount: input.amount,
                note: input.note || "Deposit",
                createdAt: Timestamp.now(),
            };

            const txRef = collection(db, "users", user.uid, "transactions");
            await addDoc(txRef, txData);

            // Update account balance
            const accountRef = doc(db, "users", user.uid, "accounts", input.accountId);
            await updateDoc(accountRef, {
                balance: increment(input.amount),
                updatedAt: Timestamp.now(),
            });
        },
        [user]
    );

    const addWithdrawal = useCallback(
        async (input: TransactionInput) => {
            if (!user) throw new Error("Not authenticated");

            // Add transaction
            const txData = {
                userId: user.uid,
                accountId: input.accountId,
                type: "withdrawal",
                amount: input.amount,
                note: input.note || "Withdrawal",
                createdAt: Timestamp.now(),
            };

            const txRef = collection(db, "users", user.uid, "transactions");
            await addDoc(txRef, txData);

            // Update account balance
            const accountRef = doc(db, "users", user.uid, "accounts", input.accountId);
            await updateDoc(accountRef, {
                balance: increment(-input.amount),
                updatedAt: Timestamp.now(),
            });
        },
        [user]
    );

    const createStrategy = useCallback(
        async (input: StrategyInput) => {
            if (!user) throw new Error("Not authenticated");

            const stratData = {
                userId: user.uid,
                name: input.name,
                description: input.description || "",
                color: input.color || "#3b82f6",
                totalTrades: 0,
                wins: 0,
                losses: 0,
                winRate: 0,
                totalPnL: 0,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
            };

            const stratRef = collection(db, "users", user.uid, "strategies");
            const docRef = await addDoc(stratRef, stratData);
            return docRef.id;
        },
        [user]
    );

    const deleteStrategy = useCallback(
        async (strategyId: string) => {
            if (!user) throw new Error("Not authenticated");

            const ref = doc(db, "users", user.uid, "strategies", strategyId);
            await deleteDoc(ref);
        },
        [user]
    );

    const createJournalEntry = useCallback(
        async (input: JournalEntryInput) => {
            if (!user) throw new Error("Not authenticated");

            const entryData = {
                userId: user.uid,
                accountId: input.accountId,
                tradeId: input.tradeId || null,
                title: input.title,
                content: input.content,
                mood: input.mood,
                tags: input.tags || [],
                lessonsLearned: input.lessonsLearned || "",
                mistakes: input.mistakes || "",
                improvements: input.improvements || "",
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
            };

            const journalRef = collection(db, "users", user.uid, "journal");
            const docRef = await addDoc(journalRef, entryData);
            return docRef.id;
        },
        [user]
    );

    const createTradeRule = useCallback(
        async (input: TradeRuleInput) => {
            if (!user) throw new Error("Not authenticated");

            const ruleData = {
                userId: user.uid,
                rule: input.rule,
                category: input.category,
                isActive: true,
                createdAt: Timestamp.now(),
            };

            const rulesRef = collection(db, "users", user.uid, "tradeRules");
            const docRef = await addDoc(rulesRef, ruleData);
            return docRef.id;
        },
        [user]
    );

    const deleteTradeRule = useCallback(
        async (ruleId: string) => {
            if (!user) throw new Error("Not authenticated");

            const ref = doc(db, "users", user.uid, "tradeRules", ruleId);
            await deleteDoc(ref);
        },
        [user]
    );

    const toggleTradeRuleActive = useCallback(
        async (ruleId: string) => {
            if (!user) throw new Error("Not authenticated");

            const rule = tradeRules.find((r) => r.id === ruleId);
            if (!rule) return;

            const ref = doc(db, "users", user.uid, "tradeRules", ruleId);
            await updateDoc(ref, { isActive: !rule.isActive });
        },
        [user, tradeRules]
    );

    // Update account balance after trade
    const updateAccountBalanceForTrade = useCallback(
        async (accountId: string, pnl: number) => {
            if (!user) throw new Error("Not authenticated");

            const accountRef = doc(db, "users", user.uid, "accounts", accountId);
            await updateDoc(accountRef, {
                balance: increment(pnl),
                updatedAt: Timestamp.now(),
            });
        },
        [user]
    );

    // Update strategy stats after trade
    const updateStrategyStats = useCallback(
        async (strategyName: string, pnl: number) => {
            if (!user) throw new Error("Not authenticated");

            const strategy = strategies.find((s) => s.name === strategyName);
            if (!strategy) return;

            const newTotalTrades = strategy.totalTrades + 1;
            const newWins = pnl > 0 ? strategy.wins + 1 : strategy.wins;
            const newLosses = pnl < 0 ? strategy.losses + 1 : strategy.losses;
            const newTotalPnL = strategy.totalPnL + pnl;
            const newWinRate = newTotalTrades > 0 ? (newWins / newTotalTrades) * 100 : 0;

            const ref = doc(db, "users", user.uid, "strategies", strategy.id);
            await updateDoc(ref, {
                totalTrades: newTotalTrades,
                wins: newWins,
                losses: newLosses,
                totalPnL: newTotalPnL,
                winRate: newWinRate,
                updatedAt: Timestamp.now(),
            });
        },
        [user, strategies]
    );

    const defaultAccount = accounts.find((a) => a.id === defaultAccountId) || accounts[0] || null;

    return {
        accounts,
        defaultAccount,
        defaultAccountId,
        transactions,
        strategies,
        journalEntries,
        tradeRules,
        loading,
        error,
        createAccount,
        setDefaultAccount,
        deleteAccount,
        addDeposit,
        addWithdrawal,
        createStrategy,
        deleteStrategy,
        createJournalEntry,
        createTradeRule,
        deleteTradeRule,
        toggleTradeRuleActive,
        updateAccountBalanceForTrade,
        updateStrategyStats,
    };
}
