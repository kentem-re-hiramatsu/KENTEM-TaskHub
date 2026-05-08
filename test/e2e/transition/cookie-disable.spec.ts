import { expect, test } from '@playwright/test';
import { APP_NAME } from '@/constants';
import { PAGE_INFO } from '@/constants/url';

test('cookieが無効の状態でアクセスすると、cookie無効エラーページにリダイレクトされる', async ({
  context,
}) => {
  await context.clearCookies();
  const page = await context.newPage();
  await page.addInitScript(() => {
    Object.defineProperty(document, 'cookie', {
      get: () => '',
      set: () => false,
      configurable: true,
    });
  });
  await page.goto(PAGE_INFO.operationsProjects.url);
  await page.waitForURL('/error/cookie-disable.html');
  await expect(page).toHaveTitle(`エラー - ${APP_NAME}`);
});

test('cookie無効エラーページでクッキー有効後にロゴクリックするとTOPページに遷移する', async ({
  context,
}) => {
  const page = await context.newPage();
  await page.addInitScript(() => {
    if (typeof document !== 'undefined') {
      // biome-ignore lint/suspicious/noDocumentCookie: テスト環境でのクッキー有効性確認のため必要
      document.cookie = 'test=enabled; SameSite=Strict';
    }
  });
  await page.goto('/error/cookie-disable.html');
  await expect(page).toHaveURL('/error/cookie-disable.html');
  await page.waitForSelector('header a', { state: 'visible' });
  await page.click('header a');
  await expect(page).toHaveURL(PAGE_INFO.operationsProjects.url);
});
