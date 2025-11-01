/**
 * GalaxyCo.ai Activity Feed Component
 * Display recent notifications and activity
 * October 15, 2025
 */

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle, AlertCircle, Mail, UserPlus } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import type { Notification } from '@/lib/types';

interface ActivityFeedProps {
  activities: Notification[];
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'agent_success':
    case 'workflow_complete':
      return CheckCircle;
    case 'agent_error':
    case 'workflow_error':
      return AlertCircle;
    case 'email_sent':
    case 'email_reply':
      return Mail;
    case 'prospect_qualified':
      return UserPlus;
    default:
      return Bell;
  }
};

const getNotificationColor = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
    case 'high':
      return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400';
    case 'normal':
      return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
    case 'low':
      return 'text-neutral-600 bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-400';
    default:
      return 'text-neutral-600 bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-400';
  }
};

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Recent Activity
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Latest updates from your agents
          </p>
        </div>

        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
          <Bell className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = getNotificationIcon(activity.type);
          const colorClass = getNotificationColor(activity.priority);

          return (
            <div
              key={activity.id}
              className="flex gap-3 pb-4 border-b border-neutral-200 dark:border-neutral-700 last:border-0 last:pb-0"
            >
              {/* Icon */}
              <div
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                  colorClass,
                )}
              >
                <Icon className="w-4 h-4" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-sm text-neutral-900 dark:text-neutral-100">
                    {activity.title}
                  </p>
                  {activity.priority === 'high' ||
                    (activity.priority === 'urgent' && (
                      <Badge variant="destructive" className="text-xs">
                        {activity.priority}
                      </Badge>
                    ))}
                </div>

                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  {activity.message}
                </p>

                <p className="text-xs text-neutral-500 mt-2">
                  {formatDate.relative(activity.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* View All Button */}
      <Button variant="ghost" className="w-full mt-4" size="sm">
        View all activity
      </Button>
    </Card>
  );
}

export default ActivityFeed;
