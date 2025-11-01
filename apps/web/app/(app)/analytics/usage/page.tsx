'use client';

import { useState, useEffect } from 'react';
import { DetailPage } from '@/components/templates';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useWorkspace } from '@/contexts/workspace-context';
import { toast } from 'sonner';
import { Zap, FileText, Activity } from 'lucide-react';

interface UsageAnalytics {
  agents: { total: number; active: number };
  knowledge: { total: number; recent: number; period: string };
}

export default function UsageAnalyticsPage() {
  const { currentWorkspace } = useWorkspace();
  const [analytics, setAnalytics] = useState<UsageAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUsageAnalytics() {
      if (!currentWorkspace?.id) return;

      try {
        setIsLoading(true);
        const res = await fetch(`/api/analytics/usage?workspaceId=${currentWorkspace.id}`);

        if (!res.ok) throw new Error('Failed to fetch usage analytics');

        const data = await res.json();
        setAnalytics(data.analytics);
      } catch (error) {
        console.error('Failed to fetch usage analytics:', error);
        toast.error('Failed to load usage analytics');
      } finally {
        setIsLoading(false);
      }
    }

    fetchUsageAnalytics();
  }, [currentWorkspace?.id]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!analytics) {
    return (
      <DetailPage
        title="Platform Usage Analytics"
        subtitle="Agent activity and knowledge base metrics"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Analytics', href: '/analytics' },
          { label: 'Usage' },
        ]}
      >
        <div className="text-center text-muted-foreground">No usage data available</div>
      </DetailPage>
    );
  }

  const metrics = [
    {
      label: 'Total Agents',
      value: analytics.agents.total,
      change: `${analytics.agents.active} active`,
      trend: 'up' as const,
      icon: <Zap className="h-5 w-5" />,
    },
    {
      label: 'Knowledge Items',
      value: analytics.knowledge.total,
      change: `${analytics.knowledge.recent} recent`,
      trend: 'up' as const,
      icon: <FileText className="h-5 w-5" />,
    },
    {
      label: 'Active Agents',
      value: analytics.agents.active,
      change: `${Math.round((analytics.agents.active / analytics.agents.total) * 100)}% of total`,
      trend: 'up' as const,
      icon: <Activity className="h-5 w-5" />,
    },
  ];

  return (
    <DetailPage
      title="Platform Usage Analytics"
      subtitle="Agent activity and knowledge base metrics"
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Analytics', href: '/analytics' },
        { label: 'Usage' },
      ]}
      metrics={metrics}
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">AI Agents</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Total Agents</p>
                <p className="text-2xl font-bold">{analytics.agents.total}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Active Agents</p>
                <p className="text-2xl font-bold text-success">{analytics.agents.active}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Inactive Agents</p>
                <p className="text-2xl font-bold text-muted-foreground">
                  {analytics.agents.total - analytics.agents.active}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Knowledge Base</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{analytics.knowledge.total}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Recent (Last {analytics.knowledge.period})
                </p>
                <p className="text-2xl font-bold text-primary">{analytics.knowledge.recent}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Older Items</p>
                <p className="text-2xl font-bold text-muted-foreground">
                  {analytics.knowledge.total - analytics.knowledge.recent}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Platform Activity</h3>
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium">Agent Activation Rate</p>
                <p className="text-sm font-semibold">
                  {Math.round((analytics.agents.active / analytics.agents.total) * 100)}%
                </p>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{
                    width: `${Math.round((analytics.agents.active / analytics.agents.total) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium">Recent Knowledge Growth</p>
                <p className="text-sm font-semibold">
                  {Math.round((analytics.knowledge.recent / analytics.knowledge.total) * 100)}%
                </p>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-success transition-all duration-300"
                  style={{
                    width: `${Math.round((analytics.knowledge.recent / analytics.knowledge.total) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DetailPage>
  );
}
