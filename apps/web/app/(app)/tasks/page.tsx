"use client";

import { useState } from "react";
import { ListPage } from "@/components/templates/list-page";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
  Calendar,
  CheckCircle2,
  Clock,
  MoreVertical,
  Plus,
  AlertCircle,
} from "lucide-react";

// Mock data for tasks
const mockTasks = [
  {
    id: "1",
    title: "Complete Q4 Marketing Strategy",
    description:
      "Finalize marketing plan for Q4 including budget allocation and campaign timelines",
    status: "in-progress",
    priority: "high",
    dueDate: "2025-10-20",
    assignee: {
      name: "Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    tags: ["Marketing", "Strategy"],
  },
  {
    id: "2",
    title: "Review Sales Dashboard Prototype",
    description: "Provide feedback on the new sales dashboard design and UX",
    status: "todo",
    priority: "medium",
    dueDate: "2025-10-18",
    assignee: {
      name: "Michael Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    },
    tags: ["Design", "Review"],
  },
  {
    id: "3",
    title: "Update API Documentation",
    description: "Add documentation for new API endpoints released in v2.1",
    status: "in-progress",
    priority: "high",
    dueDate: "2025-10-19",
    assignee: {
      name: "Emily Rodriguez",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    },
    tags: ["Documentation", "API"],
  },
  {
    id: "4",
    title: "Client Onboarding - Acme Corp",
    description:
      "Schedule and conduct onboarding session for new enterprise client",
    status: "todo",
    priority: "urgent",
    dueDate: "2025-10-17",
    assignee: {
      name: "David Kim",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    },
    tags: ["Onboarding", "Client"],
  },
  {
    id: "5",
    title: "Security Audit Q4",
    description: "Conduct quarterly security audit and update compliance docs",
    status: "todo",
    priority: "medium",
    dueDate: "2025-10-25",
    assignee: {
      name: "Jessica Martinez",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
    },
    tags: ["Security", "Compliance"],
  },
  {
    id: "6",
    title: "Implement Feature Flags",
    description: "Add feature flag system for gradual rollouts",
    status: "done",
    priority: "low",
    dueDate: "2025-10-15",
    assignee: {
      name: "Robert Taylor",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
    },
    tags: ["Development", "Infrastructure"],
  },
];

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "todo", label: "To Do" },
  { value: "in-progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

const priorityOptions = [
  { value: "all", label: "All Priority" },
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const assigneeOptions = [
  { value: "all", label: "All Assignees" },
  { value: "Sarah Johnson", label: "Sarah Johnson" },
  { value: "Michael Chen", label: "Michael Chen" },
  { value: "Emily Rodriguez", label: "Emily Rodriguez" },
  { value: "David Kim", label: "David Kim" },
  { value: "Jessica Martinez", label: "Jessica Martinez" },
  { value: "Robert Taylor", label: "Robert Taylor" },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState(mockTasks);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      searchQuery === "" ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;
    const matchesAssignee =
      assigneeFilter === "all" || task.assignee.name === assigneeFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
  });

  const renderTaskCard = (task: (typeof mockTasks)[0]) => {
    const priorityColors: Record<
      string,
      "destructive" | "default" | "secondary" | "outline"
    > = {
      urgent: "destructive",
      high: "default",
      medium: "secondary",
      low: "outline",
    };

    const statusColors: Record<string, "default" | "secondary" | "outline"> = {
      todo: "secondary",
      "in-progress": "default",
      done: "outline",
    };

    const statusIcons: Record<string, React.ReactElement> = {
      todo: <Clock className="h-4 w-4" />,
      "in-progress": <AlertCircle className="h-4 w-4" />,
      done: <CheckCircle2 className="h-4 w-4" />,
    };

    const isOverdue =
      new Date(task.dueDate) < new Date() && task.status !== "done";

    return (
      <div
        key={task.id}
        className={`group relative rounded-lg border bg-card p-6 hover:shadow-md transition-all ${
          isOverdue
            ? "border-destructive/50 bg-destructive/5"
            : "border-border hover:border-primary/50"
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{task.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          </div>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant={priorityColors[task.priority]}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </Badge>
          <Badge variant={statusColors[task.status]} className="gap-1">
            {statusIcons[task.status]}
            {task.status === "in-progress"
              ? "In Progress"
              : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </Badge>
          {isOverdue && <Badge variant="destructive">Overdue</Badge>}
        </div>

        {/* Tags */}
        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {task.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <Avatar
              src={task.assignee.avatar}
              alt={task.assignee.name}
              fallback={task.assignee.name.slice(0, 2).toUpperCase()}
              size="sm"
            />
            <span className="text-sm text-muted-foreground">
              {task.assignee.name}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ListPage
      title="Tasks"
      subtitle="Manage your tasks and track progress"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Tasks" }]}
      searchPlaceholder="Search tasks..."
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      showFilters={false}
      actions={
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      }
      viewMode={viewMode}
      onViewModeChange={setViewMode}
    >
      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => renderTaskCard(task))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No tasks found</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("all");
              setPriorityFilter("all");
              setAssigneeFilter("all");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </ListPage>
  );
}
