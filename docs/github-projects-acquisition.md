# GitHub Projects 取得手順

このドキュメントは、プロジェクト登録で利用する GitHub Projects（Projects v2）情報を取得するための手順です。

## 1. 事前準備

- GitHub にログインしていること
- 対象 Organization の Project を閲覧できる権限があること

## 2. Project URL を取得する

1. 対象 Organization の `Projects` を開く
2. 対象プロジェクトを開く
3. ブラウザ URL をコピーする

例:

- `https://github.com/orgs/ks-kentem/projects/220`

## 3. Project 番号を取得する

Project URL の末尾の数字が Project 番号です。

- URL: `https://github.com/orgs/ks-kentem/projects/220`
- Project 番号: `220`

## 4. Organization 名を取得する

Organization Project の場合、URL の `/orgs/<organization>/projects/...` の `<organization>` が Organization 名です。

- URL: `https://github.com/orgs/ks-kentem/projects/220`
- Organization 名: `ks-kentem`

## 5. 画面入力との対応

プロジェクト登録画面の `基本情報` では次を入力します。

- `Project URL`: 2 で取得した URL
- `Project 番号`: 3 で取得した番号

※ Organization 名は URL から判別できるため、画面入力は不要です。

## 6. 取得できないときの確認ポイント

- Projects v2 ではなく Classic Project を開いていないか
- 対象 Organization の Project 参照権限があるか
- URL が途中までしかコピーされていないか

## 7. 補足

GitHub Docs の GraphQL 例は、Organization Project 取得時に `organization(login)` と `projectV2(number)` を使います。つまり取得の主キーは `organization + project number` です。

## 8. 認証・権限の仕様メモ

- GitHub OAuth はログイン認証（本人確認）用途とする
- Webアプリ内の操作権限はアプリDBのロールで判定する（`username` 判定は使わない）
- GitHub連携ユーザーの紐づけは `github_user_id` を使う
- `OAuth App access restrictions` エラー時は、Organization管理者によるOAuth App許可が必要
