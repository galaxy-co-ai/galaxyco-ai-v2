"use client";

import { useParams } from "next/navigation";
import { PageShell } from "@/components/templates/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Play, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AgentEditPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id || "1";

  const [name, setName] = useState("Lead Scorer");
  const [description, setDescription] = useState(
    "AI agent that scores leads based on engagement and fit",
  );
  const [model, setModel] = useState("gpt-4");
  const [temperature, setTemperature] = useState("0.7");
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a lead scoring AI. Analyze the provided lead data and assign a score from 0-100 based on...",
  );

  const handleSave = () => {
    toast.success("Agent configuration saved");
  };

  const handleTest = () => {
    toast.info("Test run started");
  };

  return (
    <PageShell
      title={`Edit Agent: ${name}`}
      subtitle="Configure agent behavior, model settings, and training data"
      breadcrumbs={[
        { label: "Agents", href: "/agents" },
        { label: name, href: `/agents/${id}` },
        { label: "Edit" },
      ]}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleTest}>
            <Play className="mr-2 h-4 w-4" />
            Test Agent
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      }
    >
      <Tabs defaultValue="config" className="space-y-6">
        <TabsList>
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="prompt">Prompt</TabsTrigger>
          <TabsTrigger value="training">Training Data</TabsTrigger>
          <TabsTrigger value="tools">Tools & Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold mb-4">Basic Settings</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="agent-name">Agent Name</Label>
                  <Input
                    id="agent-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="agent-description">Description</Label>
                  <Textarea
                    id="agent-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="model">AI Model</Label>
                  <Select value={model} onValueChange={setModel}>
                    <SelectTrigger id="model">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4">GPT-4</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">
                        GPT-3.5 Turbo
                      </SelectItem>
                      <SelectItem value="claude-3-opus">
                        Claude 3 Opus
                      </SelectItem>
                      <SelectItem value="claude-3-sonnet">
                        Claude 3 Sonnet
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="temperature">
                    Temperature ({temperature})
                  </Label>
                  <input
                    id="temperature"
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Lower = more focused, Higher = more creative
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold mb-4">Performance</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-background-subtle">
                  <div>
                    <p className="font-medium">Total Runs</p>
                    <p className="text-2xl font-bold">3,421</p>
                  </div>
                  <Zap className="h-8 w-8 text-primary" />
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-background-subtle">
                  <div>
                    <p className="font-medium">Success Rate</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      97.8%
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-background-subtle">
                  <div>
                    <p className="font-medium">Avg Response Time</p>
                    <p className="text-2xl font-bold">1.2s</p>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-background-subtle">
                  <div>
                    <p className="font-medium">Cost (Last 30 Days)</p>
                    <p className="text-2xl font-bold">$42.50</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="prompt">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">System Prompt</h2>
            <div className="space-y-4">
              <Textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={12}
                className="font-mono text-sm"
              />
              <p className="text-sm text-muted-foreground">
                Define how the agent should behave and what its goals are. Be
                specific about the expected input and output format.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="training">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Training Examples</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Provide examples to help the agent learn your preferred behavior
            </p>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-lg border bg-background-subtle p-4"
                >
                  <Label>Example {i}</Label>
                  <Textarea
                    placeholder="Input → Output example"
                    rows={3}
                    className="mt-2"
                  />
                </div>
              ))}
              <Button variant="outline" className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Add Example
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tools">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">
              Available Tools & Actions
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                "Search Web",
                "Query Database",
                "Send Email",
                "Update CRM",
                "API Call",
                "File Upload",
              ].map((tool) => (
                <div
                  key={tool}
                  className="flex items-center gap-2 p-3 rounded-lg border bg-background-subtle"
                >
                  <input type="checkbox" id={tool} defaultChecked />
                  <Label htmlFor={tool} className="cursor-pointer">
                    {tool}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
