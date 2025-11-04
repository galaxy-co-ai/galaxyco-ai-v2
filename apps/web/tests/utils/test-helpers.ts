/**
 * Test Utilities for API Routes and Server Actions
 *
 * Provides helpers for:
 * - Mocking authentication
 * - Creating test data
 * - Making authenticated requests
 * - Database setup/teardown
 */

import { db } from '@galaxyco/database';
import { users, workspaces, workspaceMembers, agents } from '@galaxyco/database/schema';
import { eq } from 'drizzle-orm';
import { vi } from 'vitest';

/**
 * Mock Clerk authentication
 * Call this in tests to mock Clerk's auth() function
 */
export function mockClerkAuth(clerkUserId: string | null = 'test-clerk-user-123') {
  vi.mock('@clerk/nextjs/server', () => ({
    auth: vi.fn(() => Promise.resolve({ userId: clerkUserId })),
    currentUser: vi.fn(() =>
      Promise.resolve(
        clerkUserId
          ? {
              id: clerkUserId,
              emailAddresses: [{ emailAddress: 'test@example.com' }],
              firstName: 'Test',
              lastName: 'User',
              imageUrl: null,
            }
          : null,
      ),
    ),
  }));
}

/**
 * Reset Clerk auth mocks
 */
export function resetClerkAuth() {
  vi.resetModules();
}

/**
 * Mock Clerk authentication headers
 * Note: API routes use cookies, not headers, but this is useful for documentation
 */
export function createMockAuthHeaders(clerkUserId: string = 'test-clerk-user-123'): HeadersInit {
  return {
    'Content-Type': 'application/json',
    // Note: In real tests, Clerk cookies would be set by Playwright
    // This is for unit/integration tests that mock the auth
  };
}

/**
 * Create test user in database
 */
export async function createTestUser(overrides?: Partial<typeof users.$inferInsert>) {
  const [user] = await db
    .insert(users)
    .values({
      clerkUserId: `test-clerk-${Date.now()}`,
      email: `test-${Date.now()}@example.com`,
      firstName: 'Test',
      lastName: 'User',
      ...overrides,
    })
    .returning();

  return user;
}

/**
 * Create test workspace in database
 */
export async function createTestWorkspace(
  userId: string,
  overrides?: Partial<typeof workspaces.$inferInsert>,
) {
  const [workspace] = await db
    .insert(workspaces)
    .values({
      name: `Test Workspace ${Date.now()}`,
      slug: `test-workspace-${Date.now()}`,
      subscriptionTier: 'free',
      subscriptionStatus: 'active',
      isActive: true,
      ...overrides,
    })
    .returning();

  // Add user as workspace owner
  await db.insert(workspaceMembers).values({
    workspaceId: workspace.id,
    userId: userId,
    role: 'owner',
    isActive: true,
    permissions: {
      agents: { create: true, edit: true, delete: true, execute: true },
      packs: { install: true, uninstall: true },
      billing: { view: true, manage: true },
      members: { invite: true, remove: true, changeRole: true },
    },
  });

  return workspace;
}

/**
 * Create test agent in database
 */
export async function createTestAgent(
  workspaceId: string,
  userId: string,
  overrides?: Partial<typeof agents.$inferInsert>,
) {
  const [agent] = await db
    .insert(agents)
    .values({
      workspaceId,
      name: `Test Agent ${Date.now()}`,
      description: 'Test agent description',
      type: 'custom',
      status: 'draft',
      config: {},
      isCustom: true,
      createdBy: userId,
      version: '1.0.0',
      ...overrides,
    })
    .returning();

  return agent;
}

/**
 * Cleanup test data
 */
export async function cleanupTestData(ids: {
  userIds?: string[];
  workspaceIds?: string[];
  agentIds?: string[];
}) {
  if (ids.agentIds?.length) {
    await db.delete(agents).where(eq(agents.id, ids.agentIds[0]));
  }
  if (ids.workspaceIds?.length) {
    await db.delete(workspaceMembers).where(eq(workspaceMembers.workspaceId, ids.workspaceIds[0]));
    await db.delete(workspaces).where(eq(workspaces.id, ids.workspaceIds[0]));
  }
  if (ids.userIds?.length) {
    await db.delete(users).where(eq(users.id, ids.userIds[0]));
  }
}

/**
 * Make authenticated API request
 * Note: For integration tests, we need to mock Clerk auth at the module level
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit & { workspaceId?: string } = {},
) {
  const { workspaceId, ...fetchOptions } = options;

  return fetch(url, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(workspaceId && { 'x-workspace-id': workspaceId }),
      ...fetchOptions.headers,
    },
    credentials: 'include', // Include cookies for Clerk auth
  });
}

/**
 * Wait for async operation to complete
 */
export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Create form data for server actions
 */
export function createFormData(data: Record<string, string>): FormData {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });
  return formData;
}

/**
 * Setup test environment with authenticated user and workspace
 * Returns cleanup function
 */
export async function setupTestEnvironment() {
  const user = await createTestUser();
  const workspace = await createTestWorkspace(user.id);

  // Mock Clerk auth to return the test user's clerkUserId
  mockClerkAuth(user.clerkUserId);

  return {
    user,
    workspace,
    clerkUserId: user.clerkUserId,
    cleanup: async () => {
      await cleanupTestData({
        userIds: [user.id],
        workspaceIds: [workspace.id],
      });
      resetClerkAuth();
    },
  };
}
