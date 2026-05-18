---
paths:
  - "**/*.ts"
  - "**/*.tsx"
---

# コーディング規約

## プロジェクト別

- プロジェクト固有のコーディング規約は、各プロジェクトの `.claude/CLAUDE.md` を確認すること

## Props の並び順

`interface` / `type` で props を定義するときは、以下の順序で並べる。

1. 必須の値（プリミティブ・オブジェクト等）
2. 任意の値（`?` 付き）
3. 必須の関数
4. 任意の関数（`?` 付き）

```tsx
interface AttendanceLayoutProps {
  title: string;
  rows: AttendanceRow[];
  description?: string;
  onSelect: (id: string) => void;
  onClose?: () => void;
}
```

## Props に渡す値の整形

- JSX で props に値を渡すとき、インラインで2行以上になる場合は関数として切り出す
- 1行に収まるならインラインのままでよい

```tsx
// Bad
<List
  onClick={(item) => {
    const next = items.filter((i) => i.id !== item.id);
    setItems(next);
  }}
/>

// Good
const handleClick = (item: Item) => {
  const next = items.filter((i) => i.id !== item.id);
  setItems(next);
};

return <List onClick={handleClick} />;
```

## 中間変数を作らない

- 使用箇所が1箇所しかない値は、変数に切り出さずその場で直接記述する

```tsx
// Bad
const fullName = `${user.firstName} ${user.lastName}`;
return <Text>{fullName}</Text>;

// Good
return <Text>{`${user.firstName} ${user.lastName}`}</Text>;
```

## 真偽値は使う側の表現に合わせて定義する

- 使用箇所で `!isXxx` として打ち消しているなら、定義側を反転して使用側を肯定形にする

```ts
// Bad
const isDisabled = isLoading || hasError;
if (!isDisabled) {
  submit();
}

// Good
const isEnabled = !isLoading && !hasError;
if (isEnabled) {
  submit();
}
```
