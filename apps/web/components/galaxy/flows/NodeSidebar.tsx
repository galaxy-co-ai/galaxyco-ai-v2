/**
 * Node Sidebar - Make.com/Linear style context panel
 *
 * Slides in from the right to show node details, connections, and properties
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Play,
  CheckCircle,
  Zap,
  GitBranch,
  Plug,
  ArrowRight,
  ArrowLeft,
  Settings,
  Trash2,
  Copy
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FlowNodeData } from './FlowNodes';

interface Connection {
  id: string;
  sourceId: string;
  sourceType: FlowNodeData['type'];
  sourceLabel: string;
  targetId: string;
  targetType: FlowNodeData['type'];
  targetLabel: string;
  direction: 'input' | 'output';
}

interface NodeSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  nodeData: FlowNodeData | null;
  connections: Connection[];
  onNavigateToNode?: (nodeId: string) => void;
  onUpdateNode?: (nodeId: string, data: Partial<FlowNodeData>) => void;
  onDeleteNode?: (nodeId: string) => void;
  onDuplicateNode?: (nodeId: string) => void;
  onTestRun?: (nodeId: string) => void;
}

const NODE_ICONS = {
  start: Play,
  action: Zap,
  condition: GitBranch,
  integration: Plug,
  end: CheckCircle,
};

const NODE_COLORS = {
  start: 'bg-purple-500',
  action: 'bg-blue-500',
  condition: 'bg-amber-500',
  integration: 'bg-green-500',
  end: 'bg-emerald-500',
};

export function NodeSidebar({
  isOpen,
  onClose,
  nodeData,
  connections,
  onNavigateToNode,
  onUpdateNode,
  onDeleteNode,
  onDuplicateNode,
  onTestRun,
}: NodeSidebarProps) {
  if (!nodeData) return null;

  const Icon = NODE_ICONS[nodeData.type];
  const inputConnections = connections.filter(c => c.direction === 'input');
  const outputConnections = connections.filter(c => c.direction === 'output');

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3">
            <div className={cn('p-2 rounded-md', NODE_COLORS[nodeData.type])}>
              <Icon className="size-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">{nodeData.label}</div>
              <div className="text-xs text-muted-foreground font-normal capitalize">
                {nodeData.type} Node
              </div>
            </div>
          </SheetTitle>
          <SheetDescription>
            Configure and manage this node
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Integration Info */}
          {nodeData.integration && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Integration</h3>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                <Plug className="size-4 text-muted-foreground" />
                <span className="text-sm">{nodeData.integration}</span>
              </div>
            </div>
          )}

          {/* Status */}
          {nodeData.status && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Status</h3>
              <Badge variant={
                nodeData.status === 'running' ? 'default' :
                nodeData.status === 'success' ? 'success' :
                nodeData.status === 'error' ? 'destructive' :
                'secondary'
              }>
                {nodeData.status}
              </Badge>
            </div>
          )}

          {/* Connections */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">
              Connections ({inputConnections.length + outputConnections.length})
            </h3>

            {/* Input Connections */}
            {inputConnections.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium">Inputs</p>
                {inputConnections.map((conn) => (
                  <ConnectionRow
                    key={conn.id}
                    connection={conn}
                    onClick={() => onNavigateToNode?.(conn.sourceId)}
                  />
                ))}
              </div>
            )}

            {/* Output Connections */}
            {outputConnections.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium">Outputs</p>
                {outputConnections.map((conn) => (
                  <ConnectionRow
                    key={conn.id}
                    connection={conn}
                    onClick={() => onNavigateToNode?.(conn.targetId)}
                  />
                ))}
              </div>
            )}

            {inputConnections.length === 0 && outputConnections.length === 0 && (
              <p className="text-sm text-muted-foreground py-3">No connections</p>
            )}
          </div>

          {/* Properties */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Properties</h3>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="node-label" className="text-xs">Label</Label>
                <Input
                  id="node-label"
                  value={nodeData.label}
                  onChange={(e) => onUpdateNode?.(nodeData.type, { label: e.target.value })}
                  className="h-9"
                />
              </div>

              {nodeData.description !== undefined && (
                <div className="space-y-2">
                  <Label htmlFor="node-description" className="text-xs">Description</Label>
                  <Input
                    id="node-description"
                    value={nodeData.description || ''}
                    onChange={(e) => onUpdateNode?.(nodeData.type, { description: e.target.value })}
                    className="h-9"
                  />
                </div>
              )}

              {/* Config Properties */}
              {nodeData.config && Object.keys(nodeData.config).length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs">Configuration</Label>
                  <div className="p-3 rounded-lg bg-muted/30 space-y-2">
                    {Object.entries(nodeData.config).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground capitalize">{key}:</span>
                        <span className="font-mono">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-4 border-t">
            <h3 className="text-sm font-semibold mb-3">Actions</h3>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => onTestRun?.(nodeData.type)}
              >
                <Play className="size-4" />
                Test Run
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => onDuplicateNode?.(nodeData.type)}
              >
                <Copy className="size-4" />
                Duplicate
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2"
            >
              <Settings className="size-4" />
              Advanced Settings
            </Button>

            <Button
              variant="destructive"
              size="sm"
              className="w-full gap-2"
              onClick={() => onDeleteNode?.(nodeData.type)}
            >
              <Trash2 className="size-4" />
              Delete Node
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface ConnectionRowProps {
  connection: Connection;
  onClick?: () => void;
}

function ConnectionRow({ connection, onClick }: ConnectionRowProps) {
  const SourceIcon = NODE_ICONS[connection.sourceType];
  const TargetIcon = NODE_ICONS[connection.targetType];
  const isInput = connection.direction === 'input';

  return (
    <motion.button
      onClick={onClick}
      className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors text-left group"
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
    >
      {isInput ? (
        <>
          <div className={cn('p-1.5 rounded-md shrink-0', NODE_COLORS[connection.sourceType])}>
            <SourceIcon className="size-3 text-white" />
          </div>
          <ArrowRight className="size-3 text-muted-foreground shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">{connection.sourceLabel}</p>
            <p className="text-xs text-muted-foreground capitalize">{connection.sourceType}</p>
          </div>
        </>
      ) : (
        <>
          <ArrowRight className="size-3 text-muted-foreground shrink-0" />
          <div className={cn('p-1.5 rounded-md shrink-0', NODE_COLORS[connection.targetType])}>
            <TargetIcon className="size-3 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">{connection.targetLabel}</p>
            <p className="text-xs text-muted-foreground capitalize">{connection.targetType}</p>
          </div>
        </>
      )}
    </motion.button>
  );
}

