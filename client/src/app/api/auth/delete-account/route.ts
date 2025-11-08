import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import User from '@/models/User';

export async function DELETE(request: NextRequest) {
  try {
    const authResult = await getUserFromRequest(request);

    if (authResult.error || !authResult.userId) {
      return NextResponse.json(
        { error: authResult.error || 'User not authenticated' },
        { status: authResult.error === 'Database connection unavailable' ? 503 : 401 }
      );
    }

    // Find and delete the user
    const deletedUser = await User.findByIdAndDelete(authResult.userId);

    if (!deletedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log(`User account deleted: ${deletedUser.email}`);

    return NextResponse.json({
      message: 'Account deleted successfully',
      deletedUser: {
        email: deletedUser.email,
        name: deletedUser.name
      }
    });
  } catch (error: any) {
    console.error('Delete account error:', error);
    return NextResponse.json(
      { error: 'Error deleting account', details: error.message },
      { status: 500 }
    );
  }
}
