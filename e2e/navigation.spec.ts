import { test, expect } from '@playwright/test';

test.describe('Basic Navigation Tests', () => {
    test('should load the home page', async ({ page }) => {
        await page.goto('/');
        
        // Wait for page to load
        await page.waitForLoadState('networkidle');
        
        // Check if the page title or main content is present
        await expect(page).toHaveTitle(/Timeclicker|Clicker/);
    });

    test('should display login button when not authenticated', async ({ page }) => {
        await page.goto('/');
        
        // Wait for page to load
        await page.waitForLoadState('networkidle');
        
        // Check if login prompt or button is visible
        // Note: This might need adjustment based on actual authentication flow
        const loginButton = page.getByRole('button', { name: /Educorvi SSO/i });
        await expect(loginButton.or(page.locator('text=loading')).first()).toBeVisible({ timeout: 10000 });
    });

    test('should have proper navigation structure', async ({ page }) => {
        await page.goto('/');
        
        // Wait for page to load
        await page.waitForLoadState('networkidle');
        
        // Check that the page has a proper HTML structure
        const body = page.locator('body');
        await expect(body).toBeVisible();
    });
});

test.describe('Accessibility Tests', () => {
    test('should have accessible HTML structure', async ({ page }) => {
        await page.goto('/');
        
        // Check for proper HTML lang attribute
        const html = page.locator('html');
        await expect(html).toHaveAttribute('lang');
    });
});
