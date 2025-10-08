/**
 * RequireWorkspace HOC
 * Route guard component that ensures user has a workspace selected
 * Redirects to onboarding if no workspace is available
 */

'use client';

import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkspace } from '@/hooks/useWorkspace';
import { colors, spacing, typography } from '@/lib/constants/design-system';

interface RequireWorkspaceProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

export const RequireWorkspace: React.FC<RequireWorkspaceProps> = ({
  children,
  fallback,
  redirectTo = '/onboarding',
}) => {
  const { workspaceId, workspace, isLoading, error } = useWorkspace();
  const router = useRouter();

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) {
      return;
    }

    // Redirect if no workspace is available
    if (!workspaceId && !error) {
      console.log('🚨 No workspace found, redirecting to onboarding');
      router.push(redirectTo);
    }
  }, [workspaceId, isLoading, error, router, redirectTo]);

  // Show loading state
  if (isLoading) {
    return (
      fallback || (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px',
            flexDirection: 'column',
            gap: spacing.md,
            color: colors.text.secondary,
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              border: `3px solid ${colors.background.tertiary}`,
              borderTop: `3px solid ${colors.primary}`,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
          <div style={{ fontSize: typography.sizes.sm }}>
            Loading workspace...
          </div>
        </div>
      )
    );
  }

  // Show error state
  if (error && !workspaceId) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px',
          flexDirection: 'column',
          gap: spacing.md,
          color: colors.danger,
          textAlign: 'center',
          padding: spacing.lg,
        }}
      >
        <div style={{ fontSize: '48px' }}>⚠️</div>
        <div>
          <h2 style={{ fontSize: typography.sizes.xl, margin: 0, marginBottom: spacing.sm }}>
            Workspace Error
          </h2>
          <p style={{ fontSize: typography.sizes.sm, margin: 0, color: colors.text.secondary }}>
            {error}
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push(redirectTo)}
          style={{
            padding: `${spacing.sm} ${spacing.lg}`,
            backgroundColor: colors.primary,
            color: colors.background.primary,
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: typography.sizes.sm,
            fontWeight: typography.weights.medium,
          }}
        >
          Go to Onboarding
        </button>
      </div>
    );
  }

  // Don't render children if no workspace (will redirect)
  if (!workspaceId || !workspace) {
    return null;
  }

  // Render children with workspace context
  return <>{children}</>;
};

/**
 * Higher-order component version
 */
export function withRequireWorkspace<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    fallback?: ReactNode;
    redirectTo?: string;
  }
) {
  const WrappedComponent = (props: P) => (
    <RequireWorkspace 
      fallback={options?.fallback}
      redirectTo={options?.redirectTo}
    >
      <Component {...props} />
    </RequireWorkspace>
  );

  WrappedComponent.displayName = `withRequireWorkspace(${Component.displayName || Component.name})`;

  return WrappedComponent;
}