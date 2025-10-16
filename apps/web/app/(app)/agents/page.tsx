'use client';

import { PageHeader } from '@/components/layout/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { EmptyState } from '@/components/shared/empty-state';
import { mockAgents } from '@/lib/fixtures';
import { formatRelativeTime } from '@/lib/utils';
import { colors } from '@/lib/design-tokens';
import { Bot, Play, Pause, Settings, Plus } from 'lucide-react';
import Link from 'next/link';
import type { AgentType } from '@/lib/types';

const getAgentColor = (type: AgentType): string => {
  return colors.agent[type] || colors.primary['500'];
};

export default function AgentsPage() {
  const agents = mockAgents;

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Agents"
        description="Manage and monitor your autonomous AI agents"
      >
        <Link href="/agents/new">
          <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            Create Agent
          </button>
        </Link>
      </PageHeader>

      {agents.length === 0 ? (
        <EmptyState
          icon={Bot}
          title="No agents yet"
          description="Create your first AI agent to start automating tasks"
          action={{
            label: 'Create Agent',
            onClick: () => console.log('Create agent'),
          }}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <Link
              key={agent.id}
              href={`/agents/${agent.id}`}
              className="card p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${getAgentColor(agent.type)}20`, color: getAgentColor(agent.type) }}
                  >
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {agent.name}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {agent.type}
                    </p>
                  </div>
                </div>
                <StatusBadge status={agent.status} />
              </div>

              <p className="mt-4 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
                {agent.description}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-4 border-t pt-4">
                <div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">Success Rate</p>
                  <p className="mt-1 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    {Math.round(agent.metrics.performance.successRate)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">Total Runs</p>
                  <p className="mt-1 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    {agent.metrics.totalRuns.toLocaleString()}
                  </p>
                </div>
              </div>

              {agent.lastRunAt && (
                <p className="mt-4 text-xs text-neutral-600 dark:text-neutral-400">
                  Last run {formatRelativeTime(agent.lastRunAt)}
                </p>
              )}

              <div className="mt-4 flex gap-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('Toggle agent');
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-md border hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  {agent.status === 'running' ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('Configure agent');
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-md border hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
