'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  Users,
  FileText,
  Mail,
  Bot,
  Clock,
  DollarSign,
  BookOpen,
  FileStack,
  GraduationCap,
  Building2,
  ExternalLink,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWorkspace } from '@/contexts/workspace-context';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';
import { DashboardStats } from '@/components/galaxy/DashboardStats';
import { AgentStatusCard } from '@/components/galaxy/AgentStatusCard';
import { ActivityFeed } from '@/components/galaxy/ActivityFeed';

interface DashboardStats {
  agents: {
    total: number;
    active: number;
  };
  customers: {
    total: number;
  };
  projects: {
    total: number;
  };
  revenue: {
    total: string;
  };
}

interface Agent {
  id: string;
  name: string;
  status: string;
}

export default function DashboardPage() {
  const { currentWorkspace } = useWorkspace();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!currentWorkspace?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Fetch agents
        const agentsRes = await fetch(`/api/agents?workspaceId=${currentWorkspace.id}&limit=5`);
        let agentsData = null;
        if (agentsRes.ok) {
          agentsData = await agentsRes.json();
          setAgents(agentsData.agents || []);
        }

        // Fetch sales analytics for revenue
        const salesRes = await fetch(
          `/api/analytics/sales?workspaceId=${currentWorkspace.id}&dateRange=30`,
        );
        let salesData = null;
        if (salesRes.ok) {
          salesData = await salesRes.json();
        }

        // Build stats object
        const dashStats: DashboardStats = {
          agents: {
            total: agentsData?.agents?.length || 0,
            active: agentsData?.agents?.filter((a: Agent) => a.status === 'active').length || 0,
          },
          customers: {
            total: salesData?.analytics?.customers?.total || 0,
          },
          projects: {
            total: salesData?.analytics?.projects?.total || 0,
          },
          revenue: {
            total: salesData?.analytics?.revenue?.total || '0',
          },
        };

        setStats(dashStats);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, [currentWorkspace?.id]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  // Active agents (up to 3)
  const activeAgentsList = agents.filter((a) => a.status === 'active').slice(0, 3);

  // Mock activity data (replace with real data later)
  const mockActivities = [
    {
      id: '1',
      agent: 'Email Triage Agent',
      action: 'Processed 12 high-priority emails',
      time: '2 min ago',
      status: 'success' as const,
    },
    {
      id: '2',
      agent: 'CRM Data Sync',
      action: 'Synced 24 contacts to Salesforce',
      time: '15 min ago',
      status: 'success' as const,
    },
    {
      id: '3',
      agent: 'Invoice Processor',
      action: 'Waiting for approval on invoice #1247',
      time: '1 hour ago',
      status: 'warning' as const,
    },
  ];

  const statsData = [
    {
      label: 'Active Agents',
      value: stats?.agents.active || 0,
      icon: Bot,
      variant: 'blue' as const,
    },
    {
      label: 'Tasks Completed',
      value: '1,247',
      icon: CheckCircle2,
      variant: 'green' as const,
    },
    {
      label: 'Hours Saved',
      value: '342',
      icon: Clock,
      variant: 'purple' as const,
    },
    {
      label: 'Success Rate',
      value: '98.5%',
      icon: TrendingUp,
      variant: 'orange' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Dashboard Header */}
        <div className="space-y-3">
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-lg lg:text-xl text-muted-foreground">
            Welcome back! Here&apos;s an overview of your AI agents and workflows.
          </p>
        </div>

        {/* Stats Pills - New Figma Design */}
        <DashboardStats stats={statsData} />

        {/* Active Agents Grid */}
        {activeAgentsList.length > 0 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Active Agents</h2>
              <p className="text-muted-foreground">Your AI workforce in action</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeAgentsList.map((agent) => (
                <AgentStatusCard
                  key={agent.id}
                  name={agent.name}
                  type="AI Agent"
                  status="active"
                  tasksCompleted={Math.floor(Math.random() * 500)}
                  lastActive="5 min ago"
                />
              ))}
            </div>
          </div>
        )}

        {/* Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActivityFeed activities={mockActivities} className="lg:col-span-1" />

          {/* Quick Actions - Keeping existing design */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Quick Actions</h2>
              <p className="text-muted-foreground">Common tasks and shortcuts</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <ActionCard
                icon={Bot}
                label="Create Agent"
                href="/agents/new"
                description="Build a new AI agent"
              />
              <ActionCard
                icon={Users}
                label="Add Customer"
                href="/customers"
                description="Create customer record"
              />
              <ActionCard
                icon={FileText}
                label="New Document"
                href="/documents"
                description="Upload or create document"
              />
            </div>
          </div>
        </div>

        {/* Resources Footer */}
        <DashboardFooter />
      </div>
    </div>
  );
}

interface ActionCardProps {
  icon: React.ElementType;
  label: string;
  href: string;
  description: string;
}

function ActionCard({ icon: Icon, label, href, description }: ActionCardProps) {
  return (
    <Link href={href}>
      <div className="p-6 rounded-xl bg-muted/30 hover:bg-primary/5 transition-all duration-300 hover:scale-[1.02] hover:shadow-md cursor-pointer group">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-background rounded-xl group-hover:bg-primary/10 transition-all duration-300">
            <Icon className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">{label}</h3>
            <p className="text-sm lg:text-base text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function DashboardFooter() {
  const resourceSections = [
    {
      title: 'Documentation',
      icon: BookOpen,
      description: 'Guides and references',
      links: [
        { label: 'Getting Started', href: '/docs/getting-started' },
        { label: 'API Reference', href: '/docs/api' },
        { label: 'Integration Guides', href: '/docs/integrations' },
        { label: 'Best Practices', href: '/docs/best-practices' },
      ],
    },
    {
      title: 'Templates',
      icon: FileStack,
      description: 'Ready-to-use resources',
      links: [
        { label: 'Workflow Templates', href: '/templates/workflows' },
        { label: 'Document Templates', href: '/templates/documents' },
        { label: 'Agent Blueprints', href: '/templates/agents' },
        { label: 'Email Templates', href: '/templates/emails' },
      ],
    },
    {
      title: 'AI University',
      icon: GraduationCap,
      description: 'Learn and master AI',
      links: [
        { label: 'Platform Courses', href: '/university/courses' },
        { label: 'Certifications', href: '/university/certifications' },
        { label: 'Video Tutorials', href: '/university/tutorials' },
        { label: 'Webinars', href: '/university/webinars' },
      ],
    },
    {
      title: 'Company',
      icon: Building2,
      description: 'About GalaxyCo.ai',
      links: [
        {
          label: 'Blog & Updates',
          href: 'https://galaxyco.ai/blog',
          external: true,
        },
        { label: 'Support Center', href: '/support' },
        {
          label: 'System Status',
          href: 'https://status.galaxyco.ai',
          external: true,
        },
        { label: 'Contact Us', href: '/contact' },
      ],
    },
  ];

  return (
    <div className="space-y-10 pt-12 border-t mt-16">
      <div className="space-y-3">
        <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">Resources</h2>
        <p className="text-lg text-muted-foreground">
          Essential tools and guides for power users and executives
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {resourceSections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="flex flex-col space-y-4">
              {/* Section Header */}
              <div className="flex items-center gap-3">
                <Icon className="w-6 h-6 text-foreground" />
                <h3 className="font-bold text-lg">{section.title}</h3>
              </div>

              <p className="text-base text-muted-foreground">{section.description}</p>

              {/* Links */}
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className="text-sm lg:text-base text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group"
                    >
                      <span>{link.label}</span>
                      {link.external && (
                        <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
