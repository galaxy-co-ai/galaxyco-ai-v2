"use client";

import React, { useState } from "react";
import { ListPage } from "@/components/templates/list-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Users, Bot, Database, Plus } from "lucide-react";

interface Workspace {
  id: string;
  name: string;
  plan: "free" | "pro" | "enterprise";
  users: number;
  agents: number;
  storage: string;
  created: string;
  status: "active" | "suspended" | "trial";
}

const mockWorkspaces: Workspace[] = [
  {
    id: "1",
    name: "Acme Corp",
    plan: "enterprise",
    users: 45,
    agents: 28,
    storage: "12.4 GB",
    created: "2024-01-15",
    status: "active",
  },
  {
    id: "2",
    name: "Startup Inc",
    plan: "pro",
    users: 8,
    agents: 12,
    storage: "2.1 GB",
    created: "2024-06-20",
    status: "active",
  },
  {
    id: "3",
    name: "Tech Solutions",
    plan: "free",
    users: 3,
    agents: 3,
    storage: "420 MB",
    created: "2024-09-05",
    status: "trial",
  },
  {
    id: "4",
    name: "Digital Agency",
    plan: "pro",
    users: 12,
    agents: 18,
    storage: "5.8 GB",
    created: "2024-03-10",
    status: "suspended",
  },
];

const planColors = {
  free: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  pro: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  enterprise:
    "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
};

const statusColors = {
  active: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  trial:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  suspended: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

export default function AdminWorkspacesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {},
  );

  const filteredWorkspaces = mockWorkspaces.filter((workspace) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!workspace.name.toLowerCase().includes(query)) {
        return false;
      }
    }

    const planFilter = activeFilters.plan || [];
    if (planFilter.length > 0 && !planFilter.includes(workspace.plan)) {
      return false;
    }

    const statusFilter = activeFilters.status || [];
    if (statusFilter.length > 0 && !statusFilter.includes(workspace.status)) {
      return false;
    }

    return true;
  });

  return (
    <ListPage
      title="Workspace Management"
      subtitle="Manage workspaces and usage"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Admin", href: "/admin" },
        { label: "Workspaces" },
      ]}
      searchQuery={searchQuery}
      searchPlaceholder="Search workspaces..."
      onSearchChange={setSearchQuery}
      showViewToggle={false}
      filters={[
        {
          id: "plan",
          label: "Plan",
          type: "checkbox",
          options: [
            { value: "free", label: "Free" },
            { value: "pro", label: "Pro" },
            { value: "enterprise", label: "Enterprise" },
          ],
        },
        {
          id: "status",
          label: "Status",
          type: "checkbox",
          options: [
            { value: "active", label: "Active" },
            { value: "trial", label: "Trial" },
            { value: "suspended", label: "Suspended" },
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
          Create Workspace
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredWorkspaces.map((workspace) => (
          <div
            key={workspace.id}
            className="rounded-lg border border-border bg-card p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{workspace.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Created {new Date(workspace.created).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <Badge variant="secondary" className={planColors[workspace.plan]}>
                {workspace.plan}
              </Badge>
              <Badge
                variant="secondary"
                className={statusColors[workspace.status]}
              >
                {workspace.status}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
              <div>
                <div className="flex items-center gap-1 text-muted-foreground mb-1">
                  <Users className="h-3.5 w-3.5" />
                  <span className="text-xs">Users</span>
                </div>
                <p className="text-lg font-semibold">{workspace.users}</p>
              </div>
              <div>
                <div className="flex items-center gap-1 text-muted-foreground mb-1">
                  <Bot className="h-3.5 w-3.5" />
                  <span className="text-xs">Agents</span>
                </div>
                <p className="text-lg font-semibold">{workspace.agents}</p>
              </div>
              <div>
                <div className="flex items-center gap-1 text-muted-foreground mb-1">
                  <Database className="h-3.5 w-3.5" />
                  <span className="text-xs">Storage</span>
                </div>
                <p className="text-sm font-semibold">{workspace.storage}</p>
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full mt-4">
              View Details
            </Button>
          </div>
        ))}
      </div>
    </ListPage>
  );
}
