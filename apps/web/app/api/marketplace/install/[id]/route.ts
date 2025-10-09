import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@galaxyco/database/client';
import { agentTemplates, agents, users, workspaceMembers } from '@galaxyco/database/schema';
import { eq, and } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

/**
 * POST /api/marketplace/install/[id]
 * 
 * Installs a template to the user's workspace
 * - Requires authentication
 * - Copies template config to new agent
 * - Increments install count
 * - Returns new agent ID
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Check authentication
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // 2. Get template ID from params
    const templateId = params.id;
    if (!templateId) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      );
    }

    // 3. Get user from database
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.clerkUserId, clerkUserId))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // 4. Get user's active workspace (first one for now)
    const [membership] = await db
      .select()
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.userId, user.id),
          eq(workspaceMembers.isActive, true)
        )
      )
      .limit(1);

    if (!membership) {
      return NextResponse.json(
        { error: 'No active workspace found. Please create a workspace first.' },
        { status: 400 }
      );
    }

    const workspaceId = membership.workspaceId;

    // 5. Fetch template
    const [template] = await db
      .select()
      .from(agentTemplates)
      .where(
        and(
          eq(agentTemplates.id, templateId),
          eq(agentTemplates.isPublished, true)
        )
      )
      .limit(1);

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found or not published' },
        { status: 404 }
      );
    }

    // 6. Create new agent from template
    const [newAgent] = await db
      .insert(agents)
      .values({
        workspaceId: workspaceId,
        name: template.name,
        description: template.description,
        type: template.type,
        status: 'draft', // Start as draft so user can review/customize
        config: template.config,
        sourcePackId: null,
        isCustom: false, // From template
        createdBy: user.id,
        isPublic: false,
        version: '1.0.0',
      })
      .returning();

    // 7. Increment install count (in a transaction would be better, but this works)
    await db
      .update(agentTemplates)
      .set({
        installCount: template.installCount + 1,
        installs24h: template.installs24h + 1,
        installs7d: template.installs7d + 1,
        installs30d: template.installs30d + 1,
        updatedAt: new Date(),
      })
      .where(eq(agentTemplates.id, templateId));

    // 8. Return success with new agent details
    return NextResponse.json({
      success: true,
      agent: {
        id: newAgent.id,
        name: newAgent.name,
        type: newAgent.type,
        status: newAgent.status,
      },
      message: `Successfully installed "${template.name}" to your workspace!`,
    });
  } catch (error) {
    console.error('Error installing template:', error);
    return NextResponse.json(
      { error: 'Failed to install template. Please try again.' },
      { status: 500 }
    );
  }
}
