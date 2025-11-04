import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Card component using GalaxyCo.ai Design System tokens
 * Implements card patterns from 02-WIREFRAMES-DASHBOARDS.md
 */
const cardVariants = cva(['rounded-xl border transition-all duration-200'], {
  variants: {
    variant: {
      // Default - elevated card (Framer-style)
      default: ['bg-background-elevated border-border shadow-sm'],
      // Interactive - Framer-style hover effects for clickable cards
      interactive: [
        'bg-background-elevated border-border shadow-sm',
        'hover:border-foreground/20 hover:shadow-md hover:scale-[1.01] cursor-pointer',
      ],
      // Outline - minimal styling
      outline: ['bg-background border-border hover:border-foreground/20'],
      // Ghost - no border or background
      ghost: ['bg-transparent border-transparent'],
    },
    padding: {
      none: 'p-0',
      sm: 'p-4',
      default: 'p-6',
      lg: 'p-8',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'default',
  },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /** Whether the card is clickable/interactive */
  interactive?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, interactive, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        cardVariants({
          variant: interactive ? 'interactive' : variant,
          padding,
          className,
        }),
      )}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  ),
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-xl font-bold text-foreground leading-none tracking-tight', className)}
      {...props}
    />
  ),
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-foreground-muted', className)} {...props} />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  ),
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
  ),
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants };
