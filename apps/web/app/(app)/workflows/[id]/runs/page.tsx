'use client';

import { useParams } from 'next/navigation';
import { PageShell } from '@/components/templates/page-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CheckCircle2, XCircle, Clock, Search, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface WorkflowRun {
  id: string;
  status: 'success' | 'error' | 'running';
  startTime: string;
  duration: number;
  trigger: string;
  stepsCompleted: number;
  totalSteps: number;
}

const mockRuns: WorkflowRun[] = [
  {
    id: 'run_abc123',
    status: 'success',
    startTime: '2025-10-18 15:42:10',
    duration: 3200,
    trigger: 'webhook',
    stepsCompleted: 3,
    totalSteps: 3,
  },
  {
    id: 'run_def456',
    status: 'error',
    startTime: '2025-10-18 14:28:15',
    duration: 1800,
    trigger: 'manual',
    stepsCompleted: 2,
    totalSteps: 3,
  },
  {
    id: 'run_ghi789',
    status: 'success',
    startTime: '2025-10-18 13:15:42',
    duration: 2950,
    trigger: 'schedule',
    stepsCompleted: 3,
    totalSteps: 3,
  },
  {
    id: 'run_jkl012',
    status: 'running',
    startTime: '2025-10-18 15:50:00',
    duration: 0,
    trigger: 'webhook',
    stepsCompleted: 1,
    totalSteps: 3,
  },
];

export default function WorkflowRunsPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id || '1';

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredRuns = mockRuns.filter((run) => {
    const matchesSearch = run.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || run.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <PageShell
      title="Workflow Runs"
      subtitle="View execution history and run details"
      breadcrumbs={[
        { label: 'Workflows', href: '/workflows' },
        { label: 'Lead Enrichment', href: `/workflows/${id}` },
        { label: 'Runs' },
      ]}
    >
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search runs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="error">Error</SelectItem>
            <SelectItem value="running">Running</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Runs Table */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background-subtle">
              <tr>
                <th className="text-left p-4 font-medium text-sm">Run ID</th>
                <th className="text-left p-4 font-medium text-sm">Status</th>
                <th className="text-left p-4 font-medium text-sm">Start Time</th>
                <th className="text-left p-4 font-medium text-sm">Duration</th>
                <th className="text-left p-4 font-medium text-sm">Trigger</th>
                <th className="text-left p-4 font-medium text-sm">Progress</th>
                <th className="text-left p-4 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRuns.map((run) => {
                const StatusIcon =
                  run.status === 'success'
                    ? CheckCircle2
                    : run.status === 'error'
                      ? XCircle
                      : Clock;

                return (
                  <tr
                    key={run.id}
                    className="border-t border-border hover:bg-background-subtle transition-colors"
                  >
                    <td className="p-4 font-mono text-sm">{run.id}</td>
                    <td className="p-4">
                      <Badge
                        className={
                          run.status === 'success'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : run.status === 'error'
                              ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                        }
                      >
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {run.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm">{run.startTime}</td>
                    <td className="p-4 text-sm">
                      {run.status === 'running' ? '-' : `${run.duration}ms`}
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">{run.trigger}</Badge>
                    </td>
                    <td className="p-4 text-sm">
                      {run.stepsCompleted}/{run.totalSteps} steps
                    </td>
                    <td className="p-4">
                      <Button size="sm" variant="ghost">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredRuns.length === 0 && (
        <div className="rounded-lg border bg-card p-12 text-center mt-6">
          <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No runs found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}
    </PageShell>
  );
}
