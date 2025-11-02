/**
 * Kibo UI - Banner Component
 * Full-width announcement or alert banner
 */

'use client';

import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useState, type HTMLAttributes, type ReactNode } from 'react';

export interface BannerProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'info' | 'success' | 'warning' | 'error';
  dismissible?: boolean;
  icon?: ReactNode;
  action?: ReactNode;
}

const variantStyles = {
  default: 'bg-muted text-foreground border-border',
  info: 'bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950 dark:text-blue-100 dark:border-blue-800',
  success:
    'bg-green-50 text-green-900 border-green-200 dark:bg-green-950 dark:text-green-100 dark:border-green-800',
  warning:
    'bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950 dark:text-amber-100 dark:border-amber-800',
  error:
    'bg-red-50 text-red-900 border-red-200 dark:bg-red-950 dark:text-red-100 dark:border-red-800',
};

export function Banner({
  variant = 'default',
  dismissible = false,
  icon,
  action,
  className,
  children,
  ...props
}: BannerProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div
      className={cn(
        'flex items-center gap-3 border-y px-4 py-3',
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {icon && <div className="shrink-0">{icon}</div>}
      <div className="flex-1 text-sm font-medium">{children}</div>
      {action && <div className="shrink-0">{action}</div>}
      {dismissible && (
        <button
          onClick={() => setVisible(false)}
          className="shrink-0 rounded-md p-1 hover:bg-black/5 dark:hover:bg-white/10"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
