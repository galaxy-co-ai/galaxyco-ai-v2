"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Bot,
  Plus,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { MetricCard } from "@/components/agents/metric-card";
import { AgentFilters } from "@/components/agents/agent-filters";
import { useWorkspace } from "@/contexts/workspace-context";
import type { AgentWithSchedule, AgentStatus } from "@/lib/agents/types";
import { toast } from "sonner";

export default function AgentsPage() {
  const { currentWorkspace } = useWorkspace();

  // State
  const [agents, setAgents] = useState<AgentWithSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<AgentStatus[]>([]);
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>(
    [],
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
        console.error("Error fetching agents:", err);
        const message =
          err instanceof Error ? err.message : "Failed to load agents";
        setError(message);
        toast.error(message);
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

  // Get unique integrations for filter
  const availableIntegrations = useMemo(() => {
    const integrations = new Set<string>();
    agents.forEach((agent) => {
      const config = agent.config as any;
      if (config?.tools) {
        config.tools.forEach((tool: string) => integrations.add(tool));
      }
    });
    return Array.from(integrations).sort();
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
      if (
        selectedStatuses.length > 0 &&
        !selectedStatuses.includes(agent.status)
      ) {
        return false;
      }

      // Integration filter
      if (selectedIntegrations.length > 0) {
        const config = agent.config as any;
        const agentTools = config?.tools || [];
        const hasMatchingIntegration = selectedIntegrations.some(
          (integration) => agentTools.includes(integration),
        );
        if (!hasMatchingIntegration) return false;
      }

      return true;
    });
  }, [agents, searchQuery, selectedStatuses, selectedIntegrations]);

  // Filter handlers
  const handleStatusToggle = (status: AgentStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    );
  };

  const handleIntegrationToggle = (integration: string) => {
    setSelectedIntegrations((prev) =>
      prev.includes(integration)
        ? prev.filter((i) => i !== integration)
        : [...prev, integration],
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="AI Agents"
          description="Manage and monitor your autonomous AI agents"
        />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="AI Agents"
          description="Manage and monitor your autonomous AI agents"
        />
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-100">
                Failed to load agents
              </h3>
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="AI Agents"
        description="Manage and monitor your autonomous AI agents"
      >
        <Link href="/agents/new">
          <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
            <Plus className="h-4 w-4" />
            Create Agent
          </button>
        </Link>
      </PageHeader>

      {/* Metrics */}
      {agents.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* Filters */}
      {agents.length > 0 && (
        <AgentFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedStatuses={selectedStatuses}
          onStatusToggle={handleStatusToggle}
          selectedIntegrations={selectedIntegrations}
          onIntegrationToggle={handleIntegrationToggle}
          availableIntegrations={availableIntegrations}
        />
      )}

      {/* Content */}
      {agents.length === 0 ? (
        <EmptyState
          icon={Bot}
          title="No agents yet"
          description="Create your first AI agent to start automating tasks"
          action={{
            label: "Create Agent",
            onClick: () => (window.location.href = "/agents/new"),
          }}
        />
      ) : filteredAgents.length === 0 ? (
        <EmptyState
          icon={Bot}
          title="No agents found"
          description="Try adjusting your search or filters"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAgents.map((agent) => (
            <Link
              key={agent.id}
              href={`/agents/${agent.id}`}
              className="group rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 transition-all hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-primary transition-colors">
                      {agent.name}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 capitalize">
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

              <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-4">
                {agent.description || "No description"}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    Runs
                  </p>
                  <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    {agent.executionCount || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    Version
                  </p>
                  <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    {agent.version}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
