export interface MemberIterationRecord {
  iteration: string;
  startDate: string;
  endDate: string;
  workingDays: number;
  targetVelocity: number;
  actualVelocity: number;
  developmentEfficiency: number;
  targetPoints: number;
}

export interface MemberProjectHistory {
  projectId: string;
  projectName: string;
  version: string;
  division: 'FE' | 'BE' | 'テスト';
  iterations: MemberIterationRecord[];
}

export interface MemberDetailData {
  userId: string;
  memberName: string;
  displayName: string;
  login: string;
  role: 'admin' | 'standard';
  isLinked: boolean;
  projectHistory: MemberProjectHistory[];
}

export const mockMemberDetails: Record<string, MemberDetailData> = {
  'u-001': {
    userId: 'u-001',
    memberName: '山田 太郎',
    displayName: 'PL 山田',
    login: 'pl-kentem',
    role: 'admin',
    isLinked: true,
    projectHistory: [
      {
        projectId: 'p1',
        projectName: 'KENTEM TaskHub Core',
        version: '1.8.0',
        division: 'FE',
        iterations: [
          { iteration: 'I-1', startDate: '2026-01-06', endDate: '2026-01-17', workingDays: 10, targetVelocity: 1.6, actualVelocity: 1.5, developmentEfficiency: 0.94, targetPoints: 16 },
          { iteration: 'I-2', startDate: '2026-01-20', endDate: '2026-01-31', workingDays: 10, targetVelocity: 1.6, actualVelocity: 1.7, developmentEfficiency: 1.06, targetPoints: 16 },
          { iteration: 'I-3', startDate: '2026-02-03', endDate: '2026-02-14', workingDays: 9, targetVelocity: 1.6, actualVelocity: 1.8, developmentEfficiency: 1.13, targetPoints: 14 },
          { iteration: 'I-4', startDate: '2026-02-17', endDate: '2026-02-28', workingDays: 10, targetVelocity: 1.7, actualVelocity: 1.9, developmentEfficiency: 1.12, targetPoints: 17 },
          { iteration: 'I-5', startDate: '2026-03-03', endDate: '2026-03-14', workingDays: 10, targetVelocity: 1.7, actualVelocity: 1.8, developmentEfficiency: 1.06, targetPoints: 17 },
          { iteration: 'I-6', startDate: '2026-03-17', endDate: '2026-03-28', workingDays: 9, targetVelocity: 1.8, actualVelocity: 1.7, developmentEfficiency: 0.98, targetPoints: 16 },
        ],
      },
      {
        projectId: 'p2',
        projectName: '施工管理モバイル連携',
        version: '0.9.3',
        division: 'FE',
        iterations: [
          { iteration: 'I-1', startDate: '2026-02-01', endDate: '2026-02-14', workingDays: 10, targetVelocity: 1.5, actualVelocity: 1.4, developmentEfficiency: 0.93, targetPoints: 15 },
          { iteration: 'I-2', startDate: '2026-02-17', endDate: '2026-02-28', workingDays: 10, targetVelocity: 1.5, actualVelocity: 1.6, developmentEfficiency: 1.07, targetPoints: 15 },
          { iteration: 'I-3', startDate: '2026-03-03', endDate: '2026-03-14', workingDays: 8, targetVelocity: 1.5, actualVelocity: 1.7, developmentEfficiency: 1.13, targetPoints: 12 },
          { iteration: 'I-4', startDate: '2026-03-17', endDate: '2026-03-28', workingDays: 10, targetVelocity: 1.6, actualVelocity: 1.8, developmentEfficiency: 1.13, targetPoints: 16 },
        ],
      },
    ],
  },
  'u-002': {
    userId: 'u-002',
    memberName: '佐藤 花子',
    displayName: 'FE 佐藤',
    login: 'fe-kentem',
    role: 'standard',
    isLinked: false,
    projectHistory: [
      {
        projectId: 'p1',
        projectName: 'KENTEM TaskHub Core',
        version: '1.8.0',
        division: 'テスト',
        iterations: [
          { iteration: 'I-4', startDate: '2026-02-17', endDate: '2026-02-28', workingDays: 9, targetVelocity: 1.4, actualVelocity: 1.3, developmentEfficiency: 1.02, targetPoints: 12 },
          { iteration: 'I-5', startDate: '2026-03-03', endDate: '2026-03-14', workingDays: 9, targetVelocity: 1.4, actualVelocity: 1.5, developmentEfficiency: 1.07, targetPoints: 13 },
          { iteration: 'I-6', startDate: '2026-03-17', endDate: '2026-03-28', workingDays: 9, targetVelocity: 1.4, actualVelocity: 1.3, developmentEfficiency: 1.02, targetPoints: 12 },
        ],
      },
      {
        projectId: 'p3',
        projectName: '勤怠連携ダッシュボード',
        version: '2.0.1',
        division: 'FE',
        iterations: [
          { iteration: 'I-1', startDate: '2025-10-01', endDate: '2025-10-14', workingDays: 10, targetVelocity: 1.3, actualVelocity: 1.2, developmentEfficiency: 0.92, targetPoints: 13 },
          { iteration: 'I-2', startDate: '2025-10-15', endDate: '2025-10-28', workingDays: 10, targetVelocity: 1.3, actualVelocity: 1.4, developmentEfficiency: 1.08, targetPoints: 13 },
          { iteration: 'I-3', startDate: '2025-11-01', endDate: '2025-11-14', workingDays: 9, targetVelocity: 1.4, actualVelocity: 1.5, developmentEfficiency: 1.07, targetPoints: 13 },
          { iteration: 'I-4', startDate: '2025-11-17', endDate: '2025-11-28', workingDays: 10, targetVelocity: 1.4, actualVelocity: 1.3, developmentEfficiency: 0.93, targetPoints: 14 },
          { iteration: 'I-5', startDate: '2025-12-01', endDate: '2025-12-14', workingDays: 8, targetVelocity: 1.4, actualVelocity: 1.4, developmentEfficiency: 1.00, targetPoints: 11 },
        ],
      },
    ],
  },
  'u-003': {
    userId: 'u-003',
    memberName: '鈴木 一郎',
    displayName: 'BE 鈴木',
    login: 'be-kentem',
    role: 'standard',
    isLinked: true,
    projectHistory: [
      {
        projectId: 'p1',
        projectName: 'KENTEM TaskHub Core',
        version: '1.8.0',
        division: 'BE',
        iterations: [
          { iteration: 'I-1', startDate: '2026-01-06', endDate: '2026-01-17', workingDays: 9, targetVelocity: 1.7, actualVelocity: 1.6, developmentEfficiency: 0.94, targetPoints: 15 },
          { iteration: 'I-2', startDate: '2026-01-20', endDate: '2026-01-31', workingDays: 10, targetVelocity: 1.7, actualVelocity: 1.7, developmentEfficiency: 1.00, targetPoints: 17 },
          { iteration: 'I-3', startDate: '2026-02-03', endDate: '2026-02-14', workingDays: 10, targetVelocity: 1.7, actualVelocity: 1.8, developmentEfficiency: 1.06, targetPoints: 17 },
          { iteration: 'I-4', startDate: '2026-02-17', endDate: '2026-02-28', workingDays: 7, targetVelocity: 1.7, actualVelocity: 1.6, developmentEfficiency: 0.98, targetPoints: 12 },
          { iteration: 'I-5', startDate: '2026-03-03', endDate: '2026-03-14', workingDays: 10, targetVelocity: 1.7, actualVelocity: 1.6, developmentEfficiency: 0.94, targetPoints: 17 },
          { iteration: 'I-6', startDate: '2026-03-17', endDate: '2026-03-28', workingDays: 7, targetVelocity: 1.7, actualVelocity: 1.6, developmentEfficiency: 0.98, targetPoints: 12 },
        ],
      },
      {
        projectId: 'p2',
        projectName: '施工管理モバイル連携',
        version: '0.9.3',
        division: 'BE',
        iterations: [
          { iteration: 'I-1', startDate: '2026-02-01', endDate: '2026-02-14', workingDays: 10, targetVelocity: 1.6, actualVelocity: 1.7, developmentEfficiency: 1.06, targetPoints: 16 },
          { iteration: 'I-2', startDate: '2026-02-17', endDate: '2026-02-28', workingDays: 9, targetVelocity: 1.6, actualVelocity: 1.5, developmentEfficiency: 0.94, targetPoints: 14 },
          { iteration: 'I-3', startDate: '2026-03-03', endDate: '2026-03-14', workingDays: 10, targetVelocity: 1.6, actualVelocity: 1.8, developmentEfficiency: 1.13, targetPoints: 16 },
          { iteration: 'I-4', startDate: '2026-03-17', endDate: '2026-03-28', workingDays: 10, targetVelocity: 1.7, actualVelocity: 1.7, developmentEfficiency: 1.00, targetPoints: 17 },
        ],
      },
      {
        projectId: 'p4',
        projectName: '工程可視化API',
        version: '0.6.4',
        division: 'BE',
        iterations: [
          { iteration: 'I-1', startDate: '2026-03-01', endDate: '2026-03-14', workingDays: 10, targetVelocity: 1.5, actualVelocity: 1.4, developmentEfficiency: 0.93, targetPoints: 15 },
          { iteration: 'I-2', startDate: '2026-03-17', endDate: '2026-03-28', workingDays: 10, targetVelocity: 1.5, actualVelocity: 1.6, developmentEfficiency: 1.07, targetPoints: 15 },
          { iteration: 'I-3', startDate: '2026-04-01', endDate: '2026-04-14', workingDays: 9, targetVelocity: 1.5, actualVelocity: 1.5, developmentEfficiency: 1.00, targetPoints: 14 },
        ],
      },
    ],
  },
};
