/**
 * Kibo UI - Rating Component
 * Star rating display and input
 */

'use client';

import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';
import { useState, type HTMLAttributes } from 'react';

export interface RatingProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: number;
  onChange?: (value: number) => void;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
}

const sizeStyles = {
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-6',
};

export function Rating({
  value = 0,
  onChange,
  max = 5,
  size = 'md',
  readOnly = false,
  className,
  ...props
}: RatingProps) {
  const [hoverValue, setHoverValue] = useState(0);

  const handleClick = (rating: number) => {
    if (!readOnly && onChange) {
      onChange(rating);
    }
  };

  const displayValue = hoverValue || value;

  return (
    <div className={cn('inline-flex items-center gap-1', className)} {...props}>
      {Array.from({ length: max }, (_, i) => i + 1).map((rating) => (
        <button
          key={rating}
          type="button"
          onClick={() => handleClick(rating)}
          onMouseEnter={() => !readOnly && setHoverValue(rating)}
          onMouseLeave={() => !readOnly && setHoverValue(0)}
          disabled={readOnly}
          className={cn(
            'transition-colors',
            !readOnly && 'cursor-pointer hover:scale-110',
            readOnly && 'cursor-default',
          )}
        >
          <Star
            className={cn(
              sizeStyles[size],
              rating <= displayValue
                ? 'fill-amber-400 text-amber-400'
                : 'fill-none text-muted-foreground',
            )}
          />
        </button>
      ))}
    </div>
  );
}
