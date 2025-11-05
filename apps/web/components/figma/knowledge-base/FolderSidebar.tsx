/**
 * Folder Sidebar - Figma Knowledge Base Component
 * Left sidebar with folder list
 * Matches Figma design exactly
 */

'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Folder } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FolderItem {
  id: string;
  name: string;
  documentCount: number;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'black' | 'cyan';
}

export interface FolderSidebarProps {
  folders: FolderItem[];
  selectedFolderId?: string | null;
  onFolderClick?: (folderId: string) => void;
  className?: string;
}

const colorConfig = {
  blue: { icon: 'text-blue-500', bg: 'bg-blue-500/10' },
  green: { icon: 'text-green-500', bg: 'bg-green-500/10' },
  purple: { icon: 'text-purple-500', bg: 'bg-purple-500/10' },
  orange: { icon: 'text-orange-500', bg: 'bg-orange-500/10' },
  black: { icon: 'text-gray-900', bg: 'bg-gray-500/10' },
  cyan: { icon: 'text-cyan-500', bg: 'bg-cyan-500/10' },
};

export function FolderSidebar({
  folders,
  selectedFolderId,
  onFolderClick,
  className,
}: FolderSidebarProps) {
  return (
    <Card className={cn('figma-card p-0 overflow-hidden', className)}>
      <div className="p-4 border-b">
        <h3 className="font-semibold text-sm">Folders</h3>
      </div>

      <ScrollArea className="h-[600px]">
        <div className="p-2 space-y-1">
          {folders.map((folder) => {
            const config = colorConfig[folder.color];
            const isSelected = selectedFolderId === folder.id;

            return (
              <button
                key={folder.id}
                onClick={() => onFolderClick?.(folder.id)}
                className={cn(
                  'w-full p-3 rounded-xl text-left transition-all',
                  'hover:bg-muted/50 hover:shadow-sm',
                  isSelected && 'bg-muted shadow-sm',
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn('h-8 w-8 rounded-lg flex items-center justify-center', config.bg)}
                  >
                    <Folder className={cn('h-4 w-4', config.icon)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{folder.name}</p>
                    <p className="text-xs text-muted-foreground">{folder.documentCount} docs</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
}
