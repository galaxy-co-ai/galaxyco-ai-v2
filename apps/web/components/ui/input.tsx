import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Input component using GalaxyCo.ai Design System tokens
 * Implements input patterns from 01-DESIGN-TOKENS.md
 */
const inputVariants = cva(
  [
    'flex w-full rounded border transition-colors duration-fast',
    'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
    'placeholder:text-foreground-subtle',
    'focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'read-only:bg-background-subtle read-only:cursor-default',
  ],
  {
    variants: {
      variant: {
        // Default input styling
        default: [
          'border-border bg-background-subtle text-foreground',
          'hover:border-border-hover',
        ],
        // Error state
        destructive: [
          'border-destructive bg-background-subtle text-foreground',
          'focus:ring-destructive focus:border-destructive',
        ],
        // Success state
        success: [
          'border-success bg-background-subtle text-foreground',
          'focus:ring-success focus:border-success',
        ],
      },
      size: {
        sm: 'h-8 px-3 py-1 text-sm',
        default: 'h-10 px-4 py-2 text-sm',
        lg: 'h-12 px-4 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, error, ...props }, ref) => {
    return (
      <input
        className={cn(
          inputVariants({
            variant: error ? 'destructive' : variant,
            size,
            className,
          }),
        )}
        ref={ref}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${props.id}-error` : undefined}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input, inputVariants };
