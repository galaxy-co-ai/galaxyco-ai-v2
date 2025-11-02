/**
 * Workflow Builder Page
 *
 * Visual Flow Builder - The key differentiator
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkspace } from '@/contexts/workspace-context';
import { FlowBuilder } from '@/components/galaxy/flows/FlowBuilder';
import { toast } from 'sonner';
import { FlowNode, FlowEdge } from '@/components/galaxy/flows/FlowParser';
import { executeWorkflow } from '@/components/galaxy/flows/FlowExecutor';

export default function WorkflowBuilderPage() {
  const { currentWorkspace } = useWorkspace();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  if (!currentWorkspace) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Please select a workspace</p>
      </div>
    );
  }

  /**
   * Save workflow
   */
  const handleSave = async (flow: { nodes: FlowNode[]; edges: FlowEdge[]; name: string }) => {
    setIsSaving(true);

    try {
      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workspaceId: currentWorkspace.id,
          name: flow.name,
          description: `Workflow with ${flow.nodes.length} steps`,
          steps: flow.nodes.map((node) => ({
            id: node.id,
            type: node.type,
            name: node.label,
            config: {
              ...node.config,
              description: node.description,
              integration: node.integration,
              position: node.position,
            },
          })),
          status: 'draft',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save workflow');
      }

      const data = await response.json();

      toast.success('Workflow saved successfully! ✅', {
        description: 'You can now run it from the workflows page.',
        action: {
          label: 'View',
          onClick: () => router.push('/workflows'),
        },
      });
    } catch (error) {
      console.error('Failed to save workflow:', error);
      toast.error('Failed to save workflow', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Execute workflow
   */
  const handleExecute = async (flow: { nodes: FlowNode[]; edges: FlowEdge[] }) => {
    setIsExecuting(true);

    try {
      // For now, just simulate execution
      // In production, this would call the execution API
      const result = await executeWorkflow(flow.nodes, flow.edges, {
        workspaceId: currentWorkspace.id,
        userId: 'current-user', // TODO: Get from auth
        variables: {},
        results: {},
      });

      if (result.success) {
        toast.success('Workflow executed successfully! 🎉', {
          description: `Completed ${result.executedNodes.length} steps in ${result.duration}ms`,
        });
      } else {
        toast.error('Workflow execution failed', {
          description: result.errors?.[0]?.error || 'Unknown error',
        });
      }
    } catch (error) {
      console.error('Failed to execute workflow:', error);
      toast.error('Failed to execute workflow', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Visual Flow Builder</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Describe your workflow in natural language and watch it come to life ✨
            </p>
          </div>
        </div>
      </div>

      {/* Flow Builder */}
      <div className="flex-1">
        <FlowBuilder
          workspaceId={currentWorkspace.id}
          onSave={handleSave}
          onExecute={handleExecute}
        />
      </div>
    </div>
  );
}
