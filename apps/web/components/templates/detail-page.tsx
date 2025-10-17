"use client";

import React, { useState } from "react";
import { PageShell, PageShellProps } from "./page-shell";
import { Card } from "@/components/ui/card";

export interface MetricCard {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
}

export interface TabConfig {
  id: string;
  label: string;
  content: React.ReactNode;
  badge?: string | number;
}

export interface DetailPageProps extends Omit<PageShellProps, "children"> {
  /** Metric cards to display */
  metrics?: MetricCard[];
  /** Tab configuration */
  tabs?: TabConfig[];
  /** Default active tab */
  defaultTab?: string;
  /** Active tab (controlled) */
  activeTab?: string;
  /** Tab change handler */
  onTabChange?: (tabId: string) => void;
  /** Content when no tabs (simple detail page) */
  children?: React.ReactNode;
}

/**
 * DetailPage - Template for detail/show views
 *
 * Features:
 * - Metric cards row
 * - Tabbed navigation
 * - Consistent layout
 * - All PageShell features (breadcrumbs, loading, error states)
 *
 * @example
 * ```tsx
 * <DetailPage
 *   title="Agent Name"
 *   subtitle="Last active 2 hours ago"
 *   breadcrumbs={[
 *     { label: 'Dashboard', href: '/' },
 *     { label: 'Agents', href: '/agents' },
 *     { label: 'Agent Name' }
 *   ]}
 *   actions={<Button>Edit</Button>}
 *   metrics={[
 *     { label: 'Total Runs', value: 1234, icon: <Play /> },
 *     { label: 'Success Rate', value: '98%', trend: 'up' }
 *   ]}
 *   tabs={[
 *     { id: 'overview', label: 'Overview', content: <Overview /> },
 *     { id: 'activity', label: 'Activity', content: <ActivityFeed /> }
 *   ]}
 * />
 * ```
 */
export function DetailPage({
  metrics = [],
  tabs = [],
  defaultTab,
  activeTab: controlledActiveTab,
  onTabChange,
  children,
  ...pageShellProps
}: DetailPageProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(
    defaultTab || tabs[0]?.id || "",
  );

  const activeTab = controlledActiveTab ?? internalActiveTab;

  const handleTabChange = (tabId: string) => {
    if (!controlledActiveTab) {
      setInternalActiveTab(tabId);
    }
    onTabChange?.(tabId);
  };

  return (
    <PageShell {...pageShellProps}>
      {/* Metrics Cards */}
      {metrics.length > 0 && (
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {metric.label}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-foreground">
                    {metric.value}
                  </p>
                  {metric.change && (
                    <p
                      className={`mt-1 text-sm ${
                        metric.trend === "up"
                          ? "text-success"
                          : metric.trend === "down"
                            ? "text-destructive"
                            : "text-muted-foreground"
                      }`}
                    >
                      {metric.change}
                    </p>
                  )}
                </div>
                {metric.icon && (
                  <div className="rounded-lg bg-primary/10 p-3 text-primary">
                    {metric.icon}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tabs */}
      {tabs.length > 0 ? (
        <div>
          {/* Tab List */}
          <div className="border-b border-border">
            <div className="flex space-x-8" role="tablist">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`relative pb-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {tab.label}
                    {tab.badge !== undefined && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                        {tab.badge}
                      </span>
                    )}
                  </span>
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                role="tabpanel"
                hidden={activeTab !== tab.id}
                className={activeTab === tab.id ? "block" : "hidden"}
              >
                {tab.content}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Simple content (no tabs) */
        children
      )}
    </PageShell>
  );
}
