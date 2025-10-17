"use client";

import { DetailPage } from "@/components/templates/detail-page";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  TrendingUp,
  Target,
  Users,
  Calendar,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";

// Mock data for sales dashboard
const salesMetrics = [
  {
    label: "Total Revenue",
    value: "$142,350",
    change: "+12.5% from last month",
    trend: "up" as const,
    icon: <DollarSign className="h-5 w-5" />,
  },
  {
    label: "Deals Won",
    value: "47",
    change: "+8 this month",
    trend: "up" as const,
    icon: <TrendingUp className="h-5 w-5" />,
  },
  {
    label: "Pipeline Value",
    value: "$324,150",
    change: "+18.2% from last month",
    trend: "up" as const,
    icon: <Target className="h-5 w-5" />,
  },
  {
    label: "Active Prospects",
    value: "183",
    change: "+23 this week",
    trend: "up" as const,
    icon: <Users className="h-5 w-5" />,
  },
];

const pipelineStages = [
  { stage: "Lead", count: 42, value: "$89,400", color: "bg-blue-500" },
  { stage: "Qualified", count: 28, value: "$124,800", color: "bg-yellow-500" },
  { stage: "Proposal", count: 15, value: "$78,900", color: "bg-orange-500" },
  { stage: "Negotiation", count: 8, value: "$45,600", color: "bg-purple-500" },
  { stage: "Closed Won", count: 12, value: "$89,250", color: "bg-green-500" },
];

const recentDeals = [
  {
    id: "1",
    company: "Acme Corp",
    contact: "John Smith",
    value: "$15,000",
    stage: "Negotiation",
    probability: 85,
    closingDate: "2025-10-25",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=JS",
  },
  {
    id: "2",
    company: "TechFlow Inc",
    contact: "Sarah Johnson",
    value: "$32,500",
    stage: "Proposal",
    probability: 65,
    closingDate: "2025-10-30",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=SJ",
  },
  {
    id: "3",
    company: "Global Solutions",
    contact: "Mike Davis",
    value: "$8,750",
    stage: "Qualified",
    probability: 45,
    closingDate: "2025-11-05",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=MD",
  },
  {
    id: "4",
    company: "Innovate Labs",
    contact: "Emma Wilson",
    value: "$24,800",
    stage: "Closed Won",
    probability: 100,
    closingDate: "2025-10-15",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=EW",
  },
];

const topPerformers = [
  {
    name: "Alex Rodriguez",
    deals: 12,
    revenue: "$89,250",
    winRate: 92,
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=AR",
  },
  {
    name: "Lisa Chen",
    deals: 8,
    revenue: "$67,400",
    winRate: 87,
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=LC",
  },
  {
    name: "David Park",
    deals: 10,
    revenue: "$54,300",
    winRate: 83,
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=DP",
  },
];

function PipelineOverview() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Pipeline Stages */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Pipeline by Stage</h3>
          <div className="space-y-4">
            {pipelineStages.map((stage, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${stage.color}`} />
                  <span className="text-sm font-medium">{stage.stage}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{stage.value}</p>
                  <p className="text-xs text-muted-foreground">
                    {stage.count} deals
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Performers */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Top Performers</h3>
          <div className="space-y-4">
            {topPerformers.map((performer, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={performer.avatar}
                    alt={performer.name}
                    fallback={performer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                    size="sm"
                  />
                  <div>
                    <p className="text-sm font-medium">{performer.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {performer.deals} deals
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{performer.revenue}</p>
                  <p className="text-xs text-success">
                    {performer.winRate}% win rate
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function RecentDeals() {
  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recent Deals</h3>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>
      <div className="space-y-4">
        {recentDeals.map((deal) => (
          <div
            key={deal.id}
            className="flex items-center justify-between rounded-lg border border-border p-4"
          >
            <div className="flex items-center gap-4">
              <Avatar
                src={deal.avatar}
                alt={deal.contact}
                fallback={deal.contact
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              />
              <div>
                <p className="text-sm font-medium">{deal.company}</p>
                <p className="text-xs text-muted-foreground">{deal.contact}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-semibold">{deal.value}</p>
                <p className="text-xs text-muted-foreground">
                  {deal.closingDate}
                </p>
              </div>
              <div className="w-20">
                <Progress value={deal.probability} className="h-2" />
                <p className="mt-1 text-xs text-center text-muted-foreground">
                  {deal.probability}%
                </p>
              </div>
              <Badge
                variant="secondary"
                className="min-w-[80px] justify-center"
              >
                {deal.stage}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function Activities() {
  const activities = [
    {
      id: "1",
      type: "call",
      contact: "John Smith",
      company: "Acme Corp",
      time: "10:30 AM",
      status: "completed",
    },
    {
      id: "2",
      type: "email",
      contact: "Sarah Johnson",
      company: "TechFlow Inc",
      time: "2:15 PM",
      status: "sent",
    },
    {
      id: "3",
      type: "meeting",
      contact: "Mike Davis",
      company: "Global Solutions",
      time: "4:00 PM",
      status: "scheduled",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "call":
        return <Phone className="h-4 w-4" />;
      case "email":
        return <Mail className="h-4 w-4" />;
      case "meeting":
        return <Calendar className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-semibold">Today&apos;s Activities</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">
                {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}{" "}
                with {activity.contact}
              </p>
              <p className="text-xs text-muted-foreground">
                {activity.company}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm">{activity.time}</p>
              <Badge
                variant={
                  activity.status === "completed" ? "default" : "secondary"
                }
                className="text-xs"
              >
                {activity.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function SalesPage() {
  const tabs = [
    {
      id: "overview",
      label: "Overview",
      content: <PipelineOverview />,
    },
    {
      id: "deals",
      label: "Recent Deals",
      badge: recentDeals.length,
      content: <RecentDeals />,
    },
    {
      id: "activities",
      label: "Activities",
      content: <Activities />,
    },
  ];

  return (
    <DetailPage
      title="Sales Dashboard"
      subtitle="Track your sales performance and pipeline"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Sales" }]}
      actions={
        <div className="flex gap-2">
          <Button variant="outline">
            <MapPin className="mr-2 h-4 w-4" />
            View Map
          </Button>
          <Button>
            <Users className="mr-2 h-4 w-4" />
            Add Deal
          </Button>
        </div>
      }
      metrics={salesMetrics}
      tabs={tabs}
      defaultTab="overview"
    />
  );
}
