'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  maxItems?: number;
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = <ChevronRight className="h-4 w-4" />,
  maxItems,
  className,
}) => {
  // Collapse breadcrumbs if maxItems is set and exceeded
  const displayItems = React.useMemo(() => {
    if (!maxItems || items.length <= maxItems) {
      return items;
    }

    // Show first item, ellipsis, and last (maxItems - 1) items
    const firstItem = items[0];
    const lastItems = items.slice(-(maxItems - 1));

    return [firstItem, { label: '...', href: undefined, icon: undefined }, ...lastItems];
  }, [items, maxItems]);

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center space-x-1 text-sm', className)}>
      <ol className="flex items-center space-x-1">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isEllipsis = item.label === '...';

          return (
            <li key={`${item.label}-${index}`} className="flex items-center">
              {/* Separator */}
              {index > 0 && (
                <span className="mx-2 text-muted-foreground" aria-hidden="true">
                  {separator}
                </span>
              )}

              {/* Breadcrumb item */}
              {isEllipsis ? (
                <span className="text-muted-foreground">...</span>
              ) : isLast ? (
                <span className="font-medium text-foreground" aria-current="page">
                  {item.icon && <span className="mr-1.5 inline-block">{item.icon}</span>}
                  {item.label}
                </span>
              ) : item.href ? (
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center text-muted-foreground hover:text-foreground',
                    'transition-colors duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm',
                  )}
                >
                  {item.icon && <span className="mr-1.5 inline-block">{item.icon}</span>}
                  {item.label}
                </Link>
              ) : (
                <span className="text-muted-foreground">
                  {item.icon && <span className="mr-1.5 inline-block">{item.icon}</span>}
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

Breadcrumb.displayName = 'Breadcrumb';
