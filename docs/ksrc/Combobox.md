# Combobox

検索可能なドロップダウンリストコンポーネント。

## 概要

テキスト入力に応じてメニューをフィルタリング・表示するコンボボックス。複数サイズ、エラーハンドリング、カスタマイズ可能なメニュー配置をサポート。

## Props

| 名称 | 型 | 必須 | デフォルト | 説明 |
|------|------|------|------|------|
| `items` | `ComboboxItem[]` | ○ | - | メニューアイテムの配列 |
| `text` | `string` | | `""` | コンボボックスの現在の入力値 |
| `onChange` | `(text: string) => void` | ○ | - | テキスト変更時のコールバック |
| `verticalSize` | `"small" \| "medium" \| "mediumGrid" \| "smallGrid" \| "xSmallGrid"` | | `"medium"` | コンボボックスの高さ |
| `horizontalSize` | `"fit" \| "small" \| "medium" \| "large"` | | `"medium"` | コンボボックスの幅 |
| `isError` | `boolean` | | `false` | エラー状態（ボーダーが alert 色に変わる） |
| `errorMessage` | `string` | | - | エラーメッセージ（isError=true 時に表示） |
| `disabled` | `boolean` | | - | コンボボックスを無効化 |
| `placeholder` | `string` | | - | 入力フィールドのプレースホルダ |
| `menuSize` | MenuList の size | | - | メニューのサイズ（未指定時は horizontalSize） |
| `isOpenUp` | `boolean` | | - | メニューを上方向に開くか |
| `onInitialize` | `(focus: () => void) => void` | | - | マウント時に呼ばれ、focus 関数を受け取る |
| `onFocus` | `() => void` | | - | input フォーカス時のコールバック |
| `onKeyDown` | `(e: KeyboardEvent) => void` | | - | input キー操作時のコールバック |

## Size Variants

### verticalSize
| size | 高さ | フォントサイズ |
|------|------|---------|
| `small` | 40px | 16px |
| `medium` | 48px | 16px |
| `mediumGrid` | 40px | 16px |
| `smallGrid` | 32px | 14px |
| `xSmallGrid` | 24px | 12px |

### horizontalSize
| size | 幅 |
|------|-----|
| `fit` | 100% |
| `small` | 160px |
| `medium` | 240px |
| `large` | 320px |

## 使用例

### 基本的な使用
```jsx
const [value, setValue] = useState("");

<Combobox
  text={value}
  onChange={setValue}
  items={[
    { text: "東京都", isCategory: false },
    { text: "埼玉県", isCategory: false },
    { text: "千葉県", isCategory: false },
  ]}
/>
```

### エラーメッセージ付き
```jsx
<Combobox
  text={selectedCity}
  onChange={setSelectedCity}
  isError={!selectedCity}
  errorMessage="都市を選択してください"
  items={cityList}
/>
```

### グリッド用（小型）
```jsx
<Combobox
  verticalSize="smallGrid"
  horizontalSize="small"
  text={filter}
  onChange={setFilter}
  items={filterOptions}
/>
```

## 動作

### メニュー表示トリガー
- **"all"**: Enter キー、スペースキー、矢印ボタンクリック時に全アイテム表示
- **"part"**: テキスト入力（1文字以上）時に入力値で自動フィルタリング表示
- **Escape キー**: メニューを閉じる
- **クリック外**: メニューを自動で閉じる

### フィルタリング
- `items` に `isCategory: true` が含まれる場合、カテゴリーは常に表示（フィルタ対象外）
- テキストが空の場合は全アイテム表示

## アクセシビリティ

- `role="combobox"`、`aria-haspopup="listbox"`、`aria-expanded` で ARIA 対応
- `aria-disabled` で無効状態を通知
- フォーカス管理：input フォーカス時のメニュー自動表示
