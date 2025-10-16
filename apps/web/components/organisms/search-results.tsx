'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  href: string;
  type: string;
  icon?: React.ReactNode;
  badge?: {
    label: string;
    variant?: 'default' | 'success' | 'warning' | 'destructive';
  };
  metadata?: string;
  highlight?: string;
}

export interface SearchResultsProps {
  results: SearchResult[];
  query?: string;
  groupByType?: boolean;
  isLoading?: boolean;
  loadingCount?: number;
  emptyState?: React.ReactNode;
  className?: string;
}

function groupResultsByType(results: SearchResult[]): Map<string, SearchResult[]> {
  const groups = new Map<string, SearchResult[]>();

  results.forEach((result) => {
    if (!groups.has(result.type)) {
      groups.set(result.type, []);
    }
    groups.get(result.type)!.push(result);
  });

  return groups;
}

function highlightText(text: string, query?: string): React.ReactNode {
  if (!query || query.trim() === '') return text;

  const regex = new RegExp(`(${query})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? (
      <mark
        key={index}
        className="bg-yellow-200 dark:bg-yellow-900/50 text-foreground font-semibold px-0.5"
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  query,
  groupByType = true,
  isLoading,
  loadingCount = 6,
  emptyState,
  className,
}) => {
  const groupedResults = React.useMemo(() => {
    if (!groupByType) return null;
    return groupResultsByType(results);
  }, [results, groupByType]);

  if (isLoading) {
    return (
      <div className={cn('space-y-6', className)}>
        {Array.from({ length: 3 }).map((_, groupIndex) => (
          <div key={groupIndex} className="space-y-3">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-2">
              {Array.from({ length: loadingCount / 3 }).map((_, index) => (
                <Skeleton key={index} className="h-20 w-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className={cn('flex items-center justify-center py-12', className)}>
        {emptyState || (
          <div className="text-center max-w-md">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground mb-1">
              No results found{query ? ` for "${query}"` : ''}
            </p>
            <p className="text-sm text-muted-foreground">
              Try different keywords or check your spelling
            </p>
          </div>
        )}
      </div>
    );
  }

  const renderResult = (result: SearchResult) => (
    <Link
      key={result.id}
      href={result.href}
      className={cn(
        'group block p-4 rounded-lg border border-border bg-card',
        'hover:border-border-hover hover:shadow-sm transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        {result.icon && (
          <div className="flex-shrink-0 mt-0.5">
            <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center text-muted-foreground">
              {result.icon}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              {highlightText(result.title, query)}
            </h3>
            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </div>

          {result.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {highlightText(result.description, query)}
            </p>
          )}

          {result.highlight && (
            <p className="text-xs text-muted-foreground bg-accent/50 border border-border rounded px-2 py-1 mb-2 line-clamp-1">
              ...{highlightText(result.highlight, query)}...
            </p>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            {result.badge && (
              <Badge variant={result.badge.variant} className="text-xs">
                {result.badge.label}
              </Badge>
            )}
            {result.metadata && (
              <span className="text-xs text-muted-foreground">
                {result.metadata}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className={cn('space-y-6', className)}>
      {groupByType && groupedResults ? (
        Array.from(groupedResults.entries()).map(([type, typeResults]) => (
          <div key={type}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-foreground capitalize">
                {type}
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({typeResults.length})
                </span>
              </h2>
            </div>
            <div className="space-y-2">
              {typeResults.map(renderResult)}
            </div>
          </div>
        ))
      ) : (
        <div className="space-y-2">
          {results.map(renderResult)}
        </div>
      )}
    </div>
  );
};

SearchResults.displayName = 'SearchResults';
