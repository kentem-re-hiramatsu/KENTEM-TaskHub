import { HttpResponse, http } from 'msw';

const dummyIssues = [
  {
    id: 'I_kwDO001',
    number: 1,
    title: 'ログイン画面のUI実装',
    url: 'https://github.com/kentem/taskHub/issues/1',
    state: 'OPEN',
    fieldValues: { '予定時間': '8', '実施時間': '5', 'ポイント': '3', 'Status': 'In Progress', 'Assignees': 'taro', 'Sprint': 'Sprint 1' },
  },
  {
    id: 'I_kwDO002',
    number: 2,
    title: 'プロジェクト一覧APIの実装',
    url: 'https://github.com/kentem/taskHub/issues/2',
    state: 'OPEN',
    fieldValues: { '予定時間': '16', '実施時間': '16', 'ポイント': '5', 'Status': 'Done', 'Assignees': 'hanako', 'Sprint': 'Sprint 1' },
  },
  {
    id: 'I_kwDO003',
    number: 3,
    title: 'メンバー設定フォームのバリデーション追加',
    url: 'https://github.com/kentem/taskHub/issues/3',
    state: 'OPEN',
    fieldValues: { '予定時間': '4', '実施時間': '', 'ポイント': '1', 'Status': 'Todo', 'Assignees': 'taro', 'Sprint': 'Sprint 2' },
  },
  {
    id: 'I_kwDO004',
    number: 4,
    title: 'ダッシュボード進捗グラフの表示',
    url: 'https://github.com/kentem/taskHub/issues/4',
    state: 'OPEN',
    fieldValues: { '予定時間': '12', '実施時間': '8', 'ポイント': '5', 'Status': 'In Review', 'Assignees': 'jiro', 'Sprint': 'Sprint 1' },
  },
  {
    id: 'I_kwDO005',
    number: 5,
    title: 'E2E テストの追加',
    url: 'https://github.com/kentem/taskHub/issues/5',
    state: 'OPEN',
    fieldValues: { '予定時間': '8', '実施時間': '', 'ポイント': '2', 'Status': 'Backlog', 'Assignees': '', 'Sprint': 'Sprint 2' },
  },
  {
    id: 'I_kwDO006',
    number: 6,
    title: 'CSV インポート機能の実装',
    url: 'https://github.com/kentem/taskHub/issues/6',
    state: 'OPEN',
    fieldValues: { '予定時間': '20', '実施時間': '20', 'ポイント': '8', 'Status': 'Done', 'Assignees': 'hanako', 'Sprint': 'Sprint 1' },
  },
  {
    id: 'I_kwDO007',
    number: 7,
    title: 'Biome 設定の整備',
    url: 'https://github.com/kentem/taskHub/issues/7',
    state: 'CLOSED',
    fieldValues: { '予定時間': '2', '実施時間': '2', 'ポイント': '1', 'Status': 'Done', 'Assignees': 'jiro', 'Sprint': 'Sprint 1' },
  },
];

export const githubProjectsHandlers = [
  http.post('*/api/github-projects/issues-preview', () => {
    return HttpResponse.json({
      project: {
        id: 'PVT_kwDOBDemo01',
        title: 'KENTEM TaskHub (Demo)',
        url: 'https://github.com/orgs/kentem/projects/1',
      },
      fields: ['Title', 'Assignees', 'Status', '予定時間', '実施時間', 'ポイント', 'Sprint'],
      issues: dummyIssues,
    });
  }),
];
