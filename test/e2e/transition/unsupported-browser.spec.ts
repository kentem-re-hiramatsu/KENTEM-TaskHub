import { expect, test } from '@playwright/test';
import { APP_NAME } from '@/constants';
import { PAGE_INFO } from '@/constants/url';

test('未サポートのブラウザでアクセスすると、未サポートエラーページにリダイレクトされる', async ({
  browser,
}) => {
  const context = await browser.newContext({ userAgent: 'test' });
  const page = await context.newPage();
  await page.goto(PAGE_INFO.operationsProjects.url);
  await expect(page).toHaveTitle(`エラー - ${APP_NAME}`);
  await expect(page).toHaveURL('/error/unsupported-browser.html');
});
