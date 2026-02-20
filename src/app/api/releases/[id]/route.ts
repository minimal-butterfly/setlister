import { NextRequest, NextResponse } from 'next/server';
import { discogsFetch } from '@/lib/discogs';

export async function GET(request: NextRequest,
  { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const release = await discogsFetch(`/releases/${id}`);
    return NextResponse.json(release);
  } catch (error) {
    console.error('Error fetching release details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch release details' },
      { status: 500 }
    );
  }
}
