/**
 * Workflow Canvas - Figma Studio Component
 * Right panel with visual workflow builder
 * Matches Figma design exactly
 */

'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap } from 'lucide-react';
import { VisualGridBuilder } from '@/components/figma/shared';
import { cn } from '@/lib/utils';

export interface WorkflowCanvasProps {
  activeCount?: number;
  isLive?: boolean;
  className?: string;
}

export function WorkflowCanvas({ activeCount = 3, isLive = true, className }: WorkflowCanvasProps) {
  return (
    <Card className={cn('figma-card flex flex-col h-[calc(100vh-16rem)]', className)}>
      {/* Header with Status */}
      <div className="p-6 border-b flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-base">Visual Workflow</h3>
          <p className="text-sm text-muted-foreground">
            {activeCount} workflows running across your agent ecosystem
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-green-600 mr-1.5 figma-pulse" />
            {activeCount} Active
          </Badge>
          {isLive && (
            <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">
              <Zap className="h-3 w-3 mr-1" />
              Live
            </Badge>
          )}
        </div>
      </div>

      {/* Workflow Builder */}
      <div className="flex-1 relative">
        <VisualGridBuilder />
      </div>
    </Card>
  );
}
