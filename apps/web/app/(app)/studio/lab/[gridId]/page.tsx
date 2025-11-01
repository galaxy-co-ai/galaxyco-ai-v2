'use client';

import { useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  useReactFlow,
  type Connection,
  type OnConnect,
  type OnNodesChange,
  type OnEdgesChange,
  type NodeTypes,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useHotkeys } from 'react-hotkeys-hook';
import {
  useCanvasStore,
  selectNodes,
  selectEdges,
  selectCanUndo,
  selectCanRedo,
} from '@/lib/studio/canvas-store';
import { CanvasNode } from '@/components/studio/canvas-node';
import { CanvasToolbar } from '@/components/studio/canvas-toolbar';
import { Button } from '@/components/ui/button';
import { Undo2, Redo2, Save, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const nodeTypes: NodeTypes = {
  custom: CanvasNode,
};

interface PageProps {
  params: Promise<{ gridId: string }>;
}

export default function LabPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const reactFlowInstance = useReactFlow();

  const nodes = useCanvasStore(selectNodes);
  const edges = useCanvasStore(selectEdges);
  const canUndo = useCanvasStore(selectCanUndo);
  const canRedo = useCanvasStore(selectCanRedo);

  const addNode = useCanvasStore((state) => state.addNode);
  const addEdge = useCanvasStore((state) => state.addEdge);
  const updateNode = useCanvasStore((state) => state.updateNode);
  const deleteNodes = useCanvasStore((state) => state.deleteNodes);
  const undo = useCanvasStore((state) => state.undo);
  const redo = useCanvasStore((state) => state.redo);
  const copy = useCanvasStore((state) => state.copy);
  const paste = useCanvasStore((state) => state.paste);
  const selectedNodes = useCanvasStore((state) => state.selectedNodes);

  // Load grid data
  useEffect(() => {
    // TODO: Load grid from API
    // For now, start with empty canvas
  }, [resolvedParams.gridId]);

  // Handle node changes
  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      // Apply changes locally first for performance
      const updatedNodes = applyNodeChanges(changes, nodes);

      // Update store with debouncing handled by auto-save
      changes.forEach((change) => {
        if (change.type === 'position' && change.dragging === false) {
          updateNode(change.id, { position: change.position });
        }
      });
    },
    [nodes, updateNode],
  );

  // Handle edge changes
  const onEdgesChange: OnEdgesChange = useCallback((changes) => {
    // Similar pattern for edges
  }, []);

  // Handle new connections
  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;

      addEdge({
        id: `${connection.source}-${connection.target}`,
        source: connection.source,
        target: connection.target,
        type: 'default',
      });
    },
    [addEdge],
  );

  // Keyboard shortcuts
  useHotkeys(
    'ctrl+z, cmd+z',
    (e: KeyboardEvent) => {
      e.preventDefault();
      if (canUndo) undo();
    },
    [canUndo, undo],
  );

  useHotkeys(
    'ctrl+y, cmd+y, ctrl+shift+z, cmd+shift+z',
    (e: KeyboardEvent) => {
      e.preventDefault();
      if (canRedo) redo();
    },
    [canRedo, redo],
  );

  useHotkeys(
    'delete, backspace',
    (e: KeyboardEvent) => {
      e.preventDefault();
      if (selectedNodes.length > 0) {
        deleteNodes(selectedNodes);
      }
    },
    [selectedNodes, deleteNodes],
  );

  useHotkeys(
    'ctrl+c, cmd+c',
    (e: KeyboardEvent) => {
      e.preventDefault();
      copy();
      toast.success('Copied to clipboard');
    },
    [copy],
  );

  useHotkeys(
    'ctrl+v, cmd+v',
    (e: KeyboardEvent) => {
      e.preventDefault();
      paste();
      toast.success('Pasted from clipboard');
    },
    [paste],
  );

  useHotkeys('ctrl+s, cmd+s', (e: KeyboardEvent) => {
    e.preventDefault();
    toast.success('Auto-saving...');
    // Auto-save is handled automatically
  });

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    reactFlowInstance?.zoomIn();
  }, [reactFlowInstance]);

  const handleZoomOut = useCallback(() => {
    reactFlowInstance?.zoomOut();
  }, [reactFlowInstance]);

  const handleFitView = useCallback(() => {
    reactFlowInstance?.fitView({ padding: 0.2 });
  }, [reactFlowInstance]);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Toolbar */}
      <CanvasToolbar />

      {/* Canvas */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.1}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          className="bg-background"
        >
          <Background color="hsl(var(--muted-foreground) / 0.1)" gap={16} size={1} />

          <Controls
            showZoom={false}
            showFitView={false}
            showInteractive={false}
            className="!bg-card !border !border-border !shadow-lg !rounded-lg"
          />

          <MiniMap
            nodeColor={(node) => {
              return 'hsl(var(--primary) / 0.5)';
            }}
            maskColor="hsl(var(--background) / 0.8)"
            className="!bg-card !border !border-border !shadow-lg !rounded-lg"
          />

          {/* Floating Controls */}
          <Panel position="bottom-right" className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-card/90 backdrop-blur-md border border-border rounded-lg p-1 shadow-lg">
              <Button variant="ghost" size="sm" onClick={handleZoomOut} className="h-8 w-8 p-0">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleFitView} className="h-8 w-8 p-0">
                <Maximize className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleZoomIn} className="h-8 w-8 p-0">
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </Panel>

          {/* Quick Actions */}
          <Panel position="bottom-left" className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-card/90 backdrop-blur-md border border-border rounded-lg p-1 shadow-lg">
              <Button
                variant="ghost"
                size="sm"
                onClick={undo}
                disabled={!canUndo}
                className="h-8 w-8 p-0"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={redo}
                disabled={!canRedo}
                className="h-8 w-8 p-0"
                title="Redo (Ctrl+Y)"
              >
                <Redo2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Save indicator */}
            <div className="flex items-center gap-2 bg-card/90 backdrop-blur-md border border-border rounded-lg px-3 py-1.5 shadow-lg">
              <Save className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">All changes saved</span>
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}
