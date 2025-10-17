"use client";

import { DetailPage } from "@/components/templates/detail-page";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  FileText,
  Plus,
  Share2,
} from "lucide-react";

const reportsMetrics = [
  {
    label: "Total Reports",
    value: "24",
    change: "+3 this month",
    trend: "up" as const,
    icon: <FileText className="h-5 w-5" />,
  },
  {
    label: "Revenue",
    value: "$124.5K",
    change: "+12.5% vs last month",
    trend: "up" as const,
    icon: <TrendingUp className="h-5 w-5" />,
  },
  {
    label: "Conversion Rate",
    value: "3.2%",
    change: "+0.4% improvement",
    trend: "up" as const,
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    label: "Active Users",
    value: "1,234",
    change: "+8% growth",
    trend: "up" as const,
    icon: <TrendingUp className="h-5 w-5" />,
  },
];

const mockReports = [
  {
    id: "1",
    name: "Sales Performance Q4",
    type: "sales",
    dateRange: "Oct 1 - Oct 17, 2025",
    generatedBy: "Sarah Johnson",
    status: "ready",
    lastUpdated: "2 hours ago",
    metrics: {
      totalSales: "$45.2K",
      deals: 23,
      conversionRate: "3.4%",
    },
  },
  {
    id: "2",
    name: "Marketing Campaign ROI",
    type: "marketing",
    dateRange: "Sep 1 - Sep 30, 2025",
    generatedBy: "Michael Chen",
    status: "ready",
    lastUpdated: "1 day ago",
    metrics: {
      roi: "4.2x",
      spend: "$12K",
      revenue: "$50.4K",
    },
  },
  {
    id: "3",
    name: "Agent Performance Analysis",
    type: "analytics",
    dateRange: "Oct 1 - Oct 17, 2025",
    generatedBy: "Emily Rodriguez",
    status: "ready",
    lastUpdated: "3 hours ago",
    metrics: {
      totalExecutions: "1,234",
      successRate: "94.2%",
      avgDuration: "2.4s",
    },
  },
  {
    id: "4",
    name: "Customer Retention Report",
    type: "customer",
    dateRange: "Q3 2025",
    generatedBy: "David Kim",
    status: "generating",
    lastUpdated: "Just now",
    metrics: {
      retentionRate: "92%",
      churnRate: "8%",
      ltv: "$24K",
    },
  },
];

function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Recent Reports */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Reports</h3>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
        </div>

        <div className="space-y-4">
          {mockReports.map((report) => {
            const statusColors = {
              ready: "default",
              generating: "secondary",
              failed: "destructive",
            } as const;

            const typeColors = {
              sales: "default",
              marketing: "secondary",
              analytics: "outline",
              customer: "default",
            } as const;

            return (
              <div
                key={report.id}
                className="p-4 rounded-lg border border-border hover:border-primary/50 hover:shadow-sm transition-all"
              >
                {/* Report Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{report.name}</h4>
                      <Badge
                        variant={
                          typeColors[report.type as keyof typeof typeColors]
                        }
                      >
                        {report.type.charAt(0).toUpperCase() +
                          report.type.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{report.dateRange}</span>
                      </div>
                      <span>by {report.generatedBy}</span>
                      <span>• {report.lastUpdated}</span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      statusColors[report.status as keyof typeof statusColors]
                    }
                  >
                    {report.status.charAt(0).toUpperCase() +
                      report.status.slice(1)}
                  </Badge>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-muted/50 rounded-lg">
                  {Object.entries(report.metrics).map(([key, value]) => (
                    <div key={key}>
                      <div className="text-xs text-muted-foreground mb-1">
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .trim()
                          .split(" ")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1),
                          )
                          .join(" ")}
                      </div>
                      <div className="text-lg font-semibold">{value}</div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Report
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Chart Placeholder */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Trends</h3>
        <div className="flex items-center justify-center h-64 bg-muted/50 rounded-lg">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Chart visualization coming soon
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function ScheduledTab() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Scheduled Reports</h3>
        <div className="space-y-4">
          <div className="p-4 rounded-lg border border-border">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold">Weekly Sales Summary</h4>
                <p className="text-sm text-muted-foreground">
                  Every Monday at 9:00 AM
                </p>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
            <div className="flex gap-2 mt-3">
              <Button variant="outline" size="sm">
                Edit Schedule
              </Button>
              <Button variant="outline" size="sm">
                Run Now
              </Button>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-border">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold">Monthly Analytics Report</h4>
                <p className="text-sm text-muted-foreground">
                  1st of every month at 8:00 AM
                </p>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
            <div className="flex gap-2 mt-3">
              <Button variant="outline" size="sm">
                Edit Schedule
              </Button>
              <Button variant="outline" size="sm">
                Run Now
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function CustomTab() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Create Custom Report</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Build custom reports by selecting metrics, date ranges, and filters.
        </p>
        <div className="flex items-center justify-center h-48 bg-muted/50 rounded-lg">
          <div className="text-center">
            <FileText className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-4">
              Report builder coming soon
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Custom Report
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function ReportsPage() {
  const tabs = [
    {
      id: "overview",
      label: "Overview",
      content: <OverviewTab />,
    },
    {
      id: "scheduled",
      label: "Scheduled",
      content: <ScheduledTab />,
    },
    {
      id: "custom",
      label: "Custom",
      content: <CustomTab />,
    },
  ];

  return (
    <DetailPage
      title="Reports"
      subtitle="Generate and manage custom reports"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Reports" }]}
      actions={
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Report
          </Button>
        </div>
      }
      metrics={reportsMetrics}
      tabs={tabs}
      defaultTab="overview"
    />
  );
}
