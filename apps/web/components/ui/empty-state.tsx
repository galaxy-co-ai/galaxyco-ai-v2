'use client';

import * as React from 'react';
import { ReactNode } from 'react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: string | ReactNode;
  iconType?: 'emoji' | 'svg' | 'component';
  title: string;
  description: string;
  helpText?: string;
  steps?: string[];
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

/**
 * Enhanced EmptyState Component
 *
 * Professional empty state design with:
 * - Support for emoji, SVG, or custom component icons
 * - Optional helpful steps
 * - Prominent CTA styling
 * - Better visual hierarchy
 */

export function EmptyState({
  icon,
  iconType = 'emoji',
  title,
  description,
  helpText,
  steps,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'text-center p-spacing-xl bg-background-subtle rounded-lg border border-dashed border-border max-w-2xl mx-auto',
        className,
      )}
    >
      {icon && (
        <div
          className={cn(
            'mb-6 flex justify-center items-center',
            iconType === 'emoji' ? 'text-6xl opacity-70' : 'text-5xl',
          )}
        >
          {typeof icon === 'string' ? icon : icon}
        </div>
      )}

      <h3 className="text-heading-lg font-heading text-foreground mb-spacing-sm">{title}</h3>

      <p
        className={cn(
          'text-body-md text-foreground-muted max-w-lg mx-auto leading-relaxed',
          helpText || steps ? 'mb-spacing-md' : 'mb-spacing-lg',
        )}
      >
        {description}
      </p>

      {/* Optional help text */}
      {helpText && (
        <p className="text-caption text-foreground-muted max-w-lg mx-auto mb-spacing-lg italic">
          {helpText}
        </p>
      )}

      {/* Optional helpful steps */}
      {steps && steps.length > 0 && (
        <div className="bg-background border border-border rounded-lg p-spacing-md max-w-lg mx-auto mb-spacing-lg">
          <div className="text-caption font-semibold text-foreground mb-spacing-sm text-left">
            Get started:
          </div>
          <ul className="list-none p-0 m-0 text-left flex flex-col gap-spacing-sm">
            {steps.map((step, index) => (
              <li
                key={index}
                className="text-body-sm text-foreground-muted flex items-start gap-spacing-sm"
              >
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-caption font-semibold flex-shrink-0">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {action && (
        <div className="flex gap-spacing-md justify-center flex-wrap">
          <Button variant={action.variant || 'default'} size="lg" onClick={action.onClick}>
            {action.label}
          </Button>
          {secondaryAction && (
            <Button variant="secondary" size="lg" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
