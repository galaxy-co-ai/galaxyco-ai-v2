'use client';

import React, { useState } from 'react';
import { PageShell } from '@/components/templates/page-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, FileCode, Terminal } from 'lucide-react';

const apiEndpoints = [
  {
    category: 'Agents',
    endpoints: [
      { method: 'GET', path: '/api/agents', description: 'List all agents' },
      { method: 'POST', path: '/api/agents', description: 'Create new agent' },
      {
        method: 'GET',
        path: '/api/agents/:id',
        description: 'Get agent details',
      },
      { method: 'PUT', path: '/api/agents/:id', description: 'Update agent' },
      {
        method: 'DELETE',
        path: '/api/agents/:id',
        description: 'Delete agent',
      },
    ],
  },
  {
    category: 'Executions',
    endpoints: [
      {
        method: 'POST',
        path: '/api/agents/:id/execute',
        description: 'Execute agent',
      },
      {
        method: 'GET',
        path: '/api/executions',
        description: 'List executions',
      },
      {
        method: 'GET',
        path: '/api/executions/:id',
        description: 'Get execution details',
      },
    ],
  },
  {
    category: 'Documents',
    endpoints: [
      { method: 'GET', path: '/api/documents', description: 'List documents' },
      {
        method: 'POST',
        path: '/api/documents',
        description: 'Upload document',
      },
      {
        method: 'DELETE',
        path: '/api/documents/:id',
        description: 'Delete document',
      },
    ],
  },
];

const methodColors: Record<string, string> = {
  GET: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  POST: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  PUT: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  DELETE: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
};

export default function APIExplorerPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(apiEndpoints[0].endpoints[0]);

  return (
    <PageShell
      title="API Explorer"
      subtitle="Interactive API documentation"
      breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'API' }]}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Endpoint List */}
        <div className="space-y-4">
          {apiEndpoints.map((category) => (
            <div key={category.category} className="rounded-lg border border-border bg-card p-4">
              <h3 className="font-semibold mb-3">{category.category}</h3>
              <div className="space-y-2">
                {category.endpoints.map((endpoint, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedEndpoint(endpoint)}
                    className="w-full text-left rounded-lg border border-border bg-background p-3 text-sm transition-colors hover:bg-muted"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className={methodColors[endpoint.method]}>
                        {endpoint.method}
                      </Badge>
                      <code className="text-xs">{endpoint.path}</code>
                    </div>
                    <p className="text-xs text-muted-foreground">{endpoint.description}</p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Endpoint Details */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary" className={methodColors[selectedEndpoint.method]}>
                {selectedEndpoint.method}
              </Badge>
              <code className="text-sm font-mono">{selectedEndpoint.path}</code>
            </div>
            <p className="text-muted-foreground mb-6">{selectedEndpoint.description}</p>

            <Tabs defaultValue="curl" className="w-full">
              <TabsList>
                <TabsTrigger value="curl">
                  <Terminal className="mr-2 h-4 w-4" />
                  cURL
                </TabsTrigger>
                <TabsTrigger value="javascript">
                  <Code className="mr-2 h-4 w-4" />
                  JavaScript
                </TabsTrigger>
                <TabsTrigger value="python">
                  <FileCode className="mr-2 h-4 w-4" />
                  Python
                </TabsTrigger>
              </TabsList>

              <TabsContent value="curl" className="mt-4">
                <div className="rounded-lg bg-muted p-4">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`curl -X ${selectedEndpoint.method} \\
  https://api.galaxyco.ai${selectedEndpoint.path} \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="javascript" className="mt-4">
                <div className="rounded-lg bg-muted p-4">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`const response = await fetch('https://api.galaxyco.ai${selectedEndpoint.path}', {
  method: '${selectedEndpoint.method}',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});
const data = await response.json();`}</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="python" className="mt-4">
                <div className="rounded-lg bg-muted p-4">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`import requests

response = requests.${selectedEndpoint.method.toLowerCase()}(
    'https://api.galaxyco.ai${selectedEndpoint.path}',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    }
)
data = response.json()`}</code>
                  </pre>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-4">
              <Button>Try it out</Button>
            </div>
          </div>

          {/* Response Example */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-4">Response Example</h3>
            <div className="rounded-lg bg-muted p-4">
              <pre className="text-sm overflow-x-auto">
                <code>{`{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2025-10-18T15:56:00Z"
  }
}`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
