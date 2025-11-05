/**
 * Stats Pills - Figma Dashboard Component
 * The 4 gradient metric pills at the top of the dashboard
 * Matches Figma design exactly
 */

'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StatPill {
  label: string;
  value: string | number;
  icon: LucideIcon;
  variant: 'blue' | 'green' | 'purple' | 'orange';
}

export interface StatsPillsProps {
  stats: StatPill[];
  className?: string;
}

const variantStyles = {
  blue: 'figma-pill-blue',
  green: 'figma-pill-green',
  purple: 'figma-pill-purple',
  orange: 'figma-pill-orange',
};

export function StatsPills({ stats, className }: StatsPillsProps) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4', className)}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={cn('figma-pill flex items-center gap-3', variantStyles[stat.variant])}
          >
            <Icon className="h-5 w-5" />
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold">{stat.value}</span>
              <span className="text-sm font-medium opacity-80">{stat.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
