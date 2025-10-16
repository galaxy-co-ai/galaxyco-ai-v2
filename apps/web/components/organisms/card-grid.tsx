"use client";

import React from "react";
import { Grid, List, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export type ViewMode = "grid" | "list";

export interface CardGridProps<T> {
  items: T[];
  renderCard: (item: T, viewMode: ViewMode) => React.ReactNode;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  onFilterClick?: () => void;
  filterCount?: number;
  isLoading?: boolean;
  loadingCount?: number;
  emptyState?: React.ReactNode;
  header?: React.ReactNode;
  actions?: React.ReactNode;
  gridCols?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  className?: string;
}

export function CardGrid<T>({
  items,
  renderCard,
  viewMode = "grid",
  onViewModeChange,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  onFilterClick,
  filterCount,
  isLoading,
  loadingCount = 6,
  emptyState,
  header,
  actions,
  gridCols = { sm: 1, md: 2, lg: 3, xl: 4 },
  className,
}: CardGridProps<T>) {
  const gridColsClass = cn(
    "grid gap-4",
    gridCols.sm && `grid-cols-${gridCols.sm}`,
    gridCols.md && `md:grid-cols-${gridCols.md}`,
    gridCols.lg && `lg:grid-cols-${gridCols.lg}`,
    gridCols.xl && `xl:grid-cols-${gridCols.xl}`,
  );

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-2">
          {/* Search */}
          {onSearchChange && (
            <div className="flex-1 max-w-md">
              <Input
                type="search"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="h-10"
              />
            </div>
          )}

          {/* Filter Button */}
          {onFilterClick && (
            <Button
              variant="outline"
              size="default"
              onClick={onFilterClick}
              className="relative"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {filterCount !== undefined && filterCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 text-xs font-semibold rounded-full bg-primary text-primary-foreground">
                  {filterCount}
                </span>
              )}
            </Button>
          )}

          {/* Custom Header */}
          {header && <div className="flex-1">{header}</div>}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {actions}

          {/* View Toggle */}
          {onViewModeChange && (
            <div className="flex items-center border border-border rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange("grid")}
                className="h-8 px-3"
                aria-label="Grid view"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange("list")}
                className="h-8 px-3"
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className={viewMode === "grid" ? gridColsClass : "space-y-4"}>
          {Array.from({ length: loadingCount }).map((_, index) => (
            <Skeleton key={index} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          {emptyState || (
            <div className="text-center">
              <p className="text-muted-foreground">No items found</p>
            </div>
          )}
        </div>
      ) : (
        <div className={viewMode === "grid" ? gridColsClass : "space-y-4"}>
          {items.map((item, index) => (
            <div key={index}>{renderCard(item, viewMode)}</div>
          ))}
        </div>
      )}
    </div>
  );
}

CardGrid.displayName = "CardGrid";
