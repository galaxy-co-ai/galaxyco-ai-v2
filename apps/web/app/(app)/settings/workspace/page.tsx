"use client";

import { useState } from "react";
import { FormPage } from "@/components/templates/form-page";
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
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Trash2, Upload } from "lucide-react";

export default function WorkspaceSettingsPage() {
  const [workspaceName, setWorkspaceName] = useState("GalaxyCo AI");
  const [workspaceSlug, setWorkspaceSlug] = useState("galaxyco-ai");
  const [description, setDescription] = useState(
    "AI-powered automation and workflow platform",
  );
  const [industry, setIndustry] = useState("technology");
  const [size, setSize] = useState("11-50");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const handleCancel = () => {
    setWorkspaceName("GalaxyCo AI");
    setWorkspaceSlug("galaxyco-ai");
    setDescription("AI-powered automation and workflow platform");
    setIndustry("technology");
    setSize("11-50");
  };

  return (
    <FormPage
      title="Workspace Settings"
      subtitle="Manage your workspace details and preferences"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Settings", href: "/settings" },
        { label: "Workspace" },
      ]}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
    >
      <div className="space-y-8">
        {/* Workspace Details */}
        <Card className="p-6">
          <h3 className="mb-6 text-lg font-semibold">Workspace Details</h3>
          <div className="space-y-6">
            {/* Workspace Name */}
            <div className="space-y-2">
              <Label htmlFor="workspace-name">Workspace Name</Label>
              <Input
                id="workspace-name"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                placeholder="Enter workspace name"
              />
            </div>

            {/* Workspace Slug */}
            <div className="space-y-2">
              <Label htmlFor="workspace-slug">Workspace URL</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  galaxyco.ai/
                </span>
                <Input
                  id="workspace-slug"
                  value={workspaceSlug}
                  onChange={(e) =>
                    setWorkspaceSlug(e.target.value.toLowerCase())
                  }
                  placeholder="workspace-slug"
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                This will be your workspace&apos;s public URL
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your workspace"
                rows={3}
              />
            </div>

            {/* Industry */}
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger id="industry">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Company Size */}
            <div className="space-y-2">
              <Label htmlFor="size">Company Size</Label>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger id="size">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10 employees</SelectItem>
                  <SelectItem value="11-50">11-50 employees</SelectItem>
                  <SelectItem value="51-200">51-200 employees</SelectItem>
                  <SelectItem value="201-500">201-500 employees</SelectItem>
                  <SelectItem value="501+">501+ employees</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Workspace Logo */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Workspace Logo</h3>
          <div className="flex items-start gap-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted">
              <span className="text-2xl font-bold text-muted-foreground">
                GC
              </span>
            </div>
            <div className="flex-1">
              <p className="mb-4 text-sm text-muted-foreground">
                Upload a logo for your workspace. Recommended size: 256x256px,
                PNG or JPG format.
              </p>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Upload Logo
              </Button>
            </div>
          </div>
        </Card>

        {/* Plan & Usage */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Plan & Usage</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Current Plan</p>
                <p className="text-sm text-muted-foreground">
                  Professional Plan
                </p>
              </div>
              <Badge>Active</Badge>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-4">
              <div>
                <p className="font-medium">Team Members</p>
                <p className="text-sm text-muted-foreground">5 of 10 seats</p>
              </div>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-4">
              <div>
                <p className="font-medium">Billing</p>
                <p className="text-sm text-muted-foreground">
                  View billing details and invoices
                </p>
              </div>
              <Button variant="outline" size="sm">
                View Billing
              </Button>
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50 p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-destructive">
            <AlertCircle className="h-5 w-5" />
            Danger Zone
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Delete Workspace</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete this workspace and all its data. This
                  action cannot be undone.
                </p>
              </div>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </FormPage>
  );
}
