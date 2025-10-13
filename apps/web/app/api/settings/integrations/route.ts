import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@galaxyco/database";
import { 
  workspaceApiKeys, 
  workspaceMembers, 
  users 
} from "@galaxyco/database/schema";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import crypto from "crypto";

/**
 * Integrations Settings API Route
 * 
 * GET: List workspace integrations and API key status
 * POST: Add new API key integration
 * PUT: Update existing API key integration
 * DELETE: Remove API key integration
 * 
 * Handles encrypted API keys for AI providers like OpenAI, Anthropic, Google, etc.
 * Only workspace owners and admins can manage integrations.
 */

// Encryption configuration
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
 * Decrypt API key for use
 */
function decryptApiKey(encryptedKey: string, iv: string, authTag: string): string {
  const decipher = crypto.createDecipher(ENCRYPTION_ALGORITHM, ENCRYPTION_KEY);
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));
  decipher.setAutoPadding(true);
  
  let decrypted = decipher.update(encryptedKey, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * GET /api/settings/integrations
 * List workspace integrations and API key status
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
        `[SECURITY] User ${clerkUserId} attempted to access workspace ${requestedWorkspaceId} integrations without permission`
      );
      return NextResponse.json(
        { error: "Access denied to workspace" },
        { status: 403 }
      );
    }

    // 5. Get API keys for workspace (excluding sensitive data)
    const apiKeys = await db.query.workspaceApiKeys.findMany({
      where: eq(workspaceApiKeys.workspaceId, requestedWorkspaceId),
      columns: {
        id: true,
        provider: true,
        name: true,
        isActive: true,
        lastUsedAt: true,
        createdAt: true,
        updatedAt: true,
        // Exclude encrypted key, iv, and authTag for security
      },
    });

    // 6. Return integration status
    const integrations = apiKeys.map(key => ({
      ...key,
      hasKey: true, // We know there's a key since the record exists
      keyPreview: `***${key.id.slice(-4)}`, // Show last 4 chars of ID as preview
      createdAt: key.createdAt.toISOString(),
      updatedAt: key.updatedAt.toISOString(),
      lastUsedAt: key.lastUsedAt?.toISOString() || null,
    }));

    return NextResponse.json({
      integrations,
      availableProviders: [
        "openai",
        "anthropic", 
        "google",
        "custom"
      ],
    });
  } catch (error: any) {
    console.error("Integrations fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch integrations", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/settings/integrations
 * Add new API key integration
 */
export async function POST(request: NextRequest) {
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
        `[SECURITY] User ${clerkUserId} attempted to add integration to workspace ${requestedWorkspaceId} without permission`
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

    // 5. Parse and validate request body
    const body = await request.json();
    const { provider, name, apiKey } = body;

    if (!provider?.trim()) {
      return NextResponse.json(
        { error: "Provider is required" },
        { status: 400 }
      );
    }

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Integration name is required" },
        { status: 400 }
      );
    }

    if (!apiKey?.trim()) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 400 }
      );
    }

    // 6. Check if integration for this provider already exists
    const existingKey = await db.query.workspaceApiKeys.findFirst({
      where: and(
        eq(workspaceApiKeys.workspaceId, requestedWorkspaceId),
        eq(workspaceApiKeys.provider, provider.trim().toLowerCase())
      ),
    });

    if (existingKey) {
      return NextResponse.json(
        { error: `Integration for ${provider} already exists. Use PUT to update.` },
        { status: 409 }
      );
    }

    // 7. Encrypt API key
    const { encryptedKey, iv, authTag } = encryptApiKey(apiKey.trim());

    // 8. Create new API key record
    const apiKeyId = nanoid();
    const now = new Date();

    const [newApiKey] = await db
      .insert(workspaceApiKeys)
      .values({
        id: apiKeyId,
        workspaceId: requestedWorkspaceId,
        provider: provider.trim().toLowerCase(),
        name: name.trim(),
        encryptedKey,
        iv,
        authTag,
        isActive: true,
        createdBy: user.id,
        createdAt: now,
        updatedAt: now,
      })
      .returning({
        id: workspaceApiKeys.id,
        provider: workspaceApiKeys.provider,
        name: workspaceApiKeys.name,
        isActive: workspaceApiKeys.isActive,
        createdAt: workspaceApiKeys.createdAt,
        updatedAt: workspaceApiKeys.updatedAt,
      });

    // 9. Return created integration (without sensitive data)
    return NextResponse.json({
      ...newApiKey,
      hasKey: true,
      keyPreview: `***${newApiKey.id.slice(-4)}`,
      createdAt: newApiKey.createdAt.toISOString(),
      updatedAt: newApiKey.updatedAt.toISOString(),
    }, { status: 201 });
  } catch (error: any) {
    console.error("Integration creation error:", error);
    return NextResponse.json(
      { error: "Failed to create integration", details: error.message },
      { status: 500 }
    );
  }
}