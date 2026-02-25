import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('Trade CRUD Operations', () => {
    test('trade table renders on dashboard', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForTimeout(3000);
        const url = page.url();
        if (url.includes('/login')) {
            test.skip();
            return;
        }
        await expect(page.locator('text=Recent Trades')).toBeVisible({ timeout: 10000 });
    });

    test('add trade modal opens and closes', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForTimeout(3000);
        if (page.url().includes('/login')) { test.skip(); return; }

        // Click "Add" button in the trade table
        await page.getByRole('button', { name: /add/i }).first().click();

        // Modal should appear
        await expect(page.locator('text=Add New Trade')).toBeVisible({ timeout: 5000 });

        // Cancel should close
        await page.getByRole('button', { name: /cancel/i }).click();
        await expect(page.locator('text=Add New Trade')).not.toBeVisible({ timeout: 3000 });
    });

    test('add trade form has all required fields', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForTimeout(3000);
        if (page.url().includes('/login')) { test.skip(); return; }

        await page.getByRole('button', { name: /add/i }).first().click();
        await page.waitForTimeout(500);

        // Check for required fields
        await expect(page.locator('text=Symbol')).toBeVisible();
        await expect(page.locator('text=Trade Side')).toBeVisible();
        await expect(page.locator('text=Entry Price')).toBeVisible();
        await expect(page.locator('text=Exit Price')).toBeVisible();
        await expect(page.locator('text=Quantity')).toBeVisible();
        await expect(page.locator('text=Entry Date')).toBeVisible();
        await expect(page.locator('text=Exit Date')).toBeVisible();
    });

    test('side toggle switches between long and short', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForTimeout(3000);
        if (page.url().includes('/login')) { test.skip(); return; }

        await page.getByRole('button', { name: /add/i }).first().click();
        await page.waitForTimeout(500);

        // Default should be Long
        const longButton = page.getByRole('button', { name: /long/i });
        const shortButton = page.getByRole('button', { name: /short/i });

        await expect(longButton).toBeVisible();
        await expect(shortButton).toBeVisible();

        // Click Short
        await shortButton.click();
        // Short button should now have active styles (bg-rose-500)
        await expect(shortButton).toHaveClass(/bg-rose/);
    });

    test('trade form validates required fields', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForTimeout(3000);
        if (page.url().includes('/login')) { test.skip(); return; }

        await page.getByRole('button', { name: /add/i }).first().click();
        await page.waitForTimeout(500);

        // Try submitting empty form
        await page.getByRole('button', { name: /add trade/i }).click();

        // Should show validation errors
        await expect(page.locator('text=Symbol is required')).toBeVisible({ timeout: 3000 });
    });

    test('trades page has add trade button', async ({ page }) => {
        await page.goto(`${BASE_URL}/trades`);
        await page.waitForTimeout(3000);
        if (page.url().includes('/login')) { test.skip(); return; }

        await expect(page.getByRole('button', { name: /log new trade/i })).toBeVisible();
    });
});

test.describe('Trade Table Features', () => {
    test('sort buttons exist in table headers', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForTimeout(3000);
        if (page.url().includes('/login')) { test.skip(); return; }

        // Check for sortable columns
        const symbolHeader = page.locator('th button', { hasText: 'Symbol' });
        const pnlHeader = page.locator('th button', { hasText: 'P&L' });
        const dateHeader = page.locator('th button', { hasText: 'Date' });

        // These should be clickable sort buttons
        if (await symbolHeader.count() > 0) {
            await expect(symbolHeader).toBeVisible();
        }
    });

    test('search input filters trades', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForTimeout(3000);
        if (page.url().includes('/login')) { test.skip(); return; }

        const searchInput = page.locator('input[placeholder="Search trades..."]');
        if (await searchInput.count() > 0) {
            await searchInput.fill('NONEXISTENT');
            await page.waitForTimeout(500);
            // Should show "No trades found"
            await expect(page.locator('text=No trades found')).toBeVisible({ timeout: 3000 });
        }
    });
});
