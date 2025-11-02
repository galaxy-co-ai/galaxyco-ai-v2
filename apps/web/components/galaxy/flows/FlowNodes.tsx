/**
 * Custom Flow Nodes - Enhanced node types with Framer Motion animations
 *
 * Beautiful, animated node components for the Visual Flow Builder
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Play, CheckCircle, Zap, GitBranch, Plug, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FlowNodeData {
  label: string;
  type: 'start' | 'action' | 'condition' | 'integration' | 'end';
  description?: string;
  integration?: string;
  status?: 'idle' | 'running' | 'success' | 'error';
  config?: Record<string, any>;
}

// Animation variants
const nodeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10,
    },
  },
  tap: { scale: 0.95 },
};

const pulseVariants = {
  pulse: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * Get node configuration based on type
 */
function getNodeConfig(type: FlowNodeData['type'], status?: FlowNodeData['status']) {
  const baseConfig = {
    start: {
      icon: Play,
      gradient: 'from-purple-500 to-purple-700',
      textColor: 'text-white',
      borderColor: 'border-purple-500',
    },
    action: {
      icon: Zap,
      gradient: 'from-blue-500 to-blue-600',
      textColor: 'text-white',
      borderColor: 'border-blue-500',
    },
    condition: {
      icon: GitBranch,
      gradient: 'from-amber-400 to-amber-600',
      textColor: 'text-white',
      borderColor: 'border-amber-500',
    },
    integration: {
      icon: Plug,
      gradient: 'from-green-500 to-green-600',
      textColor: 'text-white',
      borderColor: 'border-green-500',
    },
    end: {
      icon: CheckCircle,
      gradient: 'from-emerald-500 to-emerald-600',
      textColor: 'text-white',
      borderColor: 'border-emerald-500',
    },
  };

  const config = baseConfig[type];

  // Override for status
  if (status === 'error') {
    return {
      ...config,
      gradient: 'from-red-500 to-red-600',
      borderColor: 'border-red-500',
    };
  }

  return config;
}

/**
 * Get status icon
 */
function StatusIcon({ status }: { status?: FlowNodeData['status'] }) {
  if (!status || status === 'idle') return null;

  const icons = {
    running: <Loader2 className="h-3 w-3 animate-spin" />,
    success: <CheckCircle className="h-3 w-3" />,
    error: <AlertCircle className="h-3 w-3" />,
  };

  const colors = {
    running: 'bg-blue-500',
    success: 'bg-green-500',
    error: 'bg-red-500',
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={cn(
        'absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-white shadow-lg',
        colors[status],
      )}
    >
      {icons[status]}
    </motion.div>
  );
}

/**
 * Custom Node Component
 */
export function CustomFlowNode({ data, selected }: NodeProps) {
  const { label, type, description, integration, status } = data as unknown as FlowNodeData;
  const config = getNodeConfig(type, status);
  const Icon = config.icon;

  return (
    <motion.div
      variants={nodeVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      className="relative"
    >
      {/* Input Handle */}
      {type !== 'start' && (
        <Handle
          type="target"
          position={Position.Left}
          className="!h-3 !w-3 !border-2 !border-white !bg-neutral-400"
        />
      )}

      {/* Node Content */}
      <div
        className={cn(
          'min-w-[200px] rounded-xl border-2 bg-gradient-to-br p-4 shadow-lg transition-shadow',
          config.gradient,
          config.borderColor,
          selected ? 'ring-4 ring-purple-400 ring-opacity-50' : '',
          'hover:shadow-xl',
        )}
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/20 backdrop-blur">
            <Icon className={cn('h-5 w-5', config.textColor)} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className={cn('text-sm font-semibold', config.textColor)}>{label}</div>
            {integration && (
              <div className={cn('mt-1 text-xs opacity-90', config.textColor)}>{integration}</div>
            )}
            {description && (
              <div className={cn('mt-1 text-xs opacity-75', config.textColor)}>{description}</div>
            )}
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      <StatusIcon status={status} />

      {/* Output Handle */}
      {type !== 'end' && (
        <Handle
          type="source"
          position={Position.Right}
          className="!h-3 !w-3 !border-2 !border-white !bg-neutral-400"
        />
      )}

      {/* Pulse effect for running nodes */}
      {status === 'running' && (
        <motion.div
          variants={pulseVariants}
          animate="pulse"
          className="absolute inset-0 rounded-xl border-2 border-blue-400"
          style={{ pointerEvents: 'none' }}
        />
      )}
    </motion.div>
  );
}

/**
 * Node Types Registry
 */
export const nodeTypes = {
  custom: CustomFlowNode,
};
