import { delay, HttpResponse, http, passthrough } from 'msw';
import type { TeamDTO } from '@/features/teams-master/types';

const DOKO_PLAN_DEVELOPER = [
  '太郎',
  '一郎',
  '次郎',
  '三郎',
  '四郎',
  '五郎',
  '六郎',
  '七郎',
  '八郎',
  '九郎',
  '花子',
  '太郎2',
  '一郎2',
  '次郎2',
  '三郎2',
  '四郎2',
  '五郎2',
  '六郎2',
  '七郎2',
  '八郎2',
  '九郎2',
  '花子2',
];

const ITEMS_PER_PAGE = 20;

export const teamsMockData: TeamDTO[] = DOKO_PLAN_DEVELOPER.map((name, i) => ({
  id: `${i + 1}`,
  name: `${name}班`,
  members:
    i === 3 // 4人目はメンバーがいる想定
      ? [
          {
            id: '1-1',
            name: 'サンプル太郎',
          },
          {
            id: '1-2',
            name: 'サンプル次郎',
          },
          {
            id: '1-3',
            name: 'サンプル三郎',
          },
          {
            id: '1-4',
            name: 'サンプル四郎',
          },
        ]
      : [],
}));

export const teamsHandlers = [
  http.get('*/teams/:teamId', async ({ params }) => {
    await delay(100);
    const team = teamsMockData.find((t) => t.id === params.teamId);
    return HttpResponse.json({ value: team ?? null, error: null });
  }),
  http.get('*/teams', async ({ request }) => {
    await delay(100);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) ?? 1;
    const keywords = url.searchParams.get('keywords') ?? '';

    const filtered = keywords
      ? teamsMockData.filter((team) => team.name.includes(keywords))
      : teamsMockData;

    const start = (page - 1) * ITEMS_PER_PAGE;
    const items = filtered.slice(start, start + ITEMS_PER_PAGE);

    return HttpResponse.json({
      value: { maxCount: filtered.length, page, items },
      error: null,
    });
  }),
  http.post('*/teams', async ({ request }) => {
    if (request.headers.get('Next-Action')) return passthrough();
    await delay(100);
    return HttpResponse.json({ value: true, error: null });
  }),
  http.put('*/teams/:teamId', async ({ request }) => {
    if (request.headers.get('Next-Action')) return passthrough();
    await delay(100);
    return HttpResponse.json({ value: true, error: null });
  }),
  http.delete('*/teams', async ({ request }) => {
    if (request.headers.get('Next-Action')) return passthrough();
    await delay(100);
    return HttpResponse.json({ value: true, error: null });
  }),
];
