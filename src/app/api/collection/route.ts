import { NextRequest, NextResponse } from 'next/server';
import { saveRecord, getCollection, type CollectionRecord } from '@/services/collectionService';

const MAX_YEAR = new Date().getFullYear() + 1;

type ValidationResult = { data: Omit<CollectionRecord, 'created_at'> } | { error: string };

function validate(body: unknown): ValidationResult {
  if (!body || typeof body !== 'object') return { error: 'Request body must be an object' };
  const b = body as Record<string, unknown>;
  if (!Number.isInteger(b.id) || (b.id as number) <= 0) return { error: 'id must be a positive integer' };
  if (typeof b.title !== 'string' || !b.title.trim() || b.title.length > 500) return { error: 'title must be a non-empty string (max 500 chars)' };
  if (typeof b.artist !== 'string' || !b.artist.trim() || b.artist.length > 500) return { error: 'artist must be a non-empty string (max 500 chars)' };
  if (b.year !== undefined && (!Number.isInteger(b.year) || (b.year as number) < 1900 || (b.year as number) > MAX_YEAR)) return { error: `year must be an integer between 1900 and ${MAX_YEAR}` };
  if (b.label !== undefined && (typeof b.label !== 'string' || b.label.length > 500)) return { error: 'label must be a string (max 500 chars)' };
  if (b.cover_image !== undefined && (typeof b.cover_image !== 'string' || !b.cover_image.startsWith('http'))) return { error: 'cover_image must be a string starting with "http"' };
  return {
    data: {
      id: b.id as number,
      title: b.title,
      artist: b.artist,
      ...(b.year !== undefined && { year: b.year as number }),
      ...(b.label !== undefined && { label: b.label as string }),
      ...(b.cover_image !== undefined && { cover_image: b.cover_image as string }),
    },
  };
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
  const result = validate(body);
  if ('error' in result) return NextResponse.json({ error: result.error }, { status: 400 });
  try {
    const record = await saveRecord(result.data);
    return NextResponse.json(record, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
      return NextResponse.json({ error: 'Record already in collection' }, { status: 409 });
    }
    console.error('Error saving record:', error);
    return NextResponse.json({ error: 'Failed to save record' }, { status: 500 });
  }
}
