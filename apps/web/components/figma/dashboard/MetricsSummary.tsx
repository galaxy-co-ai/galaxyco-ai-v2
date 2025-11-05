/**
 * Metrics Summary - Figma Dashboard Component
 * The 3 bottom metric cards (Workflows, Automations, Integrations)
 * Matches Figma design exactly
 */

'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MetricSummary {
  icon: LucideIcon;
  iconColor: string;
  iconBgGradient: string;
  label: string;
  value: number | string;
  subtitle: string;
  onClick?: () => void;
}

export interface MetricsSummaryProps {
  metrics: MetricSummary[];
  className?: string;
}

export function MetricsSummary({ metrics, className }: MetricsSummaryProps) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-3 gap-6', className)}>
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card
            key={index}
            className={cn(
              'figma-card p-8 cursor-pointer',
              'hover:scale-[1.02] transition-transform duration-200',
            )}
            onClick={metric.onClick}
          >
            <div className="space-y-4">
              {/* Icon */}
              <div
                className={cn(
                  'h-14 w-14 rounded-xl flex items-center justify-center',
                  metric.iconBgGradient,
                )}
              >
                <Icon className={cn('h-7 w-7', metric.iconColor)} />
              </div>

              {/* Label and Value */}
              <div>
                <p className="text-sm text-muted-foreground font-medium">{metric.label}</p>
                <p className="text-4xl font-bold mt-1">{metric.value}</p>
              </div>

              {/* Subtitle */}
              <p className="text-sm text-muted-foreground">{metric.subtitle}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
