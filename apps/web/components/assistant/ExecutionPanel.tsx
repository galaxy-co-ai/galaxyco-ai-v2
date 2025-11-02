/**
 * GalaxyCo.ai ExecutionPanel
 * Shows when AI is executing tools with Grid canvas preview
 * November 2, 2025
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Loader2, ExternalLink, Zap } from 'lucide-react';
import { GridView } from '@/components/galaxy/flows/GridView';

interface ToolExecution {
  tool: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: {
    workflow?: any;
    agent?: any;
    nodes?: any[];
    edges?: any[];
    message?: string;
    previewUrl?: string;
  };
  error?: string;
}

interface ExecutionPanelProps {
  execution: ToolExecution;
  onApprove?: () => void;
  onReject?: () => void;
}

export function ExecutionPanel({ execution, onApprove, onReject }: ExecutionPanelProps) {
  const isWorkflowTool = execution.tool === 'create_workflow';
  const isAgentTool = execution.tool === 'create_agent';

  return (
    <Card className="p-6 mt-4 border-l-4 border-l-primary">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-muted flex items-center justify-center">
            <Zap className="size-5 text-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Tool Execution</h3>
            <p className="text-sm text-muted-foreground">{getToolDisplayName(execution.tool)}</p>
          </div>
        </div>

        {/* Status Badge */}
        <Badge
          variant={
            execution.status === 'completed'
              ? 'default'
              : execution.status === 'failed'
                ? 'destructive'
                : execution.status === 'running'
                  ? 'secondary'
                  : 'outline'
          }
          className="flex items-center gap-2"
        >
          {execution.status === 'running' && <Loader2 className="size-3 animate-spin" />}
          {execution.status === 'completed' && <Check className="size-3" />}
          {execution.status === 'failed' && <X className="size-3" />}
          {execution.status.charAt(0).toUpperCase() + execution.status.slice(1)}
        </Badge>
      </div>

      {/* Content Based on Tool Type */}
      {execution.status === 'completed' && execution.result && (
        <div className="space-y-4">
          {/* Workflow Preview with GridView */}
          {isWorkflowTool && execution.result.workflow && (
            <div className="rounded-lg border border-border overflow-hidden">
              <div className="bg-muted p-3 border-b border-border">
                <h4 className="font-medium text-sm">Workflow Preview</h4>
                <p className="text-xs text-muted-foreground">{execution.result.workflow.name}</p>
              </div>
              <div className="h-[300px] bg-background">
                <GridView
                  workflows={[
                    {
                      id: execution.result.workflow.id,
                      name: execution.result.workflow.name,
                      status: 'idle' as const,
                      nodes: execution.result.nodes || [],
                      edges: execution.result.edges || [],
                    } as any,
                  ]}
                />
              </div>
            </div>
          )}

          {/* Agent Preview */}
          {isAgentTool && execution.result.agent && (
            <div className="rounded-lg border border-border p-4">
              <div className="flex items-start gap-3">
                <div className="size-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <Zap className="size-6 text-foreground" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{execution.result.agent.name}</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {execution.result.agent.description || 'No description provided'}
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-1 rounded-full bg-muted">
                      {execution.result.agent.type}
                    </span>
                    <span className="px-2 py-1 rounded-full bg-muted">
                      {execution.result.agent.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Result Message */}
          {execution.result.message && (
            <p className="text-sm text-muted-foreground">{execution.result.message}</p>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            {execution.result.previewUrl && (
              <Button
                size="sm"
                variant="default"
                onClick={() => {
                  window.location.href = execution.result!.previewUrl!;
                }}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Full Details
              </Button>
            )}

            {onApprove && (
              <Button size="sm" variant="outline" onClick={onApprove}>
                <Check className="h-4 w-4 mr-2" />
                Approve
              </Button>
            )}

            {onReject && (
              <Button size="sm" variant="ghost" onClick={onReject}>
                <X className="h-4 w-4 mr-2" />
                Reject
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {execution.status === 'failed' && execution.error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-sm text-destructive">
          {execution.error}
        </div>
      )}

      {/* Loading State */}
      {execution.status === 'running' && (
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin mr-3" />
          <span>Executing tool...</span>
        </div>
      )}
    </Card>
  );
}

/**
 * Get display name for tool
 */
function getToolDisplayName(tool: string): string {
  const toolNames: Record<string, string> = {
    create_agent: 'Creating AI Agent',
    create_workflow: 'Creating Workflow',
    search_data: 'Searching Data',
    analyze_metrics: 'Analyzing Metrics',
  };

  return toolNames[tool] || tool;
}
