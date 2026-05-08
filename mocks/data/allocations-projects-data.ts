import type { FilterTreeItem } from '@/features/allocations-projects/components/group-filter';
import type {
  AllocationRowDTO,
  MagnetDataDTO,
} from '@/features/allocations-projects/types/dto';
import type { MagnetTypes } from '@/features/allocations-projects/types/magnet';

const workerDetail = {
  startTime: '2026-04-06T08:00:00',
  endTime: '2026-04-06T17:00:00',
  workHours: 8,
  isAllDay: false,
  memo: '',
};

const machineDetail = {
  startTime: '2026-04-06T08:00:00',
  endTime: '2026-04-06T17:00:00',
  isAllDay: false,
  memo: '',
};

const equipmentDetail = {
  startTime: '2026-04-06T08:00:00',
  endTime: '2026-04-06T17:00:00',
  isAllDay: false,
  memo: '',
  inspectionExpectedDate: '2026-12-01T00:00:00',
  inspectionExpirationDate: '2026-12-31T00:00:00',
};

const worker = (
  id: string,
  name: string,
  magnetName: string,
  bgColor: string,
): MagnetDataDTO<'worker'> => ({
  id,
  name,
  magnetName,
  bgColor,
  fontColor: 'white',
  type: 'worker',
  detail: workerDetail,
});

const machine = (
  id: string,
  name: string,
  magnetName: string,
  bgColor: string,
): MagnetDataDTO<'machine'> => ({
  id,
  name,
  magnetName,
  bgColor,
  fontColor: 'white',
  type: 'machine',
  detail: machineDetail,
});

const equipment = (
  id: string,
  name: string,
  magnetName: string,
  bgColor: string,
): MagnetDataDTO<'equipment'> => ({
  id,
  name,
  magnetName,
  bgColor,
  fontColor: 'white',
  type: 'equipment',
  detail: equipmentDetail,
});

const partner = (
  id: string,
  name: string,
  magnetName: string,
  bgColor: string,
): MagnetDataDTO<'partner'> => ({
  id,
  name,
  magnetName,
  bgColor,
  fontColor: 'white',
  type: 'partner',
  detail: { memo: '' },
});

const manager = worker('m-1', '田中 一郎', '田中', '#4CAF50');

export const mockAllocationRows: AllocationRowDTO[] = [
  {
    id: '1',
    cells: {
      title: { type: 'title', text: '3○○ 道路改良工事' },
      client: { type: 'client', text: '3○○' },
      content: { type: 'content', text: '舗装工事' },
      manager: { type: 'manager', defaultManager: manager },
      worker: {
        type: 'worker',
        magnetList: [
          worker('w-1', '山田 太郎', '山田', '#2196F3'),
          worker('w-2', '佐藤 次郎', '佐藤', '#FF5722'),
          worker('w-3', '鈴木 三郎', '鈴木', '#9C27B0'),
        ],
      },
      machine: {
        type: 'machine',
        magnetList: [machine('v-1', '4tダンプ', 'ダンプ', '#607D8B')],
      },
      equipment: { type: 'equipment', magnetList: [] },
    },
  },
  {
    id: '2',
    cells: {
      title: { type: 'title', text: '2○○ 排水管布設工事' },
      client: { type: 'client', text: '4○○' },
      content: { type: 'content', text: '排水管布設' },
      manager: {
        type: 'manager',
        defaultManager: manager,
        assignedManager: worker('m-2', '高橋 花子', '高橋', '#E91E63'),
      },
      worker: {
        type: 'worker',
        magnetList: [
          worker('m-2', '高橋 花子', '高橋', '#E91E63'),
          worker('w-4', '伊藤 四郎', '伊藤', '#009688'),
          worker('w-5', '渡辺 五郎', '渡辺', '#FF9800'),
        ],
      },
      machine: {
        type: 'machine',
        magnetList: [
          machine('v-2', 'バックホウ', 'バックホウ', '#795548'),
          machine('v-3', '4tダンプ', 'ダンプ', '#607D8B'),
        ],
      },
      equipment: {
        type: 'equipment',
        magnetList: [equipment('e-1', '発電機', '発電機', '#FF5722')],
      },
    },
  },
  {
    id: '3',
    cells: {
      title: {
        type: 'title',
        text: '4○○ 橋梁上部工補修工事（長い案件名）',
      },
      client: { type: 'client', text: '5○○道路管理課' },
      content: { type: 'content', text: '橋梁補修・塗装' },
      manager: { type: 'manager', defaultManager: manager },
      worker: {
        type: 'worker',
        magnetList: [worker('w-6', '小林 六助', '小林', '#3F51B5')],
      },
      machine: { type: 'machine', magnetList: [] },
      equipment: {
        type: 'equipment',
        magnetList: [
          equipment('e-2', '高所作業車', '高所', '#F44336'),
          equipment('e-3', 'コンプレッサー', 'コンプ', '#9E9E9E'),
        ],
      },
    },
  },
  {
    id: '4',
    cells: {
      title: { type: 'title', text: '1○○ 国道舗装修繕工事' },
      client: { type: 'client', text: '2○○土木事務所' },
      content: { type: 'content', text: 'アスファルト舗装' },
      manager: {
        type: 'manager',
        defaultManager: manager,
        assignedManager: worker('m-3', '松本 次郎', '松本', '#00BCD4'),
      },
      worker: {
        type: 'worker',
        magnetList: [
          worker('m-3', '松本 次郎', '松本', '#00BCD4'),
          worker('w-7', '加藤 七海', '長いマグネット１', '#8BC34A'),
          worker('w-8', '吉田 八郎', '長いマグネット２', '#CDDC39'),
          worker('w-9', '山口 九夫', '長いマグネット３', '#FFC107'),
          worker('w-10', '田中 十郎', '長いマグネット４', '#E91E63'),
          worker('w-11', '佐々木 一恵', '長いマグネット５', '#00BCD4'),
          worker('w-12', '中村 二三子', '長いマグネット６', '#FF5722'),
        ],
      },
      machine: {
        type: 'machine',
        magnetList: [
          machine('v-4', 'フィニッシャー', 'フィニッシャー', '#4CAF50'),
          machine('v-5', 'ローラー', 'ローラー', '#795548'),
        ],
      },
      equipment: { type: 'equipment', magnetList: [] },
    },
  },
  {
    id: '5',
    cells: {
      title: { type: 'title', text: '5○○ 水道管更新工事' },
      client: { type: 'client', text: '1○○水道局' },
      content: { type: 'content', text: '水道管布設替え' },
      manager: { type: 'manager', defaultManager: manager },
      worker: {
        type: 'worker',
        magnetList: [
          worker('w-13', '中村 十郎', '中村', '#E91E63'),
          worker('w-14', '小川 一夫', '小川', '#673AB7'),
        ],
      },
      machine: {
        type: 'machine',
        magnetList: [machine('v-6', 'クレーン車', 'クレーン', '#009688')],
      },
      equipment: {
        type: 'equipment',
        magnetList: [equipment('e-4', '水中ポンプ', 'ポンプ', '#2196F3')],
      },
    },
  },
];

export const mockSidebarMagnets: MagnetDataDTO<MagnetTypes>[] = [
  {
    ...worker('m-1', '田中 一郎', '田中', '#4CAF50'),
    groupId: 'g-1',
    teamId: 't-1',
  },
  {
    ...worker('m-2', '高橋 花子', '高橋', '#E91E63'),
    groupId: 'g-1-1',
    teamId: 't-1',
  },
  {
    ...worker('m-3', '松本 次郎', '松本', '#00BCD4'),
    groupId: 'g-1-2',
    teamId: 't-2',
  },
  {
    ...worker('w-4', '伊藤 四郎', '伊藤', '#009688'),
    groupId: 'g-2-1',
    teamId: 't-3',
  },
  {
    ...worker('w-5', '渡辺 五郎', '渡辺', '#FF9800'),
    groupId: 'g-2',
    teamId: undefined,
  },
  {
    ...worker('w-15', '未所属 A', '未所属', '#607D8B'),
    groupId: undefined,
    teamId: undefined,
  },
  {
    ...machine('sv-1', '油圧ショベル', 'ショベル', '#607D8B'),
    groupId: 'vg-1',
  },
  { ...machine('sv-2', '4tダンプ', 'ダンプ', '#795548'), groupId: 'vg-1-2' },
  {
    ...machine('sv-3', '2tトラック', 'トラック', '#546E7A'),
    groupId: 'vg-2-1',
  },
  { ...machine('sv-4', '未所属車両', '未所属', '#78909C'), groupId: undefined },
  {
    ...equipment('se-1', 'プレートコンパクタ', 'コンパクタ', '#FF5722'),
    groupId: 'eg-1',
  },
  {
    ...equipment('se-2', 'ランマー', 'ランマー', '#F44336'),
    groupId: 'eg-1-1',
  },
  { ...equipment('se-3', 'レベル', 'レベル', '#9E9E9E'), groupId: 'eg-2-1' },
  {
    ...equipment('se-4', '未所属機材', '未所属', '#BDBDBD'),
    groupId: undefined,
  },
  partner('sp-1', '○○建設', '○○建設', '#78909C'),
  partner('sp-2', '△△工業', '△△工業', '#546E7A'),
  partner('sp-3', '□□道路', '□□道路', '#455A64'),
];

export const mockGroupFilterItems: FilterTreeItem[] = [
  {
    id: 'g-1',
    label: '土木部',
    children: [
      { id: 'g-1-1', label: 'Aグループ' },
      { id: 'g-1-2', label: 'Bグループ' },
    ],
  },
  {
    id: 'g-2',
    label: '舗装部',
    children: [
      { id: 'g-2-1', label: 'Cグループ' },
      { id: 'g-2-2', label: 'Dグループ' },
    ],
  },
];

export const mockMachineGroupFilterItems: FilterTreeItem[] = [
  {
    id: 'vg-1',
    label: '重機',
    children: [
      { id: 'vg-1-1', label: 'バックホー班' },
      { id: 'vg-1-2', label: 'ダンプ班' },
    ],
  },
  {
    id: 'vg-2',
    label: '運搬',
    children: [{ id: 'vg-2-1', label: '資材運搬' }],
  },
];

export const mockEquipmentGroupFilterItems: FilterTreeItem[] = [
  {
    id: 'eg-1',
    label: '転圧機材',
    children: [{ id: 'eg-1-1', label: 'ランマー系' }],
  },
  {
    id: 'eg-2',
    label: '測量機材',
    children: [{ id: 'eg-2-1', label: 'レベル' }],
  },
];

export const mockTeamFilterItems = [
  { id: 't-1', label: 'A班' },
  { id: 't-2', label: 'B班' },
  { id: 't-3', label: 'C班' },
];
