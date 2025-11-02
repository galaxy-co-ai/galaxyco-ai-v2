/**
 * Kibo UI - Marquee Component
 * Auto-scrolling text or content
 */

'use client';

import { cn } from '@/lib/utils';
import { type HTMLAttributes, type ReactNode } from 'react';

export interface MarqueeProps extends HTMLAttributes<HTMLDivElement> {
  speed?: number;
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  repeat?: number;
}

export function Marquee({
  speed = 50,
  direction = 'left',
  pauseOnHover = true,
  repeat = 2,
  className,
  children,
  ...props
}: MarqueeProps) {
  return (
    <div className={cn('relative overflow-hidden', className)} {...props}>
      <div
        className={cn('flex w-fit gap-4', pauseOnHover && 'hover:[animation-play-state:paused]')}
        style={{
          animation: `marquee ${speed}s linear infinite`,
          animationDirection: direction === 'right' ? 'reverse' : 'normal',
        }}
      >
        {Array.from({ length: repeat }).map((_, i) => (
          <div key={i} className="flex shrink-0 gap-4">
            {children}
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
}
