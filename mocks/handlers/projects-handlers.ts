import { delay, HttpResponse, http, passthrough } from 'msw';
import type { ProjectDTO, ProjectList } from '@/features/projects-master/types';

const ITEMS_PER_PAGE = 20;

const mockProjects: ProjectDTO[] = Array.from({ length: 89 }).map((_, i) => {
  const linkPattern = i % 3;
  return {
    id: `${i + 1}`,
    customerId: 1,
    constructionId:
      linkPattern === 0 ? null : `CONS-${String((i % 8) + 1).padStart(3, '0')}`,
    constructionName:
      linkPattern === 2
        ? null
        : linkPattern === 1
          ? `工事${(i % 8) + 1}`
          : null,
    projectCode: `PRJ-${String(i + 1).padStart(3, '0')}`,
    constructionNumber: null,
    name: `案件${i + 1}`,
    shortName: `案件略名${i + 1}`,
    address: `東京都千代田区${i + 1}丁目`,
    mapUrl: `https://maps.example.com/${i + 1}`,
    ownerName: `施主${i + 1}`,
    ordererName: `発注者${i + 1}`,
    startDate: '2026-01-01',
    endDate: '2026-03-31',
    isNoPeriod: i % 5 === 0,
    isCompleted: i % 4 === 0,
    defaultStartTime: '08:00',
    defaultEndTime: '17:00',
    defaultWorkHours: 8,
    workerId: `${(i % 5) + 1}`,
    orderId: i + 1,
    modifiedOn: '2026-01-01T00:00:00Z',
    modifiedUserId: 1,
  };
});

const mockProjectList: ProjectList[] = mockProjects.map((project, i) => ({
  id: project.id,
  name: project.name,
  shortName: project.shortName,
  projectCode: project.projectCode,
  ownerName: project.ownerName,
  isNoPeriod: project.isNoPeriod,
  startDate: project.startDate,
  endDate: project.endDate,
  isCompleted: project.isCompleted,
  address: project.address,
  mapUrl: project.mapUrl,
  constructionId: project.constructionId,
  constructionName: project.constructionName,
  workerMagnetName: `担当者マグネット名${i + 1}`,
}));

export const projectsHandlers = [
  http.post('*/projects', async () => {
    await delay(100);
    return HttpResponse.json({ value: { id: '1' }, error: null });
  }),
  http.put('*/projects/:projectId', async ({ request }) => {
    if (request.headers.get('Next-Action')) return passthrough();
    await delay(100);
    return HttpResponse.json({ value: null, error: null });
  }),
  http.delete('*/projects/bulk-delete', async ({ request }) => {
    if (request.headers.get('Next-Action')) return passthrough();
    await delay(100);
    return HttpResponse.json({ value: null, error: null });
  }),
  http.get('*/projects/:projectId', async ({ params }) => {
    await delay(100);
    const project = mockProjects.find((p) => p.id === params.projectId);

    if (!project) {
      return HttpResponse.json(
        { value: null, error: { message: '案件が見つかりません' } },
        { status: 404 },
      );
    }

    return HttpResponse.json({ value: project, error: null });
  }),
  http.get('*/projects', async ({ request }) => {
    await delay(100);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const keywords = url.searchParams.get('keywords') ?? '';

    const filtered = keywords
      ? mockProjectList.filter((project) => project.name.includes(keywords))
      : mockProjectList;

    const start = (page - 1) * ITEMS_PER_PAGE;
    const items = filtered.slice(start, start + ITEMS_PER_PAGE);

    return HttpResponse.json({
      value: { maxCount: filtered.length, page, items },
      error: null,
    });
  }),
];
