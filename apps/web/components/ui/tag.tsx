import * as React from 'react';
import { X } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Tag component using GalaxyCo.ai Design System tokens
 * Interactive badge with removable functionality
 *
 * @example
 * <Tag>Design</Tag>
 * <Tag variant="primary" removable onRemove={() => console.log('removed')}>Tag</Tag>
 * <Tag size="lg" icon={<Star />}>Featured</Tag>
 */
const tagVariants = cva(
  [
    'inline-flex items-center gap-1.5 rounded-full border font-medium transition-colors duration-fast',
    'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
  ],
  {
    variants: {
      variant: {
        // Default - neutral styling
        default: 'bg-background-subtle text-foreground border-border',
        // Primary - brand color
        primary: 'bg-primary/10 text-primary border-primary/20',
        // Success - positive states
        success: 'bg-success/10 text-success border-success/20',
        // Warning - attention needed
        warning: 'bg-warning/10 text-warning border-warning/20',
        // Destructive - negative states
        destructive: 'bg-destructive/10 text-destructive border-destructive/20',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        default: 'px-2.5 py-1 text-xs', // md
        lg: 'px-3 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface TagProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'size'>,
    VariantProps<typeof tagVariants> {
  /**
   * Optional icon to display before the text
   * Icon should be sized appropriately (16px recommended)
   */
  icon?: React.ReactNode;

  /**
   * Whether the tag is removable (shows close button)
   * @default false
   */
  removable?: boolean;

  /**
   * Callback when remove button is clicked
   */
  onRemove?: () => void;
}

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ className, variant, size, icon, removable = false, onRemove, children, ...props }, ref) => {
    return (
      <span ref={ref} className={cn(tagVariants({ variant, size }), className)} {...props}>
        {icon && <span className="flex-shrink-0 h-3.5 w-3.5">{icon}</span>}
        {children}
        {removable && (
          <button
            type="button"
            className={cn(
              'ml-0.5 -mr-1 flex-shrink-0 rounded-full p-0.5',
              'hover:bg-current/20 active:bg-current/30',
              'transition-colors duration-fast',
              'focus:outline-none focus:ring-1 focus:ring-current',
            )}
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
            aria-label="Remove tag"
          >
            <X className="h-3 w-3" strokeWidth={2.5} />
          </button>
        )}
      </span>
    );
  },
);

Tag.displayName = 'Tag';

export { Tag, tagVariants };
