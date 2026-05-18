# AccordionPanel

詳細情報を開閉表示するアコーディオンコンポーネント。

## 概要

`<details>` 要素をベースにした、タイトルクリックで開閉する動作確認表示パネル。制御されたコンポーネント（controlled）と非制御コンポーネント（uncontrolled）の両パターンに対応。

## Props

| 名称 | 型 | 必須 | デフォルト | 説明 |
|------|------|------|------|------|
| `title` | `string \| { opened: string; closed: string }` | ○ | - | アコーディオンのタイトル。文字列、または開閉時で異なるテキストを指定可 |
| `frame` | `"box" \| "line" \| "secondary"` | | `"box"` | フレームスタイル |
| `titlePlace` | `"left" \| "center"` | | `"left"` | タイトルの配置 |
| `isEllipsis` | `boolean` | | `false` | タイトル行のテキストを省略（overflow: ellipsis）するか |
| `firstOpen` | `boolean` | | `false` | 初期状態を開いている状態にするか（非制御時） |
| `controlled` | `{ isOpen: boolean; onClick: () => void }` | | - | 制御コンポーネント化する場合に指定 |
| `children` | `ReactNode` | ○ | - | アコーディオンパネル内のコンテンツ |

## Variants

### frame
- `box`: 枠線付きボックススタイル（デフォルト）
- `line`: 下線スタイル
- `secondary`: プライマリカラーの枠線ボックス

### titlePlace
- `left`: タイトルを左揃え（デフォルト）
- `center`: タイトルを中央揃え、矢印を右に配置

## 使用例

### 非制御コンポーネント
```jsx
<AccordionPanel title="詳細情報" firstOpen={false}>
  <p>パネルの内容</p>
</AccordionPanel>
```

### 制御コンポーネント
```jsx
const [isOpen, setIsOpen] = useState(false);

<AccordionPanel
  title={{ opened: "詳細を隠す", closed: "詳細を表示" }}
  frame="box"
  controlled={{ isOpen, onClick: () => setIsOpen(!isOpen) }}
>
  <p>パネルの内容</p>
</AccordionPanel>
```

### 中央配置
```jsx
<AccordionPanel
  title="セクション"
  frame="secondary"
  titlePlace="center"
>
  <p>中央配置されたタイトル</p>
</AccordionPanel>
```

## スタイリング

- **summary**: 矢印アイコン + テキスト、クリック可能なボタン領域
- **details**: コンテナとなるフレーム
- **panel**: コンテンツ領域（子要素をラップ）

## アクセシビリティ

- `aria-expanded` 属性で開閉状態を通知
- `role="alert"` は使用していません（semanticは`<details>`と`<summary>`）
