import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TradingAccount, Transaction, Strategy, JournalEntry, TradeRule } from "@/types/account";

interface AccountStore {
    accounts: TradingAccount[];
    defaultAccountId: string | null;
    transactions: Transaction[];
    strategies: Strategy[];
    journalEntries: JournalEntry[];
    tradeRules: TradeRule[];
    loading: boolean;
    error: string | null;

    // Modals
    isAddAccountModalOpen: boolean;
    isDepositModalOpen: boolean;
    isWithdrawModalOpen: boolean;
    isAddStrategyModalOpen: boolean;
    isAddJournalModalOpen: boolean;
    isAddRuleModalOpen: boolean;
    selectedAccountId: string | null;

    // Actions
    setAccounts: (accounts: TradingAccount[]) => void;
    setDefaultAccountId: (id: string | null) => void;
    setTransactions: (transactions: Transaction[]) => void;
    setStrategies: (strategies: Strategy[]) => void;
    setJournalEntries: (entries: JournalEntry[]) => void;
    setTradeRules: (rules: TradeRule[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    // Modal actions
    openAddAccountModal: () => void;
    closeAddAccountModal: () => void;
    openDepositModal: (accountId: string) => void;
    closeDepositModal: () => void;
    openWithdrawModal: (accountId: string) => void;
    closeWithdrawModal: () => void;
    openAddStrategyModal: () => void;
    closeAddStrategyModal: () => void;
    openAddJournalModal: () => void;
    closeAddJournalModal: () => void;
    openAddRuleModal: () => void;
    closeAddRuleModal: () => void;

    // Account helpers
    addAccount: (account: TradingAccount) => void;
    updateAccount: (account: TradingAccount) => void;
    removeAccount: (id: string) => void;
    addTransaction: (transaction: Transaction) => void;
    addStrategy: (strategy: Strategy) => void;
    updateStrategy: (strategy: Strategy) => void;
    removeStrategy: (id: string) => void;
    addJournalEntry: (entry: JournalEntry) => void;
    addTradeRule: (rule: TradeRule) => void;
    removeTradeRule: (id: string) => void;
    toggleTradeRule: (id: string) => void;
}

export const useAccountStore = create<AccountStore>()(
    persist(
        (set) => ({
            accounts: [],
            defaultAccountId: null,
            transactions: [],
            strategies: [],
            journalEntries: [],
            tradeRules: [],
            loading: false,
            error: null,

            isAddAccountModalOpen: false,
            isDepositModalOpen: false,
            isWithdrawModalOpen: false,
            isAddStrategyModalOpen: false,
            isAddJournalModalOpen: false,
            isAddRuleModalOpen: false,
            selectedAccountId: null,

            setAccounts: (accounts) => set({ accounts }),
            setDefaultAccountId: (defaultAccountId) => set({ defaultAccountId }),
            setTransactions: (transactions) => set({ transactions }),
            setStrategies: (strategies) => set({ strategies }),
            setJournalEntries: (journalEntries) => set({ journalEntries }),
            setTradeRules: (tradeRules) => set({ tradeRules }),
            setLoading: (loading) => set({ loading }),
            setError: (error) => set({ error }),

            openAddAccountModal: () => set({ isAddAccountModalOpen: true }),
            closeAddAccountModal: () => set({ isAddAccountModalOpen: false }),
            openDepositModal: (accountId) =>
                set({ isDepositModalOpen: true, selectedAccountId: accountId }),
            closeDepositModal: () =>
                set({ isDepositModalOpen: false, selectedAccountId: null }),
            openWithdrawModal: (accountId) =>
                set({ isWithdrawModalOpen: true, selectedAccountId: accountId }),
            closeWithdrawModal: () =>
                set({ isWithdrawModalOpen: false, selectedAccountId: null }),
            openAddStrategyModal: () => set({ isAddStrategyModalOpen: true }),
            closeAddStrategyModal: () => set({ isAddStrategyModalOpen: false }),
            openAddJournalModal: () => set({ isAddJournalModalOpen: true }),
            closeAddJournalModal: () => set({ isAddJournalModalOpen: false }),
            openAddRuleModal: () => set({ isAddRuleModalOpen: true }),
            closeAddRuleModal: () => set({ isAddRuleModalOpen: false }),

            addAccount: (account) =>
                set((state) => ({ accounts: [account, ...state.accounts] })),
            updateAccount: (account) =>
                set((state) => ({
                    accounts: state.accounts.map((a) =>
                        a.id === account.id ? account : a
                    ),
                })),
            removeAccount: (id) =>
                set((state) => ({
                    accounts: state.accounts.filter((a) => a.id !== id),
                })),
            addTransaction: (transaction) =>
                set((state) => ({
                    transactions: [transaction, ...state.transactions],
                })),
            addStrategy: (strategy) =>
                set((state) => ({
                    strategies: [strategy, ...state.strategies],
                })),
            updateStrategy: (strategy) =>
                set((state) => ({
                    strategies: state.strategies.map((s) =>
                        s.id === strategy.id ? strategy : s
                    ),
                })),
            removeStrategy: (id) =>
                set((state) => ({
                    strategies: state.strategies.filter((s) => s.id !== id),
                })),
            addJournalEntry: (entry) =>
                set((state) => ({
                    journalEntries: [entry, ...state.journalEntries],
                })),
            addTradeRule: (rule) =>
                set((state) => ({
                    tradeRules: [rule, ...state.tradeRules],
                })),
            removeTradeRule: (id) =>
                set((state) => ({
                    tradeRules: state.tradeRules.filter((r) => r.id !== id),
                })),
            toggleTradeRule: (id) =>
                set((state) => ({
                    tradeRules: state.tradeRules.map((r) =>
                        r.id === id ? { ...r, isActive: !r.isActive } : r
                    ),
                })),
        }),
        {
            name: "asterika-accounts-storage",
            partialize: (state) => ({
                defaultAccountId: state.defaultAccountId,
            }),
        }
    )
);
