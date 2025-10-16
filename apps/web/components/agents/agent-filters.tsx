'use client';

import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { AgentStatus } from '@/lib/agents/types';

interface AgentFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStatuses: AgentStatus[];
  onStatusToggle: (status: AgentStatus) => void;
  selectedIntegrations: string[];
  onIntegrationToggle: (integration: string) => void;
  availableIntegrations: string[];
}

const STATUS_OPTIONS: { value: AgentStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'archived', label: 'Archived' },
];

export function AgentFilters({
  searchQuery,
  onSearchChange,
  selectedStatuses,
  onStatusToggle,
  selectedIntegrations,
  onIntegrationToggle,
  availableIntegrations,
}: AgentFiltersProps) {
  const activeFilterCount =
    selectedStatuses.length + selectedIntegrations.length;

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <Input
          type="text"
          placeholder="Search agents..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Filter Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="relative">
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          {STATUS_OPTIONS.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={selectedStatuses.includes(option.value)}
              onCheckedChange={() => onStatusToggle(option.value)}
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          ))}

          {availableIntegrations.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Integrations</DropdownMenuLabel>
              {availableIntegrations.map((integration) => (
                <DropdownMenuCheckboxItem
                  key={integration}
                  checked={selectedIntegrations.includes(integration)}
                  onCheckedChange={() => onIntegrationToggle(integration)}
                >
                  {integration}
                </DropdownMenuCheckboxItem>
              ))}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
