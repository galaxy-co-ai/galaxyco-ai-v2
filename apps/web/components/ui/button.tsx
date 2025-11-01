import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Button component using GalaxyCo.ai Design System tokens
 * Implements all variants from 01-DESIGN-TOKENS.md
 */
const buttonVariants = cva(
  // Base styles using design tokens
  [
    'inline-flex items-center justify-center gap-2 rounded font-medium',
    'transition-colors duration-fast',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'whitespace-nowrap',
  ],
  {
    variants: {
      variant: {
        // Default - balanced primary action (alias for primary)
        default: [
          'bg-primary text-primary-foreground',
          'hover:bg-primary-hover active:bg-primary-active',
          'shadow',
        ],
        // Primary - main brand actions
        primary: [
          'bg-primary text-primary-foreground',
          'hover:bg-primary-hover active:bg-primary-active',
          'shadow',
        ],
        // Secondary - alternative actions
        secondary: [
          'bg-secondary text-secondary-foreground',
          'hover:bg-secondary-hover active:bg-secondary-active',
          'shadow-sm',
        ],
        // Destructive - dangerous actions
        destructive: [
          'bg-destructive text-destructive-foreground',
          'hover:bg-destructive/90 active:bg-destructive',
          'shadow-sm',
        ],
        // Outline - bordered buttons
        outline: [
          'border border-border bg-background text-foreground',
          'hover:bg-hover hover:border-border-hover',
          'active:bg-active',
        ],
        // Ghost - minimal styling
        ghost: ['bg-transparent text-foreground', 'hover:bg-hover active:bg-active'],
        // Link - text-only buttons
        link: [
          'bg-transparent text-primary underline-offset-4',
          'hover:underline active:text-primary-active',
          'px-0 shadow-none',
        ],
      },
      size: {
        // Small - compact buttons
        sm: 'px-3 py-1.5 text-sm h-8',
        // Default - standard buttons
        default: 'px-4 py-2 text-sm h-10',
        // Large - prominent buttons
        lg: 'px-6 py-3 text-base h-12',
        // Icon - square buttons for icons
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
