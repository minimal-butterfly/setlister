import { NextRequest, NextResponse } from 'next/server';
import { getCollectedIds } from '@/services/collectionService';

// One Discogs search page holds 50 releases.
const MAX_IDS = 50;

function parseIds(value: string | null): number[] | null {
  if (!value) return null;
  const ids = value.split(',').map(Number);
  if (ids.length > MAX_IDS) return null;
  return ids.every((id) => Number.isSafeInteger(id) && id > 0) ? ids : null;
}

// GET /api/collection/contains?ids=1,2,3 → { ids: [ids that are in the collection] }
export async function GET(request: NextRequest) {
  const ids = parseIds(request.nextUrl.searchParams.get('ids'));
  if (ids === null) {
    return NextResponse.json(
      { error: `ids must be 1 to ${MAX_IDS} comma-separated positive integers` },
      { status: 400 }
    );
  }

  try {
    return NextResponse.json({ ids: await getCollectedIds(ids) });
  } catch (error) {
    console.error('Error checking collection:', error);
    return NextResponse.json({ error: 'Failed to check collection' }, { status: 500 });
  }
}
