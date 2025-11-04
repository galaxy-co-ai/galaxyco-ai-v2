/**
 * GalaxyCo.ai Stats Card Component
 * Display KPI with trend indicators
 * October 15, 2025
 */

import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn, formatNumber } from '@/lib/utils';
import type { DashboardStat } from '@/lib/types';

interface StatsCardProps {
  stat: DashboardStat;
}

export function StatsCard({ stat }: StatsCardProps) {
  const { title, value, change, changeType, icon, color, unit } = stat;

  // Determine trend icon and color
  const getTrendIcon = () => {
    if (!change || change === 0) return Minus;
    return changeType === 'increase' ? TrendingUp : TrendingDown;
  };

  const getTrendColor = () => {
    if (!change || change === 0) return 'text-neutral-500';
    return changeType === 'increase' ? 'text-green-600' : 'text-red-600';
  };

  const TrendIcon = getTrendIcon();

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>

          {/* Change indicator */}
          {change !== undefined && change !== 0 && (
            <div className={cn('flex items-center mt-2 text-sm', getTrendColor())}>
              <TrendIcon className="w-4 h-4 mr-1" />
              <span>{formatNumber.percent(Math.abs(change))}</span>
              {unit && <span className="ml-1 text-neutral-500">{unit}</span>}
            </div>
          )}

          {unit && change === 0 && <p className="mt-2 text-sm text-neutral-500">{unit}</p>}
        </div>

        {/* Icon */}
        {icon && (
          <div
            className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center',
              color === 'blue' &&
                'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
              color === 'green' &&
                'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
              color === 'orange' &&
                'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
              color === 'purple' &&
                'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
            )}
          >
            {/* Note: icon would be rendered here - for now using placeholder */}
            <div className="w-5 h-5" />
          </div>
        )}
      </div>
    </Card>
  );
}

export default StatsCard;
