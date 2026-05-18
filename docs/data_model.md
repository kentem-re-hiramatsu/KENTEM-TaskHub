# データモデル設計

**バージョン**: 0.6.0
**作成日**: 2026-05-09
**ベース仕様書**: [project_progress_spec.md](./project_progress_spec.md) v1.8.0
**参考アーキテクチャ**: [ks-kentem/cloud-doko-plan-core](https://github.com/ks-kentem/cloud-doko-plan-core) `docs/datadesign/`
**ステータス**: 論点 A〜K 合意済み（2026-05-09）／ core アーキテクチャ準拠版

---

## 0. このドキュメントの目的

仕様書 §7「データモデル（概要）」を、実装可能な粒度（型・必須/任意・既定値・関係・派生値・enum 候補値）まで詳細化する。

v0.4.0 で **`cloud-doko-plan-core` のテーブル定義書流儀に準拠** するよう全面改訂した。具体的には：

- 物理名を **PascalCase**（C# Entity と一致）
- 型を **SQL Server**（uniqueidentifier / nvarchar(N) / bit / datetime2 / decimal(P,S) など）
- 全テーブルに **`CustomerId int NOT NULL`**（マルチテナント識別子）
- 全テーブルに **共通監査カラム**（`CreatedOn` / `ModifiedOn` / `CreatedUserId` / `ModifiedUserId`）
- マスタの論理削除は **`IsRetired bit`** で実現（共通の `DeletedAt` は持たない）
- enum 値はすべて **int** で保存（C# enum と同期）
- 値リスト（done_statuses 等）は **子テーブル `FieldMappingValue` で正規化**
- 各テーブル定義は **テーブル情報 / カラム情報 / インデックス / 制約 / 外部キー** の 5 セクション

仕様書からの解釈・補完が必要だった箇所は §7「論点・解釈メモ」に集約している。

---

## 1. 設計方針

### 1.1 命名規則

| 対象 | 規則 | 例 |
|---|---|---|
| テーブル物理名 | PascalCase | `Project`, `ProjectIterationState` |
| カラム物理名 | PascalCase | `IterationCalendarId`, `IsRetired` |
| 主キー | `Id` 固定（uniqueidentifier）| - |
| 外部キーカラム | `<参照先テーブル名>Id` | `ProjectId`, `IterationCalendarEntryId` |
| 主キー制約 | `PK_<テーブル名>` | `PK_Project` |
| インデックス | `IX_<テーブル名>_<カラム…>` | `IX_Project_CustomerId` |
| ユニーク制約 | `UQ_<テーブル名>_<カラム…>` | `UQ_IterationCalendar_CustomerId_FiscalYear` |
| 外部キー制約 | `FK_<テーブル名>_<カラム名>` | `FK_Project_IterationCalendarId` |

### 1.2 DB / 型体系（SQL Server 準拠）

| 用途 | 型 |
|---|---|
| 主キー / 外部キー（GUID）| `uniqueidentifier`（既定値 `newsequentialid()`）|
| テナント識別 / ユーザーID / 列挙値 / 整数 | `int` |
| 真偽値 | `bit` |
| 日付 | `date` |
| 時刻 | `time` |
| 日時 | `datetime2` |
| 小数（時間）| `decimal(10,5)` |
| 小数（ポイント / ベロシティ）| `decimal(10,2)` |
| 短い識別子・コード | `nvarchar(64)` |
| 名称（人物・班）| `nvarchar(200)` |
| 名称（プロジェクト）| `nvarchar(300)` |
| URL | `nvarchar(2000)` |
| 自由記述メモ | `nvarchar(1000)` |
| ステータス値（生値）| `nvarchar(100)` |
| マッピング値（リスト要素）| `nvarchar(200)` |
| エラーメッセージ | `nvarchar(2000)` |

### 1.3 共通カラム

すべてのテーブルが先頭・末尾に以下を持つ。

**先頭：**

| 物理名 | データ型 | Not Null | 用途 |
|---|---|---|---|
| `Id` | uniqueidentifier | ○ | 主キー（既定値 `newsequentialid()`）|
| `CustomerId` | int | ○ | テナント識別子（クラウドサービス契約単位）|

**末尾：**

| 物理名 | データ型 | Not Null | 用途 |
|---|---|---|---|
| `CreatedOn` | datetime2 | ○ | 作成日時（アプリ層で UTC 設定）|
| `ModifiedOn` | datetime2 | ○ | 更新日時（アプリ層で UTC 設定）|
| `CreatedUserId` | int | - | 作成ユーザーID |
| `ModifiedUserId` | int | - | 更新ユーザーID |

論理削除は core の流儀に従い、必要なマスタテーブルのみ `IsRetired bit` を持たせる（共通の `DeletedAt` 列は持たない）。本モデルでは `Project`, `Member` に `IsRetired` を設ける。

履歴は `SyncSnapshot` をトランザクション履歴テーブルとして保持することで担保する（同期実行ごとに 1 行追加）。

### 1.4 主要 enum（int 保存）

C# 側 enum と同期する想定で `int` カラムにマッピングする。

| 物理カラム | 値 | 名称 | 備考 |
|---|---|---|---|
| `Project.DataSourceType` | 1 | ApiGithub | GitHub Projects API（メイン）|
| | 2 | CsvGithub | CSV: GitHub Projects |
| | 3 | CsvBacklog | CSV: Backlog |
| `Member.Division` | 1 | Fe | |
| | 2 | Be | |
| | 3 | Test | 運用上は通常 FE/BE のみだが enum としては許容 |
| `Task.Division` | 0 | Unclassified | マッピング外の値はこれ |
| | 1 | Fe | |
| | 2 | Be | |
| | 3 | Test | |
| `FieldMapping.SourceKind` / `SyncSnapshot.SourceKind` | 1 | Api | |
| | 2 | Csv | |
| `FieldMapping.PointsSourceKind` | 1 | CustomField | カスタム数値フィールド名指定 |
| | 2 | LabelsSp | `sp:N` 形式の Label |
| `FieldMapping.DivisionSourceKind` | 1 | Labels | |
| | 2 | CustomField | |
| | 3 | CsvColumn | |
| `FieldMappingValue.ValueKind` | 1 | DoneStatus | |
| | 2 | InReviewStatus | |
| | 3 | FeValue | |
| | 4 | BeValue | |
| | 5 | TestValue | |
| `Task.StatusCategory` | 1 | Done | |
| | 2 | InReview | |
| | 3 | Other | 未着手・進行中など |
| `SyncSnapshot.Status` | 1 | Success | |
| | 2 | Partial | 一部失敗 |
| | 3 | Failed | |
| `Credential.Kind` | 1 | OAuth | GitHub OAuth（固定） |
| `OperationPermission.Role` | 1 | Admin | 管理者 |
| | 2 | ProjectLead | PL |
| | 3 | Member | 一般メンバー |

### 1.5 認証情報・アクセス制御について

- ユーザー認証は **GitHub OAuth ログインのみ** を許可する。
- ログイン後は GitHub 組織所属を検証し、**`@kentem` 非所属ユーザーはアプリ利用不可** とする。
- `Credential.SecretRef` には **トークン本体を直接保存しない**。外部シークレットストア参照キー（ARN / Vault パスなど）または暗号化済み値を保持する。

---

## 2. ER 図

```mermaid
erDiagram
    SystemConfig {
        Guid Id PK
        int CustomerId
        int DefaultWorkingDaysPerIteration
    }

    IterationCalendar {
        Guid Id PK
        int CustomerId
        int FiscalYear
        string Name
        bool IsActive
    }

    IterationCalendarEntry {
        Guid Id PK
        int CustomerId
        Guid IterationCalendarId FK
        int Number
        date StartDate
        date EndDate
        string Memo
    }

    Project {
        Guid Id PK
        int CustomerId
        string Name
        int DataSourceType
        Guid IterationCalendarId FK
        Guid StartIterationEntryId FK
        bool IncludeInReviewInProgress
        bool IsRetired
    }

    ProjectTotals {
        Guid ProjectId PK_FK
        int CustomerId
        decimal FeTotal
        decimal BeTotal
        decimal TestTotal
        datetime ComputedOn
    }

    ApiConnection {
        Guid Id PK
        int CustomerId
        Guid ProjectId FK
        string ProjectUrl
        string Owner
        string Repo
        int ProjectNumber
        Guid CredentialId FK
        datetime LastSyncedOn
    }

    Credential {
        Guid Id PK
        int CustomerId
        int Kind
        string SecretRef
    }

    FieldMapping {
        Guid Id PK
        int CustomerId
        Guid ProjectId FK
        int SourceKind
        string TitleSource
        string StatusSource
        string AssigneeSource
        string IterationSource
        string EstimatedHoursSource
        string ActualHoursSource
        int PointsSourceKind
        string PointsSourceName
        int DivisionSourceKind
        string DivisionSourceName
    }

    FieldMappingValue {
        Guid Id PK
        int CustomerId
        Guid FieldMappingId FK
        int ValueKind
        string Value
        int OrderId
    }

    Member {
        Guid Id PK
        int CustomerId
        string Name
        int Division
        decimal PlannedVelocity
        bool IsRetired
        int OrderId
    }

    MemberProjectAssignment {
        Guid Id PK
        int CustomerId
        Guid MemberId FK
        Guid ProjectId FK
        date AssignedFrom
        date AssignedTo
        bool IsPrimary
    }

    ProjectIterationState {
        Guid Id PK
        int CustomerId
        Guid ProjectId FK
        Guid IterationCalendarEntryId FK
    }

    IterationTotals {
        Guid ProjectIterationStateId PK_FK
        int CustomerId
        decimal FePointsTotal
        decimal BePointsTotal
        decimal TestPointsTotal
        datetime ComputedOn
    }

    IterationMember {
        Guid Id PK
        int CustomerId
        Guid ProjectIterationStateId FK
        Guid MemberId FK
        int WorkingDays
        bool IsWorkingDaysModified
        string WorkingDaysMemo
        decimal TargetPoints
        bool IsTargetPointsModified
    }

    SyncSnapshot {
        Guid Id PK
        int CustomerId
        Guid ProjectIterationStateId FK
        datetime SyncedOn
        int SourceKind
        int Status
        string ErrorMessage
    }

    Task {
        Guid Id PK
        int CustomerId
        Guid SyncSnapshotId FK
        string ExternalId
        string Title
        string StatusRaw
        int StatusCategory
        decimal Points
        decimal EstimatedHours
        decimal ActualHours
        string AssigneeName
        int Division
    }

    OperationPermission {
        Guid Id PK
        int CustomerId
        int UserId
        int Role
    }

    IterationCalendar      ||--o{ IterationCalendarEntry : "has"
    IterationCalendar      ||--o{ Project                : "referenced by"
    IterationCalendarEntry ||--o{ Project                : "as start_entry"
    IterationCalendarEntry ||--o{ ProjectIterationState  : "appears in"

    Project ||--|| ProjectTotals : "1:1（集計）"
    Project ||--o| ApiConnection : "0..1"
    Project ||--|| FieldMapping  : "1:1"
    Project ||--o{ MemberProjectAssignment : "has many"
    Project ||--o{ ProjectIterationState : "has many"

    ApiConnection }o--o| Credential : "refers"

    FieldMapping ||--o{ FieldMappingValue : "値リスト"

    ProjectIterationState ||--|| IterationTotals : "1:1（集計）"
    ProjectIterationState ||--o{ IterationMember : "has many"
    ProjectIterationState ||--o{ SyncSnapshot    : "has many"

    Member       ||--o{ MemberProjectAssignment : "assigned to"
    Member       ||--o{ IterationMember : "appears in"
    SyncSnapshot ||--o{ Task            : "has many"
```

---

## 3. テーブル一覧

| No. | 物理テーブル名 | 論理テーブル名 | 区分 |
|---|---|---|---|
| 1 | SystemConfig | システム設定 | 設定 |
| 2 | IterationCalendar | イテレーションカレンダー | マスタ |
| 3 | IterationCalendarEntry | イテレーションエントリ | マスタ |
| 4 | Project | プロジェクト | マスタ |
| 5 | ProjectTotals | プロジェクト総工数 | 集計（派生・保存）|
| 6 | ApiConnection | API接続情報 | マスタ |
| 7 | Credential | 認証情報 | マスタ |
| 8 | FieldMapping | フィールドマッピング | マスタ |
| 9 | FieldMappingValue | マッピング値リスト | マスタ |
| 10 | Member | メンバー | マスタ |
| 11 | MemberProjectAssignment | メンバー所属履歴 | トランザクション |
| 12 | ProjectIterationState | プロジェクトイテレーション状態 | トランザクション |
| 13 | IterationTotals | イテレーション総工数 | 集計（派生・保存）|
| 14 | IterationMember | イテレーションメンバー稼働 | トランザクション |
| 15 | SyncSnapshot | 同期スナップショット | トランザクション（履歴）|
| 16 | Task | タスク | トランザクション（履歴）|
| 17 | OperationPermission | 操作権限 | マスタ |

---

## 4. 集計・派生値の方針

仕様書では `ProjectTotals` `IterationTotals` `IterationMember.TargetPoints` などが「自動集計」「自動計算」と書かれているが、これらは **保存するか / 都度算出するか** で扱いが変わる。本ドラフトの方針：

| 値 | 保存 / 派生 | 理由 |
|---|---|---|
| `ProjectTotals.{Fe,Be,Test}Total` | **保存**（同期時に再計算して上書き）| プロジェクト一覧画面で都度集計するとコスト高。同期トリガでのみ変わる |
| `IterationTotals.{Fe,Be,Test}PointsTotal` | **保存**（同期時に再計算）| 同上 |
| `IterationMember.TargetPoints` 初期値 | **保存**（`WorkingDays × Member.PlannedVelocity`）| 手動上書きが効くため、保存しないと「上書き済みかどうか」を判断できない |
| `IterationMember.IsTargetPointsModified` | 保存 | 上書き有無の判定用フラグ |
| メンバー個人の実績ベロシティ | **派生**（保存しない）| 最新スナップショットから常時算出可能 |
| 進捗率 / 開発効率 / 予想進捗 | **派生** | 表示要求ごとに算出 |
| 予定 % / 実績 % | **派生** | 同上 |
| `Task.StatusCategory` | **保存**（同期時に判定）| `FieldMappingValue` への都度照合を避ける。マッピング変更時は再判定が必要 |

> 設計上の含意：同期処理は「`Task` 保存」と「`IterationTotals` 再計算」「`ProjectTotals` 再計算」を 1 トランザクションで実行する必要がある。

---

## 5. テーブル定義

### 5.1 SystemConfig（システム設定）

#### テーブル情報

| 項目 | 内容 |
|---|---|
| 物理テーブル名 | SystemConfig |
| 論理テーブル名 | システム設定 |
| 備考 | 会社全体の固定設定。テナントごとに 1 行のシングルトン。 |

#### カラム情報

| No. | 物理名 | データ型 | Not Null | デフォルト | Key | 備考 | 論理名 |
|---|---|---|---|---|---|---|---|
| 1 | Id | uniqueidentifier | ○ | newsequentialid() | PK | - | Id |
| 2 | CustomerId | int | ○ | - | - | - | CustomerId |
| 3 | DefaultWorkingDaysPerIteration | int | ○ | 10 | - | 仕様書 §2.5.2 | デフォルト稼働日数 |
| 4 | CreatedOn | datetime2 | ○ | - | - | - | 作成日時 |
| 5 | ModifiedOn | datetime2 | ○ | - | - | - | 更新日時 |
| 6 | CreatedUserId | int | - | - | - | - | 作成ユーザーID |
| 7 | ModifiedUserId | int | - | - | - | - | 更新ユーザーID |

#### インデックス情報

| No. | インデックス名 | カラムリスト | 主キー | ユニーク | 備考 |
|---|---|---|---|---|---|
| 1 | PK_SystemConfig | Id | Yes | Yes | - |

#### 制約情報

| No. | 制約名 | 種類 | 制約定義 |
|---|---|---|---|
| 1 | UQ_SystemConfig_CustomerId | UNIQUE | テナントごとに 1 行のみ |

#### 外部キー情報

| No. | 外部キー名 | カラムリスト | 参照先 | 参照先カラムリスト | DeleteBehavior |
|---|---|---|---|---|---|
| - | - | - | - | - | - |

---

### 5.2 IterationCalendar（イテレーションカレンダー）

#### テーブル情報

| 項目 | 内容 |
|---|---|
| 物理テーブル名 | IterationCalendar |
| 論理テーブル名 | イテレーションカレンダー |
| 備考 | 全社共通・年度ごとのイテレーションマスタ（管理者が登録）。仕様書 §2.4.1。 |

#### カラム情報

| No. | 物理名 | データ型 | Not Null | デフォルト | Key | 備考 | 論理名 |
|---|---|---|---|---|---|---|---|
| 1 | Id | uniqueidentifier | ○ | newsequentialid() | PK | - | Id |
| 2 | CustomerId | int | ○ | - | - | - | CustomerId |
| 3 | FiscalYear | int | ○ | - | - | 例: 2026 | 年度 |
| 4 | Name | nvarchar(100) | ○ | - | - | 例: 「2026年度カレンダー」 | カレンダー名 |
| 5 | IsActive | bit | ○ | 1 | - | 過去年度を非表示にしたい場合に使用 | 有効フラグ |
| 6 | CreatedOn | datetime2 | ○ | - | - | - | 作成日時 |
| 7 | ModifiedOn | datetime2 | ○ | - | - | - | 更新日時 |
| 8 | CreatedUserId | int | - | - | - | - | 作成ユーザーID |
| 9 | ModifiedUserId | int | - | - | - | - | 更新ユーザーID |

#### インデックス情報

| No. | インデックス名 | カラムリスト | 主キー | ユニーク | 備考 |
|---|---|---|---|---|---|
| 1 | PK_IterationCalendar | Id | Yes | Yes | - |
| 2 | IX_IterationCalendar_CustomerId | CustomerId | No | No | 一覧検索 |

#### 制約情報

| No. | 制約名 | 種類 | 制約定義 |
|---|---|---|---|
| 1 | UQ_IterationCalendar_CustomerId_FiscalYear | UNIQUE | 同一テナント内で年度を一意 |

#### 外部キー情報

| No. | 外部キー名 | カラムリスト | 参照先 | 参照先カラムリスト | DeleteBehavior |
|---|---|---|---|---|---|
| - | - | - | - | - | - |

---

### 5.3 IterationCalendarEntry（イテレーションエントリ）

#### テーブル情報

| 項目 | 内容 |
|---|---|
| 物理テーブル名 | IterationCalendarEntry |
| 論理テーブル名 | イテレーションエントリ |
| 備考 | カレンダー配下の各イテレーションの期間定義。変則期間（短縮/延長）も許容するため `StartDate` / `EndDate` を個別保持。仕様書 §2.4.1。 |

#### カラム情報

| No. | 物理名 | データ型 | Not Null | デフォルト | Key | 備考 | 論理名 |
|---|---|---|---|---|---|---|---|
| 1 | Id | uniqueidentifier | ○ | newsequentialid() | PK | - | Id |
| 2 | CustomerId | int | ○ | - | - | - | CustomerId |
| 3 | IterationCalendarId | uniqueidentifier | ○ | - | FK | - | カレンダーId |
| 4 | Number | int | ○ | - | - | カレンダー内連番（1, 2, 3, …）| イテレーション番号 |
| 5 | StartDate | date | ○ | - | - | 管理者が登録 | 開始日 |
| 6 | EndDate | date | ○ | - | - | 管理者が登録（変則対応のため算出ではなく直接保持）| 終了日 |
| 7 | Memo | nvarchar(1000) | - | - | - | 例:「年末年始のため1週間延長」| 備考 |
| 8 | CreatedOn | datetime2 | ○ | - | - | - | 作成日時 |
| 9 | ModifiedOn | datetime2 | ○ | - | - | - | 更新日時 |
| 10 | CreatedUserId | int | - | - | - | - | 作成ユーザーID |
| 11 | ModifiedUserId | int | - | - | - | - | 更新ユーザーID |

#### インデックス情報

| No. | インデックス名 | カラムリスト | 主キー | ユニーク | 備考 |
|---|---|---|---|---|---|
| 1 | PK_IterationCalendarEntry | Id | Yes | Yes | - |
| 2 | IX_IterationCalendarEntry_IterationCalendarId | IterationCalendarId | No | No | カレンダー内一覧 |
| 3 | IX_IterationCalendarEntry_CustomerId_StartDate | CustomerId, StartDate | No | No | 期間検索 |

#### 制約情報

| No. | 制約名 | 種類 | 制約定義 |
|---|---|---|---|
| 1 | UQ_IterationCalendarEntry_IterationCalendarId_Number | UNIQUE | カレンダー内で番号を一意 |

不変条件（アプリ層で保証）：同一カレンダー内で `StartDate <= EndDate`、エントリ間で期間重複なし、`Number` と日付順が一致する。

#### 外部キー情報

| No. | 外部キー名 | カラムリスト | 参照先 | 参照先カラムリスト | DeleteBehavior |
|---|---|---|---|---|---|
| 1 | FK_IterationCalendarEntry_IterationCalendarId | IterationCalendarId | IterationCalendar | Id | Cascade |

---

### 5.4 Project（プロジェクト）

#### テーブル情報

| 項目 | 内容 |
|---|---|
| 物理テーブル名 | Project |
| 論理テーブル名 | プロジェクト |
| 備考 | 仕様書 §2.3 / §3.2①。総工数（FE/BE/テスト）は `ProjectTotals` に切り出し。 |

#### カラム情報

| No. | 物理名 | データ型 | Not Null | デフォルト | Key | 備考 | 論理名 |
|---|---|---|---|---|---|---|---|
| 1 | Id | uniqueidentifier | ○ | newsequentialid() | PK | - | Id |
| 2 | CustomerId | int | ○ | - | - | - | CustomerId |
| 3 | Name | nvarchar(300) | ○ | - | - | 任意の表示名 | プロジェクト名 |
| 4 | DataSourceType | int | ○ | - | - | 1=ApiGithub / 2=Csv | データソース種別 |
| 5 | IterationCalendarId | uniqueidentifier | ○ | - | FK | 全社共通の年度カレンダー | 参照カレンダーId |
| 6 | StartIterationEntryId | uniqueidentifier | ○ | - | FK | カレンダー上のどのイテレーションから参加するか | 開始エントリId |
| 7 | IncludeInReviewInProgress | bit | ○ | 0 | - | 仕様書 §2.3.2 | プルリク中含めるフラグ |
| 8 | IsRetired | bit | ○ | 0 | - | 廃止プロジェクトの論理削除 | 廃止フラグ |
| 9 | CreatedOn | datetime2 | ○ | - | - | - | 作成日時 |
| 10 | ModifiedOn | datetime2 | ○ | - | - | - | 更新日時 |
| 11 | CreatedUserId | int | - | - | - | - | 作成ユーザーID |
| 12 | ModifiedUserId | int | - | - | - | - | 更新ユーザーID |

#### インデックス情報

| No. | インデックス名 | カラムリスト | 主キー | ユニーク | 備考 |
|---|---|---|---|---|---|
| 1 | PK_Project | Id | Yes | Yes | - |
| 2 | IX_Project_CustomerId | CustomerId | No | No | 一覧検索 |
| 3 | IX_Project_IterationCalendarId | IterationCalendarId | No | No | - |
| 4 | IX_Project_StartIterationEntryId | StartIterationEntryId | No | No | - |

#### 制約情報

| No. | 制約名 | 種類 | 制約定義 |
|---|---|---|---|
| - | - | - | - |

不変条件：`StartIterationEntryId` が指す `IterationCalendarEntry` は `IterationCalendarId` 配下のものでなければならない（アプリ層で保証）。

#### 外部キー情報

| No. | 外部キー名 | カラムリスト | 参照先 | 参照先カラムリスト | DeleteBehavior |
|---|---|---|---|---|---|
| 1 | FK_Project_IterationCalendarId | IterationCalendarId | IterationCalendar | Id | Restrict |
| 2 | FK_Project_StartIterationEntryId | StartIterationEntryId | IterationCalendarEntry | Id | Restrict |

---

### 5.5 ProjectTotals（プロジェクト総工数）

#### テーブル情報

| 項目 | 内容 |
|---|---|
| 物理テーブル名 | ProjectTotals |
| 論理テーブル名 | プロジェクト総工数 |
| 備考 | プロジェクト全体の FE/BE/Test ポイント合計（派生値を保存）。Project に対し 1:1。同期時に再計算。 |

#### カラム情報

| No. | 物理名 | データ型 | Not Null | デフォルト | Key | 備考 | 論理名 |
|---|---|---|---|---|---|---|---|
| 1 | ProjectId | uniqueidentifier | ○ | - | PK,FK | Project と 1:1（PK 兼 FK）| プロジェクトId |
| 2 | CustomerId | int | ○ | - | - | - | CustomerId |
| 3 | FeTotal | decimal(10,2) | ○ | 0 | - | - | FE 総ポイント |
| 4 | BeTotal | decimal(10,2) | ○ | 0 | - | - | BE 総ポイント |
| 5 | TestTotal | decimal(10,2) | ○ | 0 | - | - | テスト総ポイント |
| 6 | ComputedOn | datetime2 | ○ | - | - | 最終算出時刻 | 算出日時 |
| 7 | CreatedOn | datetime2 | ○ | - | - | - | 作成日時 |
| 8 | ModifiedOn | datetime2 | ○ | - | - | - | 更新日時 |
| 9 | CreatedUserId | int | - | - | - | - | 作成ユーザーID |
| 10 | ModifiedUserId | int | - | - | - | - | 更新ユーザーID |

#### インデックス情報

| No. | インデックス名 | カラムリスト | 主キー | ユニーク | 備考 |
|---|---|---|---|---|---|
| 1 | PK_ProjectTotals | ProjectId | Yes | Yes | - |

#### 制約情報

| No. | 制約名 | 種類 | 制約定義 |
|---|---|---|---|
| - | - | - | - |

#### 外部キー情報

| No. | 外部キー名 | カラムリスト | 参照先 | 参照先カラムリスト | DeleteBehavior |
|---|---|---|---|---|---|
| 1 | FK_ProjectTotals_ProjectId | ProjectId | Project | Id | Cascade |

---

### 5.6 ApiConnection（API接続情報）

#### テーブル情報

| 項目 | 内容 |
|---|---|
| 物理テーブル名 | ApiConnection |
| 論理テーブル名 | API接続情報 |
| 備考 | `Project.DataSourceType = ApiGithub` のときのみ存在。Project に対し 1:0..1。仕様書 §2.1.4 / §3.2④A。 |

#### カラム情報

| No. | 物理名 | データ型 | Not Null | デフォルト | Key | 備考 | 論理名 |
|---|---|---|---|---|---|---|---|
| 1 | Id | uniqueidentifier | ○ | newsequentialid() | PK | - | Id |
| 2 | CustomerId | int | ○ | - | - | - | CustomerId |
| 3 | ProjectId | uniqueidentifier | ○ | - | FK | - | プロジェクトId |
| 4 | ProjectUrl | nvarchar(2000) | - | - | - | URL もしくは Owner/Repo+ProjectNumber のいずれか | Project URL |
| 5 | Owner | nvarchar(200) | - | - | - | 例: `ks-kentem` | リポジトリオーナー |
| 6 | Repo | nvarchar(200) | - | - | - | - | リポジトリ名 |
| 7 | ProjectNumber | int | ○ | - | - | GitHub Projects のナンバー | Project 番号 |
| 8 | CredentialId | uniqueidentifier | - | - | FK | OAuthトークンの保管方式に応じて参照。ユーザー単位管理時は null 許容 | 認証情報Id |
| 9 | LastSyncedOn | datetime2 | - | - | - | UI「最終同期：…」表示用 | 最終同期日時 |
| 10 | CreatedOn | datetime2 | ○ | - | - | - | 作成日時 |
| 11 | ModifiedOn | datetime2 | ○ | - | - | - | 更新日時 |
| 12 | CreatedUserId | int | - | - | - | - | 作成ユーザーID |
| 13 | ModifiedUserId | int | - | - | - | - | 更新ユーザーID |

#### インデックス情報

| No. | インデックス名 | カラムリスト | 主キー | ユニーク | 備考 |
|---|---|---|---|---|---|
| 1 | PK_ApiConnection | Id | Yes | Yes | - |
| 2 | IX_ApiConnection_CredentialId | CredentialId | No | No | - |

#### 制約情報

| No. | 制約名 | 種類 | 制約定義 |
|---|---|---|---|
| 1 | UQ_ApiConnection_ProjectId | UNIQUE | Project に対して 1 行のみ |

#### 外部キー情報

| No. | 外部キー名 | カラムリスト | 参照先 | 参照先カラムリスト | DeleteBehavior |
|---|---|---|---|---|---|
| 1 | FK_ApiConnection_ProjectId | ProjectId | Project | Id | Cascade |
| 2 | FK_ApiConnection_CredentialId | CredentialId | Credential | Id | SetNull |

---

### 5.7 Credential（認証情報）

#### テーブル情報

| 項目 | 内容 |
|---|---|
| 物理テーブル名 | Credential |
| 論理テーブル名 | 認証情報 |
| 備考 | GitHub OAuth 用の認証情報を保持。`SecretRef` には平文を保存しない（§1.5）。 |

#### カラム情報

| No. | 物理名 | データ型 | Not Null | デフォルト | Key | 備考 | 論理名 |
|---|---|---|---|---|---|---|---|
| 1 | Id | uniqueidentifier | ○ | newsequentialid() | PK | - | Id |
| 2 | CustomerId | int | ○ | - | - | - | CustomerId |
| 3 | Kind | int | ○ | 1 | - | 1=OAuth（固定） | 認証方式 |
| 4 | SecretRef | nvarchar(2000) | ○ | - | - | 暗号化値 or 外部 Secret Manager の参照キー | シークレット参照 |
| 5 | CreatedOn | datetime2 | ○ | - | - | - | 作成日時 |
| 6 | ModifiedOn | datetime2 | ○ | - | - | - | 更新日時 |
| 7 | CreatedUserId | int | - | - | - | - | 作成ユーザーID |
| 8 | ModifiedUserId | int | - | - | - | - | 更新ユーザーID |

#### インデックス情報

| No. | インデックス名 | カラムリスト | 主キー | ユニーク | 備考 |
|---|---|---|---|---|---|
| 1 | PK_Credential | Id | Yes | Yes | - |
| 2 | IX_Credential_CustomerId | CustomerId | No | No | 一覧検索 |

#### 制約情報

| No. | 制約名 | 種類 | 制約定義 |
|---|---|---|---|
| - | - | - | - |

#### 外部キー情報

| No. | 外部キー名 | カラムリスト | 参照先 | 参照先カラムリスト | DeleteBehavior |
|---|---|---|---|---|---|
| - | - | - | - | - | - |

---

### 5.8 FieldMapping（フィールドマッピング）

#### テーブル情報

| 項目 | 内容 |
|---|---|
| 物理テーブル名 | FieldMapping |
| 論理テーブル名 | フィールドマッピング |
| 備考 | API/CSV を `SourceKind` で切替。Project に対し 1:1。仕様書 §2.1.3 / §2.2.3。値リスト（done_statuses 等）は `FieldMappingValue` に正規化。 |

#### カラム情報

| No. | 物理名 | データ型 | Not Null | デフォルト | Key | 備考 | 論理名 |
|---|---|---|---|---|---|---|---|
| 1 | Id | uniqueidentifier | ○ | newsequentialid() | PK | - | Id |
| 2 | CustomerId | int | ○ | - | - | - | CustomerId |
| 3 | ProjectId | uniqueidentifier | ○ | - | FK | - | プロジェクトId |
| 4 | SourceKind | int | ○ | - | - | 1=Api / 2=Csv | ソース種別 |
| 5 | TitleSource | nvarchar(200) | ○ | - | - | API: `"title"` 固定 / CSV: カラム名 | タイトルソース |
| 6 | StatusSource | nvarchar(200) | ○ | - | - | フィールド名 or カラム名 | ステータスソース |
| 7 | AssigneeSource | nvarchar(200) | ○ | - | - | API: `"assignees"` 固定 / CSV: カラム名 | 担当者ソース |
| 8 | IterationSource | nvarchar(200) | - | - | - | CSV では Milestone 等。未使用なら null | イテレーションソース |
| 9 | EstimatedHoursSource | nvarchar(200) | - | - | - | カスタム数値フィールド名 or カラム名 | 予定時間ソース |
| 10 | ActualHoursSource | nvarchar(200) | - | - | - | 同上 | 実施時間ソース |
| 11 | PointsSourceKind | int | ○ | 1 | - | 1=CustomField / 2=LabelsSp | ポイント取得方式 |
| 12 | PointsSourceName | nvarchar(200) | - | - | - | `LabelsSp` の場合は null（プレフィクス `sp:` 固定）| ポイントソース名 |
| 13 | DivisionSourceKind | int | ○ | - | - | 1=Labels / 2=CustomField / 3=CsvColumn | 区分取得方式 |
| 14 | DivisionSourceName | nvarchar(200) | - | - | - | `Labels` 時は null | 区分ソース名 |
| 15 | CreatedOn | datetime2 | ○ | - | - | - | 作成日時 |
| 16 | ModifiedOn | datetime2 | ○ | - | - | - | 更新日時 |
| 17 | CreatedUserId | int | - | - | - | - | 作成ユーザーID |
| 18 | ModifiedUserId | int | - | - | - | - | 更新ユーザーID |

#### インデックス情報

| No. | インデックス名 | カラムリスト | 主キー | ユニーク | 備考 |
|---|---|---|---|---|---|
| 1 | PK_FieldMapping | Id | Yes | Yes | - |

#### 制約情報

| No. | 制約名 | 種類 | 制約定義 |
|---|---|---|---|
| 1 | UQ_FieldMapping_ProjectId | UNIQUE | Project に対して 1 行のみ |

#### 外部キー情報

| No. | 外部キー名 | カラムリスト | 参照先 | 参照先カラムリスト | DeleteBehavior |
|---|---|---|---|---|---|
| 1 | FK_FieldMapping_ProjectId | ProjectId | Project | Id | Cascade |

---

### 5.9 FieldMappingValue（マッピング値リスト）

#### テーブル情報

| 項目 | 内容 |
|---|---|
| 物理テーブル名 | FieldMappingValue |
| 論理テーブル名 | マッピング値リスト |
| 備考 | done/in_review ステータス値および FE/BE/Test 区分値の正規化テーブル。`ValueKind` で種別を区別。仕様書 §2.1.3 / §2.2.3。 |

#### カラム情報

| No. | 物理名 | データ型 | Not Null | デフォルト | Key | 備考 | 論理名 |
|---|---|---|---|---|---|---|---|
| 1 | Id | uniqueidentifier | ○ | newsequentialid() | PK | - | Id |
| 2 | CustomerId | int | ○ | - | - | - | CustomerId |
| 3 | FieldMappingId | uniqueidentifier | ○ | - | FK | - | マッピングId |
| 4 | ValueKind | int | ○ | - | - | 1=DoneStatus / 2=InReviewStatus / 3=FeValue / 4=BeValue / 5=TestValue | 値種別 |
| 5 | Value | nvarchar(200) | ○ | - | - | 例: `Done`, `In Review`, `frontend` | 値 |
| 6 | OrderId | int | ○ | 0 | - | 並び順 | 並び順 |
| 7 | CreatedOn | datetime2 | ○ | - | - | - | 作成日時 |
| 8 | ModifiedOn | datetime2 | ○ | - | - | - | 更新日時 |
| 9 | CreatedUserId | int | - | - | - | - | 作成ユーザーID |
| 10 | ModifiedUserId | int | - | - | - | - | 更新ユーザーID |

#### インデックス情報

| No. | インデックス名 | カラムリスト | 主キー | ユニーク | 備考 |
|---|---|---|---|---|---|
| 1 | PK_FieldMappingValue | Id | Yes | Yes | - |
| 2 | IX_FieldMappingValue_FieldMappingId_ValueKind | FieldMappingId, ValueKind | No | No | 種別ごとの値取得 |

#### 制約情報

| No. | 制約名 | 種類 | 制約定義 |
|---|---|---|---|
| 1 | UQ_FieldMappingValue_FieldMappingId_ValueKind_Value | UNIQUE | 同一マッピング・同一種別で値を一意 |

#### 外部キー情報

| No. | 外部キー名 | カラムリスト | 参照先 | 参照先カラムリスト | DeleteBehavior |
|---|---|---|---|---|---|
| 1 | FK_FieldMappingValue_FieldMappingId | FieldMappingId | FieldMapping | Id | Cascade |

---

### 5.10 Member（メンバー）

#### テーブル情報

| 項目 | 内容 |
|---|---|
| 物理テーブル名 | Member |
| 論理テーブル名 | メンバー |
| 備考 | テナント共通のメンバーマスタ。所属プロジェクトは `MemberProjectAssignment` で管理する。退場メンバーは `IsRetired=1` で残す。 |

#### カラム情報

| No. | 物理名 | データ型 | Not Null | デフォルト | Key | 備考 | 論理名 |
|---|---|---|---|---|---|---|---|
| 1 | Id | uniqueidentifier | ○ | newsequentialid() | PK | - | Id |
| 2 | CustomerId | int | ○ | - | - | - | CustomerId |
| 3 | Name | nvarchar(200) | ○ | - | - | データソース上の担当者名と一致させる（仕様書 §3.2②）| メンバー名 |
| 4 | Division | int | ○ | - | - | 1=Fe / 2=Be / 3=Test | 区分 |
| 5 | PlannedVelocity | decimal(10,2) | ○ | 0 | - | 稼働日数と掛けて目標ポイント算出 | 計画ベロシティ |
| 6 | IsRetired | bit | ○ | 0 | - | 離任メンバーの論理削除 | 離任フラグ |
| 7 | OrderId | int | ○ | 0 | - | 並び順 | 並び順 |
| 8 | CreatedOn | datetime2 | ○ | - | - | - | 作成日時 |
| 9 | ModifiedOn | datetime2 | ○ | - | - | - | 更新日時 |
| 10 | CreatedUserId | int | - | - | - | - | 作成ユーザーID |
| 11 | ModifiedUserId | int | - | - | - | - | 更新ユーザーID |

#### インデックス情報

| No. | インデックス名 | カラムリスト | 主キー | ユニーク | 備考 |
|---|---|---|---|---|---|
| 1 | PK_Member | Id | Yes | Yes | - |
| 2 | IX_Member_CustomerId_Name | CustomerId, Name | No | No | 名前検索 |

#### 制約情報

| No. | 制約名 | 種類 | 制約定義 |
|---|---|---|---|
| 1 | UQ_Member_CustomerId_Name | UNIQUE | テナント内でメンバー名を一意 |

#### 外部キー情報

| No. | 外部キー名 | カラムリスト | 参照先 | 参照先カラムリスト | DeleteBehavior |
|---|---|---|---|---|---|
| - | - | - | - | - | - |

---

### 5.10.1 MemberProjectAssignment（メンバー所属履歴）

#### テーブル情報

| 項目 | 内容 |
|---|---|
| 物理テーブル名 | MemberProjectAssignment |
| 論理テーブル名 | メンバー所属履歴 |
| 備考 | `Member` と `Project` の多対多を表現。過去配属を保持するため、所属期間（開始/終了）を持つ。 |

#### カラム情報

| No. | 物理名 | データ型 | Not Null | デフォルト | Key | 備考 | 論理名 |
|---|---|---|---|---|---|---|---|
| 1 | Id | uniqueidentifier | ○ | newsequentialid() | PK | - | Id |
| 2 | CustomerId | int | ○ | - | - | - | CustomerId |
| 3 | MemberId | uniqueidentifier | ○ | - | FK | - | メンバーId |
| 4 | ProjectId | uniqueidentifier | ○ | - | FK | - | プロジェクトId |
| 5 | AssignedFrom | date | ○ | - | - | 配属開始日 | 配属開始日 |
| 6 | AssignedTo | date | - | - | - | 配属終了日。null は現在所属中 | 配属終了日 |
| 7 | IsPrimary | bit | ○ | 0 | - | 主担当フラグ（同時所属時の表示優先用） | 主担当フラグ |
| 8 | CreatedOn | datetime2 | ○ | - | - | - | 作成日時 |
| 9 | ModifiedOn | datetime2 | ○ | - | - | - | 更新日時 |
| 10 | CreatedUserId | int | - | - | - | - | 作成ユーザーID |
| 11 | ModifiedUserId | int | - | - | - | - | 更新ユーザーID |

#### インデックス情報

| No. | インデックス名 | カラムリスト | 主キー | ユニーク | 備考 |
|---|---|---|---|---|---|
| 1 | PK_MemberProjectAssignment | Id | Yes | Yes | - |
| 2 | IX_MemberProjectAssignment_MemberId | MemberId | No | No | メンバー配属履歴 |
| 3 | IX_MemberProjectAssignment_ProjectId | ProjectId | No | No | プロジェクト所属一覧 |
| 4 | IX_MemberProjectAssignment_ProjectId_AssignedFrom | ProjectId, AssignedFrom | No | No | 時点検索 |

#### 制約情報

| No. | 制約名 | 種類 | 制約定義 |
|---|---|---|---|
| 1 | UQ_MemberProjectAssignment_MemberId_ProjectId_AssignedFrom | UNIQUE | 同一開始日の重複配属を禁止 |

不変条件（アプリ層で保証）：`AssignedTo` が null でない場合 `AssignedFrom <= AssignedTo`。

#### 外部キー情報

| No. | 外部キー名 | カラムリスト | 参照先 | 参照先カラムリスト | DeleteBehavior |
|---|---|---|---|---|---|
| 1 | FK_MemberProjectAssignment_MemberId | MemberId | Member | Id | Cascade |
| 2 | FK_MemberProjectAssignment_ProjectId | ProjectId | Project | Id | Cascade |

---

### 5.11 ProjectIterationState（プロジェクトイテレーション状態）

#### テーブル情報

| 項目 | 内容 |
|---|---|
| 物理テーブル名 | ProjectIterationState |
| 論理テーブル名 | プロジェクトイテレーション状態 |
| 備考 | Project × IterationCalendarEntry の存在レコード。期間情報は `IterationCalendarEntry` 側から取得。集計値は `IterationTotals` に切り出し。**遅延生成**：メンバー設定 or 同期発生時点で作成（論点 §7 J）。 |

#### カラム情報

| No. | 物理名 | データ型 | Not Null | デフォルト | Key | 備考 | 論理名 |
|---|---|---|---|---|---|---|---|
| 1 | Id | uniqueidentifier | ○ | newsequentialid() | PK | - | Id |
| 2 | CustomerId | int | ○ | - | - | - | CustomerId |
| 3 | ProjectId | uniqueidentifier | ○ | - | FK | - | プロジェクトId |
| 4 | IterationCalendarEntryId | uniqueidentifier | ○ | - | FK | - | カレンダーエントリId |
| 5 | CreatedOn | datetime2 | ○ | - | - | - | 作成日時 |
| 6 | ModifiedOn | datetime2 | ○ | - | - | - | 更新日時 |
| 7 | CreatedUserId | int | - | - | - | - | 作成ユーザーID |
| 8 | ModifiedUserId | int | - | - | - | - | 更新ユーザーID |

#### インデックス情報

| No. | インデックス名 | カラムリスト | 主キー | ユニーク | 備考 |
|---|---|---|---|---|---|
| 1 | PK_ProjectIterationState | Id | Yes | Yes | - |
| 2 | IX_ProjectIterationState_ProjectId | ProjectId | No | No | プロジェクト内一覧 |
| 3 | IX_ProjectIterationState_IterationCalendarEntryId | IterationCalendarEntryId | No | No | エントリ横断検索 |

#### 制約情報

| No. | 制約名 | 種類 | 制約定義 |
|---|---|---|---|
| 1 | UQ_ProjectIterationState_ProjectId_IterationCalendarEntryId | UNIQUE | プロジェクト × エントリで一意 |

#### 外部キー情報

| No. | 外部キー名 | カラムリスト | 参照先 | 参照先カラムリスト | DeleteBehavior |
|---|---|---|---|---|---|
| 1 | FK_ProjectIterationState_ProjectId | ProjectId | Project | Id | Cascade |
| 2 | FK_ProjectIterationState_IterationCalendarEntryId | IterationCalendarEntryId | IterationCalendarEntry | Id | Restrict |

---

### 5.12 IterationTotals（イテレーション総工数）

#### テーブル情報

| 項目 | 内容 |
|---|---|
| 物理テーブル名 | IterationTotals |
| 論理テーブル名 | イテレーション総工数 |
| 備考 | ProjectIterationState に対し 1:1 の集計値。同期時に再計算。 |

#### カラム情報

| No. | 物理名 | データ型 | Not Null | デフォルト | Key | 備考 | 論理名 |
|---|---|---|---|---|---|---|---|
| 1 | ProjectIterationStateId | uniqueidentifier | ○ | - | PK,FK | 1:1（PK 兼 FK）| イテレーション状態Id |
| 2 | CustomerId | int | ○ | - | - | - | CustomerId |
| 3 | FePointsTotal | decimal(10,2) | ○ | 0 | - | - | FE ポイント合計 |
| 4 | BePointsTotal | decimal(10,2) | ○ | 0 | - | - | BE ポイント合計 |
| 5 | TestPointsTotal | decimal(10,2) | ○ | 0 | - | - | テストポイント合計 |
| 6 | ComputedOn | datetime2 | ○ | - | - | 最終算出時刻 | 算出日時 |
| 7 | CreatedOn | datetime2 | ○ | - | - | - | 作成日時 |
| 8 | ModifiedOn | datetime2 | ○ | - | - | - | 更新日時 |
| 9 | CreatedUserId | int | - | - | - | - | 作成ユーザーID |
| 10 | ModifiedUserId | int | - | - | - | - | 更新ユーザーID |

#### インデックス情報

| No. | インデックス名 | カラムリスト | 主キー | ユニーク | 備考 |
|---|---|---|---|---|---|
| 1 | PK_IterationTotals | ProjectIterationStateId | Yes | Yes | - |

#### 制約情報

| No. | 制約名 | 種類 | 制約定義 |
|---|---|---|---|
| - | - | - | - |

#### 外部キー情報

| No. | 外部キー名 | カラムリスト | 参照先 | 参照先カラムリスト | DeleteBehavior |
|---|---|---|---|---|---|
| 1 | FK_IterationTotals_ProjectIterationStateId | ProjectIterationStateId | ProjectIterationState | Id | Cascade |

---

### 5.13 IterationMember（イテレーションメンバー稼働）

#### テーブル情報

| 項目 | 内容 |
|---|---|
| 物理テーブル名 | IterationMember |
| 論理テーブル名 | イテレーションメンバー稼働 |
| 備考 | ProjectIterationState × Member の稼働日数・目標ポイント。仕様書 §2.5.1 / §2.5.2。 |

#### カラム情報

| No. | 物理名 | データ型 | Not Null | デフォルト | Key | 備考 | 論理名 |
|---|---|---|---|---|---|---|---|
| 1 | Id | uniqueidentifier | ○ | newsequentialid() | PK | - | Id |
| 2 | CustomerId | int | ○ | - | - | - | CustomerId |
| 3 | ProjectIterationStateId | uniqueidentifier | ○ | - | FK | - | イテレーション状態Id |
| 4 | MemberId | uniqueidentifier | ○ | - | FK | - | メンバーId |
| 5 | WorkingDays | int | ○ | - | - | 初期値は `SystemConfig.DefaultWorkingDaysPerIteration` | 稼働日数 |
| 6 | IsWorkingDaysModified | bit | ○ | 0 | - | デフォルトと違う場合 1（赤字表示用）| 稼働日変更フラグ |
| 7 | WorkingDaysMemo | nvarchar(1000) | - | - | - | 例:「有給3日取得」| 変更メモ |
| 8 | TargetPoints | decimal(10,2) | ○ | 0 | - | 初期値は `WorkingDays × Member.PlannedVelocity`、手動上書き可 | 目標ポイント |
| 9 | IsTargetPointsModified | bit | ○ | 0 | - | 上書き有無 | 目標ポイント変更フラグ |
| 10 | CreatedOn | datetime2 | ○ | - | - | - | 作成日時 |
| 11 | ModifiedOn | datetime2 | ○ | - | - | - | 更新日時 |
| 12 | CreatedUserId | int | - | - | - | - | 作成ユーザーID |
| 13 | ModifiedUserId | int | - | - | - | - | 更新ユーザーID |

#### インデックス情報

| No. | インデックス名 | カラムリスト | 主キー | ユニーク | 備考 |
|---|---|---|---|---|---|
| 1 | PK_IterationMember | Id | Yes | Yes | - |
| 2 | IX_IterationMember_ProjectIterationStateId | ProjectIterationStateId | No | No | イテレーション内一覧 |
| 3 | IX_IterationMember_MemberId | MemberId | No | No | メンバー横断検索 |

#### 制約情報

| No. | 制約名 | 種類 | 制約定義 |
|---|---|---|---|
| 1 | UQ_IterationMember_ProjectIterationStateId_MemberId | UNIQUE | イテレーション × メンバーで一意 |

#### 外部キー情報

| No. | 外部キー名 | カラムリスト | 参照先 | 参照先カラムリスト | DeleteBehavior |
|---|---|---|---|---|---|
| 1 | FK_IterationMember_ProjectIterationStateId | ProjectIterationStateId | ProjectIterationState | Id | Cascade |
| 2 | FK_IterationMember_MemberId | MemberId | Member | Id | Restrict |

---

### 5.14 SyncSnapshot（同期スナップショット）

#### テーブル情報

| 項目 | 内容 |
|---|---|
| 物理テーブル名 | SyncSnapshot |
| 論理テーブル名 | 同期スナップショット |
| 備考 | API 同期 / CSV インポート 1 回ごとの記録。最新スナップショットを進捗計算に使い、過去スナップショットは履歴として参照。仕様書 §2.1.5。 |

#### カラム情報

| No. | 物理名 | データ型 | Not Null | デフォルト | Key | 備考 | 論理名 |
|---|---|---|---|---|---|---|---|
| 1 | Id | uniqueidentifier | ○ | newsequentialid() | PK | - | Id |
| 2 | CustomerId | int | ○ | - | - | - | CustomerId |
| 3 | ProjectIterationStateId | uniqueidentifier | ○ | - | FK | - | イテレーション状態Id |
| 4 | SyncedOn | datetime2 | ○ | - | - | 同期実行時刻 | 同期日時 |
| 5 | SourceKind | int | ○ | - | - | 1=Api / 2=Csv | ソース種別 |
| 6 | Status | int | ○ | 1 | - | 1=Success / 2=Partial / 3=Failed | 同期結果ステータス |
| 7 | ErrorMessage | nvarchar(2000) | - | - | - | failed/partial 時のメッセージ | エラーメッセージ |
| 8 | CreatedOn | datetime2 | ○ | - | - | - | 作成日時 |
| 9 | ModifiedOn | datetime2 | ○ | - | - | - | 更新日時 |
| 10 | CreatedUserId | int | - | - | - | - | 作成ユーザーID |
| 11 | ModifiedUserId | int | - | - | - | - | 更新ユーザーID |

#### インデックス情報

| No. | インデックス名 | カラムリスト | 主キー | ユニーク | 備考 |
|---|---|---|---|---|---|
| 1 | PK_SyncSnapshot | Id | Yes | Yes | - |
| 2 | IX_SyncSnapshot_ProjectIterationStateId_SyncedOn | ProjectIterationStateId, SyncedOn | No | No | 最新スナップショット取得 |

#### 制約情報

| No. | 制約名 | 種類 | 制約定義 |
|---|---|---|---|
| - | - | - | - |

> 1 回の API 同期は全イテレーション分のタスクを一括取得するため「同期 1 回 = 複数 SyncSnapshot」になる。これらをまとめる `SyncRunId` の追加要否は §7 論点 A（現案：UI で `SyncedOn` の同時刻でグルーピング）。

#### 外部キー情報

| No. | 外部キー名 | カラムリスト | 参照先 | 参照先カラムリスト | DeleteBehavior |
|---|---|---|---|---|---|
| 1 | FK_SyncSnapshot_ProjectIterationStateId | ProjectIterationStateId | ProjectIterationState | Id | Cascade |

---

### 5.15 Task（タスク）

#### テーブル情報

| 項目 | 内容 |
|---|---|
| 物理テーブル名 | Task |
| 論理テーブル名 | タスク |
| 備考 | スナップショット内のタスク 1 件。スナップショット間でタスクは複製される（同じ `ExternalId` でも別レコード）。`StatusCategory` は同期時に `FieldMappingValue` への照合結果を確定して保存（マッピング変更時は再判定が必要）。 |

#### カラム情報

| No. | 物理名 | データ型 | Not Null | デフォルト | Key | 備考 | 論理名 |
|---|---|---|---|---|---|---|---|
| 1 | Id | uniqueidentifier | ○ | newsequentialid() | PK | - | Id |
| 2 | CustomerId | int | ○ | - | - | - | CustomerId |
| 3 | SyncSnapshotId | uniqueidentifier | ○ | - | FK | - | スナップショットId |
| 4 | ExternalId | nvarchar(64) | - | - | - | Issue 番号 / 課題キーなど | 外部Id |
| 5 | Title | nvarchar(500) | ○ | - | - | - | タスクタイトル |
| 6 | StatusRaw | nvarchar(100) | - | - | - | データソース上の Status 生値 | ステータス（生値）|
| 7 | StatusCategory | int | ○ | 3 | - | 1=Done / 2=InReview / 3=Other | ステータス分類 |
| 8 | Points | decimal(10,2) | - | - | - | 計画ポイント | ポイント |
| 9 | EstimatedHours | decimal(10,5) | - | - | - | - | 予定時間 |
| 10 | ActualHours | decimal(10,5) | - | - | - | - | 実施時間 |
| 11 | AssigneeName | nvarchar(200) | - | - | - | `Member.Name` と完全一致でマッチ | 担当者名 |
| 12 | Division | int | ○ | 0 | - | 0=Unclassified / 1=Fe / 2=Be / 3=Test | 区分 |
| 13 | CreatedOn | datetime2 | ○ | - | - | - | 作成日時 |
| 14 | ModifiedOn | datetime2 | ○ | - | - | - | 更新日時 |
| 15 | CreatedUserId | int | - | - | - | - | 作成ユーザーID |
| 16 | ModifiedUserId | int | - | - | - | - | 更新ユーザーID |

#### インデックス情報

| No. | インデックス名 | カラムリスト | 主キー | ユニーク | 備考 |
|---|---|---|---|---|---|
| 1 | PK_Task | Id | Yes | Yes | - |
| 2 | IX_Task_SyncSnapshotId | SyncSnapshotId | No | No | スナップショット内一覧 |
| 3 | IX_Task_SyncSnapshotId_Division | SyncSnapshotId, Division | No | No | 区分別集計 |
| 4 | IX_Task_SyncSnapshotId_AssigneeName | SyncSnapshotId, AssigneeName | No | No | メンバー別集計 |
| 5 | IX_Task_SyncSnapshotId_ExternalId | SyncSnapshotId, ExternalId | No | No | 外部Id検索 |

#### 制約情報

| No. | 制約名 | 種類 | 制約定義 |
|---|---|---|---|
| - | - | - | - |

> GitHub Projects は複数 Assignees 可。仕様書 §7 / §2.5.1 のメンバー個人ベロシティ算出は単一担当者前提。**現案**：先頭 1 人のみ採用（§7 論点 C）。

#### 外部キー情報

| No. | 外部キー名 | カラムリスト | 参照先 | 参照先カラムリスト | DeleteBehavior |
|---|---|---|---|---|---|
| 1 | FK_Task_SyncSnapshotId | SyncSnapshotId | SyncSnapshot | Id | Cascade |

---

### 5.16 OperationPermission（操作権限）

#### テーブル情報

| 項目 | 内容 |
|---|---|
| 物理テーブル名 | OperationPermission |
| 論理テーブル名 | 操作権限 |
| 備考 | core と同じ流儀。テナント × ユーザー × ロールの紐付け。`UserId` は GitHub OAuth で認証済みかつ `@kentem` 所属確認済みユーザーのみを対象とする。 |

#### カラム情報

| No. | 物理名 | データ型 | Not Null | デフォルト | Key | 備考 | 論理名 |
|---|---|---|---|---|---|---|---|
| 1 | Id | uniqueidentifier | ○ | newsequentialid() | PK | - | Id |
| 2 | CustomerId | int | ○ | - | - | - | CustomerId |
| 3 | UserId | int | ○ | - | - | 認証基盤側のユーザーID | ユーザーID |
| 4 | Role | int | ○ | - | - | 1=Admin / 2=ProjectLead / 3=Member | ロール |
| 5 | CreatedOn | datetime2 | ○ | - | - | - | 作成日時 |
| 6 | ModifiedOn | datetime2 | ○ | - | - | - | 更新日時 |
| 7 | CreatedUserId | int | - | - | - | - | 作成ユーザーID |
| 8 | ModifiedUserId | int | - | - | - | - | 更新ユーザーID |

#### インデックス情報

| No. | インデックス名 | カラムリスト | 主キー | ユニーク | 備考 |
|---|---|---|---|---|---|
| 1 | PK_OperationPermission | Id | Yes | Yes | - |
| 2 | IX_OperationPermission_CustomerId_UserId | CustomerId, UserId | No | No | 認可チェック |

#### 制約情報

| No. | 制約名 | 種類 | 制約定義 |
|---|---|---|---|
| 1 | UQ_OperationPermission_CustomerId_UserId | UNIQUE | テナント内でユーザーごとに 1 行 |

#### 外部キー情報

| No. | 外部キー名 | カラムリスト | 参照先 | 参照先カラムリスト | DeleteBehavior |
|---|---|---|---|---|---|
| - | - | - | - | - | - |

---

## 6. ライフサイクル / 不変条件

- **同期トランザクション**：`SyncSnapshot` 作成 → `Task` 一括作成 → `IterationTotals` 再計算 → `ProjectTotals` 再計算 を 1 トランザクションで実行
- **イテレーション期間の取得**：プロジェクトのイテレーション期間は **常に `IterationCalendarEntry` から取得**。プロジェクト個別の期間自動算出は行わない
- **プロジェクト参加範囲**：`Project.StartIterationEntryId` 以降の `IterationCalendarEntry` がそのプロジェクトの対象。`ProjectIterationState` は遅延生成（メンバー設定 or 同期発生時点）
- **メンバー所属の扱い**：メンバーとプロジェクトの紐付けは `MemberProjectAssignment` で管理し、`AssignedTo` が null の行を現所属、値ありの行を過去所属として扱う
- **削除規則**：
  - `IterationCalendar` / `IterationCalendarEntry` は **参照中は削除不可**（FK `Restrict`）
  - `Project` 削除 → 配下すべて Cascade（`MemberProjectAssignment` を含む。カレンダー本体は残る）
  - `Member` は論理削除（`IsRetired=1`）。既存 `IterationMember` は残す
  - 過去 `SyncSnapshot` は保持（履歴用途）。容量対策の TTL は別途検討
- **計算式**（参照のみ・保存しない）：

  ```
  進捗率 = Σ(Task.Points where StatusCategory = Done
                            [+ InReview if Project.IncludeInReviewInProgress = 1])
           ÷ Σ(IterationMember.TargetPoints)
  開発効率 = Σ(Task.ActualHours) ÷ Σ(Task.EstimatedHours)
  個人実績ベロシティ = 個人の完了 Task.Points 合計 ÷ IterationMember.WorkingDays
  ```

---

## 7. 論点・解釈メモ（合意済み・2026-05-09）

仕様書からの解釈で迷った/補完した箇所。**A〜K すべて現案で合意済み**。以下は記録として残す。

### A. SyncSnapshot の保存粒度

- 仕様書 §7 ではイテレーションごとに分割保存する構造
- 1 回の API 同期は全イテレーション分のタスクを取得するため、「同期 1 回 = 複数 `SyncSnapshot`」になる
- これらを束ねる `SyncRunId`（または親エンティティ `SyncRun`）が必要か？
- **現案**：`SyncSnapshot` 単独で持ち、UI 表示は `SyncedOn` の同時刻でグルーピング（誤差は許容）

### B. Member と Task.AssigneeName の紐付け

- 仕様書 §3.2②に「データソース上の担当者名と一致させる」とあり、**名前の文字列一致** で運用
- ただし GitHub Assignees は表示名 / login が混在しうる
- **現案**：Task 側は `AssigneeName`（単純な nvarchar）として保持。集計時に `Member.Name` と完全一致でマッチ。不一致は「unassigned」扱い

### C. 複数 Assignees

- GitHub Projects は複数 Assignees 可。仕様書 §7 の `assignee` は単一前提
- **現案**：先頭 1 人のみ採用。MVP では単純化

### D. IncludeInReviewInProgress の所属

- 仕様書 §7 では FieldMapping 配下、§2.3.2 では Project 設定として記載
- **現案**：Project 直下に置く（マッピングは「何を完了/レビュー中とみなすか」、Project 設定は「レビュー中を進捗に含めるか」と責務が違うため）

### E. Member.Division に Test を含めるか

- 仕様書 §2.5.1 では区分は FE / BE のみ、§7 / §1.5 では FE / BE / テスト
- **現案**：Member の enum は Fe / Be / Test すべて許容。UI で Test を出すかは UI 側で決定

### F. Credential の保管方式

- §8 TBD。`SecretRef` を nvarchar(2000) にすることで実装方式（DB 暗号化 / Secret Manager）の決定を遅延
- MVP の暫定として「DB に対称鍵で暗号化保管」を想定するなら、`Credential` テーブルに `EncryptedToken` `Iv` を持つ実装に展開

### G. ストーリーポイントの形式

- §8 TBD（カスタム数値 / Labels `sp:N`）
- **現案**：`PointsSourceKind` enum で両対応

### H. タイムスタンプ

- core 流儀に合わせ、`CreatedOn` / `ModifiedOn` / `CreatedUserId` / `ModifiedUserId` を全エンティティに付与（v0.4.0 で適用済み）

### I. IterationCalendar の年度またぎ

- 年度をまたぐプロジェクトは「次年度カレンダー」に切り替えるのか、複数カレンダーを横断参照するのか
- **現案**：Project は **単一カレンダーを参照**。年度切替時は新カレンダーを作って Project を切替（または年度ごとに別 Project）。年度連続参照は MVP 対象外
- カレンダー間でイテレーション番号は連続しないことを許容（例：2026年度 #1〜#26、2027年度 #1〜から再開）

### J. ProjectIterationState の生成タイミング

- 全エントリに対して事前作成 vs 遅延生成（メンバー設定 or 同期発生時）
- **現案**：遅延生成。空の状態レコードを増やさないため。代わりにイテレーション一覧画面では「カレンダーエントリ + 状態の有無」で表示

### K. カレンダーエントリ編集時の影響

- 管理者が登録済みエントリの `StartDate` / `EndDate` を後から変更した場合、既存スナップショットの帰属イテレーションは変えない（同期時点での割り当てを尊重）
- 削除は FK `Restrict` で参照中は不可

---

## 8. 未収録テーマ・TBD

| # | テーマ | 状態 | 備考 |
|---|---|---|---|
| 1 | API 同期失敗時のリトライ・通知 | 部分対応 | 仕様書 §8 #5。`SyncSnapshot.Status` / `ErrorMessage` で最低限のトラッキングは確保。リトライ戦略・通知方針は別途決定 |
| 2 | データバックアップ・エクスポート | TBD | 仕様書 §8 #6 |
| 3 | メディア（添付ファイル）| 未収録 | 仕様書に記載なし。本モデルには含めない（将来追加が必要になった時点で `Attachment` テーブルを追加検討）|
| 4 | 監査ログ（操作履歴）| 未収録 | 共通カラム（`CreatedOn` / `ModifiedOn` / `*UserId`）で最低限のトレーサビリティは確保。詳細な操作履歴が必要になれば `AuditLog` テーブルを追加検討 |

---

## 9. 次のステップ

1. ~~§7 論点を確認・合意~~ ✅ 合意済み（2026-05-09）
2. ~~採用アーキテクチャ（`ks-kentem/cloud-doko-plan-core`）の構成・命名規約の確認~~ ✅ v0.4.0 で全テーブル定義に反映
3. BE プロジェクトのスケルトン作成（core の `Ks.Web.DokoPlan.Core` / `Db.Core` / `Db` / `Service` レイヤ構成に倣う）
4. Entity (C#) クラスへの落とし込み（`.github/skills/teble-to-entity` テンプレート活用）
5. EF Core の `DbContext` / マイグレーション生成
6. ID 採番方式は core と同じ `newsequentialid()`（uniqueidentifier）で確定

---

## 10. 変更履歴

| バージョン | 日付 | 変更内容 |
|---|---|---|
| 0.1.0 | 2026-05-09 | 仕様書 §7 をベースに初版データモデル作成 |
| 0.2.0 | 2026-05-09 | 派生値の保存方針・enum・不変条件を追加 |
| 0.3.0 | 2026-05-09 | 論点 A〜K を整理し、Project に `IncludeInReviewInProgress` 移動、`Credential` 切り出し、`SyncSnapshot.Status`/`ErrorMessage` 追加など合意済み修正を反映 |
| 0.4.0 | 2026-05-09 | **`cloud-doko-plan-core` のテーブル定義書流儀に全面準拠**。物理名を PascalCase、型を SQL Server 系に変更。全テーブルに `CustomerId int NOT NULL` と共通監査カラムを付与。`is_active` 系を `IsRetired` に統一。値リストを `FieldMappingValue` 子テーブルに正規化。`OperationPermission` を追加。各テーブル定義をテーブル情報/カラム情報/インデックス/制約/外部キーの 5 セクション形式に再構成 |
| 0.5.0 | 2026-05-13 | 認証仕様を project_progress_spec v1.8.0 に追従。GitHub OAuth ログイン必須・`@kentem` 所属制限を反映。`Credential.Kind` を OAuth 固定に更新し、認証関連TBDを解消 |
| 0.6.0 | 2026-05-13 | `Member` をプロジェクト非依存マスタへ変更し、`MemberProjectAssignment` を追加。複数プロジェクト所属と過去配属履歴の保持に対応。ER 図・テーブル一覧・ライフサイクル規則を更新 |
