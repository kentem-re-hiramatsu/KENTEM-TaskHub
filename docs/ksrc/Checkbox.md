# Checkbox

チェックボックス入力コンポーネント。チェック・未チェック・不確定の3状態に対応。

## 概要

ラベル付き・なしの両方に対応し、不確定状態（indeterminate）をサポート。通常のフォーム操作やフィルタリング、一括操作などで使用。

## Props

| 名称 | 型 | 必須 | デフォルト | 説明 |
|------|------|------|------|------|
| `checked` | `boolean \| "indeterminate"` | ○ | - | チェック状態。true: チェック、false: 未チェック、"indeterminate": 不確定 |
| `id` | `string` | | - | input の id 属性 |
| `name` | `string` | | - | input の name 属性 |
| `value` | `string \| number \| readonly string[]` | | - | input の value 属性 |
| `disabled` | `boolean` | | - | チェックボックスを無効化 |
| `onChange` | `(e: ChangeEvent<HTMLInputElement>) => void` | | - | 状態変更時のコールバック |
| `label` | `string` | | - | チェックボックスの右側に表示するラベルテキスト |
| `isWide` | `boolean` | | - | ラベル付き時に、ラベル領域を広げるか |

## 状態

| checked 値 | 説明 | aria-checked 値 |
|-----------|------|-----------------|
| `true` | チェック状態 | `true` |
| `false` | 未チェック状態 | `false` |
| `"indeterminate"` | 不確定状態（子フォーム複数チェック時など） | `"mixed"` |

## 使用例

### シンプルなチェックボックス
```jsx
const [checked, setChecked] = useState(false);

<Checkbox
  id="agree"
  checked={checked}
  onChange={(e) => setChecked(e.target.checked)}
/>
```

### ラベル付き
```jsx
<Checkbox
  id="newsletter"
  label="ニュースレターを購読"
  checked={isSubscribed}
  onChange={(e) => setIsSubscribed(e.target.checked)}
/>
```

### 不確定状態（親チェックボックス）
```jsx
const allChecked = items.every(i => i.checked);
const someChecked = items.some(i => i.checked);

<Checkbox
  checked={allChecked ? true : someChecked ? "indeterminate" : false}
  onChange={() => onParentToggle()}
/>
```

### 無効化
```jsx
<Checkbox
  id="readonly"
  label="編集不可"
  checked={true}
  disabled={true}
/>
```

## スタイリング

- **チェックボックス本体**: 40x40px（パディング含む）、円形のホバー背景
- **アイコン**: 24x24px の SVG マスク画像使用
- **ラベル**: Typography で表示、disabled 時は色が変わる
- **isWide**: ラベル領域が広がり、クリック領域が拡大

## アクセシビリティ

- `aria-checked` を "mixed" | "true" | "false" で設定
- ラベル付き時は `<label>` でラップし、id を参照
- disabled 時は cursor: not-allowed
