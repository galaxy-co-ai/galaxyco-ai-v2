"use client";

import React from "react";
import { PageShell } from "@/components/templates/page-shell";
import {
  TrendingUp,
  Users,
  Activity,
  DollarSign,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const metrics = [
  { label: "DAU", value: "1,847", change: "+12.5%", icon: Users },
  { label: "MAU", value: "8,392", change: "+8.2%", icon: Users },
  { label: "API Calls (24h)", value: "1.2M", change: "+15.8%", icon: Activity },
  { label: "MRR", value: "$48,392", change: "+22.4%", icon: DollarSign },
];

export default function AdminAnalyticsPage() {
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
          <h3 className="text-lg font-semibold mb-4">Usage Trends</h3>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Chart placeholder - Would integrate with Recharts/Chart.js
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">
              Top Workspaces by Usage
            </h3>
            <div className="space-y-3">
              {[
                { name: "Acme Corp", usage: "142K API calls" },
                { name: "Startup Inc", usage: "89K API calls" },
                { name: "Tech Solutions", usage: "67K API calls" },
              ].map((workspace, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span>{workspace.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {workspace.usage}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Storage Usage</h3>
            <div className="h-32 flex items-center justify-center text-muted-foreground">
              Storage chart placeholder
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
