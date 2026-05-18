---
paths:
  - "app/**/*"
  - "src/**/*"
  - "features/**/*"
  - "components/**/*"
---

# KS React Components 利用規約

## 基本方針

- 実装時は、可能な限り `ks-react-components` を優先して利用する
- 同等の要件を満たせる既存コンポーネントがある場合、自作コンポーネントを新規作成しない

## 変更ポリシー

- `ks-react-components` 側の修正が必要な場合は、必ず事前にユーザーの許可を取る
- 許可が取れない場合は、`ks-react-components` を変更せずにアプリ側で自作して対応する
- 無断で `ks-react-components` のコードを直接編集しない

## 調査手順

- `ks-react-components` の利用可否を先に確認してから実装に入る
- `ksrc` に関するドキュメントは以下を参照する
  - `C:\Users\re-hiramatsu\repository\private\tmp\KENTEM-TaskHub\docs\ksrc`
