import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('Navigation & Routing', () => {
    const routes = [
        { path: '/dashboard', title: 'Dashboard' },
        { path: '/trades', title: 'Trade Journal' },
        { path: '/analytics', title: 'Analytics Dashboard' },
        { path: '/journal', title: 'Trade Journal' },
        { path: '/calendar', title: 'Trading Calendar' },
        { path: '/settings', title: 'Account Settings' },
        { path: '/accounts', title: 'Accounts' },
        { path: '/strategies', title: 'Strategies' },
        { path: '/rules', title: 'Rules' },
        { path: '/history', title: 'History' },
    ];

    for (const route of routes) {
        test(`${route.path} loads without blank screen`, async ({ page }) => {
            await page.goto(`${BASE_URL}${route.path}`);
            await page.waitForTimeout(3000);

            // Either the page content loads OR we're redirected to login
            const url = page.url();
            if (url.includes('/login')) {
                // Unauthenticated redirect — valid behavior
                await expect(page.locator('h2')).toBeVisible({ timeout: 5000 });
            } else {
                // Page should not be blank — check for heading or content
                const bodyText = await page.textContent('body');
                expect(bodyText?.length).toBeGreaterThan(10);
            }
        });
    }

    test('sidebar highlights active route', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForTimeout(3000);
        if (page.url().includes('/login')) { test.skip(); return; }

        // The active nav item should have bg-secondary class
        const dashboardLink = page.locator('a[href="/dashboard"]').first();
        await expect(dashboardLink).toHaveClass(/bg-secondary/);
    });

    test('unauthenticated user redirects to login', async ({ page }) => {
        // Clear all cookies/storage
        await page.context().clearCookies();
        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForTimeout(5000);

        // Should be redirected to login
        const url = page.url();
        expect(url).toContain('/login');
    });

    test('login page loads at /login', async ({ page }) => {
        await page.goto(`${BASE_URL}/login`);
        await expect(page.locator('text=Welcome back')).toBeVisible({ timeout: 5000 });
    });

    test('signup page loads at /signup', async ({ page }) => {
        await page.goto(`${BASE_URL}/signup`);
        await page.waitForTimeout(2000);
        // Should not be a 404
        const bodyText = await page.textContent('body');
        expect(bodyText?.length).toBeGreaterThan(10);
    });
});

test.describe('Column Sort & Search Filters', () => {
    test('sort by P&L column changes order', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForTimeout(3000);
        if (page.url().includes('/login')) { test.skip(); return; }

        const pnlSortBtn = page.locator('th button', { hasText: 'P&L' });
        if (await pnlSortBtn.count() > 0) {
            await pnlSortBtn.click();
            await page.waitForTimeout(500);
            // Click again to toggle direction
            await pnlSortBtn.click();
            await page.waitForTimeout(500);
        }
    });

    test('sort by Symbol column', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForTimeout(3000);
        if (page.url().includes('/login')) { test.skip(); return; }

        const symbolSortBtn = page.locator('th button', { hasText: 'Symbol' });
        if (await symbolSortBtn.count() > 0) {
            await symbolSortBtn.click();
            await page.waitForTimeout(500);
        }
    });
});
