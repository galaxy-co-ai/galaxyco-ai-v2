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
import { Save, Play, ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function WorkflowEditPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id || "1";

  const [name, setName] = useState("Lead Enrichment Workflow");
  const [description, setDescription] = useState(
    "Automatically enrich new leads with data from multiple sources",
  );
  const [trigger, setTrigger] = useState("webhook");
  const [status, setStatus] = useState("active");

  const [steps, setSteps] = useState<
    Array<{
      id: string;
      name: string;
      type: string;
      config: Record<string, string>;
    }>
  >([
    {
      id: "1",
      name: "Fetch Company Data",
      type: "api_call",
      config: { endpoint: "clearbit.com/api" },
    },
    {
      id: "2",
      name: "Enrich Contact Info",
      type: "ai_agent",
      config: { agent: "enrichment-agent" },
    },
    {
      id: "3",
      name: "Update CRM",
      type: "api_call",
      config: { endpoint: "salesforce.com/api" },
    },
  ]);

  const addStep = () => {
    const newId = String(steps.length + 1);
    setSteps([
      ...steps,
      { id: newId, name: "New Step", type: "api_call", config: {} },
    ]);
    toast.success("Step added");
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter((s) => s.id !== id));
    toast.success("Step removed");
  };

  const handleSave = () => {
    toast.success("Workflow saved successfully");
  };

  const handleTest = () => {
    toast.info("Test run started");
  };

  return (
    <PageShell
      title={`Edit Workflow: ${name}`}
      subtitle="Configure workflow steps, triggers, and settings"
      breadcrumbs={[
        { label: "Workflows", href: "/workflows" },
        { label: name, href: `/workflows/${id}` },
        { label: "Edit" },
      ]}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleTest}>
            <Play className="mr-2 h-4 w-4" />
            Test Run
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Settings Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Settings</h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Workflow Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="trigger">Trigger</Label>
                <Select value={trigger} onValueChange={setTrigger}>
                  <SelectTrigger id="trigger">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="webhook">Webhook</SelectItem>
                    <SelectItem value="schedule">Schedule</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-2">Quick Stats</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Runs:</span>
                <span className="font-medium">1,247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Success Rate:</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  98.5%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Duration:</span>
                <span className="font-medium">2.3s</span>
              </div>
            </div>
          </div>
        </div>

        {/* Steps Panel */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Workflow Steps</h2>
              <Button size="sm" onClick={addStep}>
                <Plus className="mr-2 h-4 w-4" />
                Add Step
              </Button>
            </div>

            <div className="space-y-4">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className="rounded-lg border bg-background-subtle p-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <Label>Step Name</Label>
                          <Input value={step.name} placeholder="Step name" />
                        </div>
                        <div>
                          <Label>Type</Label>
                          <Select value={step.type}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="api_call">API Call</SelectItem>
                              <SelectItem value="ai_agent">AI Agent</SelectItem>
                              <SelectItem value="condition">
                                Condition
                              </SelectItem>
                              <SelectItem value="delay">Delay</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label>Configuration</Label>
                        <Textarea
                          value={JSON.stringify(step.config, null, 2)}
                          rows={2}
                          className="font-mono text-xs"
                        />
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeStep(step.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
