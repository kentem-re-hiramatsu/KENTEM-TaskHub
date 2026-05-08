import type { MagnetData } from '@/features/allocations-projects/types/magnet';
import type { ExpirationDataType } from '@/features/schedule/types';

const workerDetail = {
  startTime: new Date('2026-04-24T08:00:00'),
  endTime: new Date('2026-04-24T17:00:00'),
  workHours: 8,
  isAllDay: false,
  memo: '',
};

const machineDetail = {
  startTime: new Date('2026-04-24T08:00:00'),
  endTime: new Date('2026-04-24T17:00:00'),
  daysConversion: 1,
  isAllDay: false,
  memo: '',
};

const equipmentDetail = {
  startTime: new Date('2026-04-24T08:00:00'),
  endTime: new Date('2026-04-24T17:00:00'),
  daysConversion: 1,
  isAllDay: false,
  memo: '',
  inspectionExpectedDate: new Date('2026-06-01T00:00:00'),
  inspectionExpirationDate: new Date('2026-06-30T00:00:00'),
};

const yamada: MagnetData<'worker'> = {
  id: 'sw-1',
  name: '山田 太郎',
  magnetName: '山田',
  bgColor: '#2196F3',
  fontColor: 'white',
  type: 'worker',
  detail: workerDetail,
};

const sato: MagnetData<'worker'> = {
  id: 'sw-2',
  name: '佐藤 次郎',
  magnetName: '佐藤',
  bgColor: '#FF5722',
  fontColor: 'white',
  type: 'worker',
  detail: workerDetail,
};

const suzuki: MagnetData<'worker'> = {
  id: 'sw-3',
  name: '鈴木 三郎',
  magnetName: '鈴木',
  bgColor: '#9C27B0',
  fontColor: 'white',
  type: 'worker',
  detail: workerDetail,
};

const tanaka: MagnetData<'worker'> = {
  id: 'sw-4',
  name: '田中 四郎',
  magnetName: '田中',
  bgColor: '#4CAF50',
  fontColor: 'white',
  type: 'worker',
  detail: workerDetail,
};

const excavator: MagnetData<'machine'> = {
  id: 'sv-1',
  name: '油圧ショベル',
  magnetName: '油圧ショベル',
  bgColor: '#607D8B',
  fontColor: 'white',
  type: 'machine',
  detail: machineDetail,
};

const dump: MagnetData<'machine'> = {
  id: 'sv-2',
  name: '4tダンプ',
  magnetName: 'ダンプ',
  bgColor: '#795548',
  fontColor: 'white',
  type: 'machine',
  detail: machineDetail,
};

const compactor: MagnetData<'equipment'> = {
  id: 'se-1',
  name: 'プレートコンパクタ',
  magnetName: 'コンパクタ',
  bgColor: '#009688',
  fontColor: 'white',
  type: 'equipment',
  detail: equipmentDetail,
};

const rammer: MagnetData<'equipment'> = {
  id: 'se-2',
  name: 'ランマー',
  magnetName: 'ランマー',
  bgColor: '#3F51B5',
  fontColor: 'white',
  type: 'equipment',
  detail: equipmentDetail,
};

export const scheduleMagnets: Record<ExpirationDataType, MagnetData[]> = {
  healthCheck: [yamada, sato, suzuki],
  machineInspection: [excavator, dump],
  visa: [suzuki, tanaka],
  annualInspection: [excavator],
  inspection: [compactor, rammer],
};
