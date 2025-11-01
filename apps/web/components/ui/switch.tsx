import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Switch component using GalaxyCo.ai Design System tokens
 * Built on Radix UI Switch primitive with smooth toggle animation
 *
 * @example
 * <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
 * <Switch size="sm">Enable notifications</Switch>
 * <Switch size="lg" disabled>Admin mode</Switch>
 */
const switchVariants = cva(
  [
    'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent',
    'transition-colors duration-fast',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'data-[state=checked]:bg-primary',
    'data-[state=unchecked]:bg-input',
  ],
  {
    variants: {
      size: {
        sm: 'h-5 w-9', // 20px height, 36px width
        default: 'h-6 w-11', // 24px height, 44px width (md)
        lg: 'h-7 w-[3.25rem]', // 28px height, 52px width
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

const switchThumbVariants = cva(
  [
    'pointer-events-none block rounded-full bg-background shadow-lg ring-0',
    'transition-transform duration-fast',
  ],
  {
    variants: {
      size: {
        sm: 'h-4 w-4 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0',
        default: 'h-5 w-5 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
        lg: 'h-6 w-6 data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

export interface SwitchProps
  extends Omit<React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>, 'size'>,
    VariantProps<typeof switchVariants> {}

const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitives.Root>, SwitchProps>(
  ({ className, size, ...props }, ref) => (
    <SwitchPrimitives.Root className={cn(switchVariants({ size }), className)} {...props} ref={ref}>
      <SwitchPrimitives.Thumb className={cn(switchThumbVariants({ size }))} />
    </SwitchPrimitives.Root>
  ),
);

Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch, switchVariants };
