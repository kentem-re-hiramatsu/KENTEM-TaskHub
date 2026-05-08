import path from 'node:path';
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '.env.local') });

/**
 * Playwrightのテスト設定。詳細は https://playwright.dev/docs/test-configuration を参照。
 */
export default defineConfig({
  timeout: 120_000,
  testDir: './test/e2e',
  outputDir: './test/playwright-results',
  /* テストファイルを並列実行する */
  fullyParallel: true,
  /* CI環境でtest.onlyが残っている場合にビルドを失敗させる */
  forbidOnly: !!process.env.CI,
  /* CI環境のみリトライする */
  retries: process.env.CI ? 2 : 0,
  /* ワーカー数の設定 */
  workers: process.env.CI ? 1 : undefined,
  /* 使用するレポーター。詳細は https://playwright.dev/docs/test-reporters を参照 */
  reporter: [['html', { outputFolder: 'test/playwright-report' }]],
  /* 全プロジェクト共通の設定。詳細は https://playwright.dev/docs/api/class-testoptions を参照 */
  use: {
    /* `await page.goto('/')` などで使用するベースURL */
    baseURL: 'https://localhost:3000',

    /* 失敗したテストのリトライ時にトレースを収集する。詳細は https://playwright.dev/docs/trace-viewer を参照 */
    trace: 'on-first-retry',

    /* 個別操作のタイムアウト */
    actionTimeout: 30000,

    /* ナビゲーションのタイムアウト */
    navigationTimeout: 30000,

    /* 自己証明書のエラーを無視 */
    ignoreHTTPSErrors: true,
  },

  /* 主要ブラウザごとのプロジェクト設定 */
  projects: [
    {
      name: 'login',
      use: { ...devices['Desktop Firefox'] },
      testMatch: 'login.spec.ts',
    },
    {
      name: 'transition',
      testDir: './test/e2e/transition',
      fullyParallel: true,
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'test/playwright/.auth/user.json',
      },
      dependencies: ['login'],
    },
    {
      name: 'logout',
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'test/playwright/.auth/user.json',
      },
      testMatch: 'logout.spec.ts',
      dependencies: ['login'],
    },
  ],

  /* 開発サーバーの起動 */
  webServer: {
    command: 'npx next dev --experimental-https',
    url: 'https://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 80000,
    ignoreHTTPSErrors: true,
  },
});
