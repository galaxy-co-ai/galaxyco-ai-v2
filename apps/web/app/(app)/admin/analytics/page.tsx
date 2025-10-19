"use client";

import React, { useEffect, useState } from "react";
import { PageShell } from "@/components/templates/page-shell";
import {
  TrendingUp,
  Users,
  Activity,
  DollarSign,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnalyticsData {
  totalWorkspaces: number;
  totalUsers: number;
  activeUsers: number;
  totalAgents: number;
  totalExecutions: number;
  recentExecutions: number;
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/admin/analytics?period=last-30-days");
        if (!res.ok) throw new Error("Failed to fetch analytics");
        const json = await res.json();
        setData(json.analytics?.data || null);
      } catch (e) {
        console.error("Failed to load analytics", e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (isLoading || !data) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  const metrics = [
    {
      label: "Total Users",
      value: data.totalUsers.toLocaleString(),
      change: "+—%",
      icon: Users,
    },
    {
      label: "Active Users (30d)",
      value: data.activeUsers.toLocaleString(),
      change: "+—%",
      icon: Users,
    },
    {
      label: "Executions (30d)",
      value: data.recentExecutions.toLocaleString(),
      change: "+—%",
      icon: Activity,
    },
    {
      label: "Total Executions",
      value: data.totalExecutions.toLocaleString(),
      change: "+—%",
      icon: Activity,
    },
  ];

  return (
    <PageShell
      title="Platform Analytics"
      subtitle="Usage metrics and insights"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Admin", href: "/admin" },
        { label: "Analytics" },
      ]}
      actions={
        <Button size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.label}
                className="rounded-lg border border-border bg-card p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
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

        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Overview</h3>
          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              Total Workspaces:{" "}
              <span className="font-medium text-foreground">
                {data.totalWorkspaces.toLocaleString()}
              </span>
            </div>
            <div>
              Total Agents:{" "}
              <span className="font-medium text-foreground">
                {data.totalAgents.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
