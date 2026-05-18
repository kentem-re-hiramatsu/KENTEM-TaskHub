import { NextResponse } from 'next/server';
import { mockProjectProgressDetails } from '@/mocks/data/project-progress-detail-data';

interface Params {
  params: Promise<{
    projectId: string;
  }>;
}

export async function GET(_: Request, { params }: Params) {
  const { projectId } = await params;
  const detail = mockProjectProgressDetails[projectId];

  if (!detail) {
    return NextResponse.json(
      {
        value: null,
        error: { message: 'project が見つかりません。' },
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    value: detail,
    error: null,
  });
}
