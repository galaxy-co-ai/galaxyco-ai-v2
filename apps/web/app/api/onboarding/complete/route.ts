import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@galaxyco/database/client';
import { workspaces, workspaceMembers, users } from '@galaxyco/database/schema';
import { eq } from 'drizzle-orm';
import { OnboardingProfile, STARTER_PACKS } from '@/lib/constants/onboarding';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile: OnboardingProfile = await request.json();

    // Validate profile data
    if (!profile.starterPack?.recommendedId) {
      console.error('Missing starter pack recommendation in profile:', { userId });
      return NextResponse.json(
        { error: 'Invalid onboarding profile: missing starter pack' },
        { status: 400 }
      );
    }

    // Get or create the user record
    // (Webhook might not have fired yet for new signups)
    let userRecord = await db.query.users.findFirst({
      where: eq(users.clerkUserId, userId),
    });

    if (!userRecord) {
      console.log('User record not found, creating from Clerk data:', { userId });
      
      // Get user info from Clerk
      const clerkUser = await currentUser();
      if (!clerkUser) {
        console.error('Unable to fetch Clerk user data:', { userId });
        return NextResponse.json(
          { error: 'Unable to fetch user information' },
          { status: 500 }
        );
      }

      // Create user record
      const [newUser] = await db
        .insert(users)
        .values({
          clerkUserId: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          firstName: clerkUser.firstName || null,
          lastName: clerkUser.lastName || null,
          avatarUrl: clerkUser.imageUrl || null,
          lastLoginAt: new Date(),
        })
        .returning();

      userRecord = newUser;
      console.log('User record created:', { userId: userRecord.id, email: userRecord.email });
    }

    // Get starter pack details with fallback to founder-ops
    const packId = profile.starterPack.recommendedId;
    const pack = STARTER_PACKS[packId] || STARTER_PACKS['founder-ops'];
    
    if (!STARTER_PACKS[packId]) {
      console.warn('Invalid starter pack ID, falling back to founder-ops:', { userId, packId });
    }

    // Generate workspace name and slug from role
    const workspaceName = `${userRecord.firstName || 'My'}'s ${pack.name} Workspace`;
    const slug = workspaceName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Create workspace with onboarding profile stored in settings
    const [workspace] = await db
      .insert(workspaces)
      .values({
        name: workspaceName,
        slug,
        settings: {
          onboardingProfile: profile,
          starterPack: {
            id: profile.starterPack.recommendedId,
            name: pack.name,
            installedAt: new Date().toISOString(),
          },
          features: {
            sensitiveDataHandling: profile.sensitivity.flag,
          },
        } as any,
      })
      .returning();

    // Add user as owner
    await db.insert(workspaceMembers).values({
      workspaceId: workspace.id,
      userId: userRecord.id,
      role: 'owner',
      permissions: {
        agents: { create: true, edit: true, delete: true, execute: true },
        packs: { install: true, uninstall: true },
        billing: { view: true, manage: true },
        members: { invite: true, remove: true, changeRole: true },
      },
    });

    // TODO: In Phase 8, we'll actually create the agents from the starter pack
    // For now, just store the configuration

    return NextResponse.json({
      success: true,
      workspaceId: workspace.id,
      workspaceName: workspace.name,
      slug: workspace.slug,
    });
  } catch (error) {
    console.error('Onboarding completion error:', error);
    return NextResponse.json(
      { error: 'Failed to complete onboarding' },
      { status: 500 }
    );
  }
}
