"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { logger } from "@/lib/utils/logger";

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  role: string;
}

interface WorkspaceContextType {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  isLoading: boolean;
  switchWorkspace: (workspaceId: string) => void;
  refreshWorkspaces: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined,
);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useUser();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  const fetchWorkspaces = async () => {
    console.group("🏢 Workspace Context: Fetching workspaces");
    console.log("Timestamp:", new Date().toISOString());
    console.log("isSignedIn:", isSignedIn);

    if (!isSignedIn) {
      console.log("❌ User not signed in, clearing workspaces");
      setWorkspaces([]);
      setCurrentWorkspace(null);
      setIsLoading(false);
      console.groupEnd();
      return;
    }

    try {
      console.log("📡 Fetching from /api/workspaces...");
      const response = await fetch("/api/workspaces");
      console.log("Response status:", response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Workspaces fetched successfully:", data);
        console.log("Workspace count:", data.length);
        setWorkspaces(data);

        // Get saved workspace ID from cookie
        const savedWorkspaceId = getCookie("workspace-id");
        console.log("Saved workspace ID from cookie:", savedWorkspaceId);

        if (
          savedWorkspaceId &&
          data.find((w: Workspace) => w.id === savedWorkspaceId)
        ) {
          // Use saved workspace if it exists and user has access
          const workspace = data.find(
            (w: Workspace) => w.id === savedWorkspaceId,
          );
          console.log("✅ Using saved workspace:", workspace);
          setCurrentWorkspace(workspace);
        } else if (data.length > 0) {
          // Default to first workspace
          console.log("✅ Using first workspace as default:", data[0]);
          setCurrentWorkspace(data[0]);
          setCookie("workspace-id", data[0].id);
        } else {
          console.warn("⚠️ No workspaces available - user needs to create one");
          setCurrentWorkspace(null);
        }
      } else {
        console.error(
          "❌ Failed to fetch workspaces - HTTP error:",
          response.status,
        );
        const errorText = await response.text();
        console.error("Error response:", errorText);
      }
    } catch (error) {
      console.error("❌ Exception while fetching workspaces:", error);
      logger.error("Failed to fetch workspaces", {
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      console.log("Setting isLoading to false");
      setIsLoading(false);
      console.groupEnd();
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, [isSignedIn]);

  const switchWorkspace = (workspaceId: string) => {
    const workspace = workspaces.find((w) => w.id === workspaceId);
    if (workspace) {
      setCurrentWorkspace(workspace);
      setCookie("workspace-id", workspaceId);
      // Refresh the page to update all workspace-dependent data
      window.location.reload();
    }
  };

  const refreshWorkspaces = async () => {
    await fetchWorkspaces();
  };

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        currentWorkspace,
        isLoading,
        switchWorkspace,
        refreshWorkspaces,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}

// Cookie helpers
function setCookie(name: string, value: string, days: number = 30) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
