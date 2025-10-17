"use client";

import { useState } from "react";
import { ListPage } from "@/components/templates/list-page";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Settings,
  ExternalLink,
  Zap,
  Database,
  Mail,
  MessageSquare,
  Calendar,
  FileText,
} from "lucide-react";

// Mock data for integrations
const mockIntegrations = [
  {
    id: "1",
    name: "Slack",
    category: "communication",
    description:
      "Send notifications and alerts to Slack channels for team collaboration",
    icon: <MessageSquare className="h-8 w-8" />,
    status: "connected",
    features: ["Notifications", "Alerts", "Team Chat"],
    setupTime: "5 minutes",
  },
  {
    id: "2",
    name: "Google Calendar",
    category: "productivity",
    description:
      "Sync events and schedule meetings directly from your workspace",
    icon: <Calendar className="h-8 w-8" />,
    status: "connected",
    features: ["Calendar Sync", "Event Creation", "Reminders"],
    setupTime: "3 minutes",
  },
  {
    id: "3",
    name: "Salesforce",
    category: "crm",
    description:
      "Connect with Salesforce CRM to sync contacts, leads, and opportunities",
    icon: <Database className="h-8 w-8" />,
    status: "available",
    features: ["Contact Sync", "Lead Management", "Opportunities"],
    setupTime: "10 minutes",
  },
  {
    id: "4",
    name: "Gmail",
    category: "communication",
    description:
      "Send and receive emails, manage your inbox from within the platform",
    icon: <Mail className="h-8 w-8" />,
    status: "connected",
    features: ["Email Sending", "Inbox Management", "Templates"],
    setupTime: "5 minutes",
  },
  {
    id: "5",
    name: "Zapier",
    category: "automation",
    description: "Connect to 5000+ apps with Zapier to automate workflows",
    icon: <Zap className="h-8 w-8" />,
    status: "available",
    features: ["Workflow Automation", "5000+ Apps", "Custom Triggers"],
    setupTime: "15 minutes",
  },
  {
    id: "6",
    name: "HubSpot",
    category: "crm",
    description:
      "Integrate with HubSpot CRM for marketing and sales automation",
    icon: <Database className="h-8 w-8" />,
    status: "available",
    features: ["Marketing Automation", "Sales Pipeline", "Analytics"],
    setupTime: "10 minutes",
  },
  {
    id: "7",
    name: "Notion",
    category: "productivity",
    description: "Connect Notion databases and pages for knowledge management",
    icon: <FileText className="h-8 w-8" />,
    status: "available",
    features: ["Database Sync", "Page Creation", "Collaboration"],
    setupTime: "8 minutes",
  },
  {
    id: "8",
    name: "Microsoft Teams",
    category: "communication",
    description: "Send messages and notifications to Microsoft Teams channels",
    icon: <MessageSquare className="h-8 w-8" />,
    status: "available",
    features: ["Team Messaging", "File Sharing", "Video Calls"],
    setupTime: "5 minutes",
  },
];

const categoryOptions = [
  { value: "all", label: "All Categories" },
  { value: "communication", label: "Communication" },
  { value: "productivity", label: "Productivity" },
  { value: "crm", label: "CRM" },
  { value: "automation", label: "Automation" },
];

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "connected", label: "Connected" },
  { value: "available", label: "Available" },
];

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState(mockIntegrations);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter integrations based on search and filters
  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch =
      searchQuery === "" ||
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || integration.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || integration.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const renderIntegrationCard = (integration: (typeof mockIntegrations)[0]) => {
    const isConnected = integration.status === "connected";

    const categoryColors = {
      communication: "default",
      productivity: "secondary",
      crm: "default",
      automation: "outline",
    } as const;

    return (
      <div
        key={integration.id}
        className="group relative rounded-lg border border-border bg-card p-6 hover:border-primary/50 hover:shadow-md transition-all"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {integration.icon}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{integration.name}</h3>
              <Badge
                variant={
                  categoryColors[
                    integration.category as keyof typeof categoryColors
                  ]
                }
                className="mt-1"
              >
                {integration.category.charAt(0).toUpperCase() +
                  integration.category.slice(1)}
              </Badge>
            </div>
          </div>
          {isConnected && (
            <Badge variant="default" className="gap-1">
              <Check className="h-3 w-3" />
              Connected
            </Badge>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {integration.description}
        </p>

        {/* Features */}
        <div className="space-y-2 mb-4">
          <p className="text-xs font-medium text-muted-foreground">Features:</p>
          <div className="flex flex-wrap gap-1">
            {integration.features.map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <span className="text-xs text-muted-foreground">
            Setup: {integration.setupTime}
          </span>
          <div className="flex gap-2">
            {isConnected ? (
              <>
                <Button variant="outline" size="sm">
                  <Settings className="mr-2 h-4 w-4" />
                  Configure
                </Button>
                <Button variant="outline" size="sm">
                  Disconnect
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Learn More
                </Button>
                <Button size="sm">Connect</Button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <ListPage
      title="Integrations"
      subtitle="Connect your favorite apps and tools"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Integrations" },
      ]}
      searchPlaceholder="Search integrations..."
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      showFilters={false}
      actions={
        <Button variant="outline" size="sm">
          <ExternalLink className="mr-2 h-4 w-4" />
          Request Integration
        </Button>
      }
      viewMode={viewMode}
      onViewModeChange={setViewMode}
    >
      {filteredIntegrations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIntegrations.map((integration) =>
            renderIntegrationCard(integration),
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No integrations found</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setCategoryFilter("all");
              setStatusFilter("all");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </ListPage>
  );
}
