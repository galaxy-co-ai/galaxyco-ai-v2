"use client";

import { useEffect, useState } from "react";
import { useWorkspace } from "@/contexts/workspace-context";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, RefreshCw, Settings, HelpCircle } from "lucide-react";
import Link from "next/link";

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
      <div className="flex h-full items-center justify-center p-8">
        <Card className="max-w-md p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
          <h2 className="mb-2 text-xl font-semibold">No Workspace Found</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            You don&apos;t have access to any workspaces yet. Contact your
            administrator or create a new workspace to get started.
          </p>
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => {
                refreshWorkspaces();
              }}
              className="w-full"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/settings/workspace">
                <Settings className="mr-2 h-4 w-4" />
                Workspace Settings
              </Link>
            </Button>
          </div>
          <div className="mt-6 rounded-lg bg-muted p-4 text-left">
            <p className="mb-2 text-xs font-medium text-foreground">
              For Developers:
            </p>
            <p className="text-xs text-muted-foreground">
              Run{" "}
              <code className="rounded bg-background px-1 py-0.5">
                pnpm db:seed
              </code>{" "}
              to create a test workspace, or ensure your Clerk user ID is linked
              to a workspace in the database.
            </p>
          </div>
        </Card>
      </div>
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
