import * as React from 'react';
import NextLink from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Logo component using GalaxyCo.ai Design System tokens
 * SVG logo with variants for different contexts
 *
 * @example
 * <Logo variant="full" size="md" />
 * <Logo variant="icon-only" size="sm" href="/" />
 * <Logo variant="wordmark" size="lg" />
 */
const logoVariants = cva('inline-flex items-center', {
  variants: {
    size: {
      sm: 'h-6', // 24px
      default: 'h-8', // 32px (md)
      lg: 'h-10', // 40px
      xl: 'h-12', // 48px
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export interface LogoProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'size'>,
    VariantProps<typeof logoVariants> {
  /**
   * Logo variant to display
   * @default "full"
   */
  variant?: 'full' | 'icon-only' | 'wordmark';

  /**
   * Optional link href (wraps logo in Next Link)
   */
  href?: string;
}

const Logo = React.forwardRef<HTMLElement, LogoProps>(
  ({ className, variant = 'full', size, href, ...props }, ref) => {
    const logoClasses = cn(logoVariants({ size }), className);

    // SVG paths for logo (placeholder - replace with actual logo)
    const renderLogo = () => {
      switch (variant) {
        case 'icon-only':
          return (
            <svg
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={logoClasses}
            >
              <circle cx="16" cy="16" r="14" fill="currentColor" className="text-primary" />
              <path
                d="M16 8L20 16L16 24L12 16L16 8Z"
                fill="currentColor"
                className="text-primary-foreground"
              />
            </svg>
          );

        case 'wordmark':
          return (
            <svg
              viewBox="0 0 120 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={logoClasses}
            >
              <text
                x="0"
                y="24"
                fill="currentColor"
                className="text-foreground font-bold text-2xl"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                GalaxyCo
              </text>
            </svg>
          );

        case 'full':
        default:
          return (
            <svg
              viewBox="0 0 160 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={logoClasses}
            >
              <circle cx="16" cy="16" r="14" fill="currentColor" className="text-primary" />
              <path
                d="M16 8L20 16L16 24L12 16L16 8Z"
                fill="currentColor"
                className="text-primary-foreground"
              />
              <text
                x="40"
                y="24"
                fill="currentColor"
                className="text-foreground font-bold text-2xl"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                GalaxyCo
              </text>
            </svg>
          );
      }
    };

    // Wrap in link if href provided
    if (href) {
      return (
        <NextLink
          href={href}
          ref={ref as any}
          className={cn('transition-opacity hover:opacity-80', className)}
        >
          {renderLogo()}
        </NextLink>
      );
    }

    return (
      <span ref={ref as any} className={className}>
        {renderLogo()}
      </span>
    );
  },
);

Logo.displayName = 'Logo';

export { Logo, logoVariants };
