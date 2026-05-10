import { test, expect } from '@playwright/test';

test('homepage screenshot', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('text=Entrar no Sistema');
  await page.screenshot({ path: 'test-results/homepage.png', fullPage: true });
  expect(await page.title()).toBeTruthy();
});
