import { auth } from '@clerk/nextjs/server';
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

    // Get the user record
    const userRecord = await db.query.users.findFirst({
      where: eq(users.clerkUserId, userId),
    });

    if (!userRecord) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get starter pack details
    const pack = STARTER_PACKS[profile.starterPack.recommendedId];

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
