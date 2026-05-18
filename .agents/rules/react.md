---
paths:
  - "**/*.tsx"
  - "components/**/*"
  - "features/**/*"
  - "app/**/*"
  - "hooks/**/*"
---

# React規約

## Hook

- `useEffect` は原則禁止。外部システムとの同期（DOM操作・タイマー・イベントリスナー等）など、どうしても必要な場合のみ使う
- データ取得は `useEffect` ではなく `@tanstack/react-query` を使う（`useQuery` / `useMutation`）
- `useQuery` は「ユーザー操作やクライアント状態に依存する取得」のみで使用し、初期表示データは RSC で取得する
- `useCallback` / `useMemo` は不要。React Compilerが設定済みのため手動で書かない
- `setState` の更新関数の引数に `prev` という名前は使わない。頭文字1文字または `prevXxx` 形式にする
  - ✅ `setCount(c => c + 1)`
  - ✅ `setUser(prevUser => ({ ...prevUser, name }))`
  - ❌ `setCount(prev => prev + 1)`

## JSX

- `boolean` の props を渡すとき、`true` の場合でも省略せず明示的に書く（Biomeが整形する）
  - ✅ `<Component isHoge={true} />`
  - ❌ `<Component isHoge />`
- `null` を返すだけの条件描画は `?: null` ではなく `&&` を使う
  - ✅ `{isOpen && <Dialog />}`
  - ❌ `{isOpen ? <Dialog /> : null}`
- `?:` は `else` 側にも表示ロジックがある場合のみ使う

## コンポーネント構成

- default export 禁止（コンポーネント・features 内）
- 新規コンポーネントには `.stories.tsx` を同ディレクトリに作成する
- `features/` は自己完結（feature 内に `components / actions / types / utils` を持つ）
