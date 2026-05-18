# BulkOperationParts

一括操作用の部品配置コンポーネント。

## 概要

左右に分割できるツールバー的なコンポーネント。チェックボックスなどの選択部品（left）と、削除・編集などのアクション（right）を配置する際に使用。

## Props

| 名称 | 型 | 必須 | デフォルト | 説明 |
|------|------|------|------|------|
| `elements` | `{ left: ReactNode; right?: ReactNode }` | ○ | - | 左右に配置する要素 |
| `elements.left` | `ReactNode` | ○ | - | 左側に配置する要素（e.g., チェックボックス） |
| `elements.right` | `ReactNode` | | - | 右側に配置する要素（e.g., アクションボタン）。省略可 |

## 使用例

### 基本的な使用
```jsx
<BulkOperationParts
  elements={{
    left: <Checkbox /> ,
    right: (
      <>
        <Button>削除</Button>
        <Button>編集</Button>
      </>
    ),
  }}
/>
```

### 左要素のみ
```jsx
<BulkOperationParts
  elements={{
    left: <span>選択中: 3件</span>,
  }}
/>
```

## スタイリング

- **背景色**: `ksTheme.border.outline`
- **パディング**: `8px 16px`
- **最小高さ**: `56px`
- **最小幅**: `fit-content`
- **レイアウト**: HStack（Flexbox）で左右分割
- **スペース**: `justify-content: space-between` で左右を広げる
- **要素間ギャップ**: 各グループ内は 8px、wrap 対応

## レイアウト構造

```
[Left Group (wrap)] ←→ [Right Group (wrap)]
```

- 左グループと右グループは `space-between` で両端に配置
- 各グループ内の要素は 8px ギャップで wrap 対応
