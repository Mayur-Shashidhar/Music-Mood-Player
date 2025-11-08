import { NextRequest, NextResponse } from 'next/server';
import deezerService from '@/lib/services/deezerService';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');
    
    const tracks = await deezerService.getChart(limit);

    return NextResponse.json({
      success: true,
      count: tracks.length,
      tracks
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch trending tracks',
        message: error.message
      },
      { status: 500 }
    );
  }
}
