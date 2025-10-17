"use client";

import { useState } from "react";
import { PageShell } from "@/components/templates/page-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Code, Copy, Lock, Search } from "lucide-react";
import { logger } from "@/lib/utils/logger";

const apiEndpoints = [
  {
    category: "Authentication",
    endpoints: [
      {
        method: "POST",
        path: "/api/auth/token",
        description: "Generate an API access token",
        authenticated: false,
      },
      {
        method: "POST",
        path: "/api/auth/refresh",
        description: "Refresh an expired token",
        authenticated: true,
      },
    ],
  },
  {
    category: "Agents",
    endpoints: [
      {
        method: "GET",
        path: "/api/agents",
        description: "List all agents in workspace",
        authenticated: true,
      },
      {
        method: "POST",
        path: "/api/agents",
        description: "Create a new agent",
        authenticated: true,
      },
      {
        method: "GET",
        path: "/api/agents/:id",
        description: "Get agent details",
        authenticated: true,
      },
      {
        method: "PATCH",
        path: "/api/agents/:id",
        description: "Update an agent",
        authenticated: true,
      },
      {
        method: "DELETE",
        path: "/api/agents/:id",
        description: "Delete an agent",
        authenticated: true,
      },
      {
        method: "POST",
        path: "/api/agents/:id/execute",
        description: "Execute an agent",
        authenticated: true,
      },
    ],
  },
  {
    category: "Workflows",
    endpoints: [
      {
        method: "GET",
        path: "/api/workflows",
        description: "List all workflows",
        authenticated: true,
      },
      {
        method: "POST",
        path: "/api/workflows",
        description: "Create a new workflow",
        authenticated: true,
      },
      {
        method: "GET",
        path: "/api/workflows/:id",
        description: "Get workflow details",
        authenticated: true,
      },
      {
        method: "PUT",
        path: "/api/workflows/:id",
        description: "Update a workflow",
        authenticated: true,
      },
      {
        method: "DELETE",
        path: "/api/workflows/:id",
        description: "Delete a workflow",
        authenticated: true,
      },
    ],
  },
  {
    category: "Knowledge",
    endpoints: [
      {
        method: "GET",
        path: "/api/knowledge",
        description: "List knowledge items",
        authenticated: true,
      },
      {
        method: "POST",
        path: "/api/knowledge/upload",
        description: "Upload documents to knowledge base",
        authenticated: true,
      },
      {
        method: "DELETE",
        path: "/api/knowledge/:id",
        description: "Delete a knowledge item",
        authenticated: true,
      },
      {
        method: "POST",
        path: "/api/knowledge/search",
        description: "Search knowledge base",
        authenticated: true,
      },
    ],
  },
  {
    category: "Analytics",
    endpoints: [
      {
        method: "GET",
        path: "/api/analytics/executions",
        description: "Get execution analytics",
        authenticated: true,
      },
      {
        method: "GET",
        path: "/api/analytics/agents/:id",
        description: "Get agent-specific analytics",
        authenticated: true,
      },
    ],
  },
];

const exampleCode = `// Authentication
const response = await fetch('https://api.galaxyco.ai/v1/auth/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    apiKey: 'your_api_key',
    workspaceId: 'workspace_id'
  })
});

const { accessToken } = await response.json();

// Create an agent
const agent = await fetch('https://api.galaxyco.ai/v1/agents', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${accessToken}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Sales Assistant',
    type: 'sales',
    settings: {
      model: 'gpt-4',
      temperature: 0.7
    }
  })
});

const agentData = await agent.json();
// Agent data is available in the 'agentData' variable
// Process the agent data as needed
`;

export default function ApiReferencePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEndpoints = apiEndpoints
    .map((category) => ({
      ...category,
      endpoints: category.endpoints.filter(
        (endpoint) =>
          searchQuery === "" ||
          endpoint.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
          endpoint.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          endpoint.method.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.endpoints.length > 0);

  const getMethodColor = (method: string) => {
    const colors = {
      GET: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      POST: "bg-green-500/10 text-green-500 border-green-500/20",
      PUT: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      PATCH: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      DELETE: "bg-red-500/10 text-red-500 border-red-500/20",
    };
    return colors[method as keyof typeof colors] || "bg-muted text-foreground";
  };

  return (
    <PageShell
      title="API Reference"
      subtitle="Complete REST API documentation"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Documentation", href: "/docs" },
        { label: "API Reference" },
      ]}
    >
      <div className="space-y-8">
        {/* API Info */}
        <Card className="p-6">
          <div className="mb-4">
            <h2 className="mb-2 text-xl font-semibold">Base URL</h2>
            <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
              <code className="flex-1 text-sm">https://api.galaxyco.ai/v1</code>
              <Button variant="ghost" size="sm">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Authentication</h3>
            <p className="text-sm text-muted-foreground">
              All API requests require authentication using Bearer tokens.
              Include your token in the Authorization header:
            </p>
            <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
              <code className="flex-1 text-sm">
                Authorization: Bearer YOUR_ACCESS_TOKEN
              </code>
              <Button variant="ghost" size="sm">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search endpoints..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Endpoints */}
        {filteredEndpoints.map((category) => (
          <Card key={category.category} className="p-6">
            <h2 className="mb-4 text-xl font-semibold">{category.category}</h2>
            <div className="space-y-3">
              {category.endpoints.map((endpoint, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-border p-4 transition-colors hover:border-primary/50 hover:bg-muted/50"
                >
                  <div className="mb-2 flex items-center gap-3">
                    <Badge
                      className={`border ${getMethodColor(endpoint.method)}`}
                      variant="outline"
                    >
                      {endpoint.method}
                    </Badge>
                    <code className="flex-1 text-sm font-mono">
                      {endpoint.path}
                    </code>
                    {endpoint.authenticated && (
                      <Badge variant="secondary" className="gap-1">
                        <Lock className="h-3 w-3" />
                        Auth Required
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {endpoint.description}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        ))}

        {filteredEndpoints.length === 0 && (
          <Card className="p-12 text-center">
            <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No endpoints found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search query
            </p>
          </Card>
        )}

        {/* Code Example */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Quick Start Example</h3>
            <Button variant="outline" size="sm">
              <Copy className="mr-2 h-4 w-4" />
              Copy Code
            </Button>
          </div>
          <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
            <code>{exampleCode}</code>
          </pre>
        </Card>

        {/* Rate Limits */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Rate Limits</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Requests per minute</span>
              <span className="font-semibold">60</span>
            </div>
            <div className="flex justify-between border-t border-border pt-3">
              <span className="text-muted-foreground">Requests per hour</span>
              <span className="font-semibold">1,000</span>
            </div>
            <div className="flex justify-between border-t border-border pt-3">
              <span className="text-muted-foreground">Concurrent requests</span>
              <span className="font-semibold">10</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Rate limit headers are included in all API responses. Contact
            support for higher limits.
          </p>
        </Card>

        {/* SDK Links */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Official SDKs</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg border border-border p-4">
              <Code className="h-8 w-8 text-primary" />
              <div>
                <p className="font-semibold">JavaScript / TypeScript</p>
                <code className="text-xs text-muted-foreground">
                  npm install @galaxyco/sdk
                </code>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border p-4">
              <Code className="h-8 w-8 text-primary" />
              <div>
                <p className="font-semibold">Python</p>
                <code className="text-xs text-muted-foreground">
                  pip install galaxyco
                </code>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
