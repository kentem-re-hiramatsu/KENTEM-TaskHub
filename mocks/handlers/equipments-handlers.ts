import { delay, HttpResponse, http, passthrough } from 'msw';
import type { EquipmentDTO } from '@/features/equipments-master/types';

const mockData: EquipmentDTO[] = Array.from({ length: 89 }).map((_, i) => ({
  id: `${i + 1}`,
  customerId: 1,
  name: `機材${i + 1}`,
  magnetName: `マグネット${i + 1}`,
  magnetColor: '#FFFFFF',
  magnetTextColor: '#000000',
  equipmentGroupId: null,
  maintenancePlannedDate: null,
  maintenanceExpiryDate: null,
  isRetired: false,
}));

const PAGE_SIZE = 20;

export const equipmentsHandlers = [
  http.get('*/equipments/:equipmentId', async ({ params }) => {
    await delay(100);
    const equipment = mockData.find((v) => v.id === params.equipmentId);
    return HttpResponse.json({ value: equipment ?? mockData[0], error: null });
  }),
  http.get('*/equipments', async ({ request }) => {
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
  http.post('*/equipments', async ({ request }) => {
    if (request.headers.get('Next-Action')) return passthrough();
    await delay(100);
    return HttpResponse.json({ value: true, error: null });
  }),
  http.put('*/equipments/:equipmentId', async ({ request }) => {
    if (request.headers.get('Next-Action')) return passthrough();
    await delay(100);
    return HttpResponse.json({ value: true, error: null });
  }),
  http.delete('*/equipments', async ({ request }) => {
    if (request.headers.get('Next-Action')) return passthrough();
    await delay(100);
    return HttpResponse.json({ value: true, error: null });
  }),
];
