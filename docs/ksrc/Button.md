# Button

様々なスタイルバリアントとサイズをサポートする汎用ボタンコンポーネント。

## 概要

ナビゲーション、フォーム送信、アクション実行など、多様なシーンで使用される基本的なボタン。プライマリ、セカンダリ、エラー、警告など複数の variant と、4段階のサイズをサポート。カスタムレンダリング（renderItem）にも対応。

## Props

| 名称 | 型 | 必須 | デフォルト | 説明 |
|------|------|------|------|------|
| `variant` | `"primary" \| "secondary" \| "tertiary" \| "tertiaryNoFrame" \| "alertPrimary" \| "alertSecondary" \| "alertWarning" \| "disabled" \| "disabledNoFrame"` | | `"primary"` | ボタンのスタイルバリアント |
| `size` | `"xSmall" \| "small" \| "medium" \| "large"` | | `"medium"` | ボタンのサイズ |
| `horizontalSize` | `"fit" \| "parentFull"` | | `"fit"` | 横幅を内容に合わせるか、親要素の100%を占有するか |
| `disabled` | `boolean` | | - | ボタンを無効化 |
| `children` | `ReactNode` | ○ | - | ボタンのテキストまたは内容 |
| `leftIcon` | `IconProps` | | - | 左側に表示するアイコン |
| `rightIcon` | `IconProps` | | - | 右側に表示するアイコン |
| `type` | `"button" \| "submit" \| "reset"` | | `"button"` | button 要素の type 属性 |
| `onClick` | `(e: React.MouseEvent) => void` | | - | クリック時のコールバック（renderItem 未使用時） |
| `renderItem` | `(props: { className: string; content: ReactNode }) => ReactNode` | | - | カスタムレンダリング関数。指定時は `onClick` は使用不可 |
| `aria-label` | `string` | | - | アクセシビリティ用ラベル（renderItem 未使用時） |
| `aria-labelledby` | `string` | | - | アクセシビリティ用ラベル ID（renderItem 未使用時） |

## Variants

### variant
| variant | 背景色 | テキスト色 | ボーダー | 用途 |
|---------|--------|-----------|---------|------|
| `primary` | プライマリ | onFill | なし | メインアクション（推奨） |
| `secondary` | onFill | プライマリ | プライマリ | サブアクション |
| `tertiary` | onFill | active | outline | 汎用ボタン |
| `tertiaryNoFrame` | transparent | link (underline) | なし | リンク的なボタン |
| `alertPrimary` | alert | onFill | なし | 危険なアクション |
| `alertSecondary` | onFill | alert | alert | 危険なアクション（セカンダリ） |
| `alertWarning` | onFill | warning | warning | 警告が必要なアクション |
| `disabled` | disabledBack | disabled | disabled | 無効化状態 |
| `disabledNoFrame` | transparent | disabled | なし | 無効化されたリンク型 |

### size
| size | 高さ | 最小幅 | フォントサイズ |
|------|------|--------|---------|
| `xSmall` | 32px | 64px | 14px |
| `small` | 40px | 64px | 16px |
| `medium` | 48px | 96px | 16px |
| `large` | 56px | 112px | 16px |

### horizontalSize
- `fit`: コンテンツ幅に応じたサイズ（デフォルト）
- `parentFull`: 親要素の100%を占有

## 使用例

### 基本的な使用
```jsx
<Button onClick={() => alert("clicked")}>送信</Button>
```

### セカンダリ、左アイコン付き
```jsx
<Button
  variant="secondary"
  size="small"
  leftIcon={{ category: "mask", type: "arrowDown" }}
>
  メニューを開く
</Button>
```

### フル幅エラーボタン
```jsx
<Button
  variant="alertPrimary"
  horizontalSize="parentFull"
  onClick={handleDelete}
>
  削除する
</Button>
```

### カスタムレンダリング
```jsx
<Button
  renderItem={({ className, content }) => (
    <a href="/page" className={className}>
      {content}
    </a>
  )}
>
  ナビゲート
</Button>
```

## アイコン統合

- **leftIcon / rightIcon**: Icon コンポーネント互換の props
- **自動スタイリング**: variant と disabled 状態に応じて自動的にアイコンの variant が決定される
- **MaskIcon**: disabled 時は `disabled` variant に、tertiary 時は `tertiaryOnButton` に、それ以外は variant そのものを使用

## アクセシビリティ

- `aria-label` または `aria-labelledby` を指定して、スクリーンリーダー対応
- `disabled` 属性で無効化状態を通知
