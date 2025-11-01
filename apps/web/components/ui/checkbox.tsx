import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, Minus } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Checkbox component using GalaxyCo.ai Design System tokens
 * Built on Radix UI Checkbox primitive with full accessibility
 *
 * @example
 * <Checkbox checked={isChecked} onCheckedChange={setIsChecked} />
 * <Checkbox size="lg" variant="destructive">Accept terms</Checkbox>
 * <Checkbox indeterminate>Select all</Checkbox>
 */
const checkboxVariants = cva(
  [
    'peer shrink-0 rounded-sm border transition-colors duration-fast',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary',
    'data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground data-[state=indeterminate]:border-primary',
  ],
  {
    variants: {
      variant: {
        default: 'border-border hover:border-border-hover',
        destructive:
          'border-destructive data-[state=checked]:bg-destructive data-[state=checked]:border-destructive',
      },
      size: {
        sm: 'h-4 w-4', // 16px
        default: 'h-5 w-5', // 20px (md)
        lg: 'h-6 w-6', // 24px
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface CheckboxProps
  extends Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, 'size'>,
    VariantProps<typeof checkboxVariants> {
  /**
   * Indeterminate state (for "select all" checkboxes)
   * @default false
   */
  indeterminate?: boolean;
}

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ className, variant, size, indeterminate, ...props }, ref) => {
    return (
      <CheckboxPrimitive.Root
        ref={ref}
        className={cn(checkboxVariants({ variant, size }), className)}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          className={cn('flex items-center justify-center text-current')}
        >
          {indeterminate ? (
            <Minus className="h-3 w-3" strokeWidth={3} />
          ) : (
            <Check className="h-3 w-3" strokeWidth={3} />
          )}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );
  },
);

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox, checkboxVariants };
