import { Metadata } from "next";
import {
  Key,
  Plus,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  Calendar,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "API Keys | GalaxyCo.ai",
  description: "Manage your API keys and access tokens",
};

// Mock API keys
const apiKeys = [
  {
    id: "1",
    name: "Production API Key",
    key: "gxy_live_•••••••••••••••••••••••1234",
    created: "2025-09-15",
    lastUsed: "2 hours ago",
    permissions: ["read", "write"],
    status: "active",
  },
  {
    id: "2",
    name: "Development Key",
    key: "gxy_test_•••••••••••••••••••••••5678",
    created: "2025-10-01",
    lastUsed: "5 days ago",
    permissions: ["read"],
    status: "active",
  },
  {
    id: "3",
    name: "CI/CD Pipeline",
    key: "gxy_live_•••••••••••••••••••••••9012",
    created: "2025-08-20",
    lastUsed: "1 hour ago",
    permissions: ["read", "write", "delete"],
    status: "active",
  },
];

export default function APIKeysPage() {
  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">API Keys</h1>
        <p className="text-foreground-muted">
          Manage API keys to access GalaxyCo.ai programmatically
        </p>
      </div>

      {/* Security Notice */}
      <Card className="p-4 mb-6 border-warning bg-warning/5">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-warning shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm mb-1">
              Keep your API keys secure
            </p>
            <p className="text-sm text-foreground-muted">
              Never share your API keys publicly or commit them to version
              control. Anyone with your API key can access your account.
            </p>
          </div>
        </div>
      </Card>

      {/* Create New Key */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold mb-1">Create New API Key</h2>
            <p className="text-sm text-foreground-muted">
              Generate a new key for programmatic access
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Key
          </Button>
        </div>
      </Card>

      {/* Existing Keys */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your API Keys</h2>
          <span className="text-sm text-foreground-muted">
            {apiKeys.length} keys
          </span>
        </div>

        {apiKeys.map((apiKey) => (
          <Card key={apiKey.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Key className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{apiKey.name}</h3>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        apiKey.status === "active" ? "default" : "secondary"
                      }
                      size="sm"
                    >
                      {apiKey.status}
                    </Badge>
                    {apiKey.permissions.map((permission) => (
                      <Badge key={permission} variant="outline" size="sm">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>

            {/* API Key */}
            <div className="mb-4 p-3 bg-background-subtle rounded-lg border border-border">
              <div className="flex items-center justify-between">
                <code className="text-sm font-mono">{apiKey.key}</code>
                <div className="flex items-center gap-2">
                  <button
                    className="p-2 hover:bg-background rounded-md transition-colors"
                    aria-label="Show API key"
                  >
                    <Eye className="h-4 w-4 text-foreground-muted" />
                  </button>
                  <button
                    className="p-2 hover:bg-background rounded-md transition-colors"
                    aria-label="Copy API key"
                  >
                    <Copy className="h-4 w-4 text-foreground-muted" />
                  </button>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-6 text-sm text-foreground-muted">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Created {apiKey.created}</span>
              </div>
              <div>Last used: {apiKey.lastUsed}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Documentation */}
      <Card className="p-6 mt-6">
        <h3 className="font-semibold mb-3">API Documentation</h3>
        <p className="text-sm text-foreground-muted mb-4">
          Learn how to use API keys to authenticate requests to the GalaxyCo.ai
          API.
        </p>
        <div className="space-y-3">
          <a
            href="/docs/api-reference"
            className="flex items-center justify-between p-3 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <span className="text-sm font-medium">API Reference</span>
            <span className="text-xs text-foreground-muted">→</span>
          </a>
          <a
            href="/docs/getting-started"
            className="flex items-center justify-between p-3 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <span className="text-sm font-medium">Authentication Guide</span>
            <span className="text-xs text-foreground-muted">→</span>
          </a>
        </div>
      </Card>
    </div>
  );
}
