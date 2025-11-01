'use client';

import { useState, useEffect } from 'react';
import { DetailPage } from '@/components/templates';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useWorkspace } from '@/contexts/workspace-context';
import { toast } from 'sonner';
import { Users, CheckSquare, Calendar, Mail } from 'lucide-react';

interface OutreachAnalytics {
  contacts: { total: number };
  tasks: { total: number; byStatus: Array<{ status: string; count: number }> };
  events: { total: number; period: string };
  emails: { total: number; period: string };
}

export default function OutreachAnalyticsPage() {
  const { currentWorkspace } = useWorkspace();
  const [analytics, setAnalytics] = useState<OutreachAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOutreachAnalytics() {
      if (!currentWorkspace?.id) return;

      try {
        setIsLoading(true);
        const res = await fetch(`/api/analytics/outreach?workspaceId=${currentWorkspace.id}`);

        if (!res.ok) throw new Error('Failed to fetch outreach analytics');

        const data = await res.json();
        setAnalytics(data.analytics);
      } catch (error) {
        console.error('Failed to fetch outreach analytics:', error);
        toast.error('Failed to load outreach analytics');
      } finally {
        setIsLoading(false);
      }
    }

    fetchOutreachAnalytics();
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
        title="Outreach Analytics"
        subtitle="Tasks, events, and contact engagement"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Analytics', href: '/analytics' },
          { label: 'Outreach' },
        ]}
      >
        <div className="text-center text-muted-foreground">No outreach data available</div>
      </DetailPage>
    );
  }

  const metrics = [
    {
      label: 'Total Contacts',
      value: analytics.contacts.total,
      change: '',
      trend: 'neutral' as const,
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: 'Tasks',
      value: analytics.tasks.total,
      change: '',
      trend: 'neutral' as const,
      icon: <CheckSquare className="h-5 w-5" />,
    },
    {
      label: 'Events',
      value: analytics.events.total,
      change: analytics.events.period,
      trend: 'neutral' as const,
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      label: 'Emails',
      value: analytics.emails.total,
      change: analytics.emails.period,
      trend: 'neutral' as const,
      icon: <Mail className="h-5 w-5" />,
    },
  ];

  return (
    <DetailPage
      title="Outreach Analytics"
      subtitle="Tasks, events, and contact engagement"
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Analytics', href: '/analytics' },
        { label: 'Outreach' },
      ]}
      metrics={metrics}
    >
      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Tasks by Status</h3>
          <div className="space-y-3">
            {analytics.tasks.byStatus.map((item) => (
              <div
                key={item.status}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
              >
                <p className="font-medium capitalize">{item.status}</p>
                <p className="text-lg font-semibold">{item.count}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="p-6">
            <div className="mb-2 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Calendar Events</h3>
            </div>
            <p className="text-3xl font-bold">{analytics.events.total}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Events in the last {analytics.events.period}
            </p>
          </Card>

          <Card className="p-6">
            <div className="mb-2 flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Email Threads</h3>
            </div>
            <p className="text-3xl font-bold">{analytics.emails.total}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Threads in the last {analytics.emails.period}
            </p>
          </Card>
        </div>
      </div>
    </DetailPage>
  );
}
