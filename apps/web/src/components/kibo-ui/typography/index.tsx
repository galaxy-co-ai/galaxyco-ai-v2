/**
 * Kibo UI - Typography Component
 * Semantic typography with consistent styling
 */

import { cn } from '@/lib/utils';
import { type HTMLAttributes } from 'react';

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export function Heading({ level = 1, as, className, children, ...props }: HeadingProps) {
  const Component = as || (`h${level}` as 'h1');

  const styles = {
    1: 'text-4xl font-bold tracking-tight lg:text-5xl',
    2: 'text-3xl font-semibold tracking-tight',
    3: 'text-2xl font-semibold tracking-tight',
    4: 'text-xl font-semibold tracking-tight',
    5: 'text-lg font-semibold',
    6: 'text-base font-semibold',
  };

  return (
    <Component className={cn(styles[level], className)} {...props}>
      {children}
    </Component>
  );
}

export interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  variant?: 'default' | 'muted' | 'small' | 'large' | 'lead';
  as?: 'p' | 'span' | 'div';
}

export function Text({
  variant = 'default',
  as: Component = 'p',
  className,
  children,
  ...props
}: TextProps) {
  const styles = {
    default: 'text-base',
    muted: 'text-base text-muted-foreground',
    small: 'text-sm text-muted-foreground',
    large: 'text-lg',
    lead: 'text-xl text-muted-foreground',
  };

  return (
    <Component className={cn(styles[variant], className)} {...props}>
      {children}
    </Component>
  );
}

export interface CodeProps extends HTMLAttributes<HTMLElement> {
  inline?: boolean;
}

export function Code({ inline = true, className, children, ...props }: CodeProps) {
  if (inline) {
    return (
      <code
        className={cn(
          'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
          className,
        )}
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <pre className={cn('rounded-lg bg-muted p-4 overflow-x-auto', className)}>
      <code className="font-mono text-sm" {...props}>
        {children}
      </code>
    </pre>
  );
}
