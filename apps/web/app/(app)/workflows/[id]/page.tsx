"use client";

import { DetailPage } from "@/components/templates/detail-page";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
  GitBranch,
  Clock,
  CheckCircle,
  XCircle,
  Activity,
  Play,
  Pause,
  Settings,
  Copy,
} from "lucide-react";

// Mock workflow data
const workflowData = {
  id: "wf_123",
  name: "Lead Enrichment Workflow",
  description:
    "Automatically enrich incoming leads with data from multiple sources and score them for sales prioritization",
  status: "active",
  created: "2025-10-10T08:30:00Z",
  updated: "2025-10-17T14:15:00Z",
  owner: {
    name: "Sarah Johnson",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=SJ",
  },
  steps: [
    {
      id: "step_1",
      name: "Lead Capture",
      type: "webhook",
      description: "Capture new leads from form submissions",
      status: "active",
      config: { webhook_url: "https://api.galaxyco.ai/webhook/leads" },
    },
    {
      id: "step_2",
      name: "Email Validation",
      type: "validation",
      description: "Validate email addresses and check for disposables",
      status: "active",
      config: { provider: "zerobounce" },
    },
    {
      id: "step_3",
      name: "Company Lookup",
      type: "enrichment",
      description: "Lookup company information using Clearbit",
      status: "active",
      config: { provider: "clearbit", fields: ["company", "industry", "size"] },
    },
    {
      id: "step_4",
      name: "Lead Scoring",
      type: "ai",
      description: "Score lead quality using ML model",
      status: "active",
      config: { model: "lead-scorer-v2", threshold: 0.7 },
    },
    {
      id: "step_5",
      name: "CRM Integration",
      type: "integration",
      description: "Create or update contact in Salesforce",
      status: "active",
      config: { integration: "salesforce", object: "lead" },
    },
    {
      id: "step_6",
      name: "Notification",
      type: "notification",
      description: "Notify sales team of high-quality leads",
      status: "active",
      config: { channel: "slack", condition: "score > 0.8" },
    },
  ],
  executions: [
    {
      id: "exec_001",
      startedAt: "2025-10-17T14:20:00Z",
      completedAt: "2025-10-17T14:20:45Z",
      status: "success",
      duration: 45000,
      triggeredBy: "webhook",
      stepsCompleted: 6,
      totalSteps: 6,
    },
    {
      id: "exec_002",
      startedAt: "2025-10-17T13:45:00Z",
      completedAt: "2025-10-17T13:45:32Z",
      status: "success",
      duration: 32000,
      triggeredBy: "webhook",
      stepsCompleted: 6,
      totalSteps: 6,
    },
    {
      id: "exec_003",
      startedAt: "2025-10-17T12:30:00Z",
      completedAt: null,
      status: "failed",
      duration: 28000,
      triggeredBy: "manual",
      stepsCompleted: 3,
      totalSteps: 6,
      error: "API rate limit exceeded for Clearbit",
    },
    {
      id: "exec_004",
      startedAt: "2025-10-17T11:15:00Z",
      completedAt: "2025-10-17T11:16:12Z",
      status: "success",
      duration: 72000,
      triggeredBy: "webhook",
      stepsCompleted: 6,
      totalSteps: 6,
    },
    {
      id: "exec_005",
      startedAt: "2025-10-17T10:00:00Z",
      completedAt: "2025-10-17T10:00:38Z",
      status: "success",
      duration: 38000,
      triggeredBy: "scheduled",
      stepsCompleted: 6,
      totalSteps: 6,
    },
  ],
};

const metrics = [
  {
    label: "Total Executions",
    value: "1,247",
    change: "+18 today",
    trend: "up" as const,
    icon: <Activity className="h-5 w-5" />,
  },
  {
    label: "Success Rate",
    value: "94.2%",
    change: "+2.1% this week",
    trend: "up" as const,
    icon: <CheckCircle className="h-5 w-5" />,
  },
  {
    label: "Avg Duration",
    value: "1.2 min",
    change: "-0.3 min",
    trend: "up" as const,
    icon: <Clock className="h-5 w-5" />,
  },
  {
    label: "Last Run",
    value: "5 mins ago",
    change: "Success",
    trend: "neutral" as const,
    icon: <Play className="h-5 w-5" />,
  },
];

function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Workflow Info */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <Badge
                variant={
                  workflowData.status === "active" ? "default" : "secondary"
                }
              >
                {workflowData.status}
              </Badge>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              {workflowData.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Avatar
                  src={workflowData.owner.avatar}
                  alt={workflowData.owner.name}
                  fallback={workflowData.owner.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                  size="sm"
                />
                <span>Created by {workflowData.owner.name}</span>
              </div>
              <div>
                Created {new Date(workflowData.created).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Copy className="mr-2 h-4 w-4" />
              Clone
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button size="sm">
              <Play className="mr-2 h-4 w-4" />
              Run Now
            </Button>
          </div>
        </div>
      </Card>

      {/* Recent Executions */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Recent Executions</h3>
        <div className="space-y-3">
          {workflowData.executions.slice(0, 5).map((execution) => (
            <div
              key={execution.id}
              className="flex items-center justify-between rounded-lg border border-border p-4"
            >
              <div className="flex items-center gap-3">
                {execution.status === "success" ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : execution.status === "failed" ? (
                  <XCircle className="h-5 w-5 text-red-500" />
                ) : (
                  <Clock className="h-5 w-5 text-yellow-500" />
                )}
                <div>
                  <p className="text-sm font-medium">
                    Execution {execution.id.split("_")[1]}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {execution.status === "failed" && execution.error
                      ? execution.error
                      : `${execution.stepsCompleted}/${execution.totalSteps} steps completed`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  {execution.duration
                    ? `${(execution.duration / 1000).toFixed(1)}s`
                    : "—"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(execution.startedAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function StepsTab() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Workflow Steps</h3>
        <div className="relative space-y-4">
          {workflowData.steps.map((step, index) => (
            <div key={step.id} className="relative">
              {/* Connecting line */}
              {index < workflowData.steps.length - 1 && (
                <div className="absolute left-4 top-8 h-8 w-0.5 bg-border" />
              )}

              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <span className="text-xs font-semibold">{index + 1}</span>
                </div>
                <div className="flex-1 rounded-lg border border-border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="font-semibold">{step.name}</h4>
                    <Badge
                      variant={
                        step.status === "active" ? "default" : "secondary"
                      }
                    >
                      {step.status}
                    </Badge>
                  </div>
                  <p className="mb-3 text-sm text-muted-foreground">
                    {step.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {step.type}
                    </Badge>
                    {Object.entries(step.config)
                      .slice(0, 2)
                      .map(([key, value]) => (
                        <Badge
                          key={key}
                          variant="secondary"
                          className="text-xs"
                        >
                          {key}: {String(value).substring(0, 20)}
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function HistoryTab() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Execution History</h3>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left text-sm text-muted-foreground">
                <th className="pb-3">Execution ID</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Started</th>
                <th className="pb-3">Duration</th>
                <th className="pb-3">Triggered By</th>
                <th className="pb-3">Steps</th>
              </tr>
            </thead>
            <tbody>
              {workflowData.executions.map((execution) => (
                <tr key={execution.id} className="border-b border-border">
                  <td className="py-3 text-sm font-mono">{execution.id}</td>
                  <td className="py-3">
                    <Badge
                      variant={
                        execution.status === "success"
                          ? "default"
                          : execution.status === "failed"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {execution.status}
                    </Badge>
                  </td>
                  <td className="py-3 text-sm">
                    {new Date(execution.startedAt).toLocaleString()}
                  </td>
                  <td className="py-3 text-sm">
                    {execution.duration
                      ? `${(execution.duration / 1000).toFixed(1)}s`
                      : "—"}
                  </td>
                  <td className="py-3 text-sm">{execution.triggeredBy}</td>
                  <td className="py-3 text-sm">
                    {execution.stepsCompleted}/{execution.totalSteps}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default function WorkflowDetailPage() {
  return (
    <DetailPage
      title={workflowData.name}
      subtitle={`Workflow • ${workflowData.steps.length} steps`}
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Workflows", href: "/workflows" },
        { label: workflowData.name },
      ]}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Pause className="mr-2 h-4 w-4" />
            Pause
          </Button>
          <Button size="sm">
            <Play className="mr-2 h-4 w-4" />
            Run
          </Button>
        </div>
      }
      metrics={metrics}
      tabs={[
        {
          id: "overview",
          label: "Overview",
          content: <OverviewTab />,
        },
        {
          id: "steps",
          label: "Steps",
          badge: workflowData.steps.length,
          content: <StepsTab />,
        },
        {
          id: "history",
          label: "History",
          badge: workflowData.executions.length,
          content: <HistoryTab />,
        },
      ]}
    />
  );
}
