import { expect, test } from '@playwright/test';
import { config } from 'dotenv';
import { PAGE_INFO } from '@/constants/url';

config();

test('ログアウト', async ({ page }) => {
  await page.goto(PAGE_INFO.operationsProjects.url);
  await page.getByLabel('メニューリスト').click();
  await page.getByRole('button', { name: 'ログアウト' }).click();
  await page.waitForURL('/logout');
  await page.waitForURL('/login');
  await page.goto('/api/auth/session');
  expect(await page.locator('html').textContent()).toBe('null');
});
