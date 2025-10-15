'use client';

import { PageHeader } from '@/components/layout/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { mockAgents } from '@/lib/fixtures';
import { formatRelativeTime, formatShortDate } from '@/lib/utils';
import { Bot, Play, Pause, Settings, Activity, Clock, Target } from 'lucide-react';
import { notFound } from 'next/navigation';

export default function AgentDetailPage({ params }: { params: { id: string } }) {
  const agent = mockAgents.find((a) => a.id === params.id);

  if (!agent) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader title={agent.name} description={agent.description}>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <Settings className="h-4 w-4" />
            Configure
          </button>
          <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
            {agent.status === 'running' ? (
              <>
                <Pause className="h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Run
              </>
            )}
          </button>
        </div>
      </PageHeader>

      {/* Status and Metrics */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="card p-6">
          <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
            <Activity className="h-4 w-4" />
            Status
          </div>
          <div className="mt-2">
            <StatusBadge status={agent.status} />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
            <Target className="h-4 w-4" />
            Success Rate
          </div>
          <p className="mt-2 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            {Math.round(agent.metrics.performance.successRate)}%
          </p>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
            <Bot className="h-4 w-4" />
            Total Runs
          </div>
          <p className="mt-2 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            {agent.metrics.totalRuns.toLocaleString()}
          </p>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
            <Clock className="h-4 w-4" />
            Avg Runtime
          </div>
          <p className="mt-2 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            {Math.round(agent.metrics.averageRuntime)}s
          </p>
        </div>
      </div>

      {/* Configuration */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Configuration
        </h2>
        <div className="mt-4 space-y-3">
          <div>
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Type</p>
            <p className="mt-1 text-sm capitalize text-neutral-600 dark:text-neutral-400">{agent.type}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Schedule</p>
            <p className="mt-1 text-sm capitalize text-neutral-600 dark:text-neutral-400">{agent.config.schedule.type}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              Status
            </p>
            <p className="mt-1 text-sm capitalize text-neutral-600 dark:text-neutral-400">
              {agent.config.enabled ? 'Enabled' : 'Disabled'}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Recent Activity
        </h2>
        <div className="mt-4 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between border-b py-3 last:border-0">
              <div>
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Run #{agent.metrics.totalRuns - i}
                </p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  {formatShortDate(new Date(Date.now() - i * 3600000))}
                </p>
              </div>
              <StatusBadge status={i % 4 === 0 ? 'error' : 'running'} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
