import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import User from '@/models/User';

interface RouteParams {
  params: Promise<{
    playlistId: string;
  }>;
}

// Delete playlist
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

    const { playlistId } = await params;

    const user = await User.findById(authResult.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    user.playlists = user.playlists.filter((p) => p.id !== playlistId);
    await user.save();

    return NextResponse.json({ message: 'Playlist deleted' });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error deleting playlist', details: error.message },
      { status: 500 }
    );
  }
}
