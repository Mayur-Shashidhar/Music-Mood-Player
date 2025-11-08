import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import { checkDatabaseConnection, generateToken } from '@/lib/auth';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    // Check database connection
    const dbCheck = await checkDatabaseConnection();
    if (dbCheck.error) {
      return NextResponse.json(
        { error: 'Database connection unavailable', message: 'Authentication features require database connection' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Please provide email and password' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken((user._id as any).toString());

    // Return user without password
    const userResponse = {
      id: user._id,
      email: user.email,
      name: user.name,
      playlists: user.playlists,
      likedSongs: user.likedSongs,
    };

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: userResponse,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Error logging in', details: error.message },
      { status: 500 }
    );
  }
}
