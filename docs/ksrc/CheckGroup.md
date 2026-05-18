# CheckGroup

複数のチェックボックスを縦方向にグループ化するコンポーネント。

## 概要

フォームフィールドのグループ化。オプションのタイトルや必須マーク（Tag）の表示が可能。Checkbox コンポーネントを複数並べて、一つのグループとして管理する。

## Props

| 名称 | 型 | 必須 | デフォルト | 説明 |
|------|------|------|------|------|
| `checkItemList` | `Array<CheckboxProps>` | ○ | - | チェックボックスの配列（name と isWide は自動で設定されるため省略） |
| `groupName` | `string` | ○ | - | グループ全体の name 属性（各 Checkbox に自動適用） |
| `title` | `{ label: string; required?: boolean }` | | - | グループのタイトル。required=true 時は Tag が表示される |
| `isWide` | `boolean` | | - | 各 Checkbox の isWide を統一設定 |

## 使用例

### 基本的な使用
```jsx
<CheckGroup
  groupName="features"
  title={{ label: "機能を選択", required: true }}
  checkItemList={[
    { id: "f1", label: "機能1", checked: true, onChange: handleChange },
    { id: "f2", label: "機能2", checked: false, onChange: handleChange },
    { id: "f3", label: "機能3", checked: false, onChange: handleChange },
  ]}
/>
```

### タイトルなし
```jsx
<CheckGroup
  groupName="agreement"
  checkItemList={[
    { id: "tos", label: "利用規約に同意", checked: agree.tos, onChange: ... },
    { id: "privacy", label: "プライバシーポリシーに同意", checked: agree.privacy, onChange: ... },
  ]}
/>
```

## レイアウト

- **タイトル領域**: HStack で label と Tag（required=true 時）を配置
- **チェックボックス領域**: VStack で複数の Checkbox を縦方向に配置
- **ギャップ**: グループ全体で 8px のギャップ

## 自動設定

各 Checkbox に以下が自動適用されます：

| 項目 | 値 | 説明 |
|-----|-----|------|
| `name` | `groupName` | すべての Checkbox で統一 |
| `isWide` | 親の `isWide` 値 | wide モードを統一 |
| `key` | `item.id ?? index` | React key 用 |
