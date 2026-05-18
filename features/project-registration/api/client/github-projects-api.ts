import type { ProjectPreviewResponse } from '@/features/project-registration/types/project-registration';

export interface ProjectIssuesPreviewRequest {
  projectUrl: string;
  projectNumber: string;
}

export const fetchProjectIssuesPreview = async ({
  projectUrl,
  projectNumber,
}: ProjectIssuesPreviewRequest) => {
  const response = await fetch('/api/github-projects/issues-preview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectUrl, projectNumber }),
  });

  const result = (await response.json()) as ProjectPreviewResponse & {
    error?: string;
  };

  if (!response.ok) {
    throw new Error(result.error ?? '確認に失敗しました。');
  }

  return result;
};
