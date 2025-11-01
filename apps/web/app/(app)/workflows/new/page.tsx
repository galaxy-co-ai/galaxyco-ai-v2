import { Metadata } from 'next';
import { Save, Play, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'New Workflow | GalaxyCo.ai',
  description: 'Create a new automation workflow',
};

export default function NewWorkflowPage() {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/workflows">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-semibold">New Workflow</h1>
              <p className="text-sm text-foreground-muted">Create an automated workflow</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Play className="h-4 w-4 mr-2" />
              Test
            </Button>
            <Button size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save Workflow
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Workflow Details */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Workflow Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Workflow Name</label>
              <Input placeholder="e.g., Lead Nurturing Campaign" defaultValue="" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                className="w-full min-h-[100px] px-3 py-2 border border-border rounded-md bg-background resize-none"
                placeholder="Describe what this workflow does..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Trigger</label>
              <select className="w-full h-10 px-3 border border-border rounded-md bg-background">
                <option>Select a trigger...</option>
                <option>New Contact Added</option>
                <option>Email Opened</option>
                <option>Form Submitted</option>
                <option>Scheduled Time</option>
                <option>Webhook Received</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Workflow Steps */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Workflow Steps</h2>
            <Button variant="outline" size="sm">
              Add Step
            </Button>
          </div>

          {/* Step 1 - Trigger */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  1
                </div>
                <div className="w-0.5 h-full min-h-[60px] bg-border" />
              </div>
              <div className="flex-1 pb-6">
                <div className="p-4 border border-border rounded-lg bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Trigger</h3>
                    <span className="text-xs text-foreground-muted px-2 py-1 bg-background-subtle rounded">
                      Required
                    </span>
                  </div>
                  <p className="text-sm text-foreground-muted mb-3">This workflow starts when...</p>
                  <select className="w-full h-9 px-3 border border-border rounded-md bg-background text-sm">
                    <option>New Contact Added</option>
                    <option>Email Opened</option>
                    <option>Form Submitted</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 2 - Action */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 rounded-full bg-background-subtle text-foreground flex items-center justify-center font-semibold border-2 border-border">
                  2
                </div>
                <div className="w-0.5 h-full min-h-[60px] bg-border" />
              </div>
              <div className="flex-1 pb-6">
                <div className="p-4 border-2 border-dashed border-border rounded-lg bg-background-subtle/50">
                  <p className="text-sm text-foreground-muted text-center">
                    Click &quot;Add Step&quot; to continue building your workflow
                  </p>
                </div>
              </div>
            </div>

            {/* Add Step Button */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 rounded-full bg-background-subtle text-foreground flex items-center justify-center font-semibold border-2 border-dashed border-border">
                  +
                </div>
              </div>
              <div className="flex-1">
                <Button variant="outline" className="w-full">
                  Add Action Step
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Available Actions */}
        <Card className="p-6 mt-6">
          <h2 className="text-lg font-semibold mb-4">Available Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              'Send Email',
              'Add Tag',
              'Update Field',
              'Create Task',
              'Send Webhook',
              'Wait/Delay',
              'If/Then Branch',
              'Send SMS',
              'Create Note',
            ].map((action) => (
              <button
                key={action}
                className="p-3 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-sm font-medium text-left"
              >
                {action}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
