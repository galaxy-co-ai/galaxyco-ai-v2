"use client";

import { DetailPage } from "@/components/templates/detail-page";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  DollarSign,
  Database,
  Cpu,
  TrendingUp,
  Download,
  AlertTriangle,
  Activity,
  Zap,
} from "lucide-react";
import { useState } from "react";

interface UsageMetric {
  label: string;
  value: string;
  unit: string;
  limit: string;
  percentage: number;
  trend: "up" | "down" | "stable";
  trendValue: string;
  icon: React.ReactNode;
  status: "normal" | "warning" | "critical";
}

interface ResourceUsage {
  id: string;
  resource: string;
  usage: number;
  cost: number;
  limit: number;
  unit: string;
}

const usageMetrics: UsageMetric[] = [
  {
    label: "API Calls",
    value: "127,450",
    unit: "calls",
    limit: "150,000",
    percentage: 85,
    trend: "up",
    trendValue: "+12%",
    icon: <Zap className="h-5 w-5" />,
    status: "warning",
  },
  {
    label: "Storage Used",
    value: "7.5",
    unit: "GB",
    limit: "10",
    percentage: 75,
    trend: "up",
    trendValue: "+8%",
    icon: <Database className="h-5 w-5" />,
    status: "normal",
  },
  {
    label: "Compute Hours",
    value: "342",
    unit: "hours",
    limit: "500",
    percentage: 68,
    trend: "stable",
    trendValue: "0%",
    icon: <Cpu className="h-5 w-5" />,
    status: "normal",
  },
  {
    label: "Estimated Cost",
    value: "$247",
    unit: "",
    limit: "$350",
    percentage: 71,
    trend: "up",
    trendValue: "+5%",
    icon: <DollarSign className="h-5 w-5" />,
    status: "normal",
  },
];

const resourceBreakdown: ResourceUsage[] = [
  {
    id: "res_001",
    resource: "AI Agent Executions",
    usage: 45230,
    cost: 135.69,
    limit: 60000,
    unit: "executions",
  },
  {
    id: "res_002",
    resource: "Document Storage",
    usage: 7.5,
    cost: 15.0,
    limit: 10,
    unit: "GB",
  },
  {
    id: "res_003",
    resource: "Workflow Runs",
    usage: 1840,
    cost: 55.2,
    limit: 3000,
    unit: "runs",
  },
  {
    id: "res_004",
    resource: "API Bandwidth",
    usage: 127.45,
    cost: 25.49,
    limit: 200,
    unit: "GB",
  },
  {
    id: "res_005",
    resource: "Database Queries",
    usage: 2340000,
    cost: 15.62,
    limit: 5000000,
    unit: "queries",
  },
];

// Mock usage over time data (last 30 days)
const usageOverTime = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  apiCalls: Math.floor(3000 + Math.random() * 2000 + i * 50),
  storage: 5 + i * 0.08 + Math.random() * 0.5,
  compute: Math.floor(8 + Math.random() * 6 + i * 0.2),
  cost: Math.floor(5 + Math.random() * 4 + i * 0.15),
}));

function MetricCard({ metric }: { metric: UsageMetric }) {
  const statusColors = {
    normal: "text-green-500",
    warning: "text-yellow-500",
    critical: "text-red-500",
  };

  const bgColors = {
    normal: "bg-green-500/10",
    warning: "bg-yellow-500/10",
    critical: "bg-red-500/10",
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-lg ${bgColors[metric.status]}`}
        >
          <div className={statusColors[metric.status]}>{metric.icon}</div>
        </div>
        {metric.status !== "normal" && (
          <AlertTriangle className={`h-5 w-5 ${statusColors[metric.status]}`} />
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm text-muted-foreground">{metric.label}</p>
        <p className="mt-1 text-2xl font-bold">
          {metric.value}
          {metric.unit && (
            <span className="text-sm font-normal text-muted-foreground">
              {" "}
              {metric.unit}
            </span>
          )}
        </p>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            of {metric.limit} {metric.unit}
          </span>
          <Badge
            variant={metric.trend === "up" ? "default" : "secondary"}
            className="text-xs"
          >
            {metric.trendValue}
          </Badge>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full transition-all ${
              metric.percentage >= 90
                ? "bg-red-500"
                : metric.percentage >= 75
                  ? "bg-yellow-500"
                  : "bg-green-500"
            }`}
            style={{ width: `${metric.percentage}%` }}
          />
        </div>
      </div>
    </Card>
  );
}

function UsageChart() {
  const maxValue = Math.max(...usageOverTime.map((d) => d.apiCalls));
  const chartHeight = 200;

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Usage Over Time</h3>
        <Badge variant="secondary">Last 30 Days</Badge>
      </div>
      <div
        className="flex items-end justify-between gap-1"
        style={{ height: chartHeight }}
      >
        {usageOverTime.map((data, i) => (
          <div
            key={i}
            className="group relative flex-1 cursor-pointer"
            style={{ height: "100%" }}
          >
            <div className="absolute bottom-0 w-full">
              <div
                className="w-full rounded-t bg-primary/70 transition-all group-hover:bg-primary"
                style={{
                  height: `${(data.apiCalls / maxValue) * chartHeight}px`,
                }}
              />
            </div>
            <div className="pointer-events-none absolute -top-16 left-1/2 z-10 hidden -translate-x-1/2 rounded bg-popover p-2 text-xs shadow-lg group-hover:block">
              <p className="font-semibold">Day {data.day}</p>
              <p className="text-muted-foreground">
                {data.apiCalls.toLocaleString()} calls
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between text-xs text-muted-foreground">
        <span>Day 1</span>
        <span>Day 15</span>
        <span>Day 30</span>
      </div>
    </Card>
  );
}

function ResourceBreakdownTable() {
  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-semibold">Resource Breakdown</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left text-sm text-muted-foreground">
              <th className="pb-3 font-medium">Resource</th>
              <th className="pb-3 font-medium">Usage</th>
              <th className="pb-3 font-medium">Limit</th>
              <th className="pb-3 font-medium">Cost</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {resourceBreakdown.map((resource) => {
              const percentage = (resource.usage / resource.limit) * 100;
              const status =
                percentage >= 90
                  ? "critical"
                  : percentage >= 75
                    ? "warning"
                    : "normal";

              return (
                <tr
                  key={resource.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="py-4 font-medium">{resource.resource}</td>
                  <td className="py-4 text-muted-foreground">
                    {resource.usage.toLocaleString()} {resource.unit}
                  </td>
                  <td className="py-4 text-muted-foreground">
                    {resource.limit.toLocaleString()} {resource.unit}
                  </td>
                  <td className="py-4 font-medium">
                    ${resource.cost.toFixed(2)}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full ${
                            status === "critical"
                              ? "bg-red-500"
                              : status === "warning"
                                ? "bg-yellow-500"
                                : "bg-green-500"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-6 rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          <div className="flex-1">
            <p className="font-semibold text-yellow-900 dark:text-yellow-100">
              Approaching Usage Limits
            </p>
            <p className="mt-1 text-sm text-yellow-800 dark:text-yellow-200">
              You&apos;re using 85% of your API call limit. Consider upgrading
              your plan to avoid service interruptions.
            </p>
          </div>
          <Button size="sm" variant="outline">
            Upgrade Plan
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default function UsagePage() {
  const [dateRange, setDateRange] = useState("30");

  const totalCost = resourceBreakdown.reduce((sum, r) => sum + r.cost, 0);

  const metrics = [
    {
      label: "Current Period",
      value: "Jan 1 - Jan 31, 2025",
      icon: <Activity className="h-5 w-5" />,
    },
    {
      label: "Total Cost",
      value: `$${totalCost.toFixed(2)}`,
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      label: "Daily Average",
      value: `$${(totalCost / 30).toFixed(2)}`,
      icon: <TrendingUp className="h-5 w-5" />,
    },
    {
      label: "Projected Monthly",
      value: `$${(totalCost * 1.15).toFixed(2)}`,
      icon: <BarChart3 className="h-5 w-5" />,
    },
  ];

  return (
    <DetailPage
      title="Usage Analytics"
      subtitle="Monitor your resource consumption and costs"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Usage" },
      ]}
      actions={
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      }
      metrics={metrics}
      tabs={[
        {
          id: "overview",
          label: "Overview",
          content: (
            <div className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {usageMetrics.map((metric, i) => (
                  <MetricCard key={i} metric={metric} />
                ))}
              </div>
              <UsageChart />
              <ResourceBreakdownTable />
            </div>
          ),
        },
      ]}
    />
  );
}
