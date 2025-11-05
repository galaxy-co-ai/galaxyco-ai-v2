/**
 * Search Header - Figma Knowledge Base Component
 * Top section with stats pills, search, filter, and view toggle
 * Matches Figma design exactly
 */

'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Grid3x3, List, Upload, FileText, Sparkles, Eye, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SearchHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  stats: {
    documents: number;
    aiGenerated: number;
    totalViews: number;
    starred: number;
  };
  onUpload?: () => void;
  className?: string;
}

export function SearchHeader({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  stats,
  onUpload,
  className,
}: SearchHeaderProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Stats Pills */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Badge className="figma-pill-blue h-10 justify-center">
          <FileText className="h-4 w-4 mr-2" />
          <span className="text-sm">{stats.documents} Documents</span>
        </Badge>
        <Badge className="figma-pill-purple h-10 justify-center">
          <Sparkles className="h-4 w-4 mr-2" />
          <span className="text-sm">{stats.aiGenerated} AI Generated</span>
        </Badge>
        <Badge className="figma-pill-green h-10 justify-center">
          <Eye className="h-4 w-4 mr-2" />
          <span className="text-sm">{stats.totalViews} Views</span>
        </Badge>
        <Badge className="figma-pill-orange h-10 justify-center">
          <Star className="h-4 w-4 mr-2" />
          <span className="text-sm">{stats.starred} Starred</span>
        </Badge>
      </div>

      {/* Search and Controls */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter */}
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>

        {/* View Toggle */}
        <div className="flex items-center gap-1 border rounded-lg p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewModeChange('grid')}
            className={cn(
              'h-8 w-8 p-0',
              viewMode === 'grid' && 'bg-muted'
            )}
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewModeChange('list')}
            className={cn(
              'h-8 w-8 p-0',
              viewMode === 'list' && 'bg-muted'
            )}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>

        {/* Upload Button */}
        {onUpload && (
          <Button size="sm" className="bg-black hover:bg-black/90">
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        )}
      </div>
    </div>
  );
}

