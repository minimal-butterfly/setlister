import { NextRequest, NextResponse } from 'next/server';
import { removeRecord } from '@/services/collectionService';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numericId = Number(id);

  if (!Number.isInteger(numericId) || numericId <= 0) {
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
