/**
 * Kibo UI - Relative Time Component
 * Display time relative to now (e.g., "2 hours ago")
 */

'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState, type HTMLAttributes } from 'react';

export interface RelativeTimeProps extends HTMLAttributes<HTMLTimeElement> {
  date: Date | string | number;
  updateInterval?: number;
}

export function RelativeTime({
  date,
  updateInterval = 60000,
  className,
  ...props
}: RelativeTimeProps) {
  const [relativeTime, setRelativeTime] = useState('');

  useEffect(() => {
    const calculateRelativeTime = () => {
      const now = new Date();
      const then = new Date(date);
      const diff = now.getTime() - then.getTime();

      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const months = Math.floor(days / 30);
      const years = Math.floor(days / 365);

      if (seconds < 60) return 'just now';
      if (minutes < 60) return `${minutes}m ago`;
      if (hours < 24) return `${hours}h ago`;
      if (days < 30) return `${days}d ago`;
      if (months < 12) return `${months}mo ago`;
      return `${years}y ago`;
    };

    setRelativeTime(calculateRelativeTime());

    const interval = setInterval(() => {
      setRelativeTime(calculateRelativeTime());
    }, updateInterval);

    return () => clearInterval(interval);
  }, [date, updateInterval]);

  return (
    <time
      dateTime={new Date(date).toISOString()}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    >
      {relativeTime}
    </time>
  );
}
