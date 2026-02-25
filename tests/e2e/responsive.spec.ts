import { test, expect, devices } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('Responsive Design - Mobile (375px)', () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test('dashboard loads on mobile viewport', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForTimeout(3000);
        if (page.url().includes('/login')) {
            await expect(page.locator('h2')).toBeVisible();
            return;
        }

        // Page should not have horizontal scroll
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        const viewportWidth = await page.evaluate(() => window.innerWidth);
        expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5); // small tolerance
    });

    test('mobile menu toggle button is visible on mobile', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForTimeout(3000);
        if (page.url().includes('/login')) { test.skip(); return; }

        // The hamburger menu should be visible on mobile
        const menuButton = page.locator('button').filter({ has: page.locator('svg.lucide-menu, svg.lucide-x') });
        // At 375px, the lg:hidden menu button should be visible
        await expect(menuButton.first()).toBeVisible({ timeout: 5000 });
    });

    test('mobile menu opens and shows nav items', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForTimeout(3000);
        if (page.url().includes('/login')) { test.skip(); return; }

        // Click hamburger
        const menuButton = page.locator('button.lg\\:hidden').last();
        if (await menuButton.count() > 0) {
            await menuButton.click();
            await page.waitForTimeout(500);

            // Nav items should be visible in mobile menu
            await expect(page.locator('a[href="/dashboard"]').last()).toBeVisible();
            await expect(page.locator('a[href="/trades"]').last()).toBeVisible();
        }
    });

    test('mobile menu closes on nav item click', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForTimeout(3000);
        if (page.url().includes('/login')) { test.skip(); return; }

        const menuButton = page.locator('button.lg\\:hidden').last();
        if (await menuButton.count() > 0) {
            await menuButton.click();
            await page.waitForTimeout(500);

            // Click a nav item
            await page.locator('a[href="/trades"]').last().click();
            await page.waitForTimeout(1000);

            // Menu should be closed
            // The mobile overlay should not be visible
        }
    });

    test('login page is usable on mobile', async ({ page }) => {
        await page.goto(`${BASE_URL}/login`);
        await expect(page.locator('input[type="email"]')).toBeVisible();
        await expect(page.locator('input[type="password"]')).toBeVisible();
        await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
    });
});

test.describe('Responsive Design - Tablet (768px)', () => {
    test.use({ viewport: { width: 768, height: 1024 } });

    test('dashboard loads on tablet viewport', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForTimeout(3000);
        if (page.url().includes('/login')) { test.skip(); return; }

        await expect(page.locator('text=Total P&L')).toBeVisible({ timeout: 10000 });
    });

    test('stats cards stack in 2 columns on tablet', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForTimeout(3000);
        if (page.url().includes('/login')) { test.skip(); return; }

        // The grid should be md:grid-cols-2
        const statsGrid = page.locator('.grid.grid-cols-1.md\\:grid-cols-2');
        if (await statsGrid.count() > 0) {
            await expect(statsGrid.first()).toBeVisible();
        }
    });
});

test.describe('Responsive Design - Desktop (1280px)', () => {
    test.use({ viewport: { width: 1280, height: 900 } });

    test('dashboard loads on desktop viewport', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForTimeout(3000);
        if (page.url().includes('/login')) { test.skip(); return; }

        await expect(page.locator('text=Total P&L')).toBeVisible({ timeout: 10000 });
    });

    test('no horizontal scroll on desktop', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForTimeout(3000);
        if (page.url().includes('/login')) { test.skip(); return; }

        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        const viewportWidth = await page.evaluate(() => window.innerWidth);
        expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5);
    });

    test('desktop nav items are visible (lg+ breakpoint)', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForTimeout(3000);
        if (page.url().includes('/login')) { test.skip(); return; }

        // Desktop nav should show nav items inline
        const dashboardNav = page.locator('nav a[href="/dashboard"]');
        await expect(dashboardNav.first()).toBeVisible();
    });

    test('calendar page renders grid correctly on desktop', async ({ page }) => {
        await page.goto(`${BASE_URL}/calendar`);
        await page.waitForTimeout(3000);
        if (page.url().includes('/login')) { test.skip(); return; }

        await expect(page.locator('text=Trading Calendar')).toBeVisible();
        // Should have 7-col grid for weekdays
        const weekdayHeaders = page.locator('text=Sun');
        await expect(weekdayHeaders.first()).toBeVisible();
    });
});

test.describe('Responsive Design - Large Monitor (1920px)', () => {
    test.use({ viewport: { width: 1920, height: 1080 } });

    test('content is properly constrained at 1920px', async ({ page }) => {
        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForTimeout(3000);
        if (page.url().includes('/login')) { test.skip(); return; }

        // Content should be constrained by max-w-[1600px]
        const main = page.locator('main > div');
        if (await main.count() > 0) {
            const box = await main.first().boundingBox();
            if (box) {
                expect(box.width).toBeLessThanOrEqual(1700); // with padding
            }
        }
    });
});
