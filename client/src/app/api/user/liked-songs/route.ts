import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import User from '@/models/User';

// Get liked songs
export async function GET(request: NextRequest) {
  try {
    const authResult = await getUserFromRequest(request);

    if (authResult.error || !authResult.userId) {
      return NextResponse.json(
        { error: authResult.error || 'User not authenticated' },
        { status: authResult.error === 'Database connection unavailable' ? 503 : 401 }
      );
    }

    const user = await User.findById(authResult.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ likedSongs: user.likedSongs });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error fetching liked songs', details: error.message },
      { status: 500 }
    );
  }
}

// Like a song (add to liked songs)
export async function POST(request: NextRequest) {
  try {
    const authResult = await getUserFromRequest(request);

    if (authResult.error || !authResult.userId) {
      return NextResponse.json(
        { error: authResult.error || 'User not authenticated' },
        { status: authResult.error === 'Database connection unavailable' ? 503 : 401 }
      );
    }

    const track = await request.json();

    if (!track || !track.id) {
      return NextResponse.json(
        { error: 'Track data is required' },
        { status: 400 }
      );
    }

    const user = await User.findById(authResult.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if song is already liked
    const alreadyLiked = user.likedSongs.some((t) => t.id === track.id);
    if (alreadyLiked) {
      return NextResponse.json(
        { error: 'Song already liked' },
        { status: 400 }
      );
    }

    user.likedSongs.push(track);
    await user.save();

    return NextResponse.json({ message: 'Song liked', likedSongs: user.likedSongs });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error liking song', details: error.message },
      { status: 500 }
    );
  }
}
