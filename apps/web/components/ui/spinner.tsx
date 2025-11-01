import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Spinner component using GalaxyCo.ai Design System tokens
 * Loading indicator with smooth rotation animation
 *
 * @example
 * <Spinner />
 * <Spinner size="lg" variant="primary" />
 * <Spinner label="Loading data..." />
 */
const spinnerVariants = cva('animate-spin rounded-full border-2', {
  variants: {
    variant: {
      // Default - neutral
      default: 'border-border border-t-foreground',
      // Primary - brand color
      primary: 'border-primary/20 border-t-primary',
      // Success
      success: 'border-success/20 border-t-success',
      // Warning
      warning: 'border-warning/20 border-t-warning',
      // Destructive
      destructive: 'border-destructive/20 border-t-destructive',
    },
    size: {
      xs: 'h-3 w-3 border', // 12px, thinner border
      sm: 'h-4 w-4', // 16px
      default: 'h-5 w-5', // 20px (md)
      lg: 'h-6 w-6 border-[3px]', // 24px, thicker border
      xl: 'h-8 w-8 border-[3px]', // 32px, thicker border
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface SpinnerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'size'>,
    VariantProps<typeof spinnerVariants> {
  /**
   * Screen reader label for accessibility
   * @default "Loading..."
   */
  label?: string;
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, variant, size, label = 'Loading...', ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-label={label}
        className={cn(spinnerVariants({ variant, size }), className)}
        {...props}
      >
        <span className="sr-only">{label}</span>
      </div>
    );
  },
);

Spinner.displayName = 'Spinner';

export { Spinner, spinnerVariants };
