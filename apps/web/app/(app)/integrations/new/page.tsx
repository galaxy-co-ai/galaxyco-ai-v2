"use client";

import { PageShell } from "@/components/templates/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function NewIntegrationPage() {
  const [name, setName] = useState("");
  const [type, setType] = useState("webhook");
  const [endpoint, setEndpoint] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = () => {
    if (!name || !endpoint) {
      toast.error("Please fill in all required fields");
      return;
    }
    toast.success("Integration created successfully");
  };

  return (
    <PageShell
      title="New Integration"
      subtitle="Connect an external service or API"
      breadcrumbs={[
        { label: "Integrations", href: "/integrations" },
        { label: "New" },
      ]}
    >
      <div className="max-w-2xl">
        <div className="rounded-lg border bg-card p-6">
          <div className="space-y-6">
            <div>
              <Label htmlFor="name">
                Integration Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My CRM Integration"
              />
            </div>

            <div>
              <Label htmlFor="type">
                Type <span className="text-red-500">*</span>
              </Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="webhook">Webhook</SelectItem>
                  <SelectItem value="api">REST API</SelectItem>
                  <SelectItem value="oauth">OAuth</SelectItem>
                  <SelectItem value="database">Database</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="endpoint">
                Endpoint URL <span className="text-red-500">*</span>
              </Label>
              <Input
                id="endpoint"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                placeholder="https://api.example.com/endpoint"
              />
              <p className="text-xs text-muted-foreground mt-1">
                The URL where requests will be sent
              </p>
            </div>

            <div>
              <Label htmlFor="apiKey">API Key (Optional)</Label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter API key if required"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Describe what this integration does..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1">
                Test Connection
              </Button>
              <Button onClick={handleCreate} className="flex-1">
                <Save className="mr-2 h-4 w-4" />
                Create Integration
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-lg border bg-card p-6">
          <h3 className="font-semibold mb-3">Authentication Methods</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Webhook: Simple POST requests to the endpoint</p>
            <p>• REST API: Standard HTTP API with API key authentication</p>
            <p>• OAuth: OAuth 2.0 flow for secure authorization</p>
            <p>• Database: Direct database connection (PostgreSQL, MySQL)</p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
