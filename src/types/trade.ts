export type TradeSide = "long" | "short";

export type TradeEmotion = "calm" | "confident" | "fearful" | "fomo" | "neutral";

export type MarketCondition = "bullish" | "bearish" | "ranging" | "volatile";

export interface Trade {
    id: string;
    userId: string;
    accountId: string;
    symbol: string;
    side: TradeSide;
    entryPrice: number;
    exitPrice: number;
    quantity: number;
    entryDate: Date;
    exitDate: Date;
    pnl: number;
    pnlPercent: number;
    commission: number;
    strategy: string;
    tags: string[];
    emotion: TradeEmotion;
    notes: string;
    setupScore: number;
    screenshots: string[];
    riskReward: number;
    positionSize: number;
    stopLoss: number;
    takeProfit: number;
    marketCondition: MarketCondition;
    createdAt: Date;
    updatedAt: Date;
}

export interface TradeInput {
    accountId: string;
    symbol: string;
    side: TradeSide;
    entryPrice: number;
    exitPrice: number;
    quantity: number;
    entryDate: Date;
    exitDate: Date;
    commission?: number;
    strategy?: string;
    tags?: string[];
    emotion?: TradeEmotion;
    notes?: string;
    stopLoss?: number;
    takeProfit?: number;
    marketCondition?: MarketCondition;
    screenshots?: string[];
}

export interface TradeStats {
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    winRate: number;
    totalPnL: number;
    avgWin: number;
    avgLoss: number;
    largestWin: number;
    largestLoss: number;
    profitFactor: number;
    avgRiskReward: number;
    expectancy: number;
    sharpeRatio: number;
    maxDrawdown: number;
    avgTradeDuration: number;
    consecutiveWins: number;
    consecutiveLosses: number;
}

export interface Strategy {
    id: string;
    name: string;
    description: string;
    totalTrades: number;
    winRate: number;
    avgPnL: number;
    createdAt: Date;
}

export interface DailyStats {
    date: string;
    totalTrades: number;
    winCount: number;
    lossCount: number;
    totalPnL: number;
    largestWin: number;
    largestLoss: number;
}

export interface EquityPoint {
    date: string;
    value: number;
    pnl: number;
}
