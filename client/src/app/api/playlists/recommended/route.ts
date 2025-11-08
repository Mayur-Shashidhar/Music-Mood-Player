import { NextRequest, NextResponse } from 'next/server';
import jamendoService from '@/lib/services/jamendoService';

function shuffleArray(array: any[]): any[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '30');
    
    // Mix tracks from different moods
    const moods = ['Happy', 'Chill', 'Focused'];
    const tracksPerMood = Math.ceil(limit / moods.length);
    
    let allTracks: any[] = [];
    
    for (const mood of moods) {
      const tracks = await jamendoService.getTracksByMood(mood, tracksPerMood);
      allTracks = [...allTracks, ...tracks];
    }

    // Shuffle the tracks
    allTracks = shuffleArray(allTracks).slice(0, limit);

    return NextResponse.json({
      success: true,
      count: allTracks.length,
      playlist: {
        name: 'Your Daily Mix',
        description: 'A personalized mix just for you',
        tracks: allTracks
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate recommended playlist',
        message: error.message
      },
      { status: 500 }
    );
  }
}
