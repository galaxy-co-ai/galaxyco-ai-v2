/**
 * Kibo UI - Contribution Graph Component (Temporary - Replace with official when available)
 * GitHub-style activity heatmap
 */

'use client';

import { cn } from '@/lib/utils';
import { useState } from 'react';

export interface ContributionGraphProps {
  data: Array<{ date: string; count: number }>;
  startDate?: Date;
  endDate?: Date;
  className?: string;
}

export function ContributionGraph({ data, startDate, endDate, className }: ContributionGraphProps) {
  const [hoveredCell, setHoveredCell] = useState<{ date: string; count: number } | null>(null);

  const getColor = (count: number) => {
    if (count === 0) return 'bg-muted';
    if (count < 5) return 'bg-green-200 dark:bg-green-900';
    if (count < 10) return 'bg-green-400 dark:bg-green-700';
    if (count < 15) return 'bg-green-600 dark:bg-green-500';
    return 'bg-green-800 dark:bg-green-300';
  };

  // Generate weeks (simplified - real implementation would be more complex)
  const weeks = [];
  const totalWeeks = 52;

  for (let week = 0; week < totalWeeks; week++) {
    const days = [];
    for (let day = 0; day < 7; day++) {
      const dayData = data[week * 7 + day] || { date: '', count: 0 };
      days.push(dayData);
    }
    weeks.push(days);
  }

  return (
    <div className={cn('relative', className)}>
      <div className="flex gap-1 overflow-x-auto">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day, dayIndex) => (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className={cn(
                  'size-3 rounded-sm cursor-pointer transition-colors',
                  getColor(day.count),
                )}
                onMouseEnter={() => setHoveredCell(day)}
                onMouseLeave={() => setHoveredCell(null)}
              />
            ))}
          </div>
        ))}
      </div>

      {hoveredCell && hoveredCell.date && (
        <div className="absolute bottom-full left-0 mb-2 rounded-md bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md">
          <p className="font-medium">{hoveredCell.count} contributions</p>
          <p className="text-muted-foreground">{hoveredCell.date}</p>
        </div>
      )}

      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="size-3 rounded-sm bg-muted" />
          <div className="size-3 rounded-sm bg-green-200 dark:bg-green-900" />
          <div className="size-3 rounded-sm bg-green-400 dark:bg-green-700" />
          <div className="size-3 rounded-sm bg-green-600 dark:bg-green-500" />
          <div className="size-3 rounded-sm bg-green-800 dark:bg-green-300" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
