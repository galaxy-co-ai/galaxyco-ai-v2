"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Bot, Plus, Activity, TrendingUp, CheckCircle2 } from "lucide-react";
import { ListPage } from "@/components/templates/list-page";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/agents/metric-card";
import { useWorkspace } from "@/contexts/workspace-context";
import type { AgentWithSchedule, AgentStatus } from "@/lib/agents/types";
import { toast } from "sonner";
import { logger } from "@/lib/utils/logger";

export default function AgentsPage() {
  const { currentWorkspace } = useWorkspace();

  // State
  const [agents, setAgents] = useState<AgentWithSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {},
  );

  // Fetch agents
  useEffect(() => {
    async function fetchAgents() {
      if (!currentWorkspace?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `/api/agents?workspaceId=${currentWorkspace.id}`,
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch agents");
        }

        const data = await response.json();
        setAgents(data.agents || []);
      } catch (err) {
        logger.error("Failed to fetch agents", {
          error: err instanceof Error ? err.message : String(err),
          workspaceId: currentWorkspace?.id,
        });
        setError(
          err instanceof Error ? err : new Error("Failed to load agents"),
        );
        toast.error(
          err instanceof Error ? err.message : "Failed to load agents",
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchAgents();
  }, [currentWorkspace?.id]);

  // Compute metrics
  const metrics = useMemo(() => {
    const total = agents.length;
    const active = agents.filter((a) => a.status === "active").length;
    const totalRuns = agents.reduce(
      (sum, a) => sum + (a.executionCount || 0),
      0,
    );

    // Calculate success rate (would come from executions in production)
    const successRate = agents.length > 0 ? 85 : 0; // Placeholder

    return {
      total,
      active,
      totalRuns,
      successRate,
    };
  }, [agents]);

  // Filter agents
  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = agent.name.toLowerCase().includes(query);
        const matchesDescription = agent.description
          ?.toLowerCase()
          .includes(query);
        if (!matchesName && !matchesDescription) return false;
      }

      // Status filter
      const statusFilter = activeFilters.status || [];
      if (statusFilter.length > 0 && !statusFilter.includes(agent.status)) {
        return false;
      }

      return true;
    });
  }, [agents, searchQuery, activeFilters]);

  // Filter handlers
  const handleFilterChange = (filterId: string, values: string[]) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterId]: values,
    }));
  };

  const handleClearFilters = () => {
    setActiveFilters({});
    setSearchQuery("");
  };

  return (
    <>
      {/* Metrics Row */}
      {!isLoading && agents.length > 0 && (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Total Agents" value={metrics.total} icon={Bot} />
          <MetricCard label="Active" value={metrics.active} icon={Activity} />
          <MetricCard
            label="Total Runs"
            value={metrics.totalRuns.toLocaleString()}
            icon={TrendingUp}
          />
          <MetricCard
            label="Success Rate"
            value={`${metrics.successRate}%`}
            icon={CheckCircle2}
          />
        </div>
      )}

      <ListPage
        title="AI Agents"
        subtitle="Manage and monitor your autonomous AI agents"
        breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Agents" }]}
        searchQuery={searchQuery}
        searchPlaceholder="Search agents by name or description..."
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        filters={[
          {
            id: "status",
            label: "Status",
            type: "checkbox",
            options: [
              { value: "active", label: "Active" },
              { value: "draft", label: "Draft" },
              { value: "paused", label: "Paused" },
              { value: "archived", label: "Archived" },
            ],
          },
        ]}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        actions={
          <Link href="/agents/new">
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Create Agent
            </Button>
          </Link>
        }
        isLoading={isLoading}
        error={error}
        isEmpty={!isLoading && agents.length === 0}
        emptyMessage="No agents yet. Create your first AI agent to start automating tasks."
        emptyAction={
          <Link href="/agents/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Agent
            </Button>
          </Link>
        }
      >
        {filteredAgents.length === 0 && agents.length > 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No agents match your search or filters
            </p>
            <Button variant="outline" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAgents.map((agent) => (
              <Link
                key={agent.id}
                href={`/agents/${agent.id}`}
                className="group rounded-lg border border-border bg-card p-5 transition-all hover:shadow-md hover:border-primary/50"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        {agent.name}
                      </h3>
                      <p className="text-sm text-muted-foreground capitalize">
                        {agent.type}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      agent.status === "active"
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : agent.status === "draft"
                          ? "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                          : agent.status === "paused"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                            : "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                    }`}
                  >
                    {agent.status}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {agent.description || "No description"}
                </p>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">Runs</p>
                    <p className="text-lg font-semibold">
                      {agent.executionCount || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Version</p>
                    <p className="text-lg font-semibold">{agent.version}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </ListPage>
    </>
  );
}
