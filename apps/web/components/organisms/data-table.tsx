'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export type Column<T> = {
  key: keyof T | string;
  header: string;
  widthClass?: string;
  sortable?: boolean;
  render?: (row: T, index: number) => React.ReactNode;
};

export type SortState = { key: string; direction: 'asc' | 'desc' };

export interface DataTableProps<T extends Record<string, any>> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  isLoading?: boolean;
  emptyMessage?: string;
  page?: number;
  pageSize?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  sort?: SortState;
  onSortChange?: (sort: SortState) => void;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  className,
  isLoading,
  emptyMessage = 'No records found',
  page = 1,
  pageSize = 10,
  totalItems,
  onPageChange,
  sort,
  onSortChange,
}: DataTableProps<T>) {
  const totalPages = totalItems ? Math.max(1, Math.ceil(totalItems / pageSize)) : 1;

  const handleSort = (key: string) => {
    if (!onSortChange) return;
    const next: SortState =
      sort && sort.key === key
        ? { key, direction: sort.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' };
    onSortChange(next);
  };

  return (
    <div
      className={cn('rounded-lg border border-border bg-card shadow-sm overflow-hidden', className)}
    >
      <table className="w-full table-fixed md:table-auto">
        <thead className="bg-muted/40 text-muted-foreground">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={cn(
                  'text-left text-xs font-medium uppercase tracking-wide px-4 py-3 select-none',
                  col.widthClass,
                  col.sortable && 'cursor-pointer hover:text-foreground',
                )}
                onClick={() => col.sortable && handleSort(String(col.key))}
              >
                <div className="flex items-center gap-2">
                  {col.header}
                  {sort && sort.key === col.key && (
                    <span aria-hidden className="text-foreground">
                      {sort.direction === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            [...Array(5)].map((_, i) => (
              <tr key={i} className="border-t border-border/60">
                <td colSpan={columns.length} className="px-4 py-3">
                  <Skeleton className="h-6 w-full" />
                </td>
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr className="border-t border-border/60">
              <td colSpan={columns.length} className="px-4 py-12 text-center text-muted-foreground">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-t border-border/60 hover:bg-muted/30">
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={cn('px-4 py-3 text-sm text-foreground', col.widthClass)}
                  >
                    {col.render ? col.render(row, rowIndex) : String(row[col.key as keyof T] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Separator className="my-0" />

      <div className="flex items-center justify-between px-3 py-2 text-sm text-muted-foreground">
        <div>
          Page {page} of {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="h-8 px-2 rounded border border-border bg-background hover:bg-hover disabled:opacity-50"
            onClick={() => onPageChange && onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1}
          >
            Prev
          </button>
          <button
            className="h-8 px-2 rounded border border-border bg-background hover:bg-hover disabled:opacity-50"
            onClick={() => onPageChange && onPageChange(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
