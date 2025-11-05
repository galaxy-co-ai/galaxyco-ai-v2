/**
 * Metrics Grid - Figma Marketing Component
 * Top 4 metric cards with icons and trends
 * Matches Figma design exactly
 */

'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MarketingMetric {
  icon: LucideIcon;
  iconColor: string;
  iconBgGradient: string;
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  trendType?: 'positive' | 'neutral' | 'negative';
}

export interface MetricsGridProps {
  metrics: MarketingMetric[];
  className?: string;
}

export function MetricsGrid({ metrics, className }: MetricsGridProps) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4', className)}>
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        const trendColor =
          metric.trendType === 'positive'
            ? 'text-green-600'
            : metric.trendType === 'negative'
              ? 'text-red-600'
              : 'text-muted-foreground';

        return (
          <Card key={index} className="figma-card p-6">
            <div className="space-y-4">
              {/* Icon */}
              <div
                className={cn(
                  'h-12 w-12 rounded-xl flex items-center justify-center',
                  metric.iconBgGradient,
                )}
              >
                <Icon className={cn('h-6 w-6', metric.iconColor)} />
              </div>

              {/* Label and Value */}
              <div>
                <p className="text-sm text-muted-foreground font-medium">{metric.label}</p>
                <p className="text-3xl font-bold mt-1">{metric.value}</p>
              </div>

              {/* Trend or Subtitle */}
              {metric.trend && (
                <p className={cn('text-sm font-medium', trendColor)}>{metric.trend}</p>
              )}
              {metric.subtitle && (
                <p className="text-sm text-muted-foreground">{metric.subtitle}</p>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
