"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Play,
  Pause,
  Settings,
  Trash2,
  Activity,
  Clock,
  CheckCircle2,
  TrendingUp,
  Loader2,
  AlertCircle,
  Calendar,
  Webhook,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ExecutionList } from "@/components/agents/execution-list";

type TabView = "overview" | "workflow" | "executions" | "settings";

// Minimal agent type for fields used here
interface AgentExecution {
  id: string;
  status: "pending" | "running" | "completed" | "failed";
  createdAt: string;
  durationMs?: number | null;
}

interface AgentSchedule {
  triggerType: "manual" | "scheduled" | "webhook";
  cron?: string | null;
}

interface AgentData {
  id: string;
  name: string;
  description?: string | null;
  status: "draft" | "active" | "paused";
  version?: string | number;
  schedule?: AgentSchedule | null;
  recentExecutions?: AgentExecution[];
  metrics?: {
    totalRuns?: number;
    successRate?: number; // 0-100
    avgDuration?: number; // ms
  };
}

export default function AgentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [agent, setAgent] = useState<AgentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabView>("overview");

  useEffect(() => {
    async function fetchAgent() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/agents/${params.id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch agent");
        }

        const data = await response.json();
        setAgent(data.agent);
      } catch (err) {
        console.error("Error fetching agent:", err);
        setError(err instanceof Error ? err.message : "Failed to load agent");
        toast.error("Failed to load agent");
      } finally {
        setIsLoading(false);
      }
    }

    fetchAgent();
  }, [params.id]);

  const handleToggleStatus = async () => {
    if (!agent) return;

    const newStatus = agent.status === "active" ? "paused" : "active";

    try {
      const response = await fetch(`/api/agents/${agent.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      const data = await response.json();
      setAgent(data.agent);
      toast.success(`Agent ${newStatus === "active" ? "activated" : "paused"}`);
    } catch (error) {
      toast.error("Failed to update agent status");
    }
  };

  const handleDelete = async () => {
    if (!agent) return;

    if (
      !confirm(
        `Are you sure you want to delete "${agent.name}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/agents/${agent.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete agent");

      toast.success("Agent deleted");
      router.push("/agents");
    } catch (error) {
      toast.error("Failed to delete agent");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <ArrowLeft className="h-5 w-5" />
          <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="space-y-6">
        <Link
          href="/agents"
          className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Agents
        </Link>
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mb-2" />
          <h3 className="font-semibold text-red-900 dark:text-red-100">
            Failed to load agent
          </h3>
          <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  const TriggerIcon =
    agent.schedule?.triggerType === "scheduled"
      ? Calendar
      : agent.schedule?.triggerType === "webhook"
        ? Webhook
        : Clock;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/agents"
          className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Agents
        </Link>

        <PageHeader
          title={agent.name}
          description={agent.description || "No description"}
        >
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleToggleStatus}>
              {agent.status === "active" ? (
                <>
                  <Pause className="h-4 w-4 mr-2" /> Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" /> Activate
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700 dark:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </PageHeader>

        {/* Status Badge */}
        <div className="flex items-center gap-3 mt-4">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
              agent.status === "active"
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                : agent.status === "draft"
                  ? "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                  : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
            }`}
          >
            {agent.status}
          </span>
          {agent.schedule && (
            <span className="inline-flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400">
              {TriggerIcon && <TriggerIcon className="h-4 w-4" />}
              {agent.schedule.triggerType === "scheduled" &&
                agent.schedule.cron}
              {agent.schedule.triggerType === "webhook" && "Webhook"}
              {agent.schedule.triggerType === "manual" && "Manual"}
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200 dark:border-neutral-800">
        <nav className="flex space-x-8">
          {(
            ["overview", "workflow", "executions", "settings"] as TabView[]
          ).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Metrics */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
              <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <Activity className="h-4 w-4" />
                Total Runs
              </div>
              <div className="mt-2 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                {agent.metrics?.totalRuns ?? 0}
              </div>
            </div>
            <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
              <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <CheckCircle2 className="h-4 w-4" />
                Success Rate
              </div>
              <div className="mt-2 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                {`${Math.round(agent.metrics?.successRate ?? 0)}%`}
              </div>
            </div>
            <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
              <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <Clock className="h-4 w-4" />
                Avg Duration
              </div>
              <div className="mt-2 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                {`${(((agent.metrics?.avgDuration ?? 0) as number) / 1000).toFixed(1)}s`}
              </div>
            </div>
            <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
              <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <TrendingUp className="h-4 w-4" />
                Version
              </div>
              <div className="mt-2 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                {String(agent.version ?? "—")}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Recent Activity
            </h3>
            {agent.recentExecutions && agent.recentExecutions.length > 0 ? (
              <div className="space-y-3">
                {agent.recentExecutions.map((execution) => (
                  <div
                    key={execution.id}
                    className="flex items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-800 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      {execution.status === "completed" ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                      ) : execution.status === "failed" ? (
                        <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                      ) : (
                        <Clock className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                      )}
                      <span className="text-sm text-neutral-900 dark:text-neutral-100 capitalize">
                        {execution.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-neutral-600 dark:text-neutral-400">
                      {execution.durationMs && (
                        <span>{(execution.durationMs / 1000).toFixed(1)}s</span>
                      )}
                      <span>
                        {new Date(execution.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center py-8">
                No executions yet
              </p>
            )}
          </div>
        </div>
      )}

      {activeTab === "workflow" && (
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
          <p className="text-neutral-600 dark:text-neutral-400">
            Workflow visualization coming soon
          </p>
        </div>
      )}

      {activeTab === "executions" && agent && (
        <div className="space-y-6">
          <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
            <ExecutionList agentId={agent.id} agentName={agent.name} />
          </div>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
          <p className="text-neutral-600 dark:text-neutral-400">
            Settings coming soon
          </p>
        </div>
      )}
    </div>
  );
}
