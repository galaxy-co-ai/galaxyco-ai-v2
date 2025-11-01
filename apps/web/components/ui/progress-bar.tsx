import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Progress Bar component using GalaxyCo.ai Design System tokens
 * Enhanced with striped, animated, and indeterminate states
 *
 * @example
 * <ProgressBar value={60} />
 * <ProgressBar value={80} variant="success" size="lg" showLabel />
 * <ProgressBar variant="primary" striped animated />
 */
const progressBarVariants = cva('relative w-full overflow-hidden rounded-full', {
  variants: {
    variant: {
      default: 'bg-muted',
      primary: 'bg-primary/20',
      success: 'bg-success/20',
      warning: 'bg-warning/20',
      destructive: 'bg-destructive/20',
    },
    size: {
      sm: 'h-1', // 4px
      default: 'h-2', // 8px (md)
      lg: 'h-3', // 12px
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

const progressBarFillVariants = cva('h-full transition-all duration-300 ease-in-out', {
  variants: {
    variant: {
      default: 'bg-foreground',
      primary: 'bg-primary',
      success: 'bg-success',
      warning: 'bg-warning',
      destructive: 'bg-destructive',
    },
    striped: {
      true: 'bg-stripe',
    },
    animated: {
      true: 'animate-progress-stripe',
    },
  },
  defaultVariants: {
    variant: 'default',
    striped: false,
    animated: false,
  },
});

export interface ProgressBarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'size'>,
    VariantProps<typeof progressBarVariants> {
  /**
   * Current progress value (0-100)
   */
  value?: number;

  /**
   * Maximum value
   * @default 100
   */
  max?: number;

  /**
   * Show percentage label
   * @default false
   */
  showLabel?: boolean;

  /**
   * Striped appearance
   * @default false
   */
  striped?: boolean;

  /**
   * Animate stripes (requires striped=true)
   * @default false
   */
  animated?: boolean;

  /**
   * Indeterminate loading state (no value)
   * @default false
   */
  indeterminate?: boolean;
}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      className,
      variant,
      size,
      value = 0,
      max = 100,
      showLabel = false,
      striped = false,
      animated = false,
      indeterminate = false,
      ...props
    },
    ref,
  ) => {
    const percentage = indeterminate ? 100 : Math.min(100, (value / max) * 100);

    return (
      <div className="w-full">
        <div
          ref={ref}
          role="progressbar"
          aria-valuenow={indeterminate ? undefined : value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={indeterminate ? 'Loading...' : `${percentage}% complete`}
          className={cn(progressBarVariants({ variant, size }), className)}
          {...props}
        >
          <div
            className={cn(
              progressBarFillVariants({
                variant,
                striped,
                animated: animated && striped,
              }),
              indeterminate && 'animate-progress-indeterminate',
              striped &&
                'bg-[length:1rem_1rem] bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)]',
            )}
            style={{
              width: indeterminate ? '30%' : `${percentage}%`,
            }}
          />
        </div>
        {showLabel && !indeterminate && (
          <span className="mt-1 text-xs text-foreground-muted">{Math.round(percentage)}%</span>
        )}
      </div>
    );
  },
);

ProgressBar.displayName = 'ProgressBar';

export { ProgressBar, progressBarVariants };
