import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  const dbStatus = mongoose.connection.readyState;
  const dbStatusMap: { [key: number]: string } = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  return NextResponse.json({
    status: 'ok',
    database: {
      status: dbStatusMap[dbStatus] || 'unknown',
      connected: dbStatus === 1,
    },
    timestamp: new Date().toISOString(),
  });
}
