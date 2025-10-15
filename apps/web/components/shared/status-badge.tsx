import { cn } from '@/lib/utils';
import { AgentStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: AgentStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        {
          'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400': status === 'running',
          'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400': status === 'idle',
          'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400': status === 'paused',
          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400': status === 'error',
          'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400': status === 'disabled',
        },
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', `status-${status}`)} />
      <span className="capitalize">{status}</span>
    </span>
  );
}
