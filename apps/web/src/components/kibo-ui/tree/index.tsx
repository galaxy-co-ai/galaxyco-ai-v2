/**
 * Kibo UI - Tree Component (Temporary - Replace with official when available)
 * Hierarchical tree view
 */

'use client';

import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState, type ReactNode } from 'react';

export interface TreeNode {
  id: string;
  label: string;
  icon?: ReactNode;
  children?: TreeNode[];
}

export interface TreeProps {
  data: TreeNode[];
  onNodeClick?: (node: TreeNode) => void;
  className?: string;
}

function TreeItem({
  node,
  onNodeClick,
  level = 0,
}: {
  node: TreeNode;
  onNodeClick?: (node: TreeNode) => void;
  level?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <button
        onClick={() => {
          if (hasChildren) setIsExpanded(!isExpanded);
          onNodeClick?.(node);
        }}
        className={cn(
          'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent',
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {hasChildren && (
          <span className="shrink-0">
            {isExpanded ? (
              <ChevronDown className="size-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="size-4 text-muted-foreground" />
            )}
          </span>
        )}
        {!hasChildren && <span className="w-4 shrink-0" />}
        {node.icon && <span className="shrink-0">{node.icon}</span>}
        <span className="flex-1 truncate text-left">{node.label}</span>
      </button>
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <TreeItem key={child.id} node={child} onNodeClick={onNodeClick} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function Tree({ data, onNodeClick, className }: TreeProps) {
  return (
    <div className={cn('w-full rounded-lg border bg-background p-2', className)}>
      {data.map((node) => (
        <TreeItem key={node.id} node={node} onNodeClick={onNodeClick} />
      ))}
    </div>
  );
}
