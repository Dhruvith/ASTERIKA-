import { describe, it, expect } from 'vitest';
import {
    startOfDay,
    endOfDay,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    subDays,
    subWeeks,
    subMonths,
    isWithinInterval,
    format,
} from 'date-fns';

// ============================================================
// Date Filter Logic (replicating the filter patterns used in the app)
// ============================================================

interface MockTrade {
    id: string;
    exitDate: Date;
    pnl: number;
}

function createMockTrade(id: string, exitDate: Date, pnl: number): MockTrade {
    return { id, exitDate, pnl };
}

function filterTradesByDateRange(
    trades: MockTrade[],
    start: Date | null,
    end: Date | null
): MockTrade[] {
    if (!start && !end) return trades;

    return trades.filter((trade) => {
        const tradeDate = new Date(trade.exitDate);
        if (start && end) {
            return isWithinInterval(tradeDate, {
                start: startOfDay(start),
                end: endOfDay(end),
            });
        }
        if (start) {
            return tradeDate >= startOfDay(start);
        }
        if (end) {
            return tradeDate <= endOfDay(end);
        }
        return true;
    });
}

type QuickFilter = 'today' | 'thisWeek' | 'thisMonth' | 'allTime';

function getQuickFilterRange(filter: QuickFilter): {
    start: Date | null;
    end: Date | null;
} {
    const now = new Date();
    switch (filter) {
        case 'today':
            return { start: startOfDay(now), end: endOfDay(now) };
        case 'thisWeek':
            return { start: startOfWeek(now), end: endOfWeek(now) };
        case 'thisMonth':
            return { start: startOfMonth(now), end: endOfMonth(now) };
        case 'allTime':
            return { start: null, end: null };
    }
}

// ============================================================
// Tests
// ============================================================

describe('Date Range Filtering', () => {
    const now = new Date();
    const today = createMockTrade('t1', now, 100);
    const yesterday = createMockTrade('t2', subDays(now, 1), -50);
    const lastWeek = createMockTrade('t3', subWeeks(now, 1), 200);
    const lastMonth = createMockTrade('t4', subMonths(now, 1), -75);
    const twoMonthsAgo = createMockTrade('t5', subMonths(now, 2), 300);

    const allTrades = [today, yesterday, lastWeek, lastMonth, twoMonthsAgo];

    it('returns all trades when no filter is applied', () => {
        const result = filterTradesByDateRange(allTrades, null, null);
        expect(result).toHaveLength(5);
    });

    it('filters to only today', () => {
        const { start, end } = getQuickFilterRange('today');
        const result = filterTradesByDateRange(allTrades, start, end);
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('t1');
    });

    it('filters to this week', () => {
        const { start, end } = getQuickFilterRange('thisWeek');
        const result = filterTradesByDateRange(allTrades, start, end);
        // Should include today, maybe yesterday (depends on day of week)
        expect(result.length).toBeGreaterThanOrEqual(1);
        expect(result.some((t) => t.id === 't1')).toBe(true);
    });

    it('filters to this month', () => {
        const { start, end } = getQuickFilterRange('thisMonth');
        const result = filterTradesByDateRange(allTrades, start, end);
        expect(result.length).toBeGreaterThanOrEqual(1);
        expect(result.some((t) => t.id === 't1')).toBe(true);
        // Should NOT include trades from 2 months ago
        expect(result.some((t) => t.id === 't5')).toBe(false);
    });

    it('all time returns all trades', () => {
        const { start, end } = getQuickFilterRange('allTime');
        const result = filterTradesByDateRange(allTrades, start, end);
        expect(result).toHaveLength(5);
    });

    it('handles custom date range', () => {
        const start = subDays(now, 10);
        const end = now;
        const result = filterTradesByDateRange(allTrades, start, end);
        // Should include today, yesterday, and last week (7 days ago)
        expect(result.some((t) => t.id === 't1')).toBe(true);
        expect(result.some((t) => t.id === 't2')).toBe(true);
        expect(result.some((t) => t.id === 't3')).toBe(true);
        // Should NOT include last month or 2 months ago
        expect(result.some((t) => t.id === 't4')).toBe(false);
        expect(result.some((t) => t.id === 't5')).toBe(false);
    });

    it('handles start date only (no end)', () => {
        const start = subDays(now, 3);
        const result = filterTradesByDateRange(allTrades, start, null);
        expect(result.some((t) => t.id === 't1')).toBe(true);
        expect(result.some((t) => t.id === 't2')).toBe(true);
    });

    it('handles end date only (no start)', () => {
        const end = subDays(now, 14);
        const result = filterTradesByDateRange(allTrades, null, end);
        // Should include trades from last month and 2 months ago
        expect(result.some((t) => t.id === 't4')).toBe(true);
        expect(result.some((t) => t.id === 't5')).toBe(true);
    });

    it('returns empty array for future date range', () => {
        const start = new Date(2030, 0, 1);
        const end = new Date(2030, 11, 31);
        const result = filterTradesByDateRange(allTrades, start, end);
        expect(result).toHaveLength(0);
    });

    it('handles empty trades array', () => {
        const result = filterTradesByDateRange([], null, null);
        expect(result).toHaveLength(0);
    });
});

describe('Quick Filter Range Generation', () => {
    it('today filter returns same day start and end', () => {
        const { start, end } = getQuickFilterRange('today');
        expect(start).not.toBeNull();
        expect(end).not.toBeNull();
        if (start && end) {
            expect(format(start, 'yyyy-MM-dd')).toBe(format(new Date(), 'yyyy-MM-dd'));
            expect(format(end, 'yyyy-MM-dd')).toBe(format(new Date(), 'yyyy-MM-dd'));
        }
    });

    it('thisWeek filter spans 7 days', () => {
        const { start, end } = getQuickFilterRange('thisWeek');
        expect(start).not.toBeNull();
        expect(end).not.toBeNull();
        if (start && end) {
            const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
            expect(diff).toBeGreaterThanOrEqual(6);
            expect(diff).toBeLessThanOrEqual(7);
        }
    });

    it('thisMonth filter spans the calendar month', () => {
        const { start, end } = getQuickFilterRange('thisMonth');
        expect(start).not.toBeNull();
        expect(end).not.toBeNull();
        if (start && end) {
            expect(start.getDate()).toBe(1);
        }
    });

    it('allTime returns null for both start and end', () => {
        const { start, end } = getQuickFilterRange('allTime');
        expect(start).toBeNull();
        expect(end).toBeNull();
    });
});
