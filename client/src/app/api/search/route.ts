import { NextRequest, NextResponse } from 'next/server';
import jamendoService from '@/lib/services/jamendoService';
import deezerService from '@/lib/services/deezerService';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '20');
    const source = searchParams.get('source') || 'all';

    if (!query) {
      return NextResponse.json(
        {
          success: false,
          error: 'Search query is required'
        },
        { status: 400 }
      );
    }

    let tracks: any[] = [];

    // Search across different sources
    if (source === 'jamendo' || source === 'all') {
      const jamendoTracks = await jamendoService.searchTracks(query, limit);
      tracks = [...tracks, ...jamendoTracks];
    }

    if (source === 'deezer' || source === 'all') {
      const deezerTracks = await deezerService.searchTracks(query, limit);
      tracks = [...tracks, ...deezerTracks];
    }

    return NextResponse.json({
      success: true,
      query,
      count: tracks.length,
      results: tracks
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: 'Search failed',
        message: error.message
      },
      { status: 500 }
    );
  }
}
