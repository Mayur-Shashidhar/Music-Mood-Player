import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authResult = await getUserFromRequest(request);

    if (authResult.error || !authResult.user) {
      return NextResponse.json(
        { error: authResult.error || 'User not found' },
        { status: authResult.error === 'Database connection unavailable' ? 503 : 401 }
      );
    }

    const userResponse = {
      id: authResult.user._id,
      email: authResult.user.email,
      name: authResult.user.name,
      playlists: authResult.user.playlists,
      likedSongs: authResult.user.likedSongs,
    };

    return NextResponse.json({ user: userResponse });
  } catch (error: any) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Error fetching user', details: error.message },
      { status: 500 }
    );
  }
}
