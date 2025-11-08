import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import connectDB from './database';
import User, { IUser } from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export interface AuthResult {
  user: IUser | null;
  userId: string | null;
  error: string | null;
}

// Generate JWT token
export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

// Verify JWT token
export function verifyToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded;
  } catch (error) {
    return null;
  }
}

// Check if database is connected
export function isDatabaseConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

// Get user from request
export async function getUserFromRequest(request: NextRequest): Promise<AuthResult> {
  try {
    // Connect to database
    await connectDB();

    if (!isDatabaseConnected()) {
      return {
        user: null,
        userId: null,
        error: 'Database connection unavailable'
      };
    }

    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return {
        user: null,
        userId: null,
        error: 'Authentication required'
      };
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return {
        user: null,
        userId: null,
        error: 'Invalid or expired token'
      };
    }

    // Get user from database
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return {
        user: null,
        userId: null,
        error: 'User not found'
      };
    }

    return {
      user,
      userId: decoded.userId,
      error: null
    };
  } catch (error: any) {
    console.error('Authentication error:', error);
    return {
      user: null,
      userId: null,
      error: 'Authentication failed'
    };
  }
}

// Middleware to check database connection
export async function checkDatabaseConnection(): Promise<{ error: string | null }> {
  try {
    await connectDB();
    
    if (!isDatabaseConnected()) {
      return {
        error: 'Database connection unavailable'
      };
    }

    return { error: null };
  } catch (error) {
    return {
      error: 'Database connection failed'
    };
  }
}
