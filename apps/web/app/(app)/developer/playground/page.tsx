"use client";

import React, { useState } from "react";
import { PageShell } from "@/components/templates/page-shell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Play, Copy } from "lucide-react";
import { toast } from "sonner";

export default function PlaygroundPage() {
  const [request, setRequest] = useState({
    method: "GET",
    endpoint: "/api/agents",
    headers:
      '{\n  "Authorization": "Bearer YOUR_API_KEY",\n  "Content-Type": "application/json"\n}',
    body: "",
  });

  const [response, setResponse] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecute = async () => {
    setIsExecuting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockResponse = {
      success: true,
      data: [
        {
          id: "agent_123",
          name: "Lead Generator",
          status: "active",
          created_at: "2025-10-15T10:30:00Z",
        },
      ],
      meta: {
        timestamp: new Date().toISOString(),
        count: 1,
      },
    };

    setResponse(JSON.stringify(mockResponse, null, 2));
    setIsExecuting(false);
  };

  const handleCopyResponse = () => {
    navigator.clipboard.writeText(response);
    toast.success("Response copied to clipboard");
  };

  return (
    <PageShell
      title="API Playground"
      subtitle="Test API endpoints interactively"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Playground" }]}
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
                    onValueChange={(value) =>
                      setRequest({ ...request, method: value })
                    }
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
                  <Label htmlFor="endpoint">Endpoint</Label>
                  <Select
                    value={request.endpoint}
                    onValueChange={(value) =>
                      setRequest({ ...request, endpoint: value })
                    }
                  >
                    <SelectTrigger id="endpoint">
                      <SelectValue placeholder="Select endpoint" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="/api/agents">
                        GET /api/agents
                      </SelectItem>
                      <SelectItem value="/api/agents/:id">
                        GET /api/agents/:id
                      </SelectItem>
                      <SelectItem value="/api/agents/create">
                        POST /api/agents
                      </SelectItem>
                      <SelectItem value="/api/executions">
                        GET /api/executions
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="headers">Headers (JSON)</Label>
                <Textarea
                  id="headers"
                  value={request.headers}
                  onChange={(e) =>
                    setRequest({ ...request, headers: e.target.value })
                  }
                  rows={5}
                  className="font-mono text-xs"
                />
              </div>

              {(request.method === "POST" || request.method === "PUT") && (
                <div className="space-y-2">
                  <Label htmlFor="body">Body (JSON)</Label>
                  <Textarea
                    id="body"
                    value={request.body}
                    onChange={(e) =>
                      setRequest({ ...request, body: e.target.value })
                    }
                    placeholder='{\n  "name": "New Agent",\n  "type": "lead-gen"\n}'
                    rows={6}
                    className="font-mono text-xs"
                  />
                </div>
              )}

              <Button
                className="w-full"
                onClick={handleExecute}
                disabled={isExecuting}
              >
                <Play className="mr-2 h-4 w-4" />
                {isExecuting ? "Executing..." : "Execute Request"}
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
              <p>• Replace :id with actual resource IDs</p>
              <p>• All requests require Authorization header</p>
              <p>• Use Content-Type: application/json for POST/PUT</p>
              <p>• Check console for detailed error messages</p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
