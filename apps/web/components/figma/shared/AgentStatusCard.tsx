'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon, Bot, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgentStatusCardProps {
  name: string;
  type: string;
  status: 'active' | 'idle' | 'processing';
  tasksCompleted: number;
  lastActive: string;
  className?: string;
}

const statusConfig = {
  processing: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-600',
    dot: 'bg-blue-600 animate-pulse',
  },
  active: {
    bg: 'bg-green-500/10',
    text: 'text-green-600',
    dot: 'bg-green-600',
  },
  idle: {
    bg: 'bg-gray-500/10',
    text: 'text-gray-600',
    dot: 'bg-gray-600',
  },
};

export function AgentStatusCard({
  name,
  type,
  status,
  tasksCompleted,
  lastActive,
  className,
}: AgentStatusCardProps) {
  const config = statusConfig[status];

  return (
    <Card
      className={cn(
        'p-4 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border-0 rounded-xl',
        'hover:shadow-[0_6px_30px_rgb(0,0,0,0.08)] transition-all cursor-pointer',
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center shrink-0">
          <Bot className="h-6 w-6 text-purple-500" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{type}</p>
            </div>
            <Badge
              variant="outline"
              className={cn('shrink-0 border-0 text-xs rounded-full', config.bg, config.text)}
            >
              <div className={cn('h-1.5 w-1.5 rounded-full mr-1.5', config.dot)} />
              {status}
            </Badge>
          </div>

          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              <span>{tasksCompleted} tasks</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{lastActive}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
