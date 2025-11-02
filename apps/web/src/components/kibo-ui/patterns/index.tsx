/**
 * Kibo UI - Patterns Component (Temporary - Replace with official when available)
 * Background pattern utilities
 */

import { cn } from '@/lib/utils';
import { type HTMLAttributes } from 'react';

export type PatternType = 'dots' | 'grid' | 'lines' | 'cross' | 'zigzag';

export interface PatternProps extends HTMLAttributes<HTMLDivElement> {
  pattern: PatternType;
  opacity?: number;
}

export function Pattern({ pattern, opacity = 0.5, className, ...props }: PatternProps) {
  const patterns = {
    dots: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
    grid: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
    lines: `repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)`,
    cross: `linear-gradient(currentColor 2px, transparent 2px), linear-gradient(90deg, currentColor 2px, transparent 2px)`,
    zigzag: `linear-gradient(135deg, currentColor 25%, transparent 25%), linear-gradient(225deg, currentColor 25%, transparent 25%)`,
  };

  const sizes = {
    dots: '20px 20px',
    grid: '20px 20px',
    lines: '10px 10px',
    cross: '20px 20px',
    zigzag: '20px 20px',
  };

  return (
    <div
      className={cn('pointer-events-none absolute inset-0 text-muted-foreground', className)}
      style={{
        backgroundImage: patterns[pattern],
        backgroundSize: sizes[pattern],
        opacity,
      }}
      {...props}
    />
  );
}

export function DotPattern(props: Omit<PatternProps, 'pattern'>) {
  return <Pattern pattern="dots" {...props} />;
}

export function GridPattern(props: Omit<PatternProps, 'pattern'>) {
  return <Pattern pattern="grid" {...props} />;
}

export function LinePattern(props: Omit<PatternProps, 'pattern'>) {
  return <Pattern pattern="lines" {...props} />;
}

export function CrossPattern(props: Omit<PatternProps, 'pattern'>) {
  return <Pattern pattern="cross" {...props} />;
}

export function ZigzagPattern(props: Omit<PatternProps, 'pattern'>) {
  return <Pattern pattern="zigzag" {...props} />;
}
