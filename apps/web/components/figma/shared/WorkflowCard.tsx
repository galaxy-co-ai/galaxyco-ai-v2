'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GitBranch, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkflowCardProps {
  name: string;
  description: string;
  status: 'active' | 'processing' | 'draft' | 'paused';
  triggers: number;
  actions: number;
  runs: number;
  className?: string;
  onClick?: () => void;
}

const statusConfig = {
  active: {
    bg: 'bg-green-500/10',
    text: 'text-green-600',
    dot: 'bg-green-600',
  },
  processing: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-600',
    dot: 'bg-blue-600 animate-pulse',
  },
  draft: {
    bg: 'bg-gray-500/10',
    text: 'text-gray-600',
    dot: 'bg-gray-600',
  },
  paused: {
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-600',
    dot: 'bg-yellow-600',
  },
};

export function WorkflowCard({
  name,
  description,
  status,
  triggers,
  actions,
  runs,
  className,
  onClick,
}: WorkflowCardProps) {
  const config = statusConfig[status];

  return (
    <Card
      className={cn(
        'p-4 cursor-pointer transition-all border-0 shadow-sm hover:shadow-md',
        className,
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
        <Badge
          variant="outline"
          className={cn('text-xs border-0 rounded-full shrink-0 ml-2', config.bg, config.text)}
        >
          <div className={cn('h-1.5 w-1.5 rounded-full mr-1.5', config.dot)} />
          {status}
        </Badge>
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
        <span>{triggers} triggers</span>
        <span>{actions} actions</span>
        <span>{runs} runs</span>
      </div>
    </Card>
  );
}
