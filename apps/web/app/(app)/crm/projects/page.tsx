"use client";

import { PageShell } from "@/components/templates/page-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreHorizontal,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useWorkspace } from "@/contexts/workspace-context";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

interface Project {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  status: string;
  startDate: string | null;
  endDate: string | null;
  budget: number | null;
  actualCost: number | null;
  progress: number;
  completedTasks: number;
  totalTasks: number;
  customerId: string | null;
  managerId: string | null;
  createdAt: string;
  updatedAt: string;
}

const statusConfig: Record<
  string,
  { label: string; icon: any; className: string }
> = {
  planning: {
    label: "Planning",
    icon: Clock,
    className: "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300",
  },
  in_progress: {
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
  on_hold: {
    label: "On Hold",
    icon: Clock,
    className:
      "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  },
  cancelled: {
    label: "Cancelled",
    icon: AlertCircle,
    className: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  },
};

export default function ProjectsPage() {
  const { currentWorkspace } = useWorkspace();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "kanban">("grid");

  useEffect(() => {
    async function fetchProjects() {
      if (!currentWorkspace?.id) return;

      try {
        setIsLoading(true);
        const res = await fetch(
          `/api/projects?workspaceId=${currentWorkspace.id}&limit=100`,
        );
        if (!res.ok) throw new Error("Failed to fetch projects");
        const data = await res.json();
        setProjects(data.projects || []);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        toast.error("Failed to load projects");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, [currentWorkspace?.id]);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description?.toLowerCase() || "").includes(
        searchQuery.toLowerCase(),
      );
    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const projectsByStatus = {
    planning: filteredProjects.filter((p) => p.status === "planning"),
    in_progress: filteredProjects.filter((p) => p.status === "in_progress"),
    review: filteredProjects.filter((p) => p.status === "review"),
    completed: filteredProjects.filter((p) => p.status === "completed"),
    on_hold: filteredProjects.filter((p) => p.status === "on_hold"),
    cancelled: filteredProjects.filter((p) => p.status === "cancelled"),
  };

  const ProjectCard = ({ project }: { project: Project }) => {
    const StatusIcon = statusConfig[project.status]?.icon || Clock;
    const daysUntilDue = project.endDate
      ? Math.ceil(
          (new Date(project.endDate).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : null;

    return (
      <div className="group rounded-lg border border-border bg-card p-6 hover:border-primary hover:shadow-md transition-all cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold mb-1">{project.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {project.description || "No description"}
            </p>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          {statusConfig[project.status] && (
            <Badge className={statusConfig[project.status].className}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusConfig[project.status].label}
            </Badge>
          )}
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
                {project.completedTasks} / {project.totalTasks} tasks
              </span>
            </div>
            {daysUntilDue !== null && (
              <div
                className={`flex items-center gap-1 ${
                  daysUntilDue < 7
                    ? "text-destructive"
                    : "text-muted-foreground"
                }`}
              >
                <Calendar className="h-4 w-4" />
                <span>{daysUntilDue}d left</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end pt-4 border-t border-border">
          <Button size="sm" variant="outline">
            View
          </Button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

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
            {projects.filter((p) => p.status === "in_progress").length}
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
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="review">Review</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="on_hold">On Hold</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
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
                  {statusConfig[status] && (
                    <>
                      <Badge className={statusConfig[status].className}>
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
                      {project.description || "No description"}
                    </p>
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <span>{project.progress}% complete</span>
                        <span>
                          {project.completedTasks}/{project.totalTasks}
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
