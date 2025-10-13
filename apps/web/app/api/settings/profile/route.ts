import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@galaxyco/database";
import { users } from "@galaxyco/database/schema";
import { eq } from "drizzle-orm";

/**
 * User Profile Settings API Route
 * 
 * GET: Get current user profile information
 * PUT: Update user profile information
 * 
 * Handles user preferences, profile data, and personal settings.
 */

/**
 * GET /api/settings/profile
 * Get current user profile and preferences
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate user
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get user from database
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
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3. Return user profile
    return NextResponse.json({
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      lastLoginAt: user.lastLoginAt?.toISOString() || null,
    });
  } catch (error: any) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/settings/profile
 * Update user profile information
 */
export async function PUT(request: NextRequest) {
  try {
    // 1. Authenticate user
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get user from database
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3. Parse and validate request body
    const body = await request.json();
    const {
      firstName,
      lastName,
      avatarUrl,
      preferences,
    } = body;

    // Validate preferences if provided
    if (preferences && typeof preferences !== 'object') {
      return NextResponse.json(
        { error: "Preferences must be a valid object" },
        { status: 400 }
      );
    }

    // 4. Prepare update data
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (firstName !== undefined) {
      updateData.firstName = firstName?.trim() || null;
    }
    if (lastName !== undefined) {
      updateData.lastName = lastName?.trim() || null;
    }
    if (avatarUrl !== undefined) {
      updateData.avatarUrl = avatarUrl?.trim() || null;
    }
    if (preferences !== undefined) {
      // Merge with existing preferences to avoid overwriting unrelated settings
      updateData.preferences = {
        ...user.preferences,
        ...preferences,
      };
    }

    // 5. Update user profile
    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.clerkUserId, clerkUserId))
      .returning({
        id: users.id,
        clerkUserId: users.clerkUserId,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        avatarUrl: users.avatarUrl,
        preferences: users.preferences,
        lastLoginAt: users.lastLoginAt,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    // 6. Return updated user profile
    return NextResponse.json({
      ...updatedUser,
      createdAt: updatedUser.createdAt.toISOString(),
      updatedAt: updatedUser.updatedAt.toISOString(),
      lastLoginAt: updatedUser.lastLoginAt?.toISOString() || null,
    });
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update user profile", details: error.message },
      { status: 500 }
    );
  }
}