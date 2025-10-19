"use client";

import { PageShell } from "@/components/templates/page-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  FolderKanban,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreHorizontal,
} from "lucide-react";
import { useState } from "react";

interface Project {
  id: string;
  name: string;
  description: string;
  status: "planning" | "in-progress" | "review" | "completed";
  priority: "low" | "medium" | "high";
  progress: number;
  startDate: string;
  dueDate: string;
  team: { name: string; avatar: string }[];
  tasksTotal: number;
  tasksCompleted: number;
}

const projects: Project[] = [
  {
    id: "1",
    name: "AI Agent Platform v2.0",
    description: "Major platform upgrade with new features and improved UX",
    status: "in-progress",
    priority: "high",
    progress: 67,
    startDate: "2025-09-01",
    dueDate: "2025-11-30",
    team: [
      {
        name: "Sarah Chen",
        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=SC",
      },
      {
        name: "Michael Rodriguez",
        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=MR",
      },
      {
        name: "Emily Watson",
        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=EW",
      },
    ],
    tasksTotal: 45,
    tasksCompleted: 30,
  },
  {
    id: "2",
    name: "Customer Onboarding Flow",
    description: "Streamline new customer signup and setup process",
    status: "review",
    priority: "high",
    progress: 90,
    startDate: "2025-10-01",
    dueDate: "2025-10-25",
    team: [
      {
        name: "David Kim",
        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=DK",
      },
      {
        name: "Lisa Park",
        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=LP",
      },
    ],
    tasksTotal: 20,
    tasksCompleted: 18,
  },
  {
    id: "3",
    name: "Integration Marketplace",
    description: "Build marketplace for third-party integrations",
    status: "planning",
    priority: "medium",
    progress: 15,
    startDate: "2025-11-01",
    dueDate: "2026-01-31",
    team: [
      {
        name: "Alex Johnson",
        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=AJ",
      },
    ],
    tasksTotal: 32,
    tasksCompleted: 5,
  },
  {
    id: "4",
    name: "Mobile App Launch",
    description: "Native iOS and Android applications",
    status: "in-progress",
    priority: "medium",
    progress: 42,
    startDate: "2025-09-15",
    dueDate: "2025-12-15",
    team: [
      {
        name: "Jordan Lee",
        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=JL",
      },
      {
        name: "Taylor Smith",
        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TS",
      },
      {
        name: "Morgan Davis",
        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=MD",
      },
    ],
    tasksTotal: 56,
    tasksCompleted: 24,
  },
];

const statusConfig = {
  planning: {
    label: "Planning",
    icon: Clock,
    className: "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300",
  },
  "in-progress": {
    label: "In Progress",
    icon: AlertCircle,
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
  review: {
    label: "Review",
    icon: FolderKanban,
    className:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className:
      "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  },
};

const priorityConfig = {
  low: {
    label: "Low",
    className: "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300",
  },
  medium: {
    label: "Medium",
    className:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  },
  high: {
    label: "High",
    className: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  },
};

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "kanban">("grid");

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const projectsByStatus = {
    planning: filteredProjects.filter((p) => p.status === "planning"),
    "in-progress": filteredProjects.filter((p) => p.status === "in-progress"),
    review: filteredProjects.filter((p) => p.status === "review"),
    completed: filteredProjects.filter((p) => p.status === "completed"),
  };

  const ProjectCard = ({ project }: { project: Project }) => {
    const StatusIcon = statusConfig[project.status].icon;
    const daysUntilDue = Math.ceil(
      (new Date(project.dueDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24),
    );

    return (
      <div className="group rounded-lg border border-border bg-card p-6 hover:border-primary hover:shadow-md transition-all cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold mb-1">{project.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {project.description}
            </p>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Badge className={statusConfig[project.status].className}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {statusConfig[project.status].label}
          </Badge>
          <Badge className={priorityConfig[project.priority].className}>
            {priorityConfig[project.priority].label}
          </Badge>
        </div>

        <div className="space-y-3 mb-4">
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold">{project.progress}%</span>
            </div>
            <div className="h-2 bg-background-subtle rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <CheckCircle2 className="h-4 w-4" />
              <span>
                {project.tasksCompleted} / {project.tasksTotal} tasks
              </span>
            </div>
            <div
              className={`flex items-center gap-1 ${
                daysUntilDue < 7 ? "text-destructive" : "text-muted-foreground"
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>{daysUntilDue}d left</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div className="flex -space-x-2">
              {project.team.slice(0, 3).map((member, idx) => (
                <Avatar
                  key={idx}
                  src={member.avatar}
                  alt={member.name}
                  fallback={member.name.substring(0, 2)}
                  size="sm"
                  className="ring-2 ring-background"
                />
              ))}
              {project.team.length > 3 && (
                <div className="h-8 w-8 rounded-full bg-background-subtle border-2 border-background flex items-center justify-center text-xs font-medium">
                  +{project.team.length - 3}
                </div>
              )}
            </div>
          </div>
          <Button size="sm" variant="outline">
            View
          </Button>
        </div>
      </div>
    );
  };

  return (
    <PageShell
      title="Projects"
      subtitle="Track and manage your team's projects"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Projects" }]}
      actions={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      }
    >
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Projects</p>
          <p className="text-2xl font-bold">{projects.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground mb-1">In Progress</p>
          <p className="text-2xl font-bold">
            {projects.filter((p) => p.status === "in-progress").length}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground mb-1">In Review</p>
          <p className="text-2xl font-bold">
            {projects.filter((p) => p.status === "review").length}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground mb-1">Completed</p>
          <p className="text-2xl font-bold">
            {projects.filter((p) => p.status === "completed").length}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="planning">Planning</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="review">Review</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === "kanban" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("kanban")}
          >
            Kanban
          </Button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {/* Kanban View */}
      {viewMode === "kanban" && (
        <div className="grid gap-4 lg:grid-cols-4">
          {Object.entries(projectsByStatus).map(([status, statusProjects]) => (
            <div key={status} className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-background-subtle">
                <div className="flex items-center gap-2">
                  {/* @ts-ignore */}
                  {statusConfig[status] && (
                    <>
                      {/* @ts-ignore */}
                      <Badge className={statusConfig[status].className}>
                        {/* @ts-ignore */}
                        {statusConfig[status].label}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {statusProjects.length}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                {statusProjects.map((project) => (
                  <div
                    key={project.id}
                    className="rounded-lg border border-border bg-card p-4 hover:border-primary hover:shadow-sm transition-all cursor-pointer"
                  >
                    <h4 className="font-semibold mb-2">{project.name}</h4>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {project.description}
                    </p>
                    <Badge
                      className={priorityConfig[project.priority].className}
                    >
                      {priorityConfig[project.priority].label}
                    </Badge>
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <span>{project.progress}% complete</span>
                        <span>
                          {project.tasksCompleted}/{project.tasksTotal}
                        </span>
                      </div>
                      <div className="h-1.5 bg-background-subtle rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {statusProjects.length === 0 && (
                  <div className="rounded-lg border-2 border-dashed border-border p-8 text-center">
                    <p className="text-sm text-muted-foreground">No projects</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <FolderKanban className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No projects found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filters
          </p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Project
          </Button>
        </div>
      )}
    </PageShell>
  );
}
