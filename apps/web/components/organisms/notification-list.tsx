'use client';

import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Check, CheckCheck, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date | string;
  isRead: boolean;
  icon?: React.ReactNode;
  type?: 'info' | 'success' | 'warning' | 'error';
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export type NotificationFilter = 'all' | 'unread' | 'read';

export interface NotificationListProps {
  notifications: Notification[];
  filter?: NotificationFilter;
  onFilterChange?: (filter: NotificationFilter) => void;
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onDelete?: (id: string) => void;
  onClearAll?: () => void;
  isLoading?: boolean;
  loadingCount?: number;
  emptyState?: React.ReactNode;
  className?: string;
}

const filterTabs: Array<{ value: NotificationFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'unread', label: 'Unread' },
  { value: 'read', label: 'Read' },
];

const typeStyles = {
  info: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  success: 'bg-green-500/10 text-green-500 border-green-500/20',
  warning: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  error: 'bg-red-500/10 text-red-500 border-red-500/20',
};

export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  filter = 'all',
  onFilterChange,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onClearAll,
  isLoading,
  loadingCount = 5,
  emptyState,
  className,
}) => {
  const filteredNotifications = React.useMemo(() => {
    if (filter === 'unread') {
      return notifications.filter((n) => !n.isRead);
    }
    if (filter === 'read') {
      return notifications.filter((n) => n.isRead);
    }
    return notifications;
  }, [notifications, filter]);

  const unreadCount = React.useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        {Array.from({ length: loadingCount }).map((_, index) => (
          <div key={index} className="flex gap-3 p-4 border border-border rounded-lg">
            <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header with filter tabs and actions */}
      <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
        {/* Filter Tabs */}
        {onFilterChange && (
          <div className="flex items-center gap-2">
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => onFilterChange(tab.value)}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                  filter === tab.value
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
                )}
              >
                {tab.label}
                {tab.value === 'unread' && unreadCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 text-xs font-semibold rounded-full bg-primary text-primary-foreground">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          {onMarkAllAsRead && unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onMarkAllAsRead} className="h-8">
              <CheckCheck className="h-4 w-4 mr-1.5" />
              Mark all read
            </Button>
          )}
          {onClearAll && notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="h-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Notification items */}
      {filteredNotifications.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          {emptyState || (
            <div className="text-center">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredNotifications.map((notification) => {
            const timestamp = new Date(notification.timestamp);
            const timeAgo = formatDistanceToNow(timestamp, { addSuffix: true });

            return (
              <div
                key={notification.id}
                className={cn(
                  'group relative flex gap-3 p-4 rounded-lg border transition-all duration-200',
                  notification.isRead
                    ? 'bg-card border-border hover:border-border-hover'
                    : 'bg-accent/50 border-accent hover:border-accent-foreground',
                )}
              >
                {/* Icon */}
                <div className="flex-shrink-0 relative">
                  <div
                    className={cn(
                      'h-10 w-10 rounded-full flex items-center justify-center border',
                      notification.type && typeStyles[notification.type],
                      !notification.type && 'bg-accent text-muted-foreground border-border',
                    )}
                  >
                    {notification.icon || <Bell className="h-5 w-5" />}
                  </div>
                  {!notification.isRead && (
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full border-2 border-background" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-foreground">{notification.title}</h4>
                    <time
                      dateTime={timestamp.toISOString()}
                      className="text-xs text-muted-foreground flex-shrink-0"
                    >
                      {timeAgo}
                    </time>
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>

                  {notification.action && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={notification.action.onClick}
                      className="h-7 px-2 -ml-2"
                    >
                      {notification.action.label}
                    </Button>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {onMarkAsRead && !notification.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onMarkAsRead(notification.id)}
                      className="h-8 w-8 p-0"
                      aria-label="Mark as read"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(notification.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      aria-label="Delete notification"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

NotificationList.displayName = 'NotificationList';
