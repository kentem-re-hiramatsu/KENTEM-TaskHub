import { NextResponse } from 'next/server';
import { mockProjectCards } from '@/mocks/data/project-progress-cards-data';

export async function GET() {
  return NextResponse.json({
    value: {
      items: mockProjectCards,
    },
    error: null,
  });
}
