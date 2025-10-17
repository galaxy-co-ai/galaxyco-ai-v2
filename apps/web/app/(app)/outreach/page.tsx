"use client";

import { ListPage } from "@/components/templates/list-page";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Send,
  Mail,
  Phone,
  Users,
  Calendar,
  MoreHorizontal,
  Play,
  Pause,
  BarChart3,
  Target,
} from "lucide-react";
import { useState } from "react";

// Mock data for outreach campaigns
const outreachCampaigns = [
  {
    id: "1",
    name: "Enterprise Prospect Outreach",
    type: "Email Sequence",
    status: "active",
    contacts: 245,
    sent: 1420,
    opened: 687,
    replied: 89,
    scheduled: 23,
    createdDate: "2025-10-01",
    lastActivity: "2 hours ago",
    owner: {
      name: "Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=SJ",
    },
    tags: ["enterprise", "b2b"],
  },
  {
    id: "2",
    name: "Product Demo Follow-up",
    type: "Mixed Sequence",
    status: "active",
    contacts: 156,
    sent: 624,
    opened: 312,
    replied: 45,
    scheduled: 12,
    createdDate: "2025-09-15",
    lastActivity: "1 day ago",
    owner: {
      name: "Alex Rodriguez",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=AR",
    },
    tags: ["demo", "follow-up"],
  },
  {
    id: "3",
    name: "Cold LinkedIn Outreach",
    type: "Social Sequence",
    status: "paused",
    contacts: 89,
    sent: 267,
    opened: 134,
    replied: 18,
    scheduled: 5,
    createdDate: "2025-09-28",
    lastActivity: "3 days ago",
    owner: {
      name: "Mike Davis",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=MD",
    },
    tags: ["linkedin", "cold"],
  },
  {
    id: "4",
    name: "Customer Success Check-in",
    type: "Email Sequence",
    status: "active",
    contacts: 320,
    sent: 960,
    opened: 576,
    replied: 124,
    scheduled: 8,
    createdDate: "2025-10-05",
    lastActivity: "4 hours ago",
    owner: {
      name: "Emma Wilson",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=EW",
    },
    tags: ["customer-success", "retention"],
  },
  {
    id: "5",
    name: "Partnership Opportunities",
    type: "Phone Sequence",
    status: "draft",
    contacts: 67,
    sent: 0,
    opened: 0,
    replied: 0,
    scheduled: 0,
    createdDate: "2025-10-12",
    lastActivity: "Never",
    owner: {
      name: "David Park",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=DP",
    },
    tags: ["partnership", "b2b"],
  },
  {
    id: "6",
    name: "Webinar Attendee Nurture",
    type: "Email Sequence",
    status: "completed",
    contacts: 189,
    sent: 756,
    opened: 453,
    replied: 78,
    scheduled: 34,
    createdDate: "2025-08-20",
    lastActivity: "2 weeks ago",
    owner: {
      name: "Lisa Chen",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=LC",
    },
    tags: ["webinar", "nurture"],
  },
];

const getSequenceIcon = (type: string) => {
  switch (type) {
    case "Email Sequence":
      return <Mail className="h-4 w-4" />;
    case "Phone Sequence":
      return <Phone className="h-4 w-4" />;
    case "Mixed Sequence":
      return <Send className="h-4 w-4" />;
    case "Social Sequence":
      return <Users className="h-4 w-4" />;
    default:
      return <Mail className="h-4 w-4" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge variant="default">Active</Badge>;
    case "paused":
      return <Badge variant="secondary">Paused</Badge>;
    case "draft":
      return <Badge variant="outline">Draft</Badge>;
    case "completed":
      return <Badge variant="secondary">Completed</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

function CampaignCard({
  campaign,
}: {
  campaign: (typeof outreachCampaigns)[0];
}) {
  const openRate =
    campaign.sent > 0
      ? ((campaign.opened / campaign.sent) * 100).toFixed(1)
      : "0";
  const replyRate =
    campaign.sent > 0
      ? ((campaign.replied / campaign.sent) * 100).toFixed(1)
      : "0";

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            {getSequenceIcon(campaign.type)}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">{campaign.name}</h3>
            <div className="flex items-center gap-2 mb-2">
              {getStatusBadge(campaign.status)}
              <Badge variant="outline" className="text-xs">
                {campaign.type}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{campaign.contacts} contacts</span>
              <span>•</span>
              <span>Created {campaign.createdDate}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {campaign.status === "active" && (
            <Button variant="outline" size="sm">
              <Pause className="h-4 w-4" />
            </Button>
          )}
          {campaign.status === "paused" && (
            <Button variant="outline" size="sm">
              <Play className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-4 p-4 bg-muted/30 rounded-lg">
        <div className="text-center">
          <p className="text-lg font-semibold">{campaign.sent}</p>
          <p className="text-xs text-muted-foreground">Sent</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold">{openRate}%</p>
          <p className="text-xs text-muted-foreground">Open Rate</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold">{replyRate}%</p>
          <p className="text-xs text-muted-foreground">Reply Rate</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold">{campaign.scheduled}</p>
          <p className="text-xs text-muted-foreground">Meetings</p>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span>Opens</span>
          <span>
            {campaign.opened} / {campaign.sent}
          </span>
        </div>
        <Progress
          value={
            campaign.sent > 0 ? (campaign.opened / campaign.sent) * 100 : 0
          }
          className="h-2"
        />

        <div className="flex items-center justify-between text-sm">
          <span>Replies</span>
          <span>
            {campaign.replied} / {campaign.sent}
          </span>
        </div>
        <Progress
          value={
            campaign.sent > 0 ? (campaign.replied / campaign.sent) * 100 : 0
          }
          className="h-2"
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-2">
          <Avatar
            src={campaign.owner.avatar}
            alt={campaign.owner.name}
            fallback={campaign.owner.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
            size="xs"
          />
          <span className="text-sm text-muted-foreground">
            {campaign.owner.name}
          </span>
        </div>
        <div className="flex gap-1">
          {campaign.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}

export default function OutreachPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {},
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter campaigns based on search and filters
  const filteredCampaigns = outreachCampaigns.filter((campaign) => {
    const matchesSearch =
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.owner.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      !activeFilters.status?.length ||
      activeFilters.status.includes(campaign.status);

    const matchesType =
      !activeFilters.type?.length || activeFilters.type.includes(campaign.type);

    return matchesSearch && matchesStatus && matchesType;
  });

  const filters = [
    {
      id: "status",
      label: "Status",
      type: "checkbox" as const,
      options: [
        {
          value: "active",
          label: "Active",
          count: outreachCampaigns.filter((c) => c.status === "active").length,
        },
        {
          value: "paused",
          label: "Paused",
          count: outreachCampaigns.filter((c) => c.status === "paused").length,
        },
        {
          value: "draft",
          label: "Draft",
          count: outreachCampaigns.filter((c) => c.status === "draft").length,
        },
        {
          value: "completed",
          label: "Completed",
          count: outreachCampaigns.filter((c) => c.status === "completed")
            .length,
        },
      ],
    },
    {
      id: "type",
      label: "Type",
      type: "checkbox" as const,
      options: [
        {
          value: "Email Sequence",
          label: "Email Sequence",
          count: outreachCampaigns.filter((c) => c.type === "Email Sequence")
            .length,
        },
        {
          value: "Phone Sequence",
          label: "Phone Sequence",
          count: outreachCampaigns.filter((c) => c.type === "Phone Sequence")
            .length,
        },
        {
          value: "Mixed Sequence",
          label: "Mixed Sequence",
          count: outreachCampaigns.filter((c) => c.type === "Mixed Sequence")
            .length,
        },
        {
          value: "Social Sequence",
          label: "Social Sequence",
          count: outreachCampaigns.filter((c) => c.type === "Social Sequence")
            .length,
        },
      ],
    },
  ];

  const handleFilterChange = (filterId: string, values: string[]) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterId]: values,
    }));
  };

  const handleClearFilters = () => {
    setActiveFilters({});
  };

  return (
    <ListPage
      title="Outreach Campaigns"
      subtitle="Manage and track your outreach sequences"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Outreach" }]}
      searchQuery={searchQuery}
      searchPlaceholder="Search campaigns..."
      onSearchChange={setSearchQuery}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      filters={filters}
      activeFilters={activeFilters}
      onFilterChange={handleFilterChange}
      onClearFilters={handleClearFilters}
      toolbarActions={
        <div className="flex gap-2">
          <Button variant="outline">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </Button>
          <Button>
            <Target className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        </div>
      }
    >
      <div
        className={`${
          viewMode === "grid"
            ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            : "space-y-4"
        }`}
      >
        {filteredCampaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>

      {filteredCampaigns.length === 0 && (
        <Card className="p-12 text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <Target className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">No campaigns found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchQuery || Object.keys(activeFilters).length > 0
              ? "Try adjusting your search or filters"
              : "Create your first outreach campaign to get started"}
          </p>
          {!searchQuery && Object.keys(activeFilters).length === 0 && (
            <Button>
              <Target className="mr-2 h-4 w-4" />
              Create Campaign
            </Button>
          )}
        </Card>
      )}
    </ListPage>
  );
}
