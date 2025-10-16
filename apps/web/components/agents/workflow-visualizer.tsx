'use client';

import { useCallback } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Play, Square, CheckCircle, AlertCircle } from 'lucide-react';
import type { WorkflowNode as StoreWorkflowNode, WorkflowEdge } from '@/lib/stores/agent-builder-store';

interface WorkflowVisualizerProps {
  nodes: StoreWorkflowNode[];
  edges: WorkflowEdge[];
  onNodeClick?: (node: StoreWorkflowNode) => void;
  interactive?: boolean;
  compact?: boolean;
}

// Custom Node Component
function CustomNode({ data }: { data: any }) {
  const { label, type, status, integration } = data;
  
  const getIcon = () => {
    if (type === 'start') return <Play className="h-4 w-4" />;
    if (type === 'end') return <CheckCircle className="h-4 w-4" />;
    if (status === 'error') return <AlertCircle className="h-4 w-4 text-red-500" />;
    return <Square className="h-4 w-4" />;
  };

  const getBgColor = () => {
    if (type === 'start') return 'bg-gradient-to-br from-purple-500 to-purple-700 text-white';
    if (type === 'end') return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700';
    if (type === 'condition') return 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700';
    if (status === 'active') return 'bg-blue-100 dark:bg-blue-900/20 border-blue-500 dark:border-blue-400';
    if (status === 'complete') return 'bg-green-50 dark:bg-green-900/10 border-green-400 dark:border-green-600';
    if (status === 'error') return 'bg-red-50 dark:bg-red-900/10 border-red-400 dark:border-red-600';
    return 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700';
  };

  return (
    <div
      className={`min-w-[160px] rounded-lg border-2 px-4 py-3 shadow-sm transition-all hover:shadow-md ${getBgColor()}`}
    >
      <div className="flex items-start gap-2">
        {getIcon()}
        <div className="flex-1">
          <div className="text-sm font-medium">{label}</div>
          {integration && (
            <div className="mt-1 text-xs opacity-70">{integration}</div>
          )}
        </div>
      </div>
    </div>
  );
}

const nodeTypes = {
  custom: CustomNode,
};

export function WorkflowVisualizer({
  nodes: workflowNodes,
  edges: workflowEdges,
  onNodeClick,
  interactive = true,
  compact = false,
}: WorkflowVisualizerProps) {
  // Transform store nodes to React Flow nodes
  const transformedNodes: Node[] = workflowNodes.map((node) => ({
    id: node.id,
    type: 'custom',
    position: node.position,
    data: {
      label: node.label,
      type: node.type,
      status: node.status,
      integration: node.integration,
      description: node.description,
    },
  }));

  // Transform store edges to React Flow edges
  const transformedEdges: Edge[] = workflowEdges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    label: edge.label,
    type: 'smoothstep',
    animated: false,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#9CA3AF',
    },
    style: {
      stroke: '#9CA3AF',
      strokeWidth: 2,
    },
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(transformedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(transformedEdges);

  const handleNodeClick = useCallback(
    (_event: any, node: Node) => {
      if (onNodeClick) {
        const originalNode = workflowNodes.find((n) => n.id === node.id);
        if (originalNode) {
          onNodeClick(originalNode);
        }
      }
    },
    [workflowNodes, onNodeClick]
  );

  // Update nodes when workflowNodes change
  useCallback(() => {
    setNodes(transformedNodes);
    setEdges(transformedEdges);
  }, [workflowNodes, workflowEdges]);

  if (compact) {
    // Compact list view for mobile
    return (
      <div className="space-y-2">
        {workflowNodes.map((node, index) => {
          const Icon = node.type === 'start' ? Play : node.type === 'end' ? CheckCircle : Square;
          return (
            <div
              key={node.id}
              className="flex items-center gap-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-3"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                <Icon className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {index + 1}. {node.label}
                </div>
                {node.integration && (
                  <div className="text-xs text-neutral-600 dark:text-neutral-400">
                    {node.integration}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="h-full w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={interactive ? onNodesChange : undefined}
        onEdgesChange={interactive ? onEdgesChange : undefined}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.5}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        nodesDraggable={interactive}
        nodesConnectable={false}
        elementsSelectable={interactive}
      >
        <Background color="#aaa" gap={16} />
        <Controls className="bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700" />
        {!compact && (
          <MiniMap
            className="bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700"
            maskColor="rgba(0, 0, 0, 0.1)"
          />
        )}
      </ReactFlow>
    </div>
  );
}
