/**
 * Grid View - Make.com style isometric workflow overview
 *
 * Shows all workflows in a beautiful isometric grid with mini node previews
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard } from '@/src/components/kibo-ui/credit-card';
import { AlertCircle, Activity, Clock, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Workflow {
  id: string;
  name: string;
  folder?: string;
  nodes: MiniNode[];
  edges: MiniEdge[];
  hasErrors: boolean;
  executionCount: number;
  lastRun?: string;
  status: 'idle' | 'running' | 'success' | 'error';
}

interface MiniNode {
  id: string;
  type: 'start' | 'action' | 'condition' | 'integration' | 'end';
  x: number;
  y: number;
}

interface MiniEdge {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface GridViewProps {
  workflows: Workflow[];
  onWorkflowClick?: (workflowId: string) => void;
}

const NODE_COLORS = {
  start: '#8B5CF6', // Purple
  action: '#3B82F6', // Blue
  condition: '#F59E0B', // Amber
  integration: '#10B981', // Green
  end: '#10B981', // Emerald
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, rotateX: 10 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20,
    },
  },
};

export function GridView({ workflows, onWorkflowClick }: GridViewProps) {
  return (
    <motion.div
      className="p-8 bg-gradient-to-br from-background via-muted/20 to-background"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {workflows.map((workflow, index) => (
          <WorkflowGridCard
            key={workflow.id}
            workflow={workflow}
            delay={index * 0.1}
            onClick={() => onWorkflowClick?.(workflow.id)}
          />
        ))}
      </div>
    </motion.div>
  );
}

interface WorkflowGridCardProps {
  workflow: Workflow;
  delay: number;
  onClick?: () => void;
}

function WorkflowGridCard({ workflow, delay, onClick }: WorkflowGridCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      className="group perspective-1000 cursor-pointer"
      onClick={onClick}
    >
      <CreditCard className="relative bg-background dark:bg-neutral-900 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
        {/* Mini node network visualization */}
        <div className="h-48 p-4 bg-muted/30 relative">
          <MiniNodeNetwork
            nodes={workflow.nodes}
            edges={workflow.edges}
            status={workflow.status}
          />

          {/* Error indicator overlay */}
          {workflow.hasErrors && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-4 right-4 size-10 rounded-full bg-red-500 flex items-center justify-center shadow-lg"
            >
              <AlertCircle className="size-6 text-white" />
            </motion.div>
          )}
        </div>

        {/* Workflow info */}
        <div className="p-4 border-t">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">{workflow.name}</h3>
              {workflow.folder && (
                <p className="text-xs text-muted-foreground truncate">{workflow.folder}</p>
              )}
            </div>

            {/* Status indicator */}
            <div className={cn(
              "size-3 rounded-full shrink-0 ml-2",
              workflow.status === 'running' && 'bg-blue-500 animate-pulse',
              workflow.status === 'success' && 'bg-green-500',
              workflow.status === 'error' && 'bg-red-500',
              workflow.status === 'idle' && 'bg-gray-400'
            )} />
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Activity className="size-3" />
              <span>{workflow.executionCount} runs</span>
            </div>
            {workflow.lastRun && (
              <div className="flex items-center gap-1">
                <Clock className="size-3" />
                <span>{workflow.lastRun}</span>
              </div>
            )}
          </div>

          {/* Hover action */}
          <div className="mt-3 pt-3 border-t opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2 text-xs text-primary">
              <Play className="size-3" />
              <span>Open workflow</span>
            </div>
          </div>
        </div>
      </CreditCard>
    </motion.div>
  );
}

interface MiniNodeNetworkProps {
  nodes: MiniNode[];
  edges: MiniEdge[];
  status: Workflow['status'];
}

function MiniNodeNetwork({ nodes, edges, status }: MiniNodeNetworkProps) {
  // Scale factor for mini visualization
  const scale = 0.1;

  return (
    <svg viewBox="0 0 200 150" className="w-full h-full">
      {/* Connections */}
      {edges.map((edge) => (
        <motion.line
          key={edge.id}
          x1={edge.x1 * scale}
          y1={edge.y1 * scale}
          x2={edge.x2 * scale}
          y2={edge.y2 * scale}
          stroke="rgba(139, 92, 246, 0.3)"
          strokeWidth={1.5}
          strokeDasharray="2,2"
          initial={{ pathLength: 0 }}
          animate={{
            pathLength: 1,
            stroke: status === 'running'
              ? 'rgba(59, 130, 246, 0.5)'
              : 'rgba(139, 92, 246, 0.3)',
          }}
          transition={{
            pathLength: { duration: 1, delay: 0.2 },
            stroke: { duration: 0.3 }
          }}
        />
      ))}

      {/* Nodes */}
      {nodes.map((node, index) => (
        <motion.g key={node.id}>
          {/* Node circle */}
          <motion.circle
            cx={node.x * scale}
            cy={node.y * scale}
            r={5}
            fill={NODE_COLORS[node.type]}
            className="drop-shadow-md"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: index * 0.1,
              type: 'spring',
              stiffness: 300,
            }}
          />

          {/* Pulse effect for running status */}
          {status === 'running' && (
            <motion.circle
              cx={node.x * scale}
              cy={node.y * scale}
              r={5}
              fill="none"
              stroke={NODE_COLORS[node.type]}
              strokeWidth={1}
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{
                scale: 2,
                opacity: 0,
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
          )}
        </motion.g>
      ))}
    </svg>
  );
}

// Example mock data generator
export function generateMockWorkflows(): Workflow[] {
  return [
    {
      id: '1',
      name: 'Lead Enrichment Pipeline',
      folder: 'Sales',
      nodes: [
        { id: '1', type: 'start', x: 100, y: 300 },
        { id: '2', type: 'action', x: 400, y: 300 },
        { id: '3', type: 'condition', x: 700, y: 300 },
        { id: '4', type: 'integration', x: 1000, y: 200 },
        { id: '5', type: 'end', x: 1300, y: 300 },
      ],
      edges: [
        { id: 'e1', x1: 100, y1: 300, x2: 400, y2: 300 },
        { id: 'e2', x1: 400, y1: 300, x2: 700, y2: 300 },
        { id: 'e3', x1: 700, y1: 300, x2: 1000, y2: 200 },
        { id: 'e4', x1: 1000, y1: 200, x2: 1300, y2: 300 },
      ],
      hasErrors: false,
      executionCount: 1247,
      lastRun: '2h ago',
      status: 'success',
    },
    {
      id: '2',
      name: 'Email Campaign Automation',
      folder: 'Marketing',
      nodes: [
        { id: '1', type: 'start', x: 100, y: 300 },
        { id: '2', type: 'action', x: 400, y: 300 },
        { id: '3', type: 'integration', x: 700, y: 300 },
        { id: '4', type: 'end', x: 1000, y: 300 },
      ],
      edges: [
        { id: 'e1', x1: 100, y1: 300, x2: 400, y2: 300 },
        { id: 'e2', x1: 400, y1: 300, x2: 700, y2: 300 },
        { id: 'e3', x1: 700, y1: 300, x2: 1000, y2: 300 },
      ],
      hasErrors: false,
      executionCount: 892,
      lastRun: '1d ago',
      status: 'idle',
    },
    {
      id: '3',
      name: 'Customer Onboarding',
      folder: 'Support',
      nodes: [
        { id: '1', type: 'start', x: 100, y: 300 },
        { id: '2', type: 'action', x: 400, y: 300 },
        { id: '3', type: 'condition', x: 700, y: 300 },
        { id: '4', type: 'action', x: 1000, y: 400 },
        { id: '5', type: 'integration', x: 1300, y: 300 },
        { id: '6', type: 'end', x: 1600, y: 300 },
      ],
      edges: [
        { id: 'e1', x1: 100, y1: 300, x2: 400, y2: 300 },
        { id: 'e2', x1: 400, y1: 300, x2: 700, y2: 300 },
        { id: 'e3', x1: 700, y1: 300, x2: 1000, y2: 400 },
        { id: 'e4', x1: 1000, y1: 400, x2: 1300, y2: 300 },
        { id: 'e5', x1: 1300, y1: 300, x2: 1600, y2: 300 },
      ],
      hasErrors: true,
      executionCount: 456,
      lastRun: '5m ago',
      status: 'error',
    },
    {
      id: '4',
      name: 'Data Sync & Backup',
      folder: 'Operations',
      nodes: [
        { id: '1', type: 'start', x: 100, y: 300 },
        { id: '2', type: 'integration', x: 400, y: 300 },
        { id: '3', type: 'action', x: 700, y: 300 },
        { id: '4', type: 'end', x: 1000, y: 300 },
      ],
      edges: [
        { id: 'e1', x1: 100, y1: 300, x2: 400, y2: 300 },
        { id: 'e2', x1: 400, y1: 300, x2: 700, y2: 300 },
        { id: 'e3', x1: 700, y1: 300, x2: 1000, y2: 300 },
      ],
      hasErrors: false,
      executionCount: 3421,
      lastRun: '10m ago',
      status: 'running',
    },
  ];
}

