# Chip

選択状態を持つ小型ボタンコンポーネント。

## 概要

カテゴリフィルタやタグセレクターなどで使用される、選択トグル機能を持つコンパクトなボタン。2つのサイズと選択状態による視覚的フィードバック。

## Props

| 名称 | 型 | 必須 | デフォルト | 説明 |
|------|------|------|------|------|
| `label` | `string` | | - | Chip に表示するテキスト |
| `size` | `"xSmall" \| "small"` | | `"small"` | Chip のサイズ |
| `isSelected` | `boolean` | | - | 選択状態 |
| `disabled` | `boolean` | | - | Chip を無効化 |
| `onClick` | `() => void` | | - | クリック時のコールバック |
| `icon` | `IconProps` (size・variant 除外) | | - | Chip の左側に表示するアイコン |

## Variants

### size
| size | 最小幅 | 高さ | パディング | ギャップ |
|------|--------|------|----------|---------|
| `small` | 80px | 40px | icon有無で異なる | 8px |
| `xSmall` | 64px | 32px | icon有無で異なる | 4px |

### isSelected
| isSelected | 背景色 | テキスト色 | 説明 |
|-----------|--------|-----------|------|
| `true` | プライマリ | onFill | 選択状態 |
| `false` | transparent | inherit | 非選択状態 |

## 使用例

### 基本的な使用
```jsx
const [selected, setSelected] = useState("large");

<div>
  {["small", "medium", "large"].map(size => (
    <Chip
      key={size}
      label={size}
      size="small"
      isSelected={selected === size}
      onClick={() => setSelected(size)}
    />
  ))}
</div>
```

### アイコン付き
```jsx
<Chip
  label="削除"
  size="small"
  isSelected={false}
  icon={{ category: "mask", type: "delete" }}
  onClick={handleDelete}
/>
```

### 小型（xSmall）
```jsx
<Chip
  label="🏷️"
  size="xSmall"
  isSelected={isTagged}
  onClick={toggleTag}
/>
```

## スタイリング

- **基本**: 丸い（rounded: 28px）、ボーダー付き
- **ホバー**: 非選択時は secondary.container の背景色
- **フォーカス**: secondary.press の背景色
- **disabled**: テキスト色が #9e9e9e、カーソル: not-allowed

## アイコン統合

- MaskIcon の場合、variant を自動設定（disabled 時は "disabled"、selected 時は "chipsSelected"、それ以外は "tertiary"）
- BgIcon の場合はそのまま表示
