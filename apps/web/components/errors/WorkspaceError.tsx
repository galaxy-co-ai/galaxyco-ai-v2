import { AlertCircle, RefreshCw, PlusCircle, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface WorkspaceError {
  message: string;
  code: 'FETCH_FAILED' | 'NO_WORKSPACES' | 'NETWORK_ERROR';
  retryable: boolean;
}

interface WorkspaceErrorProps {
  error: WorkspaceError;
  onRetry: () => void;
}

export function WorkspaceError({ error, onRetry }: WorkspaceErrorProps) {
  const errorMessages = {
    FETCH_FAILED:
      "We're having trouble loading your workspaces. Our servers may be experiencing issues.",
    NO_WORKSPACES: "You don't have any workspaces yet. Create your first workspace to get started.",
    NETWORK_ERROR: 'Unable to connect. Please check your internet connection and try again.',
  };

  const message = errorMessages[error.code] || error.message;

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="rounded-lg border bg-card shadow-sm">
          <div className="flex flex-col items-center space-y-4 p-6 text-center">
            {/* Error Icon */}
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>

            {/* Error Title */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">
                {error.code === 'NO_WORKSPACES' ? 'No Workspaces Found' : 'Connection Error'}
              </h2>
              <p className="text-sm text-muted-foreground">{message}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex w-full flex-col gap-2 pt-2">
              {error.retryable && (
                <Button onClick={onRetry} className="w-full" aria-label="Retry loading workspaces">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              )}

              {error.code === 'NO_WORKSPACES' && (
                <Button
                  asChild
                  variant="default"
                  className="w-full"
                  aria-label="Create new workspace"
                >
                  <Link href="/onboarding">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Workspace
                  </Link>
                </Button>
              )}

              {error.code !== 'NO_WORKSPACES' && (
                <Button asChild variant="outline" className="w-full" aria-label="Get help">
                  <Link href="/support">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Get Help
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <p className="mt-4 text-center text-xs text-muted-foreground">
          If the problem persists, please{' '}
          <Link href="/support" className="underline hover:text-foreground">
            contact support
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
