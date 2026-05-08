import { delay, HttpResponse, http, passthrough } from 'msw';
import type { PartnerDTO } from '@/features/partners-master/types';

const mockData: PartnerDTO[] = Array.from({ length: 89 }).map((_, i) => ({
  id: `${i + 1}`,
  name: `協力会社${i + 1}`,
  magnetName: `マグネット${i + 1}`,
  magnetColor: '#FFFFFF',
  magnetTextColor: '#000000',
}));

export const partnersHandlers = [
  http.get('*/partners/:partnerId', async () => {
    await delay(100);
    return HttpResponse.json({ value: mockData[0], error: null });
  }),
  http.get('*/partners', async () => {
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
  http.post('*/partners', async ({ request }) => {
    if (request.headers.get('Next-Action')) return passthrough();
    await delay(100);
    return HttpResponse.json({ value: true, error: null });
  }),
  http.put('*/partners/:partnerId', async ({ request }) => {
    if (request.headers.get('Next-Action')) return passthrough();
    await delay(100);
    return HttpResponse.json({ value: null, error: null });
  }),
  http.delete('*/partners', async ({ request }) => {
    if (request.headers.get('Next-Action')) return passthrough();
    await delay(100);
    return HttpResponse.json({ value: true, error: null });
  }),
];
