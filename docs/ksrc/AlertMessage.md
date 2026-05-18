# AlertMessage

アラートメッセージを表示するコンポーネント。

## 概要

ステータスアイコン + テキストを組み合わせた、ユーザーへの通知・警告・エラー情報の表示。複数の variant とサイズをサポート。

## Props

| 名称 | 型 | 必須 | デフォルト | 説明 |
|------|------|------|------|------|
| `text` | `string` | ○ | - | 表示するアラートメッセージテキスト |
| `variant` | `"primary" \| "normal" \| "warning" \| "error"` | ○ | - | アラートのスタイルバリアント |
| `size` | `"small" \| "medium" \| "large"` | | `"small"` | テキスト・アイコンのサイズ |
| `horizontal` | `"fit" \| "full"` | | `"fit"` | 横方向のレイアウト（fit: 内容幅、full: 100%） |

## Variants

### variant
各種類のアラートに応じたスタイルとアイコンの組み合わせ。

| variant | 背景色 | ボーダー | アイコン | 用途 |
|---------|--------|---------|---------|------|
| `primary` | セカンダリコンテナ | なし | Info (secondary) | 情報・通知 |
| `normal` | サーフェス | 1px outline | Info (disabled) | 汎用メッセージ |
| `warning` | 警告コンテナ | なし | Warning (warningFaded) | 注意・警告 |
| `error` | エラーコンテナ | なし | Info (alertSecondary) | エラー |

### size
- `"small"`: 小（デフォルト）
- `"medium"`: 中
- `"large"`: 大（アイコンは medium に固定）

### horizontal
- `"fit"`: コンテンツ幅に応じたサイズ（デフォルト）
- `"full"`: 横100%を占有

## 使用例

### 基本的な使用
```jsx
<AlertMessage text="操作が完了しました" variant="primary" />
```

### 警告
```jsx
<AlertMessage
  text="この操作は取り消せません"
  variant="warning"
  size="medium"
/>
```

### エラー（フル幅）
```jsx
<AlertMessage
  text="エラーが発生しました。もう一度お試しください。"
  variant="error"
  horizontal="full"
/>
```

## スタイリング

- **icon**: 左側に配置、category="mask"
- **text**: Typography コンポーネントで表示
- **container**: 中央揃え（`alignItems: center`）

## アクセシビリティ

- `role="alert"` 属性を使用し、スクリーンリーダーに優先度を付与
