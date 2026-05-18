# Breadcrumb

パンくずリストを表示するコンポーネント。

## 概要

ユーザーの現在位置を階層的に示すパンくずナビゲーション。最後の要素（現在ページ）は常にテキスト表示し、その前の要素はリンク（LinkText）として表示します。

## Props

| 名称 | 型 | 必須 | デフォルト | 説明 |
|------|------|------|------|------|
| `list` | `[...ComponentProps<typeof LinkText>[], string]` | ○ | - | パンくずリスト。最後の要素は必ず string（現在ページ） |
| `hasPadding` | `boolean` | | `true` | コンテナの padding（32px）を適用するか |

## 使用例

### 基本的な使用
```jsx
<Breadcrumb
  list={[
    { href: "/", text: "ホーム" },
    { href: "/products", text: "商品" },
    "詳細",
  ]}
/>
```

### パディングなし
```jsx
<Breadcrumb
  list={[
    { href: "/", text: "ホーム" },
    { href: "/admin", text: "管理画面" },
    "ユーザー管理",
  ]}
  hasPadding={false}
/>
```

## スタイリング

- **コンテナ**: 100% 幅、border-box
- **セパレーター**: `>` 文字、色は disabled、サイズは medium
- **リンク**: LinkText コンポーネントで表示
- **現在ページ**: Typography、色は disabled、サイズは medium

## 注意

- `list` の最後の要素は必ず `string` である必要があります。型定義で強制されます。
- 型エラーの場合、ランタイムで `throw new Error()` が発生します（e.g., 最後の要素が LinkText Props の場合）。
