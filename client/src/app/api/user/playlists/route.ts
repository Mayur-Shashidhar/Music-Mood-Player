import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import User from '@/models/User';

// Get user playlists
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

    return NextResponse.json({ playlists: user.playlists });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error fetching playlists', details: error.message },
      { status: 500 }
    );
  }
}

// Create new playlist
export async function POST(request: NextRequest) {
  try {
    const authResult = await getUserFromRequest(request);

    if (authResult.error || !authResult.userId) {
      return NextResponse.json(
        { error: authResult.error || 'User not authenticated' },
        { status: authResult.error === 'Database connection unavailable' ? 503 : 401 }
      );
    }

    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Playlist name is required' },
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

    const newPlaylist = {
      id: Date.now().toString(),
      name,
      tracks: [],
      createdAt: new Date(),
    };

    user.playlists.push(newPlaylist);
    await user.save();

    return NextResponse.json(
      { message: 'Playlist created', playlist: newPlaylist },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error creating playlist', details: error.message },
      { status: 500 }
    );
  }
}
