/**
 * Kibo UI - Status Component
 * Visual status indicators with colors and animations
 */

import { cn } from '@/lib/utils';
import { type HTMLAttributes } from 'react';

export type StatusVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'pending';
export type StatusSize = 'sm' | 'md' | 'lg';

export interface StatusProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  variant?: StatusVariant;
  size?: StatusSize;
  label?: string;
  animated?: boolean;
  showDot?: boolean;
}

const variantStyles: Record<StatusVariant, string> = {
  default: 'bg-neutral-500 text-neutral-500',
  success: 'bg-green-500 text-green-500',
  warning: 'bg-amber-500 text-amber-500',
  error: 'bg-red-500 text-red-500',
  info: 'bg-blue-500 text-blue-500',
  pending: 'bg-purple-500 text-purple-500',
};

const sizeStyles: Record<StatusSize, { dot: string; text: string }> = {
  sm: { dot: 'size-2', text: 'text-xs' },
  md: { dot: 'size-3', text: 'text-sm' },
  lg: { dot: 'size-4', text: 'text-base' },
};

export function Status({
  variant = 'default',
  size = 'md',
  label,
  animated = false,
  showDot = true,
  className,
  ...props
}: StatusProps) {
  const colorClass = variantStyles[variant];
  const { dot, text } = sizeStyles[size];

  return (
    <div className={cn('inline-flex items-center gap-2', className)} {...props}>
      {showDot && (
        <div className="relative">
          <div
            className={cn(
              'rounded-full',
              dot,
              colorClass.split(' ')[0],
              animated && 'animate-pulse',
            )}
          />
          {animated && (
            <div
              className={cn(
                'absolute inset-0 rounded-full animate-ping',
                colorClass.split(' ')[0],
                'opacity-75',
              )}
            />
          )}
        </div>
      )}
      {label && <span className={cn('font-medium', text, colorClass.split(' ')[1])}>{label}</span>}
    </div>
  );
}
