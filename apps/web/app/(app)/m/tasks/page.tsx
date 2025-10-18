import { Metadata } from "next";
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Plus,
  Filter,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";

export const metadata: Metadata = {
  title: "Tasks | GalaxyCo.ai",
  description: "Mobile task management",
};

// Mock tasks data
const tasks = [
  {
    id: "1",
    title: "Complete Q4 Marketing Strategy",
    priority: "high",
    status: "in-progress",
    dueDate: "2025-10-20",
    assignee: { name: "Sarah J.", avatar: "SJ" },
  },
  {
    id: "2",
    title: "Review Sales Dashboard",
    priority: "medium",
    status: "todo",
    dueDate: "2025-10-18",
    assignee: { name: "Michael C.", avatar: "MC" },
  },
  {
    id: "3",
    title: "Update API Documentation",
    priority: "high",
    status: "in-progress",
    dueDate: "2025-10-19",
    assignee: { name: "Emily R.", avatar: "ER" },
  },
  {
    id: "4",
    title: "Client Onboarding - Acme",
    priority: "urgent",
    status: "todo",
    dueDate: "2025-10-17",
    assignee: { name: "David K.", avatar: "DK" },
  },
];

export default function MobileTasksPage() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done":
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case "in-progress":
        return <AlertCircle className="h-5 w-5 text-warning" />;
      default:
        return <Circle className="h-5 w-5 text-foreground-muted" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "destructive";
      case "high":
        return "default";
      case "medium":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3">
        <h1 className="text-xl font-semibold mb-3">Tasks</h1>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
          <Input
            placeholder="Search tasks..."
            className="pl-10 h-10"
            aria-label="Search tasks"
          />
        </div>

        {/* Quick Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Button variant="default" size="sm" className="whitespace-nowrap">
            All
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            <Clock className="h-3 w-3 mr-1" />
            Today
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            My Tasks
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            <Filter className="h-3 w-3 mr-1" />
            Filters
          </Button>
        </div>
      </div>

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {tasks.map((task) => {
          const isOverdue =
            new Date(task.dueDate) < new Date() && task.status !== "done";

          return (
            <div
              key={task.id}
              className={`rounded-lg border p-4 active:bg-background-subtle transition-colors ${
                isOverdue
                  ? "border-destructive/50 bg-destructive/5"
                  : "border-border bg-card"
              }`}
            >
              {/* Status and Title */}
              <div className="flex items-start gap-3 mb-2">
                <button
                  className="mt-0.5 touch-manipulation"
                  aria-label="Toggle task status"
                >
                  {getStatusIcon(task.status)}
                </button>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-base leading-tight">
                    {task.title}
                  </h3>
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex items-center justify-between ml-8">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      getPriorityColor(task.priority) as
                        | "default"
                        | "secondary"
                        | "outline"
                        | "destructive"
                    }
                    size="sm"
                  >
                    {task.priority}
                  </Badge>
                  <span className="text-sm text-foreground-muted">
                    {new Date(task.dueDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <Avatar
                  fallback={task.assignee.avatar}
                  size="sm"
                  aria-label={`Assigned to ${task.assignee.name}`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Action Button */}
      <button
        className="fixed bottom-20 right-4 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-elevation-high flex items-center justify-center active:scale-95 transition-transform touch-manipulation"
        aria-label="Add new task"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}
