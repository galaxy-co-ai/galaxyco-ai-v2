"use client";

import React, { useState } from "react";
import { PageShell, PageShellProps } from "./page-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FilterPanel } from "@/components/organisms/filter-panel";
import { Search, Filter, Grid, List } from "lucide-react";

export type ViewMode = "grid" | "list";

export interface ListPageFilter {
  id: string;
  label: string;
  type: "checkbox" | "radio";
  options: Array<{ value: string; label: string; count?: number }>;
}

export interface ListPageProps extends Omit<PageShellProps, "children"> {
  /** Search query */
  searchQuery?: string;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Search change handler */
  onSearchChange?: (query: string) => void;
  /** View mode (grid or list) */
  viewMode?: ViewMode;
  /** View mode change handler */
  onViewModeChange?: (mode: ViewMode) => void;
  /** Show view mode toggle */
  showViewToggle?: boolean;
  /** Filter configuration */
  filters?: ListPageFilter[];
  /** Active filter values */
  activeFilters?: Record<string, string[]>;
  /** Filter change handler */
  onFilterChange?: (filterId: string, values: string[]) => void;
  /** Clear all filters handler */
  onClearFilters?: () => void;
  /** Show filters panel */
  showFilters?: boolean;
  /** Content to render (usually CardGrid or DataTable) */
  children: React.ReactNode;
  /** Additional toolbar actions */
  toolbarActions?: React.ReactNode;
}

/**
 * ListPage - Template for list/collection views
 *
 * Features:
 * - Search bar
 * - View mode toggle (grid/list)
 * - Filter panel
 * - Consistent layout
 * - All PageShell features (breadcrumbs, loading, error, empty states)
 *
 * @example
 * ```tsx
 * <ListPage
 *   title="Agents"
 *   subtitle="Manage your AI agents"
 *   breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Agents' }]}
 *   searchQuery={query}
 *   onSearchChange={setQuery}
 *   viewMode={viewMode}
 *   onViewModeChange={setViewMode}
 *   filters={[
 *     {
 *       id: 'status',
 *       label: 'Status',
 *       type: 'checkbox',
 *       options: [
 *         { value: 'active', label: 'Active', count: 12 },
 *         { value: 'draft', label: 'Draft', count: 5 }
 *       ]
 *     }
 *   ]}
 *   activeFilters={activeFilters}
 *   onFilterChange={handleFilterChange}
 *   isLoading={isLoading}
 * >
 *   <CardGrid items={items} />
 * </ListPage>
 * ```
 */
export function ListPage({
  searchQuery = "",
  searchPlaceholder = "Search...",
  onSearchChange,
  viewMode = "grid",
  onViewModeChange,
  showViewToggle = true,
  filters = [],
  activeFilters = {},
  onFilterChange,
  onClearFilters,
  showFilters = true,
  children,
  toolbarActions,
  ...pageShellProps
}: ListPageProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Count active filters
  const activeFilterCount = Object.values(activeFilters).reduce(
    (acc, values) => acc + values.length,
    0,
  );

  return (
    <PageShell {...pageShellProps}>
      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search & Filters */}
        <div className="flex flex-1 items-center gap-2">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Filter Toggle */}
          {showFilters && filters.length > 0 && (
            <Button
              variant="outline"
              size="default"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          )}
        </div>

        {/* View Toggle & Actions */}
        <div className="flex items-center gap-2">
          {toolbarActions}

          {showViewToggle && onViewModeChange && (
            <div className="flex items-center rounded-lg border border-border bg-card">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange("grid")}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && isFilterOpen && filters.length > 0 && (
        <div className="mb-6">
          <FilterPanel
            groups={filters.map((filter) => ({
              id: filter.id,
              label: filter.label,
              type: filter.type,
              options: filter.options,
            }))}
            selectedFilters={activeFilters}
            onFilterChange={(groupId: string, values: string[]) =>
              onFilterChange?.(groupId, values)
            }
            onClearAll={onClearFilters}
            activeFilterCount={activeFilterCount}
          />
        </div>
      )}

      {/* Content */}
      {children}
    </PageShell>
  );
}
