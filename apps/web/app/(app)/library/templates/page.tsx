"use client";

import { useState } from "react";
import useSWR from "swr";
import { useWorkspace } from "@/contexts/workspace-context";
import { ListPage } from "@/components/templates/list-page";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  GitBranch,
  Code2,
  Download,
  ExternalLink,
  Star,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  type: string;
  difficulty: string;
  rating: number;
  downloads: number;
  author: string;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface TemplatesResponse {
  templates: Template[];
  total: number;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Failed to fetch" }));
    throw new Error(error.error || "Failed to fetch templates");
  }
  return res.json();
};

export default function TemplatesPage() {
  const { currentWorkspace } = useWorkspace();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {},
  );

  const { data, error, isLoading } = useSWR<TemplatesResponse>(
    currentWorkspace
      ? `/api/templates?workspaceId=${currentWorkspace.id}&limit=100`
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
      onError: (err: Error) => {
        toast.error(err.message || "Failed to load templates");
      },
    },
  );

  const templates = data?.templates || [];

  const filteredTemplates = templates.filter((template: Template) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    // Category filter
    const categoryFilter = activeFilters.category || [];
    const matchesCategory =
      categoryFilter.length === 0 || categoryFilter.includes(template.category);

    // Type filter
    const typeFilter = activeFilters.type || [];
    const matchesType =
      typeFilter.length === 0 || typeFilter.includes(template.type);

    // Difficulty filter
    const difficultyFilter = activeFilters.difficulty || [];
    const matchesDifficulty =
      difficultyFilter.length === 0 ||
      difficultyFilter.includes(template.difficulty);

    return matchesSearch && matchesCategory && matchesType && matchesDifficulty;
  });

  const handleFilterChange = (filterId: string, values: string[]) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterId]: values,
    }));
  };

  const handleClearFilters = () => {
    setActiveFilters({});
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      Beginner: "default" as const,
      Intermediate: "secondary" as const,
      Advanced: "outline" as const,
    };
    return colors[difficulty as keyof typeof colors] || "default";
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-2">
            Failed to load templates
          </p>
          <p className="text-sm text-muted-foreground">
            Please try again later
          </p>
        </div>
      </div>
    );
  }

  return (
    <ListPage
      title="Templates"
      subtitle={`${filteredTemplates.length} template${
        filteredTemplates.length !== 1 ? "s" : ""
      }`}
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Library", href: "/library" },
        { label: "Templates" },
      ]}
      searchQuery={searchQuery}
      searchPlaceholder="Search templates..."
      onSearchChange={setSearchQuery}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      showViewToggle
      filters={[
        {
          id: "category",
          label: "Category",
          type: "checkbox",
          options: [
            { value: "workflow", label: "Workflow", count: 5 },
            { value: "code", label: "Code", count: 3 },
          ],
        },
        {
          id: "type",
          label: "Type",
          type: "checkbox",
          options: [
            { value: "Sales", label: "Sales", count: 1 },
            { value: "Support", label: "Support", count: 1 },
            { value: "Marketing", label: "Marketing", count: 1 },
            { value: "Development", label: "Development", count: 3 },
            { value: "Integration", label: "Integration", count: 1 },
            { value: "Operations", label: "Operations", count: 1 },
          ],
        },
        {
          id: "difficulty",
          label: "Difficulty",
          type: "checkbox",
          options: [
            { value: "Beginner", label: "Beginner", count: 3 },
            { value: "Intermediate", label: "Intermediate", count: 3 },
            { value: "Advanced", label: "Advanced", count: 2 },
          ],
        },
      ]}
      activeFilters={activeFilters}
      onFilterChange={handleFilterChange}
      onClearFilters={handleClearFilters}
      showFilters
    >
      {viewMode === "grid" ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  {template.category === "workflow" ? (
                    <GitBranch className="h-6 w-6 text-primary" />
                  ) : (
                    <Code2 className="h-6 w-6 text-primary" />
                  )}
                </div>
                <Badge variant={getDifficultyColor(template.difficulty)}>
                  {template.difficulty}
                </Badge>
              </div>

              <h3 className="mb-2 font-semibold">{template.name}</h3>
              <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                {template.description}
              </p>

              <div className="mb-4 flex flex-wrap gap-1">
                {template.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="mb-4 flex items-center justify-between border-t border-border pt-4 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span>{template.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Download className="h-4 w-4" />
                  <span>{template.downloads.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1" size="sm">
                  Use Template
                </Button>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>

              <p className="mt-3 text-xs text-muted-foreground">
                By {template.author}
              </p>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="divide-y divide-border">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="flex items-center justify-between p-4 hover:bg-muted/50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    {template.category === "workflow" ? (
                      <GitBranch className="h-6 w-6 text-primary" />
                    ) : (
                      <Code2 className="h-6 w-6 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <h3 className="font-semibold">{template.name}</h3>
                      <Badge variant={getDifficultyColor(template.difficulty)}>
                        {template.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {template.description}
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        <span>{template.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        <span>{template.downloads.toLocaleString()}</span>
                      </div>
                      <span>By {template.author}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm">Use Template</Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {filteredTemplates.length === 0 && (
        <Card className="p-12 text-center">
          <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">No templates found</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Try adjusting your search or filters
          </p>
          <Button variant="outline" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        </Card>
      )}
    </ListPage>
  );
}
