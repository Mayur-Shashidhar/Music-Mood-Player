import { NextRequest, NextResponse } from 'next/server';
import jamendoService from '@/lib/services/jamendoService';
import deezerService from '@/lib/services/deezerService';

interface RouteParams {
  params: Promise<{
    mood: string;
  }>;
}

function getMoodDescription(mood: string): string {
  const descriptions: { [key: string]: string } = {
    'Happy': 'Uplifting and energetic vibes to boost your mood',
    'Sad': 'Melancholic and reflective tunes for contemplation',
    'Chill': 'Relaxed and laid-back sounds to unwind',
    'Focused': 'Deep concentration music for productivity'
  };
  return descriptions[mood] || 'A curated playlist for you';
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { mood } = await params;
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');
    
    const validMoods = ['Happy', 'Sad', 'Chill', 'Focused'];

    if (!validMoods.includes(mood)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid mood',
          validMoods
        },
        { status: 400 }
      );
    }

    let tracks: any[] = [];

    // Try Jamendo first (full tracks)
    try {
      tracks = await jamendoService.getTracksByMood(mood, limit);
      console.log(`Jamendo returned ${tracks.length} tracks for mood ${mood}`);
    } catch (error) {
      console.log('Jamendo failed, trying Deezer...');
    }

    // Fallback to Deezer if Jamendo returns no tracks
    if (tracks.length === 0) {
      const moodSearchTerms: { [key: string]: string } = {
        'Happy': 'happy upbeat pop',
        'Sad': 'sad emotional ballad',
        'Chill': 'chill lofi ambient',
        'Focused': 'instrumental focus classical'
      };
      const searchTerm = moodSearchTerms[mood] || 'popular music';
      tracks = await deezerService.searchTracks(searchTerm, limit);
      console.log(`Deezer returned ${tracks.length} tracks for mood ${mood}`);
    }

    return NextResponse.json({
      success: true,
      mood,
      count: tracks.length,
      playlist: {
        name: `${mood} Mix`,
        description: getMoodDescription(mood),
        tracks
      }
    });
  } catch (error: any) {
    console.error('Playlist generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate mood playlist',
        message: error.message
      },
      { status: 500 }
    );
  }
}
