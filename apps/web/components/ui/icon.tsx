import * as React from 'react';
import { LucideIcon } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Icon component using GalaxyCo.ai Design System tokens
 * Wrapper for lucide-react icons with consistent sizing
 *
 * @example
 * import { Star } from "lucide-react";
 * <Icon icon={Star} size="lg" />
 * <Icon icon={<Star />} size="sm" className="text-primary" />
 */
const iconVariants = cva('flex-shrink-0', {
  variants: {
    size: {
      xs: 'h-3 w-3', // 12px
      sm: 'h-4 w-4', // 16px
      default: 'h-5 w-5', // 20px (md)
      lg: 'h-6 w-6', // 24px
      xl: 'h-8 w-8', // 32px
      '2xl': 'h-12 w-12', // 48px
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export interface IconProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'size'>,
    VariantProps<typeof iconVariants> {
  /**
   * Lucide icon component or ReactNode
   * Can be passed as component or element
   */
  icon: LucideIcon | React.ReactNode;

  /**
   * Stroke width for lucide icons
   * @default 2
   */
  strokeWidth?: number;
}

const Icon = React.forwardRef<HTMLElement, IconProps>(
  ({ className, icon, size, strokeWidth = 2, ...props }, ref) => {
    const iconClasses = cn(iconVariants({ size }), className);

    // If icon is a Lucide component (function), render it
    if (typeof icon === 'function') {
      const LucideComponent = icon as LucideIcon;
      return (
        <LucideComponent
          ref={ref as any}
          className={iconClasses}
          strokeWidth={strokeWidth}
          {...(props as any)}
        />
      );
    }

    // If icon is already a React element, wrap it
    return (
      <span ref={ref as any} className={iconClasses} {...props}>
        {icon}
      </span>
    );
  },
);

Icon.displayName = 'Icon';

export { Icon, iconVariants };
