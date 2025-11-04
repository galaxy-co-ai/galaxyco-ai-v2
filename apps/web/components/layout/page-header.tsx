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
    <div className={cn('mb-8', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        {/* Title and Description - Framer/Linear Inspired */}
        <div className="min-w-0 space-y-2">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground">{title}</h1>
          {description && (
            <p className="text-base lg:text-lg text-muted-foreground">{description}</p>
          )}
        </div>

        {/* Actions */}
        {children && <div className="flex items-center gap-3">{children}</div>}
      </div>
    </div>
  );
}

export default PageHeader;
