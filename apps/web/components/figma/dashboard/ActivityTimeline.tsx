/**
 * Activity Timeline - Figma Dashboard Component
 * Right sidebar showing recent agent activities
 * Matches Figma design exactly
 */

'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export interface Activity {
  id: string;
  description: string;
  agent: string;
  time: string;
  status: 'success' | 'warning' | 'error';
}

export interface ActivityTimelineProps {
  activities: Activity[];
  className?: string;
}

const statusDotClass = {
  success: 'figma-timeline-dot-success',
  warning: 'figma-timeline-dot-warning',
  error: 'figma-timeline-dot-error',
};

export function ActivityTimeline({ activities, className }: ActivityTimelineProps) {
  return (
    <Card className={cn('figma-card p-6', className)}>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-base">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">Latest agent actions</p>
        </div>

        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={activity.id} className="flex gap-4">
                {/* Timeline dot and line */}
                <div className="flex flex-col items-center">
                  <div
                    className={cn('figma-timeline-dot', statusDotClass[activity.status])}
                  />
                  {index < activities.length - 1 && (
                    <div className="w-px h-full bg-border mt-2" />
                  )}
                </div>

                {/* Activity content */}
                <div className="flex-1 pb-4">
                  <p className="text-sm font-medium">{activity.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.agent}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
}

