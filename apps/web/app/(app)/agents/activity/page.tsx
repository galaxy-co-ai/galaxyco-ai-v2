'use client';

import { useState, useEffect } from 'react';
import { useWorkspace } from '@/contexts/workspace-context';
import { PageShell } from '@/components/templates/page-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Activity,
  Clock,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Search,
  Filter,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AgentExecution {
  id: string;
  agentId: string;
  agentName: string;
  status: 'success' | 'error' | 'running' | 'pending';
  input: any;
  output: any;
  error: string | null;
  startedAt: string;
  completedAt: string | null;
  durationMs: number | null;
  tokensUsed: number | null;
  createdAt: string;
}

interface ExecutionMetrics {
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  runningExecutions: number;
  avgDurationMs: number;
  totalTokens: number;
}

export default function AgentActivityPage() {
  const { currentWorkspace } = useWorkspace();
  const [executions, setExecutions] = useState<AgentExecution[]>([]);
  const [metrics, setMetrics] = useState<ExecutionMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExecution, setSelectedExecution] = useState<AgentExecution | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    async function fetchExecutions() {
      if (!currentWorkspace?.id) return;

      try {
        const params = new URLSearchParams({
          workspaceId: currentWorkspace.id,
          limit: '50',
        });

        if (selectedStatus !== 'all') {
          params.append('status', selectedStatus);
        }

        const res = await fetch(`/api/agents/executions?${params}`);
        if (!res.ok) throw new Error('Failed to fetch executions');

        const data = await res.json();
        setExecutions(data.executions);
        setMetrics(data.metrics);
      } catch (error) {
        console.error('Failed to fetch executions:', error);
        toast.error('Failed to load agent activity');
      } finally {
        setIsLoading(false);
      }
    }

    fetchExecutions();

    // Poll every 5 seconds for real-time updates
    intervalId = setInterval(fetchExecutions, 5000);

    return () => clearInterval(intervalId);
  }, [currentWorkspace?.id, selectedStatus]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'running':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'success' | 'destructive' | 'secondary'> = {
      success: 'success',
      error: 'destructive',
      running: 'default',
      pending: 'secondary',
    };

    return (
      <Badge variant={variants[status] || 'secondary'} className="capitalize">
        {status}
      </Badge>
    );
  };

  const filteredExecutions = executions.filter((execution) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        execution.agentName.toLowerCase().includes(query) ||
        execution.id.toLowerCase().includes(query)
      );
    }
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <PageShell
      title="Agent Activity"
      subtitle="Monitor real-time agent executions and performance"
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Agents', href: '/agents' },
        { label: 'Activity' },
      ]}
    >
      {/* Metrics Row */}
      {metrics && (
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <MetricCard label="Total Executions" value={metrics.totalExecutions} icon={Activity} />
          <MetricCard
            label="Success Rate"
            value={
              metrics.totalExecutions > 0
                ? `${Math.round((metrics.successfulExecutions / metrics.totalExecutions) * 100)}%`
                : '0%'
            }
            icon={CheckCircle2}
            trend={metrics.successfulExecutions > metrics.failedExecutions ? 'up' : 'down'}
          />
          <MetricCard
            label="Avg Duration"
            value={metrics.avgDurationMs ? `${(metrics.avgDurationMs / 1000).toFixed(2)}s` : '0s'}
            icon={Clock}
          />
          <MetricCard
            label="Total Tokens"
            value={metrics.totalTokens.toLocaleString()}
            icon={Activity}
          />
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by agent name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="running">Running</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Executions List */}
      <div className="space-y-4">
        {filteredExecutions.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <Activity className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No executions found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchQuery
                ? 'Try adjusting your search or filters'
                : 'Agent executions will appear here once they run'}
            </p>
          </div>
        ) : (
          filteredExecutions.map((execution) => (
            <div
              key={execution.id}
              className="rounded-lg border border-border bg-card p-6 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer"
              onClick={() => setSelectedExecution(execution)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(execution.status)}
                    <h3 className="font-semibold">{execution.agentName}</h3>
                    {getStatusBadge(execution.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">ID: {execution.id}</p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="text-muted-foreground">
                      Started{' '}
                      {formatDistanceToNow(new Date(execution.startedAt), {
                        addSuffix: true,
                      })}
                    </span>
                    {execution.durationMs && (
                      <span>Duration: {(execution.durationMs / 1000).toFixed(2)}s</span>
                    )}
                    {execution.tokensUsed && (
                      <span>Tokens: {execution.tokensUsed.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Show error if present */}
              {execution.error && (
                <div className="mt-4 rounded-md bg-destructive/10 p-3 border border-destructive/20">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-destructive">Error</p>
                      <p className="text-sm text-destructive/80 mt-1">{execution.error}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </PageShell>
  );
}

function MetricCard({
  label,
  value,
  icon: Icon,
  trend,
}: {
  label: string;
  value: string | number;
  icon: any;
  trend?: 'up' | 'down';
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold">{value}</span>
        {trend && (
          <span className={`text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </div>
  );
}
