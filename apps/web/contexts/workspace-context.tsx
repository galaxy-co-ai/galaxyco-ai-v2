"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { logger } from "@/lib/utils/logger";

interface WorkspaceError {
  message: string;
  code: "FETCH_FAILED" | "NO_WORKSPACES" | "NETWORK_ERROR";
  retryable: boolean;
}

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
  error: WorkspaceError | null;
  switchWorkspace: (workspaceId: string) => void;
  refreshWorkspaces: () => Promise<void>;
  retryFetch: () => void;
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
  const [error, setError] = useState<WorkspaceError | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchWorkspaces = async () => {
    logger.info("Fetching workspaces", { isSignedIn, retryCount });

    if (!isSignedIn) {
      logger.info("User not signed in, clearing workspaces");
      setWorkspaces([]);
      setCurrentWorkspace(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    try {
      setError(null);
      const response = await fetch("/api/workspaces");
      logger.info("Workspaces API response", { status: response.status });

      if (response.ok) {
        const data = await response.json();
        logger.info("Workspaces fetched successfully", { count: data.length });
        setWorkspaces(data);
        setRetryCount(0);

        // Get saved workspace ID from cookie
        const savedWorkspaceId = getCookie("workspace-id");

        if (
          savedWorkspaceId &&
          data.find((w: Workspace) => w.id === savedWorkspaceId)
        ) {
          const workspace = data.find(
            (w: Workspace) => w.id === savedWorkspaceId,
          );
          logger.info("Using saved workspace", { workspaceId: workspace?.id });
          setCurrentWorkspace(workspace || null);
        } else if (data.length > 0) {
          logger.info("Using first workspace as default", {
            workspaceId: data[0].id,
          });
          setCurrentWorkspace(data[0]);
          setCookie("workspace-id", data[0].id);
        } else {
          logger.warn("No workspaces available - user needs to create one");
          setError({
            message:
              "No workspaces found. Create your first workspace to get started.",
            code: "NO_WORKSPACES",
            retryable: false,
          });
          setCurrentWorkspace(null);
        }
      } else {
        const errorText = await response.text();
        logger.error("Failed to fetch workspaces - HTTP error", {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        });

        const errorCode: WorkspaceError["code"] =
          response.status >= 500 ? "FETCH_FAILED" : "NETWORK_ERROR";

        setError({
          message: "Failed to load workspaces. Please try again.",
          code: errorCode,
          retryable: true,
        });

        // Auto-retry with exponential backoff
        if (retryCount < 3) {
          const delay = Math.pow(2, retryCount) * 1000;
          logger.info("Retrying workspace fetch", { retryCount, delay });
          setTimeout(() => {
            setRetryCount((prev) => prev + 1);
            fetchWorkspaces();
          }, delay);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      logger.error("Exception while fetching workspaces", {
        error: errorMessage,
      });

      setError({
        message: "Network error. Please check your connection.",
        code: "NETWORK_ERROR",
        retryable: true,
      });

      // Auto-retry with exponential backoff
      if (retryCount < 3) {
        const delay = Math.pow(2, retryCount) * 1000;
        logger.info("Retrying workspace fetch after error", {
          retryCount,
          delay,
        });
        setTimeout(() => {
          setRetryCount((prev) => prev + 1);
          fetchWorkspaces();
        }, delay);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setIsLoading(true);
    setRetryCount(0);
    await fetchWorkspaces();
  };

  const retryFetch = () => {
    setIsLoading(true);
    setRetryCount(0);
    setError(null);
    fetchWorkspaces();
  };

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        currentWorkspace,
        isLoading,
        error,
        switchWorkspace,
        refreshWorkspaces,
        retryFetch,
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
