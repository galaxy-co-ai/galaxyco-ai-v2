/**
 * GalaxyCo.ai MessageBubble
 * Individual message component with markdown support
 * November 2, 2025
 */

'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Copy, Check, RotateCw, Edit, User, Sparkles, Zap, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import Link from 'next/link';

/**
 * Get display name for tool
 */
function getToolDisplayName(tool: string): string {
  const toolNames: Record<string, string> = {
    create_agent: 'Agent Created',
    create_workflow: 'Workflow Created',
    search_data: 'Search Results',
    analyze_metrics: 'Metrics Analysis',
  };
  return toolNames[tool] || tool;
}

interface ToolResult {
  tool: string;
  result: any;
}

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  onCopy?: () => void;
  onRegenerate?: () => void;
  onEdit?: () => void;
  toolResult?: ToolResult;
}

export function MessageBubble({
  role,
  content,
  timestamp,
  onCopy,
  onRegenerate,
  onEdit,
  toolResult,
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
    onCopy?.();
  };

  const isUser = role === 'user';

  return (
    <div className={cn('group flex gap-4', isUser ? 'justify-end' : 'justify-start')}>
      {/* Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 size-8 rounded-full bg-muted flex items-center justify-center">
          <Sparkles className="size-4 text-foreground" />
        </div>
      )}

      {/* Message Content */}
      <div
        className={cn('flex flex-col gap-2', isUser ? 'items-end' : 'items-start', 'max-w-[80%]')}
      >
        {/* Message Bubble */}
        <div
          className={cn(
            'rounded-2xl px-6 py-3',
            isUser ? 'bg-primary text-primary-foreground' : 'bg-muted/30 text-foreground',
            'shadow-sm',
          )}
        >
          {isUser ? (
            <p className="text-base leading-relaxed whitespace-pre-wrap">{content}</p>
          ) : (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown
                components={{
                  p: ({ children }) => (
                    <p className="text-base leading-relaxed mb-4 last:mb-0">{children}</p>
                  ),
                  code: ({ children, className }) => {
                    const isInline = !className;
                    return isInline ? (
                      <code className="px-1.5 py-0.5 rounded bg-muted text-sm font-mono">
                        {children}
                      </code>
                    ) : (
                      <code className="block px-4 py-3 rounded-lg bg-muted text-sm font-mono overflow-x-auto">
                        {children}
                      </code>
                    );
                  },
                  ul: ({ children }) => <ul className="list-disc pl-6 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-6 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="text-base">{children}</li>,
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          )}

          {/* Tool Result Display */}
          {toolResult && (
            <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm">{getToolDisplayName(toolResult.tool)}</span>
              </div>

              {/* Workflow Preview */}
              {toolResult.tool === 'create_workflow' && toolResult.result.workflow && (
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-background rounded-lg border border-border">
                    <div className="size-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <Zap className="size-5 text-foreground" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{toolResult.result.workflow.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {toolResult.result.nodes?.length || 0} nodes
                      </p>
                      {toolResult.result.previewUrl && (
                        <Button asChild size="sm" variant="outline">
                          <Link href={toolResult.result.previewUrl}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open in Studio
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Agent Preview */}
              {toolResult.tool === 'create_agent' && toolResult.result.agent && (
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-background rounded-lg border border-border">
                    <div className="size-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <Sparkles className="size-5 text-foreground" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{toolResult.result.agent.name}</h4>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-muted">
                          {toolResult.result.agent.type}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-muted">
                          {toolResult.result.agent.status}
                        </span>
                      </div>
                      {toolResult.result.previewUrl && (
                        <Button asChild size="sm" variant="outline">
                          <Link href={toolResult.result.previewUrl}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Configure Agent
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Search Results */}
              {toolResult.tool === 'search_data' && toolResult.result.results && (
                <div className="space-y-2">
                  {toolResult.result.results.slice(0, 3).map((result: any, i: number) => (
                    <div key={i} className="p-2 bg-background rounded border border-border">
                      <p className="text-sm font-medium">{result.title}</p>
                      <p className="text-xs text-muted-foreground">{result.snippet}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Metrics Analysis */}
              {toolResult.tool === 'analyze_metrics' && toolResult.result.insights && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-background rounded border border-border">
                      <p className="text-xs text-muted-foreground">Value</p>
                      <p className="text-lg font-bold">{toolResult.result.value}</p>
                    </div>
                    <div className="p-2 bg-background rounded border border-border">
                      <p className="text-xs text-muted-foreground">Change</p>
                      <p className="text-lg font-bold text-muted-foreground">
                        {toolResult.result.change}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium mb-1">Key Insights:</p>
                    <ul className="text-sm space-y-1">
                      {toolResult.result.insights.map((insight: string, i: number) => (
                        <li key={i} className="text-muted-foreground">
                          • {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Metadata Row */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {/* Timestamp */}
          <span>
            {timestamp.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            })}
          </span>

          {/* Actions (visible on hover) */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Copy */}
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopy}>
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>

            {/* Regenerate (assistant only) */}
            {!isUser && onRegenerate && (
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onRegenerate}>
                <RotateCw className="h-3 w-3" />
              </Button>
            )}

            {/* Edit (user only) */}
            {isUser && onEdit && (
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onEdit}>
                <Edit className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Avatar (user) */}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <User className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
    </div>
  );
}
