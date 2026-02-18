import { NextRequest, NextResponse } from 'next/server';
import { discogsFetch } from '@/lib/discogs';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const response = await discogsFetch(
      `/database/search?q=${encodeURIComponent(query)}&type=release&per_page=50`
    );
    
    return NextResponse.json(response.results);
  } catch (error) {
    console.error('Error searching releases:', error);
    return NextResponse.json(
      { error: 'Failed to search releases' },
      { status: 500 }
    );
  }
}
