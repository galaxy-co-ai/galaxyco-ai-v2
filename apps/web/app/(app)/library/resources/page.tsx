"use client";

import { useState } from "react";
import useSWR from "swr";
import { useWorkspace } from "@/contexts/workspace-context";
import { ListPage } from "@/components/templates";
import { CardGrid } from "@/components/organisms/card-grid";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Video, Code, BookOpen, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  icon?: any;
  href?: string;
  url?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ResourcesResponse {
  resources: Resource[];
  total: number;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Failed to fetch" }));
    throw new Error(error.error || "Failed to fetch resources");
  }
  return res.json();
};

/**
 * Resources Page
 *
 * Shows resource library with search, filters, and grid view.
 * Connected to /api/resources endpoint for real-time data.
 */
export default function ResourcesPage() {
  const { currentWorkspace } = useWorkspace();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {},
  );

  const { data, error, isLoading } = useSWR<ResourcesResponse>(
    currentWorkspace
      ? `/api/resources?workspaceId=${currentWorkspace.id}&limit=100`
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
      onError: (err: Error) => {
        toast.error(err.message || "Failed to load resources");
      },
    },
  );

  const getIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="h-5 w-5" />;
      case "video":
        return <Video className="h-5 w-5" />;
      case "documentation":
        return <Code className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const resources = (data?.resources || []).map((r: Resource) => ({
    ...r,
    icon: getIcon(r.type),
  }));

  // Filter resources based on search and filters
  const filteredResources = resources.filter((resource: Resource) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter
    const categoryFilter = activeFilters.category || [];
    const matchesCategory =
      categoryFilter.length === 0 || categoryFilter.includes(resource.category);

    // Type filter
    const typeFilter = activeFilters.type || [];
    const matchesType =
      typeFilter.length === 0 || typeFilter.includes(resource.type);

    return matchesSearch && matchesCategory && matchesType;
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
            Failed to load resources
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
      title="Resources"
      subtitle={`${filteredResources.length} resource${filteredResources.length !== 1 ? "s" : ""} available`}
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Library", href: "/library" },
        { label: "Resources" },
      ]}
      actions={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Resource
        </Button>
      }
      searchQuery={searchQuery}
      searchPlaceholder="Search resources..."
      onSearchChange={setSearchQuery}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      filters={[
        {
          id: "category",
          label: "Category",
          type: "checkbox",
          options: [
            { value: "tutorials", label: "Tutorials", count: 2 },
            { value: "technical", label: "Technical", count: 1 },
            { value: "guides", label: "Guides", count: 1 },
          ],
        },
        {
          id: "type",
          label: "Type",
          type: "checkbox",
          options: [
            { value: "document", label: "Document", count: 2 },
            { value: "video", label: "Video", count: 1 },
            { value: "documentation", label: "Documentation", count: 1 },
          ],
        },
      ]}
      activeFilters={activeFilters}
      onFilterChange={handleFilterChange}
      onClearFilters={handleClearFilters}
      isEmpty={filteredResources.length === 0}
      emptyMessage={
        searchQuery || Object.keys(activeFilters).length > 0
          ? "No resources match your filters"
          : "No resources available"
      }
      emptyAction={
        <Button variant="outline" onClick={handleClearFilters}>
          Clear Filters
        </Button>
      }
    >
      <CardGrid
        items={filteredResources}
        viewMode={viewMode}
        renderCard={(resource) => (
          <div className="group">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-3 text-primary">
                {resource.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {resource.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {resource.description}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {resource.type}
                  </span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {resource.category}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        emptyState={
          <div className="text-center">
            <p className="text-muted-foreground">No resources found</p>
          </div>
        }
      />
    </ListPage>
  );
}
