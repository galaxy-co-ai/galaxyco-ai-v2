'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  category?: string;
  keywords?: string[];
  shortcut?: string;
  onSelect: () => void;
}

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: CommandItem[];
  placeholder?: string;
  emptyState?: React.ReactNode;
  className?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  commands,
  placeholder = 'Search commands...',
  emptyState,
  className,
}) => {
  const [search, setSearch] = React.useState('');
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Filter and group commands
  const filteredCommands = React.useMemo(() => {
    if (!search.trim()) return commands;

    const searchLower = search.toLowerCase();
    return commands.filter((cmd) => {
      const labelMatch = cmd.label.toLowerCase().includes(searchLower);
      const descMatch = cmd.description?.toLowerCase().includes(searchLower);
      const keywordMatch = cmd.keywords?.some((k) => k.toLowerCase().includes(searchLower));
      return labelMatch || descMatch || keywordMatch;
    });
  }, [commands, search]);

  const groupedCommands = React.useMemo(() => {
    const groups = new Map<string, CommandItem[]>();

    filteredCommands.forEach((cmd) => {
      const category = cmd.category || 'Other';
      if (!groups.has(category)) {
        groups.set(category, []);
      }
      groups.get(category)!.push(cmd);
    });

    return Array.from(groups.entries());
  }, [filteredCommands]);

  // Reset selection when filtered results change
  React.useEffect(() => {
    setSelectedIndex(0);
  }, [filteredCommands]);

  // Auto-focus input when opened
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleSelect = (command: CommandItem) => {
    command.onSelect();
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredCommands.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredCommands.length - 1));
    } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredCommands[selectedIndex]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn('max-w-2xl p-0 gap-0 overflow-hidden', 'top-[20%] translate-y-0', className)}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="py-12 text-center">
              {emptyState || <p className="text-sm text-muted-foreground">No commands found</p>}
            </div>
          ) : (
            <div>
              {groupedCommands.map(([category, items], groupIndex) => {
                // Calculate global indices for keyboard navigation
                const startIndex = groupedCommands
                  .slice(0, groupIndex)
                  .reduce((sum, [, grp]) => sum + grp.length, 0);

                return (
                  <div key={category}>
                    {/* Category Header */}
                    <div className="px-4 py-2 bg-muted/50">
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {category}
                      </h3>
                    </div>

                    {/* Command Items */}
                    <div>
                      {items.map((command, itemIndex) => {
                        const globalIndex = startIndex + itemIndex;
                        const isSelected = selectedIndex === globalIndex;

                        return (
                          <button
                            key={command.id}
                            onClick={() => handleSelect(command)}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            className={cn(
                              'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-150',
                              'focus:outline-none',
                              isSelected
                                ? 'bg-accent text-accent-foreground'
                                : 'hover:bg-accent/50',
                            )}
                          >
                            {/* Icon */}
                            {command.icon && (
                              <div className="flex-shrink-0 text-muted-foreground">
                                {command.icon}
                              </div>
                            )}

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-foreground">
                                {command.label}
                              </div>
                              {command.description && (
                                <div className="text-xs text-muted-foreground mt-0.5">
                                  {command.description}
                                </div>
                              )}
                            </div>

                            {/* Shortcut */}
                            {command.shortcut && (
                              <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                                {command.shortcut}
                              </kbd>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/30">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border border-border bg-background">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded border border-border bg-background">↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border border-border bg-background">↵</kbd>
              Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border border-border bg-background">ESC</kbd>
              Close
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {filteredCommands.length} result
            {filteredCommands.length !== 1 ? 's' : ''}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
};

CommandPalette.displayName = 'CommandPalette';
