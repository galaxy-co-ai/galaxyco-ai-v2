/**
 * Kibo UI - Pill Component
 * Rounded pill-shaped tags or labels
 */

import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { type HTMLAttributes } from 'react';

export interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  removable?: boolean;
  onRemove?: () => void;
}

const variantStyles = {
  default: 'bg-muted text-foreground',
  primary: 'bg-primary text-primary-foreground',
  success: 'bg-green-500 text-white',
  warning: 'bg-amber-500 text-white',
  error: 'bg-red-500 text-white',
};

export function Pill({
  variant = 'default',
  removable = false,
  onRemove,
  className,
  children,
  ...props
}: PillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium',
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
      {removable && onRemove && (
        <button
          onClick={onRemove}
          className="rounded-full hover:bg-black/10 dark:hover:bg-white/10 p-0.5"
          type="button"
        >
          <X className="size-3" />
        </button>
      )}
    </span>
  );
}
