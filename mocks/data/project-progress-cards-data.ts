export interface ProjectCardMockItem {
  id: string;
  projectName: string;
  version: string;
  plannedProgress: number;
  actualProgress: number;
  iterationCount: number;
  href?: string;
}

export const mockProjectCards: ProjectCardMockItem[] = [
  {
    id: 'p1',
    projectName: 'KENTEM TaskHub Core',
    version: '1.8.0',
    plannedProgress: 68.0,
    actualProgress: 64.5,
    iterationCount: 11,
    href: '/projects/p1',
  },
  {
    id: 'p2',
    projectName: '施工管理モバイル連携',
    version: '0.9.3',
    plannedProgress: 44.0,
    actualProgress: 51.2,
    iterationCount: 7,
    href: '/projects/p2',
  },
  {
    id: 'p3',
    projectName: '勤怠連携ダッシュボード',
    version: '2.0.1',
    plannedProgress: 82.0,
    actualProgress: 77.4,
    iterationCount: 15,
    href: '/projects/p3',
  },
  {
    id: 'p4',
    projectName: '工程可視化API',
    version: '0.6.4',
    plannedProgress: 35.0,
    actualProgress: 28.3,
    iterationCount: 4,
    href: '/projects/p4',
  },
];
