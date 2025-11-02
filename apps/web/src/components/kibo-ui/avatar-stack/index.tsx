/**
 * Kibo UI - Avatar Stack Component
 * Overlapping avatars for user groups
 */

'use client';

import { cn } from '@/lib/utils';
import { type HTMLAttributes } from 'react';

export interface AvatarStackProps extends HTMLAttributes<HTMLDivElement> {
  avatars: Array<{
    src?: string;
    alt?: string;
    fallback?: string;
  }>;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-12 text-base',
};

export function AvatarStack({
  avatars,
  max = 5,
  size = 'md',
  className,
  ...props
}: AvatarStackProps) {
  const displayAvatars = avatars.slice(0, max);
  const remaining = Math.max(0, avatars.length - max);

  return (
    <div className={cn('flex -space-x-2', className)} {...props}>
      {displayAvatars.map((avatar, index) => (
        <div
          key={index}
          className={cn(
            'relative inline-flex items-center justify-center rounded-full border-2 border-background bg-muted font-semibold ring-2 ring-background',
            sizeStyles[size],
          )}
          style={{ zIndex: displayAvatars.length - index }}
        >
          {avatar.src ? (
            <img
              src={avatar.src}
              alt={avatar.alt || ''}
              className="size-full rounded-full object-cover"
            />
          ) : (
            <span className="text-muted-foreground">{avatar.fallback || '?'}</span>
          )}
        </div>
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            'relative inline-flex items-center justify-center rounded-full border-2 border-background bg-primary font-semibold text-primary-foreground ring-2 ring-background',
            sizeStyles[size],
          )}
          style={{ zIndex: 0 }}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
