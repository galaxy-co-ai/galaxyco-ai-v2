/**
 * Flow Builder - Visual Workflow Builder
 *
 * The key differentiator: Natural language → Beautiful visual workflows in < 60 seconds
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Panel,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, Play, Save, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { nodeTypes } from './FlowNodes';
import { parseNaturalLanguageToFlow, autoLayoutNodes, FlowNode, FlowEdge } from './FlowParser';
import { cn } from '@/lib/utils';

interface FlowBuilderProps {
  workspaceId: string;
  initialFlow?: {
    nodes: FlowNode[];
    edges: FlowEdge[];
  };
  onSave?: (flow: { nodes: FlowNode[]; edges: FlowEdge[]; name: string }) => void;
  onExecute?: (flow: { nodes: FlowNode[]; edges: FlowEdge[] }) => void;
}

export function FlowBuilder({ workspaceId, initialFlow, onSave, onExecute }: FlowBuilderProps) {
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [workflowName, setWorkflowName] = useState('');

  // Transform FlowNode to React Flow Node
  const transformToReactFlowNodes = (flowNodes: FlowNode[]): Node[] => {
    return flowNodes.map((node) => ({
      id: node.id,
      type: 'custom',
      position: node.position || { x: 0, y: 0 },
      data: {
        label: node.label,
        type: node.type,
        description: node.description,
        integration: node.integration,
        status: 'idle' as const,
        config: node.config,
      },
    }));
  };

  // Transform FlowEdge to React Flow Edge
  const transformToReactFlowEdges = (flowEdges: FlowEdge[]): Edge[] => {
    return flowEdges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label,
      type: 'smoothstep',
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#9CA3AF',
      },
      style: {
        stroke: '#9CA3AF',
        strokeWidth: 2,
      },
    }));
  };

  const [nodes, setNodes, onNodesChange] = useNodesState(
    initialFlow ? transformToReactFlowNodes(initialFlow.nodes) : [],
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    initialFlow ? transformToReactFlowEdges(initialFlow.edges) : [],
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  /**
   * Generate workflow from natural language
   */
  const handleGenerate = async () => {
    if (!input.trim()) {
      toast.error('Please describe your workflow');
      return;
    }

    setIsGenerating(true);

    try {
      // Parse natural language to flow structure
      const parsedFlow = await parseNaturalLanguageToFlow(input, workspaceId);

      // Auto-layout nodes
      const layoutedNodes = await autoLayoutNodes(parsedFlow.nodes, parsedFlow.edges);

      // Transform and set nodes/edges
      setNodes(transformToReactFlowNodes(layoutedNodes));
      setEdges(transformToReactFlowEdges(parsedFlow.edges));
      setWorkflowName(parsedFlow.name);

      toast.success('Workflow generated! 🎉', {
        description: 'Customize it further or save to run later.',
      });
    } catch (error) {
      console.error('Failed to generate workflow:', error);
      toast.error('Failed to generate workflow', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Save workflow
   */
  const handleSave = () => {
    if (nodes.length === 0) {
      toast.error('No workflow to save');
      return;
    }

    const flowData = {
      name: workflowName || 'Untitled Workflow',
      nodes: nodes.map((node) => ({
        id: node.id,
        type: node.data.type,
        label: node.data.label,
        description: node.data.description,
        integration: node.data.integration,
        config: node.data.config,
        position: node.position,
      })) as FlowNode[],
      edges: edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        condition: edge.data?.condition,
      })) as FlowEdge[],
    };

    onSave?.(flowData);
    toast.success('Workflow saved! ✅');
  };

  /**
   * Execute workflow
   */
  const handleExecute = () => {
    if (nodes.length === 0) {
      toast.error('No workflow to execute');
      return;
    }

    const flowData = {
      nodes: nodes.map((node) => ({
        id: node.id,
        type: node.data.type,
        label: node.data.label,
        description: node.data.description,
        integration: node.data.integration,
        config: node.data.config,
        position: node.position,
      })) as FlowNode[],
      edges: edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        condition: edge.data?.condition,
      })) as FlowEdge[],
    };

    onExecute?.(flowData);
    toast.success('Workflow execution started! 🚀');
  };

  /**
   * Reset workflow
   */
  const handleReset = () => {
    setNodes([]);
    setEdges([]);
    setInput('');
    setWorkflowName('');
    toast.info('Workflow cleared');
  };

  const hasWorkflow = nodes.length > 0;

  return (
    <div className="flex h-full flex-col">
      {/* Natural Language Input Panel */}
      <AnimatePresence>
        {!hasWorkflow && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6"
          >
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Describe Your Workflow</h3>
                  <p className="text-sm text-muted-foreground">
                    Tell me what you want to automate in plain English. I&apos;ll build it for you.
                  </p>
                </div>

                <Textarea
                  placeholder="Example: Email new leads every Monday at 9am, then add them to my CRM..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[120px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      handleGenerate();
                    }
                  }}
                />

                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Press <kbd className="px-1.5 py-0.5 rounded bg-muted">⌘</kbd> +{' '}
                    <kbd className="px-1.5 py-0.5 rounded bg-muted">Enter</kbd> to generate
                  </p>

                  <Button onClick={handleGenerate} disabled={isGenerating || !input.trim()}>
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Workflow
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* React Flow Canvas */}
      <div className="relative flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.5}
          maxZoom={1.5}
          className={cn('bg-neutral-50 dark:bg-neutral-950', !hasWorkflow && 'opacity-50')}
        >
          <Background color="#aaa" gap={16} />
          <Controls className="bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700" />
          <MiniMap
            className="bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700"
            maskColor="rgba(0, 0, 0, 0.1)"
          />

          {/* Toolbar */}
          {hasWorkflow && (
            <Panel position="top-center" className="flex gap-2">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-2"
              >
                <Button size="sm" variant="outline" onClick={handleReset}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>

                <Button size="sm" variant="outline" onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>

                <Button size="sm" onClick={handleExecute}>
                  <Play className="mr-2 h-4 w-4" />
                  Execute
                </Button>
              </motion.div>
            </Panel>
          )}

          {/* Empty State */}
          {!hasWorkflow && (
            <Panel position="top-center">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                <div className="rounded-lg bg-white/80 dark:bg-neutral-900/80 backdrop-blur px-6 py-3 shadow-lg">
                  <p className="text-sm text-muted-foreground">
                    Describe your workflow above to get started ✨
                  </p>
                </div>
              </motion.div>
            </Panel>
          )}
        </ReactFlow>
      </div>
    </div>
  );
}
