import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Client-side will handle token removal
  return NextResponse.json({ message: 'Logout successful' });
}
