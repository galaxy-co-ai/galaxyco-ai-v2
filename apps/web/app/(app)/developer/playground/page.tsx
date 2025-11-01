'use client';

import React, { useState } from 'react';
import { PageShell } from '@/components/templates/page-shell';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Play, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useWorkspace } from '@/contexts/workspace-context';

export default function PlaygroundPage() {
  const { currentWorkspace } = useWorkspace();
  const [request, setRequest] = useState({
    method: 'GET',
    resource: '/api/agents',
    validateOnly: false,
  });

  const [response, setResponse] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecute = async () => {
    if (!currentWorkspace) {
      toast.error('No workspace selected');
      return;
    }

    setIsExecuting(true);
    setResponse('');

    try {
      const res = await fetch('/api/playground', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workspaceId: currentWorkspace.id,
          resource: request.resource,
          method: request.method,
          validateOnly: request.validateOnly,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to execute request');
      }

      setResponse(JSON.stringify(data, null, 2));
      toast.success('Request executed successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to execute request';
      toast.error(errorMessage);
      setResponse(
        JSON.stringify(
          {
            error: errorMessage,
            timestamp: new Date().toISOString(),
          },
          null,
          2,
        ),
      );
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCopyResponse = () => {
    navigator.clipboard.writeText(response);
    toast.success('Response copied to clipboard');
  };

  return (
    <PageShell
      title="API Playground"
      subtitle="Test API endpoints interactively"
      breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Playground' }]}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Request Builder */}
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Request</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="method">Method</Label>
                  <Select
                    value={request.method}
                    onValueChange={(value) => setRequest({ ...request, method: value })}
                  >
                    <SelectTrigger id="method">
                      <SelectValue placeholder="Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="resource">Resource</Label>
                  <Select
                    value={request.resource}
                    onValueChange={(value) => setRequest({ ...request, resource: value })}
                  >
                    <SelectTrigger id="resource">
                      <SelectValue placeholder="Select resource" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="/api/agents">Agents</SelectItem>
                      <SelectItem value="/api/executions">Executions</SelectItem>
                      <SelectItem value="/api/documents">Documents</SelectItem>
                      <SelectItem value="/api/contacts">Contacts</SelectItem>
                      <SelectItem value="/api/campaigns">Campaigns</SelectItem>
                      <SelectItem value="/api/webhooks">Webhooks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="validateOnly"
                    checked={request.validateOnly}
                    onChange={(e) => setRequest({ ...request, validateOnly: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="validateOnly" className="cursor-pointer">
                    Validate only (don&apos;t execute)
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Test permissions and schema without actually executing the request
                </p>
              </div>

              <Button className="w-full" onClick={handleExecute} disabled={isExecuting}>
                <Play className="mr-2 h-4 w-4" />
                {isExecuting ? 'Executing...' : 'Execute Request'}
              </Button>
            </div>
          </div>
        </div>

        {/* Response Viewer */}
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Response</h3>
              {response && (
                <Button variant="ghost" size="sm" onClick={handleCopyResponse}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
              )}
            </div>

            {response ? (
              <div className="rounded-lg bg-muted p-4">
                <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                  <code>{response}</code>
                </pre>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                Response will appear here after execution
              </div>
            )}
          </div>

          {/* Quick Reference */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h4 className="font-semibold mb-3">Quick Reference</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Validates authentication and workspace membership</p>
              <p>• Checks rate limits and permissions</p>
              <p>• Use &quot;Validate only&quot; to test without executing</p>
              <p>• Returns mock data in sandbox mode</p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
