import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@galaxyco/database';
import { users } from '@galaxyco/database/schema';
import { eq } from 'drizzle-orm';

/**
 * GET /api/users/me
 * Get current user profile
 */
export async function GET(req: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
      columns: {
        id: true,
        clerkUserId: true,
        email: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        preferences: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
        preferences: user.preferences || {},
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch user profile',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/users/me
 * Update current user profile
 */
export async function PATCH(req: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { firstName, lastName, preferences } = body;

    // Get user
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user
    const [updatedUser] = await db
      .update(users)
      .set({
        firstName: firstName !== undefined ? firstName : user.firstName,
        lastName: lastName !== undefined ? lastName : user.lastName,
        preferences: preferences !== undefined ? preferences : user.preferences,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id))
      .returning();

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        avatarUrl: updatedUser.avatarUrl,
        preferences: updatedUser.preferences,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (error) {
<<<<<<< Updated upstream
    console.error('Update user profile error:', error);
=======
    console.error('[User Update Error]', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          details: error.errors[0]?.message || 'Validation failed',
        },
        { status: 400 },
      );
    }

>>>>>>> Stashed changes
    return NextResponse.json(
      {
        error: 'Failed to update user profile',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
