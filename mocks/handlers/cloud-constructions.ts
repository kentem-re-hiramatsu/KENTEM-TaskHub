import { delay, HttpResponse, http } from 'msw';
import type { CloudConstruction } from '@/features/projects-master/types';

const pad = (n: number) => String(n).padStart(3, '0');

const mockCloudConstructions: CloudConstruction[] = Array.from({
  length: 45,
}).map((_, i) => ({
  id: `CONS-${pad(i + 1)}`,
  name: `工事${i + 1}`,
  number: `KN-2026-${pad(i + 1)}`,
  code: `C-${pad(i + 1)}`,
  shortName: `工事${i + 1}`,
  ordererName: `発注者${i + 1}`,
  startDate: '2026-04-01',
  endDate: '2026-12-31',
  siteAgentName: `現場代理人${i + 1}`,
}));

const ITEMS_PER_PAGE = 20;

export const cloudConstructionsHandlers = [
  http.get('*/cloud-service/constructions', async ({ request }) => {
    await delay(100);
    const url = new URL(request.url);
    const keywords = url.searchParams.get('keywords') ?? '';
    const page = Number(url.searchParams.get('page') ?? '1') || 1;

    const filtered = keywords
      ? mockCloudConstructions.filter(
          (c) =>
            c.name.includes(keywords) ||
            c.number.includes(keywords) ||
            c.code.includes(keywords) ||
            c.shortName.includes(keywords) ||
            c.ordererName.includes(keywords) ||
            c.siteAgentName.includes(keywords),
        )
      : mockCloudConstructions;

    const start = (page - 1) * ITEMS_PER_PAGE;
    const items = filtered.slice(start, start + ITEMS_PER_PAGE);

    return HttpResponse.json({
      value: { maxCount: filtered.length, page, items },
      error: null,
    });
  }),
];
