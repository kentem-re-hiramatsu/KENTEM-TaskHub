# GitHub Projects API 接続確認ログ（実施記録）

このドキュメントは、`users/kentem-re-hiramatsu/projects/6` を対象に実施した API 取得確認の手順と結果を記録したものです。
今後の実装時に、同じ手順で疎通確認できるように残しています。

## 1. 対象

- Project URL: `https://github.com/users/kentem-re-hiramatsu/projects/6`
- login: `kentem-re-hiramatsu`
- project number: `6`

## 2. 事前確認

実行コマンド:

```bash
gh --version
gh auth status
```

初回状態:

- `gh` は利用可能
- ログイン済み
- ただしトークンスコープに `read:project` がなく、Projects API が叩けない状態

## 3. 失敗ケース（権限不足）

実行コマンド:

```bash
gh api graphql -f query='query($login: String!, $number: Int!){ user(login: $login){ projectV2(number: $number){ id title url } } }' -f login='kentem-re-hiramatsu' -F number=6
```

結果:

- `INSUFFICIENT_SCOPES`
- `projectV2` 取得には `read:project` が必要

## 4. スコープ追加

実行コマンド（対話認証あり）:

```bash
gh auth refresh --hostname github.com -s read:project
```

補足:

- 非対話で実行するとタイムアウトする場合がある
- 必要に応じてユーザー操作で認可を完了する

確認コマンド:

```bash
gh auth status
```

確認結果:

- スコープに `read:project` が追加された

## 5. Project 取得成功

実行コマンド:

```bash
gh api graphql -f query='query($login: String!, $number: Int!){ user(login: $login){ projectV2(number: $number){ id title url } } }' -f login='kentem-re-hiramatsu' -F number=6
```

取得結果:

- id: `PVT_kwHOCgzKpc4BXj5B`
- title: `ver_1.0.0`
- url: `https://github.com/users/kentem-re-hiramatsu/projects/6`

## 6. Issue 一覧取得成功

実行コマンド:

```bash
gh api graphql -f query='query($login: String!, $number: Int!){ user(login: $login){ projectV2(number: $number){ title items(first: 50){ nodes { id content { __typename ... on Issue { id number title url state assignees(first: 10){ nodes { login } } } } } } } } }' -f login='kentem-re-hiramatsu' -F number=6
```

取得結果（当時）:

- Issue `#1` テスト
- URL: `https://github.com/kentem-re-hiramatsu/KENTEM-TaskHub/issues/1`
- state: `OPEN`
- assignees: なし

## 7. 実装へ活かすポイント

- Projects API を使う場合は、事前に `read:project` を必須チェックする
- User Project 取得は `user(login) + projectV2(number)` で実装できる
- Organization Project 取得は `organization(login) + projectV2(number)` を使う
- 初期疎通確認では次の順に実行すると切り分けしやすい
  1. `gh auth status`
  2. Project メタ情報取得（id/title/url）
  3. items 取得（Issue / PullRequest / DraftIssue 判定）

## 8. 次の拡張候補

- `items.pageInfo` と `after` を使ったページネーション対応
- `fieldValues` を取得して Status / Iteration / Points を画面に反映
- `Issue` 以外（`PullRequest`, `DraftIssue`）の分岐処理追加

---

## 9. Webアプリ実装ルール（OAuth再同意）

GitHubログインを使う場合でも、Projects API で必要なスコープが不足することがあるため、次を実装ルールにする。

- ログイン後の初回API呼び出しでスコープ不足をチェックする
- `INSUFFICIENT_SCOPES` を検出したら、再同意導線へ遷移させる
- 必須スコープは参照時 `read:project`、更新時 `project`
- 再同意後に同じクエリを再実行し、取得成功を確認する

### 推奨チェック手順

1. Project メタ情報（`id/title/url`）取得
2. items 取得
3. fieldValues 取得

この順でチェックすると、どの段階で権限不足かを切り分けしやすい。

## 10. トークン取り扱いルール（補足）

今回の確認で、サーバー固定トークン未設定時に `GITHUB_TOKEN または GITHUB_PAT が設定されていません` となることを確認した。
本実装では以下ルールを採用する。

- 固定PATの永続保存を前提にしない
- GitHub OAuthログイン済みユーザーのトークンを、API確認時のみサーバー側で一時利用する
- セッションは `httpOnly` で保持し、ブラウザJSには露出しない
- レスポンスやログへトークンを出力しない
- スコープは `read:project` を基本とする

これにより、機能要件（確認ボタンでの疎通確認）とセキュリティ要件（露出最小化）を両立する。
