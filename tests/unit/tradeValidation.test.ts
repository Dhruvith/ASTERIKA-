import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Replicate the trade schema from AddTradeModal.tsx for isolated testing
const tradeSchema = z.object({
    symbol: z.string().min(1, 'Symbol is required').max(10, 'Symbol too long'),
    side: z.enum(['long', 'short']),
    entryPrice: z.number().min(0.0001, 'Entry price must be positive'),
    exitPrice: z.number().min(0.0001, 'Exit price must be positive'),
    quantity: z.number().min(0.0001, 'Quantity must be positive'),
    entryDate: z.string().min(1, 'Entry date is required'),
    exitDate: z.string().min(1, 'Exit date is required'),
    commission: z.number().min(0).optional(),
    strategy: z.string().optional(),
    stopLoss: z.number().min(0).optional(),
    takeProfit: z.number().min(0).optional(),
    emotion: z.enum(['calm', 'confident', 'fearful', 'fomo', 'neutral']).optional(),
    marketCondition: z.enum(['bullish', 'bearish', 'ranging', 'volatile']).optional(),
    notes: z.string().optional(),
});

// ============================================================
// Valid Trade Inputs
// ============================================================
describe('Trade Validation — Valid Inputs', () => {
    it('accepts a minimal valid trade', () => {
        const result = tradeSchema.safeParse({
            symbol: 'AAPL',
            side: 'long',
            entryPrice: 150,
            exitPrice: 155,
            quantity: 10,
            entryDate: '2026-01-15T10:00',
            exitDate: '2026-01-15T14:00',
        });
        expect(result.success).toBe(true);
    });

    it('accepts a full trade with all optional fields', () => {
        const result = tradeSchema.safeParse({
            symbol: 'EURUSD',
            side: 'short',
            entryPrice: 1.0856,
            exitPrice: 1.0810,
            quantity: 100000,
            entryDate: '2026-02-01T09:30',
            exitDate: '2026-02-01T15:45',
            commission: 7,
            strategy: 'Breakout',
            stopLoss: 1.0890,
            takeProfit: 1.0780,
            emotion: 'confident',
            marketCondition: 'bearish',
            notes: 'Clean break of support level',
        });
        expect(result.success).toBe(true);
    });

    it('accepts crypto symbols', () => {
        const result = tradeSchema.safeParse({
            symbol: 'BTCUSD',
            side: 'long',
            entryPrice: 45000,
            exitPrice: 47000,
            quantity: 0.5,
            entryDate: '2026-01-20T00:00',
            exitDate: '2026-01-25T12:00',
        });
        expect(result.success).toBe(true);
    });
});

// ============================================================
// Invalid Trade Inputs — Required Fields
// ============================================================
describe('Trade Validation — Missing Required Fields', () => {
    it('rejects trade without symbol', () => {
        const result = tradeSchema.safeParse({
            side: 'long',
            entryPrice: 100,
            exitPrice: 110,
            quantity: 10,
            entryDate: '2026-01-15T10:00',
            exitDate: '2026-01-15T14:00',
        });
        expect(result.success).toBe(false);
    });

    it('rejects trade with empty symbol', () => {
        const result = tradeSchema.safeParse({
            symbol: '',
            side: 'long',
            entryPrice: 100,
            exitPrice: 110,
            quantity: 10,
            entryDate: '2026-01-15T10:00',
            exitDate: '2026-01-15T14:00',
        });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe('Symbol is required');
        }
    });

    it('rejects trade without entryDate', () => {
        const result = tradeSchema.safeParse({
            symbol: 'AAPL',
            side: 'long',
            entryPrice: 100,
            exitPrice: 110,
            quantity: 10,
            exitDate: '2026-01-15T14:00',
        });
        expect(result.success).toBe(false);
    });

    it('rejects trade without exitDate', () => {
        const result = tradeSchema.safeParse({
            symbol: 'AAPL',
            side: 'long',
            entryPrice: 100,
            exitPrice: 110,
            quantity: 10,
            entryDate: '2026-01-15T10:00',
        });
        expect(result.success).toBe(false);
    });

    it('rejects trade without side', () => {
        const result = tradeSchema.safeParse({
            symbol: 'AAPL',
            entryPrice: 100,
            exitPrice: 110,
            quantity: 10,
            entryDate: '2026-01-15T10:00',
            exitDate: '2026-01-15T14:00',
        });
        expect(result.success).toBe(false);
    });
});

// ============================================================
// Invalid Trade Inputs — Edge Cases (Negative Prices etc)
// ============================================================
describe('Trade Validation — Edge Cases', () => {
    it('rejects negative entry price', () => {
        const result = tradeSchema.safeParse({
            symbol: 'AAPL',
            side: 'long',
            entryPrice: -10,
            exitPrice: 110,
            quantity: 10,
            entryDate: '2026-01-15T10:00',
            exitDate: '2026-01-15T14:00',
        });
        expect(result.success).toBe(false);
    });

    it('rejects zero entry price', () => {
        const result = tradeSchema.safeParse({
            symbol: 'AAPL',
            side: 'long',
            entryPrice: 0,
            exitPrice: 110,
            quantity: 10,
            entryDate: '2026-01-15T10:00',
            exitDate: '2026-01-15T14:00',
        });
        expect(result.success).toBe(false);
    });

    it('rejects negative exit price', () => {
        const result = tradeSchema.safeParse({
            symbol: 'AAPL',
            side: 'long',
            entryPrice: 100,
            exitPrice: -5,
            quantity: 10,
            entryDate: '2026-01-15T10:00',
            exitDate: '2026-01-15T14:00',
        });
        expect(result.success).toBe(false);
    });

    it('rejects zero quantity', () => {
        const result = tradeSchema.safeParse({
            symbol: 'AAPL',
            side: 'long',
            entryPrice: 100,
            exitPrice: 110,
            quantity: 0,
            entryDate: '2026-01-15T10:00',
            exitDate: '2026-01-15T14:00',
        });
        expect(result.success).toBe(false);
    });

    it('rejects negative quantity', () => {
        const result = tradeSchema.safeParse({
            symbol: 'AAPL',
            side: 'long',
            entryPrice: 100,
            exitPrice: 110,
            quantity: -5,
            entryDate: '2026-01-15T10:00',
            exitDate: '2026-01-15T14:00',
        });
        expect(result.success).toBe(false);
    });

    it('rejects symbol longer than 10 chars', () => {
        const result = tradeSchema.safeParse({
            symbol: 'ABCDEFGHIJK',
            side: 'long',
            entryPrice: 100,
            exitPrice: 110,
            quantity: 10,
            entryDate: '2026-01-15T10:00',
            exitDate: '2026-01-15T14:00',
        });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe('Symbol too long');
        }
    });

    it('rejects invalid side value', () => {
        const result = tradeSchema.safeParse({
            symbol: 'AAPL',
            side: 'buy', // invalid — only 'long' or 'short'
            entryPrice: 100,
            exitPrice: 110,
            quantity: 10,
            entryDate: '2026-01-15T10:00',
            exitDate: '2026-01-15T14:00',
        });
        expect(result.success).toBe(false);
    });

    it('rejects negative commission', () => {
        const result = tradeSchema.safeParse({
            symbol: 'AAPL',
            side: 'long',
            entryPrice: 100,
            exitPrice: 110,
            quantity: 10,
            entryDate: '2026-01-15T10:00',
            exitDate: '2026-01-15T14:00',
            commission: -5,
        });
        expect(result.success).toBe(false);
    });

    it('rejects negative stop loss', () => {
        const result = tradeSchema.safeParse({
            symbol: 'AAPL',
            side: 'long',
            entryPrice: 100,
            exitPrice: 110,
            quantity: 10,
            entryDate: '2026-01-15T10:00',
            exitDate: '2026-01-15T14:00',
            stopLoss: -10,
        });
        expect(result.success).toBe(false);
    });

    it('accepts string-like numbers for prices (NaN handling)', () => {
        const result = tradeSchema.safeParse({
            symbol: 'AAPL',
            side: 'long',
            entryPrice: NaN,
            exitPrice: 110,
            quantity: 10,
            entryDate: '2026-01-15T10:00',
            exitDate: '2026-01-15T14:00',
        });
        expect(result.success).toBe(false);
    });

    it('accepts valid emotion values', () => {
        const emotions = ['calm', 'confident', 'fearful', 'fomo', 'neutral'] as const;
        for (const emotion of emotions) {
            const result = tradeSchema.safeParse({
                symbol: 'AAPL',
                side: 'long',
                entryPrice: 100,
                exitPrice: 110,
                quantity: 10,
                entryDate: '2026-01-15T10:00',
                exitDate: '2026-01-15T14:00',
                emotion,
            });
            expect(result.success).toBe(true);
        }
    });

    it('rejects invalid emotion value', () => {
        const result = tradeSchema.safeParse({
            symbol: 'AAPL',
            side: 'long',
            entryPrice: 100,
            exitPrice: 110,
            quantity: 10,
            entryDate: '2026-01-15T10:00',
            exitDate: '2026-01-15T14:00',
            emotion: 'angry', // not in enum
        });
        expect(result.success).toBe(false);
    });
});
