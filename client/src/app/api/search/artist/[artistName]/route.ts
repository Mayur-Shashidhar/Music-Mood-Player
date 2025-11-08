import { NextRequest, NextResponse } from 'next/server';
import deezerService from '@/lib/services/deezerService';

interface RouteParams {
  params: Promise<{
    artistName: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { artistName } = await params;
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');

    const tracks = await deezerService.searchTracks(`artist:"${artistName}"`, limit);

    return NextResponse.json({
      success: true,
      artist: artistName,
      count: tracks.length,
      tracks
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: 'Artist search failed',
        message: error.message
      },
      { status: 500 }
    );
  }
}
