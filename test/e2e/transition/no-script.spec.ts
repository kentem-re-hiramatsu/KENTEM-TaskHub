import { expect, test } from '@playwright/test';
import { APP_NAME } from '@/constants';
import { PAGE_INFO } from '@/constants/url';

test('JavaScript無効のブラウザでアクセスすると、JavaScript無効エラーページにリダイレクトされる', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(PAGE_INFO.operationsProjects.url);
  await expect(page).toHaveTitle(`エラー - ${APP_NAME}`);
  await expect(page).toHaveURL('/error/no-script.html');
});

test('JavaScript無効エラーページで、JavaScript有効時にロゴクリックするとTOPページに遷移する', async ({
  context,
}) => {
  const page = await context.newPage();
  await page.goto('/error/no-script.html');
  await expect(page).toHaveURL('/error/no-script.html');
  await page.waitForSelector('header a', { state: 'visible' });
  await page.click('header a');
  await expect(page).toHaveURL(PAGE_INFO.operationsProjects.url);
});
