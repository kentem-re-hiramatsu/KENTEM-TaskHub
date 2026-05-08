import { delay, HttpResponse, http, passthrough } from 'msw';
import type { MachineDTO } from '@/features/machines-master/types';

const mockData: MachineDTO[] = Array.from({ length: 89 }).map((_, i) => ({
  id: `${i + 1}`,
  name: `機械・車両${i + 1}`,
  magnetName: `マグネット${i + 1}`,
  magnetColor: '#FFFFFF',
  magnetTextColor: '#000000',
  machineGroupId: null,
  machineInspectionPlannedDate: null,
  machineInspectionExpiryDate: null,
  annualInspectionPlannedDate: null,
  annualInspectionExpiryDate: null,
  leaseStartDate: null,
  leaseEndDate: null,
}));

const PAGE_SIZE = 20;

export const machinesHandlers = [
  http.get('*/machines/:machineId', async ({ params }) => {
    await delay(100);
    const machine =
      mockData.find((v) => v.id === params.machineId) ?? mockData[0];
    return HttpResponse.json({ value: machine, error: null });
  }),
  http.get('*/machines', async ({ request }) => {
    await delay(100);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? '1');
    const keywords = url.searchParams.get('keywords') ?? '';
    const filtered = keywords
      ? mockData.filter(
          (v) => v.name.includes(keywords) || v.magnetName.includes(keywords),
        )
      : mockData;
    const start = (page - 1) * PAGE_SIZE;
    return HttpResponse.json({
      value: {
        maxCount: filtered.length,
        page,
        items: filtered.slice(start, start + PAGE_SIZE),
      },
      error: null,
    });
  }),
  http.post('*/machines', async ({ request }) => {
    if (request.headers.get('Next-Action')) return passthrough();
    await delay(100);
    return HttpResponse.json({ value: true, error: null });
  }),
  http.put('*/machines/:machineId', async ({ request }) => {
    if (request.headers.get('Next-Action')) return passthrough();
    await delay(100);
    return HttpResponse.json({ value: true, error: null });
  }),
  http.delete('*/machines', async ({ request }) => {
    if (request.headers.get('Next-Action')) return passthrough();
    await delay(100);
    return HttpResponse.json({ value: true, error: null });
  }),
];
