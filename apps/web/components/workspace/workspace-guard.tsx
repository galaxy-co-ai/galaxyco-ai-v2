"use client";

import { useEffect, useState } from "react";
import { useWorkspace } from "@/contexts/workspace-context";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AlertCircle,
  RefreshCw,
  Settings,
  HelpCircle,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { CreateWorkspaceModal } from "./create-workspace-modal";

interface WorkspaceGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * WorkspaceGuard - Ensures workspace is loaded before rendering children
 *
 * Handles 4 states:
 * 1. Loading - Show spinner (with 10s timeout)
 * 2. No workspace - Show "Create Workspace" prompt
 * 3. Error - Show error message with retry button
 * 4. Success - Render children
 *
 * Usage:
 * ```tsx
 * export default function MyPage() {
 *   return (
 *     <WorkspaceGuard>
 *       <MyPageContent />
 *     </WorkspaceGuard>
 *   );
 * }
 * ```
 */
export function WorkspaceGuard({ children, fallback }: WorkspaceGuardProps) {
  const { currentWorkspace, workspaces, isLoading, refreshWorkspaces } =
    useWorkspace();
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Timeout mechanism - max 10 seconds loading
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setLoadingTimeout(true);
      }, 10000);

      return () => clearTimeout(timer);
    } else {
      setLoadingTimeout(false);
    }
  }, [isLoading]);

  // State: Loading with timeout
  if (isLoading && !loadingTimeout) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
        <Spinner className="h-8 w-8" />
        <p className="text-sm text-muted-foreground">Loading workspace...</p>
      </div>
    );
  }

  // State: Loading timeout
  if (isLoading && loadingTimeout) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Card className="max-w-md p-8 text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-warning" />
          <h2 className="mb-2 text-xl font-semibold">
            Taking longer than expected
          </h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Loading your workspace is taking longer than usual. This could be a
            network issue.
          </p>
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => {
                setLoadingTimeout(false);
                refreshWorkspaces();
              }}
              className="w-full"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                Go to Settings
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // State: No workspaces available
  if (!isLoading && workspaces.length === 0) {
    return (
      <>
        <div className="flex h-full items-center justify-center p-8">
          <Card className="max-w-md p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <HelpCircle className="h-8 w-8 text-primary" />
            </div>
            <h2 className="mb-2 text-xl font-semibold">Welcome to GalaxyCo!</h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Let&apos;s get you started by creating your first workspace. A
              workspace is where you&apos;ll manage your agents, data, and team.
            </p>
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => setShowCreateModal(true)}
                className="w-full"
                size="lg"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Workspace
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  refreshWorkspaces();
                }}
                className="w-full"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </Card>
        </div>
        <CreateWorkspaceModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => refreshWorkspaces()}
        />
      </>
    );
  }

  // State: Workspace exists but currentWorkspace is null (edge case)
  if (!isLoading && workspaces.length > 0 && !currentWorkspace) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Card className="max-w-md p-8 text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
          <h2 className="mb-2 text-xl font-semibold">Workspace Error</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Unable to select a workspace. This shouldn&apos;t happen.
          </p>
          <Button
            onClick={() => {
              window.location.reload();
            }}
            className="w-full"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reload Page
          </Button>
        </Card>
      </div>
    );
  }

  // State: Success - render children
  if (currentWorkspace) {
    return <>{children}</>;
  }

  // Fallback for any unexpected state
  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="flex h-full items-center justify-center">
      <Spinner />
    </div>
  );
}
