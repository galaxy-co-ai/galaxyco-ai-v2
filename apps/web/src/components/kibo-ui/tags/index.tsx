/**
 * Kibo UI - Tags Component
 * Tag input with add/remove functionality
 */

'use client';

import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { type KeyboardEvent, useState } from 'react';
import { Badge } from '../badge';

export interface TagsProps {
  value?: string[];
  onChange?: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  allowDuplicates?: boolean;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary';
}

export function Tags({
  value = [],
  onChange,
  placeholder = 'Add tag...',
  maxTags,
  allowDuplicates = false,
  className,
  variant = 'default',
}: TagsProps) {
  const [input, setInput] = useState('');

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (!trimmedTag) return;

    if (maxTags && value.length >= maxTags) return;
    if (!allowDuplicates && value.includes(trimmedTag)) return;

    onChange?.([...value, trimmedTag]);
    setInput('');
  };

  const removeTag = (index: number) => {
    onChange?.(value.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  return (
    <div
      className={cn(
        'flex min-h-10 w-full flex-wrap gap-2 rounded-lg border border-border bg-background p-2 focus-within:ring-2 focus-within:ring-ring',
        className,
      )}
    >
      {value.map((tag, index) => (
        <Badge key={`${tag}-${index}`} variant={variant} className="gap-1 pr-1">
          {tag}
          <button
            type="button"
            onClick={() => removeTag(index)}
            className="rounded-full p-0.5 hover:bg-background/20"
          >
            <X className="size-3" />
          </button>
        </Badge>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={value.length === 0 ? placeholder : ''}
        disabled={maxTags !== undefined && value.length >= maxTags}
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed min-w-[120px]"
      />
    </div>
  );
}
