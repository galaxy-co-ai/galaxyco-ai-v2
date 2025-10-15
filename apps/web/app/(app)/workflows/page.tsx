'use client';

import { PageHeader } from '@/components/layout/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { mockWorkflows } from '@/lib/fixtures';
import { formatRelativeTime } from '@/lib/utils';
import { Network, Plus, ArrowRight } from 'lucide-react';

export default function WorkflowsPage() {
  const workflows = mockWorkflows;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workflows"
        description="Automate multi-step processes with AI-powered workflows"
      >
        <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Create Workflow
        </button>
      </PageHeader>

      {workflows.length === 0 ? (
        <EmptyState
          icon={Network}
          title="No workflows yet"
          description="Create your first workflow to chain multiple agents together"
          action={{
            label: 'Create Workflow',
            onClick: () => console.log('Create workflow'),
          }}
        />
      ) : (
        <div className="space-y-4">
          {workflows.map((workflow) => (
            <div key={workflow.id} className="card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    {workflow.name}
                  </h3>
                  <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                    {workflow.description}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-600 dark:bg-green-400" />
                  <span className="capitalize">{workflow.status}</span>
                </span>
              </div>

              {/* Steps */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {workflow.steps.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-2">
                    <div className="flex items-center gap-2 rounded-md border bg-neutral-50 px-3 py-2 dark:bg-neutral-900">
                      <div className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                        {step.name}
                      </div>
                      <div className="text-xs capitalize text-neutral-600 dark:text-neutral-400">
                        {step.type}
                      </div>
                    </div>
                    {index < workflow.steps.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-neutral-400" />
                    )}
                  </div>
                ))}
              </div>

              {/* Metrics */}
              <div className="mt-4 grid grid-cols-3 gap-4 border-t pt-4">
                <div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">Total Runs</p>
                  <p className="mt-1 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    {workflow.metrics.totalExecutions}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">Success Rate</p>
                  <p className="mt-1 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    {Math.round((workflow.metrics.successfulExecutions / workflow.metrics.totalExecutions) * 100)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">Last Run</p>
                  <p className="mt-1 text-sm text-neutral-900 dark:text-neutral-100">
                    {workflow.metrics.lastExecutedAt ? formatRelativeTime(workflow.metrics.lastExecutedAt) : 'Never'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
