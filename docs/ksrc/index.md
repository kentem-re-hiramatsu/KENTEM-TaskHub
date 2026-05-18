# ks-react-components コンポーネント一覧

> 生成日: 2026-03-19
> リポジトリ: https://github.com/ks-kentem/ks-react-components.git

---

## 概要

DOKO-PLAN プロジェクト共通の React コンポーネントライブラリ。
`doko-plan-view` リポジトリに **git submodule** として組み込まれている。

本ドキュメントは自動生成された Props・Variant ドキュメント集。詳細な実装や高度な使用例は、公式リポジトリのソースコードを参照してください。

---

## 基本情報

- **所属**: ks-kentem / ks-react-components
- **用途**: DOKO-PLAN 業務システムの UI コンポーネント集
- **スタイルシステム**: Panda CSS (styled-system)
- **コンポーネント数**: 54個（通常47 + Semantic業務特化7）+ 実験的3個 = 54個

---

## コンポーネント一覧

### 通常コンポーネント（基本47個）

| コンポーネント                                      | 説明                                                         |
| --------------------------------------------------- | ------------------------------------------------------------ |
| [AccordionPanel](./AccordionPanel.md)               | 開閉パネル。複数フレーム、non-controlled/controlled対応      |
| [AlertMessage](./AlertMessage.md)                   | アラート表示。primary/warning/error variant                  |
| [BottomActionBar](./BottomActionBar.md)             | ページ下部アクションバー。中央/左右配置                      |
| [Breadcrumb](./Breadcrumb.md)                       | パンくずナビゲーション。最終要素は常にテキスト               |
| [BulkOperationParts](./BulkOperationParts.md)       | 一括操作ツールバー。左右グループ配置                         |
| [Button](./Button.md)                               | 汎用ボタン。9 variant、4 size、アイコン対応                  |
| [Checkbox](./Checkbox.md)                           | チェックボックス。不確定状態対応。ラベル付き・なし           |
| [CheckGroup](./CheckGroup.md)                       | チェックボックスグループ。タイトル、必須マーク対応           |
| [Chip](./Chip.md)                                   | 選択トグルチップ。2 size、icon 対応                          |
| [Combobox](./Combobox.md)                           | 検索可能ドロップダウン。複数サイズ、エラー表示               |
| [DateInput](./DateInput.md)                         | 日付入力。YYYY/MM/DD フォーマット。picker/dialog 対応        |
| [DatePicker](./DatePicker.md)                       | カレンダーピッカー。3 size、年月セレクター統合               |
| [Dialog](./Dialog.md)                               | モーダルダイアログ。ドラッグ移動、keyboard/click外で閉じる   |
| [Dropdown](./Dropdown.md)                           | ドロップダウンメニュー。button/icon トリガー                 |
| [Dropzone](./Dropzone.md)                           | ファイルドラッグ&ドロップ。拡張子・サイズ検証                |
| [ErrorMessage](./ErrorMessage.md)                   | エラーメッセージ。alert 色、tooltip 矢印オプション           |
| [FormFieldContainer](./FormFieldContainer.md)       | フォームフィールドラッパー。ラベル位置選択、サポートテキスト |
| [HeaderContainer](./HeaderContainer.md)             | ページヘッダー。プライマリ背景、レスポンシブギャップ         |
| [Heading](./Heading.md)                             | 見出し。3 size、3 weight、h1-h3/span 対応                    |
| [HoverCard](./HoverCard.md)                         | ホバーカード/tooltip。固定位置、mouseイベント対応            |
| [Icon](./Icon.md)                                   | SVG アイコン。mask（50+）& bg（color）、複数 variant         |
| [IconButton](./IconButton.md)                       | アイコンボタン。5 variant、2 shape、複数 size                |
| [JapaneseEraDateInput](./JapaneseEraDateInput.md)   | 和暦日付入力。西暦・和暦パース対応                           |
| [JapaneseEraDatePicker](./JapaneseEraDatePicker.md) | 和暦カレンダーピッカー                                       |
| [Label](./Label.md)                                 | フォームラベル。2 size、bold、色・カーソル制御               |
| [LinkText](./LinkText.md)                           | リンクテキスト。4 size、カスタムレンダリング対応             |
| [Loader](./Loader.md)                               | ローディングスピナー。3 size、overlay モード                 |
| [MenuList](./MenuList.md)                           | メニューリストコンポーネント                                 |
| [NavigationBar](./NavigationBar.md)                 | ナビゲーションバー                                           |
| [Pagination](./Pagination.md)                       | ページネーション                                             |
| [Radio](./Radio.md)                                 | ラジオボタン                                                 |
| [RadioGroup](./RadioGroup.md)                       | ラジオグループ                                               |
| [SegmentedButton](./SegmentedButton.md)             | セグメント分割ボタン                                         |
| [Selector](./Selector.md)                           | セレクター                                                   |
| [Slider](./Slider.md)                               | スライダー                                                   |
| [SnackBar](./SnackBar.md)                           | スナックバー                                                 |
| [StepIndicator](./StepIndicator.md)                 | ステップインジケーター                                       |
| [Switch](./Switch.md)                               | トグルスイッチ                                               |
| [Tab](./Tab.md)                                     | タブナビゲーション                                           |
| [Table](./Table.md)                                 | テーブル                                                     |
| [TableGrid](./TableGrid.md)                         | テーブルグリッド                                             |
| [Tag](./Tag.md)                                     | タグバッジ                                                   |
| [TextArea](./TextArea.md)                           | テキストエリア                                               |
| [TextInput](./TextInput.md)                         | テキスト入力                                                 |
| [TimeInput](./TimeInput.md)                         | 時間入力                                                     |
| [Tooltip](./Tooltip.md)                             | ツールチップ                                                 |
| [Typography](./Typography.md)                       | テキスト/段落表示                                            |

### 業務特化コンポーネント (SemanticComponents)

| コンポーネント                                                               | 説明                 |
| ---------------------------------------------------------------------------- | -------------------- |
| [ConstructionSelectDialog](./SemanticComponents/ConstructionSelectDialog.md) | 工事選択ダイアログ   |
| [Error/CookieDisable](./SemanticComponents/Error/CookieDisable.md)           | クッキー無効エラー   |
| [Error/DoubleLogin](./SemanticComponents/Error/DoubleLogin.md)               | 二重ログインエラー   |
| [Error/Forbidden](./SemanticComponents/Error/Forbidden.md)                   | アクセス禁止エラー   |
| [Error/Maintenance](./SemanticComponents/Error/Maintenance.md)               | メンテナンス中エラー |
| [Error/NotFound](./SemanticComponents/Error/NotFound.md)                     | 404 エラー           |
| [Error/Unknown](./SemanticComponents/Error/Unknown.md)                       | 不明なエラー         |

### 実験的コンポーネント (\_experimentals)

| コンポーネント                                           | 説明                         |
| -------------------------------------------------------- | ---------------------------- |
| [BottomNavigation](./_experimentals/BottomNavigation.md) | 底部ナビゲーション（実験的） |
| [NumericInput](./_experimentals/NumericInput.md)         | 数値入力（実験的）           |
| [ProgressBar](./_experimentals/ProgressBar.md)           | プログレスバー（実験的）     |

---

## 使用方法

### インストール

```bash
# submodule として自動で含まれるため、通常は追加インストール不要
git submodule update --init --recursive
```

### 基本的な使用

```jsx
import Button from "@ks-react-components/Button";
import AlertMessage from "@ks-react-components/AlertMessage";

export default function App() {
  return (
    <>
      <Button variant="primary" onClick={() => console.log("clicked")}>
        クリック
      </Button>
      <AlertMessage text="操作が完了しました" variant="primary" />
    </>
  );
}
```

---

## Props・Variant ドキュメント

各コンポーネントの詳細な Props、Variant（バリアント）、使用例は対応する `.md` ファイルを参照してください。

### ドキュメント構成

各ファイルには以下の情報が含まれます：

- **概要**: コンポーネントの用途・機能
- **Props**: 受け取る Props の一覧・デフォルト値
- **Variants**: style variant の仕様（color, size など）
- **使用例**: JSX コード例
- **アクセシビリティ**: aria 属性など

---

## テーマ・スタイルシステム

すべてのコンポーネントは **ksTheme** の色・間隔・タイポグラフィを使用します。

主要な色：

- `ksTheme.primary`: プライマリカラー（推奨アクション）
- `ksTheme.secondary`: セカンダリカラー
- `ksTheme.status.alert`: エラー/危険色
- `ksTheme.status.warning`: 警告色
- `ksTheme.text.onFill`: 背景色（white 相当）

詳細は design token 定義ファイルを参照してください。

---

## 更新履歴

- **2026-03-19**: ドキュメント自動生成完了（全54個コンポーネント）

---

**作成者**: Claude Code (自動生成)  
**最終更新**: 2026-03-19
