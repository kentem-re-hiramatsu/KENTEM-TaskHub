import { test } from '@playwright/test';
import { config } from 'dotenv';
import { PAGE_INFO } from '@/constants/url';

config();

test('ログイン', async ({ page }) => {
  await page.goto(PAGE_INFO.operationsProjects.url);
  const username = process.env.PLAYWRIGHT_USERNAME;
  const password = process.env.PLAYWRIGHT_PASSWORD;

  if (!(username && password))
    throw new Error('envファイルにアカウント情報を設定してください。');

  await page.fill('input[name=username]', username);
  await page.fill('input[name=password]', password);
  await Promise.all([
    page.click('#signin'),
    page.waitForURL(
      new RegExp(
        `(${PAGE_INFO.operationsProjects.url}|${process.env.NEXT_PUBLIC_POLICY_AGREEMENT_URL}.*$)`,
      ),
    ),
  ]);
  if (page.url().includes(process.env.NEXT_PUBLIC_POLICY_AGREEMENT_URL || '')) {
    await page.getByRole('button', { name: '同意する' }).click();
    await page.waitForURL(PAGE_INFO.operationsProjects.url);
  }
  await page
    .context()
    .storageState({ path: 'test/playwright/.auth/user.json' });
});
