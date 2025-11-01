'use client';

import React from 'react';
import { formatDistanceToNow, format, isToday, isYesterday, startOfDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export interface ActivityItem {
  id: string;
  timestamp: Date | string;
  actor?: {
    name: string;
    avatar?: React.ReactNode;
  };
  action: string;
  target?: string;
  description?: string;
  icon?: React.ReactNode;
  metadata?: Record<string, any>;
}

export interface ActivityFeedProps {
  items: ActivityItem[];
  isLoading?: boolean;
  loadingCount?: number;
  groupByDate?: boolean;
  showRelativeTime?: boolean;
  emptyState?: React.ReactNode;
  className?: string;
}

function formatDateHeader(date: Date): string {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMMM d, yyyy');
}

function groupItemsByDate(items: ActivityItem[]): Map<string, ActivityItem[]> {
  const groups = new Map<string, ActivityItem[]>();

  items.forEach((item) => {
    const date = new Date(item.timestamp);
    const dayKey = startOfDay(date).toISOString();

    if (!groups.has(dayKey)) {
      groups.set(dayKey, []);
    }
    groups.get(dayKey)!.push(item);
  });

  return groups;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  items,
  isLoading,
  loadingCount = 5,
  groupByDate = true,
  showRelativeTime = true,
  emptyState,
  className,
}) => {
  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return dateB - dateA; // Most recent first
    });
  }, [items]);

  const groupedItems = React.useMemo(() => {
    if (!groupByDate) return null;
    return groupItemsByDate(sortedItems);
  }, [sortedItems, groupByDate]);

  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        {Array.from({ length: loadingCount }).map((_, index) => (
          <div key={index} className="flex gap-3">
            <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (sortedItems.length === 0) {
    return (
      <div className={cn('flex items-center justify-center py-12', className)}>
        {emptyState || (
          <div className="text-center">
            <p className="text-muted-foreground">No activity yet</p>
          </div>
        )}
      </div>
    );
  }

  const renderActivityItem = (item: ActivityItem) => {
    const date = new Date(item.timestamp);
    const timeAgo = showRelativeTime
      ? formatDistanceToNow(date, { addSuffix: true })
      : format(date, 'h:mm a');

    return (
      <div key={item.id} className="flex gap-3 group relative">
        {/* Timeline line */}
        <div className="absolute left-5 top-10 bottom-0 w-px bg-border group-last:hidden" />

        {/* Icon/Avatar */}
        <div className="flex-shrink-0 relative z-10">
          {item.icon ? (
            <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-muted-foreground">
              {item.icon}
            </div>
          ) : item.actor?.avatar ? (
            item.actor.avatar
          ) : (
            <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
              <span className="text-sm font-medium text-foreground">
                {item.actor?.name?.charAt(0) || '?'}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pb-6">
          <div className="bg-card border border-border rounded-lg p-4 hover:border-border-hover transition-colors duration-200">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">
                  {item.actor && <span className="font-medium">{item.actor.name}</span>}{' '}
                  <span className="text-muted-foreground">{item.action}</span>
                  {item.target && (
                    <>
                      {' '}
                      <span className="font-medium">{item.target}</span>
                    </>
                  )}
                </p>
              </div>
              <time
                dateTime={date.toISOString()}
                className="text-xs text-muted-foreground flex-shrink-0"
              >
                {timeAgo}
              </time>
            </div>

            {/* Description */}
            {item.description && (
              <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
            )}

            {/* Metadata */}
            {item.metadata && Object.keys(item.metadata).length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {Object.entries(item.metadata).map(([key, value]) => (
                  <span
                    key={key}
                    className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground"
                  >
                    {key}: {String(value)}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cn('space-y-6', className)}>
      {groupByDate && groupedItems ? (
        Array.from(groupedItems.entries())
          .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
          .map(([dateKey, dateItems]) => (
            <div key={dateKey}>
              <h3 className="text-sm font-semibold text-foreground mb-4">
                {formatDateHeader(new Date(dateKey))}
              </h3>
              <div className="space-y-0">{dateItems.map(renderActivityItem)}</div>
            </div>
          ))
      ) : (
        <div className="space-y-0">{sortedItems.map(renderActivityItem)}</div>
      )}
    </div>
  );
};

ActivityFeed.displayName = 'ActivityFeed';
