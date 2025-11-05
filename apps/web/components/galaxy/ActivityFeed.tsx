'use client';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Activity {
  id: string;
  agent: string;
  action: string;
  time: string;
  status: 'success' | 'warning' | 'error';
}

interface ActivityFeedProps {
  activities: Activity[];
  className?: string;
}

const statusColors = {
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
};

export function ActivityFeed({ activities, className }: ActivityFeedProps) {
  return (
    <Card
      className={cn(
        'p-0 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-0 rounded-2xl overflow-hidden',
        className,
      )}
    >
      <div className="p-6 border-b">
        <h3 className="font-semibold text-lg">Recent Activity</h3>
        <p className="text-sm text-muted-foreground">Latest agent actions</p>
      </div>

      <div className="h-[400px] overflow-y-auto">
        <div className="p-6 space-y-4">
          {activities.map((activity, idx) => (
            <div key={activity.id}>
              <div className="flex gap-3">
                <div className="relative flex flex-col items-center">
                  <div className={cn('h-2 w-2 rounded-full', statusColors[activity.status])} />
                  {idx < activities.length - 1 && <div className="w-px h-full bg-border mt-2" />}
                </div>

                <div className="flex-1 pb-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.agent}</p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">{activity.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
