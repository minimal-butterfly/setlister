import { NextRequest, NextResponse } from 'next/server';
import { getReleaseDetails } from '@/services/discogsService';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const releaseId = Number(id);

  // Only plain numeric IDs reach Discogs; anything else could address another endpoint.
  if (!Number.isSafeInteger(releaseId) || releaseId <= 0) {
    return NextResponse.json({ error: 'Invalid release id' }, { status: 400 });
  }

  try {
    const release = await getReleaseDetails(releaseId);
    return NextResponse.json(release);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch release details' }, { status: 500 });
  }
}
