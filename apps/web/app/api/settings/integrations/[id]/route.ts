import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@galaxyco/database";
import { 
  workspaceApiKeys, 
  workspaceMembers, 
  users 
} from "@galaxyco/database/schema";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";

/**
 * Individual Integration API Route
 * 
 * GET: Get specific integration details
 * PUT: Update existing API key integration  
 * DELETE: Remove API key integration
 */

// Encryption configuration (same as main route)
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
const ENCRYPTION_KEY = process.env.API_KEY_ENCRYPTION_KEY || crypto.randomBytes(32);

/**
 * Encrypt API key for secure storage
 */
function encryptApiKey(apiKey: string): { encryptedKey: string; iv: string; authTag: string } {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher(ENCRYPTION_ALGORITHM, ENCRYPTION_KEY);
  cipher.setAutoPadding(true);
  
  let encryptedKey = cipher.update(apiKey, 'utf8', 'hex');
  encryptedKey += cipher.final('hex');
  
  const authTag = cipher.getAuthTag().toString('hex');
  
  return {
    encryptedKey,
    iv: iv.toString('hex'),
    authTag,
  };
}

/**
 * GET /api/settings/integrations/[id]
 * Get specific integration details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // 3. Get workspace ID from header
    const requestedWorkspaceId = request.headers.get("x-workspace-id");

    if (!requestedWorkspaceId) {
      return NextResponse.json(
        { error: "workspaceId header is required" },
        { status: 400 }
      );
    }

    // 4. Validate user has access to workspace
    const membership = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, requestedWorkspaceId),
        eq(workspaceMembers.userId, user.id),
        eq(workspaceMembers.isActive, true)
      ),
    });

    if (!membership) {
      console.warn(
        `[SECURITY] User ${clerkUserId} attempted to access workspace ${requestedWorkspaceId} integration without permission`
      );
      return NextResponse.json(
        { error: "Access denied to workspace" },
        { status: 403 }
      );
    }

    // 5. Get specific API key
    const apiKey = await db.query.workspaceApiKeys.findFirst({
      where: and(
        eq(workspaceApiKeys.id, params.id),
        eq(workspaceApiKeys.workspaceId, requestedWorkspaceId)
      ),
      columns: {
        id: true,
        provider: true,
        name: true,
        isActive: true,
        lastUsedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!apiKey) {
      return NextResponse.json(
        { error: "Integration not found" },
        { status: 404 }
      );
    }

    // 6. Return integration details (without sensitive data)
    return NextResponse.json({
      ...apiKey,
      hasKey: true,
      keyPreview: `***${apiKey.id.slice(-4)}`,
      createdAt: apiKey.createdAt.toISOString(),
      updatedAt: apiKey.updatedAt.toISOString(),
      lastUsedAt: apiKey.lastUsedAt?.toISOString() || null,
    });
  } catch (error: any) {
    console.error("Integration fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch integration", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/settings/integrations/[id]
 * Update existing API key integration
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // 3. Get workspace ID from header
    const requestedWorkspaceId = request.headers.get("x-workspace-id");

    if (!requestedWorkspaceId) {
      return NextResponse.json(
        { error: "workspaceId header is required" },
        { status: 400 }
      );
    }

    // 4. Validate user has admin/owner access to workspace
    const membership = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, requestedWorkspaceId),
        eq(workspaceMembers.userId, user.id),
        eq(workspaceMembers.isActive, true)
      ),
    });

    if (!membership) {
      console.warn(
        `[SECURITY] User ${clerkUserId} attempted to update integration in workspace ${requestedWorkspaceId} without permission`
      );
      return NextResponse.json(
        { error: "Access denied to workspace" },
        { status: 403 }
      );
    }

    // Check if user has permission to manage integrations
    if (!["owner", "admin"].includes(membership.role)) {
      return NextResponse.json(
        { error: "Insufficient permissions to manage integrations" },
        { status: 403 }
      );
    }

    // 5. Verify integration exists and belongs to workspace
    const existingApiKey = await db.query.workspaceApiKeys.findFirst({
      where: and(
        eq(workspaceApiKeys.id, params.id),
        eq(workspaceApiKeys.workspaceId, requestedWorkspaceId)
      ),
    });

    if (!existingApiKey) {
      return NextResponse.json(
        { error: "Integration not found" },
        { status: 404 }
      );
    }

    // 6. Parse and validate request body
    const body = await request.json();
    const { name, apiKey, isActive } = body;

    // 7. Prepare update data
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (name !== undefined) {
      if (!name?.trim()) {
        return NextResponse.json(
          { error: "Integration name cannot be empty" },
          { status: 400 }
        );
      }
      updateData.name = name.trim();
    }

    if (apiKey !== undefined) {
      if (!apiKey?.trim()) {
        return NextResponse.json(
          { error: "API key cannot be empty" },
          { status: 400 }
        );
      }
      
      // Encrypt new API key
      const encrypted = encryptApiKey(apiKey.trim());
      updateData.encryptedKey = encrypted.encryptedKey;
      updateData.iv = encrypted.iv;
      updateData.authTag = encrypted.authTag;
    }

    if (isActive !== undefined) {
      updateData.isActive = Boolean(isActive);
    }

    // 8. Update API key
    const [updatedApiKey] = await db
      .update(workspaceApiKeys)
      .set(updateData)
      .where(and(
        eq(workspaceApiKeys.id, params.id),
        eq(workspaceApiKeys.workspaceId, requestedWorkspaceId)
      ))
      .returning({
        id: workspaceApiKeys.id,
        provider: workspaceApiKeys.provider,
        name: workspaceApiKeys.name,
        isActive: workspaceApiKeys.isActive,
        lastUsedAt: workspaceApiKeys.lastUsedAt,
        createdAt: workspaceApiKeys.createdAt,
        updatedAt: workspaceApiKeys.updatedAt,
      });

    // 9. Return updated integration (without sensitive data)
    return NextResponse.json({
      ...updatedApiKey,
      hasKey: true,
      keyPreview: `***${updatedApiKey.id.slice(-4)}`,
      createdAt: updatedApiKey.createdAt.toISOString(),
      updatedAt: updatedApiKey.updatedAt.toISOString(),
      lastUsedAt: updatedApiKey.lastUsedAt?.toISOString() || null,
    });
  } catch (error: any) {
    console.error("Integration update error:", error);
    return NextResponse.json(
      { error: "Failed to update integration", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/settings/integrations/[id]
 * Remove API key integration
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // 3. Get workspace ID from header
    const requestedWorkspaceId = request.headers.get("x-workspace-id");

    if (!requestedWorkspaceId) {
      return NextResponse.json(
        { error: "workspaceId header is required" },
        { status: 400 }
      );
    }

    // 4. Validate user has admin/owner access to workspace
    const membership = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, requestedWorkspaceId),
        eq(workspaceMembers.userId, user.id),
        eq(workspaceMembers.isActive, true)
      ),
    });

    if (!membership) {
      console.warn(
        `[SECURITY] User ${clerkUserId} attempted to delete integration in workspace ${requestedWorkspaceId} without permission`
      );
      return NextResponse.json(
        { error: "Access denied to workspace" },
        { status: 403 }
      );
    }

    // Check if user has permission to manage integrations
    if (!["owner", "admin"].includes(membership.role)) {
      return NextResponse.json(
        { error: "Insufficient permissions to manage integrations" },
        { status: 403 }
      );
    }

    // 5. Verify integration exists and belongs to workspace
    const existingApiKey = await db.query.workspaceApiKeys.findFirst({
      where: and(
        eq(workspaceApiKeys.id, params.id),
        eq(workspaceApiKeys.workspaceId, requestedWorkspaceId)
      ),
    });

    if (!existingApiKey) {
      return NextResponse.json(
        { error: "Integration not found" },
        { status: 404 }
      );
    }

    // 6. Delete API key
    await db
      .delete(workspaceApiKeys)
      .where(and(
        eq(workspaceApiKeys.id, params.id),
        eq(workspaceApiKeys.workspaceId, requestedWorkspaceId)
      ));

    // 7. Return success response
    return NextResponse.json({
      message: "Integration deleted successfully",
      id: params.id,
      provider: existingApiKey.provider,
    });
  } catch (error: any) {
    console.error("Integration deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete integration", details: error.message },
      { status: 500 }
    );
  }
}