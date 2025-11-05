/**
 * Metrics Bar - Figma CRM Component
 * Top metrics bar with 5 key CRM metrics
 * Matches Figma design exactly
 */

'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface CRMMetric {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: string; // e.g. "+12%", "-15%"
  changeType?: 'increase' | 'decrease' | 'neutral';
  badge?: string; // e.g. "Active"
  badgeColor?: string;
}

export interface MetricsBarProps {
  metrics: CRMMetric[];
  className?: string;
}

export function MetricsBar({ metrics, className }: MetricsBarProps) {
  return (
    <div className={cn('flex items-center gap-6 flex-wrap', className)}>
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        const changeColor =
          metric.changeType === 'increase'
            ? 'text-green-600'
            : metric.changeType === 'decrease'
            ? 'text-green-600' // Decrease can be good (e.g., response time)
            : 'text-muted-foreground';

        return (
          <div key={index} className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-muted-foreground">{metric.label}</span>
              <span className="text-lg font-semibold">{metric.value}</span>
              {metric.change && (
                <span className={cn('text-xs font-medium', changeColor)}>{metric.change}</span>
              )}
              {metric.badge && (
                <Badge
                  className={cn(
                    'text-xs h-5',
                    metric.badgeColor || 'bg-red-500/10 text-red-600 border-red-500/20'
                  )}
                >
                  {metric.badge}
                </Badge>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

