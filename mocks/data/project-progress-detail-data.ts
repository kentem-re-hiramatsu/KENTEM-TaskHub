export interface ProgressByDivision {
  division: '全体' | 'FE' | 'BE' | 'テスト';
  plannedProgress: number;
  actualProgress: number;
}

export interface MemberProgressRow {
  id: string;
  name: string;
  division: 'FE' | 'BE' | 'テスト';
  workingDays: number;
  targetVelocity: number;
  actualVelocity: number;
  developmentEfficiency: number;
  targetPoints: number;
  workingDaysMemo?: string;
}

export type TaskStatus = '未対応' | '実装中' | 'PR中' | '完了' | '破棄';

export interface TaskRow {
  id: string;
  title: string;
  status: TaskStatus;
  assignee: string;
  division: 'FE' | 'BE' | 'テスト' | 'unclassified';
  points: number;
  estimatedHours: number;
  actualHours: number;
}

export interface TrendPoint {
  iteration: string;
  startDate: string;
  endDate: string;
  actualRate: number | null;
  idealRate: number;
  predictedRate: number;
  workingDays: number;
  targetVelocity: number;
  developmentEfficiency: number | null;
}

import type { DivisionMappings, MappingRow, StatusMappings } from '@/features/project-registration/types/project-registration';

export interface ProjectProgressDetail {
  id: string;
  projectName: string;
  version: string;
  lastSyncedAt: string;
  currentIteration: string;
  projectUrl?: string;
  projectNumber?: string;
  startDate?: string;
  endDate?: string;
  fieldMappings?: MappingRow[];
  statusMappings?: StatusMappings;
  divisionMappings?: DivisionMappings;
  progressByDivision: ProgressByDivision[];
  progressByDivisionByIteration?: {
    iteration: string;
    progressByDivision: ProgressByDivision[];
  }[];
  membersByIteration: {
    iteration: string;
    members: MemberProgressRow[];
  }[];
  members: MemberProgressRow[];
  tasks: TaskRow[];
  trend: TrendPoint[];
}

const p1Members: MemberProgressRow[] = [
  {
    id: 'm1',
    name: '田中',
    division: 'FE',
    workingDays: 10,
    targetVelocity: 1.8,
    actualVelocity: 1.7,
    developmentEfficiency: 1.08,
    targetPoints: 18,
  },
  {
    id: 'm2',
    name: '鈴木',
    division: 'BE',
    workingDays: 7,
    targetVelocity: 1.7,
    actualVelocity: 1.6,
    developmentEfficiency: 0.98,
    targetPoints: 17,
    workingDaysMemo: '有給3日取得',
  },
  {
    id: 'm3',
    name: '佐藤',
    division: 'テスト',
    workingDays: 9,
    targetVelocity: 1.4,
    actualVelocity: 1.3,
    developmentEfficiency: 1.02,
    targetPoints: 12,
  },
];

export const mockProjectProgressDetails: Record<string, ProjectProgressDetail> =
  {
    p1: {
      id: 'p1',
      projectName: 'KENTEM TaskHub Core',
      version: '1.8.0',
      lastSyncedAt: '2026-05-13 15:10',
      currentIteration: 'I-6',
      projectUrl: 'https://github.com/orgs/kentem/projects/1',
      projectNumber: '1',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      fieldMappings: [
        { appField: '予定時間', sourceField: 'EstimatedHours' },
        { appField: '実施時間', sourceField: 'ActualHours' },
        { appField: 'ポイント', sourceField: 'Points' },
        { appField: 'ステータス', sourceField: 'Status' },
        { appField: '担当者', sourceField: 'Assignee' },
        { appField: 'イテレーション', sourceField: 'Iteration' },
      ],
      statusMappings: {
        todo: ['Todo', 'Backlog'],
        in_progress: ['In Progress'],
        in_review: ['In Review'],
        done: ['Done'],
        closed: ['Closed'],
      },
      divisionMappings: {
        frontend: ['FE', 'Frontend'],
        backend: ['BE', 'Backend'],
        test: ['Test', 'QA'],
      },
      progressByDivision: [
        { division: '全体', plannedProgress: 68.0, actualProgress: 64.5 },
        { division: 'FE', plannedProgress: 70.0, actualProgress: 66.0 },
        { division: 'BE', plannedProgress: 67.0, actualProgress: 63.2 },
        { division: 'テスト', plannedProgress: 62.0, actualProgress: 58.4 },
      ],
      progressByDivisionByIteration: [
        {
          iteration: 'I-4',
          progressByDivision: [
            { division: '全体', plannedProgress: 52.0, actualProgress: 43.0 },
            { division: 'FE', plannedProgress: 53.0, actualProgress: 45.0 },
            { division: 'BE', plannedProgress: 51.0, actualProgress: 42.0 },
            { division: 'テスト', plannedProgress: 49.0, actualProgress: 40.0 },
          ],
        },
        {
          iteration: 'I-5',
          progressByDivision: [
            { division: '全体', plannedProgress: 61.0, actualProgress: 52.0 },
            { division: 'FE', plannedProgress: 63.0, actualProgress: 54.0 },
            { division: 'BE', plannedProgress: 60.0, actualProgress: 51.0 },
            { division: 'テスト', plannedProgress: 57.0, actualProgress: 48.0 },
          ],
        },
        {
          iteration: 'I-6',
          progressByDivision: [
            { division: '全体', plannedProgress: 68.0, actualProgress: 64.5 },
            { division: 'FE', plannedProgress: 70.0, actualProgress: 66.0 },
            { division: 'BE', plannedProgress: 67.0, actualProgress: 63.2 },
            { division: 'テスト', plannedProgress: 62.0, actualProgress: 58.4 },
          ],
        },
      ],
      membersByIteration: [
        { iteration: 'I-4', members: p1Members },
        { iteration: 'I-5', members: p1Members },
        { iteration: 'I-6', members: p1Members },
      ],
      members: p1Members,
      tasks: [
        {
          id: 'T-101',
          title: 'ログイン認可フロー改善',
          status: '完了',
          assignee: '田中',
          division: 'FE',
          points: 5,
          estimatedHours: 14,
          actualHours: 16,
        },
        {
          id: 'T-102',
          title: 'カード進捗API実装',
          status: 'PR中',
          assignee: '鈴木',
          division: 'BE',
          points: 8,
          estimatedHours: 21,
          actualHours: 19,
        },
        {
          id: 'T-103',
          title: 'イテレーション選択UI実装',
          status: '実装中',
          assignee: '田中',
          division: 'FE',
          points: 3,
          estimatedHours: 8,
          actualHours: 5,
        },
        {
          id: 'T-104',
          title: 'メンバー進捗集計バッチ',
          status: '未対応',
          assignee: '佐藤',
          division: 'BE',
          points: 5,
          estimatedHours: 12,
          actualHours: 0,
        },
        {
          id: 'T-105',
          title: '旧レポート出力機能',
          status: '破棄',
          assignee: '鈴木',
          division: 'BE',
          points: 2,
          estimatedHours: 6,
          actualHours: 0,
        },
      ],
      trend: [
        {
          iteration: 'I-1',
          startDate: '2026-01-06',
          endDate: '2026-01-17',
          actualRate: 8,
          idealRate: 10,
          predictedRate: 8,
          workingDays: 40,
          targetVelocity: 1.7,
          developmentEfficiency: 0.95,
        },
        {
          iteration: 'I-2',
          startDate: '2026-01-20',
          endDate: '2026-01-31',
          actualRate: 19,
          idealRate: 20,
          predictedRate: 19,
          workingDays: 39,
          targetVelocity: 1.7,
          developmentEfficiency: 1.02,
        },
        {
          iteration: 'I-3',
          startDate: '2026-02-03',
          endDate: '2026-02-14',
          actualRate: 31,
          idealRate: 30,
          predictedRate: 31,
          workingDays: 38,
          targetVelocity: 1.7,
          developmentEfficiency: 1.08,
        },
        {
          iteration: 'I-4',
          startDate: '2026-02-17',
          endDate: '2026-02-28',
          actualRate: 43,
          idealRate: 40,
          predictedRate: 45,
          workingDays: 38,
          targetVelocity: 1.7,
          developmentEfficiency: 1.12,
        },
        {
          iteration: 'I-5',
          startDate: '2026-03-03',
          endDate: '2026-03-14',
          actualRate: 52,
          idealRate: 50,
          predictedRate: 56,
          workingDays: 39,
          targetVelocity: 1.7,
          developmentEfficiency: 1.05,
        },
        {
          iteration: 'I-6',
          startDate: '2026-03-17',
          endDate: '2026-03-28',
          actualRate: 64.5,
          idealRate: 60,
          predictedRate: 68,
          workingDays: 37,
          targetVelocity: 1.8,
          developmentEfficiency: 0.98,
        },
        {
          iteration: 'I-7',
          startDate: '2026-04-01',
          endDate: '2026-04-14',
          actualRate: null,
          idealRate: 70,
          predictedRate: 75.3,
          workingDays: 38,
          targetVelocity: 1.8,
          developmentEfficiency: null,
        },
        {
          iteration: 'I-8',
          startDate: '2026-04-15',
          endDate: '2026-04-28',
          actualRate: null,
          idealRate: 80,
          predictedRate: 86.0,
          workingDays: 38,
          targetVelocity: 1.8,
          developmentEfficiency: null,
        },
        {
          iteration: 'I-9',
          startDate: '2026-05-01',
          endDate: '2026-05-14',
          actualRate: null,
          idealRate: 90,
          predictedRate: 96.8,
          workingDays: 39,
          targetVelocity: 1.8,
          developmentEfficiency: null,
        },
        {
          iteration: 'I-10',
          startDate: '2026-05-15',
          endDate: '2026-05-30',
          actualRate: null,
          idealRate: 100,
          predictedRate: 100.0,
          workingDays: 40,
          targetVelocity: 1.8,
          developmentEfficiency: null,
        },
      ],
    },
    p2: {
      id: 'p2',
      projectName: '施工管理モバイル連携',
      version: '0.9.3',
      lastSyncedAt: '2026-05-13 15:12',
      currentIteration: 'I-4',
      progressByDivision: [
        { division: '全体', plannedProgress: 44.0, actualProgress: 51.2 },
        { division: 'FE', plannedProgress: 40.0, actualProgress: 49.4 },
        { division: 'BE', plannedProgress: 46.0, actualProgress: 53.0 },
        { division: 'テスト', plannedProgress: 42.0, actualProgress: 50.0 },
      ],
      membersByIteration: [],
      members: [],
      tasks: [],
      trend: [],
    },
    p3: {
      id: 'p3',
      projectName: '勤怠連携ダッシュボード',
      version: '2.0.1',
      lastSyncedAt: '2026-05-13 15:14',
      currentIteration: 'I-5',
      progressByDivision: [
        { division: '全体', plannedProgress: 82.0, actualProgress: 77.4 },
        { division: 'FE', plannedProgress: 80.0, actualProgress: 75.0 },
        { division: 'BE', plannedProgress: 84.0, actualProgress: 78.8 },
        { division: 'テスト', plannedProgress: 81.0, actualProgress: 76.3 },
      ],
      membersByIteration: [],
      members: [],
      tasks: [],
      trend: [],
    },
    p4: {
      id: 'p4',
      projectName: '工程可視化API',
      version: '0.6.4',
      lastSyncedAt: '2026-05-13 15:16',
      currentIteration: 'I-3',
      progressByDivision: [
        { division: '全体', plannedProgress: 35.0, actualProgress: 28.3 },
        { division: 'FE', plannedProgress: 34.0, actualProgress: 26.0 },
        { division: 'BE', plannedProgress: 36.0, actualProgress: 29.1 },
        { division: 'テスト', plannedProgress: 33.0, actualProgress: 27.4 },
      ],
      membersByIteration: [],
      members: [],
      tasks: [],
      trend: [],
    },
  };
