# URL 一覧

## 画面 URL

| URL | 画面名 | 権限 | 備考 |
|-----|--------|------|------|
| `/login` | ログイン | 全員 | 未ログイン時のデフォルト遷移先 |
| `/my-projects` | 担当プロジェクト | 全ロール | `user`: お気に入りPJのみ / `admin`・`superAdmin`: 全PJ |
| `/projects` | プロジェクト一覧 | 全ロール | 全PJの進捗カード一覧 |
| `/projects/[id]` | プロジェクト詳細 | 全ロール | `user`は所属PJのみ遷移可。`/projects` からのみ遷移 |
| `/projects/[id]/settings` | プロジェクト設定 | `admin`・`superAdmin` | プロジェクト詳細ヘッダーの「設定」から遷移 |
| `/project-registration` | プロジェクト登録 | `admin`・`superAdmin` | 新規作成・編集のウィザード |
| `/settings` | 設定 | `admin`・`superAdmin` | メンバー管理・権限設定への導線 |
| `/settings/permissions` | 権限設定 | `admin`・`superAdmin` | — |
| `/estimate-criteria` | 見積基準 | `superAdmin` | 2nd フェーズ以降対応 |
| `/profile` | 個人設定 | 全ロール | ヘッダーメニューからアクセス |
| `/developer` | 開発者 | `superAdmin` | — |
