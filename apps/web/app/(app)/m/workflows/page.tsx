"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import {
  ChevronRight,
  Plus,
  Play,
  Pause,
  Settings,
  TrendingUp,
  Clock,
} from "lucide-react";
import { useState } from "react";

interface Workflow {
  id: string;
  name: string;
  status: "active" | "paused" | "draft";
  trigger: string;
  lastRun: string;
  executions: number;
  successRate: number;
}

const workflows: Workflow[] = [
  {
    id: "1",
    name: "Lead Qualification",
    status: "active",
    trigger: "New email received",
    lastRun: "2 min ago",
    executions: 1247,
    successRate: 98,
  },
  {
    id: "2",
    name: "Meeting Scheduler",
    status: "active",
    trigger: "Calendar invite",
    lastRun: "15 min ago",
    executions: 856,
    successRate: 95,
  },
  {
    id: "3",
    name: "Content Generator",
    status: "paused",
    trigger: "Manual trigger",
    lastRun: "2 hours ago",
    executions: 423,
    successRate: 92,
  },
  {
    id: "4",
    name: "Data Sync",
    status: "active",
    trigger: "Every 15 minutes",
    lastRun: "5 min ago",
    executions: 2341,
    successRate: 99,
  },
];

const statusConfig = {
  active: {
    label: "Active",
    className:
      "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  },
  paused: {
    label: "Paused",
    className: "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300",
  },
  draft: {
    label: "Draft",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
};

export default function MobileWorkflowsPage() {
  const [filter, setFilter] = useState<"all" | "active" | "paused">("all");

  const filteredWorkflows = workflows.filter(
    (w) => filter === "all" || w.status === filter,
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Workflows</h1>
              <p className="text-sm text-muted-foreground">
                {workflows.length} total
              </p>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              New
            </Button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
              className="flex-1"
            >
              All
            </Button>
            <Button
              variant={filter === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("active")}
              className="flex-1"
            >
              Active
            </Button>
            <Button
              variant={filter === "paused" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("paused")}
              className="flex-1"
            >
              Paused
            </Button>
          </div>
        </div>
      </div>

      {/* Workflow List */}
      <div className="p-4 space-y-3">
        {filteredWorkflows.map((workflow) => (
          <div
            key={workflow.id}
            className="rounded-lg border border-border bg-card p-4 active:bg-accent transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate mb-1">{workflow.name}</h3>
                <p className="text-sm text-muted-foreground truncate">
                  {workflow.trigger}
                </p>
              </div>
              <Badge className={statusConfig[workflow.status].className}>
                {statusConfig[workflow.status].label}
              </Badge>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="text-center p-2 rounded bg-background-subtle">
                <p className="text-xs text-muted-foreground mb-1">Runs</p>
                <p className="text-sm font-semibold">
                  {workflow.executions.toLocaleString()}
                </p>
              </div>
              <div className="text-center p-2 rounded bg-background-subtle">
                <p className="text-xs text-muted-foreground mb-1">Success</p>
                <p className="text-sm font-semibold">{workflow.successRate}%</p>
              </div>
              <div className="text-center p-2 rounded bg-background-subtle">
                <p className="text-xs text-muted-foreground mb-1">Last Run</p>
                <p className="text-xs font-semibold truncate">
                  {workflow.lastRun}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={workflow.status === "active" ? "outline" : "default"}
                className="flex-1"
              >
                {workflow.status === "active" ? (
                  <>
                    <Pause className="h-3 w-3 mr-1" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3 mr-1" />
                    Resume
                  </>
                )}
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                <Settings className="h-3 w-3 mr-1" />
                Edit
              </Button>
              <Button size="sm" variant="outline">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredWorkflows.length === 0 && (
        <div className="p-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Play className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mb-4">No workflows found</p>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Workflow
          </Button>
        </div>
      )}
    </div>
  );
}
