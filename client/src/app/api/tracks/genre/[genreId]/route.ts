import { NextRequest, NextResponse } from 'next/server';
import deezerService from '@/lib/services/deezerService';

interface RouteParams {
  params: Promise<{
    genreId: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { genreId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');
    
    const tracks = await deezerService.getTracksByGenre(parseInt(genreId), limit);

    return NextResponse.json({
      success: true,
      genreId: parseInt(genreId),
      count: tracks.length,
      tracks
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch tracks by genre',
        message: error.message
      },
      { status: 500 }
    );
  }
}
