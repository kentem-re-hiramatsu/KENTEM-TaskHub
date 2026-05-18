import { headers } from 'next/headers';
import type { ProjectCardMockItem } from '@/mocks/data/project-progress-cards-data';
import type { ProjectProgressDetail } from '@/mocks/data/project-progress-detail-data';

interface ProjectCardApiResponse {
  value: {
    items: ProjectCardMockItem[];
  };
  error: { message: string } | null;
}

interface ProjectDetailApiResponse {
  value: ProjectProgressDetail | null;
  error: { message: string } | null;
}

const createBaseUrl = async () => {
  const requestHeaders = await headers();
  const protocol = requestHeaders.get('x-forwarded-proto') ?? 'http';
  const host = requestHeaders.get('host') ?? 'localhost:3000';
  return `${protocol}://${host}`;
};

export const getProjectCards = async () => {
  const baseUrl = await createBaseUrl();

  try {
    const response = await fetch(`${baseUrl}/api/project-progress/cards`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as ProjectCardApiResponse;
    return data.value.items;
  } catch {
    return [];
  }
};

export const getProjectProgressDetail = async (projectId: string) => {
  const baseUrl = await createBaseUrl();

  try {
    const response = await fetch(
      `${baseUrl}/api/project-progress/projects/${projectId}`,
      {
        cache: 'no-store',
      },
    );

    if (!response.ok) {
      return undefined;
    }

    const data = (await response.json()) as ProjectDetailApiResponse;
    return data.value ?? undefined;
  } catch {
    return undefined;
  }
};
