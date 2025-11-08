import { NextRequest, NextResponse } from 'next/server';
import jamendoService from '@/lib/services/jamendoService';
import deezerService from '@/lib/services/deezerService';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');
    const source = searchParams.get('source') || 'all';

    let tracks: any[] = [];

    if (source === 'jamendo' || source === 'all') {
      const jamendoTracks = await jamendoService.getTracks(limit);
      tracks = [...tracks, ...jamendoTracks];
    }

    if (source === 'deezer' || source === 'all') {
      const deezerTracks = await deezerService.getChart(limit);
      tracks = [...tracks, ...deezerTracks];
    }

    return NextResponse.json({
      success: true,
      count: tracks.length,
      tracks
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch tracks',
        message: error.message
      },
      { status: 500 }
    );
  }
}
