import { NextRequest, NextResponse } from 'next/server';
import { searchReleases } from '@/services/discogsService';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const results = await searchReleases(query);
    return NextResponse.json(results);
  } catch {
    return NextResponse.json({ error: 'Failed to search releases' }, { status: 500 });
  }
}
