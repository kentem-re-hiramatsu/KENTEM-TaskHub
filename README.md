# KENTEM-TaskHub

PL（プロジェクトリーダー）業務の負担を軽減するための社内ツール。プロジェクト進捗の可視化・管理を通じて、PL が抱える報告・集計・共有コストを削減する。

## 目的・背景

社内のPL業務では、複数プロジェクトの進捗管理・報告業務に大きな負荷がかかっている。本ツールはその負担を軽減し、最終的には全社のPLが活用できるプラットフォームを目指している。

## フェーズロードマップ

| フェーズ | 内容 | ステータス |
|---------|------|-----------|
| Phase 0 | MVP 機能の実装 | 🚧 進行中 |
| Phase 1 | 岡田さんチームの各 PJ に導入 | 🔜 |
| Phase 2 | フィードバックをもとに機能強化・UI 改善 | 🔜 |
| Phase 3 | 他チームの PJ に導入、全体の 3 割へ展開 / PJ チャレンジで発表 | 🔜 |
| Phase 4 | 全体の 8 割への導入（PM 会議への提案 or 施策化） | 🔜 |
| Phase 5 | 8 割到達後、見積基準機能を追加し残り 2 割を巻き込む | 🔜 |
| Phase 6 | AI 機能の追加・充実 | 🔜 |

## 技術スタック

| カテゴリ | 採用技術 |
|---------|---------|
| フレームワーク | Next.js 16 (App Router) / React 19 |
| 言語 | TypeScript |
| スタイリング | Panda CSS |
| 状態管理 | Zustand / TanStack Query v5 |
| 認証 | NextAuth v4 (GitHub OAuth) |
| バリデーション | Zod |
| テスト | Vitest / Playwright / Storybook 10 |
| Linter/Formatter | Biome |
| パッケージマネージャー | pnpm 9 |
| モック | MSW v2 |

## 開発環境セットアップ

### 前提

- Node.js 20+
- pnpm 9+

### 手順

#### 1. リポジトリのクローン（サブモジュールあり）

```bash
git clone --recurse-submodules <repo-url>
cd KENTEM-TaskHub
```

#### 2. 依存関係のインストール

```bash
pnpm install
```

#### 3. 環境変数の設定

`.env.local` をプロジェクトルートに作成する。

```env
NEXTAUTH_URL=https://localhost:3000
NEXTAUTH_SECRET=<任意の文字列>
GITHUB_CLIENT_ID=<GitHub OAuth App の Client ID>
GITHUB_CLIENT_SECRET=<GitHub OAuth App の Client Secret>
```

#### 4. 開発サーバーの起動

**通常モード（GitHub 認証あり）**

```bash
pnpm dev
```

**モックモード（認証なし・MSW 使用）**

```bash
pnpm dev:mock
```

> `dev:mock` は GitHub OAuth なしでアプリを動かせる。開発初期はこちらを推奨。

## 主なページ

| パス | 内容 |
|-----|------|
| `/my-projects` | 担当 PJ 一覧 |
| `/projects` | 全 PJ 一覧 |
| `/projects/[id]` | PJ 詳細 |
| `/project-registration` | PJ 登録 |
| `/settings` | 設定（権限管理） |
| `/profile` | 個人設定 |
| `/estimate-criteria` | 見積基準 |

## 主なコマンド

```bash
pnpm dev             # 開発サーバー起動（HTTPS）
pnpm dev:mock        # モック込みの開発サーバー起動
pnpm build           # プロダクションビルド
pnpm storybook       # Storybook 起動
pnpm test            # Vitest 実行
pnpm playwright      # Playwright E2E テスト実行
pnpm biome           # Lint チェック
pnpm biome:fix       # Lint 自動修正
pnpm typecheck       # TypeScript 型チェック
```

## 開発方針

このPJは **スピード優先** で開発する。圧倒的なスピードでユーザーへ届け、フィードバックをもらうことを第一優先にする。

### AI 活用は必須

- 開発者のコーディングは全体の **3〜4 割** を上限とし、残りは AI で補う
- AI をどう使えば意図した実装になるかを共有しながら高め合う
- AI 活用の知見はチーム全体の資産として蓄積する

### PR・コードレビュー方針

- PR レビューは **動作確認** と **致命的なコードがないかの確認** のみ
- 細かいリファクタリングは各フェーズの区切りにまとめて実施する
- 指摘は重要度（Blocker / Major / Minor / Nit）を明示する

### その他

- 自由な発言・提案を歓迎する。このPJをどこよりも最先端にする
- 重要な技術判断はチームで合意を取る
