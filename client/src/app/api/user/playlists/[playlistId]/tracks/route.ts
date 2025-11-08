import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import User from '@/models/User';

interface RouteParams {
  params: Promise<{
    playlistId: string;
  }>;
}

// Add track to playlist
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const authResult = await getUserFromRequest(request);

    if (authResult.error || !authResult.userId) {
      return NextResponse.json(
        { error: authResult.error || 'User not authenticated' },
        { status: authResult.error === 'Database connection unavailable' ? 503 : 401 }
      );
    }

    const { playlistId } = await params;
    const track = await request.json();

    const user = await User.findById(authResult.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const playlist = user.playlists.find((p) => p.id === playlistId);
    if (!playlist) {
      return NextResponse.json(
        { error: 'Playlist not found' },
        { status: 404 }
      );
    }

    // Check if track already exists
    const trackExists = playlist.tracks.some((t) => t.id === track.id);
    if (trackExists) {
      return NextResponse.json(
        { error: 'Track already in playlist' },
        { status: 400 }
      );
    }

    playlist.tracks.push(track);
    await user.save();

    return NextResponse.json({ message: 'Track added to playlist', playlist });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error adding track', details: error.message },
      { status: 500 }
    );
  }
}
