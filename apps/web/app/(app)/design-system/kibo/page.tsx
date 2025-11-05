/**
 * Kibo UI Components Showcase
 *
 * Demonstrates integrated Kibo UI components
 */

'use client';

import React from 'react';
import { AgentCardKibo } from '@/components/figma/shared/AgentCardKibo';
import { CreditCard } from '@/src/components/kibo-ui/credit-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const sampleAgents = [
  {
    id: '1',
    name: 'Sales Outreach Agent',
    description:
      'Automatically research leads, craft personalized emails, and schedule follow-ups.',
    icon: '📧',
    status: 'active' as const,
    type: 'sales',
    stats: {
      successRate: 94.5,
      usageCount: 247,
      timeSaved: '12h',
    },
    integrations: ['Gmail', 'Salesforce', 'LinkedIn'],
  },
  {
    id: '2',
    name: 'Customer Support Agent',
    description: 'Answer customer questions, categorize tickets, and escalate complex issues.',
    icon: '🎧',
    status: 'active' as const,
    type: 'support',
    stats: {
      successRate: 98.2,
      usageCount: 892,
      timeSaved: '45h',
    },
    integrations: ['Zendesk', 'Slack', 'Intercom'],
  },
  {
    id: '3',
    name: 'Market Research Agent',
    description: 'Monitor competitors, track trends, and generate weekly market insights.',
    icon: '📊',
    status: 'draft' as const,
    type: 'research',
    stats: {
      successRate: 0,
      usageCount: 0,
    },
    integrations: ['Google News', 'Twitter'],
  },
];

export default function KiboUIShowcasePage() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Kibo UI Integration</h1>
        <p className="text-muted-foreground">
          Advanced components from Kibo UI (1,101 patterns) integrated with GalaxyCo design system
        </p>
      </div>

      {/* Agent Cards with Kibo UI */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Agent Cards (Kibo UI Credit Card)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleAgents.map((agent) => (
            <AgentCardKibo
              key={agent.id}
              agent={agent}
              onView={(a) => alert(`Viewing: ${a.name}`)}
              onConfigure={(a) => alert(`Configuring: ${a.name}`)}
            />
          ))}
        </div>
      </section>

      {/* Kibo UI Spinner */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Loading States (Kibo UI Spinner)</h2>
        <Card className="p-6">
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <span className="text-sm text-muted-foreground">Default Spinner</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
              <span className="text-sm text-muted-foreground">Success</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
              <span className="text-sm text-muted-foreground">Warning</span>
            </div>
          </div>
        </Card>
      </section>

      {/* Component Stats */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Integration Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Kibo UI Components</div>
            <div className="text-3xl font-bold mb-2">41</div>
            <div className="text-xs text-muted-foreground">Available via MCP</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Integrated</div>
            <div className="text-3xl font-bold mb-2">2</div>
            <div className="text-xs text-muted-foreground">credit-card, spinner</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Enhanced Components</div>
            <div className="text-3xl font-bold mb-2">1</div>
            <div className="text-xs text-muted-foreground">AgentCardKibo</div>
          </Card>
        </div>
      </section>

      {/* Available Components */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Available Kibo UI Components</h2>
        <Card className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              'announcement',
              'avatar-stack',
              'banner',
              'calendar',
              'choicebox',
              'code-block',
              'color-picker',
              'combobox',
              'comparison',
              'contribution-graph',
              'credit-card ✅',
              'cursor',
              'deck',
              'dialog-stack',
              'dropzone',
              'editor',
              'gantt',
              'glimpse',
              'image-crop',
              'image-zoom',
              'kanban',
              'list',
              'marquee',
              'mini-calendar',
              'patterns',
              'pill',
              'qr-code',
              'rating',
              'reel',
              'relative-time',
              'sandbox',
              'snippet',
              'spinner ✅',
              'status',
              'stories',
              'table',
              'tags',
              'theme-switcher',
              'ticker',
              'tree',
              'typography',
              'video-player',
            ].map((component) => (
              <div
                key={component}
                className={cn(
                  'px-3 py-2 rounded-lg border text-sm text-center',
                  component.includes('✅')
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 font-medium'
                    : 'bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400',
                )}
              >
                {component}
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
        <Card className="p-6">
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-green-500">✅</span>
              <span>Installed credit-card and spinner components</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✅</span>
              <span>Created enhanced AgentCardKibo component</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✅</span>
              <span>Set up Kibo UI MCP server</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500">⏳</span>
              <span>Add more components: status, ticker, editor, kanban</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500">⏳</span>
              <span>Replace existing agent cards with AgentCardKibo</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500">⏳</span>
              <span>Create Kibo UI wrappers for common patterns</span>
            </li>
          </ul>
        </Card>
      </section>
    </div>
  );
}
