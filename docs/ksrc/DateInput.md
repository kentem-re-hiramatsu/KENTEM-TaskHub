# DateInput

日付入力フィールドコンポーネント。テキスト入力またはピッカーで日付を選択。

## 概要

YYYY/MM/DD 形式で日付を入力・選択。カレンダーピッカーをポップアップ（またはダイアログ）で表示。エラーメッセージとバリデーション対応。

## Props

| 名称 | 型 | 必須 | デフォルト | 説明 |
|------|------|------|------|------|
| `id` | `string` | | - | input 要素の id |
| `value` | `Date \| null` | ○ | - | 現在の選択日付 |
| `onChange` | `(date, isError, formatted) => void` | ○ | - | 日付変更コールバック |
| `size` | `"medium" \| "small"` | | `"medium"` | 入力フィールドのサイズ |
| `disabled` | `boolean` | | `false` | 無効化 |
| `placeholder` | `string` | | `"YYYY/MM/DD"` | プレースホルダテキスト |
| `useDialog` | `boolean` | | `false` | true時はピッカーをダイアログで表示 |
| `datePickerSize` | `"large" \| "medium" \| "small"` | | `"medium"` | ピッカーのサイズ |
| `errorMessage` | `string` | | - | 外部から指定するエラーメッセージ |
| `shouldCenterYear` | `boolean` | | `false` | 年セレクターを中央配置 |

詳細はスキル定義またはソースコードを参照してください。
