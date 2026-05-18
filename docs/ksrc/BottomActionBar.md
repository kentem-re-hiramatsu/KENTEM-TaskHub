# BottomActionBar

ページ下部に固定されるアクションバーコンポーネント。

## 概要

フッター要素として、ボタンやアクション要素を配置するための固定バー。中央配置（center）または左右分割配置（left/right）の2つのレイアウトモードをサポート。

## Props

| 名称 | 型 | 必須 | デフォルト | 説明 |
|------|------|------|------|------|
| `elements` | `CenterLayout \| SideLayout` | ○ | - | レイアウトモードと要素を指定 |

### elements の構造

#### CenterLayout（中央配置）
```typescript
{
  center: ReactNode;
  left?: never;
  right?: never;
}
```

#### SideLayout（左右分割）
```typescript
{
  left?: ReactNode;
  right: ReactNode;
  center?: never;
}
```

## 使用例

### 中央配置
```jsx
<BottomActionBar
  elements={{
    center: (
      <>
        <Button>キャンセル</Button>
        <Button>保存</Button>
      </>
    ),
  }}
/>
```

### 左右分割配置
```jsx
<BottomActionBar
  elements={{
    left: <Button>前へ</Button>,
    right: (
      <>
        <Button>キャンセル</Button>
        <Button variant="primary">次へ</Button>
      </>
    ),
  }}
/>
```

## スタイリング

- **背景色**: `ksTheme.border.outline`
- **シャドウ**: 上部に shadow を配置（`0 -1px 2px 1px rgba(0,0,0,0.25)`）
- **レイアウト**: HStack（Flexbox）で要素を配置
- **ギャップ**: 要素間に 16px のギャップ

### Layout Variants
| layout | パディング | 説明 |
|--------|-----------|------|
| `center` | `py: 16px` | 垂直パディングのみ |
| `side` | `p: 16px 24px` | 全方向パディング |

## 注意

- `center` と `left/right` は排他的です。型定義により同時に指定することはできません。
- `left` は省略可能ですが、`right` は必須です（SideLayout時）。
