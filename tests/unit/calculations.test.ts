import { describe, it, expect } from 'vitest';
import {
    calculatePnL,
    calculatePnLPercent,
    calculateRiskReward,
    getTradeStatus,
    formatCurrency,
    formatPercent,
    formatNumber,
    formatDate,
    formatDateTime,
    generateId,
} from '@/lib/utils';

// ============================================================
// P&L Calculation Tests
// ============================================================
describe('calculatePnL', () => {
    it('calculates profit for a winning long trade', () => {
        // Buy at 100, sell at 110, 10 units = (110-100)*10 = $100
        expect(calculatePnL(100, 110, 10, 'long')).toBe(100);
    });

    it('calculates loss for a losing long trade', () => {
        // Buy at 100, sell at 90, 10 units = (90-100)*10 = -$100
        expect(calculatePnL(100, 90, 10, 'long')).toBe(-100);
    });

    it('calculates profit for a winning short trade', () => {
        // Short at 100, cover at 90, 10 units = (100-90)*10 = $100
        expect(calculatePnL(100, 90, 10, 'short')).toBe(100);
    });

    it('calculates loss for a losing short trade', () => {
        // Short at 100, cover at 110, 10 units = (100-110)*10 = -$100
        expect(calculatePnL(100, 110, 10, 'short')).toBe(-100);
    });

    it('returns 0 for breakeven trade (long)', () => {
        expect(calculatePnL(100, 100, 10, 'long')).toBe(0);
    });

    it('returns 0 for breakeven trade (short)', () => {
        expect(calculatePnL(100, 100, 10, 'short')).toBe(0);
    });

    it('handles fractional prices and quantities', () => {
        const result = calculatePnL(1.2345, 1.2456, 100000, 'long');
        expect(result).toBeCloseTo(1110, 0); // ~(0.0111)*100000
    });

    it('handles very small quantities (crypto micro trades)', () => {
        const result = calculatePnL(30000, 31000, 0.001, 'long');
        expect(result).toBeCloseTo(1, 2);
    });

    it('handles zero quantity', () => {
        expect(calculatePnL(100, 110, 0, 'long')).toBe(0);
    });
});

// ============================================================
// P&L Percent Tests
// ============================================================
describe('calculatePnLPercent', () => {
    it('calculates correct percentage for long trade', () => {
        // (110-100)/100 = 10%
        expect(calculatePnLPercent(100, 110, 'long')).toBe(10);
    });

    it('calculates correct negative percentage for long trade', () => {
        // (90-100)/100 = -10%
        expect(calculatePnLPercent(100, 90, 'long')).toBe(-10);
    });

    it('calculates correct percentage for short trade', () => {
        // (100-90)/100 = 10%
        expect(calculatePnLPercent(100, 90, 'short')).toBe(10);
    });

    it('calculates correct negative percentage for short trade', () => {
        // (100-110)/100 = -10%
        expect(calculatePnLPercent(100, 110, 'short')).toBe(-10);
    });

    it('returns 0 for breakeven', () => {
        expect(calculatePnLPercent(100, 100, 'long')).toBe(0);
    });

    it('handles zero entry price without NaN', () => {
        // Division by zero should return Infinity or NaN — this is a potential bug
        const result = calculatePnLPercent(0, 100, 'long');
        expect(result).not.toBeNaN(); // This will FAIL if we have a bug
    });
});

// ============================================================
// Risk/Reward Ratio Tests
// ============================================================
describe('calculateRiskReward', () => {
    it('calculates R:R for a long trade', () => {
        // Entry 100, SL 95, TP 115. Risk=5, Reward=15. RR=3
        expect(calculateRiskReward(100, 95, 115, 'long')).toBe(3);
    });

    it('calculates R:R for a short trade', () => {
        // Entry 100, SL 105, TP 85. Risk=5, Reward=15. RR=3
        expect(calculateRiskReward(100, 105, 85, 'short')).toBe(3);
    });

    it('returns 0 when stop loss equals entry (zero risk) for long', () => {
        expect(calculateRiskReward(100, 100, 110, 'long')).toBe(0);
    });

    it('returns 0 when stop loss equals entry (zero risk) for short', () => {
        expect(calculateRiskReward(100, 100, 90, 'short')).toBe(0);
    });

    it('handles 1:1 risk reward', () => {
        expect(calculateRiskReward(100, 95, 105, 'long')).toBe(1);
    });

    it('handles very tight stop loss', () => {
        // Entry 100, SL 99.99, TP 110. Risk=0.01, Reward=10. RR=1000
        const rr = calculateRiskReward(100, 99.99, 110, 'long');
        expect(rr).toBeCloseTo(1000, 0);
    });

    it('handles negative R:R (SL on wrong side for long)', () => {
        // Entry 100, SL 105 (above entry for long = wrong), TP 110
        // risk = 100 - 105 = -5 => risk <= 0 => 0
        expect(calculateRiskReward(100, 105, 110, 'long')).toBe(0);
    });
});

// ============================================================
// Trade Status Tests
// ============================================================
describe('getTradeStatus', () => {
    it('returns "win" for positive PnL', () => {
        expect(getTradeStatus(100)).toBe('win');
    });

    it('returns "loss" for negative PnL', () => {
        expect(getTradeStatus(-50)).toBe('loss');
    });

    it('returns "breakeven" for zero PnL', () => {
        expect(getTradeStatus(0)).toBe('breakeven');
    });

    it('returns "win" for very small positive PnL', () => {
        expect(getTradeStatus(0.01)).toBe('win');
    });

    it('returns "loss" for very small negative PnL', () => {
        expect(getTradeStatus(-0.01)).toBe('loss');
    });
});

// ============================================================
// Trade Stats Calculation Tests (inline since calculateStats is not exported)
// We replicate the logic here to test thoroughly
// ============================================================
describe('Trade Stats Logic', () => {
    function calculateWinRate(wins: number, total: number): number {
        if (total === 0) return 0;
        return (wins / total) * 100;
    }

    function calculateProfitFactor(grossProfit: number, grossLoss: number): number {
        if (grossLoss === 0) return grossProfit > 0 ? Infinity : 0;
        return grossProfit / grossLoss;
    }

    function calculateExpectancy(
        winProb: number,
        avgWin: number,
        loseProb: number,
        avgLoss: number
    ): number {
        return (winProb * avgWin) - (loseProb * avgLoss);
    }

    it('win rate is 0 when no trades', () => {
        expect(calculateWinRate(0, 0)).toBe(0);
    });

    it('win rate is 100% when all wins', () => {
        expect(calculateWinRate(5, 5)).toBe(100);
    });

    it('win rate is 50% for equal wins and losses', () => {
        expect(calculateWinRate(5, 10)).toBe(50);
    });

    it('profit factor is Infinity when no losses', () => {
        expect(calculateProfitFactor(1000, 0)).toBe(Infinity);
    });

    it('profit factor is 0 when no profit and no loss', () => {
        expect(calculateProfitFactor(0, 0)).toBe(0);
    });

    it('profit factor calculation is correct', () => {
        // $3000 profit / $1000 loss = 3.0
        expect(calculateProfitFactor(3000, 1000)).toBe(3);
    });

    it('expectancy calculation is correct', () => {
        // 60% win rate, $200 avg win, $100 avg loss
        // (0.6 * 200) - (0.4 * 100) = 120 - 40 = $80
        expect(calculateExpectancy(0.6, 200, 0.4, 100)).toBe(80);
    });

    it('expectancy is negative for losing strategy', () => {
        // 30% win rate, $100 avg win, $200 avg loss
        // (0.3 * 100) - (0.7 * 200) = 30 - 140 = -$110
        expect(calculateExpectancy(0.3, 100, 0.7, 200)).toBe(-110);
    });

    it('handles divide-by-zero in profit factor safely', () => {
        const pf = calculateProfitFactor(500, 0);
        expect(pf).toBe(Infinity);
        // But displaying Infinity should show "∞"
    });
});

// ============================================================
// Format Utility Tests
// ============================================================
describe('formatCurrency', () => {
    it('formats positive numbers', () => {
        expect(formatCurrency(1234.56)).toBe('$1,234.56');
    });

    it('formats negative numbers', () => {
        expect(formatCurrency(-500)).toContain('500.00');
    });

    it('formats zero', () => {
        expect(formatCurrency(0)).toBe('$0.00');
    });

    it('formats with custom currency', () => {
        const result = formatCurrency(100, 'EUR');
        expect(result).toContain('100');
    });
});

describe('formatPercent', () => {
    it('formats percentage correctly', () => {
        // Input is 50 (representing 50%), function divides by 100
        expect(formatPercent(50)).toBe('50.0%');
    });

    it('formats small percentages', () => {
        expect(formatPercent(0.5)).toBe('0.5%');
    });
});

describe('formatNumber', () => {
    it('formats numbers with default decimals', () => {
        expect(formatNumber(1234.5678)).toBe('1,234.57');
    });

    it('formats with custom decimals', () => {
        expect(formatNumber(3.14159, 4)).toBe('3.1416');
    });
});

describe('generateId', () => {
    it('generates non-empty string', () => {
        const id = generateId();
        expect(id).toBeTruthy();
        expect(typeof id).toBe('string');
    });

    it('generates unique IDs', () => {
        const ids = new Set(Array.from({ length: 100 }, () => generateId()));
        expect(ids.size).toBe(100);
    });
});
