/**
 * Dashboard Page - Figma Design
 * Complete rebuild to match Figma design exactly
 * Updated: November 5, 2025
 */

'use client';

import React, { useState } from 'react';
import {
  Bot,
  CheckCircle2,
  Clock,
  TrendingUp,
  Plus,
  BookOpen,
  Plug,
  MessageSquare,
  FileText,
  Code,
  Users,
  Video,
  Zap,
  GitBranch,
  Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  StatsPills,
  FloatingToolbar,
  AgentCard,
  ActivityTimeline,
  MetricsSummary,
} from '@/components/figma/dashboard';
import type { StatPill } from '@/components/figma/dashboard/StatsPills';
import type { ToolbarAction } from '@/components/figma/dashboard/FloatingToolbar';
import type { AgentCardProps } from '@/components/figma/dashboard/AgentCard';
import type { Activity } from '@/components/figma/dashboard/ActivityTimeline';
import type { MetricSummary } from '@/components/figma/dashboard/MetricsSummary';

export default function DashboardPage() {
  // Stats Pills Data (from your Figma design)
  const stats: StatPill[] = [
    {
      label: 'Active Agents',
      value: 12,
      icon: Bot,
      variant: 'blue',
    },
    {
      label: 'Tasks Completed',
      value: '1,247',
      icon: CheckCircle2,
      variant: 'green',
    },
    {
      label: 'Hours Saved',
      value: 342,
      icon: Clock,
      variant: 'purple',
    },
    {
      label: 'Success Rate',
      value: '98.5%',
      icon: TrendingUp,
      variant: 'orange',
    },
  ];

  // Floating Toolbar Actions
  const toolbarActions: ToolbarAction[] = [
    { icon: Plus, label: 'New Agent', onClick: () => {} },
    { icon: BookOpen, label: 'Documentation', onClick: () => {} },
    { icon: Plug, label: 'Integrations', onClick: () => {} },
    { icon: MessageSquare, label: 'Talk to AI Assistant', onClick: () => {} },
    { icon: FileText, label: 'Documents', onClick: () => {} },
    { icon: Code, label: 'Code Editor', onClick: () => {} },
    { icon: Users, label: 'Team', onClick: () => {} },
    { icon: Video, label: 'Video Call', onClick: () => {} },
  ];

  // Agent Cards Data
  const agents: Omit<AgentCardProps, 'className'>[] = [
    {
      name: 'Email Triage Agent',
      type: 'Email Automation',
      status: 'processing',
      tasksCompleted: 342,
      lastActive: '2 min ago',
    },
    {
      name: 'CRM Data Sync',
      type: 'CRM Integration',
      status: 'active',
      tasksCompleted: 156,
      lastActive: '5 min ago',
    },
    {
      name: 'Meeting Notes Generator',
      type: 'Document Generation',
      status: 'active',
      tasksCompleted: 89,
      lastActive: '12 min ago',
    },
    {
      name: 'Invoice Processor',
      type: 'Finance Automation',
      status: 'idle',
      tasksCompleted: 234,
      lastActive: '1 hour ago',
    },
  ];

  // Activity Timeline Data
  const activities: Activity[] = [
    {
      id: '1',
      description: 'Processed 12 high-priority emails',
      agent: 'Email Triage Agent',
      time: '2 min ago',
      status: 'success',
    },
    {
      id: '2',
      description: 'Qualified 3 new leads from website',
      agent: 'Lead Qualifier',
      time: '5 min ago',
      status: 'success',
    },
    {
      id: '3',
      description: 'Generated notes for TechCorp call',
      agent: 'Meeting Notes Generator',
      time: '15 min ago',
      status: 'success',
    },
    {
      id: '4',
      description: 'Synced 24 contacts to Salesforce',
      agent: 'CRM Data Sync',
      time: '30 min ago',
      status: 'success',
    },
    {
      id: '5',
      description: 'Updated 18 project statuses',
      agent: 'Project Tracker',
      time: '1 hour ago',
      status: 'success',
    },
  ];

  // Bottom Metrics Summary
  const metricsSummary: MetricSummary[] = [
    {
      icon: GitBranch,
      iconColor: 'text-purple-600',
      iconBgGradient: 'bg-gradient-to-br from-purple-500/10 to-purple-500/20',
      label: 'Active Workflows',
      value: 8,
      subtitle: 'Running across all your agents',
      onClick: () => {},
    },
    {
      icon: Zap,
      iconColor: 'text-purple-600',
      iconBgGradient: 'bg-gradient-to-br from-purple-500/10 to-purple-500/20',
      label: 'AI Automations',
      value: 24,
      subtitle: 'Smart tasks running automatically',
      onClick: () => {},
    },
    {
      icon: Plug,
      iconColor: 'text-green-600',
      iconBgGradient: 'bg-gradient-to-br from-green-500/10 to-green-500/20',
      label: 'Integrations',
      value: 12,
      subtitle: 'Connected tools and services',
      onClick: () => {},
    },
  ];

  const runningAgentsCount = agents.filter(
    (a) => a.status === 'active' || a.status === 'processing'
  ).length;

  return (
    <div className="space-y-8 pb-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your AI agents and workflows.
        </p>
      </div>

      {/* Stats Pills */}
      <StatsPills stats={stats} />

      {/* Floating Toolbar */}
      <div className="flex justify-center">
        <FloatingToolbar actions={toolbarActions} separatorAfter={3} />
      </div>

      {/* Main Content Grid - Agent Cards + Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Active Agents (2/3) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Active Agents</h2>
              <p className="text-sm text-muted-foreground">Your AI workforce in action</p>
            </div>
            <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
              {runningAgentsCount} Running
            </Badge>
          </div>

          {/* Agent Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agents.map((agent, index) => (
              <AgentCard key={index} {...agent} />
            ))}
          </div>
        </div>

        {/* Right: Activity Timeline (1/3) */}
        <div className="lg:col-span-1">
          <ActivityTimeline activities={activities} />
        </div>
      </div>

      {/* Bottom: Metrics Summary */}
      <MetricsSummary metrics={metricsSummary} />
    </div>
  );
}
