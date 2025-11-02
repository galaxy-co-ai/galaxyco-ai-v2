/**
 * Kibo UI - Ticker Component
 * Animated number/stat ticker with smooth transitions
 */

'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { type HTMLAttributes } from 'react';

export interface TickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  value: number;
  duration?: number;
  format?: (value: number) => string;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

export function Ticker({
  value,
  duration = 1000,
  format,
  suffix,
  prefix,
  decimals = 0,
  className,
  ...props
}: TickerProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(easeOut * value);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration]);

  const formattedValue = format
    ? format(displayValue)
    : displayValue.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return (
    <div
      className={cn('inline-flex items-baseline gap-1 font-mono tabular-nums', className)}
      {...props}
    >
      {prefix && <span className="text-muted-foreground">{prefix}</span>}
      <span className="font-bold">{formattedValue}</span>
      {suffix && <span className="text-muted-foreground">{suffix}</span>}
    </div>
  );
}
