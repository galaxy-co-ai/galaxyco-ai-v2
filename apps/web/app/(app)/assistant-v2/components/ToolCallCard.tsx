'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Clock, Loader2, XCircle, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { getToolDisplayName } from '@/lib/ai/assistant/tool-utils';

interface ToolInvocation {
  toolCallId: string;
  toolName: string;
  args: any;
  result?: any;
  state: 'pending' | 'running' | 'completed' | 'failed';
}

interface ToolCallCardProps {
  tool: ToolInvocation;
}

export function ToolCallCard({ tool }: ToolCallCardProps) {
  const statusConfig = {
    pending: {
      icon: Clock,
      color: 'text-muted-foreground',
      bg: 'bg-muted',
      border: 'border-muted',
    },
    running: {
      icon: Loader2,
      color: 'text-primary',
      bg: 'bg-primary/10',
      border: 'border-primary/20',
      spin: true,
    },
    completed: {
      icon: CheckCircle,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-950/20',
      border: 'border-emerald-200 dark:border-emerald-800',
    },
    failed: {
      icon: XCircle,
      color: 'text-destructive',
      bg: 'bg-destructive/10',
      border: 'border-destructive/20',
    },
  };

  const config = statusConfig[tool.state];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={cn('mt-4 p-4 rounded-xl border-2 transition-all', config.bg, config.border)}
    >
      <div className="flex items-start gap-3">
        {/* Status icon */}
        <div className={cn('mt-0.5', config.color)}>
          <Icon className={cn('size-5', 'spin' in config && config.spin && 'animate-spin')} />
        </div>

        {/* Tool info */}
        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm">{getToolDisplayName(tool.toolName)}</span>
            <Badge variant="outline" className="text-xs">
              {tool.state}
            </Badge>
          </div>

          {/* Parameters (collapsed for now) */}
          {tool.args && Object.keys(tool.args).length > 0 && (
            <div className="text-xs text-muted-foreground">
              <details className="cursor-pointer">
                <summary className="hover:text-foreground">View parameters</summary>
                <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                  {JSON.stringify(tool.args, null, 2)}
                </pre>
              </details>
            </div>
          )}

          {/* Result */}
          {tool.state === 'completed' && tool.result && (
            <div className="space-y-2">
              {/* Agent created */}
              {tool.toolName === 'createAgent' && tool.result.agent && (
                <Card className="p-3 bg-background border">
                  <div className="flex items-start gap-3">
                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-lg">🤖</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{tool.result.agent.name}</h4>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {tool.result.agent.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {tool.result.agent.status}
                        </Badge>
                      </div>
                      {tool.result.url && (
                        <Button asChild size="sm" variant="outline" className="h-7">
                          <Link href={tool.result.url}>
                            <ExternalLink className="size-3 mr-1" />
                            Configure Agent
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              )}

              {/* Workflow created */}
              {tool.toolName === 'createWorkflow' && tool.result.workflow && (
                <Card className="p-3 bg-background border">
                  <div className="flex items-start gap-3">
                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-lg">⚡</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{tool.result.workflow.name}</h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        {tool.result.workflow.nodeCount || 0} nodes
                      </p>
                      {tool.result.url && (
                        <Button asChild size="sm" variant="outline" className="h-7">
                          <Link href={tool.result.url}>
                            <ExternalLink className="size-3 mr-1" />
                            Open in Studio
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              )}

              {/* Customer search results */}
              {tool.toolName === 'searchCustomers' && tool.result.customers && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Found {tool.result.total} customer(s):</p>
                  {tool.result.customers.slice(0, 3).map((customer: any) => (
                    <Card key={customer.id} className="p-2 bg-background border text-sm">
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {customer.email}
                        {customer.company && ` • ${customer.company}`}
                      </div>
                    </Card>
                  ))}
                  {tool.result.total > 3 && (
                    <p className="text-xs text-muted-foreground">
                      +{tool.result.total - 3} more results
                    </p>
                  )}
                </div>
              )}

              {/* Sales analytics */}
              {tool.toolName === 'analyzeSales' && tool.result.value && (
                <Card className="p-3 bg-background border">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Value</p>
                      <p className="text-xl font-bold">${tool.result.value.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Change</p>
                      <p className="text-xl font-bold text-emerald-600">{tool.result.change}</p>
                    </div>
                  </div>
                  {tool.result.insights && tool.result.insights.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-medium mb-1">Insights:</p>
                      <ul className="text-xs space-y-1">
                        {tool.result.insights.map((insight: string, i: number) => (
                          <li key={i} className="text-muted-foreground">
                            • {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card>
              )}

              {/* Agents list */}
              {tool.toolName === 'listAgents' && tool.result.agents && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Your agents ({tool.result.total}):</p>
                  {tool.result.agents.map((agent: any) => (
                    <Card key={agent.id} className="p-2 bg-background border text-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{agent.name}</div>
                          <div className="text-xs text-muted-foreground">{agent.description}</div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {agent.status}
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* Generic success message */}
              {tool.result.message && (
                <p className="text-sm text-muted-foreground">{tool.result.message}</p>
              )}
            </div>
          )}

          {/* Error */}
          {tool.state === 'failed' && (
            <div className="text-sm text-destructive">
              <strong>Error:</strong> {tool.result?.error || 'Tool execution failed'}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
