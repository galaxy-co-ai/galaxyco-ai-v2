'use client';

import { PageShell } from '@/components/templates/page-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Send, Clock, CheckCircle2, XCircle, Copy } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const samplePayloads = {
  'agent.completed': {
    event: 'agent.completed',
    data: {
      agentId: 'agent_abc123',
      executionId: 'exec_xyz789',
      status: 'success',
      output: 'Task completed successfully',
      duration: 2345,
      timestamp: new Date().toISOString(),
    },
  },
  'document.uploaded': {
    event: 'document.uploaded',
    data: {
      documentId: 'doc_def456',
      name: 'proposal.pdf',
      size: 1048576,
      mimeType: 'application/pdf',
      uploadedBy: 'user_ghi789',
      timestamp: new Date().toISOString(),
    },
  },
  'workflow.started': {
    event: 'workflow.started',
    data: {
      workflowId: 'wf_jkl012',
      trigger: 'manual',
      initiatedBy: 'user_mno345',
      timestamp: new Date().toISOString(),
    },
  },
};

export default function WebhookTestPage() {
  const [url, setUrl] = useState('https://your-server.com/webhook');
  const [selectedEvent, setSelectedEvent] = useState('agent.completed');
  const [payload, setPayload] = useState(
    JSON.stringify(samplePayloads['agent.completed'], null, 2),
  );
  const [response, setResponse] = useState<{
    status: number;
    statusText: string;
    body: string;
    headers: Record<string, string>;
    duration: number;
  } | null>(null);
  const [isSending, setIsSending] = useState(false);

  const handleEventChange = (event: string) => {
    setSelectedEvent(event);
    setPayload(JSON.stringify(samplePayloads[event as keyof typeof samplePayloads], null, 2));
  };

  const handleSend = async () => {
    setIsSending(true);
    setResponse(null);

    try {
      const startTime = Date.now();

      // Simulate webhook call (replace with actual fetch in production)
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const duration = Date.now() - startTime;

      // Mock response
      setResponse({
        status: 200,
        statusText: 'OK',
        body: JSON.stringify(
          {
            received: true,
            eventId: 'evt_' + Math.random().toString(36).substr(2, 9),
            processedAt: new Date().toISOString(),
          },
          null,
          2,
        ),
        headers: {
          'content-type': 'application/json',
          'x-webhook-id': 'wh_' + Math.random().toString(36).substr(2, 9),
        },
        duration,
      });

      toast.success('Webhook test sent successfully');
    } catch (error) {
      toast.error('Failed to send webhook');
      setResponse({
        status: 500,
        statusText: 'Internal Server Error',
        body: JSON.stringify({ error: 'Connection failed' }),
        headers: {},
        duration: 0,
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <PageShell
      title="Test Webhooks"
      subtitle="Send test webhooks to verify your endpoint configuration"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Webhooks', href: '/webhooks' },
        { label: 'Test' },
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Request Panel */}
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Configure Test Request</h2>

            {/* Webhook URL */}
            <div className="space-y-2 mb-4">
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <Input
                id="webhook-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-server.com/webhook"
              />
              <p className="text-xs text-muted-foreground">
                The endpoint that will receive the test webhook
              </p>
            </div>

            {/* Event Type */}
            <div className="space-y-2 mb-4">
              <Label htmlFor="event-type">Event Type</Label>
              <Select value={selectedEvent} onValueChange={handleEventChange}>
                <SelectTrigger id="event-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(samplePayloads).map((event) => (
                    <SelectItem key={event} value={event}>
                      {event}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Payload */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="payload">Payload (JSON)</Label>
                <Button size="sm" variant="ghost" onClick={() => handleCopy(payload)}>
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </div>
              <Textarea
                id="payload"
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
                rows={12}
                className="font-mono text-sm"
              />
            </div>

            {/* Send Button */}
            <Button className="w-full" onClick={handleSend} disabled={isSending || !url}>
              {isSending ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Test Webhook
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Response Panel */}
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Response</h2>

            {!response && !isSending && (
              <div className="text-center py-12 text-muted-foreground">
                <Send className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Send a test webhook to see the response here</p>
              </div>
            )}

            {isSending && (
              <div className="text-center py-12">
                <Clock className="mx-auto h-12 w-12 mb-4 animate-spin text-primary" />
                <p className="text-muted-foreground">Sending request...</p>
              </div>
            )}

            {response && (
              <div className="space-y-4">
                {/* Status */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-background-subtle">
                  <div className="flex items-center gap-2">
                    {response.status === 200 ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    )}
                    <span className="font-semibold">
                      {response.status} {response.statusText}
                    </span>
                  </div>
                  <Badge variant="secondary">{response.duration}ms</Badge>
                </div>

                {/* Headers */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Response Headers</Label>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy(JSON.stringify(response.headers, null, 2))}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="rounded-lg bg-background-subtle p-4 font-mono text-xs space-y-1">
                    {Object.entries(response.headers).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-muted-foreground">{key}:</span> {value}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Body */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Response Body</Label>
                    <Button size="sm" variant="ghost" onClick={() => handleCopy(response.body)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <Textarea
                    value={response.body}
                    readOnly
                    rows={10}
                    className="font-mono text-sm bg-background-subtle"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950 p-4">
            <h3 className="font-semibold mb-2">Testing Tips</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Webhooks include a signature in the X-Webhook-Signature header</li>
              <li>• Your endpoint should respond within 5 seconds</li>
              <li>• Return a 2xx status code to acknowledge receipt</li>
              <li>• Failed deliveries will be retried up to 3 times</li>
            </ul>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
