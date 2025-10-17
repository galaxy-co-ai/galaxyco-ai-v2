"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Play,
  Pause,
  Trash2,
  Activity,
  Clock,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { DetailPage } from "@/components/templates/detail-page";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ExecutionList } from "@/components/agents/execution-list";

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
  const [error, setError] = useState<Error | null>(null);

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
        setError(
          err instanceof Error ? err : new Error("Failed to load agent"),
        );
        toast.error(
          err instanceof Error ? err.message : "Failed to load agent",
        );
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

  // Prepare metrics for DetailPage
  const metrics = agent
    ? [
        {
          label: "Total Runs",
          value: agent.metrics?.totalRuns ?? 0,
          icon: <Activity className="h-5 w-5" />,
        },
        {
          label: "Success Rate",
          value: `${Math.round(agent.metrics?.successRate ?? 0)}%`,
          change:
            agent.metrics?.successRate && agent.metrics.successRate > 90
              ? "+2.4%"
              : undefined,
          trend:
            agent.metrics?.successRate && agent.metrics.successRate > 90
              ? ("up" as const)
              : ("neutral" as const),
          icon: <CheckCircle2 className="h-5 w-5" />,
        },
        {
          label: "Avg Duration",
          value: `${(((agent.metrics?.avgDuration ?? 0) as number) / 1000).toFixed(1)}s`,
          icon: <Clock className="h-5 w-5" />,
        },
        {
          label: "Version",
          value: String(agent.version ?? "—"),
          icon: <TrendingUp className="h-5 w-5" />,
        },
      ]
    : [];

  return (
    <>
      <Link
        href="/agents"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Agents
      </Link>

      <DetailPage
        title={agent?.name || "Agent"}
        subtitle={agent?.description || "No description"}
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Agents", href: "/agents" },
          { label: agent?.name || "Detail" },
        ]}
        actions={
          agent && (
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
                onClick={handleDelete}
                className="text-destructive hover:text-destructive/90"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )
        }
        metrics={metrics}
        tabs={[
          {
            id: "overview",
            label: "Overview",
            content: agent && <OverviewTab agent={agent} />,
          },
          {
            id: "workflow",
            label: "Workflow",
            content: <WorkflowTab />,
          },
          {
            id: "executions",
            label: "Executions",
            badge: agent?.recentExecutions?.length,
            content: agent && <ExecutionsTab agent={agent} />,
          },
          {
            id: "settings",
            label: "Settings",
            content: <SettingsTab />,
          },
        ]}
        isLoading={isLoading}
        error={error}
      />
    </>
  );
}

function OverviewTab({ agent }: { agent: AgentData }) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Recent Activity</h3>
        {agent.recentExecutions && agent.recentExecutions.length > 0 ? (
          <div className="space-y-3">
            {agent.recentExecutions.map((execution) => (
              <div
                key={execution.id}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-3">
                  {execution.status === "completed" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  ) : execution.status === "failed" ? (
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  ) : (
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm capitalize">{execution.status}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {execution.durationMs && (
                    <span>{(execution.durationMs / 1000).toFixed(1)}s</span>
                  )}
                  <span>{new Date(execution.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">
            No executions yet
          </p>
        )}
      </Card>
    </div>
  );
}

function WorkflowTab() {
  return (
    <Card className="p-6">
      <p className="text-muted-foreground">
        Workflow visualization coming soon
      </p>
    </Card>
  );
}

function ExecutionsTab({ agent }: { agent: AgentData }) {
  return (
    <Card className="p-6">
      <ExecutionList agentId={agent.id} agentName={agent.name} />
    </Card>
  );
}

function SettingsTab() {
  return (
    <Card className="p-6">
      <p className="text-muted-foreground">Settings coming soon</p>
    </Card>
  );
}
