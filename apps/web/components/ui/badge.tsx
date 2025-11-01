import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Badge component using GalaxyCo.ai Design System tokens
 * Implements badge patterns from 05-COMPONENT-INVENTORY.md
 */
const badgeVariants = cva(
  [
    'inline-flex items-center rounded-full border font-medium transition-colors duration-fast',
    'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
  ],
  {
    variants: {
      variant: {
        // Default - neutral styling
        default: ['bg-background-subtle text-foreground border-border'],
        // Primary - brand color
        primary: ['bg-primary/10 text-primary border-primary/20'],
        // Secondary - alternative styling
        secondary: ['bg-secondary/10 text-secondary border-secondary/20'],
        // Success - positive states
        success: ['bg-success/10 text-success border-success/20'],
        // Warning - attention needed
        warning: ['bg-warning/10 text-warning border-warning/20'],
        // Destructive - negative states
        destructive: ['bg-destructive/10 text-destructive border-destructive/20'],
        // Outline - bordered only
        outline: ['bg-transparent text-foreground border-border', 'hover:bg-background-subtle'],
        // Solid variants for high emphasis
        'primary-solid': ['bg-primary text-primary-foreground border-primary', 'shadow-sm'],
        'success-solid': ['bg-success text-success-foreground border-success', 'shadow-sm'],
        'warning-solid': ['bg-warning text-warning-foreground border-warning', 'shadow-sm'],
        'destructive-solid': [
          'bg-destructive text-destructive-foreground border-destructive',
          'shadow-sm',
        ],
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        default: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /** Optional icon to display before the text */
  icon?: React.ReactNode;
  /** Whether the badge is removable (shows close button) */
  removable?: boolean;
  /** Callback when remove button is clicked */
  onRemove?: () => void;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, icon, removable, onRemove, children, ...props }, ref) => {
    return (
      <div className={cn(badgeVariants({ variant, size }), className)} ref={ref} {...props}>
        {icon && <span className="mr-1 h-3 w-3">{icon}</span>}
        {children}
        {removable && (
          <button
            type="button"
            className="ml-1 h-3 w-3 rounded-full hover:bg-current/20 focus:outline-none focus:ring-1 focus:ring-current"
            onClick={onRemove}
            aria-label="Remove"
          >
            <svg
              className="h-3 w-3"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 3L3 9M3 3l6 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
    );
  },
);
Badge.displayName = 'Badge';

export { Badge, badgeVariants };
