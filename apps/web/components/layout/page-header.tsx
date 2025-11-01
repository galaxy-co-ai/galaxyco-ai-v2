/**
 * GalaxyCo.ai Page Header
 * Reusable page title and actions component
 * October 15, 2025
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <div className={cn('mb-6', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Title and Description */}
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{description}</p>
          )}
        </div>

        {/* Actions */}
        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>
    </div>
  );
}

export default PageHeader;
