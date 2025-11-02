/**
 * Kibo UI - Announcement Component
 * Hero announcement banner with tag and title
 */

import { cn } from '@/lib/utils';
import { type HTMLAttributes, type ReactNode } from 'react';

export interface AnnouncementProps extends HTMLAttributes<HTMLElement> {
  href?: string;
}

export function Announcement({ href, className, children, ...props }: AnnouncementProps) {
  if (href) {
    return (
      <a
        href={href}
        className={cn(
          'group inline-flex items-center gap-2 rounded-full border bg-muted px-3 py-1 text-sm transition-colors hover:bg-muted/80 cursor-pointer',
          className,
        )}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

  return (
    <div
      className={cn(
        'group inline-flex items-center gap-2 rounded-full border bg-muted px-3 py-1 text-sm transition-colors hover:bg-muted/80',
        className,
      )}
      {...(props as React.HTMLAttributes<HTMLDivElement>)}
    >
      {children}
    </div>
  );
}

export interface AnnouncementTagProps extends HTMLAttributes<HTMLSpanElement> {}

export function AnnouncementTag({ className, children, ...props }: AnnouncementTagProps) {
  return (
    <span
      className={cn(
        'rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export interface AnnouncementTitleProps extends HTMLAttributes<HTMLSpanElement> {
  icon?: ReactNode;
}

export function AnnouncementTitle({ icon, className, children, ...props }: AnnouncementTitleProps) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 font-medium', className)} {...props}>
      {children}
      {icon}
    </span>
  );
}
