import { NextRequest, NextResponse } from 'next/server';
import { getRecord, removeRecord } from '@/services/collectionService';

function parseRecordId(id: string): number | null {
  const numericId = Number(id);
  return Number.isInteger(numericId) && numericId > 0 ? numericId : null;
}

// 200 with the record if it is in the collection, 404 if not.
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const numericId = parseRecordId((await params).id);
  if (numericId === null) {
    return NextResponse.json({ error: 'Invalid record id' }, { status: 400 });
  }

  try {
    const record = await getRecord(numericId);
    if (!record) {
      return NextResponse.json({ error: 'Record not in collection' }, { status: 404 });
    }
    return NextResponse.json(record);
  } catch (error) {
    console.error('Error fetching record:', error);
    return NextResponse.json({ error: 'Failed to fetch record' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const numericId = parseRecordId((await params).id);
  if (numericId === null) {
    return NextResponse.json({ error: 'Invalid record id' }, { status: 400 });
  }

  try {
    await removeRecord(numericId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error removing record:', error);
    return NextResponse.json({ error: 'Failed to remove record' }, { status: 500 });
  }
}
