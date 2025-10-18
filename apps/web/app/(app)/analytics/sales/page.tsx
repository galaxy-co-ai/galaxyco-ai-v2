"use client";

import { useState, useEffect } from "react";
import { DetailPage } from "@/components/templates";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useWorkspace } from "@/contexts/workspace-context";
import { toast } from "sonner";
import { DollarSign, Users, Briefcase, FileText } from "lucide-react";

interface SalesAnalytics {
  revenue: { total: string; period: string };
  customers: { total: number };
  projects: { total: number };
  invoices: {
    byStatus: Array<{ status: string; count: number; total: string }>;
  };
}

export default function SalesAnalyticsPage() {
  const { currentWorkspace } = useWorkspace();
  const [analytics, setAnalytics] = useState<SalesAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSalesAnalytics() {
      if (!currentWorkspace?.id) return;

      try {
        setIsLoading(true);
        const res = await fetch(
          `/api/analytics/sales?workspaceId=${currentWorkspace.id}`,
        );

        if (!res.ok) throw new Error("Failed to fetch sales analytics");

        const data = await res.json();
        setAnalytics(data.analytics);
      } catch (error) {
        console.error("Failed to fetch sales analytics:", error);
        toast.error("Failed to load sales analytics");
      } finally {
        setIsLoading(false);
      }
    }

    fetchSalesAnalytics();
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
        title="Sales Analytics"
        subtitle="Revenue, invoices, and customer metrics"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Analytics", href: "/analytics" },
          { label: "Sales" },
        ]}
      >
        <div className="text-center text-muted-foreground">
          No sales data available
        </div>
      </DetailPage>
    );
  }

  const metrics = [
    {
      label: "Total Revenue",
      value: `$${analytics.revenue.total}`,
      change: analytics.revenue.period,
      trend: "up" as const,
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      label: "Customers",
      value: analytics.customers.total,
      change: "",
      trend: "neutral" as const,
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: "Projects",
      value: analytics.projects.total,
      change: "",
      trend: "neutral" as const,
      icon: <Briefcase className="h-5 w-5" />,
    },
    {
      label: "Invoices",
      value: analytics.invoices.byStatus.reduce(
        (sum, item) => sum + item.count,
        0,
      ),
      change: "",
      trend: "neutral" as const,
      icon: <FileText className="h-5 w-5" />,
    },
  ];

  return (
    <DetailPage
      title="Sales Analytics"
      subtitle="Revenue, invoices, and customer metrics"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Analytics", href: "/analytics" },
        { label: "Sales" },
      ]}
      metrics={metrics}
    >
      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Invoice Breakdown</h3>
          <div className="space-y-3">
            {analytics.invoices.byStatus.map((item) => (
              <div
                key={item.status}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
              >
                <div>
                  <p className="font-medium capitalize">{item.status}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.count} {item.count === 1 ? "invoice" : "invoices"}
                  </p>
                </div>
                <p className="text-lg font-semibold">${item.total}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="p-6">
            <div className="mb-2 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Customers</h3>
            </div>
            <p className="text-3xl font-bold">{analytics.customers.total}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Total customers in CRM
            </p>
          </Card>

          <Card className="p-6">
            <div className="mb-2 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Projects</h3>
            </div>
            <p className="text-3xl font-bold">{analytics.projects.total}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Active and completed projects
            </p>
          </Card>
        </div>
      </div>
    </DetailPage>
  );
}
