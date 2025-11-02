'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ListPage } from '@/components/templates/list-page';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { formatRelativeTime } from '@/lib/utils';
import { Plus, ArrowRight } from 'lucide-react';
import { useWorkspace } from '@/contexts/workspace-context';
import { toast } from 'sonner';

interface Workflow {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  status: 'active' | 'draft' | 'paused' | 'archived';
  steps: Array<{
    id: string;
    type: string;
    name: string;
    config?: any;
  }>;
  metrics: {
    totalExecutions: number;
    successfulExecutions: number;
    failedExecutions: number;
    lastExecutedAt: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

export default function WorkflowsPage() {
  const router = useRouter();
  const { currentWorkspace } = useWorkspace();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  // Fetch workflows from API
  useEffect(() => {
    async function fetchWorkflows() {
      if (!currentWorkspace?.id) return;

      try {
        setIsLoading(true);
        const res = await fetch(`/api/workflows?workspaceId=${currentWorkspace.id}`);

        if (!res.ok) {
          throw new Error('Failed to fetch workflows');
        }

        const data = await res.json();
        setWorkflows(data.workflows || []);
      } catch (error) {
        console.error('Error fetching workflows:', error);
        toast.error('Failed to load workflows');
      } finally {
        setIsLoading(false);
      }
    }

    fetchWorkflows();
  }, [currentWorkspace?.id]);

  // Filter workflows
  const filteredWorkflows = workflows.filter((workflow) => {
    // Search filter
    const matchesSearch =
      searchQuery === '' ||
      workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const statusFilter = activeFilters.status || [];
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(workflow.status);

    return matchesSearch && matchesStatus;
  });

  const handleFilterChange = (filterId: string, values: string[]) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterId]: values,
    }));
  };

  const handleClearFilters = () => {
    setActiveFilters({});
    setSearchQuery('');
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <ListPage
      title="Workflows"
      subtitle="Automate multi-step processes with AI-powered workflows"
      breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Workflows' }]}
      searchQuery={searchQuery}
      searchPlaceholder="Search workflows..."
      onSearchChange={setSearchQuery}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      filters={[
        {
          id: 'status',
          label: 'Status',
          type: 'checkbox',
          options: [
            { value: 'active', label: 'Active' },
            { value: 'draft', label: 'Draft' },
            { value: 'paused', label: 'Paused' },
            { value: 'archived', label: 'Archived' },
          ],
        },
      ]}
      activeFilters={activeFilters}
      onFilterChange={handleFilterChange}
      onClearFilters={handleClearFilters}
      actions={
        <Button size="sm" onClick={() => router.push('/workflows/builder')}>
          <Plus className="mr-2 h-4 w-4" />
          Create Workflow
        </Button>
      }
      isEmpty={workflows.length === 0}
      emptyMessage="No workflows yet. Create your first workflow to chain multiple agents together."
      emptyAction={
        <Button onClick={() => router.push('/workflows/builder')}>
          <Plus className="mr-2 h-4 w-4" />
          Create Workflow
        </Button>
      }
    >
      {filteredWorkflows.length === 0 && workflows.length > 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No workflows match your search or filters</p>
          <Button variant="outline" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredWorkflows.map((workflow) => (
            <div key={workflow.id} className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{workflow.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{workflow.description}</p>
                </div>
                <Badge
                  variant={workflow.status === 'active' ? 'default' : 'secondary'}
                  className="gap-1.5"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  <span className="capitalize">{workflow.status}</span>
                </Badge>
              </div>

              {/* Steps */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {workflow.steps.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-2">
                    <div className="flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-2">
                      <div className="text-xs font-medium">{step.name}</div>
                      <div className="text-xs capitalize text-muted-foreground">{step.type}</div>
                    </div>
                    {index < workflow.steps.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                ))}
              </div>

              {/* Metrics */}
              <div className="mt-4 grid grid-cols-3 gap-4 border-t border-border pt-4">
                <div>
                  <p className="text-xs text-muted-foreground">Total Runs</p>
                  <p className="mt-1 text-lg font-semibold">{workflow.metrics.totalExecutions}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Success Rate</p>
                  <p className="mt-1 text-lg font-semibold">
                    {Math.round(
                      (workflow.metrics.successfulExecutions / workflow.metrics.totalExecutions) *
                        100,
                    )}
                    %
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Last Run</p>
                  <p className="mt-1 text-sm">
                    {workflow.metrics.lastExecutedAt
                      ? formatRelativeTime(workflow.metrics.lastExecutedAt)
                      : 'Never'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </ListPage>
  );
}
