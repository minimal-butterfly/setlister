import { NextRequest, NextResponse } from 'next/server';
import { saveRecord, getCollection } from '@/services/collectionService';
import { getReleaseDetails } from '@/services/discogsService';
import { toCollectionRecord } from '@/lib/normalizeRelease';
import {
  DEFAULT_LIMIT,
  InvalidCollectionQueryError,
  isSortDirection,
  isSortField,
  MAX_LIMIT,
  SORT_DIRECTIONS,
  SORT_FIELDS,
  type CollectionQuery,
} from '@/lib/collectionQuery';

// The client only says WHICH release to add. The server fetches it from Discogs
// and decides what gets stored, so the browser can never send malformed metadata.
function parseReleaseId(body: unknown): number | null {
  if (!body || typeof body !== 'object' || !('id' in body)) return null;
  const { id } = body as { id: unknown };
  return Number.isSafeInteger(id) && (id as number) > 0 ? (id as number) : null;
}

const NON_NEGATIVE_INTEGER = /^\d+$/;

// Empty params count as missing. Anything else outside the whitelist is a 400, never a silent default.
function parseCollectionParams(params: URLSearchParams): CollectionQuery | string {
  const sort = params.get('sort') || undefined;
  const dir = params.get('dir') || undefined;
  const from = params.get('from') || '0';
  const limit = params.get('limit') || String(DEFAULT_LIMIT);

  if (sort !== undefined && !isSortField(sort)) return `sort must be one of: ${SORT_FIELDS.join(', ')}`;
  if (dir !== undefined && !isSortDirection(dir)) return `dir must be one of: ${SORT_DIRECTIONS.join(', ')}`;
  if (!NON_NEGATIVE_INTEGER.test(from)) return 'from must be a non-negative integer';
  if (!NON_NEGATIVE_INTEGER.test(limit) || Number(limit) < 1) return 'limit must be a positive integer';

  return { sort, dir, from: Number(from), limit: Math.min(Number(limit), MAX_LIMIT) };
}

export async function GET(request: NextRequest) {
  const query = parseCollectionParams(request.nextUrl.searchParams);
  if (typeof query === 'string') {
    return NextResponse.json({ error: query }, { status: 400 });
  }

  try {
    return NextResponse.json(await getCollection(query));
  } catch (error) {
    if (error instanceof InvalidCollectionQueryError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
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
