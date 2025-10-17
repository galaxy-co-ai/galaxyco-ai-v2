"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  Loader2,
  XCircle,
  Copy,
  Download,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Link from "next/link";

interface ExecutionUser {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  avatarUrl?: string | null;
}

interface ExecutionAgent {
  id: string;
  name: string;
  type: string;
  status: string;
}

interface ExecutionLog {
  id: string;
  timestamp: string;
  level: "info" | "success" | "error" | "warning";
  message: string;
  details?: string;
}

interface ExecutionMetrics {
  duration: number | null;
  tokensUsed: number;
  cost: number;
  inputSize: number;
  outputSize: number;
}

interface ExecutionDetail {
  id: string;
  status: "pending" | "running" | "completed" | "failed" | "cancelled";
  input?: Record<string, any> | null;
  output?: Record<string, any> | null;
  error?: {
    message: string;
    code?: string;
    stack?: string;
  } | null;
  durationMs?: number | null;
  tokensUsed?: number | null;
  cost?: number | null;
  startedAt?: string | null;
  completedAt?: string | null;
  createdAt: string;
  agent: ExecutionAgent;
  triggeredByUser: ExecutionUser;
  logs: ExecutionLog[];
  metrics: ExecutionMetrics;
}

interface ExecutionDetailProps {
  agentId: string;
  executionId: string;
  agentName: string;
}

export function ExecutionDetail({
  agentId,
  executionId,
  agentName,
}: ExecutionDetailProps) {
  const [execution, setExecution] = useState<ExecutionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "logs" | "input" | "output" | "metrics"
  >("logs");

  const fetchExecutionDetail = useCallback(
    async (showRefreshIndicator = false) => {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const response = await fetch(
          `/api/agents/${agentId}/executions/${executionId}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch execution details");
        }

        const data = await response.json();
        setExecution(data.execution);
      } catch (err) {
        console.error("Error fetching execution details:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load execution details",
        );
        toast.error("Failed to load execution details");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [agentId, executionId],
  );

  useEffect(() => {
    fetchExecutionDetail();
  }, [fetchExecutionDetail]);

  // Auto-refresh for running executions
  useEffect(() => {
    if (!execution || !["pending", "running"].includes(execution.status))
      return;

    const interval = setInterval(() => {
      fetchExecutionDetail(true);
    }, 3000); // Refresh every 3 seconds

    return () => clearInterval(interval);
  }, [execution, fetchExecutionDetail]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
        );
      case "failed":
        return (
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
        );
      case "running":
        return (
          <Loader2 className="h-5 w-5 text-blue-600 dark:text-blue-400 animate-spin" />
        );
      case "cancelled":
        return <XCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
      default:
        return (
          <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
        );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "running":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "cancelled":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    }
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case "success":
        return "text-green-600 dark:text-green-400";
      case "error":
        return "text-red-600 dark:text-red-400";
      case "warning":
        return "text-yellow-600 dark:text-yellow-400";
      default:
        return "text-blue-600 dark:text-blue-400";
    }
  };

  const formatDuration = (ms: number | null) => {
    if (!ms) return "—";
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const formatUserName = (user: ExecutionUser) => {
    if (user.firstName || user.lastName) {
      return `${user.firstName || ""} ${user.lastName || ""}`.trim();
    }
    return user.email;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const downloadJson = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

  if (error || !execution) {
    return (
      <div className="space-y-6">
        <Link
          href={`/agents/${agentId}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {agentName}
        </Link>
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mb-2" />
          <h3 className="font-semibold text-red-900 dark:text-red-100">
            Failed to load execution
          </h3>
          <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={`/agents/${agentId}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {agentName}
          </Link>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-3">
            {getStatusIcon(execution.status)}
            <Badge className={getStatusColor(execution.status)}>
              {execution.status}
            </Badge>
            {isRefreshing && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
        </div>

        <Button
          onClick={() => fetchExecutionDetail(true)}
          variant="outline"
          size="sm"
          disabled={isRefreshing}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Execution Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Clock className="h-4 w-4" />
            Duration
          </div>
          <div className="text-2xl font-semibold">
            {formatDuration(execution.metrics.duration)}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <User className="h-4 w-4" />
            Triggered By
          </div>
          <div className="text-lg font-medium truncate">
            {formatUserName(execution.triggeredByUser)}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            Started At
          </div>
          <div className="text-sm">
            {new Date(execution.createdAt).toLocaleString()}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            Execution ID
          </div>
          <div className="text-xs font-mono bg-muted px-2 py-1 rounded truncate">
            {execution.id}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {(["logs", "input", "output", "metrics"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors capitalize ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="rounded-lg border bg-card">
        {activeTab === "logs" && (
          <div>
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Execution Logs</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Real-time execution status and progress
              </p>
            </div>
            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              {execution.logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-4 p-3 rounded-lg bg-muted/30"
                >
                  <div className="text-xs text-muted-foreground font-mono mt-0.5">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </div>
                  <div
                    className={`text-sm font-medium ${getLogLevelColor(log.level)}`}
                  >
                    {log.level.toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm">{log.message}</div>
                    {log.details && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {log.details}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {execution.logs.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No logs available yet
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "input" && (
          <div>
            <div className="p-6 border-b flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Input Data</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Parameters and data provided to the agent
                </p>
              </div>
              {execution.input && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(
                        JSON.stringify(execution.input, null, 2),
                        "Input data",
                      )
                    }
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      downloadJson(
                        execution.input,
                        `execution-${execution.id}-input.json`,
                      )
                    }
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              )}
            </div>
            <div className="p-6">
              {execution.input ? (
                <pre className="text-sm bg-muted p-4 rounded-lg overflow-auto max-h-96">
                  {JSON.stringify(execution.input, null, 2)}
                </pre>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No input data available
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "output" && (
          <div>
            <div className="p-6 border-b flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Output Data</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Results and data generated by the agent
                </p>
              </div>
              {execution.output && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(
                        JSON.stringify(execution.output, null, 2),
                        "Output data",
                      )
                    }
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      downloadJson(
                        execution.output,
                        `execution-${execution.id}-output.json`,
                      )
                    }
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              )}
            </div>
            <div className="p-6">
              {execution.output ? (
                <pre className="text-sm bg-muted p-4 rounded-lg overflow-auto max-h-96">
                  {JSON.stringify(execution.output, null, 2)}
                </pre>
              ) : execution.error ? (
                <div className="rounded-lg bg-red-50 dark:bg-red-950 p-4">
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-2">
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-medium">Execution Error</span>
                  </div>
                  <pre className="text-sm text-red-700 dark:text-red-300 whitespace-pre-wrap">
                    {execution.error.message}
                  </pre>
                  {execution.error.code && (
                    <div className="mt-2 text-xs text-red-600 dark:text-red-400">
                      Error Code: {execution.error.code}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No output data available yet
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "metrics" && (
          <div>
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Performance Metrics</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Execution performance and resource usage
              </p>
            </div>
            <div className="p-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-medium">Execution Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-muted-foreground">
                        Duration
                      </span>
                      <span className="text-sm font-mono">
                        {formatDuration(execution.metrics.duration)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-muted-foreground">
                        Tokens Used
                      </span>
                      <span className="text-sm font-mono">
                        {execution.metrics.tokensUsed.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-muted-foreground">
                        Cost
                      </span>
                      <span className="text-sm font-mono">
                        ${(execution.metrics.cost / 100).toFixed(4)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Data Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-muted-foreground">
                        Input Size
                      </span>
                      <span className="text-sm font-mono">
                        {formatFileSize(execution.metrics.inputSize)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-muted-foreground">
                        Output Size
                      </span>
                      <span className="text-sm font-mono">
                        {formatFileSize(execution.metrics.outputSize)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-muted-foreground">
                        Status
                      </span>
                      <Badge
                        className={`text-xs ${getStatusColor(execution.status)}`}
                      >
                        {execution.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
