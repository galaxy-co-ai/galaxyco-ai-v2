/**
 * Studio Page - Figma Design
 * Complete rebuild to match Figma design exactly
 * Updated: November 5, 2025
 */

'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Workflow } from 'lucide-react';
import { ChatPanel, WorkflowCanvas } from '@/components/figma/studio';

export default function StudioPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Studio</h1>
        <p className="text-muted-foreground">
          Create and manage your AI agents using workflows or conversational AI
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="assistant" className="w-full">
        <div className="flex justify-center mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="assistant" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              AI Assistant
            </TabsTrigger>
            <TabsTrigger value="workflow" className="gap-2">
              <Workflow className="h-4 w-4" />
              Workflow Builder
            </TabsTrigger>
          </TabsList>
        </div>

        {/* AI Assistant Tab */}
        <TabsContent value="assistant" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat Panel - Left (1/3) */}
            <div className="lg:col-span-1">
              <ChatPanel />
            </div>

            {/* Workflow Canvas - Right (2/3) */}
            <div className="lg:col-span-2">
              <WorkflowCanvas />
            </div>
          </div>
        </TabsContent>

        {/* Workflow Builder Tab */}
        <TabsContent value="workflow" className="mt-0">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Workflow Builder</h2>
              <p className="text-sm text-muted-foreground">
                Visually design your agent workflows and connections
              </p>
            </div>
            <WorkflowCanvas />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
