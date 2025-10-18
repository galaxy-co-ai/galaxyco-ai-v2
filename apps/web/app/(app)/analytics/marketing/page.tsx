"use client";

import { useState, useEffect } from "react";
import { DetailPage } from "@/components/templates";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useWorkspace } from "@/contexts/workspace-context";
import { toast } from "sonner";
import { Target, Mail, TrendingUp } from "lucide-react";

interface MarketingAnalytics {
  campaigns: {
    total: number;
    byStatus: Array<{ status: string; count: number }>;
  };
  prospects: {
    total: number;
    byStage: Array<{ stage: string; count: number }>;
  };
  emails: { total: number; period: string };
}

export default function MarketingAnalyticsPage() {
  const { currentWorkspace } = useWorkspace();
  const [analytics, setAnalytics] = useState<MarketingAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMarketingAnalytics() {
      if (!currentWorkspace?.id) return;

      try {
        setIsLoading(true);
        const res = await fetch(
          `/api/analytics/marketing?workspaceId=${currentWorkspace.id}`,
        );

        if (!res.ok) throw new Error("Failed to fetch marketing analytics");

        const data = await res.json();
        setAnalytics(data.analytics);
      } catch (error) {
        console.error("Failed to fetch marketing analytics:", error);
        toast.error("Failed to load marketing analytics");
      } finally {
        setIsLoading(false);
      }
    }

    fetchMarketingAnalytics();
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
        title="Marketing Analytics"
        subtitle="Campaigns, prospects, and email performance"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Analytics", href: "/analytics" },
          { label: "Marketing" },
        ]}
      >
        <div className="text-center text-muted-foreground">
          No marketing data available
        </div>
      </DetailPage>
    );
  }

  const metrics = [
    {
      label: "Total Campaigns",
      value: analytics.campaigns.total,
      change: "",
      trend: "neutral" as const,
      icon: <Target className="h-5 w-5" />,
    },
    {
      label: "Prospects",
      value: analytics.prospects.total,
      change: "",
      trend: "up" as const,
      icon: <TrendingUp className="h-5 w-5" />,
    },
    {
      label: "Email Threads",
      value: analytics.emails.total,
      change: analytics.emails.period,
      trend: "neutral" as const,
      icon: <Mail className="h-5 w-5" />,
    },
  ];

  return (
    <DetailPage
      title="Marketing Analytics"
      subtitle="Campaigns, prospects, and email performance"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Analytics", href: "/analytics" },
        { label: "Marketing" },
      ]}
      metrics={metrics}
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Campaigns by Status</h3>
            <div className="space-y-3">
              {analytics.campaigns.byStatus.map((item) => (
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

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Prospects by Stage</h3>
            <div className="space-y-3">
              {analytics.prospects.byStage.map((item) => (
                <div
                  key={item.stage}
                  className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
                >
                  <p className="font-medium capitalize">{item.stage}</p>
                  <p className="text-lg font-semibold">{item.count}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="mb-2 flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Email Activity</h3>
          </div>
          <p className="text-3xl font-bold">{analytics.emails.total}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Email threads in the last {analytics.emails.period}
          </p>
        </Card>
      </div>
    </DetailPage>
  );
}
