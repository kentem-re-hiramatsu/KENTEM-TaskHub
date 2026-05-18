---
paths:
  - "**/*.tsx"
  - "components/**/*"
  - "features/**/*"
  - "app/**/*"
---

# Styling規約

## Import

- `HStack` / `VStack` / `Box` は `styled-system/jsx` から import する
- import はまとめて1行で書く
- `React.xxx` 形式は使わない

```tsx
import { Box, HStack, VStack } from "styled-system/jsx";
```

## レイアウトプリミティブ（HStack / VStack / Box）

- 1次レイアウトは `HStack` / `VStack` を優先し、`div` + `display: flex` の直接記述を増やしすぎない
- 単体ラッパー・余白調整・見た目の箱は `Box` を使う
- 方向のある並びは `HStack` / `VStack`、方向のない単体コンテナは `Box` で責務を分ける

## 使い分け

- `HStack`: 横並び（`align` / `justify` / `gap` を明示）
- `VStack`: 縦並び（セクション内の行積み、フォーム、カード内要素）
- `Box`: 単一要素のラップ（padding / border / bg / width 制御）

## 禁止・非推奨

- `HStack` / `VStack` の入れ子が深くなりすぎる構造（3階層以上）は避ける
- レイアウト用途なのに `Box` のみで横縦を表現しない
- `gap` を親子で二重管理しない（どちらか一方に寄せる）

## 実装ルール

- `HStack` / `VStack` には意図が伝わる props を付ける（例: `gap`, `align`, `justify`）
- 余白は可能な限り親コンテナ側で制御し、子要素への個別 `mt/ml` 乱用を避ける
- 同一コンポーネント内で同じ役割のレイアウトは、同じプリミティブに統一する

## 例

```tsx
<VStack gap="16" align="stretch">
  <HStack gap="8" align="center" justify="space-between">
    <Heading>タイトル</Heading>
    <Button disabled={false}>保存</Button>
  </HStack>

  <Box borderWidth="1px" borderRadius="8" p="12">
    <Text>説明文</Text>
  </Box>
</VStack>
```
