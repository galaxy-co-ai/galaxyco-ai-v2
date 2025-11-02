/**
 * Kibo UI - Mini Calendar Component (Temporary - Replace with official when available)
 * Compact calendar display
 */

'use client';

import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export interface MiniCalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  className?: string;
}

export function MiniCalendar({ selectedDate, onDateSelect, className }: MiniCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0,
  ).getDate();

  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const isSelectedDate = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getFullYear() === currentMonth.getFullYear()
    );
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth.getMonth() &&
      today.getFullYear() === currentMonth.getFullYear()
    );
  };

  return (
    <div className={cn('w-full max-w-sm rounded-lg border bg-background p-3', className)}>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <button onClick={previousMonth} className="rounded-md p-1 hover:bg-accent">
          <ChevronLeft className="size-4" />
        </button>
        <p className="text-sm font-semibold">{monthName}</p>
        <button onClick={nextMonth} className="rounded-md p-1 hover:bg-accent">
          <ChevronRight className="size-4" />
        </button>
      </div>

      {/* Days of week */}
      <div className="mb-2 grid grid-cols-7 gap-1">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          return (
            <button
              key={day}
              onClick={() =>
                onDateSelect?.(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))
              }
              className={cn(
                'flex size-8 items-center justify-center rounded-md text-sm transition-colors',
                isSelectedDate(day) && 'bg-primary text-primary-foreground font-semibold',
                isToday(day) && !isSelectedDate(day) && 'border border-primary text-primary',
                !isSelectedDate(day) && !isToday(day) && 'hover:bg-accent',
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
