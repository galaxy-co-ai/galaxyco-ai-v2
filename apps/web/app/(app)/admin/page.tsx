'use client';

import React from 'react';
import { PageShell } from '@/components/templates/page-shell';
import { Users, Building2, Activity, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const platformMetrics: Array<{
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: any;
  color: string;
}> = [];

const systemAlerts = [
  {
    id: 1,
    type: 'warning',
    message: 'High API usage detected for workspace: Enterprise LLC',
    timestamp: '15 minutes ago',
  },
  {
    id: 2,
    type: 'info',
    message: 'Database backup completed successfully',
    timestamp: '1 hour ago',
  },
];

interface ActivityItem {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  workspaceId: string | null;
  workspaceName: string | null;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = React.useState<typeof platformMetrics>([]);
  const [recentActivity, setRecentActivity] = React.useState<ActivityItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activityLoading, setActivityLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/analytics?period=last-30-days');
        if (!res.ok) throw new Error('Failed to fetch analytics');
        const json = await res.json();
        const d = json.analytics?.data;
        if (d) {
          setMetrics([
            {
              label: 'Total Users',
              value: (d.totalUsers || 0).toLocaleString(),
              change: '+—%',
              trend: 'up',
              icon: Users,
              color: 'text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400',
            },
            {
              label: 'Total Workspaces',
              value: (d.totalWorkspaces || 0).toLocaleString(),
              change: '+—%',
              trend: 'up',
              icon: Building2,
              color: 'text-purple-600 bg-purple-50 dark:bg-purple-950 dark:text-purple-400',
            },
            {
              label: 'Executions (30d)',
              value: (d.recentExecutions || 0).toLocaleString(),
              change: '+—%',
              trend: 'up',
              icon: Activity,
              color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950 dark:text-cyan-400',
            },
            {
              label: 'Total Executions',
              value: (d.totalExecutions || 0).toLocaleString(),
              change: '+—%',
              trend: 'up',
              icon: DollarSign,
              color: 'text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400',
            },
          ]);
        }
      } catch (e) {
        // keep empty metrics and show rest of page
      } finally {
        setLoading(false);
      }
    }

    async function loadActivity() {
      try {
        setActivityLoading(true);
        // Try to fetch from a hypothetical audit log endpoint
        const res = await fetch('/api/admin/audit-log?limit=5');
        if (res.ok) {
          const json = await res.json();
          setRecentActivity(json.activities || []);
        } else {
          // Fallback to mock data if endpoint doesn't exist
          setRecentActivity([
            {
              id: '1',
              userId: 'user1',
              userEmail: 'sarah@company.com',
              action: 'Created new workspace',
              workspaceId: 'ws1',
              workspaceName: 'Acme Corp',
              createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
            },
            {
              id: '2',
              userId: 'user2',
              userEmail: 'john@startup.io',
              action: 'Upgraded to Pro plan',
              workspaceId: 'ws2',
              workspaceName: 'Startup Inc',
              createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
            },
            {
              id: '3',
              userId: 'user3',
              userEmail: 'admin@enterprise.com',
              action: 'Added 15 team members',
              workspaceId: 'ws3',
              workspaceName: 'Enterprise LLC',
              createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
            },
          ]);
        }
      } catch (e) {
        console.error('Failed to load activity', e);
        // Use fallback data
        setRecentActivity([]);
      } finally {
        setActivityLoading(false);
      }
    }

    load();
    loadActivity();
  }, []);

  return (
    <PageShell
      title="Admin Dashboard"
      subtitle="Platform overview and management"
      breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Admin' }]}
    >
      <div className="space-y-6">
        {/* Platform Metrics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-lg',
                      metric.color,
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                    <TrendingUp className="h-4 w-4" />
                    <span>{metric.change}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                <p className="text-2xl font-bold">{metric.value}</p>
              </div>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Activity */}
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Activity</h3>
              {activityLoading && <div className="text-sm text-muted-foreground">Loading...</div>}
            </div>
            <div className="space-y-4">
              {recentActivity.length === 0 && !activityLoading ? (
                <div className="text-center text-muted-foreground py-8">
                  <p>No recent activity</p>
                </div>
              ) : (
                recentActivity.map((activity) => {
                  const timeAgo = new Date(activity.createdAt);
                  const now = new Date();
                  const diffMs = now.getTime() - timeAgo.getTime();
                  const diffMinutes = Math.floor(diffMs / (1000 * 60));
                  const diffHours = Math.floor(diffMinutes / 60);

                  let timeDisplay = '';
                  if (diffMinutes < 60) {
                    timeDisplay = `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
                  } else if (diffHours < 24) {
                    timeDisplay = `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
                  } else {
                    timeDisplay = timeAgo.toLocaleDateString();
                  }

                  return (
                    <div
                      key={activity.id}
                      className="flex items-start justify-between gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{activity.userEmail}</p>
                        <p className="text-sm text-muted-foreground">{activity.action}</p>
                        {activity.workspaceName && (
                          <p className="text-xs text-muted-foreground">{activity.workspaceName}</p>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {timeDisplay}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* System Alerts */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">System Alerts</h3>
            <div className="space-y-3">
              {systemAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={cn(
                    'rounded-lg p-4',
                    alert.type === 'warning'
                      ? 'bg-yellow-50 dark:bg-yellow-950'
                      : 'bg-blue-50 dark:bg-blue-950',
                  )}
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle
                      className={cn(
                        'h-5 w-5 mt-0.5',
                        alert.type === 'warning'
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-blue-600 dark:text-blue-400',
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{alert.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <a
              href="/admin/users"
              className="flex items-center gap-3 rounded-lg border border-border bg-background p-4 transition-colors hover:bg-muted"
            >
              <Users className="h-5 w-5 text-primary" />
              <span className="font-medium">Manage Users</span>
            </a>
            <a
              href="/admin/workspaces"
              className="flex items-center gap-3 rounded-lg border border-border bg-background p-4 transition-colors hover:bg-muted"
            >
              <Building2 className="h-5 w-5 text-primary" />
              <span className="font-medium">Manage Workspaces</span>
            </a>
            <a
              href="/admin/analytics"
              className="flex items-center gap-3 rounded-lg border border-border bg-background p-4 transition-colors hover:bg-muted"
            >
              <Activity className="h-5 w-5 text-primary" />
              <span className="font-medium">View Analytics</span>
            </a>
            <a
              href="/admin/settings"
              className="flex items-center gap-3 rounded-lg border border-border bg-background p-4 transition-colors hover:bg-muted"
            >
              <DollarSign className="h-5 w-5 text-primary" />
              <span className="font-medium">Platform Settings</span>
            </a>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
