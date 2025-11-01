import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Divider component using GalaxyCo.ai Design System tokens
 * Horizontal or vertical divider with optional centered text
 *
 * @example
 * <Divider />
 * <Divider text="OR" />
 * <Divider text="Continued" textPosition="left" />
 * <Divider orientation="vertical" className="h-20" />
 */
const dividerVariants = cva('', {
  variants: {
    orientation: {
      horizontal: 'w-full',
      vertical: 'h-full',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

export interface DividerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'orientation'>,
    VariantProps<typeof dividerVariants> {
  /**
   * Optional text to display in the divider
   */
  text?: string;

  /**
   * Text position (only for horizontal orientation)
   * @default "center"
   */
  textPosition?: 'left' | 'center' | 'right';
}

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ className, orientation = 'horizontal', text, textPosition = 'center', ...props }, ref) => {
    // Vertical divider (no text support)
    if (orientation === 'vertical') {
      return (
        <div
          ref={ref}
          role="separator"
          aria-orientation="vertical"
          className={cn('w-px bg-border', dividerVariants({ orientation }), className)}
          {...props}
        />
      );
    }

    // Horizontal divider without text
    if (!text) {
      return (
        <div
          ref={ref}
          role="separator"
          aria-orientation="horizontal"
          className={cn('h-px bg-border', dividerVariants({ orientation }), className)}
          {...props}
        />
      );
    }

    // Horizontal divider with text
    const textAlignClasses = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
    };

    return (
      <div
        ref={ref}
        role="separator"
        aria-label={text}
        className={cn('flex items-center gap-4', dividerVariants({ orientation }), className)}
        {...props}
      >
        {(textPosition === 'center' || textPosition === 'right') && (
          <div className="flex-1 h-px bg-border" />
        )}
        <span className="text-xs font-medium text-muted-foreground px-2">{text}</span>
        {(textPosition === 'center' || textPosition === 'left') && (
          <div className="flex-1 h-px bg-border" />
        )}
      </div>
    );
  },
);

Divider.displayName = 'Divider';

export { Divider, dividerVariants };
