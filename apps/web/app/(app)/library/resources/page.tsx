"use client";

import { useState } from "react";
import { ListPage } from "@/components/templates";
import { CardGrid } from "@/components/organisms/card-grid";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Video, Code, BookOpen } from "lucide-react";

// Mock data - would come from API in production
const mockResources = [
  {
    id: "1",
    title: "Getting Started Guide",
    description: "Learn the basics of GalaxyCo.ai platform",
    type: "document",
    category: "tutorials",
    icon: <BookOpen className="h-5 w-5" />,
    href: "/resources/getting-started",
  },
  {
    id: "2",
    title: "API Documentation",
    description: "Complete API reference and examples",
    type: "documentation",
    category: "technical",
    icon: <Code className="h-5 w-5" />,
    href: "/resources/api-docs",
  },
  {
    id: "3",
    title: "Video Tutorials",
    description: "Step-by-step video guides",
    type: "video",
    category: "tutorials",
    icon: <Video className="h-5 w-5" />,
    href: "/resources/videos",
  },
  {
    id: "4",
    title: "Best Practices",
    description: "Recommended patterns and workflows",
    type: "document",
    category: "guides",
    icon: <FileText className="h-5 w-5" />,
    href: "/resources/best-practices",
  },
];

/**
 * Resources Page
 *
 * Example page demonstrating ListPage template usage.
 * Shows resource library with search, filters, and grid view.
 */
export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {},
  );

  // Filter resources based on search and filters
  const filteredResources = mockResources.filter((resource) => {
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

  return (
    <ListPage
      title="Resources"
      subtitle="Documentation, guides, and tutorials to help you succeed"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
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
