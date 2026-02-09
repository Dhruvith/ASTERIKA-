import { create } from "zustand";
import { Trade, TradeStats } from "@/types/trade";

interface TradeStore {
    trades: Trade[];
    stats: TradeStats | null;
    loading: boolean;
    error: string | null;
    selectedTrade: Trade | null;
    isAddModalOpen: boolean;
    isEditModalOpen: boolean;
    dateFilter: { start: Date | null; end: Date | null };
    strategyFilter: string | null;
    searchQuery: string;

    setTrades: (trades: Trade[]) => void;
    setStats: (stats: TradeStats) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setSelectedTrade: (trade: Trade | null) => void;
    openAddModal: () => void;
    closeAddModal: () => void;
    openEditModal: (trade: Trade) => void;
    closeEditModal: () => void;
    setDateFilter: (start: Date | null, end: Date | null) => void;
    setStrategyFilter: (strategy: string | null) => void;
    setSearchQuery: (query: string) => void;
    addTrade: (trade: Trade) => void;
    updateTrade: (trade: Trade) => void;
    removeTrade: (tradeId: string) => void;
}

export const useTradeStore = create<TradeStore>((set) => ({
    trades: [],
    stats: null,
    loading: true,
    error: null,
    selectedTrade: null,
    isAddModalOpen: false,
    isEditModalOpen: false,
    dateFilter: { start: null, end: null },
    strategyFilter: null,
    searchQuery: "",

    setTrades: (trades) => set({ trades, loading: false }),
    setStats: (stats) => set({ stats }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error, loading: false }),
    setSelectedTrade: (selectedTrade) => set({ selectedTrade }),
    openAddModal: () => set({ isAddModalOpen: true }),
    closeAddModal: () => set({ isAddModalOpen: false }),
    openEditModal: (trade) => set({ isEditModalOpen: true, selectedTrade: trade }),
    closeEditModal: () => set({ isEditModalOpen: false, selectedTrade: null }),
    setDateFilter: (start, end) => set({ dateFilter: { start, end } }),
    setStrategyFilter: (strategyFilter) => set({ strategyFilter }),
    setSearchQuery: (searchQuery) => set({ searchQuery }),
    addTrade: (trade) => set((state) => ({ trades: [trade, ...state.trades] })),
    updateTrade: (trade) =>
        set((state) => ({
            trades: state.trades.map((t) => (t.id === trade.id ? trade : t)),
        })),
    removeTrade: (tradeId) =>
        set((state) => ({
            trades: state.trades.filter((t) => t.id !== tradeId),
        })),
}));
