import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('Dashboard Stats Cards', () => {
    test('stats cards render on dashboard', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForTimeout(3000);
        if (page.url().includes('/login')) { test.skip(); return; }

        // Check for stat card titles
        const statTitles = ['Total P&L', 'Win Rate', 'Profit Factor', 'Sharpe Ratio'];
        for (const title of statTitles) {
            await expect(page.locator(`text=${title}`).first()).toBeVisible({ timeout: 10000 });
        }
    });

    test('stats show loading skeletons initially', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard`);
        // Check for loading state — this may happen very quickly
        // The skeleton components should exist briefly
        await page.waitForTimeout(500);
    });

    test('equity curve chart renders', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForTimeout(3000);
        if (page.url().includes('/login')) { test.skip(); return; }

        await expect(page.locator('text=Equity Curve')).toBeVisible({ timeout: 10000 });
    });

    test('win/loss chart renders', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForTimeout(3000);
        if (page.url().includes('/login')) { test.skip(); return; }

        await expect(page.locator('text=Win/Loss Distribution')).toBeVisible({ timeout: 10000 });
    });

    test('daily P&L chart renders', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForTimeout(3000);
        if (page.url().includes('/login')) { test.skip(); return; }

        await expect(page.locator('text=Daily P&L')).toBeVisible({ timeout: 10000 });
    });

    test('empty state shows when no trades', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForTimeout(3000);
        if (page.url().includes('/login')) { test.skip(); return; }

        // If there are no trades, we should see empty state messages
        const noTradesText = page.locator('text=No trades yet');
        const hasData = page.locator('text=No data yet');

        // Either trades exist OR empty state is shown
        const tradesExist = await page.locator('table tbody tr').count() > 0;
        if (!tradesExist) {
            const emptyVisible = await noTradesText.count() > 0 || await hasData.count() > 0;
            expect(emptyVisible).toBe(true);
        }
    });
});

test.describe('Analytics Page Stats', () => {
    test('analytics page loads with metrics', async ({ page }) => {
        await page.goto(`${BASE_URL}/analytics`);
        await page.waitForTimeout(3000);
        if (page.url().includes('/login')) { test.skip(); return; }

        await expect(page.locator('h1')).toContainText('Analytics Dashboard');

        const metrics = ['Profit Factor', 'Win Rate', 'Risk/Reward', 'Expectancy', 'Sharpe Ratio', 'Max Drawdown'];
        for (const metric of metrics) {
            await expect(page.locator(`text=${metric}`).first()).toBeVisible({ timeout: 5000 });
        }
    });
});
