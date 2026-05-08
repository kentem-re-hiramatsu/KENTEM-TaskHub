import { delay, HttpResponse, http, passthrough } from 'msw';
import { v4 as uuid } from 'uuid';
import type { WorkerDTO } from '@/features/workers-master/types';

const mockData: WorkerDTO[] = Array.from({ length: 89 }).map((_, i) => ({
  id: `${i + 1}`,
  customerId: 1,
  userId: i + 1,
  name: `作業員${i + 1}`,
  magnetName: `マグネット${i + 1}`,
  magnetColor: '#FFFFFF',
  magnetTextColor: '#000000',
  workerGroupId: null,
  teamId: '1',
  teamName: '太郎班',
  healthCheckPlannedDate: null,
  healthCheckExpiryDate: null,
  isForeigner: false,
  visaRenewalPlannedDate: null,
  visaExpiryDate: null,
  isKentaikyoTarget: null,
  kentaikyoRemarks: null,
  isRetired: false,
}));

export const workersHandlers = [
  http.get('*/workers/:workerId', async () => {
    await delay(100);
    return HttpResponse.json({ value: mockData[0], error: null });
  }),
  http.get('*/workers', async () => {
    await delay(100);
    return HttpResponse.json({
      value: {
        maxCount: mockData.length,
        page: 1,
        items: mockData.slice(0, 20),
      },
      error: null,
    });
  }),
  http.post('*/workers', async ({ request }) => {
    if (request.headers.get('Next-Action')) return passthrough();
    await delay(100);
    return HttpResponse.json({ value: { id: uuid() }, error: null });
  }),
  http.put('*/workers/:workerId', async ({ request }) => {
    if (request.headers.get('Next-Action')) return passthrough();
    await delay(100);
    return HttpResponse.json({ value: null, error: null });
  }),
  http.delete('*/workers/bulk-delete', async ({ request }) => {
    if (request.headers.get('Next-Action')) return passthrough();
    await delay(100);
    return HttpResponse.json({ value: null, error: null });
  }),
];
