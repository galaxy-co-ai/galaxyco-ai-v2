'use client';

import { useState } from 'react';
import { useCanvasStore } from '@/lib/studio/canvas-store';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Zap,
  Play,
  GitBranch,
  Repeat,
  Sparkles,
  Webhook,
  Clock,
  Code,
  Filter,
  Database,
  Layers,
  Share2,
  Globe,
  Mail,
  Bell,
  Plug,
  Box,
  Plus,
  Layout,
  ChevronDown,
} from 'lucide-react';
import type { GridNodeType } from '@/lib/studio/types';
import { cn } from '@/lib/utils';

// ============================================================================
// Node Categories
// ============================================================================

const NODE_CATEGORIES = [
  {
    label: 'Triggers',
    nodes: [
      { type: 'trigger' as GridNodeType, label: 'Trigger', icon: Zap },
      { type: 'webhook' as GridNodeType, label: 'Webhook', icon: Webhook },
    ],
  },
  {
    label: 'Actions',
    nodes: [
      { type: 'action' as GridNodeType, label: 'Action', icon: Play },
      { type: 'ai' as GridNodeType, label: 'AI', icon: Sparkles },
      { type: 'api' as GridNodeType, label: 'API', icon: Globe },
      { type: 'database' as GridNodeType, label: 'Database', icon: Database },
      { type: 'email' as GridNodeType, label: 'Email', icon: Mail },
      {
        type: 'notification' as GridNodeType,
        label: 'Notification',
        icon: Bell,
      },
    ],
  },
  {
    label: 'Logic',
    nodes: [
      {
        type: 'condition' as GridNodeType,
        label: 'Condition',
        icon: GitBranch,
      },
      { type: 'loop' as GridNodeType, label: 'Loop', icon: Repeat },
      { type: 'branch' as GridNodeType, label: 'Branch', icon: Share2 },
      { type: 'merge' as GridNodeType, label: 'Merge', icon: Layers },
    ],
  },
  {
    label: 'Data',
    nodes: [
      { type: 'transform' as GridNodeType, label: 'Transform', icon: Code },
      { type: 'filter' as GridNodeType, label: 'Filter', icon: Filter },
      { type: 'aggregate' as GridNodeType, label: 'Aggregate', icon: Layers },
    ],
  },
  {
    label: 'Utility',
    nodes: [
      { type: 'delay' as GridNodeType, label: 'Delay', icon: Clock },
      { type: 'integration' as GridNodeType, label: 'Integration', icon: Plug },
      { type: 'custom' as GridNodeType, label: 'Custom', icon: Box },
    ],
  },
];

// ============================================================================
// Component
// ============================================================================

export function CanvasToolbar() {
  const [open, setOpen] = useState(false);
  const gridName = useCanvasStore((state) => state.gridName);
  const addNode = useCanvasStore((state) => state.addNode);

  const handleAddNode = (type: GridNodeType) => {
    // Add node in center of viewport
    addNode(type, { x: 400, y: 300 });
    setOpen(false);
  };

  const handleAutoLayout = () => {
    // TODO: Implement auto-layout with elkjs
  };

  return (
    <div className="h-14 border-b border-border bg-card/50 backdrop-blur-md flex items-center justify-between px-4 gap-4">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Grid Name */}
        <div className="flex flex-col">
          <h1 className="text-sm font-semibold">{gridName}</h1>
          <p className="text-[10px] text-muted-foreground">AI Lab</p>
        </div>

        <div className="h-8 w-px bg-border" />

        {/* Add Node Button */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="default" size="sm" className="gap-2 bg-primary/90 hover:bg-primary">
              <Plus className="h-4 w-4" />
              Add Node
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-[400px] p-2 bg-card/95 backdrop-blur-md border-border"
          >
            <div className="grid grid-cols-2 gap-4">
              {NODE_CATEGORIES.map((category) => (
                <div key={category.label} className="space-y-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                    {category.label}
                  </h3>
                  <div className="space-y-1">
                    {category.nodes.map((node) => {
                      const Icon = node.icon;
                      return (
                        <button
                          key={node.type}
                          onClick={() => handleAddNode(node.type)}
                          className={cn(
                            'w-full flex items-center gap-2 px-2 py-1.5 rounded-md',
                            'text-sm hover:bg-accent transition-colors text-left',
                          )}
                        >
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <span>{node.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Auto Layout */}
        <Button variant="outline" size="sm" onClick={handleAutoLayout} className="gap-2">
          <Layout className="h-4 w-4" />
          Auto Layout
        </Button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          Test Run
        </Button>
        <Button variant="default" size="sm">
          Publish
        </Button>
      </div>
    </div>
  );
}
