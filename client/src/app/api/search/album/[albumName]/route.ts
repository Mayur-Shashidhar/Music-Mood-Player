import { NextRequest, NextResponse } from 'next/server';
import deezerService from '@/lib/services/deezerService';

interface RouteParams {
  params: Promise<{
    albumName: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { albumName } = await params;
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');

    const tracks = await deezerService.searchTracks(`album:"${albumName}"`, limit);

    return NextResponse.json({
      success: true,
      album: albumName,
      count: tracks.length,
      tracks
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: 'Album search failed',
        message: error.message
      },
      { status: 500 }
    );
  }
}
