/**
 * AI Assistant Chat API
 *
 * Handles chat messages from the Floating Assistant.
 * Processes messages through the AI Orchestrator and returns responses.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getOrchestrator } from '@/lib/ai-assistant/orchestrator';
import { type ToolContext, Permission } from '@/lib/ai-assistant/tools/types';
import { db } from '@galaxyco/database';
import { workspaces, users, workspaceMembers } from '@galaxyco/database/schema';
import { eq, and } from 'drizzle-orm';

export const runtime = 'nodejs'; // Use Node runtime for AI calls
export const maxDuration = 60; // Allow up to 60s for complex operations

interface ChatRequest {
  message: string;
  conversationHistory?: Array<{ role: string; content: string }>;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse request
    const body: ChatRequest = await request.json();
    if (!body.message || typeof body.message !== 'string') {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
    }

    // 3. Get user from database
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 4. Get user's workspace (from first membership)
    const membership = await db.query.workspaceMembers.findFirst({
      where: eq(workspaceMembers.userId, user.id),
    });

    if (!membership) {
      return NextResponse.json({ error: 'No workspace membership found' }, { status: 404 });
    }

    const userWorkspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, membership.workspaceId),
    });

    if (!userWorkspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    // 5. Build tool context with permissions
    // TODO: Get actual permissions from database
    const toolContext: ToolContext = {
      userId: user.id,
      workspaceId: userWorkspace.id,
      permissions: [
        // Grant all permissions for now - in production, get from DB
        Permission.AGENTS_CREATE,
        Permission.AGENTS_READ,
        Permission.AGENTS_UPDATE,
        Permission.AGENTS_DELETE,
        Permission.AGENTS_EXECUTE,
        Permission.WORKFLOWS_CREATE,
        Permission.WORKFLOWS_READ,
        Permission.WORKFLOWS_UPDATE,
        Permission.WORKFLOWS_DELETE,
        Permission.WORKFLOWS_EXECUTE,
        Permission.KNOWLEDGE_CREATE,
        Permission.KNOWLEDGE_READ,
        Permission.KNOWLEDGE_UPDATE,
        Permission.KNOWLEDGE_DELETE,
        Permission.ANALYTICS_READ,
        Permission.CRM_CONTACTS_CREATE,
        Permission.CRM_CONTACTS_READ,
        Permission.CRM_CONTACTS_UPDATE,
      ],
    };

    // 6. Process message through orchestrator
    const orchestrator = getOrchestrator();
    const response = await orchestrator.processMessage(
      body.message,
      {
        messages: (body.conversationHistory || []).map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
        workspaceId: userWorkspace.id,
        userId: user.id,
      },
      toolContext,
    );

    // 6. Return response
    return NextResponse.json({
      message: response.message,
      toolCalls: response.toolCalls,
      toolResults: response.toolResults,
      actions: response.actions,
      suggestedFollowUps: response.suggestedFollowUps,
    });
  } catch (error: any) {
    console.error('Assistant chat error:', error);

    return NextResponse.json(
      {
        error: 'Failed to process message',
        message: "I'm sorry, I encountered an error. Please try again.",
      },
      { status: 500 },
    );
  }
}
