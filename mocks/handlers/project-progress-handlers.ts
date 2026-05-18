import { delay, HttpResponse, http } from 'msw';
import { mockProjectCards } from '@/mocks/data/project-progress-cards-data';
import { mockProjectProgressDetails } from '@/mocks/data/project-progress-detail-data';

export const projectProgressHandlers = [
  http.get('*/project-progress/cards', async () => {
    await delay(600);
    return HttpResponse.json({
      value: {
        items: mockProjectCards,
      },
      error: null,
    });
  }),
  http.get('*/project-progress/projects/:projectId', async ({ params }) => {
    await delay(500);

    const projectId = String(params.projectId);
    const detail = mockProjectProgressDetails[projectId];

    if (!detail) {
      return HttpResponse.json(
        { value: null, error: { message: 'プロジェクトが見つかりません' } },
        { status: 404 },
      );
    }

    return HttpResponse.json({
      value: detail,
      error: null,
    });
  }),
];
