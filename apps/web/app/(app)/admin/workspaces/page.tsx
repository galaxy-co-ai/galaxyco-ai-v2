"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ListPage } from "@/components/templates/list-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Users, Bot, Database, Plus } from "lucide-react";

interface AdminWorkspace {
  id: string;
  name: string;
  slug: string | null;
  subscriptionTier: string | null;
  subscriptionStatus: string | null;
  isActive: boolean | null;
  createdAt: string;
  members?: Array<{ userId: string }>;
}

export default function AdminWorkspacesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {},
  );
  const [workspaces, setWorkspaces] = useState<AdminWorkspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchWorkspaces() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/admin/workspaces?limit=100`);
        if (!res.ok) throw new Error("Failed to fetch workspaces");
        const json = await res.json();
        setWorkspaces(json.workspaces || []);
      } catch (e) {
        console.error("Failed to load workspaces", e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchWorkspaces();
  }, []);

  const rows = useMemo(() => {
    return workspaces.map((w) => ({
      id: w.id,
      name: w.name,
      plan: (w.subscriptionTier as "free" | "pro" | "enterprise") || "free",
      users: w.members?.length || 0,
      agents: 0,
      storage: "—",
      created: w.createdAt,
      status: w.isActive ? "active" : "suspended",
    }));
  }, [workspaces]);

  const filteredWorkspaces = rows.filter((workspace) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = q === "" || workspace.name.toLowerCase().includes(q);

    const planFilter = activeFilters.plan || [];
    const statusFilter = activeFilters.status || [];
    const matchesPlan =
      planFilter.length === 0 || planFilter.includes(workspace.plan);
    const matchesStatus =
      statusFilter.length === 0 || statusFilter.includes(workspace.status);

    return matchesSearch && matchesPlan && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );
  }

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
              <Badge
                variant="secondary"
                className={
                  workspace.plan === "enterprise"
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                    : workspace.plan === "pro"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                }
              >
                {workspace.plan}
              </Badge>
              <Badge
                variant="secondary"
                className={
                  workspace.status === "active"
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                }
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
