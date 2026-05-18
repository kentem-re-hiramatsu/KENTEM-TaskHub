---
paths:
  - "**/*.ts"
  - "**/*.tsx"
---

# TypeScript規約

## 命名規則（Biomeで強制）

- ファイル名: `kebab-case`
- コンポーネント・型: `PascalCase`
- 変数・関数: `camelCase`

## 型定義

- `any` 禁止・型アサーション（`as`）禁止
- `type` より `interface` を優先
  - 判別可能なユニオン（discriminated union）を使う場合は除く
- コンポーネントprops型は `XXXProps` 命名
- nullableな値は `undefined` を使用（例: `string | undefined`）。`null` はAPIの型など特別な理由がある場合のみ
- 不要な `export` は禁止。Storybookでのみ使う型は `export` せず `ComponentProps` を利用

## import・ディレクティブ

- `React.xxx` を使わず、必要な型・関数のみimport
- ディレクティブ（`'use client'`、`'use server'` など）はimport文より前に記述
- ディレクティブ以外の関数や変数をimport文の前に定義しないこと
- import文の下に空行を挟み、ロジックや関数定義はその下に書く

## コード品質

- 短縮記法を優先
- `data-testid` などのテスト専用プロパティをソースコードに含めない

## 設計原則

### シンプルさ

- 実装前に「もっとシンプルな方法はないか？」と必ず一度立ち止まる
- 「確実に動く複雑な解」より「シンプルな解」を先に探す

### 条件分岐

- 条件式や真偽値フラグを追加する前に、その条件が本当に必要かを確認する
  - 既存の別条件で代替できないか検討する（例: `hasBar && isStart` ではなく `isStart` だけで十分な場合）
  - 同一性チェックは `isSameDay` などの専用ユーティリティを積極的に使い、冗長な複合条件を避ける
- 三項演算子では「主役（処理したいケース）」を `===` で先に書き、「素通し（そのまま返す値）」を後に置く
  - ✅ `row.id === rowId ? process(row) : row`
  - ❌ `row.id !== rowId ? row : process(row)`
- 不要な `export` がないか確認する
- `!== undefined` / `=== undefined` を短縮記法で書けないか確認する
- `useState<T | undefined>(undefined)` を `useState<T>()` にできないか確認する
- 一度しか使わない変数がインライン化できないか確認する
