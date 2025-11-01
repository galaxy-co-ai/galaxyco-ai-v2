'use client';

import { useState, useEffect } from 'react';
import { DetailPage } from '@/components/templates';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useWorkspace } from '@/contexts/workspace-context';
import { WorkspaceGuard } from '@/components/workspace/workspace-guard';
import { toast } from 'sonner';
import {
  DollarSign,
  Users,
  Briefcase,
  Target,
  Mail,
  Zap,
  FileText,
  BarChart3,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

interface AnalyticsData {
  sales: {
    revenue: { total: string; period: string };
    customers: { total: number };
    projects: { total: number };
    invoices: {
      byStatus: Array<{ status: string; count: number; total: string }>;
    };
  };
  marketing: {
    campaigns: {
      total: number;
      byStatus: Array<{ status: string; count: number }>;
    };
    prospects: {
      total: number;
      byStage: Array<{ stage: string; count: number }>;
    };
    emails: { total: number; period: string };
  };
  outreach: {
    contacts: { total: number };
    tasks: {
      total: number;
      byStatus: Array<{ status: string; count: number }>;
    };
    events: { total: number; period: string };
    emails: { total: number; period: string };
  };
  usage: {
    agents: { total: number; active: number };
    knowledge: { total: number; recent: number; period: string };
  };
}

/**
 * Analytics Dashboard Page - Connected to Real APIs
 */
export default function AnalyticsPage() {
  return (
    <WorkspaceGuard>
      <AnalyticsContent />
    </WorkspaceGuard>
  );
}

function AnalyticsContent() {
  const { currentWorkspace } = useWorkspace();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      if (!currentWorkspace?.id) return;

      try {
        setIsLoading(true);

        // Fetch all analytics data in parallel
        const [salesRes, marketingRes, outreachRes, usageRes] = await Promise.all([
          fetch(`/api/analytics/sales?workspaceId=${currentWorkspace.id}`),
          fetch(`/api/analytics/marketing?workspaceId=${currentWorkspace.id}`),
          fetch(`/api/analytics/outreach?workspaceId=${currentWorkspace.id}`),
          fetch(`/api/analytics/usage?workspaceId=${currentWorkspace.id}`),
        ]);

        if (!salesRes.ok || !marketingRes.ok || !outreachRes.ok || !usageRes.ok) {
          throw new Error('Failed to fetch analytics');
        }

        const [salesData, marketingData, outreachData, usageData] = await Promise.all([
          salesRes.json(),
          marketingRes.json(),
          outreachRes.json(),
          usageRes.json(),
        ]);

        setAnalytics({
          sales: salesData.analytics,
          marketing: marketingData.analytics,
          outreach: outreachData.analytics,
          usage: usageData.analytics,
        });
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
        toast.error('Failed to load analytics data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchAnalytics();
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
        title="Analytics"
        subtitle="Platform usage and performance metrics"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Analytics' }]}
      >
        <div className="text-center text-muted-foreground">No analytics data available</div>
      </DetailPage>
    );
  }

  const metrics = [
    {
      label: 'Revenue',
      value: `$${analytics.sales.revenue.total}`,
      change: analytics.sales.revenue.period,
      trend: 'up' as const,
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      label: 'Total Customers',
      value: analytics.sales.customers.total,
      change: '',
      trend: 'neutral' as const,
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: 'Active Agents',
      value: analytics.usage.agents.active,
      change: `${analytics.usage.agents.total} total`,
      trend: 'up' as const,
      icon: <Zap className="h-5 w-5" />,
    },
    {
      label: 'Campaigns',
      value: analytics.marketing.campaigns.total,
      change: '',
      trend: 'neutral' as const,
      icon: <Target className="h-5 w-5" />,
    },
  ];

  return (
    <DetailPage
      title="Analytics"
      subtitle="Platform usage and performance metrics"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Analytics' }]}
      metrics={metrics}
      tabs={[
        {
          id: 'overview',
          label: 'Overview',
          content: <OverviewTab analytics={analytics} />,
        },
        {
          id: 'sales',
          label: 'Sales',
          content: <SalesTab analytics={analytics} />,
        },
        {
          id: 'marketing',
          label: 'Marketing',
          content: <MarketingTab analytics={analytics} />,
        },
      ]}
    />
  );
}

function OverviewTab({ analytics }: { analytics: AnalyticsData }) {
  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Revenue</p>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold">${analytics.sales.revenue.total}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Last {analytics.sales.revenue.period}
          </p>
        </Card>

        <Card className="p-6">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Projects</p>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold">{analytics.sales.projects.total}</p>
          <p className="mt-1 text-xs text-muted-foreground">Total projects</p>
        </Card>

        <Card className="p-6">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Prospects</p>
            <Target className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold">{analytics.marketing.prospects.total}</p>
          <p className="mt-1 text-xs text-muted-foreground">In pipeline</p>
        </Card>

        <Card className="p-6">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Contacts</p>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold">{analytics.outreach.contacts.total}</p>
          <p className="mt-1 text-xs text-muted-foreground">Total contacts</p>
        </Card>
      </div>

      {/* Quick Links to Detailed Pages */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/analytics/sales">
          <Card className="p-6 transition-colors hover:bg-accent">
            <div className="mb-2 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <h4 className="font-semibold">Sales Analytics</h4>
            </div>
            <p className="text-sm text-muted-foreground">Revenue, invoices, and customer metrics</p>
          </Card>
        </Link>

        <Link href="/analytics/marketing">
          <Card className="p-6 transition-colors hover:bg-accent">
            <div className="mb-2 flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <h4 className="font-semibold">Marketing Analytics</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Campaigns, prospects, and email performance
            </p>
          </Card>
        </Link>

        <Link href="/analytics/outreach">
          <Card className="p-6 transition-colors hover:bg-accent">
            <div className="mb-2 flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <h4 className="font-semibold">Outreach Analytics</h4>
            </div>
            <p className="text-sm text-muted-foreground">Tasks, events, and contact engagement</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}

function SalesTab({ analytics }: { analytics: AnalyticsData }) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Invoice Breakdown</h3>
        <div className="space-y-3">
          {analytics.sales.invoices.byStatus.map((item) => (
            <div key={item.status} className="flex items-center justify-between">
              <div>
                <p className="font-medium capitalize">{item.status}</p>
                <p className="text-sm text-muted-foreground">
                  {item.count} {item.count === 1 ? 'invoice' : 'invoices'}
                </p>
              </div>
              <p className="text-lg font-semibold">${item.total}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="p-6">
          <p className="mb-2 text-sm text-muted-foreground">Total Customers</p>
          <p className="text-3xl font-bold">{analytics.sales.customers.total}</p>
        </Card>
        <Card className="p-6">
          <p className="mb-2 text-sm text-muted-foreground">Total Projects</p>
          <p className="text-3xl font-bold">{analytics.sales.projects.total}</p>
        </Card>
      </div>
    </div>
  );
}

function MarketingTab({ analytics }: { analytics: AnalyticsData }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Campaigns by Status</h3>
          <div className="space-y-3">
            {analytics.marketing.campaigns.byStatus.map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <p className="capitalize">{item.status}</p>
                <p className="font-semibold">{item.count}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Prospects by Stage</h3>
          <div className="space-y-3">
            {analytics.marketing.prospects.byStage.map((item) => (
              <div key={item.stage} className="flex items-center justify-between">
                <p className="capitalize">{item.stage}</p>
                <p className="font-semibold">{item.count}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <p className="mb-2 text-sm text-muted-foreground">
          Email Threads (Last {analytics.marketing.emails.period})
        </p>
        <p className="text-3xl font-bold">{analytics.marketing.emails.total}</p>
      </Card>
    </div>
  );
}
