# GitHub OAuth + httpOnly Cookie 運用ガイド

このドキュメントは、**DBにトークンを保存せず**に GitHub Projects API を扱うための実装方針をまとめたものです。

## 結論

DB保存を避ける場合は、次の構成がシンプルで安全です。

1. GitHub OAuth でログイン
2. callback で `access_token` を取得
3. `httpOnly Cookie` に保存
4. Route Handler が Cookie から token を読み、GitHub API を代理呼び出し
5. フロントは自APIだけ叩く（tokenを直接扱わない）

---

## 推奨アーキテクチャ

```text
React Component
  ↓ fetch('/api/github/...')
Next.js Route Handler
  ↓ request.cookies から token 取得
GitHub GraphQL API
```

- フロントに token を渡さない
- token はサーバー経由利用に限定する

---

## なぜ localStorage は避けるべきか

`localStorage` に token を保存すると、XSS で盗まれるリスクが高い。

```ts
// NG
localStorage.setItem('github_access_token', token)
```

`httpOnly Cookie` なら JavaScript から読めないため、同じリスクを下げられる。

---

## 実装手順

## 1. OAuth callback で token 取得 → Cookie 保存

- `code` と `state` を検証
- GitHub の token endpoint で `access_token` 交換
- `httpOnly Cookie` に保存

保存時の設定例:

```ts
response.cookies.set('github_access_token', accessToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
})
```

## 2. Route Handler で Cookie を読んで GitHub API 呼び出し

- `request.cookies.get('github_access_token')` で token 取得
- 無ければ `401` を返す
- あれば GitHub GraphQL に `Authorization: Bearer ...` で代理リクエスト

## 3. フロントは自APIだけ呼ぶ

```ts
// OK
await fetch('/api/github/projects')

// NG: フロントからGitHubへ直接token付き呼び出し
await fetch('https://api.github.com/graphql', {
  headers: { Authorization: `Bearer ${token}` },
})
```

## 4. ログアウト時は Cookie 削除

```ts
response.cookies.delete('github_access_token')
```

---

## アプリ内アカウントとの紐づけ方針

GitHub OAuth は認証（本人確認）のみに使い、アプリ内の認可（操作権限）はアプリDBで管理する。

- `username` では判定しない（変更される可能性があるため）
- 紐づけキーは GitHub の不変IDである `github_user_id` を使う
- ログイン時に `users` を `github_user_id` で `find or create` する
- API可否は `users.id` に紐づくロールで判定する

最小テーブル例:

- `users`: `id`, `github_user_id`, `login`
- `projects`: `id`, `name`
- `project_members`: `project_id`, `user_id`, `role` (`owner` / `editor` / `viewer`)

判定例:

- プロジェクト登録: `owner` のみ許可
- 編集系: `owner`, `editor` を許可
- 閲覧系: `owner`, `editor`, `viewer` を許可

---

## Organization OAuth制限エラーの扱い

`Although you appear to have the correct authorization credentials, ... OAuth App access restrictions ...`
が返る場合、トークン不備ではなく、Organization側のOAuth App制限が原因。

- サーバーは `403` と専用エラーコード（例: `ORG_OAUTH_APP_RESTRICTED`）を返す
- フロントは「組織管理者にOAuth App許可が必要」であることを表示する
- 再試行前提のエラー（`INSUFFICIENT_SCOPES`）とは分けて扱う

---

## セキュリティ要件（必須）

1. `httpOnly` を必須化
2. `secure` を本番で有効化
3. `sameSite: 'lax'` 以上
4. CSRF対策（更新系APIでは特に必須）
5. token をログへ出さない
6. 最小スコープ（参照のみなら `read:project`）

---

## スコープ不足時の扱い

GitHubログイン済みでも、必要スコープがないと `INSUFFICIENT_SCOPES` になる。

対策:

1. API初回呼び出しでスコープ不足を検知
2. 再同意導線へ誘導
3. 必要スコープ付与後に再試行

---

## DB保存なし運用のメリット / デメリット

メリット:

- 実装が早い
- DB設計が不要
- 小規模ツールで導入しやすい

デメリット:

- ブラウザ依存（Cookie削除で再ログイン）
- 複数端末での一元管理が弱い
- token失効や監査の管理が弱くなりやすい

---

## 将来拡張

- Cookieに生tokenを入れず暗号化して保存
- OAuthトークン更新フロー追加
- 監査ログ・連携解除機能の実装

