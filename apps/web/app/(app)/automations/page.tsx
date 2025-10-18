"use client";

import React, { useState } from "react";
import { ListPage } from "@/components/templates/list-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Zap, Plus, Play, Pause } from "lucide-react";

interface Automation {
  id: string;
  name: string;
  description: string;
  trigger: string;
  actions: number;
  status: "active" | "inactive";
  executions: number;
  lastRun: string;
}

const mockAutomations: Automation[] = [
  {
    id: "1",
    name: "New Lead Notification",
    description: "Send Slack notification when new lead is created",
    trigger: "Lead Created",
    actions: 2,
    status: "active",
    executions: 342,
    lastRun: "2 minutes ago",
  },
  {
    id: "2",
    name: "Weekly Report Generator",
    description: "Generate and email weekly performance reports",
    trigger: "Schedule: Monday 9am",
    actions: 4,
    status: "active",
    executions: 48,
    lastRun: "3 days ago",
  },
  {
    id: "3",
    name: "Agent Failure Alert",
    description: "Alert team when agent execution fails",
    trigger: "Agent Failed",
    actions: 3,
    status: "inactive",
    executions: 12,
    lastRun: "1 week ago",
  },
];

export default function AutomationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {},
  );
  const [automations, setAutomations] = useState(mockAutomations);

  const toggleStatus = (id: string) => {
    setAutomations((prev) =>
      prev.map((auto) =>
        auto.id === id
          ? {
              ...auto,
              status: auto.status === "active" ? "inactive" : "active",
            }
          : auto,
      ),
    );
  };

  const filteredAutomations = automations.filter((automation) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !automation.name.toLowerCase().includes(query) &&
        !automation.description.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    const statusFilter = activeFilters.status || [];
    if (statusFilter.length > 0 && !statusFilter.includes(automation.status)) {
      return false;
    }

    return true;
  });

  return (
    <ListPage
      title="Automations"
      subtitle="Create and manage workflow automations"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Automations" },
      ]}
      searchQuery={searchQuery}
      searchPlaceholder="Search automations..."
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
          Create Automation
        </Button>
      }
    >
      <div className="space-y-4">
        {filteredAutomations.map((automation) => (
          <div
            key={automation.id}
            className="rounded-lg border border-border bg-card p-6"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold mb-1">{automation.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {automation.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">
                      Trigger: <strong>{automation.trigger}</strong>
                    </span>
                    <span>•</span>
                    <span className="text-muted-foreground">
                      {automation.actions} actions
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {automation.status === "active" ? (
                    <Play className="h-4 w-4 text-green-600" />
                  ) : (
                    <Pause className="h-4 w-4 text-gray-400" />
                  )}
                  <Switch
                    checked={automation.status === "active"}
                    onCheckedChange={() => toggleStatus(automation.id)}
                  />
                </div>
                <Badge
                  variant="secondary"
                  className={
                    automation.status === "active"
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  }
                >
                  {automation.status}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-border text-sm text-muted-foreground">
              <span>{automation.executions} executions</span>
              <span>•</span>
              <span>Last run: {automation.lastRun}</span>
            </div>
          </div>
        ))}
      </div>
    </ListPage>
  );
}
