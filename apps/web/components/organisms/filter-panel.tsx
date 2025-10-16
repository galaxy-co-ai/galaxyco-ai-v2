'use client';

import React from 'react';
import { ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
  disabled?: boolean;
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
  type?: 'checkbox' | 'radio';
  defaultCollapsed?: boolean;
}

export interface FilterPanelProps {
  groups: FilterGroup[];
  selectedFilters: Record<string, string[]>;
  onFilterChange: (groupId: string, values: string[]) => void;
  onClearAll?: () => void;
  activeFilterCount?: number;
  className?: string;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  groups,
  selectedFilters,
  onFilterChange,
  onClearAll,
  activeFilterCount,
  className,
}) => {
  const [collapsedGroups, setCollapsedGroups] = React.useState<Set<string>>(
    new Set(groups.filter((g) => g.defaultCollapsed).map((g) => g.id))
  );

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  const handleOptionToggle = (group: FilterGroup, optionValue: string) => {
    const currentValues = selectedFilters[group.id] || [];
    
    if (group.type === 'radio') {
      // Radio: replace value
      onFilterChange(group.id, [optionValue]);
    } else {
      // Checkbox: toggle value
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter((v) => v !== optionValue)
        : [...currentValues, optionValue];
      onFilterChange(group.id, newValues);
    }
  };

  const isOptionSelected = (groupId: string, optionValue: string): boolean => {
    return (selectedFilters[groupId] || []).includes(optionValue);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Filters
          {activeFilterCount !== undefined && activeFilterCount > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-primary text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </h3>
        {onClearAll && activeFilterCount !== undefined && activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="h-7 text-xs"
          >
            Clear all
          </Button>
        )}
      </div>

      <Separator />

      {/* Filter Groups */}
      <div className="space-y-4">
        {groups.map((group, groupIndex) => {
          const isCollapsed = collapsedGroups.has(group.id);
          const groupSelectedCount = (selectedFilters[group.id] || []).length;

          return (
            <div key={group.id}>
              {groupIndex > 0 && <Separator className="mb-4" />}

              {/* Group Header */}
              <button
                type="button"
                onClick={() => toggleGroup(group.id)}
                className={cn(
                  'w-full flex items-center justify-between py-2 text-left',
                  'hover:text-foreground transition-colors duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm'
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {group.label}
                  </span>
                  {groupSelectedCount > 0 && (
                    <span className="px-1.5 py-0.5 text-xs font-semibold rounded bg-accent text-accent-foreground">
                      {groupSelectedCount}
                    </span>
                  )}
                </div>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 text-muted-foreground transition-transform duration-200',
                    !isCollapsed && 'transform rotate-180'
                  )}
                />
              </button>

              {/* Group Options */}
              {!isCollapsed && (
                <div className="mt-2 space-y-2">
                  {group.options.map((option) => {
                    const isSelected = isOptionSelected(group.id, option.value);
                    const inputId = `filter-${group.id}-${option.value}`;

                    return (
                      <label
                        key={option.value}
                        htmlFor={inputId}
                        className={cn(
                          'flex items-center gap-2 py-1.5 px-2 rounded-md',
                          'hover:bg-accent transition-colors duration-200 cursor-pointer',
                          option.disabled && 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        <input
                          id={inputId}
                          type={group.type === 'radio' ? 'radio' : 'checkbox'}
                          name={group.type === 'radio' ? group.id : undefined}
                          checked={isSelected}
                          onChange={() => handleOptionToggle(group, option.value)}
                          disabled={option.disabled}
                          className={cn(
                            'h-4 w-4 rounded border-border text-primary',
                            'focus:ring-2 focus:ring-primary focus:ring-offset-2',
                            'disabled:cursor-not-allowed disabled:opacity-50'
                          )}
                        />
                        <span className="flex-1 text-sm text-foreground">
                          {option.label}
                        </span>
                        {option.count !== undefined && (
                          <span className="text-xs text-muted-foreground">
                            ({option.count})
                          </span>
                        )}
                        {isSelected && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleOptionToggle(group, option.value);
                            }}
                            className="p-0.5 hover:bg-destructive/10 rounded"
                            aria-label={`Remove ${option.label} filter`}
                          >
                            <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                          </button>
                        )}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

FilterPanel.displayName = 'FilterPanel';
