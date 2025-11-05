/**
 * Agent Card - Figma Dashboard Component
 * Individual agent status card with pulse animation
 * Matches Figma design exactly
 */

'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AgentCardProps {
  name: string;
  type: string;
  status: 'active' | 'processing' | 'idle';
  tasksCompleted: number;
  lastActive: string;
  className?: string;
}

const statusConfig = {
  active: {
    label: 'active',
    dotColor: 'bg-green-600',
    badgeClass: 'figma-badge-active',
    pulse: false,
  },
  processing: {
    label: 'processing',
    dotColor: 'bg-blue-600',
    badgeClass: 'figma-badge-processing',
    pulse: true,
  },
  idle: {
    label: 'idle',
    dotColor: 'bg-gray-400',
    badgeClass: 'figma-badge-idle',
    pulse: false,
  },
};

export function AgentCard({
  name,
  type,
  status,
  tasksCompleted,
  lastActive,
  className,
}: AgentCardProps) {
  const config = statusConfig[status];

  return (
    <Card className={cn('figma-card p-6 cursor-pointer', className)}>
      <div className="space-y-4">
        {/* Icon and Name */}
        <div className="flex items-start gap-4">
          <div className="figma-icon-bg h-12 w-12 flex-shrink-0">
            <Bot className="h-6 w-6 text-purple-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base truncate">{name}</h3>
            <p className="text-sm text-muted-foreground">{type}</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <Badge className={config.badgeClass}>
            <span
              className={cn(
                'h-1.5 w-1.5 rounded-full mr-1.5',
                config.dotColor,
                config.pulse && 'figma-pulse'
              )}
            />
            {config.label}
          </Badge>
        </div>

        {/* Metrics */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{tasksCompleted} tasks</span>
          <span>•</span>
          <span>{lastActive}</span>
        </div>
      </div>
    </Card>
  );
}

