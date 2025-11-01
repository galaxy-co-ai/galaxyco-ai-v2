'use client';

import { useState, useEffect } from 'react';
import { DetailPage } from '@/components/templates';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useWorkspace } from '@/contexts/workspace-context';
import { toast } from 'sonner';
import { Clock, CheckSquare, Users } from 'lucide-react';

interface TimeUsageAnalytics {
  tasks: { completed: number; period: string };
  distribution: {
    byPriority: Array<{ priority: string; count: number }>;
    byAssignee: Array<{ assignedTo: string; count: number }>;
  };
}

export default function TimeUsageAnalyticsPage() {
  const { currentWorkspace } = useWorkspace();
  const [analytics, setAnalytics] = useState<TimeUsageAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTimeUsageAnalytics() {
      if (!currentWorkspace?.id) return;

      try {
        setIsLoading(true);
        const res = await fetch(`/api/analytics/time-usage?workspaceId=${currentWorkspace.id}`);

        if (!res.ok) throw new Error('Failed to fetch time usage analytics');

        const data = await res.json();
        setAnalytics(data.analytics);
      } catch (error) {
        console.error('Failed to fetch time usage analytics:', error);
        toast.error('Failed to load time usage analytics');
      } finally {
        setIsLoading(false);
      }
    }

    fetchTimeUsageAnalytics();
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
        title="Time Usage Analytics"
        subtitle="Task completion and time distribution"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Analytics', href: '/analytics' },
          { label: 'Time Usage' },
        ]}
      >
        <div className="text-center text-muted-foreground">No time usage data available</div>
      </DetailPage>
    );
  }

  const metrics = [
    {
      label: 'Completed Tasks',
      value: analytics.tasks.completed,
      change: analytics.tasks.period,
      trend: 'up' as const,
      icon: <CheckSquare className="h-5 w-5" />,
    },
    {
      label: 'Task Distribution',
      value: analytics.distribution.byPriority.length,
      change: 'priority levels',
      trend: 'neutral' as const,
      icon: <Clock className="h-5 w-5" />,
    },
    {
      label: 'Active Assignees',
      value: analytics.distribution.byAssignee.length,
      change: '',
      trend: 'neutral' as const,
      icon: <Users className="h-5 w-5" />,
    },
  ];

  return (
    <DetailPage
      title="Time Usage Analytics"
      subtitle="Task completion and time distribution"
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Analytics', href: '/analytics' },
        { label: 'Time Usage' },
      ]}
      metrics={metrics}
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Tasks by Priority</h3>
            <div className="space-y-3">
              {analytics.distribution.byPriority.map((item) => (
                <div
                  key={item.priority}
                  className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
                >
                  <p className="font-medium capitalize">{item.priority || 'Unset'}</p>
                  <p className="text-lg font-semibold">{item.count}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Top Assignees</h3>
            <div className="space-y-3">
              {analytics.distribution.byAssignee.map((item, index) => (
                <div
                  key={item.assignedTo}
                  className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
                      {index + 1}
                    </div>
                    <p className="font-medium">{item.assignedTo}</p>
                  </div>
                  <p className="text-lg font-semibold">{item.count} tasks</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="mb-2 flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Task Completion</h3>
          </div>
          <p className="text-3xl font-bold">{analytics.tasks.completed}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tasks completed in the last {analytics.tasks.period}
          </p>
        </Card>
      </div>
    </DetailPage>
  );
}
