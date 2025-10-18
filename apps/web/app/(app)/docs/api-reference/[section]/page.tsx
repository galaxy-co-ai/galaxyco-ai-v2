"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { PageShell } from "@/components/templates/page-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, BookOpen, Link as LinkIcon, Shield } from "lucide-react";
import { toast } from "sonner";

const apiIndex: Record<
  string,
  {
    title: string;
    description: string;
    endpoints: Array<{
      method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
      path: string;
      summary: string;
      auth: boolean;
      params?: Array<{
        name: string;
        in: "query" | "path" | "body";
        required?: boolean;
        type: string;
        description?: string;
      }>;
      example: { curl: string; javascript: string; python: string };
    }>;
  }
> = {
  authentication: {
    title: "Authentication",
    description:
      "Use API keys to authenticate requests. Include the key in the Authorization header.",
    endpoints: [
      {
        method: "GET",
        path: "/v1/me",
        summary: "Get current API user",
        auth: true,
        example: {
          curl: `curl -s -H "Authorization: Bearer $API_KEY" https://api.galaxyco.ai/v1/me`,
          javascript: `const res = await fetch('https://api.galaxyco.ai/v1/me', { headers: { Authorization: 'Bearer ' + process.env.API_KEY } });\nconst json = await res.json();`,
          python: `import os, requests\nres = requests.get('https://api.galaxyco.ai/v1/me', headers={'Authorization': f"Bearer {os.environ['API_KEY']}"})\nprint(res.json())`,
        },
      },
    ],
  },
  agents: {
    title: "Agents",
    description: "Create and manage AI agents.",
    endpoints: [
      {
        method: "POST",
        path: "/v1/agents",
        summary: "Create an agent",
        auth: true,
        params: [
          {
            name: "name",
            in: "body",
            required: true,
            type: "string",
            description: "Agent display name",
          },
          {
            name: "trigger",
            in: "body",
            required: true,
            type: "string",
            description: "Event or schedule",
          },
        ],
        example: {
          curl: `curl -X POST https://api.galaxyco.ai/v1/agents \\\n  -H "Authorization: Bearer $API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{"name":"Prospect Scorer","trigger":"webhook"}'`,
          javascript: `await fetch('https://api.galaxyco.ai/v1/agents', { method: 'POST', headers: { Authorization: 'Bearer ' + process.env.API_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Prospect Scorer', trigger: 'webhook' }) });`,
          python: `import os, requests\nrequests.post('https://api.galaxyco.ai/v1/agents', headers={'Authorization': f"Bearer {os.environ['API_KEY']}"}, json={'name':'Prospect Scorer','trigger':'webhook'})`,
        },
      },
      {
        method: "GET",
        path: "/v1/agents",
        summary: "List agents",
        auth: true,
        example: {
          curl: `curl -s -H "Authorization: Bearer $API_KEY" https://api.galaxyco.ai/v1/agents`,
          javascript: `await fetch('https://api.galaxyco.ai/v1/agents', { headers: { Authorization: 'Bearer ' + process.env.API_KEY } })`,
          python: `import os, requests\nrequests.get('https://api.galaxyco.ai/v1/agents', headers={'Authorization': f"Bearer {os.environ['API_KEY']}"})`,
        },
      },
    ],
  },
};

export default function ApiReferenceSectionPage() {
  const params = useParams<{ section: string }>();
  const section = (params?.section || "authentication").toString();
  const [copied, setCopied] = useState<string | null>(null);

  const data = useMemo(
    () => apiIndex[section] || apiIndex["authentication"],
    [section],
  );

  const onCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(null), 1200);
    } catch (_) {
      toast.error("Copy failed");
    }
  };

  return (
    <PageShell
      title={data.title}
      subtitle={data.description}
      breadcrumbs={[
        { label: "Docs", href: "/docs" },
        { label: "API Reference", href: "/docs/api-reference" },
        { label: data.title },
      ]}
    >
      <div className="space-y-6">
        {data.endpoints.map((e, idx) => (
          <div key={idx} className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-3">
              <Badge variant="secondary">{e.method}</Badge>
              <code className="font-mono text-sm">{e.path}</code>
              {e.auth && (
                <span className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Shield className="h-3.5 w-3.5" /> Auth required
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{e.summary}</p>

            {e.params && e.params.length > 0 && (
              <div className="mt-4">
                <Label>Parameters</Label>
                <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                  {e.params.map((p) => (
                    <li
                      key={p.name}
                      className="rounded-md border bg-background/50 p-3 text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{p.in}</Badge>
                        <span className="font-mono">{p.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {p.type}
                        </span>
                        {p.required && (
                          <Badge className="ml-auto" variant="secondary">
                            required
                          </Badge>
                        )}
                      </div>
                      {p.description && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {p.description}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-4">
              <Label>Examples</Label>
              <Tabs defaultValue="curl" className="mt-2">
                <TabsList>
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                </TabsList>
                {(["curl", "javascript", "python"] as const).map((lang) => (
                  <TabsContent key={lang} value={lang}>
                    <div className="relative">
                      <pre className="mt-2 overflow-x-auto rounded-md bg-background-subtle p-4 text-xs leading-relaxed">
                        <code>{e.example[lang]}</code>
                      </pre>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute right-2 top-2"
                        onClick={() =>
                          onCopy(e.example[lang], `${idx}-${lang}`)
                        }
                      >
                        {copied === `${idx}-${lang}` ? (
                          <>
                            <Check className="mr-1 h-3.5 w-3.5" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="mr-1 h-3.5 w-3.5" /> Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        ))}

        <div className="rounded-lg border bg-card p-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>
              Looking for another section? Try agents, authentication, webhooks,
              or documents.
            </span>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
