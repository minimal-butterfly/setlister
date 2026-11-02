import { NextRequest, NextResponse } from 'next/server';
import { saveRecord, getCollection } from '@/services/collectionService';
import { getReleaseDetails } from '@/services/discogsService';
import { toCollectionRecord } from '@/lib/normalizeRelease';

// The client only says WHICH release to add. The server fetches it from Discogs
// and decides what gets stored, so the browser can never send malformed metadata.
function parseReleaseId(body: unknown): number | null {
  if (!body || typeof body !== 'object' || !('id' in body)) return null;
  const { id } = body as { id: unknown };
  return Number.isSafeInteger(id) && (id as number) > 0 ? (id as number) : null;
}

export async function GET() {
  try {
    const collection = await getCollection();
    return NextResponse.json(collection);
  } catch (error) {
    console.error('Error fetching collection:', error);
    return NextResponse.json({ error: 'Failed to fetch collection' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const releaseId = parseReleaseId(body);
  if (releaseId === null) {
    return NextResponse.json({ error: 'Body must be { id: positive integer }' }, { status: 400 });
  }

  let release;
  try {
    release = await getReleaseDetails(releaseId);
  } catch {
    return NextResponse.json({ error: 'Could not load this release from Discogs' }, { status: 502 });
  }

  try {
    const record = await saveRecord(toCollectionRecord(release));
    return NextResponse.json(record, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
      return NextResponse.json({ error: 'Record already in collection' }, { status: 409 });
    }
    console.error('Error saving record:', error);
    return NextResponse.json({ error: 'Failed to save record' }, { status: 500 });
  }
}
