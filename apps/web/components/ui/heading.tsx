import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Heading component using GalaxyCo.ai Design System tokens
 * Implements semantic HTML headings (h1-h6) with customizable sizing
 *
 * @example
 * <Heading level={1} size="3xl">Page Title</Heading>
 * <Heading level={2} size="2xl" className="mb-4">Section Title</Heading>
 */
const headingVariants = cva('font-semibold text-foreground', {
  variants: {
    size: {
      xs: 'text-xs leading-4', // 12px - Tiny headings
      sm: 'text-sm leading-5', // 14px - Small headings
      base: 'text-base leading-6', // 16px - Base size
      lg: 'text-lg leading-7', // 18px - Large headings
      xl: 'text-xl leading-7', // 20px - Extra large
      '2xl': 'text-2xl leading-8', // 24px - Section titles
      '3xl': 'text-3xl leading-9', // 30px - Page titles
      '4xl': 'text-4xl leading-10', // 36px - Hero headlines
      '5xl': 'text-5xl leading-[1]', // 48px - Display (rare)
    },
    weight: {
      normal: 'font-normal', // 400
      medium: 'font-medium', // 500
      semibold: 'font-semibold', // 600
      bold: 'font-bold', // 700
    },
  },
  defaultVariants: {
    size: '2xl',
    weight: 'semibold',
  },
});

export interface HeadingProps
  extends Omit<React.HTMLAttributes<HTMLHeadingElement>, 'size'>,
    VariantProps<typeof headingVariants> {
  /**
   * The semantic heading level (1-6)
   * Determines which HTML element is rendered (h1, h2, etc.)
   * @default 2
   */
  level?: 1 | 2 | 3 | 4 | 5 | 6;

  /**
   * Override the rendered element while maintaining semantic level
   * Useful for when you need visual h1 but semantic h2
   * @example
   * <Heading level={2} as="h1" size="3xl">Visually h1, semantically h2</Heading>
   */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level = 2, as, size, weight, children, ...props }, ref) => {
    // Use 'as' prop if provided, otherwise use 'level' for semantic HTML
    const Component = (as || `h${level}`) as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

    return React.createElement(
      Component,
      {
        ref,
        className: cn(headingVariants({ size, weight }), className),
        ...props,
      },
      children,
    );
  },
);

Heading.displayName = 'Heading';

export { Heading, headingVariants };
