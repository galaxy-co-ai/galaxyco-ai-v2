import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Label component using GalaxyCo.ai Design System tokens
 * Implements typography patterns from 01-DESIGN-TOKENS.md
 */
const labelVariants = cva(
  ['text-sm font-medium leading-none', 'peer-disabled:cursor-not-allowed peer-disabled:opacity-70'],
  {
    variants: {
      variant: {
        default: 'text-foreground',
        muted: 'text-foreground-muted',
        subtle: 'text-foreground-subtle',
      },
      size: {
        sm: 'text-xs',
        default: 'text-sm',
        lg: 'text-base',
      },
      required: {
        true: "after:content-['*'] after:ml-0.5 after:text-destructive",
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      required: false,
    },
  },
);

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {
  /** Whether this field is required (shows asterisk) */
  required?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, variant, size, required, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(labelVariants({ variant, size, required, className }))}
      {...props}
    />
  ),
);
Label.displayName = 'Label';

export { Label, labelVariants };
