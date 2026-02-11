export type AccountType = "live" | "funded" | "demo";

export type TransactionType = "deposit" | "withdrawal";

export interface TradingAccount {
    id: string;
    userId: string;
    name: string;
    type: AccountType;
    broker: string;
    balance: number;
    initialBalance: number;
    currency: string;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface AccountInput {
    name: string;
    type: AccountType;
    broker: string;
    initialBalance: number;
    currency: string;
}

export interface Transaction {
    id: string;
    userId: string;
    accountId: string;
    type: TransactionType;
    amount: number;
    note: string;
    createdAt: Date;
}

export interface TransactionInput {
    accountId: string;
    type: TransactionType;
    amount: number;
    note?: string;
}

export interface Strategy {
    id: string;
    userId: string;
    name: string;
    description: string;
    color: string;
    totalTrades: number;
    wins: number;
    losses: number;
    winRate: number;
    totalPnL: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface StrategyInput {
    name: string;
    description?: string;
    color?: string;
}

export interface JournalEntry {
    id: string;
    userId: string;
    accountId: string;
    tradeId?: string;
    title: string;
    content: string;
    mood: "great" | "good" | "neutral" | "bad" | "terrible";
    tags: string[];
    lessonsLearned: string;
    mistakes: string;
    improvements: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface JournalEntryInput {
    accountId: string;
    tradeId?: string;
    title: string;
    content: string;
    mood: "great" | "good" | "neutral" | "bad" | "terrible";
    tags?: string[];
    lessonsLearned?: string;
    mistakes?: string;
    improvements?: string;
}

export interface TradeRule {
    id: string;
    userId: string;
    rule: string;
    category: "entry" | "exit" | "risk" | "general";
    isActive: boolean;
    createdAt: Date;
}

export interface TradeRuleInput {
    rule: string;
    category: "entry" | "exit" | "risk" | "general";
}

export interface UserSettings {
    defaultCurrency: string;
    timezone: string;
}

// Combined transaction history for the History page
export interface HistoryItem {
    id: string;
    type: "trade" | "deposit" | "withdrawal";
    accountId: string;
    accountName: string;
    amount: number;
    description: string;
    date: Date;
}
