/**
 * Enhanced Agent Card using Kibo UI Credit Card Component
 *
 * Beautiful card design with Kibo UI's advanced interactions
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard } from '@/src/components/kibo-ui/credit-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bot, Play, Pause, Settings, TrendingUp, Clock, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Agent {
  id: string;
  name: string;
  description: string;
  icon?: string;
  status?: 'active' | 'draft' | 'paused' | 'archived';
  stats?: {
    successRate?: number;
    timeSaved?: string;
    usageCount?: number;
    lastRun?: string;
  };
  integrations?: string[];
  type?: string;
}

interface AgentCardKiboProps {
  agent: Agent;
  onView?: (agent: Agent) => void;
  onToggle?: (agent: Agent) => void;
  onConfigure?: (agent: Agent) => void;
}

const statusConfig = {
  active: {
    color: 'bg-gradient-to-r from-green-500 to-emerald-600',
    text: 'text-white',
    icon: Play,
  },
  draft: {
    color: 'bg-gradient-to-r from-gray-400 to-gray-500',
    text: 'text-white',
    icon: Pause,
  },
  paused: {
    color: 'bg-gradient-to-r from-amber-400 to-orange-500',
    text: 'text-white',
    icon: Pause,
  },
  archived: {
    color: 'bg-gradient-to-r from-gray-300 to-gray-400',
    text: 'text-gray-700',
    icon: Pause,
  },
};

export function AgentCardKibo({ agent, onView, onToggle, onConfigure }: AgentCardKiboProps) {
  const config = statusConfig[agent.status || 'draft'];
  const StatusIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="h-full"
    >
      <CreditCard
        className="h-full cursor-pointer overflow-hidden bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950 border-2 border-neutral-200 dark:border-neutral-800 hover:border-purple-400 dark:hover:border-purple-600 transition-colors"
        onClick={() => onView?.(agent)}
      >
        {/* Status Bar */}
        <div className={cn('absolute top-0 left-0 right-0 h-1', config.color)} />

        {/* Card Content */}
        <div className="relative p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            {/* Icon */}
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 text-white text-2xl shadow-lg">
              {agent.icon || <Bot className="h-7 w-7" />}
            </div>

            {/* Title & Status */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground truncate mb-1">{agent.name}</h3>
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium',
                    config.color,
                    config.text,
                  )}
                >
                  <StatusIcon className="h-3 w-3" />
                  <span className="capitalize">{agent.status}</span>
                </div>
                {agent.type && (
                  <Badge variant="outline" className="text-xs">
                    {agent.type}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-4 flex-1">
            {agent.description}
          </p>

          {/* Stats Grid */}
          {agent.stats && (
            <div className="grid grid-cols-3 gap-3 mb-4">
              {agent.stats.successRate !== undefined && (
                <div className="text-center p-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-center gap-1 text-green-600 dark:text-green-400 mb-1">
                    <TrendingUp className="h-3 w-3" />
                  </div>
                  <div className="text-lg font-bold text-green-700 dark:text-green-300">
                    {Math.round(agent.stats.successRate)}%
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-500">Success</div>
                </div>
              )}

              {agent.stats.usageCount !== undefined && (
                <div className="text-center p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-center gap-1 text-blue-600 dark:text-blue-400 mb-1">
                    <Zap className="h-3 w-3" />
                  </div>
                  <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
                    {agent.stats.usageCount}
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-500">Runs</div>
                </div>
              )}

              {agent.stats.timeSaved && (
                <div className="text-center p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center justify-center gap-1 text-purple-600 dark:text-purple-400 mb-1">
                    <Clock className="h-3 w-3" />
                  </div>
                  <div className="text-lg font-bold text-purple-700 dark:text-purple-300">
                    {agent.stats.timeSaved}
                  </div>
                  <div className="text-xs text-purple-600 dark:text-purple-500">Saved</div>
                </div>
              )}
            </div>
          )}

          {/* Integrations */}
          {agent.integrations && agent.integrations.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {agent.integrations.slice(0, 3).map((integration) => (
                <Badge key={integration} variant="secondary" className="text-xs">
                  {integration}
                </Badge>
              ))}
              {agent.integrations.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{agent.integrations.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 mt-auto pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <Button
              variant="default"
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                onView?.(agent);
              }}
            >
              View Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onConfigure?.(agent);
              }}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CreditCard>
    </motion.div>
  );
}
