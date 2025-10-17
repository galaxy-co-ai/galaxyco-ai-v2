"use client";

import { DetailPage } from "@/components/templates";
import { Card } from "@/components/ui/card";
import {
  Activity,
  Users,
  FileText,
  TrendingUp,
  Zap,
  CheckCircle,
  Clock,
  BarChart3,
} from "lucide-react";
import { ActivityFeed } from "@/components/organisms/activity-feed";

// Mock data - would come from API
const metrics = [
  {
    label: "Total Agents",
    value: 24,
    change: "+12%",
    trend: "up" as const,
    icon: <Zap className="h-5 w-5" />,
  },
  {
    label: "Total Executions",
    value: "1,234",
    change: "+18%",
    trend: "up" as const,
    icon: <Activity className="h-5 w-5" />,
  },
  {
    label: "Success Rate",
    value: "98.2%",
    change: "+2.4%",
    trend: "up" as const,
    icon: <CheckCircle className="h-5 w-5" />,
  },
  {
    label: "Avg Duration",
    value: "2.3s",
    change: "-0.2s",
    trend: "up" as const,
    icon: <Clock className="h-5 w-5" />,
  },
];

const recentActivity = [
  {
    id: "1",
    type: "agent_execution" as const,
    title: "Sales Agent completed",
    description: "Processed 15 leads successfully",
    action: "executed",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 min ago
    metadata: { status: "success", duration: "2.1s" },
  },
  {
    id: "2",
    type: "agent_created" as const,
    title: "New agent created",
    description: "Marketing Outreach Agent",
    action: "created",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    metadata: { creator: "John Doe" },
  },
  {
    id: "3",
    type: "document_uploaded" as const,
    title: "Knowledge base updated",
    description: "Added 5 new documents",
    action: "uploaded",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    metadata: { count: 5 },
  },
  {
    id: "4",
    type: "agent_execution" as const,
    title: "Support Agent completed",
    description: "Handled 8 customer inquiries",
    action: "executed",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    metadata: { status: "success", duration: "1.8s" },
  },
  {
    id: "5",
    type: "agent_execution" as const,
    title: "Content Agent completed",
    description: "Generated 3 blog posts",
    action: "executed",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    metadata: { status: "success", duration: "3.2s" },
  },
];

/**
 * Analytics Dashboard Page
 *
 * Demonstrates DetailPage template with:
 * - Metrics cards row
 * - Tabbed content (Overview, Usage, Insights)
 * - Charts and activity feed
 */
export default function AnalyticsPage() {
  return (
    <DetailPage
      title="Analytics"
      subtitle="Platform usage and performance metrics"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Analytics" },
      ]}
      metrics={metrics}
      tabs={[
        {
          id: "overview",
          label: "Overview",
          content: <OverviewTab />,
        },
        {
          id: "usage",
          label: "Usage",
          content: <UsageTab />,
        },
        {
          id: "insights",
          label: "Insights",
          content: <InsightsTab />,
        },
      ]}
    />
  );
}

function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Usage Chart Placeholder */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Agent Executions Over Time
            </h3>
            <p className="text-sm text-muted-foreground">
              Last 30 days of execution activity
            </p>
          </div>
          <BarChart3 className="h-5 w-5 text-muted-foreground" />
        </div>

        {/* Placeholder Chart */}
        <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border bg-muted/20">
          <div className="text-center">
            <BarChart3 className="mx-auto mb-2 h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Chart visualization would render here
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              (Tremor or Recharts integration)
            </p>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Recent Activity
        </h3>
        <ActivityFeed items={recentActivity} />
      </Card>
    </div>
  );
}

function UsageTab() {
  return (
    <div className="space-y-6">
      {/* Top Agents */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Top Performing Agents
        </h3>
        <div className="space-y-3">
          {[
            { name: "Sales Agent", executions: 456, successRate: 99.1 },
            { name: "Support Agent", executions: 389, successRate: 98.5 },
            { name: "Marketing Agent", executions: 234, successRate: 97.8 },
            { name: "Content Agent", executions: 155, successRate: 96.2 },
          ].map((agent, index) => (
            <div
              key={agent.name}
              className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <span className="text-sm font-semibold">{index + 1}</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">{agent.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {agent.executions} executions
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-success">
                  {agent.successRate}%
                </p>
                <p className="text-xs text-muted-foreground">success rate</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Usage by Category */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Usage by Category
        </h3>
        <div className="space-y-3">
          {[
            { category: "Sales", percentage: 38, count: 456 },
            { category: "Support", percentage: 32, count: 389 },
            { category: "Marketing", percentage: 19, count: 234 },
            { category: "Content", percentage: 11, count: 155 },
          ].map((item) => (
            <div key={item.category} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">
                  {item.category}
                </span>
                <span className="text-muted-foreground">
                  {item.count} executions ({item.percentage}%)
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function InsightsTab() {
  return (
    <div className="space-y-6">
      {/* Key Insights */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="p-6">
          <div className="mb-2 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-success" />
            <h4 className="font-semibold text-foreground">Performance Trend</h4>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            Agent execution success rate has improved by 12% over the last 30
            days.
          </p>
          <div className="flex items-center gap-2">
            <div className="h-1 flex-1 rounded-full bg-muted">
              <div className="h-full w-3/4 rounded-full bg-success" />
            </div>
            <span className="text-xs text-muted-foreground">+12%</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-2 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h4 className="font-semibold text-foreground">Active Users</h4>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            24 team members are actively using the platform this month.
          </p>
          <div className="flex items-center gap-2">
            <div className="h-1 flex-1 rounded-full bg-muted">
              <div className="h-full w-4/5 rounded-full bg-primary" />
            </div>
            <span className="text-xs text-muted-foreground">+8%</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-2 flex items-center gap-2">
            <FileText className="h-5 w-5 text-warning" />
            <h4 className="font-semibold text-foreground">
              Knowledge Base Growth
            </h4>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            45 new documents added to the knowledge base this month.
          </p>
          <div className="flex items-center gap-2">
            <div className="h-1 flex-1 rounded-full bg-muted">
              <div className="h-full w-2/3 rounded-full bg-warning" />
            </div>
            <span className="text-xs text-muted-foreground">+15%</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-2 flex items-center gap-2">
            <Zap className="h-5 w-5 text-secondary" />
            <h4 className="font-semibold text-foreground">Automation Rate</h4>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            87% of tasks are now automated through AI agents.
          </p>
          <div className="flex items-center gap-2">
            <div className="h-1 flex-1 rounded-full bg-muted">
              <div className="h-full w-[87%] rounded-full bg-secondary" />
            </div>
            <span className="text-xs text-muted-foreground">+5%</span>
          </div>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Recommendations
        </h3>
        <div className="space-y-3">
          <div className="flex gap-3 rounded-lg border border-border bg-accent/50 p-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <h4 className="mb-1 font-medium text-foreground">
                Optimize Sales Agent
              </h4>
              <p className="text-sm text-muted-foreground">
                Your Sales Agent has a 99.1% success rate. Consider cloning it
                for other use cases.
              </p>
            </div>
          </div>

          <div className="flex gap-3 rounded-lg border border-border bg-accent/50 p-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-warning/10 text-warning">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h4 className="mb-1 font-medium text-foreground">
                Update Knowledge Base
              </h4>
              <p className="text-sm text-muted-foreground">
                Some documents haven&apos;t been updated in 90+ days. Refresh
                them for better accuracy.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
