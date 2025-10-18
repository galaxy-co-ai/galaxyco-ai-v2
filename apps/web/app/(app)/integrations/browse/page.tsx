"use client";

import { PageShell } from "@/components/templates/page-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Plus, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  installs: number;
  icon: string;
}

const integrations: Integration[] = [
  {
    id: "1",
    name: "Salesforce",
    description: "Sync leads and contacts with Salesforce CRM",
    category: "CRM",
    rating: 4.8,
    installs: 12500,
    icon: "🔵",
  },
  {
    id: "2",
    name: "Slack",
    description: "Send notifications and messages to Slack channels",
    category: "Communication",
    rating: 4.9,
    installs: 23400,
    icon: "💬",
  },
  {
    id: "3",
    name: "HubSpot",
    description: "Connect with HubSpot for marketing automation",
    category: "Marketing",
    rating: 4.7,
    installs: 8900,
    icon: "🧡",
  },
  {
    id: "4",
    name: "Stripe",
    description: "Process payments and manage subscriptions",
    category: "Payments",
    rating: 4.9,
    installs: 15600,
    icon: "💳",
  },
  {
    id: "5",
    name: "Google Sheets",
    description: "Export data to Google Sheets automatically",
    category: "Productivity",
    rating: 4.6,
    installs: 19200,
    icon: "📊",
  },
  {
    id: "6",
    name: "Zapier",
    description: "Connect to 5000+ apps via Zapier automation",
    category: "Automation",
    rating: 4.8,
    installs: 31000,
    icon: "⚡",
  },
];

export default function BrowseIntegrationsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredIntegrations = integrations.filter((integration) =>
    integration.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleInstall = (name: string) => {
    toast.success(`${name} integration added`);
  };

  return (
    <PageShell
      title="Browse Integrations"
      subtitle="Discover and install integrations from the marketplace"
      breadcrumbs={[
        { label: "Integrations", href: "/integrations" },
        { label: "Browse" },
      ]}
    >
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search integrations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredIntegrations.map((integration) => (
          <div
            key={integration.id}
            className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="text-4xl">{integration.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{integration.name}</h3>
                <Badge variant="outline" className="text-xs">
                  {integration.category}
                </Badge>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              {integration.description}
            </p>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{integration.rating}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {integration.installs.toLocaleString()} installs
              </span>
            </div>

            <Button
              className="w-full"
              size="sm"
              onClick={() => handleInstall(integration.name)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Install
            </Button>
          </div>
        ))}
      </div>

      {filteredIntegrations.length === 0 && (
        <div className="rounded-lg border bg-card p-12 text-center">
          <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No integrations found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search query
          </p>
        </div>
      )}
    </PageShell>
  );
}
