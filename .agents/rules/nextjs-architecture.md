---
paths:
  - "app/**/*"
  - "src/app/**/*"
  - "features/**/*"
  - "components/**/*"
  - "lib/**/*"
---

# Next.js App Router + Feature-based 構成方針（草案）

新規で作る場合は、`Next.js App Router` + `feature-based` 構成を基本方針とする。  
`app` はルーティング、`public` は静的ファイル、`src` はアプリケーションコードを配置する。  
`(public)` / `(private)` のような Route Group は URL に含まれないため、アクセス制御単位での整理に使う。

```txt
src/
├─ app/
│  ├─ layout.tsx
│  ├─ page.tsx
│  ├─ globals.css
│  │
│  ├─ (public)/
│  │  ├─ login/
│  │  │  └─ page.tsx
│  │  └─ signup/
│  │     └─ page.tsx
│  │
│  ├─ (private)/
│  │  ├─ layout.tsx
│  │  ├─ dashboard/
│  │  │  └─ page.tsx
│  │  ├─ todos/
│  │  │  ├─ page.tsx
│  │  │  ├─ loading.tsx
│  │  │  └─ error.tsx
│  │  └─ settings/
│  │     └─ page.tsx
│  │
│  └─ api/
│     └─ todos/
│        └─ route.ts
│
├─ features/
│  ├─ auth/
│  │  ├─ components/
│  │  ├─ hooks/
│  │  ├─ api/
│  │  ├─ types/
│  │  └─ utils/
│  │
│  └─ todos/
│     ├─ components/
│     ├─ hooks/
│     ├─ api/
│     ├─ types/
│     ├─ schemas/
│     └─ utils/
│
├─ components/
│  ├─ ui/
│  └─ layout/
│
├─ lib/
│  ├─ api/
│  ├─ auth/
│  ├─ constants/
│  └─ utils/
│
├─ hooks/
├─ types/
└─ styles/

public/
```

## Server/Client コンポーネント分離方針

- データ取得・認可・整形は `Server Component` 側で実施する。
- インタラクション（フォーム操作、状態管理、イベント処理）は `Client Component` 側に寄せる。
- 可能な限り `Server Component` をデフォルトにし、`"use client"` は必要最小限にする。

## データフェッチの鉄則: RSCファースト

「どこで fetch するか？」の基本は以下。

- できるだけ `page.tsx` などの `Server Component` トップレベルで取得する。
- 取得データは feature 配下の表示コンポーネントへ `Props` で渡す。
- これにより、`データ取得 (Backend)` と `表示 (UI)` の境界が明確になり、`Streaming` / `Suspense` を使った最適化もしやすくなる。

```tsx
// src/app/posts/page.tsx
import { getPosts } from "@/features/posts/api/get-posts";
import { PostList } from "@/features/posts/components/post-list";

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <main>
      <h1>投稿一覧</h1>
      <PostList posts={posts} />
    </main>
  );
}
```

## 命名ルール（サーバー受け口）

サーバー側でデータを受け取り、表示用コンポーネントへ橋渡しする責務を持つコンポーネントは `XxxContainer` で命名する。

- 例: `PostsContainer`, `TodosContainer`, `DashboardContainer`
- 役割: Fetch / 認可チェック / データ整形 / Presentational Component への Props 注入

## Client 側データ取得（React Query）

- `Server Component` に寄せられるデータ取得は必ず RSC で行う。
- ブラウザ操作起点で再取得が必要な場合のみ、`@tanstack/react-query` の `useQuery` / `useMutation` を使う。
- `Client Component` で `useEffect + fetch` は禁止。必要な場合でもまず `useQuery` で置き換えを検討する。
- API 呼び出し関数は `features/<feature>/api/client/*.ts` に配置し、Component 直書き fetch を避ける。
