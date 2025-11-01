import * as React from 'react';
import NextLink from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Link component using GalaxyCo.ai Design System tokens
 * Handles both internal (Next.js Link) and external (anchor) links with consistent styling
 *
 * @example
 * <Link href="/dashboard">Dashboard</Link>
 * <Link href="https://example.com" external>External Link</Link>
 * <Link href="/help" variant="muted" size="sm">Help</Link>
 */
const linkVariants = cva(
  [
    'inline-flex items-center gap-1.5',
    'transition-colors duration-fast',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        // Primary brand link
        primary: [
          'text-primary',
          'hover:text-primary-hover',
          'underline-offset-4 decoration-primary/30',
        ],
        // Muted/secondary link
        muted: [
          'text-foreground-muted',
          'hover:text-foreground',
          'underline-offset-4 decoration-foreground-muted/30',
        ],
        // Default with underline
        underline: ['text-foreground', 'underline', 'hover:text-primary', 'underline-offset-4'],
        // No underline (nav links)
        'no-underline': ['text-foreground', 'hover:text-primary', 'no-underline'],
      },
      size: {
        sm: 'text-sm',
        base: 'text-base',
        lg: 'text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'base',
    },
  },
);

export interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'size'>,
    VariantProps<typeof linkVariants> {
  /**
   * The URL to link to
   */
  href: string;

  /**
   * Whether this is an external link (opens in new tab)
   * @default false
   */
  external?: boolean;

  /**
   * Disabled state (no interaction)
   * @default false
   */
  disabled?: boolean;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    { className, variant, size, href, external = false, disabled = false, children, ...props },
    ref,
  ) => {
    const linkClasses = cn(linkVariants({ variant, size }), className);

    // External links use standard <a> tag
    if (external || href.startsWith('http') || href.startsWith('mailto:')) {
      return (
        <a
          ref={ref}
          href={disabled ? undefined : href}
          className={linkClasses}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={disabled}
          {...props}
        >
          {children}
        </a>
      );
    }

    // Internal links use Next.js Link
    if (disabled) {
      return (
        <span
          className={linkClasses}
          aria-disabled="true"
          {...(props as React.HTMLAttributes<HTMLSpanElement>)}
        >
          {children}
        </span>
      );
    }

    return (
      <NextLink href={href} ref={ref} className={linkClasses} {...props}>
        {children}
      </NextLink>
    );
  },
);

Link.displayName = 'Link';

export { Link, linkVariants };
