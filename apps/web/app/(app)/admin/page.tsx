"use client";

import React from "react";
import { PageShell } from "@/components/templates/page-shell";
import {
  Users,
  Building2,
  Activity,
  DollarSign,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const platformMetrics: Array<{
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: any;
  color: string;
}> = [];

const recentActivity = [
  {
    id: 1,
    user: "sarah@company.com",
    action: "Created new workspace",
    workspace: "Acme Corp",
    timestamp: "2 minutes ago",
  },
  {
    id: 2,
    user: "john@startup.io",
    action: "Upgraded to Pro plan",
    workspace: "Startup Inc",
    timestamp: "12 minutes ago",
  },
  {
    id: 3,
    user: "admin@enterprise.com",
    action: "Added 15 team members",
    workspace: "Enterprise LLC",
    timestamp: "1 hour ago",
  },
  {
    id: 4,
    user: "dev@tech.com",
    action: "Executed 500+ agents",
    workspace: "Tech Solutions",
    timestamp: "2 hours ago",
  },
  {
    id: 5,
    user: "support@agency.co",
    action: "Cancelled subscription",
    workspace: "Digital Agency",
    timestamp: "3 hours ago",
  },
];

const systemAlerts = [
  {
    id: 1,
    type: "warning",
    message: "High API usage detected for workspace: Enterprise LLC",
    timestamp: "15 minutes ago",
  },
  {
    id: 2,
    type: "info",
    message: "Database backup completed successfully",
    timestamp: "1 hour ago",
  },
];

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = React.useState<typeof platformMetrics>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/analytics?period=last-30-days");
        if (!res.ok) throw new Error("Failed to fetch analytics");
        const json = await res.json();
        const d = json.analytics?.data;
        if (d) {
          setMetrics([
            {
              label: "Total Users",
              value: (d.totalUsers || 0).toLocaleString(),
              change: "+—%",
              trend: "up",
              icon: Users,
              color:
                "text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400",
            },
            {
              label: "Total Workspaces",
              value: (d.totalWorkspaces || 0).toLocaleString(),
              change: "+—%",
              trend: "up",
              icon: Building2,
              color:
                "text-purple-600 bg-purple-50 dark:bg-purple-950 dark:text-purple-400",
            },
            {
              label: "Executions (30d)",
              value: (d.recentExecutions || 0).toLocaleString(),
              change: "+—%",
              trend: "up",
              icon: Activity,
              color:
                "text-cyan-600 bg-cyan-50 dark:bg-cyan-950 dark:text-cyan-400",
            },
            {
              label: "Total Executions",
              value: (d.totalExecutions || 0).toLocaleString(),
              change: "+—%",
              trend: "up",
              icon: DollarSign,
              color:
                "text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400",
            },
          ]);
        }
      } catch (e) {
        // keep empty metrics and show rest of page
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <PageShell
      title="Admin Dashboard"
      subtitle="Platform overview and management"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Admin" }]}
    >
      <div className="space-y-6">
        {/* Platform Metrics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.label}
                className="rounded-lg border border-border bg-card p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-lg",
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
                <p className="text-sm text-muted-foreground mb-1">
                  {metric.label}
                </p>
                <p className="text-2xl font-bold">{metric.value}</p>
              </div>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Activity */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start justify-between gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{activity.user}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.workspace}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {activity.timestamp}
                  </span>
                </div>
              ))}
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
                    "rounded-lg p-4",
                    alert.type === "warning"
                      ? "bg-yellow-50 dark:bg-yellow-950"
                      : "bg-blue-50 dark:bg-blue-950",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle
                      className={cn(
                        "h-5 w-5 mt-0.5",
                        alert.type === "warning"
                          ? "text-yellow-600 dark:text-yellow-400"
                          : "text-blue-600 dark:text-blue-400",
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {alert.timestamp}
                      </p>
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
