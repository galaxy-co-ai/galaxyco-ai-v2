'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCcw, Home, Mail } from 'lucide-react';
import Link from 'next/link';
import { logger } from '@/lib/utils/logger';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service
    logger.error('Global error', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="mx-auto h-24 w-24 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
        <p className="text-lg text-muted-foreground mb-8">
          We&apos;re sorry, but something unexpected happened. Our team has been notified and
          we&apos;re working on it.
        </p>

        {/* Error Details (Development only) */}
        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mb-8 p-4 bg-muted rounded-lg text-left max-w-lg mx-auto">
            <p className="text-sm font-mono text-destructive break-all">{error.message}</p>
            {error.digest && (
              <p className="text-xs text-muted-foreground mt-2">Error ID: {error.digest}</p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center mb-8">
          <Button onClick={reset} className="gap-2">
            <RefreshCcw className="h-4 w-4" />
            Try Again
          </Button>
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </Link>
        </div>

        {/* Help Section */}
        <div className="p-6 bg-muted rounded-lg max-w-md mx-auto">
          <h3 className="font-semibold mb-2">Need Help?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            If this problem persists, please contact our support team.
          </p>
          <Link href="/support">
            <Button variant="outline" size="sm" className="gap-2">
              <Mail className="h-4 w-4" />
              Contact Support
            </Button>
          </Link>
        </div>

        {/* Additional Info */}
        <p className="mt-8 text-xs text-muted-foreground">
          Error reference: {error.digest || 'N/A'}
        </p>
      </div>
    </div>
  );
}
