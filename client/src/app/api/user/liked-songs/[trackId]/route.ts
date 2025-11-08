import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import User from '@/models/User';

interface RouteParams {
  params: Promise<{
    trackId: string;
  }>;
}

// Unlike a song (remove from liked songs)
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

    const { trackId } = await params;

    const user = await User.findById(authResult.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    user.likedSongs = user.likedSongs.filter((t) => t.id !== trackId);
    await user.save();

    return NextResponse.json({ message: 'Song unliked', likedSongs: user.likedSongs });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error unliking song', details: error.message },
      { status: 500 }
    );
  }
}
