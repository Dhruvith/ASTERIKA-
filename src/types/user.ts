export interface User {
    uid: string;
    email: string;
    displayName: string | null;
    photoURL: string | null;
    createdAt: Date;
    preferences: UserPreferences;
    stats: UserStats;
}

export interface UserPreferences {
    theme: "light" | "dark";
    defaultCurrency: string;
    timezone: string;
    startingCapital: number;
}

export interface UserStats {
    totalTrades: number;
    winRate: number;
    totalPnL: number;
    lastUpdated: Date;
}

export interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}
