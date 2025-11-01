'use client';

import { useEffect, useState, useMemo } from 'react';
import { ReactFlow, Background, Controls, MiniMap, type Node, type Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { TemplatePreviewData } from '@/lib/studio/types';

interface TemplatePreviewCanvasProps {
  previewData: TemplatePreviewData;
  className?: string;
}

export function TemplatePreviewCanvas({ previewData, className = '' }: TemplatePreviewCanvasProps) {
  const [isClient, setIsClient] = useState(false);

  // Only render on client to avoid hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Convert template nodes/edges to React Flow format
  const nodes: Node[] = useMemo(
    () =>
      previewData.nodes.map((node) => ({
        id: node.id,
        type: 'default',
        position: node.position,
        data: {
          label: node.label,
          type: node.type,
        },
        style: {
          background: 'hsl(var(--card))',
          border: '1px solid hsl(var(--border))',
          borderRadius: '8px',
          padding: '10px 16px',
          fontSize: '12px',
          fontWeight: 500,
          color: 'hsl(var(--foreground))',
        },
      })),
    [previewData.nodes],
  );

  const edges: Edge[] = useMemo(
    () =>
      previewData.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type === 'conditional' ? 'smoothstep' : 'default',
        animated: edge.type === 'default',
        label: edge.label,
        style: {
          stroke: 'hsl(var(--primary))',
          strokeWidth: 2,
        },
        labelStyle: {
          fontSize: '10px',
          fill: 'hsl(var(--muted-foreground))',
        },
      })),
    [previewData.edges],
  );

  const defaultViewport = {
    x: previewData.viewport?.x ?? 0,
    y: previewData.viewport?.y ?? 0,
    zoom: previewData.viewport?.zoom ?? 1,
  };

  if (!isClient) {
    return (
      <div className={`flex items-center justify-center bg-muted/30 rounded-lg ${className}`}>
        <p className="text-sm text-muted-foreground">Loading preview...</p>
      </div>
    );
  }

  return (
    <div className={`bg-muted/30 rounded-lg ${className}`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        defaultViewport={defaultViewport}
        nodesDraggable={false}
        nodesConnectable={false}
        nodesFocusable={false}
        edgesFocusable={false}
        elementsSelectable={false}
        panOnDrag={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        preventScrolling={true}
        minZoom={0.1}
        maxZoom={2}
        fitView
        fitViewOptions={{
          padding: 0.2,
          maxZoom: 1,
        }}
      >
        <Background color="hsl(var(--muted-foreground) / 0.2)" gap={16} />
        <Controls showZoom={true} showFitView={true} showInteractive={false} />
        <MiniMap
          nodeColor="hsl(var(--primary))"
          maskColor="hsl(var(--background) / 0.8)"
          style={{
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
          }}
        />
      </ReactFlow>
    </div>
  );
}
