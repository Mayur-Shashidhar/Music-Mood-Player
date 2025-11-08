import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import User from '@/models/User';

interface RouteParams {
  params: Promise<{
    playlistId: string;
    trackId: string;
  }>;
}

// Remove track from playlist
export async function DELETE(
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

    const { playlistId, trackId } = await params;

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

    playlist.tracks = playlist.tracks.filter((t) => t.id !== trackId);
    await user.save();

    return NextResponse.json({ message: 'Track removed from playlist', playlist });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error removing track', details: error.message },
      { status: 500 }
    );
  }
}
