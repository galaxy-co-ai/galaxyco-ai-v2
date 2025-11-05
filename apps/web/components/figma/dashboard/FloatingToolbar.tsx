/**
 * Floating Toolbar - Figma Dashboard Component
 * The 8 action buttons that float in the center
 * Matches Figma design exactly
 */

'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export interface ToolbarAction {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}

export interface FloatingToolbarProps {
  actions: ToolbarAction[];
  separatorAfter?: number; // Index after which to add separator
  className?: string;
}

export function FloatingToolbar({ actions, separatorAfter = 3, className }: FloatingToolbarProps) {
  return (
    <TooltipProvider>
      <div className={cn('figma-toolbar flex items-center gap-1', className)}>
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <React.Fragment key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={action.onClick}
                    className="h-10 w-10 p-0 hover:bg-black/5 rounded-lg transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{action.label}</p>
                </TooltipContent>
              </Tooltip>

              {/* Add separator if specified */}
              {index === separatorAfter && index < actions.length - 1 && (
                <Separator orientation="vertical" className="h-6 mx-1" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </TooltipProvider>
  );
}

