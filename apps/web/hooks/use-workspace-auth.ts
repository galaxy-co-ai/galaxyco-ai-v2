"use client";

import { useAuth } from "@clerk/nextjs";
import { useWorkspace } from "@/hooks/useWorkspace";

/**
 * Hook to get authentication headers for API calls
 * Integrates Clerk token with workspace context
 */
export function useWorkspaceAuth() {
  const { userId, getToken, isLoaded, isSignedIn } = useAuth();
  const { workspace } = useWorkspace();

  async function getAuthHeaders(): Promise<HeadersInit> {
    if (!isLoaded || !isSignedIn) {
      throw new Error("User not authenticated");
    }

    if (!workspace?.id) {
      throw new Error("No workspace selected");
    }

    const token = await getToken();

    if (!token) {
      throw new Error("Failed to get authentication token");
    }

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "x-workspace-id": workspace.id,
    };
  }

  return {
    getAuthHeaders,
    userId,
    workspace,
    isAuthenticated: isLoaded && isSignedIn && !!workspace?.id,
  };
}
