import React from "react";
import { Breadcrumb } from "@/components/organisms/breadcrumb";
import { DashboardHeader } from "@/components/organisms/dashboard-header";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

export interface PageShellProps {
  children: React.ReactNode;
  /** Page title */
  title?: string;
  /** Page subtitle/description */
  subtitle?: string;
  /** Breadcrumb items */
  breadcrumbs?: Array<{ label: string; href?: string }>;
  /** Action buttons for header */
  actions?: React.ReactNode;
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  error?: Error | null;
  /** Empty state (shown when no content) */
  isEmpty?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Empty state action */
  emptyAction?: React.ReactNode;
  /** Custom className for content area */
  contentClassName?: string;
  /** Max width constraint (default: 7xl) */
  maxWidth?: "full" | "7xl" | "6xl" | "5xl" | "4xl";
}

/**
 * PageShell - Foundation template for all pages
 *
 * Provides consistent layout with:
 * - Breadcrumb navigation
 * - Page header with title, subtitle, actions
 * - Loading states
 * - Error boundaries
 * - Empty states
 *
 * @example
 * ```tsx
 * <PageShell
 *   title="Agents"
 *   subtitle="Manage your AI agents"
 *   breadcrumbs={[
 *     { label: 'Dashboard', href: '/dashboard' },
 *     { label: 'Agents' }
 *   ]}
 *   actions={<Button>Create Agent</Button>}
 *   isLoading={isLoading}
 * >
 *   {content}
 * </PageShell>
 * ```
 */
export function PageShell({
  children,
  title,
  subtitle,
  breadcrumbs,
  actions,
  isLoading = false,
  error = null,
  isEmpty = false,
  emptyMessage = "No data available",
  emptyAction,
  contentClassName = "",
  maxWidth = "7xl",
}: PageShellProps) {
  const maxWidthClass = {
    full: "max-w-full",
    "7xl": "max-w-7xl",
    "6xl": "max-w-6xl",
    "5xl": "max-w-5xl",
    "4xl": "max-w-4xl",
  }[maxWidth];

  return (
    <div className="min-h-screen bg-background">
      <div className={`mx-auto ${maxWidthClass} px-4 py-6 sm:px-6 lg:px-8`}>
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="mb-4">
            <Breadcrumb
              items={breadcrumbs.map((item) => ({
                label: item.label,
                href: item.href,
              }))}
            />
          </div>
        )}

        {/* Page Header */}
        {(title || subtitle || actions) && (
          <div className="mb-6">
            <DashboardHeader
              title={title || ""}
              subtitle={subtitle}
              actions={actions}
            />
          </div>
        )}

        {/* Content Area */}
        <div className={contentClassName}>
          {/* Loading State */}
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          )}

          {/* Error State */}
          {!isLoading && error && (
            <div className="rounded-lg border border-destructive bg-destructive/10 p-8 text-center">
              <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Something went wrong
              </h3>
              <p className="text-sm text-muted-foreground">
                {error.message || "An unexpected error occurred"}
              </p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && isEmpty && (
            <div className="rounded-lg border border-border bg-card p-12 text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <svg
                  className="h-8 w-8 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {emptyMessage}
              </h3>
              {emptyAction && <div className="mt-4">{emptyAction}</div>}
            </div>
          )}

          {/* Main Content */}
          {!isLoading && !error && !isEmpty && children}
        </div>
      </div>
    </div>
  );
}
