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
    const { email, password, name } = body;

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Create new user
    const user = new User({
      email: email.toLowerCase(),
      password,
      name,
      playlists: [],
      likedSongs: [],
    });

    await user.save();

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
      message: 'User created successfully',
      token,
      user: userResponse,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Error creating user', details: error.message },
      { status: 500 }
    );
  }
}
