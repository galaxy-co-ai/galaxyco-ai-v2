"use client";

import React, { useState } from "react";
import { ListPage } from "@/components/templates/list-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Webhook, Plus, Play, MoreHorizontal } from "lucide-react";

interface WebhookType {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: "active" | "inactive";
  lastDelivery: string;
  deliveries: number;
}

const mockWebhooks: WebhookType[] = [
  {
    id: "1",
    name: "Slack Integration",
    url: "https://hooks.slack.com/services/...",
    events: ["agent.created", "agent.executed", "agent.failed"],
    status: "active",
    lastDelivery: "2 minutes ago",
    deliveries: 1247,
  },
  {
    id: "2",
    name: "Analytics Tracker",
    url: "https://analytics.example.com/webhook",
    events: ["execution.completed"],
    status: "active",
    lastDelivery: "15 minutes ago",
    deliveries: 892,
  },
  {
    id: "3",
    name: "Error Monitor",
    url: "https://monitor.example.com/errors",
    events: ["agent.failed", "execution.error"],
    status: "inactive",
    lastDelivery: "3 days ago",
    deliveries: 45,
  },
];

export default function WebhooksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {},
  );

  const filteredWebhooks = mockWebhooks.filter((webhook) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !webhook.name.toLowerCase().includes(query) &&
        !webhook.url.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    const statusFilter = activeFilters.status || [];
    if (statusFilter.length > 0 && !statusFilter.includes(webhook.status)) {
      return false;
    }

    return true;
  });

  return (
    <ListPage
      title="Webhooks"
      subtitle="Manage webhook integrations"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Webhooks" }]}
      searchQuery={searchQuery}
      searchPlaceholder="Search webhooks..."
      onSearchChange={setSearchQuery}
      showViewToggle={false}
      filters={[
        {
          id: "status",
          label: "Status",
          type: "checkbox",
          options: [
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ],
        },
      ]}
      activeFilters={activeFilters}
      onFilterChange={(filterId, values) =>
        setActiveFilters({ ...activeFilters, [filterId]: values })
      }
      onClearFilters={() => {
        setActiveFilters({});
        setSearchQuery("");
      }}
      actions={
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Webhook
        </Button>
      }
    >
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">URL</th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Events
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Last Delivery
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredWebhooks.map((webhook) => (
                <tr
                  key={webhook.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        <Webhook className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium">{webhook.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-xs text-muted-foreground">
                      {webhook.url.substring(0, 40)}...
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {webhook.events.slice(0, 2).map((event, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {event}
                        </Badge>
                      ))}
                      {webhook.events.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{webhook.events.length - 2}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="secondary"
                      className={
                        webhook.status === "active"
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      }
                    >
                      {webhook.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {webhook.lastDelivery}
                    <div className="text-xs">
                      {webhook.deliveries} deliveries
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ListPage>
  );
}
