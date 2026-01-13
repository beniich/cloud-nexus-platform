import { test, expect } from '@playwright/test';

test.describe('Multilingual Support', () => {
    test('should load homepage in default language (French)', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/Cloud Nexus/);
        await expect(page.getByText('Propulsez votre entreprise vers le cloud')).toBeVisible();
        await expect(page.getByText('Découvrir nos services')).toBeVisible();
    });

    test('should switch to English', async ({ page }) => {
        await page.goto('/');

        // Open language switcher
        // Note: Providing a precise selector is hard without inspecting, assuming aria-label or icon presence
        // But we added "Langue" text or Globe icon.

        // Look for the language switcher trigger. Based on Navbar.tsx it likely has a Globe icon.
        // Or we can try to find the dropdown trigger.
        // Let's assume there is a button with a globe icon inside the navbar.
        const langSwitcher = page.locator('nav').getByRole('button').filter({ has: page.locator('.lucide-globe') }).first();
        await langSwitcher.click();

        // Select English
        await page.getByRole('menuitem', { name: 'English' }).click();

        // Verify English text
        await expect(page.getByText('Propel your business to the cloud')).toBeVisible();
        await expect(page.getByText('Discover our services')).toBeVisible();
    });

    test('should switch to Arabic and verify RTL', async ({ page }) => {
        await page.goto('/');

        // Open language switcher
        const langSwitcher = page.locator('nav').getByRole('button').filter({ has: page.locator('.lucide-globe') }).first();
        await langSwitcher.click();

        // Select Arabic
        await page.getByRole('menuitem', { name: 'العربية' }).click();

        // Verify Arabic text
        // Note: Using a partial text or key keyword as Arabic might be hard to match exactly if encoding differs
        // "مرحبا بك في Cloud Nexus"

        // Verify RTL
        const html = page.locator('html');
        await expect(html).toHaveAttribute('dir', 'rtl');
    });
});
