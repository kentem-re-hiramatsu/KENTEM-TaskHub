import type {
  MappingRow,
  MemberSetting,
  WorkingDaysByMember,
} from '@/features/project-registration/types/project-registration';

export const stepLabels = [
  '基本情報',
  'メンバー設定',
  '稼働日設定',
  'マッピング',
  'タスク確認',
  '保存確認',
] as const;

export const iterationKeys = ['1', '2', '3', '4'] as const;

export const initialMembers: MemberSetting[] = [
  {
    id: 'm1',
    name: '',
    division: 'FE',
    plannedVelocity: 1,
  },
];

export const initialMappings: MappingRow[] = [
  { appField: '予定時間', sourceField: '' },
  { appField: '実施時間', sourceField: '' },
  { appField: 'ポイント', sourceField: '' },
  { appField: 'ステータス', sourceField: '' },
  { appField: '担当者', sourceField: '' },
  { appField: 'イテレーション', sourceField: '' },
];

export const initialWorkingDaysByMember: WorkingDaysByMember = {
  m1: { '1': 10, '2': 10, '3': 10, '4': 10 },
};
