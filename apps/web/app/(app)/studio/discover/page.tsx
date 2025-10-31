"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Sparkles, Plus, TrendingUp, Users, Star } from "lucide-react";
import { ListPage } from "@/components/templates/list-page";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/agents/metric-card";
import { TemplateCard } from "@/components/studio/template-card";
import { TemplateDetailModal } from "@/components/studio/template-detail-modal";
import { useWorkspace } from "@/contexts/workspace-context";
import { toast } from "sonner";
import { logger } from "@/lib/utils/logger";
import type { GridTemplate } from "@/lib/studio/types";

export default function StudioDiscoverPage() {
  const { currentWorkspace } = useWorkspace();

  // State
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {},
  );
  const [selectedTemplate, setSelectedTemplate] = useState<GridTemplate | null>(
    null,
  );

  // Fetch templates using TanStack Query
  const {
    data: templates = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["studio", "templates", currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace?.id) return [];

      const response = await fetch(
        `/api/studio/templates?workspaceId=${currentWorkspace.id}`,
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch templates");
      }

      const data = await response.json();
      return data.templates || [];
    },
    enabled: !!currentWorkspace?.id,
  });

  // Compute metrics
  const metrics = useMemo(() => {
    const total = templates.length;
    const totalUses = templates.reduce(
      (sum: number, t: GridTemplate) => sum + (t.uses || 0),
      0,
    );
    const avgRating =
      templates.length > 0
        ? templates.reduce(
            (sum: number, t: GridTemplate) => sum + (t.rating || 0),
            0,
          ) / templates.length
        : 0;
    const featured = templates.filter((t: GridTemplate) => t.featured).length;

    return {
      total,
      totalUses,
      avgRating: avgRating.toFixed(1),
      featured,
    };
  }, [templates]);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return templates.filter((template: GridTemplate) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = template.name.toLowerCase().includes(query);
        const matchesDescription = template.description
          ?.toLowerCase()
          .includes(query);
        const matchesTags = template.tags?.some((tag: string) =>
          tag.toLowerCase().includes(query),
        );
        if (!matchesName && !matchesDescription && !matchesTags) return false;
      }

      // Category filter
      const categoryFilter = activeFilters.category || [];
      if (
        categoryFilter.length > 0 &&
        !categoryFilter.includes(template.category)
      ) {
        return false;
      }

      // Complexity filter
      const complexityFilter = activeFilters.complexity || [];
      if (
        complexityFilter.length > 0 &&
        !complexityFilter.includes(template.complexity || "beginner")
      ) {
        return false;
      }

      // Featured filter
      const featuredFilter = activeFilters.featured || [];
      if (featuredFilter.includes("featured") && !template.featured) {
        return false;
      }

      return true;
    });
  }, [templates, searchQuery, activeFilters]);

  // Filter handlers
  const handleFilterChange = (filterId: string, values: string[]) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterId]: values,
    }));
  };

  const handleClearFilters = () => {
    setActiveFilters({});
    setSearchQuery("");
  };

  return (
    <>
      {/* Metrics Row */}
      {!isLoading && templates.length > 0 && (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Total Templates"
            value={metrics.total}
            icon={Sparkles}
          />
          <MetricCard label="Featured" value={metrics.featured} icon={Star} />
          <MetricCard
            label="Total Uses"
            value={metrics.totalUses.toLocaleString()}
            icon={Users}
          />
          <MetricCard
            label="Avg Rating"
            value={metrics.avgRating}
            icon={TrendingUp}
          />
        </div>
      )}

      <ListPage
        title="Discover Templates"
        subtitle="Browse and use pre-built workflow templates to get started quickly"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Studio", href: "/studio/discover" },
          { label: "Discover" },
        ]}
        searchQuery={searchQuery}
        searchPlaceholder="Search templates by name, description, or tags..."
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        filters={[
          {
            id: "category",
            label: "Category",
            type: "checkbox",
            options: [
              { value: "customer-support", label: "Customer Support" },
              { value: "sales", label: "Sales & Lead Gen" },
              { value: "marketing", label: "Marketing" },
              { value: "data-processing", label: "Data Processing" },
              { value: "automation", label: "Automation" },
              { value: "analytics", label: "Analytics" },
            ],
          },
          {
            id: "complexity",
            label: "Complexity",
            type: "checkbox",
            options: [
              { value: "beginner", label: "Beginner" },
              { value: "intermediate", label: "Intermediate" },
              { value: "advanced", label: "Advanced" },
            ],
          },
          {
            id: "featured",
            label: "Featured",
            type: "checkbox",
            options: [{ value: "featured", label: "Featured Only" }],
          },
        ]}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        actions={
          <Link href="/studio/lab">
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Create from Scratch
            </Button>
          </Link>
        }
        isLoading={isLoading}
        error={error as Error | null}
        isEmpty={!isLoading && templates.length === 0}
        emptyMessage="No templates available yet. Check back soon for new workflow templates."
        emptyAction={
          <Link href="/studio/lab">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create from Scratch
            </Button>
          </Link>
        }
      >
        {filteredTemplates.length === 0 && templates.length > 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No templates match your search or filters
            </p>
            <Button variant="outline" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template: GridTemplate) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={() => setSelectedTemplate(template)}
              />
            ))}
          </div>
        )}
      </ListPage>

      {/* Template Detail Modal */}
      {selectedTemplate && (
        <TemplateDetailModal
          template={selectedTemplate}
          open={!!selectedTemplate}
          onOpenChange={(open) => !open && setSelectedTemplate(null)}
        />
      )}
    </>
  );
}
