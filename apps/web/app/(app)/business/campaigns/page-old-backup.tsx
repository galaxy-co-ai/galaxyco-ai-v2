"use client";

import { PageShell } from "@/components/templates/page-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Play,
  Pause,
  Mail,
  Users,
  TrendingUp,
  Calendar,
  MoreHorizontal,
} from "lucide-react";
import { useState } from "react";

interface Campaign {
  id: string;
  name: string;
  type: "email" | "social" | "ads";
  status: "active" | "paused" | "completed" | "draft";
  sent: number;
  opens: number;
  clicks: number;
  conversions: number;
  startDate: string;
  budget?: number;
}

const campaigns: Campaign[] = [
  {
    id: "1",
    name: "Q4 Product Launch",
    type: "email",
    status: "active",
    sent: 12450,
    opens: 5823,
    clicks: 1247,
    conversions: 234,
    startDate: "2025-10-01",
  },
  {
    id: "2",
    name: "Holiday Promotion",
    type: "email",
    status: "draft",
    sent: 0,
    opens: 0,
    clicks: 0,
    conversions: 0,
    startDate: "2025-11-15",
  },
  {
    id: "3",
    name: "LinkedIn Ads Campaign",
    type: "ads",
    status: "active",
    sent: 0,
    opens: 0,
    clicks: 3421,
    conversions: 156,
    startDate: "2025-09-15",
    budget: 5000,
  },
  {
    id: "4",
    name: "Customer Winback",
    type: "email",
    status: "completed",
    sent: 8932,
    opens: 3421,
    clicks: 892,
    conversions: 178,
    startDate: "2025-09-01",
  },
];

const statusConfig = {
  active: {
    label: "Active",
    className:
      "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  },
  paused: {
    label: "Paused",
    className:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  },
  completed: {
    label: "Completed",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
  draft: {
    label: "Draft",
    className: "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300",
  },
};

const typeConfig = {
  email: { label: "Email", icon: Mail },
  social: { label: "Social", icon: Users },
  ads: { label: "Ads", icon: TrendingUp },
};

export default function CampaignsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);
  const activeCampaigns = campaigns.filter((c) => c.status === "active").length;

  return (
    <PageShell
      title="Marketing Campaigns"
      subtitle="Manage your marketing campaigns and track performance"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Campaigns" }]}
      actions={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      }
    >
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Campaigns</p>
          <p className="text-2xl font-bold">{campaigns.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground mb-1">Active</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {activeCampaigns}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground mb-1">
            Total Conversions
          </p>
          <p className="text-2xl font-bold">{totalConversions}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground mb-1">Avg Conv. Rate</p>
          <p className="text-2xl font-bold">
            {campaigns.length > 0
              ? (
                  (totalConversions /
                    campaigns.reduce(
                      (sum, c) => sum + (c.sent || c.clicks),
                      0,
                    )) *
                  100
                ).toFixed(1)
              : 0}
            %
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search campaigns..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Campaigns Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCampaigns.map((campaign) => {
          const TypeIcon = typeConfig[campaign.type].icon;
          const openRate = campaign.sent
            ? ((campaign.opens / campaign.sent) * 100).toFixed(1)
            : 0;
          const clickRate = campaign.opens
            ? ((campaign.clicks / campaign.opens) * 100).toFixed(1)
            : campaign.clicks > 0
              ? "N/A"
              : 0;

          return (
            <div
              key={campaign.id}
              className="rounded-lg border border-border bg-card p-6 hover:border-primary hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold mb-1 truncate">
                    {campaign.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <TypeIcon className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {typeConfig[campaign.type].label}
                    </span>
                  </div>
                </div>
                <Badge className={statusConfig[campaign.status].className}>
                  {statusConfig[campaign.status].label}
                </Badge>
              </div>

              {/* Metrics */}
              <div className="space-y-3 mb-4">
                {campaign.sent > 0 && (
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Sent</span>
                      <span className="font-semibold">
                        {campaign.sent.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Open Rate</span>
                      <span className="font-semibold">{openRate}%</span>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Clicks</span>
                  <span className="font-semibold">
                    {campaign.clicks.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Conversions</span>
                  <span className="font-semibold text-primary">
                    {campaign.conversions}
                  </span>
                </div>
                {campaign.budget && (
                  <div className="flex items-center justify-between text-sm pt-2 border-t border-border">
                    <span className="text-muted-foreground">Budget</span>
                    <span className="font-semibold">
                      ${campaign.budget.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-border">
                <Button size="sm" variant="outline" className="flex-1">
                  {campaign.status === "active" ? (
                    <>
                      <Pause className="h-3 w-3 mr-1" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3 mr-1" />
                      Start
                    </>
                  )}
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  View
                </Button>
                <Button size="sm" variant="outline">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredCampaigns.length === 0 && (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <Mail className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No campaigns found</h3>
          <p className="text-muted-foreground mb-4">
            Create your first campaign to start engaging customers
          </p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        </div>
      )}
    </PageShell>
  );
}
