'use client';

import { Card } from '@/components/ui/card';
import {
  LucideIcon,
  Mail,
  Filter,
  Database,
  Calendar,
  FileText,
  Sparkles,
  Send,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'filter' | 'action';
  label: string;
  icon: LucideIcon;
  position?: { x: number; y: number };
}

interface WorkflowVisualizerProps {
  nodes: WorkflowNode[];
  className?: string;
}

const nodeColors = {
  trigger: 'from-blue-500 to-blue-600',
  filter: 'from-yellow-500 to-yellow-600',
  action: 'from-purple-500 to-purple-600',
};

export function WorkflowVisualizer({ nodes, className }: WorkflowVisualizerProps) {
  return (
    <div className={cn('relative', className)}>
      <div className="h-full rounded-xl border bg-gradient-to-br from-background/95 via-background/80 to-background/95 relative overflow-hidden">
        {/* Dot Grid Background */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle, hsl(var(--muted-foreground)) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Workflow Nodes */}
        <div className="relative h-full flex items-center justify-center p-12">
          {/* SVG Connectors */}
          {nodes.length > 1 && (
            <svg
              className="absolute inset-0 pointer-events-none"
              style={{ width: '100%', height: '100%' }}
            >
              {nodes.map((node, idx) => {
                if (idx === nodes.length - 1) return null;
                return (
                  <line
                    key={idx}
                    x1={`${(idx / (nodes.length - 1)) * 80 + 10}%`}
                    y1="50%"
                    x2={`${((idx + 1) / (nodes.length - 1)) * 80 + 10}%`}
                    y2="50%"
                    stroke="#6366f1"
                    strokeWidth="2"
                    opacity="0.4"
                    strokeDasharray="5,5"
                  />
                );
              })}
            </svg>
          )}

          {/* Node Cards */}
          <div className="relative flex items-center gap-12">
            {nodes.map((node, idx) => (
              <div key={node.id} className="flex flex-col items-center gap-3">
                <div className="relative">
                  <div
                    className={cn(
                      'h-20 w-20 rounded-2xl bg-gradient-to-br shadow-xl flex items-center justify-center',
                      'transform hover:scale-105 transition-transform',
                      nodeColors[node.type],
                    )}
                  >
                    <node.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-14 h-2 bg-gradient-to-br from-purple-500/20 to-purple-500/10 blur-sm rounded-full" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">{node.label}</p>
                  <p className="text-xs text-muted-foreground capitalize">{node.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Example usage component
export function WorkflowExamples() {
  const emailWorkflow: WorkflowNode[] = [
    { id: 'trigger', type: 'trigger', label: 'New Email', icon: Mail },
    { id: 'filter', type: 'filter', label: 'Filter Priority', icon: Filter },
    { id: 'crm', type: 'action', label: 'Add to CRM', icon: Database },
  ];

  const meetingWorkflow: WorkflowNode[] = [
    { id: 'trigger', type: 'trigger', label: 'Meeting Ends', icon: Calendar },
    { id: 'transcribe', type: 'action', label: 'Transcribe', icon: FileText },
    { id: 'summarize', type: 'action', label: 'AI Summary', icon: Sparkles },
  ];

  const leadWorkflow: WorkflowNode[] = [
    { id: 'trigger', type: 'trigger', label: 'New Lead', icon: Users },
    { id: 'score', type: 'action', label: 'AI Score', icon: Sparkles },
    { id: 'notify', type: 'action', label: 'Notify Sales', icon: Send },
  ];

  return (
    <div className="space-y-6">
      <WorkflowVisualizer nodes={emailWorkflow} className="h-64" />
      <WorkflowVisualizer nodes={meetingWorkflow} className="h-64" />
      <WorkflowVisualizer nodes={leadWorkflow} className="h-64" />
    </div>
  );
}
