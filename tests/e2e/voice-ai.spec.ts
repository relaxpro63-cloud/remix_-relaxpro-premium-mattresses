import { test, expect } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL ?? 'http://localhost:3000';

test.describe('RelaxPro AI assistant', () => {
  test('opens, answers a quick action, and renders grounded product cards', async ({ page }) => {
    await page.goto(BASE_URL);

    const launcher = page.getByRole('button', { name: 'Talk to RelaxPro AI' });
    await expect(launcher).toBeVisible();
    await launcher.click();

    const dialog = page.getByRole('dialog', { name: 'RelaxPro AI assistant' });
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('Namaskaram');

    await dialog.getByRole('button', { name: 'Under ₹20K' }).click();

    const cards = dialog.getByRole('article');
    await expect(cards.first()).toBeVisible({ timeout: 30_000 });

    // Every displayed price must respect the stated budget.
    const prices = await cards.locator('text=/^₹[\\d,]+/').allTextContents();
    expect(prices.length).toBeGreaterThan(0);
    for (const price of prices) {
      const value = Number(price.replace(/[₹,\/].*$/g, '').replace(/\D/g, ''));
      expect(value).toBeLessThanOrEqual(20000);
    }

    // Every card shows a match percentage produced by the scorer.
    await expect(cards.first()).toContainText('% Match');
  });

  test('exposes the whatsapp handoff with the configured number', async ({ page, context }) => {
    await page.goto(BASE_URL);
    await page.getByRole('button', { name: 'Talk to RelaxPro AI' }).click();

    const dialog = page.getByRole('dialog', { name: 'RelaxPro AI assistant' });
    await dialog.getByRole('button', { name: 'Under ₹20K' }).click();
    await expect(dialog.getByRole('article').first()).toBeVisible({ timeout: 30_000 });

    const popupPromise = context.waitForEvent('page');
    await dialog.getByRole('button', { name: /^Enquire about / }).first().click();
    const popup = await popupPromise;
    expect(popup.url()).toContain('wa.me/918686624494');
  });

  test('site still works when the ai backend is unavailable', async ({ page }) => {
    await page.route('**/api/chat', (route) => route.abort());
    await page.goto(BASE_URL);

    await page.getByRole('button', { name: 'Talk to RelaxPro AI' }).click();
    const dialog = page.getByRole('dialog', { name: 'RelaxPro AI assistant' });
    await dialog.getByRole('button', { name: 'Find My Mattress' }).click();

    await expect(dialog).toContainText("I'm having trouble connecting right now", {
      timeout: 30_000,
    });

    // The rest of the page is unaffected.
    await page.keyboard.press('Escape');
    await expect(page.getByRole('navigation').first()).toBeVisible();
  });
});